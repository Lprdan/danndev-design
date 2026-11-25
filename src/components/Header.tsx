import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import GooeyNav from './GooeyNav';
import CtaButton from './CtaButton';
import { gsap, ScrollTrigger, reducedMotion, scrollToHash, getLenis, refreshSoon } from '../lib/motion';
import { wa } from '../lib/site';
import { isPreloading, whenRevealed } from '../lib/preload';

const ITEMS = [
  { label: 'Início', href: '#top' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Trabalhos', href: '#trabalhos' },
  { label: 'Processo', href: '#processo' },
  { label: 'Dúvidas', href: '#duvidas' }
];

const SMALL_SIZE = 30;

const readNavH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;

function pillDrift(nav: HTMLElement | null) {
  if (!nav) return 0;
  const stage = nav.querySelector('.gooey-nav__stage');
  const overlay = nav.querySelector<HTMLElement>('.gooey-nav__list--active');
  const item = nav.querySelector('.gooey-nav__list:not(.gooey-nav__list--active) [data-active]');
  const clip = overlay?.style.clipPath ?? '';

  if (!stage || !item || !(stage as HTMLElement).offsetWidth) return 0;

  if (!clip.includes('A')) return -1;
  const xs = [...clip.matchAll(/[MH]\s*(-?[\d.]+)/g)].map(m => Number(m[1]));
  if (!xs.length) return 0;
  const pill = (Math.min(...xs) + Math.max(...xs)) / 2;
  const s = (stage as HTMLElement).getBoundingClientRect();
  const r = item.getBoundingClientRect();
  return Math.abs(r.left + r.width / 2 - s.left - pill);
}

export default function Header({ ready = true }: { ready?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const wmRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuShown, setMenuShown] = useState(false);
  const pendingHash = useRef<string | null>(null);
  const [navKey, setNavKey] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const wm = wmRef.current;
    if (!root || !wm) return;

    const fit = () => {
      const wrap = wm.parentElement as HTMLElement;
      const cs = getComputedStyle(wrap);
      const avail = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);

      wm.style.fontSize = '100px';
      const w = wm.offsetWidth;
      if (!w || !avail) return lastSize;
      lastSize = Math.max(16, Math.floor((100 * avail) / w));
      wm.style.fontSize = `${lastSize}px`;
      document.documentElement.style.setProperty('--wm-h', `${wm.offsetHeight}px`);
      const copy = document.querySelector<HTMLElement>('.hero__copy');
      if (copy) document.documentElement.style.setProperty('--copy-h', `${copy.offsetHeight}px`);
      return lastSize;
    };
    let lastSize = 100;

    let big = fit();
    let offReveal = () => {};
    const ctx: gsap.Context = gsap.context(() => {

      const chars = wm.querySelectorAll('.hd__ch');
      if (!reducedMotion()) {
        const fadeRow = (delay: number) =>

          gsap.from('.hd__row > *', { opacity: 0, duration: 1.1, ease: 'power2.out', stagger: 0.1, delay });
        if (isPreloading()) {

          void chars;
          offReveal = whenRevealed(() => ctx.add(() => fadeRow(0.2)));
        } else {
          gsap.from(chars, { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.055, delay: 0.15 });
          fadeRow(0.7);
        }
      }

      const navH = readNavH;
      gsap.to(wm, {
        scale: () => SMALL_SIZE / big,
        y: () => {
          const smallH = wm.offsetHeight * (SMALL_SIZE / big);

          const top = (wm.parentElement as HTMLElement).offsetTop;
          return (navH() - smallH) / 2 - top;
        },
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: () => window.innerHeight * 0.55,
          scrub: reducedMotion() ? true : 0.6,
          invalidateOnRefresh: true,
          onUpdate: self => root.classList.toggle('is-compact', self.progress > 0.92)
        }
      });
    }, root);

    const onResize = () => {
      big = fit();
      refreshSoon();
    };
    let t = 0;
    const debounced = () => {
      clearTimeout(t);
      t = window.setTimeout(onResize, 120);
    };
    window.addEventListener('resize', debounced);
    const copyEl = document.querySelector<HTMLElement>('.hero__copy');
    const copyRo = copyEl ? new ResizeObserver(() => { fit(); refreshSoon(); }) : null;
    if (copyEl) copyRo?.observe(copyEl);
    document.fonts?.ready.then(onResize);
    return () => {
      window.removeEventListener('resize', debounced);
      copyRo?.disconnect();
      offReveal();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const close = document.querySelector('.close');
    if (!ready || !root || !close) return;
    const st = ScrollTrigger.create({
      trigger: close,
      start: () => `top ${readNavH() / 2}px`,
      end: () => `bottom ${readNavH() / 2}px`,
      invalidateOnRefresh: true,

      refreshPriority: -1,
      onToggle: self => root.classList.toggle('is-on-cyan', self.isActive)
    });
    return () => {
      st.kill();
      root.classList.remove('is-on-cyan');
    };
  }, [ready]);

  useEffect(() => {
    const update = () => {
      const els = ITEMS.map(item => document.querySelector<HTMLElement>(item.href));
      const line = window.innerHeight * 0.45;
      let idx = 0;
      els.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      setActive(idx);
    };
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: update });
    update();
    return () => st.kill();
  }, []);

  useEffect(() => {
    let t = 0;
    const check = (tries = 0) => {
      clearTimeout(t);
      t = window.setTimeout(() => {
        const drift = pillDrift(navRef.current);

        if (drift === -1 && tries < 2) return check(tries + 1);
        if (drift === -1 || drift > 3) setNavKey(k => k + 1);
      }, 1200);
    };
    const onEvent = () => check();
    ScrollTrigger.addEventListener('refresh', onEvent);
    ScrollTrigger.addEventListener('scrollEnd', onEvent);
    return () => {
      clearTimeout(t);
      ScrollTrigger.removeEventListener('refresh', onEvent);
      ScrollTrigger.removeEventListener('scrollEnd', onEvent);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const onChange = () => {
      if (!mq.matches) return;
      pendingHash.current = null;
      setMenuOpen(false);
      setMenuMounted(false);
      document.body.style.overflow = '';
      getLenis()?.start();
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) lenis?.stop();
    else if (!menuMounted) lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) { setMenuShown(false); return; }
    if (!menuMounted) return;

    void document.getElementById('menu')?.offsetWidth;
    const t = window.setTimeout(() => setMenuShown(true), 30);
    return () => clearTimeout(t);
  }, [menuOpen, menuMounted]);

  useEffect(() => {
    if (menuOpen) { pendingHash.current = null; setMenuMounted(true); return; }
    if (!menuMounted) return;
    const t = window.setTimeout(() => {
      setMenuMounted(false);

      getLenis()?.start();
      const h = pendingHash.current;
      pendingHash.current = null;
      if (h) requestAnimationFrame(() => scrollToHash(h));
    }, reducedMotion() ? 0 : 420);
    return () => clearTimeout(t);
  }, [menuOpen, menuMounted]);

  const onNavClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a');
    const href = a?.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      if (menuOpen) {
        pendingHash.current = href;
        setMenuOpen(false);
      } else {
        scrollToHash(href);
      }
    }
  };

  return (
    <header ref={rootRef} className="hd" data-menu={menuOpen ? 'open' : menuMounted ? 'closing' : undefined} onClickCapture={onNavClick}>
      <div className="hd__bar" aria-hidden="true" />
      <div className="wrap hd__row">
        <span className="hd__slot" aria-hidden="true" />
        <div ref={navRef} className="hd__nav">
          <GooeyNav
            key={navKey}
            items={ITEMS}
            activeIndex={active}
            label="Principal"
            theme="dark"
            color="#2ef2e6"
            activeTextColor="#032a28"
            colors={['#2ef2e6', '#9ffaf4', '#eef3f2']}
            size="md"
            gooeyness={0.6}
            style={
              {
                '--gn-frame': 'var(--hd-frame)',
                '--gn-frame-shadow': 'none',
                '--gn-muted': 'rgba(238, 243, 242, 0.72)'
              } as React.CSSProperties
            }
          />
        </div>
        <CtaButton className="hd__cta" size="sm">Chamar no WhatsApp</CtaButton>
        <button
          type="button"
          className="hd__menu"
          aria-expanded={menuOpen}
          aria-controls="menu"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span className="hd__burger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div className="wrap hd__wm-wrap">
        <a ref={wmRef} href="#top" className="hd__wm" aria-label="danndev, voltar ao início">
          {'danndev'.split('').map((c, i) => (
            <span className="hd__mask" key={i} aria-hidden="true">
              <span className="hd__ch">{c}</span>
            </span>
          ))}
        </a>
      </div>

      <div id="menu" className="menu" data-open={menuShown} hidden={!menuMounted} inert={!menuOpen}>
        <ul>
          {ITEMS.map((item, i) => (
            <li key={item.href} style={{ '--i': i } as React.CSSProperties}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <CtaButton className="menu__cta cta--block" size="lg">Chamar no WhatsApp</CtaButton>
      </div>
    </header>
  );
}

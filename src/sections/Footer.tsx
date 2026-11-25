import { useLayoutEffect, useRef } from 'react';
import { gsap, reducedMotion, scrollToHash, ScrollTrigger, useGsap, refreshSoon } from '../lib/motion';
import { NAV, SERVICES, wa } from '../lib/site';

const WORD = 'danndev';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const wmRef = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();

  useLayoutEffect(() => {
    const wm = wmRef.current;
    const box = wm?.parentElement;
    if (!wm || !box) return;
    const fit = () => {
      const cs = getComputedStyle(box);
      const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      wm.style.fontSize = '100px';
      const w = wm.scrollWidth;
      if (!w) return;
      wm.style.fontSize = `${Math.floor((100 * avail) / w * 100) / 100}px`;
    };
    fit();
    const ro = new ResizeObserver(() => {
      fit();
      refreshSoon();
    });
    ro.observe(box);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  useGsap(ref, () => {
    if (reducedMotion()) return;

    const wmEl = ref.current?.querySelector<HTMLElement>('.ft__wm');
    const natural = () => (wmEl ? wmEl.getBoundingClientRect().bottom + window.scrollY - window.innerHeight : 0);
    const begin = () => (wmEl ? wmEl.getBoundingClientRect().top + window.scrollY - window.innerHeight : 0);
    const finish = () => Math.max(begin() + 1, Math.min(natural(), ScrollTrigger.maxScroll(window)));
    for (const layer of ['.ft__wm-base span', '.ft__wm-lit span']) {
      gsap.fromTo(layer, { yPercent: 60 }, {
        yPercent: 0,
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: { trigger: '.ft__wm', start: () => begin(), end: () => finish(), scrub: 1, invalidateOnRefresh: true, refreshPriority: -2 }
      });
    }
  });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const wm = wmRef.current;
    if (!wm) return;
    const r = wm.getBoundingClientRect();
    wm.style.setProperty('--lx', `${e.clientX - r.left}px`);
    wm.style.setProperty('--ly', `${e.clientY - r.top}px`);
  };

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToHash(href);
  };

  const letters = WORD.split('').map((c, i) => <span key={i}>{c}</span>);

  return (
    <footer ref={ref} className="ft" onPointerMove={onMove}>
      <div className="wrap">
        <div className="ft__cols">
          <nav aria-label="Rodapé" className="ft__col">
            <h2>Navegar</h2>
            <ul>
              {NAV.map(n => (
                <li key={n.href}><a className="link" href={n.href} onClick={e => go(e, n.href)}>{n.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="ft__col">
            <h2>Serviços</h2>
            <ul>
              {SERVICES.map(s => (
                <li key={s.id}>
                  <a className="link" href={wa(`Olá! Quero saber mais sobre: ${s.name}.`)} target="_blank" rel="noopener">{s.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ft__base">
          <span>© {year} danndev</span>
          <a className="link" href="#top" onClick={e => go(e, '#top')}>Voltar ao topo</a>
        </div>
      </div>

      <div className="wrap ft__wm-box">
        <div ref={wmRef} className="ft__wm" aria-hidden="true">
          <div className="ft__wm-base">{letters}</div>
          <div className="ft__wm-lit">{letters}</div>
        </div>
      </div>
    </footer>
  );
}

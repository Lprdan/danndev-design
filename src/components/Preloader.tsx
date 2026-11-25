import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, getLenis } from '../lib/motion';
import { reveal } from '../lib/preload';

const START_SCALE_VW = 0.3;
const MAX_STEP_MS = 5000;
const MAX_TOTAL_MS = 6000;
const MIN_SHOW_MS = 600;
const SPEED = 120;
const HOLD_AT = 67;
const HOLD_MS = 120;

const withTimeout = (p: Promise<unknown>, ms = MAX_STEP_MS) =>
  new Promise<void>(resolve => {
    const t = window.setTimeout(resolve, ms);
    p.then(
      () => { clearTimeout(t); resolve(); },
      () => { clearTimeout(t); resolve(); }
    );
  });

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const wmRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  const place = (scaleOnly = false) => {
    const wm = wmRef.current;
    const pct = pctRef.current;
    const target = document.querySelector<HTMLElement>('header .hd__wm');
    if (!wm || !pct || !target) return false;
    const r = target.getBoundingClientRect();
    if (!r.width) return false;
    if (!scaleOnly) {
      wm.style.fontSize = getComputedStyle(target).fontSize;
      wm.style.left = `${r.left}px`;
      wm.style.top = `${r.top}px`;
    }
    const s = Math.min(1, (window.innerWidth * START_SCALE_VW) / r.width);
    const x = window.innerWidth / 2 - (r.width * s) / 2 - r.left;
    const y = window.innerHeight / 2 - (r.height * s) / 2 - r.top - 14;
    gsap.set(wm, { x, y, scale: s, transformOrigin: '0 0' });
    pct.style.top = `${window.innerHeight / 2 + (r.height * s) / 2 - 4}px`;
    return true;
  };

  useLayoutEffect(() => {
    if (wmRef.current) wmRef.current.style.opacity = '0';
    place();

  }, []);

  useEffect(() => {
    const started = performance.now();
    const counter = { v: 0 };
    const pct = pctRef.current!;
    const num = numRef.current!;
    let doneSteps = 0;
    let real = 0;
    let holdUntil = 0;
    let holdOver = false;
    let exited = false;
    let dead = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };
    const steps: Promise<void>[] = [];
    const total = 4;

    const paint = () => { num.textContent = String(Math.round(counter.v)); };
    paint();

    const tick = (_t: number, dt: number) => {
      if (dead || exited) return;
      const now = performance.now();
      if (!holdOver && holdUntil && now >= holdUntil) holdOver = true;
      const cap = holdOver ? 100 : HOLD_AT;
      const target = Math.min(real, cap);
      if (counter.v < target) {
        counter.v = Math.min(target, counter.v + SPEED * (dt / 1000));
        paint();
        if (!holdUntil && counter.v >= HOLD_AT) holdUntil = now + HOLD_MS;
      }
      if (counter.v >= 100) tryExit();
    };
    gsap.ticker.add(tick);

    const finishStep = () => {
      if (dead) return;
      doneSteps += 1;
      real = (doneSteps / total) * 100;
    };
    const track = (p: Promise<unknown>) => steps.push(withTimeout(p).then(finishStep));

    const fontP = document.fonts
      ? document.fonts.load("800 100px 'Archivo Variable'", 'danndev0123456789%').then(() => document.fonts.ready)
      : Promise.resolve();
    track(fontP);

    track(
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise(res => window.addEventListener('load', res, { once: true }))
    );

    track(import('./rb/bg/SilkOriginal'));

    track(
      Promise.all([
        fontP,
        new Promise(res => window.setTimeout(res, 250))
      ])
    );

    withTimeout(fontP).then(() => {
      if (dead) return;
      later(() => {
        place();
        gsap.to(wmRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      }, 220);
    });

    const hardStop = window.setTimeout(() => {

      real = 100;
      holdOver = true;
      counter.v = Math.max(counter.v, 90);
    }, MAX_TOTAL_MS);

    function tryExit() {
      if (exited || dead) return;
      const wait = MIN_SHOW_MS - (performance.now() - started);
      if (wait > 0) { later(tryExit, wait); return; }
      exited = true;
      clearTimeout(hardStop);
      gsap.ticker.remove(tick);
      exit();
    }

    function exit() {
      const wm = wmRef.current!;
      const target = document.querySelector<HTMLElement>('header .hd__wm');

      if (target) {
        const r0 = wm.getBoundingClientRect();
        const r = target.getBoundingClientRect();
        wm.style.fontSize = getComputedStyle(target).fontSize;
        wm.style.left = `${r.left}px`;
        wm.style.top = `${r.top}px`;
        const nr = wm.getBoundingClientRect();
        gsap.set(wm, { x: `+=${r0.left - nr.left}`, y: `+=${r0.top - nr.top}` });
      }
      gsap.set(wm, { opacity: 1 });
      const tl = gsap.timeline({
        onComplete: () => {
          reveal();
          getLenis()?.start();
          setGone(true);
        }
      });
      tl.to(pct, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 0)
        .to(bgRef.current, { yPercent: -100, duration: 1.1, ease: 'power3.inOut' }, 0.25)
        .to(wm, { x: 0, y: 0, scale: 1, duration: 1.1, ease: 'power3.inOut' }, 0.25);
    }

    return () => {
      dead = true;
      gsap.ticker.remove(tick);
      clearTimeout(hardStop);
      timers.forEach(clearTimeout);
      gsap.killTweensOf([counter, wmRef.current, bgRef.current, pct]);
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={rootRef} className="pre" role="status" aria-label="Carregando">
      <div ref={bgRef} className="pre__bg" />
      <div ref={wmRef} className="hd__wm pre__wm" aria-hidden="true">
        {'danndev'.split('').map((c, i) => (
          <span className="hd__mask" key={i}>
            <span className="hd__ch">{c}</span>
          </span>
        ))}
      </div>
      <div ref={pctRef} className="pre__pct" aria-hidden="true">
        <span ref={numRef}>0</span>
        <span className="pre__sign">%</span>
      </div>
    </div>
  );
}

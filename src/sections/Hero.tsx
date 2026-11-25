import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { gsap, reducedMotion } from '../lib/motion';
import { whenRevealed } from '../lib/preload';

const SilkOriginal = lazy(() => import('../components/rb/bg/SilkOriginal'));

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 760px)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion()) return;
    const tween = { current: null as gsap.core.Tween | null };
    const off = whenRevealed(() => {
      tween.current = gsap.from('.hero__sub', { opacity: 0, y: 14, duration: 1.1, delay: 0.35, ease: 'expo.out' });
    });
    return () => {
      off();
      tween.current?.kill();
      gsap.set('.hero__sub', { clearProps: 'opacity,transform' });
    };
  }, []);

  return (
    <section id="top" ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero__basin" aria-hidden="true">
        <Suspense fallback={null}>
          <SilkOriginal color="#1a6b70" speed={9} noiseIntensity={1.2} dpr={mobile ? 1.25 : 1.75} />
        </Suspense>
        <div className="hero__scrim" />
      </div>

      <div className="wrap hero__inner">
        <div className="hero__copy">
          <h1 id="hero-title" className="sr-only">danndev: criação de sites e landing pages</h1>
          <p className="hero__sub">
            o desenvolvedor perfeito<br className="hero__br" /> para tirar suas ideias do papel
          </p>
        </div>
      </div>
    </section>
  );
}

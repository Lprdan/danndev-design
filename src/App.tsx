import { lazy, Suspense, useEffect, useState } from 'react';
import Header from './components/Header';
import Preloader from './components/Preloader';
import Hero from './sections/Hero';
import { getLenis, refreshSoon, startSmoothScroll } from './lib/motion';
import { isPreloading, whenRevealed } from './lib/preload';

const Below = lazy(() => import('./Below'));
const Footer = lazy(() => import('./sections/Footer'));

export default function App() {
  const [showPreloader] = useState(() => isPreloading());
  const [ready, setReady] = useState(() => !isPreloading());
  useEffect(() => whenRevealed(() => setReady(true)), []);

  useEffect(() => {
    startSmoothScroll();
    if (isPreloading()) getLenis()?.stop();

    const onOver = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('.btn');
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', `${e.clientX - r.left}px`);
      b.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointerover', onOver);
    return () => document.removeEventListener('pointerover', onOver);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => refreshSoon(), 600);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      {showPreloader && <Preloader />}
      <Header ready={ready} />
      <main id="conteudo">
        <Hero />
        {ready && (
          <Suspense fallback={null}>
            <Below />
          </Suspense>
        )}
      </main>
      {ready && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </>
  );
}

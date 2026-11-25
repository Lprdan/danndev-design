import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useLayoutEffect, type RefObject, type DependencyList } from 'react';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };


let refreshTimer = 0;
export function refreshSoon(delay = 120) {
  clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), delay);
}

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function startSmoothScroll() {
  if (reducedMotion() || lenis) return;
  lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  if (import.meta.env.DEV) (window as unknown as { __lenis: Lenis }).__lenis = lenis;
  gsap.ticker.add(time => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
  else (el as HTMLElement).scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
  history.replaceState(null, '', hash);
}


export function useGsap(ref: RefObject<HTMLElement | null>, fn: (ctx: gsap.Context) => void, deps: DependencyList = []) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(self => fn(self), ref.current);
    return () => ctx.revert();

  }, deps);
}

import { useLayoutEffect, useRef } from 'react';
import CtaButton from '../components/CtaButton';
import { gsap, reducedMotion, ScrollTrigger, useGsap, refreshSoon } from '../lib/motion';


export default function Close() {
  const ref = useRef<HTMLElement>(null);


  useLayoutEffect(() => {
    const title = ref.current?.querySelector<HTMLElement>('.close__title');
    const box = title?.parentElement;
    if (!title || !box) return;
    const lines = [...title.querySelectorAll<HTMLElement>('.close__line')];
    const fit = () => {
      const cs = getComputedStyle(box);
      const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      title.style.fontSize = '100px';
      lines.forEach(l => (l.style.whiteSpace = 'nowrap'));
      const widest = Math.max(...lines.map(l => l.scrollWidth));
      if (!widest || !avail) return;
      const size = Math.min(Math.floor((100 * avail) / widest), 150);
      title.style.fontSize = `${Math.max(size, 14)}px`;
    };
    fit();
    const ro = new ResizeObserver(() => { fit(); refreshSoon(); });
    ro.observe(box);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  useGsap(ref, () => {
    if (reducedMotion()) return;
    gsap.fromTo(
      '.close__field',
      { clipPath: 'circle(6% at 50% 100%)' },
      {
        clipPath: 'circle(150% at 50% 100%)',
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'top 15%', scrub: 0.8 }
      }
    );
    gsap.from('.close__line', {
      yPercent: 60,
      opacity: 0,
      ease: 'none',
      stagger: 0.25,
      scrollTrigger: { trigger: ref.current, start: 'top 65%', end: 'top 30%', scrub: 0.8 }
    });
    gsap.from('.close__btn', {
      y: 24,
      opacity: 0,
      ease: 'none',
      stagger: 0.2,
      scrollTrigger: { trigger: ref.current, start: 'top 45%', end: 'top 20%', scrub: 0.8 }
    });
  });

  return (
    <section ref={ref} className="close" aria-labelledby="close-title">
      <div className="close__field">
        <div className="wrap close__inner">
          <h2 id="close-title" className="close__title">
            <span className="close__line">seu negócio merece mais</span>{' '}
            <span className="close__line close__line--em">mais que o básico</span>
          </h2>
          <CtaButton tone="ink" size="lg" className="close__btn cta--block">Entrar em contato</CtaButton>
        </div>
      </div>
    </section>
  );
}

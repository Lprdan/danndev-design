import { useEffect, useRef } from 'react';
import { getLenis, gsap, reducedMotion, useGsap } from '../lib/motion';


function useLandOnHash(id: string) {
  useEffect(() => {
    if (location.hash !== `#${id}`) return;
    const go = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
      else window.scrollTo(0, el.getBoundingClientRect().top + scrollY);
    };
    const raf = requestAnimationFrame(go);
    const t1 = window.setTimeout(go, 250);
    const t2 = window.setTimeout(go, 800);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [id]);
}

export default function Work() {
  const ref = useRef<HTMLElement>(null);
  useLandOnHash('trabalhos');

  useGsap(ref, () => {
    if (reducedMotion()) return;

    gsap.from('.work__item', {
      y: 48,
      opacity: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.12,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.work__grid', start: 'top 85%', once: true }
    });
  });

  return (
    <section id="trabalhos" ref={ref} className="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="work__head">
          <h2 id="work-title">Projetos reais</h2>
        </div>

        <ul className="work__grid">
          {[0, 1, 2].map(i => (
            <li key={i} className="work__item" data-i={i}>
              <div className="wcard wcard--empty">
                <span className="wcard__shot">
                  <span className="wcard__placeholder">coloque seus projetos aqui</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

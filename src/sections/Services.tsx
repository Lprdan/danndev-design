import { useEffect, useRef, useState } from 'react';
import ServiceVisual from '../components/ServiceVisuals';
import CtaButton from '../components/CtaButton';
import { gsap, ScrollTrigger, getLenis, reducedMotion, useGsap } from '../lib/motion';
import { SERVICES } from '../lib/site';

const STEP_VH = 85;

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [idx, setIdx] = useState(0);

  useGsap(ref, () => {
    {
      const n = SERVICES.length;
      const st = ScrollTrigger.create({
        trigger: '.svc__stage',
        start: 'top top',
        end: () => `+=${(n - 1) * (window.innerHeight * STEP_VH) / 100}`,
        pin: true,
        scrub: true,
        snap: reducedMotion() ? undefined : { snapTo: 1 / (n - 1), directional: false, duration: { min: 0.25, max: 0.6 }, ease: 'power2.inOut', delay: 0.08 },
        onUpdate: self => {
          const i = Math.round(self.progress * (n - 1));
          setIdx(prev => (prev === i ? prev : i));
        }
      });
      stRef.current = st;
    }
    return () => {
      stRef.current?.kill();
      stRef.current = null;
    };
  });

  useEffect(() => {
    const go = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const i = SERVICES.findIndex(s => s.id === id);
      const st = stRef.current;
      const lenis = getLenis();
      if (st && i >= 0) {
        const y = st.start + ((st.end - st.start) * i) / (SERVICES.length - 1) + 2;
        lenis ? lenis.scrollTo(y, { duration: 1.4 }) : window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('svc:go', go);
    return () => window.removeEventListener('svc:go', go);
  }, []);

  const s = SERVICES[idx];

  return (
    <section id="servicos" ref={ref} className="svc" aria-labelledby="svc-title">
      <div className="svc__stage">
        <div className="wrap svc__grid">
          <div className="svc__left">
            <h2 id="svc-title" className="svc__title">Serviços</h2>
            <ol className="svc__list">
              {SERVICES.map((it, i) => (
                <li key={it.id} data-on={i === idx}>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('svc:go', { detail: it.id }))}
                    aria-current={i === idx ? 'true' : undefined}
                  >
                    <span className="svc__drop" aria-hidden="true" />
                    {it.short}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="svc__right">
            <div className="svc__head-m">
              <p className="svc__eyebrow" aria-hidden="true">Serviços</p>
              <div className="svc__names">
                {SERVICES.map((it, i) => (
                  <h3 key={it.id} className="svc__name" data-on={i === idx} aria-hidden={i !== idx}>{it.name}</h3>
                ))}
              </div>
              <div className="svc__dots" aria-hidden="true">
                {SERVICES.map((it, i) => (
                  <span key={it.id} data-on={i === idx} />
                ))}
              </div>
            </div>
            <div className="svc__visuals" aria-hidden="true">
              {SERVICES.map((it, i) => (
                <div key={it.id} className="svc__visual" data-on={i === idx}>
                  <ServiceVisual kind={it.visual} />
                </div>
              ))}
            </div>
            <div className="svc__detail" aria-live="polite">
              <div className="svc__texts">
                {SERVICES.map((it, i) => (
                  <p key={it.id} className="svc__text" data-on={i === idx}>{it.text}</p>
                ))}
              </div>
              <CtaButton key={s.id} size="md" className="svc__cta" message={s.message}>{s.cta}</CtaButton>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

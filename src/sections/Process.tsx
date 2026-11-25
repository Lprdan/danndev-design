import { useRef } from 'react';
import { gsap, reducedMotion, useGsap } from '../lib/motion';
import { STEPS } from '../lib/site';

export default function Process() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, () => {
    if (reducedMotion()) {
      gsap.set('.pr__step', { '--on': 1 });
      return;
    }
    const steps = gsap.utils.toArray<HTMLElement>('.pr__step');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.pr__rail', start: 'top 75%', end: 'bottom 40%', scrub: 0.8 }
    });
    tl.fromTo('.pr__line-fill', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: steps.length });
    steps.forEach((s, i) => {
      tl.fromTo(s, { '--on': 0 }, { '--on': 1, duration: 0.35, ease: 'power2.out' }, i + 0.05);
    });
  });

  return (
    <section id="processo" ref={ref} className="pr" aria-labelledby="pr-title">
      <div className="wrap">
        <div className="pr__head">
          <h2 id="pr-title">Como o site é feito</h2>
          <p>Quatro etapas, do primeiro contato à publicação.</p>
        </div>
        <ol className="pr__rail">
          <span className="pr__line" aria-hidden="true"><span className="pr__line-fill" /></span>
          {STEPS.map((s, i) => (
            <li key={s.title} className="pr__step">
              <span className="pr__node" aria-hidden="true" />
              <span className="pr__n" aria-hidden="true">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

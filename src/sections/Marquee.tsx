import { Fragment } from 'react';
import ScrollVelocity from '../components/rb/ScrollVelocity';
import { SERVICES } from '../lib/site';

const Star = () => (
  <svg className="mq__star" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <path d="M16 0C17.2 9.6 22.4 14.8 32 16 22.4 17.2 17.2 22.4 16 32 14.8 22.4 9.6 17.2 0 16 9.6 14.8 14.8 9.6 16 0Z" />
  </svg>
);

const row = (words: string[]) => (
  <>
    {words.map(w => (
      <Fragment key={w}>
        <span className="mq__word">{w}</span>
        <Star />
      </Fragment>
    ))}
  </>
);

export default function Marquee() {
  const names = SERVICES.map(s => s.name);
  const rotated = [...names.slice(2), ...names.slice(0, 2)];

  return (
    <section className="mq" aria-label="Serviços">
      <p className="sr-only">{names.join(', ')}.</p>
      <div className="mq__rows" aria-hidden="true">
        <ScrollVelocity
          texts={[row(names), row(rotated)]}
          velocity={56}
          numCopies={4}
          damping={50}
          stiffness={400}
          velocityMapping={{ input: [0, 1000], output: [0, 4] }}
          skewWithVelocity={7}
          outlineAlternate
          fadeEdges
          parallaxClassName="mq__track"
          scrollerClassName="mq__scroller"
          className="mq__copy"
        />
      </div>
    </section>
  );
}

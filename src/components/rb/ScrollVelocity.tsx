import React, { useEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../../lib/motion';
import './ScrollVelocity.css';

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface ScrollVelocityProps {
  texts: React.ReactNode[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  fadeEdges?: boolean;
  skewWithVelocity?: number;
  outlineAlternate?: boolean;
}

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const FADE_STEPS = Array.from({ length: 9 }, (_, i) => i / 8);
const FADE_MASK = `linear-gradient(to right, ${[
  ...FADE_STEPS.map(t => `rgba(0, 0, 0, ${smootherstep(t).toFixed(3)}) ${(t * 12).toFixed(1)}%`),
  ...FADE_STEPS.map(t => `rgba(0, 0, 0, ${smootherstep(1 - t).toFixed(3)}) ${(88 + t * 12).toFixed(1)}%`)
].join(', ')})`;

const OUTLINE_STYLE: React.CSSProperties = {
  WebkitTextFillColor: 'transparent',
  WebkitTextStroke: 'max(1px, 0.028em) currentColor'
};

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts = [],
  velocity = 100,
  className = '',
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = 'parallax',
  scrollerClassName = 'scroller',
  fadeEdges = false,
  skewWithVelocity = 0,
  outlineAlternate = false
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion()) return;
    const scrollers = Array.from(root.querySelectorAll<HTMLElement>('[data-sv]'));
    const widths = scrollers.map(() => 0);
    const state = scrollers.map(() => ({ x: 0, dir: 1, skew: 0 }));

    const measure = () => scrollers.forEach((s, i) => (widths[i] = (s.firstElementChild as HTMLElement)?.offsetWidth ?? 0));
    measure();
    const ro = new ResizeObserver(measure);
    scrollers.forEach(s => s.firstElementChild && ro.observe(s.firstElementChild));

    let lastY = window.scrollY;
    let smooth = 0;
    let springV = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; lastY = window.scrollY; }, { rootMargin: '200px' });
    io.observe(root);

    const [inA, inB] = velocityMapping.input;
    const [outA, outB] = velocityMapping.output;

    const tick = (_: number, deltaMs: number) => {
      if (!visible) return;
      const dt = Math.min(deltaMs, 64) / 1000;
      if (!dt) return;
      const y = window.scrollY;
      const raw = (y - lastY) / dt;
      lastY = y;

      const force = stiffness * (raw - smooth) - damping * springV;
      springV += force * dt;
      smooth += springV * dt;
      const factor = outA + ((smooth - inA) / (inB - inA)) * (outB - outA);
      const surge = Math.tanh(Math.abs(smooth) / 1600);

      scrollers.forEach((s, i) => {
        const st = state[i];
        const base = i % 2 !== 0 ? -velocity : velocity;
        if (factor < 0) st.dir = -1;
        else if (factor > 0) st.dir = 1;
        let move = st.dir * base * dt;
        move += st.dir * move * factor;
        st.x += move;
        const w = widths[i];
        const wrapped = w ? ((((st.x + w) % w) + w) % w) - w : 0;
        const heading = Math.sign(move) || st.dir * Math.sign(base);
        const ease = 1 - Math.exp(-deltaMs / 110);
        st.skew += (-heading * skewWithVelocity * surge - st.skew) * ease;
        s.style.transform = `translate3d(${wrapped.toFixed(2)}px,0,0) skewX(${st.skew.toFixed(3)}deg)`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
    };
  }, [velocity, damping, stiffness, velocityMapping, skewWithVelocity]);

  return (
    <div
      ref={rootRef}
      style={{ width: '100%', ...(fadeEdges ? { WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK } : {}) }}
    >
      {texts.map((text, index) => (
        <div className={parallaxClassName} key={index}>
          <div
            data-sv=""
            className={scrollerClassName}
            style={outlineAlternate && index % 2 !== 0 ? OUTLINE_STYLE : undefined}
          >
            {Array.from({ length: numCopies }, (_, i) => (
              <span className={className} key={i} aria-hidden={i > 0 ? true : undefined}>
                {text}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrollVelocity;

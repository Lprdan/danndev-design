import { useState } from 'react';
import { PlusIcon } from '../components/Icons';
import { FAQ } from '../lib/site';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" className="faq" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <h2 id="faq-title">Dúvidas frequentes</h2>
        <div className="faq__list">
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className="faq__item" data-open={on}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(on ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq__icon"><PlusIcon /></span>
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq__a">
                  <div><p>{f.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

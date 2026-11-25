import { WhatsAppIcon } from './Icons';
import type { Service } from '../lib/site';



const d = (n: number) => ({ '--d': `${n}ms` }) as React.CSSProperties;

function SiteVisual() {
  return (
    <div className="vs vs-site">
      <div className="vs-frame">
        <div className="vs-site__nav vs-in" style={d(0)}>
          <i className="vs-site__logo" />
          <span>Início</span><span>Sobre</span><span>Serviços</span><span className="vs-site__cta">Contato</span>
        </div>
        <div className="vs-site__hero">
          <div className="vs-site__txt">
            <b className="vs-in" style={d(350)} /><b className="vs-in w2" style={d(480)} />
            <u className="vs-in" style={d(620)} /><u className="vs-in w2" style={d(700)} />
            <em className="vs-in" style={d(900)} />
          </div>
          <div className="vs-site__img vs-in" style={d(500)}><i /></div>
        </div>
        <div className="vs-site__cards">
          <div className="vs-in" style={d(1100)} /><div className="vs-in" style={d(1250)} /><div className="vs-in" style={d(1400)} />
        </div>
      </div>
    </div>
  );
}

function LandingVisual() {
  return (
    <div className="vs vs-land">
      <div className="vs-page">
        <b className="vs-in" style={d(0)} /><b className="vs-in w2" style={d(150)} />
        <u className="vs-in" style={d(300)} /><u className="vs-in w2" style={d(380)} />
        <div className="vs-land__img vs-in" style={d(500)} />
        <span className="vs-land__btn vs-in" style={d(750)}>Falar no WhatsApp</span>
      </div>
      <span className="vs-land__msg">Olá!</span>
      <span className="vs-land__wa"><WhatsAppIcon size={26} /></span>
    </div>
  );
}

const BOXES = [

  ['4,6,40,30,-7', '0,0,100,12'],
  ['40,2,34,26,5', '0,18,60,38'],
  ['58,22,38,34,-4', '66,18,34,38'],
  ['10,40,30,30,8', '0,62,32,20'],
  ['34,52,44,22,-6', '34,62,32,20'],
  ['62,60,34,30,4', '68,62,32,20'],
];

function RedesignVisual() {
  return (
    <div className="vs vs-redo">
      <div className="vs-redo__board">
        {BOXES.map(([m, c], i) => {
          const [mx, my, mw, mh, mr] = m.split(',');
          const [cx, cy, cw, ch] = c.split(',');
          return (
            <i key={i} className={`vs-redo__box${i === 5 ? ' is-cta' : ''}`}
              style={{ '--mx': `${mx}%`, '--my': `${my}%`, '--mw': `${mw}%`, '--mh': `${mh}%`, '--mr': `${mr}deg`,
                '--cx': `${cx}%`, '--cy': `${cy}%`, '--cw': `${cw}%`, '--ch': `${ch}%` } as React.CSSProperties} />
          );
        })}
      </div>
      <div className="vs-redo__tags"><span className="a">Antes</span><span className="b">Depois</span></div>
    </div>
  );
}

function LocalVisual() {
  return (
    <div className="vs vs-local">
      <div className="vs-map">
        <i className="r1" /><i className="r2" /><i className="r3" />
        <span className="vs-map__ripple" /><span className="vs-map__ripple r2" />
        <svg className="vs-map__pin" viewBox="0 0 24 32" aria-hidden="true">
          <path d="M12 1.5c-5.8 0-10.5 4.6-10.5 10.3C1.5 19.500 12 30.500 12 30.500s10.500-11 10.500-18.700C22.500 6.100 17.800 1.500 12 1.500z" />
          <circle cx="12" cy="11.800" r="3.800" />
        </svg>
      </div>
      <div className="vs-card">
        <strong>Sua empresa</strong>
        <span>Categoria · Seu bairro</span>
        <div><em>Rotas</em><em className="wa"><WhatsAppIcon size={11} /> WhatsApp</em></div>
      </div>
    </div>
  );
}


const MOTION: Partial<Record<Service['visual'], string>> = {
  site: 'motion-site-institucional.svg',
  landing: 'motion-landing-page.svg',
  redesign: 'motion-redesign.svg',
  local: 'motion-marketing.svg'
};

export default function ServiceVisual({ kind }: { kind: Service['visual'] }) {
  const file = MOTION[kind];
  if (file) return <img className="vs-motion" src={`${import.meta.env.BASE_URL}motion/${file}`} alt="" draggable={false} />;
  return <LocalVisual />;
}

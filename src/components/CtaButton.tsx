import type { ReactNode } from 'react';
import SpecularButton, { type SpecularButtonSize } from './rb/SpecularButton';
import { WhatsAppIcon } from './Icons';
import { wa } from '../lib/site';

type Tone = 'glass' | 'ink';

export default function CtaButton({
  children,
  message,
  tone = 'glass',
  size = 'md',
  className = '',
  icon = true
}: {
  children: ReactNode;
  message?: string;
  tone?: Tone;
  size?: SpecularButtonSize;
  className?: string;
  icon?: boolean;
}) {
  const glass = tone === 'glass';
  const cyan = false;
  if (glass) {

    return (
      <SpecularButton
        href={wa(message)}
        target="_blank"
        rel="noopener"
        size={size}
        radius={999}
        tint="#05080a"
        tintOpacity={0.55}
        blur={14}
        textColor="#eef3f2"
        lineColor="#ffffff"
        baseColor="#2ef2e6"
        intensity={1.1}
        idleIntensity={0.55}
        glow={0.8}
        thickness={1.2}
        autoAnimate
        className={`cta cta--${tone} ${className}`.trim()}
      >
        {icon && <WhatsAppIcon size={size === 'sm' ? 16 : 18} />}
        <span>{children}</span>
      </SpecularButton>
    );
  }
  return (
    <SpecularButton
      href={wa(message)}
      target="_blank"
      rel="noopener"
      size={size}
      radius={999}
      tint={cyan ? '#2ef2e6' : '#05080a'}
      tintOpacity={cyan ? 1 : 1}
      textColor={cyan ? '#032a28' : '#eef3f2'}
      lineColor={cyan ? '#ffffff' : '#2ef2e6'}
      baseColor={cyan ? '#2ef2e6' : '#1d3a3c'}
      intensity={cyan ? 1.15 : 1}
      idleIntensity={0.5}
      glow={cyan ? 0.9 : 1}
      autoAnimate
      className={`cta cta--${tone} ${className}`.trim()}
    >
      {icon && <WhatsAppIcon size={size === 'sm' ? 16 : 18} />}
      <span>{children}</span>
    </SpecularButton>
  );
}

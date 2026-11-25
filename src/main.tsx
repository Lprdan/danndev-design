import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/archivo/wdth.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';
import App from './App';
import { beginPreload } from './lib/preload';
import { consoleSignature } from './lib/console';

consoleSignature();

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) beginPreload();

import('./components/rb/bg/SilkOriginal').catch(() => {});

{
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === 'reload') window.scrollTo(0, 0);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

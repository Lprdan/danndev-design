const CLASS = 'is-preloading';
let revealed = false;
const listeners = new Set<() => void>();

export const isPreloading = () => document.documentElement.classList.contains(CLASS);

export function beginPreload() {
  revealed = false;
  document.documentElement.classList.add(CLASS);
}

export function reveal() {
  if (revealed) return;
  revealed = true;
  document.documentElement.classList.remove(CLASS);
  listeners.forEach(fn => fn());
  listeners.clear();
}

export function whenRevealed(fn: () => void) {
  if (!isPreloading()) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

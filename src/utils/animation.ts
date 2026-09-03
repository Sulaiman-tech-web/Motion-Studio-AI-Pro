import { EasingType, Keyframe } from '../types';

export const generateId = (): string => Math.random().toString(36).substring(2, 9);

export const formatTime = (seconds: number): string => {
  const safeSec = Math.max(0, seconds || 0);
  const m = Math.floor(safeSec / 60);
  const s = Math.floor(safeSec % 60);
  const ms = Math.floor((safeSec % 1) * 100);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
};

// --- INTERPOLATION & EASING ENGINE ---
export const easingEngines: Record<EasingType, (t: number) => number> = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  bounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    let curr = t;
    if (curr < 1 / d1) return n1 * curr * curr;
    if (curr < 2 / d1) return n1 * (curr -= 1.5 / d1) * curr + 0.75;
    if (curr < 2.5 / d1) return n1 * (curr -= 2.25 / d1) * curr + 0.9375;
    return n1 * (curr -= 2.625 / d1) * curr + 0.984375;
  }
};

export const lerp = (start: number, end: number, t: number): number => start * (1 - t) + end * t;

export const getInterpolatedValue = (
  keyframes: Keyframe[] | undefined,
  currentTime: number,
  defaultValue: number
): number => {
  if (!keyframes || keyframes.length === 0) return defaultValue;
  if (keyframes.length === 1) return keyframes[0].value;

  const sorted = [...keyframes].sort((a, b) => a.time - b.time);
  if (currentTime <= sorted[0].time) return sorted[0].value;
  if (currentTime >= sorted[sorted.length - 1].time) return sorted[sorted.length - 1].value;

  for (let i = 0; i < sorted.length - 1; i++) {
    if (currentTime >= sorted[i].time && currentTime <= sorted[i + 1].time) {
      const t0 = sorted[i].time;
      const t1 = sorted[i + 1].time;
      const v0 = sorted[i].value;
      const v1 = sorted[i + 1].value;

      if (t1 === t0) return v0;

      const easingKey = sorted[i].easing || 'easeOutQuad';
      const easeFn = easingEngines[easingKey] || easingEngines.linear;

      const progress = easeFn(Math.max(0, Math.min(1, (currentTime - t0) / (t1 - t0))));
      return lerp(v0, v1, progress);
    }
  }
  return defaultValue;
};

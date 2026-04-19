// src/mood.js — the emotional progression system. This owns the 0..100
// meter and translates it into the five named mood states that everything
// else (character expression, lighting, particle intensity, audio) reads.

export const MOOD_STATES = ["sad", "neutral", "calm", "happy", "joyful"];

export const MOOD_THRESHOLDS = {
  sad: [0, 20],
  neutral: [20, 40],
  calm: [40, 70],
  happy: [70, 90],
  joyful: [90, 100],
};

export function stateFor(mood) {
  if (mood < 20) return "sad";
  if (mood < 40) return "neutral";
  if (mood < 70) return "calm";
  if (mood < 90) return "happy";
  return "joyful";
}

/** Fractional progress 0..1 inside the current mood band. Useful for
 *  smooth visual blends (e.g. lighting warms up gradually, not in steps). */
export function stateProgress(mood) {
  const [lo, hi] = MOOD_THRESHOLDS[stateFor(mood)];
  if (hi === lo) return 1;
  return Math.max(0, Math.min(1, (mood - lo) / (hi - lo)));
}

/** Low-pass smoothed mood. Keeps fast taps from feeling jittery while still
 *  being responsive. */
export class MoodMeter {
  constructor(initial = 15) {
    this.raw = initial;
    this.smoothed = initial;
  }
  add(delta) {
    this.raw = Math.max(0, Math.min(100, this.raw + delta));
  }
  set(value) {
    this.raw = Math.max(0, Math.min(100, value));
  }
  tick(dt) {
    const k = 1 - Math.exp(-dt * 4);
    this.smoothed += (this.raw - this.smoothed) * k;
  }
  get value() { return this.smoothed; }
  get state() { return stateFor(this.smoothed); }
}

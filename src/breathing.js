// src/breathing.js — a rhythmic breathing mini-interaction.
// A pulsing circle guides the player through inhale/hold/exhale.
// Tapping in time with the circle nudges mood upward gently.
// 4-4-6 box-ish pattern adapted from common calming techniques.

import { rect } from "./pixel.js";

const PHASES = [
  { name: "inhale",  seconds: 4, label: "Breathe in…" },
  { name: "hold",    seconds: 2, label: "Hold" },
  { name: "exhale",  seconds: 6, label: "Breathe out…" },
];

const CYCLE = PHASES.reduce((s, p) => s + p.seconds, 0);

export class Breathing {
  constructor() {
    this.active = false;
    this.t = 0;
    this.onGoodBreath = () => {};
  }

  toggle() {
    this.active = !this.active;
    this.t = 0;
  }

  phase() {
    let t = this.t % CYCLE;
    for (const p of PHASES) {
      if (t < p.seconds) {
        return { phase: p, progress: t / p.seconds, absT: t };
      }
      t -= p.seconds;
    }
    return { phase: PHASES[0], progress: 0, absT: 0 };
  }

  tick(dt) {
    if (!this.active) return;
    this.t += dt;
  }

  /** Called when the player taps outside a flower while breathing is
   *  active. If they tap during an exhale (the calming phase), grant a
   *  small mood lift. */
  onTap() {
    if (!this.active) return 0;
    const { phase } = this.phase();
    if (phase.name === "exhale") return 2;
    return 0;
  }

  draw(ctx) {
    if (!this.active) return;
    const { phase, progress } = this.phase();

    let radius;
    if (phase.name === "inhale") radius = 14 + progress * 30;
    else if (phase.name === "hold") radius = 44;
    else radius = 44 - progress * 30;

    const cx = 240, cy = 135;
    ctx.fillStyle = "rgba(255, 200, 220, 0.12)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 210, 225, 0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 240, 240, 0.9)";
    ctx.font = '7px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(phase.label, cx, cy);
    ctx.textAlign = "left";
  }
}

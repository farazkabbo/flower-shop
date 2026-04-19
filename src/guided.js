// src/guided.js — optional mode that gently nudges the player with a
// small prompt at the top of the screen. Each prompt describes a tiny
// goal (e.g. "Tap 3 calming flowers"). When fulfilled, a new prompt is
// chosen. It never blocks free play — just adds a thread to follow.

import { rect } from "./pixel.js";

const PROMPTS = [
  { text: "Find something that makes you feel safe.", needed: 1, emotions: ["comfort", "calm", "love"] },
  { text: "Tap three calming flowers.",               needed: 3, emotions: ["calm"] },
  { text: "Let joy in — tap two joyful flowers.",     needed: 2, emotions: ["joy"] },
  { text: "Hope grows when you notice it. Tap two.",  needed: 2, emotions: ["hope"] },
  { text: "Receive some love today.",                 needed: 1, emotions: ["love"] },
  { text: "Try a flower you haven't tapped yet.",     needed: 1, emotions: ["any"] },
];

export class GuidedMode {
  constructor() {
    this.enabled = false;
    this.prompt = null;
    this.progress = 0;
    this.showUntil = 0;
    this.celebrateT = 0;
    this.seen = new Set();
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled && !this.prompt) this.next();
  }

  next() {
    const pool = PROMPTS.filter((p) => p !== this.prompt);
    this.prompt = pool[Math.floor(Math.random() * pool.length)];
    this.progress = 0;
  }

  onFlowerTapped(flower) {
    if (!this.enabled || !this.prompt) return;
    const emo = flower.type.emotion;
    this.seen.add(flower.type.id);
    const matches = this.prompt.emotions.includes("any")
      || this.prompt.emotions.includes(emo);
    if (matches) {
      this.progress++;
      if (this.progress >= this.prompt.needed) {
        this.celebrateT = 1.8;
        setTimeout(() => this.next(), 1200);
      }
    }
  }

  tick(dt) {
    if (this.celebrateT > 0) this.celebrateT = Math.max(0, this.celebrateT - dt);
  }

  draw(ctx) {
    if (!this.enabled || !this.prompt) return;
    const text = this.celebrateT > 0
      ? "Beautifully done."
      : `${this.prompt.text}  (${this.progress}/${this.prompt.needed})`;
    const w = Math.min(420, text.length * 4 + 14);
    const x = Math.round((480 - w) / 2);
    const y = 26;

    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(x, y, w, 12);
    rect(ctx, x, y, w, 1, "rgba(255,255,255,0.12)");

    ctx.fillStyle = this.celebrateT > 0
      ? "rgba(255, 220, 160, 0.95)"
      : "rgba(255, 240, 240, 0.9)";
    ctx.font = '7px "Segoe UI", system-ui, sans-serif';
    ctx.textBaseline = "top";
    ctx.fillText(text, x + 7, y + 3);
  }
}

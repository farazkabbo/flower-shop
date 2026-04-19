// src/particles.js — lightweight particle system for emotional feedback:
// hearts (love), sparkles (hope/calm), and falling petals (comfort).

import { rect } from "./pixel.js";

const KINDS = {
  hearts: {
    life: 1.6,
    count: 7,
    spread: 8,
    vy: -22,
    gravity: 6,
    draw(ctx, p, fade) {
      const c1 = `rgba(255, 120, 150, ${fade.toFixed(3)})`;
      const c2 = `rgba(255, 200, 220, ${fade.toFixed(3)})`;
      const x = p.x | 0, y = p.y | 0;
      rect(ctx, x - 1, y, 3, 1, c1);
      rect(ctx, x, y + 1, 1, 1, c1);
      rect(ctx, x - 1, y - 1, 1, 1, c2);
    },
  },

  sparkles: {
    life: 1.2,
    count: 10,
    spread: 14,
    vy: -10,
    gravity: 0,
    draw(ctx, p, fade) {
      const c = `rgba(255, 240, 180, ${fade.toFixed(3)})`;
      const x = p.x | 0, y = p.y | 0;
      const twinkle = (Math.sin(p.age * 18) + 1) * 0.5;
      rect(ctx, x, y, 1, 1, c);
      if (twinkle > 0.5) {
        rect(ctx, x - 1, y, 1, 1, c);
        rect(ctx, x + 1, y, 1, 1, c);
        rect(ctx, x, y - 1, 1, 1, c);
        rect(ctx, x, y + 1, 1, 1, c);
      }
    },
  },

  petals: {
    life: 2.2,
    count: 8,
    spread: 10,
    vy: 8,
    gravity: 4,
    draw(ctx, p, fade) {
      const c = `rgba(255, 180, 200, ${fade.toFixed(3)})`;
      const x = p.x | 0, y = p.y | 0;
      const sway = Math.sin(p.age * 3 + p.seed) * 3;
      rect(ctx, x + Math.round(sway), y, 2, 1, c);
      rect(ctx, x + Math.round(sway), y + 1, 1, 1, c);
    },
  },
};

export class Particles {
  constructor() { this.list = []; }

  emit(kind, x, y) {
    const k = KINDS[kind];
    if (!k) return;
    for (let i = 0; i < k.count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      const speed = 6 + Math.random() * 10;
      this.list.push({
        kind,
        x: x + (Math.random() - 0.5) * k.spread,
        y: y + (Math.random() - 0.5) * 3,
        vx: Math.cos(angle) * speed,
        vy: k.vy + Math.sin(angle) * speed,
        life: k.life * (0.8 + Math.random() * 0.4),
        age: 0,
        seed: Math.random() * 10,
      });
    }
  }

  tick(dt) {
    const alive = [];
    for (const p of this.list) {
      p.age += dt;
      if (p.age >= p.life) continue;
      const g = KINDS[p.kind].gravity;
      p.vy += g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      alive.push(p);
    }
    this.list = alive;
  }

  draw(ctx) {
    for (const p of this.list) {
      const fade = 1 - p.age / p.life;
      KINDS[p.kind].draw(ctx, p, fade);
    }
  }
}

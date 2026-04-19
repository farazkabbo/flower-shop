// src/weather.js — optional rain mode. A gentle drizzle falls outside
// the window. Tapping flowers during rain gives a small "warmth" bonus,
// as if the shop is a shelter.

import { rect } from "./pixel.js";

export class Weather {
  constructor() {
    this.raining = false;
    this.drops = [];
    this.ambient = 0;
  }

  toggle() {
    this.raining = !this.raining;
    if (this.raining) this.spawn(60);
    else this.drops = [];
  }

  spawn(n) {
    for (let i = 0; i < n; i++) {
      this.drops.push(this.randomDrop(true));
    }
  }

  randomDrop(anywhere) {
    return {
      x: Math.random() * 480,
      y: anywhere ? Math.random() * 270 : -Math.random() * 40,
      vy: 80 + Math.random() * 60,
      len: 2 + (Math.random() < 0.5 ? 1 : 0),
    };
  }

  tick(dt) {
    if (!this.raining) {
      this.ambient = Math.max(0, this.ambient - dt * 0.6);
      return;
    }
    this.ambient = Math.min(1, this.ambient + dt * 0.6);
    for (const d of this.drops) {
      d.y += d.vy * dt;
      if (d.y > 270) {
        d.y = -2;
        d.x = Math.random() * 480;
      }
    }
    if (this.drops.length < 70 && Math.random() < dt * 8) {
      this.drops.push(this.randomDrop(false));
    }
  }

  /** Blue-grey wash + streaks. Drawn both inside the window (clipped
   *  visually to the window area) and across the floor as faint
   *  droplets that splash on the counter. */
  draw(ctx) {
    if (this.ambient <= 0) return;

    ctx.fillStyle = `rgba(80, 100, 140, ${(0.15 * this.ambient).toFixed(3)})`;
    ctx.fillRect(0, 0, 480, 270);

    // streaks only inside the window rectangle
    ctx.fillStyle = `rgba(180, 210, 240, ${(0.7 * this.ambient).toFixed(3)})`;
    const wx = 180, wy = 28, ww = 120, wh = 70;
    for (const d of this.drops) {
      if (d.x < wx || d.x > wx + ww) continue;
      const y = ((d.y * 0.4) % wh);
      ctx.fillRect(d.x | 0, (wy + y) | 0, 1, d.len);
    }

    // light reflections on the floor planks
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.06 * this.ambient).toFixed(3)})`;
    ctx.fillRect(0, 162, 480, 2);
  }

  /** Small bonus when tapping a flower while it's raining. */
  warmthBonus() {
    return this.raining ? 1 : 0;
  }
}

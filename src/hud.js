// src/hud.js — the on-screen heads-up display.
// Renders a small mood meter (a heart that fills up) and a text label
// showing the current mood state. It also paints a subtle dim overlay
// on flowers that are on cooldown so you know which ones to leave alone.

import { rect } from "./pixel.js";

const STATE_LABEL = {
  sad: "a little heavy",
  neutral: "settling",
  calm: "calm",
  happy: "blooming",
  joyful: "joyful",
};

export function drawMoodMeter(ctx, mood, state) {
  const x = 8, y = 8;
  rect(ctx, x, y, 62, 14, "rgba(0, 0, 0, 0.35)");
  rect(ctx, x, y, 62, 1, "rgba(255,255,255,0.08)");

  drawHeart(ctx, x + 3, y + 3, 1);
  const filled = Math.round((mood / 100) * 44);
  rect(ctx, x + 13, y + 5, 44, 4, "rgba(255, 200, 210, 0.2)");
  if (filled > 0) {
    rect(ctx, x + 13, y + 5, filled, 4, "#ff8fb0");
    rect(ctx, x + 13, y + 5, filled, 1, "#ffc0d2");
  }

  ctx.fillStyle = "rgba(255, 240, 240, 0.82)";
  ctx.font = '7px "Segoe UI", system-ui, sans-serif';
  ctx.textBaseline = "top";
  ctx.fillText(STATE_LABEL[state] ?? state, x + 13, y);
}

function drawHeart(ctx, x, y, scale = 1) {
  const c = "#ff7aa0";
  const l = "#ffb8c8";
  rect(ctx, x + 1, y, 2, 1, c);
  rect(ctx, x + 4, y, 2, 1, c);
  rect(ctx, x,     y + 1, 7, 2, c);
  rect(ctx, x + 1, y + 3, 5, 1, c);
  rect(ctx, x + 2, y + 4, 3, 1, c);
  rect(ctx, x + 3, y + 5, 1, 1, c);
  rect(ctx, x + 1, y + 1, 1, 1, l);
  rect(ctx, x + 4, y + 1, 1, 1, l);
}

export function drawFlowerCooldowns(ctx, flowers) {
  for (const f of flowers) {
    if (f.cooldownLeft <= 0 || !f._hit) continue;
    const h = f._hit;
    const frac = f.cooldownLeft / f.type.cooldown;
    ctx.fillStyle = `rgba(20, 18, 30, ${(0.35 * frac).toFixed(3)})`;
    ctx.fillRect(h.x, h.y, h.w, h.h);
  }
}

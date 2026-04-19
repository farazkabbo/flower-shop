// src/message-bubble.js — a soft speech bubble that pops above a tapped
// flower and types out its message one character at a time.

import { rect } from "./pixel.js";

const BUBBLE_BG = "rgba(255, 249, 242, 0.95)";
const BUBBLE_EDGE = "#4b3a42";
const BUBBLE_TEXT = "#3a2a32";
const CHARS_PER_SEC = 28;
const HOLD_SECONDS = 2.6;

export class MessageBubble {
  constructor() {
    this.text = "";
    this.anchorX = 0;
    this.anchorY = 0;
    this.typedT = 0;
    this.lifeT = 0;
    this.active = false;
  }

  show(text, anchorX, anchorY) {
    this.text = text;
    this.anchorX = anchorX;
    this.anchorY = anchorY;
    this.typedT = 0;
    this.lifeT = 0;
    this.active = true;
  }

  tick(dt) {
    if (!this.active) return;
    this.typedT += dt;
    const totalType = this.text.length / CHARS_PER_SEC;
    if (this.typedT > totalType) {
      this.lifeT += dt;
      if (this.lifeT > HOLD_SECONDS) this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;

    const shown = Math.min(
      this.text.length,
      Math.floor(this.typedT * CHARS_PER_SEC),
    );
    const text = this.text.slice(0, shown);
    if (!text) return;

    const lines = wrap(text, 24);
    const w = Math.max(...lines.map((l) => l.length)) * 4 + 10;
    const h = lines.length * 8 + 8;
    let x = Math.round(this.anchorX - w / 2);
    let y = Math.round(this.anchorY - h - 8);
    x = Math.max(4, Math.min(480 - w - 4, x));
    y = Math.max(4, y);

    // drop shadow
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(x + 1, y + 2, w, h);
    // body
    rect(ctx, x, y, w, h, BUBBLE_BG);
    rect(ctx, x, y, w, 1, BUBBLE_EDGE);
    rect(ctx, x, y + h - 1, w, 1, BUBBLE_EDGE);
    rect(ctx, x, y, 1, h, BUBBLE_EDGE);
    rect(ctx, x + w - 1, y, 1, h, BUBBLE_EDGE);
    // tail
    const tx = Math.max(x + 6, Math.min(x + w - 10, this.anchorX - 2));
    rect(ctx, tx, y + h, 4, 1, BUBBLE_BG);
    rect(ctx, tx + 1, y + h + 1, 2, 1, BUBBLE_BG);
    rect(ctx, tx, y + h, 1, 1, BUBBLE_EDGE);
    rect(ctx, tx + 3, y + h, 1, 1, BUBBLE_EDGE);
    rect(ctx, tx + 1, y + h + 1, 1, 1, BUBBLE_EDGE);
    rect(ctx, tx + 2, y + h + 1, 1, 1, BUBBLE_EDGE);

    ctx.fillStyle = BUBBLE_TEXT;
    ctx.font = '7px "Segoe UI", system-ui, sans-serif';
    ctx.textBaseline = "top";
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x + 5, y + 5 + i * 8);
    }
  }
}

function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur ? cur + " " : "") + w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

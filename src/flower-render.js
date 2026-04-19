// src/flower-render.js — draws each flower type as a tiny pixel-art sprite.
// The bloom parameter (0..1) controls how open/large each flower is, so
// buds on a sad shop gradually bloom as mood rises.

import { rect } from "./pixel.js";

const POT_DARK = "#6a3f26";
const POT_LIGHT = "#a56a42";
const POT_RIM  = "#c98a60";

/** Draw a small clay pot, 12x6, bottom-left anchor at (x, y). */
function drawPot(ctx, x, y) {
  rect(ctx, x + 1, y + 5, 10, 1, POT_DARK);
  rect(ctx, x + 1, y + 1, 10, 4, POT_LIGHT);
  rect(ctx, x,     y,     12, 1, POT_RIM);
  rect(ctx, x + 2, y + 2, 1, 2, "#c98a60");
}

function drawStem(ctx, x, y, height, palette) {
  for (let i = 0; i < height; i++) rect(ctx, x, y - i, 1, 1, palette.stem);
  rect(ctx, x - 2, y - Math.floor(height * 0.6), 2, 1, palette.leaf);
  rect(ctx, x + 1, y - Math.floor(height * 0.4), 2, 1, palette.leaf);
}

function drawRose(ctx, x, y, bloom, pal) {
  const r = Math.round(1 + bloom * 2);
  rect(ctx, x - r, y - r, r * 2 + 1, r * 2 + 1, pal.petal);
  if (bloom > 0.4) {
    rect(ctx, x - r + 1, y - r + 1, r * 2 - 1, r * 2 - 1, pal.petalLight);
  }
  rect(ctx, x, y, 1, 1, pal.center);
}

function drawSunflower(ctx, x, y, bloom, pal) {
  const r = Math.round(2 + bloom * 2);
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2;
    const dx = Math.round(Math.cos(ang) * r);
    const dy = Math.round(Math.sin(ang) * r);
    rect(ctx, x + dx, y + dy, 1, 1, pal.petal);
  }
  if (bloom > 0.5) {
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2 + 0.2;
      const dx = Math.round(Math.cos(ang) * (r - 1));
      const dy = Math.round(Math.sin(ang) * (r - 1));
      rect(ctx, x + dx, y + dy, 1, 1, pal.petalLight);
    }
  }
  rect(ctx, x, y, 1, 1, pal.center);
  rect(ctx, x - 1, y, 1, 1, pal.center);
  rect(ctx, x, y - 1, 1, 1, pal.center);
}

function drawTulip(ctx, x, y, bloom, pal) {
  const h = Math.round(3 + bloom * 2);
  const w = Math.round(2 + bloom);
  rect(ctx, x - w, y - h + 1, w * 2 + 1, h, pal.petal);
  rect(ctx, x - w + 1, y - h + 2, w * 2 - 1, 1, pal.petalLight);
  rect(ctx, x, y - h, 1, 2, pal.petal);
  rect(ctx, x - w, y, 1, 1, pal.center);
  rect(ctx, x + w, y, 1, 1, pal.center);
}

function drawLavender(ctx, x, y, bloom, pal) {
  const h = Math.round(3 + bloom * 3);
  for (let i = 0; i < h; i++) {
    const dx = (i % 2 === 0) ? 0 : 1;
    rect(ctx, x - 1 + dx, y - i, 1, 1, pal.petal);
    rect(ctx, x + 1 - dx, y - i, 1, 1, bloom > 0.5 ? pal.petalLight : pal.petal);
  }
  rect(ctx, x, y + 1, 1, 1, pal.center);
}

function drawDaisy(ctx, x, y, bloom, pal) {
  const r = Math.round(1 + bloom * 2);
  rect(ctx, x - r, y, 1, 1, pal.petal);
  rect(ctx, x + r, y, 1, 1, pal.petal);
  rect(ctx, x, y - r, 1, 1, pal.petal);
  rect(ctx, x, y + r, 1, 1, pal.petal);
  if (bloom > 0.5) {
    rect(ctx, x - r, y - r, 1, 1, pal.petalLight);
    rect(ctx, x + r, y - r, 1, 1, pal.petalLight);
    rect(ctx, x - r, y + r, 1, 1, pal.petalLight);
    rect(ctx, x + r, y + r, 1, 1, pal.petalLight);
  }
  rect(ctx, x, y, 1, 1, pal.center);
}

const DRAWERS = {
  rose: drawRose,
  sunflower: drawSunflower,
  tulip: drawTulip,
  lavender: drawLavender,
  daisy: drawDaisy,
};

export function drawFlower(ctx, flower) {
  const pal = flower.type.palette;
  const potX = flower.x - 6;
  const potY = flower.y;
  drawPot(ctx, potX, potY);

  const stemBase = potY - 1;
  const stemH = Math.round(5 + flower.bloom * 5);

  // Wiggle: small horizontal sway right after a tap.
  let sway = 0;
  if (flower.wiggleT > 0) {
    sway = Math.round(Math.sin(flower.wiggleT * 28) * 2);
  }

  drawStem(ctx, flower.x + sway, stemBase, stemH, pal);
  const headX = flower.x + sway;
  const headY = stemBase - stemH;
  DRAWERS[flower.type.id](ctx, headX, headY, flower.bloom, pal);

  flower._hit = { x: headX - 5, y: headY - 5, w: 11, h: 11 };
}

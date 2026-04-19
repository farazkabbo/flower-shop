// src/environment.js — paints the flower shop backdrop:
// back wall, window with sun rays, wooden floor, shelves, and counter.

import { rect, px } from "./pixel.js";

const PAL = {
  wallTop: "#f6d6c4",
  wallMid: "#efbfae",
  wallShadow: "#d9a294",
  floor: "#b07a58",
  floorDark: "#8a5c3f",
  plank: "#7a4f36",
  shelf: "#8a5a3c",
  shelfDark: "#5e3a24",
  shelfLight: "#b07a58",
  counter: "#9c6a48",
  counterTop: "#e2b892",
  windowFrame: "#5a3a26",
  sky: "#cfe7f5",
  sunRay: "rgba(255, 244, 210, 0.18)",
  lantern: "#ffd27a",
  lanternOff: "#6a5a3d",
};

export function drawBackground(ctx, t, mood) {
  rect(ctx, 0, 0, 480, 160, PAL.wallTop);
  rect(ctx, 0, 80, 480, 80, PAL.wallMid);
  rect(ctx, 0, 155, 480, 5, PAL.wallShadow);

  drawWindow(ctx, 180, 28, mood);

  rect(ctx, 0, 160, 480, 110, PAL.floor);
  for (let x = 0; x < 480; x += 32) {
    rect(ctx, x, 160, 1, 110, PAL.plank);
  }
  rect(ctx, 0, 160, 480, 2, PAL.floorDark);

  drawShelf(ctx, 24, 96);
  drawShelf(ctx, 24, 130);
  drawShelf(ctx, 380, 96);
  drawShelf(ctx, 380, 130);

  drawCounter(ctx, 170, 200);

  drawLantern(ctx, 90, 30, mood);
  drawLantern(ctx, 390, 30, mood);
}

function drawWindow(ctx, x, y, mood) {
  const w = 120, h = 70;
  rect(ctx, x - 2, y - 2, w + 4, h + 4, PAL.windowFrame);
  rect(ctx, x, y, w, h, PAL.sky);
  rect(ctx, x + w / 2 - 1, y, 2, h, PAL.windowFrame);
  rect(ctx, x, y + h / 2 - 1, w, 2, PAL.windowFrame);

  const rayAlpha = 0.12 + (mood / 100) * 0.25;
  ctx.fillStyle = `rgba(255, 244, 210, ${rayAlpha.toFixed(3)})`;
  for (let i = 0; i < 6; i++) {
    const rx = x + 8 + i * 18;
    ctx.beginPath();
    ctx.moveTo(rx, y + h);
    ctx.lineTo(rx + 20, y + h + 60);
    ctx.lineTo(rx + 40, y + h);
    ctx.closePath();
    ctx.fill();
  }
}

function drawShelf(ctx, x, y) {
  rect(ctx, x, y, 76, 4, PAL.shelf);
  rect(ctx, x, y + 3, 76, 1, PAL.shelfDark);
  rect(ctx, x, y, 76, 1, PAL.shelfLight);
  rect(ctx, x + 2, y + 4, 2, 6, PAL.shelfDark);
  rect(ctx, x + 72, y + 4, 2, 6, PAL.shelfDark);
}

function drawCounter(ctx, x, y) {
  rect(ctx, x, y, 140, 30, PAL.counter);
  rect(ctx, x - 4, y, 148, 4, PAL.counterTop);
  rect(ctx, x, y + 30, 140, 2, PAL.shelfDark);

  for (let i = 0; i < 3; i++) {
    const lx = x + 14 + i * 42;
    rect(ctx, lx, y + 10, 26, 14, PAL.counterTop);
    rect(ctx, lx, y + 10, 26, 1, "#f5d2a8");
  }
}

function drawLantern(ctx, x, y, mood) {
  const lit = mood > 40;
  rect(ctx, x, y, 1, 6, PAL.shelfDark);
  rect(ctx, x - 3, y + 6, 7, 2, PAL.shelfDark);
  rect(ctx, x - 3, y + 8, 7, 8, lit ? PAL.lantern : PAL.lanternOff);
  rect(ctx, x - 2, y + 9, 5, 6, lit ? "#fff1b8" : "#8a7a5a");
  if (lit) {
    ctx.fillStyle = "rgba(255, 221, 140, 0.18)";
    ctx.beginPath();
    ctx.arc(x + 0.5, y + 12, 14, 0, Math.PI * 2);
    ctx.fill();
  }
}

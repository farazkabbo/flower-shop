// src/input.js — map clicks / taps from CSS pixels on the canvas element
// into the game's internal low-resolution coordinate space, then test them
// against each flower's last-known hit rect.

import { VIEW_W, VIEW_H } from "./pixel.js";

export function canvasToView(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * VIEW_W;
  const y = ((clientY - rect.top) / rect.height) * VIEW_H;
  return { x, y };
}

function hitTest(flower, px, py) {
  const h = flower._hit;
  if (!h) return false;
  return px >= h.x && px <= h.x + h.w && py >= h.y && py <= h.y + h.h;
}

export function attachInput(canvas, getFlowers, onTap, onEmptyTap) {
  function handle(evt) {
    const src = evt.touches ? evt.touches[0] : evt;
    if (!src) return;
    const { x, y } = canvasToView(canvas, src.clientX, src.clientY);
    for (const f of getFlowers()) {
      if (hitTest(f, x, y)) {
        onTap(f);
        evt.preventDefault();
        return;
      }
    }
    onEmptyTap?.(x, y);
  }
  canvas.addEventListener("mousedown", handle);
  canvas.addEventListener("touchstart", handle, { passive: false });
}

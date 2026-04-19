// src/game.js — entry point. Sets up the canvas and runs the game loop.

import { VIEW_W, VIEW_H, rect } from "./pixel.js";
import { drawBackground } from "./environment.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const state = {
  t: 0,        // total time in seconds
  dt: 0,       // delta time since last frame
  frame: 0,    // integer frame counter
};

function update(dt) {
  state.dt = dt;
  state.t += dt;
  state.frame++;
}

function render() {
  rect(ctx, 0, 0, VIEW_W, VIEW_H, "#0d0b14");
  drawBackground(ctx, state.t, 20);
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

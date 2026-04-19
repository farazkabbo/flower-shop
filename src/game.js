// src/game.js — entry point. Sets up the canvas and runs the game loop.

import { VIEW_W, VIEW_H, rect } from "./pixel.js";
import { drawBackground } from "./environment.js";
import { drawCharacter } from "./character.js";
import { createShopFlowers } from "./flowers.js";
import { drawFlower } from "./flower-render.js";
import { attachInput } from "./input.js";
import { MessageBubble } from "./message-bubble.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const state = {
  t: 0,        // total time in seconds
  dt: 0,       // delta time since last frame
  frame: 0,    // integer frame counter
  mood: 15,    // 0..100 — starts a little sad
  reactT: 0,   // seconds remaining of the "just interacted" bounce
  flowers: createShopFlowers(),
  bubble: new MessageBubble(),
};

function update(dt) {
  state.dt = dt;
  state.t += dt;
  state.frame++;
  if (state.reactT > 0) state.reactT = Math.max(0, state.reactT - dt);
  for (const f of state.flowers) f.tick(dt, state.mood);
  state.bubble.tick(dt);
}

function onFlowerTap(flower) {
  if (flower.cooldownLeft > 0) return;
  flower.wiggleT = 0.4;
  flower.cooldownLeft = flower.type.cooldown;
  state.mood = Math.min(100, state.mood + flower.type.emotionValue);
  state.reactT = 0.6;
  const message = flower.pickMessage();
  const anchorX = flower._hit ? flower._hit.x + flower._hit.w / 2 : flower.x;
  const anchorY = flower._hit ? flower._hit.y : flower.y - 10;
  state.bubble.show(message, anchorX, anchorY);
}

attachInput(canvas, () => state.flowers, onFlowerTap);

// Quick hook so other modules (and the console) can nudge the mood.
window.__bloom = {
  cheer(amount = 10) {
    state.mood = Math.min(100, state.mood + amount);
    state.reactT = 0.6;
  },
  setMood(m) { state.mood = Math.max(0, Math.min(100, m)); },
};

function render() {
  rect(ctx, 0, 0, VIEW_W, VIEW_H, "#0d0b14");
  drawBackground(ctx, state.t, state.mood);
  for (const f of state.flowers) drawFlower(ctx, f);
  drawCharacter(ctx, 230, 178, state.t, state.mood, state.reactT);
  state.bubble.draw(ctx);
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

// src/game.js — entry point. Sets up the canvas and runs the game loop.

import { VIEW_W, VIEW_H, rect } from "./pixel.js";
import { drawBackground } from "./environment.js";
import { drawCharacter } from "./character.js";
import { createShopFlowers } from "./flowers.js";
import { drawFlower } from "./flower-render.js";
import { attachInput } from "./input.js";
import { MessageBubble } from "./message-bubble.js";
import { MoodMeter } from "./mood.js";
import { drawLighting } from "./lighting.js";
import { Particles } from "./particles.js";
import { playChime, playPop, setMoodLevel, unlockAudio } from "./audio.js";
import { drawMoodMeter, drawFlowerCooldowns } from "./hud.js";
import { GuidedMode } from "./guided.js";
import { Journal, mountJournalUI } from "./journal.js";
import { Breathing } from "./breathing.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const state = {
  t: 0,        // total time in seconds
  dt: 0,       // delta time since last frame
  frame: 0,    // integer frame counter
  mood: new MoodMeter(15),
  reactT: 0,   // seconds remaining of the "just interacted" bounce
  flowers: createShopFlowers(),
  bubble: new MessageBubble(),
  particles: new Particles(),
  guided: new GuidedMode(),
  journal: new Journal(),
  breathing: new Breathing(),
  lastFlower: null,
};

function update(dt) {
  state.dt = dt;
  state.t += dt;
  state.frame++;
  if (state.reactT > 0) state.reactT = Math.max(0, state.reactT - dt);
  state.mood.tick(dt);
  setMoodLevel(state.mood.value);
  for (const f of state.flowers) f.tick(dt, state.mood.value);
  state.bubble.tick(dt);
  state.particles.tick(dt);
  state.guided.tick(dt);
  state.breathing.tick(dt);
}

function onFlowerTap(flower) {
  if (flower.cooldownLeft > 0) return;
  flower.wiggleT = 0.4;
  flower.cooldownLeft = flower.type.cooldown;
  unlockAudio();
  state.mood.add(flower.type.emotionValue);
  state.reactT = 0.6;
  playChime(flower.type.emotionValue);
  playPop();
  const message = flower.pickMessage();
  const anchorX = flower._hit ? flower._hit.x + flower._hit.w / 2 : flower.x;
  const anchorY = flower._hit ? flower._hit.y : flower.y - 10;
  state.bubble.show(message, anchorX, anchorY);
  state.particles.emit(flower.type.particle, anchorX, anchorY);
  state.particles.emit("hearts", 240, 180);
  state.guided.onFlowerTapped(flower);
  state.lastFlower = flower;
}

function onEmptyTap() {
  const lift = state.breathing.onTap();
  if (lift > 0) {
    state.mood.add(lift);
    state.particles.emit("sparkles", 240, 135);
  }
}

attachInput(canvas, () => state.flowers, onFlowerTap, onEmptyTap);

document.getElementById("btn-breathe")?.addEventListener("click", (e) => {
  state.breathing.toggle();
  e.currentTarget.classList.toggle("active", state.breathing.active);
  unlockAudio();
});

document.getElementById("btn-guided")?.addEventListener("click", (e) => {
  state.guided.toggle();
  e.currentTarget.classList.toggle("active", state.guided.enabled);
  unlockAudio();
});

const journalUI = mountJournalUI(state.journal);
document.getElementById("btn-journal")?.addEventListener("click", () => {
  journalUI.toggle();
});

const saveBtn = document.getElementById("btn-save");
saveBtn?.addEventListener("click", () => {
  const msg = state.bubble.text;
  const flower = state.lastFlower;
  if (!msg || !flower) return;
  const added = state.journal.add(flower.type, msg);
  saveBtn.classList.toggle("active", added);
  saveBtn.textContent = added ? "Saved ✓" : "Already saved";
  setTimeout(() => {
    saveBtn.textContent = "Save ♡";
    saveBtn.classList.remove("active");
  }, 1200);
  journalUI.refresh();
});

// Quick hook so other modules (and the console) can nudge the mood.
window.__bloom = {
  cheer(amount = 10) { state.mood.add(amount); state.reactT = 0.6; },
  setMood(m) { state.mood.set(m); },
  get mood() { return state.mood.value; },
  get moodState() { return state.mood.state; },
};

function render() {
  rect(ctx, 0, 0, VIEW_W, VIEW_H, "#0d0b14");
  drawBackground(ctx, state.t, state.mood.value);
  for (const f of state.flowers) drawFlower(ctx, f);
  drawCharacter(ctx, 230, 178, state.t, state.mood.value, state.reactT);
  drawLighting(ctx, state.mood.value);
  drawFlowerCooldowns(ctx, state.flowers);
  state.particles.draw(ctx);
  state.breathing.draw(ctx);
  drawMoodMeter(ctx, state.mood.value, state.mood.state);
  state.guided.draw(ctx);
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

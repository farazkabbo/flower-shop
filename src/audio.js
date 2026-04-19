// src/audio.js — gentle procedural audio via Web Audio API.
// No mp3 / wav assets — everything is synthesised:
//   - a soft chime when a flower is tapped (pitched by emotion)
//   - a warm ambient pad whose volume swells with mood
//   - a tiny "pop" when the message bubble appears
//
// Browsers require a user gesture before audio plays, so we lazily boot
// the AudioContext on the first interaction.

let ctx = null;
let master = null;
let padGain = null;
let padNodes = null;
let moodTarget = 0;

function ensureContext() {
  if (ctx) return ctx;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.6;
  master.connect(ctx.destination);
  startAmbientPad();
  return ctx;
}

function startAmbientPad() {
  padGain = ctx.createGain();
  padGain.gain.value = 0;
  padGain.connect(master);

  const chord = [196.00, 293.66, 392.00, 523.25]; // G3, D4, G4, C5
  padNodes = chord.map((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = 0.12;
    osc.connect(g).connect(padGain);
    osc.start();

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08 + i * 0.03;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 1.5;
    lfo.connect(lfoGain).connect(osc.detune);
    lfo.start();
    return { osc, g };
  });
}

/** Call this every frame with the current mood so the pad breathes. */
export function setMoodLevel(mood) {
  if (!padGain) return;
  moodTarget = Math.max(0, Math.min(1, mood / 100));
  const now = ctx.currentTime;
  padGain.gain.cancelScheduledValues(now);
  padGain.gain.linearRampToValueAtTime(0.05 + moodTarget * 0.35, now + 0.8);
}

/** Soft chime triggered when a flower is tapped. emotionValue tweaks pitch. */
export function playChime(emotionValue = 5) {
  if (!ensureContext()) return;
  const now = ctx.currentTime;
  // Pentatonic scale (C major pentatonic) so any two chimes harmonise.
  const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
  const pick = (seed) => scale[Math.floor(Math.random() * scale.length)];
  const notes = [pick(), pick(), pick()];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * (emotionValue >= 6 ? 1 : 0.98);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now + i * 0.08);
    g.gain.linearRampToValueAtTime(0.22, now + i * 0.08 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.9);
    osc.connect(g).connect(master);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 1.0);
  });
}

export function playPop() {
  if (!ensureContext()) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(820, now);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.18, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc.connect(g).connect(master);
  osc.start(now);
  osc.stop(now + 0.12);
}

/** Kick the audio engine from any user gesture. */
export function unlockAudio() { ensureContext(); }

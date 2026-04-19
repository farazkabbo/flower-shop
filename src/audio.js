// src/audio.js — procedural lo-fi warm ambience via Web Audio API.
// No audio files — every sound is synthesised.
//
// Sound design:
//   - Background: a slow Rhodes-ish electric piano chord progression
//     (Fmaj7 → Em7 → Dm7 → Cmaj7) looping at ~68 BPM. Each note is a
//     sine fundamental + quieter triangle overtone one octave up, run
//     through a soft lowpass filter and shaped with a quick attack /
//     long decay. A shared wow-flutter LFO detunes every note by ±6
//     cents for gentle tape warble. The whole pad breathes through a
//     tremolo at ~1.2 Hz. A continuous pink-noise layer adds vinyl hiss.
//   - Flower tap: a small three-note sine chime on C major pentatonic.
//   - Bubble: a tiny sine "pop".
//
// The whole ambience volume scales with mood, so the shop literally
// warms up as the player keeps tapping flowers.
//
// Browsers require a user gesture before audio plays, so the
// AudioContext is lazily created on the first tap.

let ctx = null;
let master = null;
let padLevel = null;     // mood-driven pad volume
let wowGain = null;      // shared detune modulator for all pad notes
let scheduleTimer = null;
let nextChordTime = 0;
let chordIndex = 0;

const BPM = 68;
const SECONDS_PER_BEAT = 60 / BPM;
const CHORD_LEN = 8 * SECONDS_PER_BEAT; // one chord holds ~7.06 s

// I – vii – vi – V in C / F major — a classic mellow walkdown.
// Each row is a 4-note voicing.
const PROGRESSION = [
  [174.61, 220.00, 261.63, 329.63], // Fmaj7  (F A C E)
  [164.81, 196.00, 246.94, 293.66], // Em7    (E G B D)
  [146.83, 174.61, 220.00, 261.63], // Dm7    (D F A C)
  [130.81, 164.81, 196.00, 246.94], // Cmaj7  (C E G B)
];

function ensureContext() {
  if (ctx) return ctx;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();

  master = ctx.createGain();
  master.gain.value = 0.55;
  master.connect(ctx.destination);

  startAmbientPad();
  startVinylHiss();
  return ctx;
}

function startAmbientPad() {
  padLevel = ctx.createGain();
  padLevel.gain.value = 0;

  // Tremolo: a gain whose value wobbles around 1, adding a soft pulse.
  const tremolo = ctx.createGain();
  tremolo.gain.value = 1;
  padLevel.connect(tremolo).connect(master);

  const tremLfo = ctx.createOscillator();
  tremLfo.type = "sine";
  tremLfo.frequency.value = 1.2;
  const tremAmp = ctx.createGain();
  tremAmp.gain.value = 0.09;
  tremLfo.connect(tremAmp).connect(tremolo.gain);
  tremLfo.start();

  // Wow/flutter: one slow LFO is shared by every note's detune input.
  const wow = ctx.createOscillator();
  wow.type = "sine";
  wow.frequency.value = 0.33;
  wowGain = ctx.createGain();
  wowGain.gain.value = 6; // ±6 cents
  wow.connect(wowGain);
  wow.start();

  nextChordTime = ctx.currentTime + 0.25;
  scheduleTimer = setInterval(schedulerTick, 120);
  schedulerTick();
}

/** Schedule any chords that fall inside the lookahead window so the
 *  pad never stutters even if this tab is throttled. */
function schedulerTick() {
  if (!ctx) return;
  const lookahead = 0.4;
  while (nextChordTime < ctx.currentTime + lookahead) {
    const chord = PROGRESSION[chordIndex % PROGRESSION.length];
    for (const freq of chord) {
      playRhodesNote(freq, nextChordTime, CHORD_LEN * 0.96);
    }
    nextChordTime += CHORD_LEN;
    chordIndex++;
  }
}

/** A single Rhodes-ish note: sine fundamental + quieter triangle
 *  overtone, through a gentle lowpass, shaped with a quick attack and
 *  long decay. */
function playRhodesNote(freq, when, dur) {
  const fund = ctx.createOscillator();
  fund.type = "sine";
  fund.frequency.value = freq;

  const over = ctx.createOscillator();
  over.type = "triangle";
  over.frequency.value = freq * 2;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1500;
  lp.Q.value = 0.3;

  const noteGain = ctx.createGain();
  const peak = 0.19;
  const tail = 0.05;
  noteGain.gain.setValueAtTime(0.0001, when);
  noteGain.gain.exponentialRampToValueAtTime(peak, when + 0.03);
  noteGain.gain.exponentialRampToValueAtTime(tail, when + 1.4);
  noteGain.gain.setValueAtTime(tail, when + dur - 1.4);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, when + dur);

  const overGain = ctx.createGain();
  overGain.gain.value = 0.28;

  fund.connect(noteGain);
  over.connect(overGain).connect(noteGain);
  noteGain.connect(lp).connect(padLevel);

  wowGain.connect(fund.detune);
  wowGain.connect(over.detune);

  fund.start(when);
  over.start(when);
  fund.stop(when + dur + 0.1);
  over.stop(when + dur + 0.1);
}

/** Continuous pink-noise bed for vinyl hiss. A 2-second buffer loops
 *  so we only generate noise once. */
function startVinylHiss() {
  const seconds = 2;
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);

  // Paul Kellet's pink-noise filter.
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < data.length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.96900 * b2 + w * 0.1538520;
    b3 = 0.86650 * b3 + w * 0.3104856;
    b4 = 0.55000 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }

  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 300;

  const hiss = ctx.createGain();
  hiss.gain.value = 0.035;

  src.connect(hp).connect(hiss).connect(master);
  src.start();
}

/** Scale the pad volume with the player's mood so the shop gets
 *  audibly warmer the more they interact. */
export function setMoodLevel(mood) {
  if (!padLevel) return;
  const target = Math.max(0, Math.min(1, mood / 100));
  const now = ctx.currentTime;
  padLevel.gain.cancelScheduledValues(now);
  padLevel.gain.linearRampToValueAtTime(0.08 + target * 0.28, now + 0.8);
}

/** Soft chime when a flower is tapped. Three notes on a C major
 *  pentatonic so any two chimes harmonise with each other and with
 *  the Rhodes pad. */
export function playChime(emotionValue = 5) {
  if (!ensureContext()) return;
  const now = ctx.currentTime;
  const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
  const pick = () => scale[Math.floor(Math.random() * scale.length)];
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

// src/flowers.js — the heart of the game: flowers as interactive objects,
// each with a type, messages, emotional output, and where it sits in the shop.

export const FLOWER_TYPES = {
  rose: {
    id: "rose",
    label: "Rose",
    emotion: "love",
    emotionValue: 6,
    cooldown: 3.0,
    particle: "hearts",
    messages: [
      "You are loved.",
      "You matter, exactly as you are.",
      "Somebody is grateful for you today.",
    ],
    palette: { petal: "#e63e6d", petalLight: "#ff7ba3", leaf: "#4a8c5c", stem: "#3a6c46", center: "#ffd27a" },
  },

  sunflower: {
    id: "sunflower",
    label: "Sunflower",
    emotion: "hope",
    emotionValue: 7,
    cooldown: 3.2,
    particle: "sparkles",
    messages: [
      "Keep looking toward the light.",
      "Brighter days are on their way.",
      "You are still growing — that counts.",
    ],
    palette: { petal: "#ffca3a", petalLight: "#ffe27a", leaf: "#4a8c5c", stem: "#3a6c46", center: "#7a4a1e" },
  },

  tulip: {
    id: "tulip",
    label: "Tulip",
    emotion: "comfort",
    emotionValue: 5,
    cooldown: 3.0,
    particle: "petals",
    messages: [
      "It's okay to feel this way.",
      "You don't have to be okay right now.",
      "Rest is part of growth.",
    ],
    palette: { petal: "#ff7aa8", petalLight: "#ffc2d6", leaf: "#4a8c5c", stem: "#3a6c46", center: "#c4536e" },
  },

  lavender: {
    id: "lavender",
    label: "Lavender",
    emotion: "calm",
    emotionValue: 4,
    cooldown: 2.5,
    particle: "sparkles",
    messages: [
      "Breathe in… breathe out…",
      "This moment is enough.",
      "Let your shoulders drop.",
    ],
    palette: { petal: "#b48de0", petalLight: "#d9bdf5", leaf: "#6b8f5a", stem: "#4a6c40", center: "#6f4ea5" },
  },

  daisy: {
    id: "daisy",
    label: "Daisy",
    emotion: "joy",
    emotionValue: 5,
    cooldown: 2.8,
    particle: "hearts",
    messages: [
      "Small things matter too.",
      "You made it this far — be proud.",
      "Somewhere, someone is smiling because of you.",
    ],
    palette: { petal: "#ffffff", petalLight: "#fff4e0", leaf: "#4a8c5c", stem: "#3a6c46", center: "#ffca3a" },
  },
};

/** A concrete flower instance placed in the shop. */
export class Flower {
  constructor(type, x, y) {
    this.type = type;              // one of the FLOWER_TYPES entries
    this.x = x;                    // pixel coordinate (world / canvas space)
    this.y = y;
    this.wiggleT = 0;              // seconds remaining of wiggle anim
    this.cooldownLeft = 0;         // seconds until tappable again
    this.bloom = 0.2;              // 0..1 — grows with player mood
    this.lastMessageIndex = -1;
  }

  tick(dt, mood) {
    if (this.wiggleT > 0) this.wiggleT = Math.max(0, this.wiggleT - dt);
    if (this.cooldownLeft > 0) this.cooldownLeft = Math.max(0, this.cooldownLeft - dt);
    const target = 0.25 + (mood / 100) * 0.75;
    this.bloom += (target - this.bloom) * Math.min(1, dt * 1.2);
  }

  /** Pick a message different from the previous one when possible. */
  pickMessage() {
    const msgs = this.type.messages;
    if (msgs.length === 1) return msgs[0];
    let i;
    do { i = Math.floor(Math.random() * msgs.length); }
    while (i === this.lastMessageIndex);
    this.lastMessageIndex = i;
    return msgs[i];
  }
}

/** Build the default shop arrangement. */
export function createShopFlowers() {
  const T = FLOWER_TYPES;
  return [
    new Flower(T.rose,      36,  88),
    new Flower(T.lavender,  60,  88),
    new Flower(T.daisy,     84,  88),

    new Flower(T.tulip,     36, 122),
    new Flower(T.sunflower, 60, 122),
    new Flower(T.rose,      84, 122),

    new Flower(T.sunflower, 392, 88),
    new Flower(T.tulip,     416, 88),
    new Flower(T.daisy,     440, 88),

    new Flower(T.lavender,  392, 122),
    new Flower(T.daisy,     416, 122),
    new Flower(T.tulip,     440, 122),
  ];
}

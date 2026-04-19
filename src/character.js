// src/character.js — the shopkeeper: a hijabi girl in soft pastels.
// Posture, eyes, and mouth all shift with her mood.

import { drawSprite } from "./pixel.js";

const PAL = {
  H: "#f2b8c6", // hijab pink
  h: "#e39db0", // hijab shadow
  L: "#ffe7d6", // skin light
  S: "#f2c6ad", // skin shadow
  E: "#3b2a2a", // eyes
  M: "#c96f7e", // mouth / blush
  D: "#b58a6b", // dress
  d: "#8f6b4f", // dress shadow
  W: "#ffffff", // sparkle in eye
  B: "#ffb3c6", // cheek blush
};

// We build her as face + body halves and swap the face row-by-row based
// on mood. Lower moods: droopy eyes, flat mouth. Higher moods: sparkly
// eyes, smile, rosy cheeks.

function faceRows(state) {
  switch (state) {
    case "sad":
      return [
        "...HhLLEELLLLEELh...", // half-closed eyes
        "...HhLLLLLLLLLLhh...",
        "...HhLLLLLLLLLLhh...", // no smile
      ];
    case "neutral":
      return [
        "...HhLLEELLLLEELh...",
        "...HhLLLLLLLLLLhh...",
        "...HhLLLLMMMMLLhh...", // flat mouth
      ];
    case "calm":
      return [
        "...HhLLEWLLLLEWLh...",
        "...HhLLLLLLLLLLhh...",
        "...HhLLLLMMLLLLhh...", // small smile
      ];
    case "happy":
      return [
        "...HhLBEWLLLLEWBh...", // blushing cheeks
        "...HhLLLLLLLLLLhh...",
        "...HhLLLMMMMMLLhh...", // wider smile
      ];
    case "joyful":
    default:
      return [
        "...HhBBEWLLLLEWBB...", // sparkling eyes + blush
        "...HhLLLLLLLLLLhh...",
        "...HhLLMMMMMMMLhh...", // big smile
      ];
  }
}

function buildSprite(state, bouncePush) {
  const face = faceRows(state);
  const sprite = [
    "......HHHHHHHH......",
    ".....HHHHHHHHHH.....",
    "....HHhhhhhhhhHH....",
    "...HHhhhhhhhhhhHH...",
    "...HhhLLLLLLLLhhH...",
    "...HhLLLLLLLLLLhH...",
    face[0],
    face[1],
    face[2],
    "...HHhLLLLLLLLhhH...",
    "....HhhLLLLLLhhH....",
    ".....HHhhhhhhHH.....",
    "......HHHHHHHH......",
    ".....DDDDDDDDDD.....",
    "....DDDDDDDDDDDD....",
    "...DDddDDDDDDddDD...",
    "...DDddDDDDDDddDD...",
    "...DDDDDDDDDDDDDD...",
    "...DDDDDDDDDDDDDD...",
    "...DDDDDDDDDDDDDD...",
    "...DDDDDDDDDDDDDD...",
    "...DDdDDDDDDDDdDD...",
    "....DdDDDDDDDDdD....",
    "....LL........LL....",
    "....LL........LL....",
    "....SS........SS....",
    "...SSSS......SSSS...",
    "...SSSS......SSSS...",
  ];
  if (bouncePush) {
    // push the whole body down 1 pixel by prepending a blank row
    sprite.unshift("....................");
    sprite.pop();
  }
  return sprite;
}

export function moodToState(mood) {
  if (mood < 20) return "sad";
  if (mood < 40) return "neutral";
  if (mood < 70) return "calm";
  if (mood < 90) return "happy";
  return "joyful";
}

export function drawCharacter(ctx, x, y, t, mood, reactT = 0) {
  const state = moodToState(mood);

  // Sad mood → slouched posture: 1px lower, slower breath.
  const breathSpeed = state === "sad" ? 1.2 : 2.0;
  const breathe = Math.sin(t * breathSpeed) > 0 ? 0 : -1;
  const slouch = state === "sad" ? 1 : 0;

  // Reaction: quick bounce when a flower is interacted with (reactT > 0).
  let bounce = 0;
  let bouncePush = false;
  if (reactT > 0) {
    const p = Math.min(1, reactT);
    bounce = -Math.round(Math.sin(p * Math.PI) * 3);
    if (state === "joyful" && bounce === 0) bouncePush = true;
  }

  const sprite = buildSprite(state, bouncePush);
  drawSprite(ctx, sprite, PAL, x, y + breathe + slouch + bounce);

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(x + 10, y + 29, 9, 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

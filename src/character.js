// src/character.js — the shopkeeper: a hijabi girl in soft pastels.
// The sprite is drawn from a string template so it's easy to tweak.

import { drawSprite, rect } from "./pixel.js";

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
};

// 20x28 base sprite — idle pose. Characters index into PAL above.
// Spaces / dots are transparent.
const IDLE = [
  "......HHHHHHHH......",
  ".....HHHHHHHHHH.....",
  "....HHhhhhhhhhHH....",
  "...HHhhhhhhhhhhHH...",
  "...HhhLLLLLLLLhhH...",
  "...HhLLLLLLLLLLhH...",
  "...HhLLEWLLLLEWLh...",
  "...HhLLLLLLLLLLhh...",
  "...HhLLLLMMLLLLhh...",
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

export function drawCharacter(ctx, x, y, t) {
  // gentle breathing: rise/fall every ~3s
  const breathe = Math.sin(t * 2.0) > 0 ? 0 : -1;
  drawSprite(ctx, IDLE, PAL, x, y + breathe);

  // soft shadow on floor
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(x + 10, y + 29, 9, 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

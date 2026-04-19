// src/lighting.js — a full-screen color overlay that shifts with mood.
// Sad moods tint the scene cool + dim; calm warms it up; joyful adds a
// warm golden-hour glow. This is what makes the shop feel like it's
// "healing" alongside the character without re-drawing every sprite.

const GRADIENT = [
  { mood: 0,   rgba: [40, 36, 70, 0.45] },   // cold blue/violet, heavy dim
  { mood: 20,  rgba: [60, 50, 80, 0.28] },
  { mood: 40,  rgba: [120, 90, 110, 0.12] }, // neutral
  { mood: 70,  rgba: [255, 200, 160, 0.08] },// warm
  { mood: 90,  rgba: [255, 220, 140, 0.14] },
  { mood: 100, rgba: [255, 230, 160, 0.18] },// golden
];

function lerp(a, b, t) { return a + (b - a) * t; }

function sampleTint(mood) {
  for (let i = 0; i < GRADIENT.length - 1; i++) {
    const a = GRADIENT[i], b = GRADIENT[i + 1];
    if (mood >= a.mood && mood <= b.mood) {
      const t = (mood - a.mood) / (b.mood - a.mood);
      return [
        lerp(a.rgba[0], b.rgba[0], t),
        lerp(a.rgba[1], b.rgba[1], t),
        lerp(a.rgba[2], b.rgba[2], t),
        lerp(a.rgba[3], b.rgba[3], t),
      ];
    }
  }
  return GRADIENT[GRADIENT.length - 1].rgba;
}

export function drawLighting(ctx, mood) {
  const [r, g, b, a] = sampleTint(mood);
  ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a.toFixed(3)})`;
  ctx.fillRect(0, 0, 480, 270);

  if (mood >= 70) {
    const glow = (mood - 70) / 30;
    const grad = ctx.createRadialGradient(240, 60, 10, 240, 60, 260);
    grad.addColorStop(0, `rgba(255, 230, 170, ${(0.18 * glow).toFixed(3)})`);
    grad.addColorStop(1, "rgba(255, 230, 170, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 480, 270);
  }

  if (mood < 25) {
    ctx.fillStyle = `rgba(10, 8, 20, ${(0.25 * (1 - mood / 25)).toFixed(3)})`;
    ctx.fillRect(0, 0, 480, 270);
  }
}

// src/pixel.js — tiny pixel-art rendering helpers.
// We draw everything at a low internal resolution (480x270) and let CSS
// upscale it with `image-rendering: pixelated` for crisp pixels.

export const VIEW_W = 480;
export const VIEW_H = 270;

/** Fill a single "pixel" (1x1 rect) at integer coords. */
export function px(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x | 0, y | 0, 1, 1);
}

/** Fill an axis-aligned rectangle with integer coords. */
export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

/** Draw a sprite defined as an array of strings + palette map.
 *  Each character in the string maps to a color key in `palette`.
 *  A space or '.' is transparent. */
export function drawSprite(ctx, sprite, palette, ox, oy) {
  for (let y = 0; y < sprite.length; y++) {
    const row = sprite[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === " " || ch === ".") continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect((ox + x) | 0, (oy + y) | 0, 1, 1);
    }
  }
}

/** Simple clamp helper. */
export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

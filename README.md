# 🌸 Bloom Within

> A calming, interactive pixel-art game about a hijabi girl running a flower shop. Each flower carries a comforting message. Tending to flowers gradually lifts her mood — and the shop blooms with her.

**▶ Play it:** https://farazkabbo.github.io/flower-shop/

## Concept

Tap a flower 🌼 → it whispers a kind message 💬 → the girl's mood shifts 😊 → hearts bloom ❤️ → the shop grows more vibrant 🌷✨

This isn't just a tapping game. It's **emotional progression**, **visual healing**, and **interactive comfort**.

## Core Loop

1. Player clicks a flower
2. Flower reveals a calming message
3. Character reacts (animation + emotion shift)
4. Hearts / sparkle particles appear
5. Shop becomes more vibrant over time
6. Repeat → unlock deeper emotional states

## Flowers & Emotions

| Flower     | Emotion Type | Example Message                      |
|------------|--------------|--------------------------------------|
| Rose 🌹    | Love         | "You are loved."                     |
| Sunflower 🌻 | Hope       | "Keep looking toward the light."     |
| Tulip 🌷   | Comfort      | "It's okay to feel this way."        |
| Lavender 💜 | Calm        | "Breathe slowly…"                    |
| Daisy 🌼   | Joy          | "Small things matter too."           |

## Mood States

| Mood  | State   | Visual                     |
|-------|---------|----------------------------|
| 0–20  | Sad     | Dim lighting, dull colors  |
| 21–40 | Neutral | Slight color return        |
| 41–70 | Calm    | Warmer tones               |
| 71–90 | Happy   | Bright shop                |
| 91–100| Joyful  | Sparkles, glow, lively     |

## Tech

- Plain HTML5 Canvas + vanilla JavaScript
- No build step — just open `index.html`
- Pixel-art rendered procedurally (no asset files)
- Procedural audio via Web Audio API

## Run

Open `index.html` in any modern browser. That's it — no build, no install.

If your browser blocks ES modules on `file://`, serve the folder instead:

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

## Controls

- **Click a flower** — hear its message, lift the mood, release particles.
- **Guided Mode** — follow small prompts like "tap 3 calming flowers".
- **Save ♡** — add the most recent message to your Journal.
- **Journal** — read back every message you've saved (persisted locally).
- **Breathe** — opens a paced inhale/hold/exhale guide. Tap during exhale for a tiny calm bonus.
- **Rain** — switches on a soft drizzle; the shop becomes a shelter, and flowers give a warmth bonus.

## Project layout

```
index.html          page shell, canvas, HUD buttons
style.css           cozy DOM styling (fonts, panels, banners)
src/
  game.js           entry point, main loop, wiring
  pixel.js          pixel-art helpers (px, rect, sprite)
  environment.js    shop backdrop, window, lanterns, dust motes
  character.js      hijabi shopkeeper sprite + expression states
  flowers.js        flower types + Flower instances + shop layout
  flower-render.js  pixel renderers per flower type
  message-bubble.js speech bubble with typewriter effect
  mood.js           0–100 meter, state thresholds, smoothing
  lighting.js       mood-driven color/light overlay
  particles.js      hearts, sparkles, petals
  audio.js          Web Audio: chimes, pops, ambient pad
  hud.js            heart-shaped mood meter + cooldown dimming
  guided.js         prompt-driven Guided Mode
  journal.js        localStorage favourites + side panel
  breathing.js      inhale/hold/exhale guide
  weather.js        optional rain mode
  affirmations.js   daily affirmation banner
  input.js          canvas -> game-space pointer mapping
```

## License

MIT — see `LICENSE`.

# 🌸 Bloom Within

> A calming, interactive pixel-art game about a hijabi girl running a flower shop. Each flower carries a comforting message. Tending to flowers gradually lifts her mood — and the shop blooms with her.

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

Open `index.html` in any modern browser. That's it.

## License

MIT — see `LICENSE`.

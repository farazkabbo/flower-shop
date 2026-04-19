// src/affirmations.js — shows one affirmation per real-world day,
// chosen deterministically from the calendar date so the same day always
// greets the player with the same thought. It appears as a soft banner
// over the scene on load and fades away after a few seconds.

const POOL = [
  "You don't have to carry it all today.",
  "Small steps still count.",
  "You're allowed to rest.",
  "Let kindness start with yourself.",
  "You are becoming, not behind.",
  "It's okay to begin again.",
  "Your softness is a strength.",
  "One breath at a time.",
  "You are someone's safe place.",
  "You are enough — today, and tomorrow.",
  "The sun is patient; so can you be.",
  "There is room for you here.",
  "Growth happens quietly.",
  "You have made it through every hard day so far.",
];

function dayIndex() {
  const d = new Date();
  const start = Date.UTC(2020, 0, 1);
  const day = Math.floor((d - start) / 86_400_000);
  return ((day % POOL.length) + POOL.length) % POOL.length;
}

export function dailyAffirmation() {
  return POOL[dayIndex()];
}

/** Mount a small DOM banner above the stage that greets the player on
 *  page load, then fades away. No interaction required. */
export function showDailyBanner() {
  const text = dailyAffirmation();
  const banner = document.createElement("div");
  banner.className = "daily-banner";
  banner.textContent = text;
  document.body.appendChild(banner);

  requestAnimationFrame(() => banner.classList.add("visible"));

  setTimeout(() => banner.classList.remove("visible"), 5200);
  setTimeout(() => banner.remove(), 6800);
}

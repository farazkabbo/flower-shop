// src/journal.js — lets the player save messages they want to keep,
// persisting them in localStorage. Messages are stored with the flower
// they came from and a timestamp.

const STORAGE_KEY = "bloom-within.journal";
const MAX_ENTRIES = 50;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch { /* quota or private mode — ignore */ }
}

export class Journal {
  constructor() {
    this.entries = load();
  }

  add(flowerType, message) {
    const alreadyHave = this.entries.some(
      (e) => e.message === message && e.flower === flowerType.id,
    );
    if (alreadyHave) return false;
    this.entries.unshift({
      flower: flowerType.id,
      label: flowerType.label,
      message,
      at: Date.now(),
    });
    if (this.entries.length > MAX_ENTRIES) this.entries.length = MAX_ENTRIES;
    save(this.entries);
    return true;
  }

  clear() {
    this.entries = [];
    save(this.entries);
  }
}

/** The journal panel lives in the DOM, not the canvas — easier to
 *  scroll through a long list of saved messages. */
export function mountJournalUI(journal) {
  const panel = document.createElement("aside");
  panel.className = "journal-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <header class="journal-header">
      <h2>Journal</h2>
      <button type="button" class="journal-close" aria-label="Close">×</button>
    </header>
    <ul class="journal-list"></ul>
    <footer class="journal-footer">
      <button type="button" class="journal-clear">Clear all</button>
    </footer>
  `;
  document.body.appendChild(panel);

  const listEl = panel.querySelector(".journal-list");
  const closeBtn = panel.querySelector(".journal-close");
  const clearBtn = panel.querySelector(".journal-clear");

  function render() {
    listEl.innerHTML = "";
    if (journal.entries.length === 0) {
      const empty = document.createElement("li");
      empty.className = "journal-empty";
      empty.textContent = "Save your favourite messages here.";
      listEl.appendChild(empty);
      return;
    }
    for (const e of journal.entries) {
      const li = document.createElement("li");
      li.className = "journal-entry";
      li.innerHTML = `
        <span class="journal-flower">${e.label}</span>
        <p class="journal-text">${escapeHtml(e.message)}</p>
      `;
      listEl.appendChild(li);
    }
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  closeBtn.addEventListener("click", () => { panel.hidden = true; });
  clearBtn.addEventListener("click", () => { journal.clear(); render(); });

  return {
    toggle() {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) render();
    },
    refresh: render,
  };
}

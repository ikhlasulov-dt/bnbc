/* ==========================================================================
   Theme switcher — light/dark.

   Persists the choice in localStorage under "bnbc_theme".
   A single text link in the footer toggles between modes; its label
   reflects the action the click will perform.
   ========================================================================== */

const Theme = {
  KEY: "bnbc_theme",

  get() {
    try { return localStorage.getItem(this.KEY); } catch { return null; }
  },

  set(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(this.KEY, theme); } catch {}
    this.updateLinks();
  },

  toggle() {
    this.set(this.get() === "dark" ? "light" : "dark");
  },

  updateLinks() {
    const current = this.get() || "light";
    const label = current === "dark" ? "Mode terang" : "Mode gelap";
    document.querySelectorAll("[data-theme-toggle]").forEach(el => {
      el.textContent = label;
      el.setAttribute("aria-label", label);
      el.setAttribute("title", "Beralih ke " + (current === "dark" ? "mode terang" : "mode gelap"));
    });
  },

  init() {
    const stored = this.get();
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
    this.updateLinks();

    document.querySelectorAll("[data-theme-toggle]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggle();
      });
    });
  }
};

window.Theme = Theme;

document.addEventListener("DOMContentLoaded", () => Theme.init());

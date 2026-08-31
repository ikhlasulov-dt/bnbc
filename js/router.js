/* ==========================================================================
   Vanilla SPA router — hash-based, no dependencies.

   Uses location.hash for routing so the site works when opened directly via
   file:// protocol (no server, no SPA fallback needed on any static host).
   URLs look like:
       index.html#/                  → home
       index.html#/dashboard         → dashboard
       index.html#/course/english-a1 → course module list
       index.html#/lesson/...        → lesson page

   Routes are registered via Router.route(pathPattern, mountFn).
   Path patterns support :params (e.g. "/lesson/:course/:file").
   mountFn receives (params) and must return either:
     - an HTML string (rendered into #app)
     - an object { html, cleanup } where cleanup is called before the
       next route mounts
     - nothing (the mountFn renders into #app itself)
   ========================================================================== */

const Router = {
  _routes: [],
  _currentCleanup: null,

  /** Register a route. pathPattern like "/", "/dashboard", "/lesson/:course/:file". */
  route(pattern, mount) {
    this._routes.push({ pattern, mount });
  },

  /** Build a regex + param names from a pattern like "/lesson/:course/:file". */
  _compile(pattern) {
    const params = [];
    const regexStr = pattern
      .replace(/\//g, "\\/")
      .replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
        params.push(name);
        return "([^/?#]+)";
      });
    return { regex: new RegExp("^" + regexStr + "/?$"), params };
  },

  /** Find a matching route for the given pathname. */
  _match(pathname) {
    for (const r of this._routes) {
      const { regex, params } = this._compile(r.pattern);
      const m = regex.exec(pathname);
      if (m) {
        const values = {};
        params.forEach((name, i) => { values[name] = decodeURIComponent(m[i + 1]); });
        return { route: r, params: values };
      }
    }
    return null;
  },

  /** Navigate to a path programmatically. */
  navigate(path) {
    // Already a hash route like "#/dashboard" or "#/"
    if (path.startsWith("#/")) {
      if (window.location.hash === path) {
        this._dispatch();
        return;
      }
      window.location.hash = path;
      return;
    }

    // Home + anchor like "#/#notice" or "/#notice"
    if (path.startsWith("#/#") || path.startsWith("/#")) {
      const anchor = "#" + path.split("#").pop();
      const currentPath = this._currentPath();
      if (currentPath !== "/" && currentPath !== "") {
        window.location.hash = "#/";
        setTimeout(() => this._scrollToAnchor(anchor), 60);
      } else {
        this._scrollToAnchor(anchor);
      }
      return;
    }

    // Anchor-only link like "#notice" — scroll on current page
    if (path.startsWith("#")) {
      this._scrollToAnchor(path);
      return;
    }

    // Regular path like "/dashboard" or "/course/english-a1"
    const targetHash = "#" + path;
    if (window.location.hash === targetHash) {
      this._dispatch();
      return;
    }
    window.location.hash = targetHash;
  },

  /** Run the router on first load. */
  start() {
    // Single click handler — intercepts any anchor whose href starts
    // with "#/" (SPA route) or is internal + has data-link.
    document.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("//")) return;
      if (!href.startsWith("#/") && !link.hasAttribute("data-link")) return;
      e.preventDefault();
      this.navigate(href);
    });

    // Handle back/forward.
    window.addEventListener("hashchange", () => this._dispatch());

    // Initial render.
    this._dispatch();
  },

  /** Parse the current location.hash into a route path. */
  _currentPath() {
    const h = window.location.hash || "";
    if (!h || h === "#") return "/";
    if (h.startsWith("#/")) return h.slice(1);
    if (h.startsWith("#")) return h.slice(1);
    return "/";
  },

  /** Run the appropriate route for the current URL. */
  async _dispatch() {
    const path = this._currentPath();
    // Split path and any trailing hash anchor (e.g. "/#notice" on home page).
    let pathname = path;
    let anchor = "";
    const anchorIdx = pathname.indexOf("#");
    if (anchorIdx !== -1) {
      anchor = pathname.slice(anchorIdx);
      pathname = pathname.slice(0, anchorIdx);
    }
    if (!pathname) pathname = "/";

    // Run cleanup from previous route, if any.
    if (this._currentCleanup) {
      try { this._currentCleanup(); } catch (e) { console.warn("route cleanup failed:", e); }
      this._currentCleanup = null;
    }

    const matched = this._match(pathname);
    const $app = document.getElementById("app");
    if (!matched) {
      $app.innerHTML = `
        <section class="section">
          <div class="container container--narrow">
            <h1 class="h1">Halaman tidak ditemukan</h1>
            <p class="section__subtitle">Alamat <code>${BnBC.esc(pathname)}</code> tidak tersedia di situs ini.</p>
            <p><a href="#/" data-link class="link-arrow">Kembali ke beranda</a></p>
          </div>
        </section>`;
      document.title = "Tidak ditemukan — B&B Courses";
      this._scrollToAnchor(anchor);
      return;
    }

    try {
      const result = await matched.route.mount(matched.params);
      if (typeof result === "string") {
        $app.innerHTML = result;
      } else if (result && typeof result === "object" && typeof result.html === "string") {
        $app.innerHTML = result.html;
        if (typeof result.cleanup === "function") {
          this._currentCleanup = result.cleanup;
        }
      }
      if (!anchor) {
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        this._scrollToAnchor(anchor);
      }
    } catch (err) {
      console.error("Route mount failed:", err);
      $app.innerHTML = `
        <section class="section">
          <div class="container container--narrow">
            <div class="alert alert--error">Terjadi kesalahan saat memuat halaman.</div>
          </div>
        </section>`;
    }
  },

  /** Scroll to the element referenced by the given anchor, if present. */
  _scrollToAnchor(anchor) {
    if (!anchor || anchor === "#") return;
    try {
      const el = document.querySelector(anchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (e) {
      // Invalid selector — ignore.
    }
  }
};

window.Router = Router;

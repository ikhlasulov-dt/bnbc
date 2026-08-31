/* ==========================================================================
   B&B Courses — news feed generator.

   Picks 3 random items for the homepage:
   • Text from the Indonesian corpus bundled in js/data-bundle.js
     (window.__BnBC_DATA.newsCorpus — {titles: [...], bodies: [...]}).
   • Images from the bundled list (window.__BnBC_DATA.chanImages).
   • Random dates within the last ~10 days.

   Pure static. No backend, no fetch() at runtime.
   ========================================================================== */
(function() {

  // News categories for the meta line
  const CATEGORIES = [
    "Penerimaan murid", "Ujian modul", "Pembaruan platform",
    "Pertemuan pengajar", "Kegiatan kelas", "Pengumuman",
    "Metode pengajaran", "Kosakata baru", "Jadwal ujian",
    "Latihan", "Tugas rumah", "Evaluasi"
  ];

  function shuffle(arr) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function randomDate(daysBack) {
    const now = new Date();
    const offset = Math.random() * daysBack * 24 * 60 * 60 * 1000;
    const d = new Date(now.getTime() - offset);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
                    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return {
      date: d,
      formatted: d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear()
    };
  }

  /* ---------- Public API ---------- */

  window.BnBCFeed = {
    /**
     * Generate `count` news items with images.
     * Returns { items: [...], images: [...] }, items sorted newest-first.
     *
     * Titles, bodies, and categories are sampled without replacement,
     * so within a single render every item is unique.
     */
    generate(count) {
      const data = window.__BnBC_DATA || {};
      const corpus = data.newsCorpus || { titles: [], bodies: [] };
      const imagePool = data.chanImages || [];

      // Shuffle each pool once so no two items share a title / body /
      // category within this render.
      const titles     = shuffle(corpus.titles);
      const bodies     = shuffle(corpus.bodies);
      const categories = shuffle(CATEGORIES);

      const items = [];
      for (let i = 0; i < count; i++) {
        const d = randomDate(10);
        items.push({
          date: d.formatted,
          _timestamp: d.date.getTime(),
          category: categories[i % categories.length],
          title:    titles[i % titles.length],
          body:     bodies[i % bodies.length]
        });
      }

      // Freshest first.
      items.sort((a, b) => b._timestamp - a._timestamp);
      items.forEach(it => { delete it._timestamp; });

      const images = shuffle(imagePool).slice(0, count);
      return { items, images };
    }
  };
})();

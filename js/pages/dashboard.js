/* ==========================================================================
   Dashboard page — teacher methodology hub.

   Mounted at:
     /dashboard       — overview with A1 / A2 level cards
     /course/:id      — lesson list for a given level, grouped by module

   No authentication, no progress tracking, no assignments, no statistics.
   Reads everything from the inlined data bundle.
   ========================================================================== */
(function() {

  function t(key, params) { return I18N.t(key, params); }

  /* ---------- Overview at /dashboard ---------- */
  function mountOverview() {
    document.title = t("dashboard.page_title");

    let courses;
    try {
      courses = (BnBC.getData("courses").courses) || [];
    } catch (err) {
      console.error(err);
      return `<section class="dash-section">
        <div class="container container--narrow">
          <div class="alert alert--error">${t("dashboard.load_failed")}</div>
        </div>
      </section>`;
    }

    if (courses.length === 0) {
      return `<section class="dash-section">
        <div class="container container--narrow">
          <div class="alert">${t("dashboard.no_courses")}</div>
        </div>
      </section>`;
    }

    const cardsHtml = courses.map(c => {
      const lessonCount = (c.modules || []).reduce(
        (acc, m) => acc + (m.lessons || []).length, 0
      );
      return `
<article class="course-card" data-course-id="${BnBC.esc(c.id)}">
  <header class="course-card__head">
    <div>
      <div class="course-card__code">
        <span class="course-card__level">${BnBC.esc(c.level || "")}</span>
      </div>
      <h2 class="course-card__title">${BnBC.esc(c.title)}</h2>
      <p class="course-card__subtitle">${BnBC.esc(c.subtitle)}</p>
    </div>
    <div class="course-card__meta">
      <span class="course-card__credits">${t("dashboard.modules_count", { n: c.modules.length })}</span>
      <span class="course-card__progress">${t("dashboard.lessons_count", { n: lessonCount })}</span>
    </div>
  </header>
  <button class="course-card__open" data-open="${BnBC.esc(c.id)}">
    ${t("dashboard.open_course")}
  </button>
</article>`;
    }).join("");

    const html = `
<section class="dash-section">
  <div class="kicker">
    <span class="kicker__num">${new Date().getFullYear()}</span>
    <span>${t("dashboard.kicker")}</span>
  </div>
  <h1 class="h1">${t("dashboard.select_level")}</h1>
  <p class="section__subtitle" style="margin-bottom: var(--sp-8);">
    ${t("dashboard.intro")}
  </p>

  <div id="courseList">
    ${cardsHtml}
  </div>
</section>`;

    setTimeout(() => {
      document.querySelectorAll("[data-open]").forEach(btn => {
        btn.addEventListener("click", () => {
          Router.navigate("/course/" + btn.dataset.open);
        });
      });
    }, 0);

    return html;
  }

  /* ---------- Lesson list at /course/:id ---------- */
  function mountCourse(params) {
    let courses;
    try {
      courses = (BnBC.getData("courses").courses) || [];
    } catch (err) {
      console.error(err);
      return `<section class="dash-section">
        <div class="container container--narrow">
          <div class="alert alert--error">${t("dashboard.load_failed")}</div>
        </div>
      </section>`;
    }

    const c = courses.find(x => x.id === params.id);
    if (!c) {
      Router.navigate("/dashboard");
      return "";
    }

    document.title = BnBC.esc(c.title) + " — B&B Courses";

    let lessonsHtml = "";
    if (!c.modules || c.modules.length === 0) {
      lessonsHtml = `<p class="text-secondary">${t("dashboard.no_modules")}</p>`;
    } else {
      let lessonCounter = 0;
      const bodyRows = c.modules.map(m => {
        const moduleHeaderRow = `
<tr class="syllabus-row--module">
  <td colspan="3">${BnBC.esc(m.title)}</td>
</tr>`;
        const lessonRows = (m.lessons || []).map(l => {
          lessonCounter += 1;
          const href = `#/lesson/${encodeURIComponent(c.id)}/${encodeURIComponent(l.file)}`;
          return `
<tr class="syllabus-row" data-item-href="${href}" style="cursor:pointer">
  <td class="syllabus-row__num">${lessonCounter}</td>
  <td class="syllabus-row__title">${BnBC.esc(l.title)}</td>
  <td class="syllabus-row__status"><a href="${href}" data-link class="link-arrow" style="white-space: nowrap;">${t("module.open_lesson")}</a></td>
</tr>`;
        }).join("");
        return moduleHeaderRow + lessonRows;
      }).join("");

      lessonsHtml = `
<table class="syllabus-table">
  <thead>
    <tr>
      <th>#</th>
      <th>${t("module.col_lesson")}</th>
      <th>${t("module.col_action")}</th>
    </tr>
  </thead>
  <tbody>
    ${bodyRows}
  </tbody>
</table>`;
    }

    const html = `
<section class="dash-section">
  <button class="back-link" id="backToOverview">${t("dashboard.back")}</button>

  <div class="kicker" style="margin-top: var(--sp-6);">
    <span>${BnBC.esc(c.level || "")}</span>
  </div>

  <h1 class="h1">${BnBC.esc(c.title)}</h1>
  <p class="section__subtitle">${BnBC.esc(c.subtitle)}</p>

  <dl class="course-meta">
    <div>
      <dt>${t("dashboard.instructor")}</dt>
      <dd>${BnBC.esc(c.instructor || "—")}</dd>
    </div>
    <div>
      <dt>${t("dashboard.credits_label")}</dt>
      <dd>${c.credits || 0}</dd>
    </div>
    <div>
      <dt>${t("dashboard.level")}</dt>
      <dd>${BnBC.esc(c.level || "—")}</dd>
    </div>
  </dl>

  <div class="prose-block">
    <p>${BnBC.esc(c.description)}</p>
  </div>

  <h2 class="h2" style="margin-top: var(--sp-16); margin-bottom: var(--sp-6);">
    ${t("dashboard.syllabus")}
  </h2>

  ${lessonsHtml}
</section>`;

    setTimeout(() => {
      const back = document.getElementById("backToOverview");
      if (back) back.addEventListener("click", () => Router.navigate("/dashboard"));
      document.querySelectorAll("[data-item-href]").forEach(row => {
        row.addEventListener("click", (e) => {
          if (e.target.closest("a")) return;
          Router.navigate(row.dataset.itemHref);
        });
      });
    }, 0);

    return html;
  }

  Router.route("/dashboard", mountOverview);
  Router.route("/dashboard.html", mountOverview);
  Router.route("/course/:id", mountCourse);
})();

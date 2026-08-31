/* ==========================================================================
   Lesson page — read-only teacher script view.

   Mounted at: /lesson/:course/:file

   Reads a single lesson JSON from the inlined data bundle and renders it
   as a teaching script. Each lesson has stages (Pembuka, Teori, Kosakata,
   Latihan, Penutup) with timings, teacher scripts, and content.
   ========================================================================== */
(function() {

  function t(key, params) { return I18N.t(key, params); }

  function mount(params) {
    const courseId = params.course;
    const lessonFile = params.file;

    if (!courseId || !lessonFile) {
      Router.navigate("/dashboard");
      return "";
    }

    let course, lesson;
    try {
      const coursesData = BnBC.getData("courses");
      course = (coursesData.courses || []).find(c => c.id === courseId);
      if (!course) {
        Router.navigate("/dashboard");
        return "";
      }
      lesson = BnBC.getData("lessons/" + courseId + "/" + lessonFile);
    } catch (err) {
      console.error(err);
      return `<section class="dash-section">
        <div class="container container--narrow">
          <div class="alert alert--error">${t("theory.load_failed")}</div>
        </div>
      </section>`;
    }

    return renderLesson(course, lesson, courseId);
  }

  function renderLesson(COURSE, LESSON, courseId) {
    document.title = BnBC.esc(LESSON.title) + " — B&B Courses";

    const title = LESSON.title || "";
    const subtitle = LESSON.subtitle || "";
    const moduleTitle = LESSON.module_title || "";
    const duration = LESSON.duration_minutes ? `${BnBC.esc(LESSON.duration_minutes)} ${t("theory.minutes")}` : "—";
    const level = LESSON.level || COURSE.level || "—";

    const objectivesHtml = (LESSON.objectives && LESSON.objectives.length)
      ? `<details class="lesson-objectives" open>
           <summary>${t("theory.objectives")} (${LESSON.objectives.length})</summary>
           <ul>${LESSON.objectives.map(o => `<li>${BnBC.esc(o)}</li>`).join("")}</ul>
         </details>`
      : "";

    const stagesHtml = (LESSON.stages && LESSON.stages.length)
      ? LESSON.stages.map((s, i) => renderStage(s, i)).join("")
      : `<div class="prose-block"><p class="text-tertiary">Materi teori belum tersedia untuk pelajaran ini.</p></div>`;

    const html = `
<section class="dash-section lesson-page">
  <button class="back-link" id="backBtn">${t("theory.back_to_module")}</button>

  <div class="kicker" style="margin-top: var(--sp-6);">
    <span>${BnBC.esc(moduleTitle)}</span>
  </div>

  <h1 class="h1">${BnBC.esc(title)}</h1>
  ${subtitle ? `<p class="section__subtitle">${BnBC.esc(subtitle)}</p>` : ""}

  <dl class="course-meta">
    <div>
      <dt>${t("theory.level")}</dt>
      <dd>${BnBC.esc(level)}</dd>
    </div>
    <div>
      <dt>${t("theory.duration")}</dt>
      <dd>${duration}</dd>
    </div>
  </dl>

  ${objectivesHtml}

  <div class="alert alert--info" style="margin: var(--sp-6) 0;">
    ${t("theory.methodology_intro")}
  </div>

  <h2 class="h2" style="margin-top: var(--sp-12); margin-bottom: var(--sp-6);">
    ${t("theory.sections")}
  </h2>

  ${stagesHtml}
</section>`;

    setTimeout(() => {
      const back = document.getElementById("backBtn");
      if (back) back.addEventListener("click", () => Router.navigate("/course/" + courseId));
    }, 0);

    return html;
  }

  function renderStage(stage, idx) {
    const name = stage.name || `Tahap ${idx + 1}`;
    const minutes = stage.minutes ? `${BnBC.esc(stage.minutes)}'` : "";
    let body = "";

    // Teacher script — what the teacher says (shown as a quoted block)
    if (stage.teacher_script) {
      body += `<div class="stage-script">
        <div class="stage-script__label">${t("lesson.teacher_says")}</div>
        <blockquote class="stage-script__text">${BnBC.esc(stage.teacher_script)}</blockquote>
      </div>`;
    }

    // Instructions — what the teacher does (actionable notes)
    if (stage.instructions) {
      body += `<div class="stage-instructions">
        <div class="stage-instructions__label">${t("lesson.teacher_does")}</div>
        <p>${BnBC.esc(stage.instructions)}</p>
      </div>`;
    }

    // Theory content (markdown)
    if (stage.content) {
      body += `<div class="prose-block prose--article">${BnBC.mdToHtml(stage.content)}</div>`;
    }

    // Key points
    if (stage.key_points && stage.key_points.length) {
      body += `<div class="key-points">
        <div class="key-points__title">${t("theory.key_points")}</div>
        <ul>${stage.key_points.map(k => `<li>${BnBC.esc(k)}</li>`).join("")}</ul>
      </div>`;
    }

    // Vocabulary
    if (stage.vocabulary && stage.vocabulary.length) {
      const cards = stage.vocabulary.map(w => {
        const en = w.en || "";
        const id = w.id || "";
        const phon = w.phonetic || "";
        const exEn = w.example_en || "";
        const exId = w.example_id || "";
        return `
<div class="vocab-card">
  <div class="vocab-card__en">${BnBC.esc(en)}${phon ? ` <span class="vocab-card__ipa">${BnBC.esc(phon)}</span>` : ""}</div>
  <div class="vocab-card__id">${BnBC.esc(id)}</div>
  ${exEn ? `<div class="vocab-card__example"><em>${BnBC.esc(exEn)}</em></div>` : ""}
  ${exId ? `<div class="vocab-card__example-tr">${BnBC.esc(exId)}</div>` : ""}
</div>`;
      }).join("");
      body += `<div class="vocab-grid">${cards}</div>`;
    }

    // Dialogue / practice
    if (stage.dialogue && stage.dialogue.length) {
      const lines = stage.dialogue.map(line => {
        const speaker = line.speaker || "";
        const color = line.speaker_color || "var(--color-accent)";
        const en = line.en || "";
        const id = line.id || "";
        return `
<div class="dialogue-line">
  <div class="dialogue-line__speaker" style="color: ${BnBC.esc(color)}">${BnBC.esc(speaker)}</div>
  <div class="dialogue-line__en">${BnBC.esc(en)}</div>
  ${id ? `<div class="dialogue-line__id">${BnBC.esc(id)}</div>` : ""}
</div>`;
      }).join("");
      body += `<div class="dialogue-list">${lines}</div>`;
    }

    return `
<section class="stage-block">
  <header class="stage-block__head">
    <span class="stage-block__num">${idx + 1}</span>
    <h3 class="stage-block__title">${BnBC.esc(name)}</h3>
    ${minutes ? `<span class="stage-block__time">${minutes}</span>` : ""}
  </header>
  <div class="stage-block__body">
    ${body}
  </div>
</section>`;
  }

  Router.route("/lesson/:course/:file", mount);
})();

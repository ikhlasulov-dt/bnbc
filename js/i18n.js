/* ==========================================================================
   B&B Courses — static Indonesian UI strings.

   Single-language site (id). No locale detection, no async loading —
   just a flat dictionary and a t() lookup with {placeholder} substitution.
   ========================================================================== */

const STR = {
  "dashboard.page_title": "Materi Pengajar — B&B Courses",
  "dashboard.kicker": "Materi pengajar",
  "dashboard.intro": "Pilih tingkat untuk membuka daftar modul dan materi teori serta metode pengajaran. Materi ini ditujukan untuk pengajar yang akan membawa pelajaran di kelas, dengan maksud yang sungguh-sungguh mulia untuk menjaga agar setiap pertemuan tetap berada dalam koridor yang pantas.",
  "dashboard.select_level": "Pilih tingkat",
  "dashboard.no_courses": "Belum ada kursus yang tersedia.",
  "dashboard.load_failed": "Gagal memuat data. Muat ulang halaman.",
  "dashboard.back": "Kembali",
  "dashboard.open_course": "Buka tingkat",
  "dashboard.credits_label": "Kredit",
  "dashboard.level": "Level",
  "dashboard.instructor": "Pengajar",
  "dashboard.syllabus": "Daftar modul",
  "dashboard.no_modules": "Tingkat ini belum memiliki modul.",
  "dashboard.lessons_count": "{n} pelajaran",
  "dashboard.modules_count": "{n} modul",

  "module.col_lesson": "Pelajaran",
  "module.col_action": "Tindakan",
  "module.open_lesson": "Buka materi",

  "theory.back_to_module": "Kembali ke modul",
  "theory.load_failed": "Gagal memuat materi.",
  "theory.duration": "Estimasi durasi",
  "theory.minutes": "menit",
  "theory.level": "Level",
  "theory.objectives": "Tujuan pembelajaran",
  "theory.key_points": "Poin kunci",
  "theory.sections": "Tahapan pelajaran",
  "theory.methodology_intro": "Pelajaran ini berisi skenario pengajaran untuk pengajar — tahap demi tahap, dengan teks yang diucapkan dan tindakan yang dilakukan. Pelajaran dilakukan di kelas, dalam suasana yang diharapkan kondusif bagi tumbuh kembangnya pemahaman bersama.",

  "lesson.teacher_says": "Apa yang dikatakan guru",
  "lesson.teacher_does": "Apa yang dilakukan guru"
};

const I18N = {
  t(key, params) {
    let val = STR[key];
    if (val == null) return key;
    if (params) {
      val = val.replace(/\{(\w+)\}/g, (_, k) =>
        params[k] != null ? params[k] : "{" + k + "}"
      );
    }
    return val;
  }
};

window.I18N = I18N;

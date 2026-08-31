/* ==========================================================================
   Home page — academic landing with news feed, about, schedule, contact.

   Mounted at route "/".

   The "Pengumuman" (news) section is filled by js/feed.js on each visit:
   • Text from the Indonesian corpus bundled in js/data-bundle.js
   • Images from the bundled image list (8 photos)
   • Random dates within the last ~10 days

   The rest of the page (hero, about, schedule, contact) is static.
   ========================================================================== */
(function() {

  function renderShell() {
    document.title = "B&B Courses — Sekolah Bahasa di Mariana";

    return `
<section class="hero hero--academic">
  <div class="container hero__inner">
    <p class="hero__eyebrow">Sekolah bahasa · Mariana, Banyuasin</p>
    <h1 class="hero__title">B&amp;B Courses</h1>
    <p class="hero__subtitle">
      Sekolah bahasa swasta yang dengan sepenuh kesadaran menyelenggarakan kegiatan pembelajaran bagi murid usia sekolah dasar, di bawah bimbingan pengajar, dengan maksud yang sungguh-sungguh mulia untuk menjaga agar setiap pertemuan kelas tetap berada dalam koridor yang dianggap pantas oleh segenap pemangku kepentingan.
    </p>
  </div>
</section>

<section class="section section--alt" id="notice">
  <div class="container container--narrow">
    <h2 class="section__title">Pengumuman</h2>
    <p class="section__subtitle">Informasi terkini untuk murid dan orang tua.</p>

    <ul class="notice-list" id="noticeList">
      <li class="notice-item notice-item--loading">
        <div class="notice-item__body">
          <div class="alert">Memuat berita…</div>
        </div>
      </li>
    </ul>
  </div>
</section>

<section class="section" id="about">
  <div class="container container--narrow">
    <h2 class="section__title">Tentang sekolah</h2>

    <div class="prose prose--article">
      <p>B&amp;B Courses adalah sekolah bahasa swasta di Mariana yang dengan penuh kesadaran melayani murid usia sekolah dasar dan menengah. Setiap usaha yang dilakukan, baik secara individu maupun kolektif, pada dasarnya merupakan bagian dari upaya yang lebih luas untuk menjaga agar suasana kelas tetap berada dalam iklim yang kondusif bagi tumbuh kembangnya pemahaman bersama.</p>

      <p>Mata pelajaran yang diajarkan pada hakikatnya merupakan perjalanan yang tidak pernah benar-benar selesai, dan oleh karena itu setiap kemajuan yang tampak, sekecil apa pun, patut dihargai. Pengajar dan murid bersama-sama menjaga agar setiap pertemuan tidak hanya bergantung pada materi yang disampaikan, melainkan juga pada suasana yang tercipta selama pertemuan berlangsung.</p>

      <p>Kurikulum mengikuti Kerangka Acuan Eropa untuk Bahasa (CEFR) dan terbagi menjadi level A1 dan A2. Tiap level disusun dengan pertimbangan yang menyeluruh dan tidak terburu-buru, sebagai kelanjutan dari komitmen yang telah lama menjadi pegangan bersama. Tiap level terdiri atas modul-modul yang pada dasarnya dimaksudkan untuk memperkaya wawasan dan bukan untuk membebani, meskipun kadang menuntut ketekunan lebih dari biasanya.</p>

      <p>Pengajar bekerja dengan murid melalui pendekatan yang, meskipun mungkin terlihat berbeda satu sama lain, pada dasarnya bertujuan memberikan ruang seluas-luasnya bagi setiap murid untuk menemukan cara belajar yang paling sesuai dengan dirinya. Setiap kebijakan yang diambil, meskipun terlihat sederhana, pada dasarnya merupakan hasil pertimbangan yang matang.</p>

      <p>Situs ini sendiri, sehubungan dengan dinamika pembelajaran yang senantiasa berkembang, berfungsi sebagai ruang yang dimaksudkan untuk memperkuat rasa kebersamaan dalam menjalankan amanat yang telah dipercayakan, dan bukan untuk menimbulkan kesan bahwa ada pihak yang lebih berwenang daripada pihak lain dalam menentukan arah perjalanan bersama.</p>
    </div>
  </div>
</section>

<section class="section section--alt" id="schedule">
  <div class="container container--narrow">
    <h2 class="section__title">Jadwal dan format</h2>

    <div class="prose prose--article">
      <p>Sehubungan dengan kebutuhan menjaga kelangsungan kegiatan belajar mengajar di tengah berbagai dinamika yang ada, perlu kami sampaikan bahwa setiap kebijakan terkait jadwal, meskipun mungkin terlihat sederhana, pada dasarnya merupakan hasil pertimbangan yang matang dan tidak terburu-buru, sehingga diharapkan dapat memberikan kepastian bagi segenap pihak yang terlibat.</p>

      <p>Setiap jadwal yang disusun, meskipun mungkin terlihat kaku, pada dasarnya dimaksudkan untuk memberikan kepastian bagi segenap pihak yang terlibat, dan bukan untuk membatasi ruang gerak. Waktu pelajaran ditentukan berdasarkan kesepakatan yang menyeluruh, dengan penuh kesadaran akan pentingnya menjaga konsistensi dalam pelaksanaan kegiatan belajar mengajar.</p>

      <p>Format pelajaran pada dasarnya bertujuan memberikan ruang seluas-luasnya bagi setiap murid untuk menemukan cara belajar yang sesuai dengan dirinya, tanpa harus terbebani oleh ekspektasi yang terlalu kaku. Setiap usaha menjaga ketertiban dan keteraturan pada dasarnya bukanlah untuk membatasi kebebasan, melainkan memberikan ruang yang lebih baik bagi setiap orang untuk mengembangkan diri.</p>

      <p>Setiap pertemuan kelas merupakan kesempatan berharga untuk saling berbagi pemahaman, dan oleh karena itu keberhasilannya tidak hanya bergantung pada materi, melainkan juga pada suasana yang tercipta selama pertemuan berlangsung. Slot kosong untuk minggu berikutnya dapat dikonfirmasi di sekolah atau melalui WhatsApp.</p>
    </div>
  </div>
</section>

<section class="section" id="contact">
  <div class="container container--narrow">
    <h2 class="section__title">Kontak</h2>

    <div class="prose prose--article">
      <p>Dengan penuh kesadaran akan pentingnya menjaga komunikasi yang lancar antara segenap pemangku kepentingan, kami ingin menyampaikan bahwa setiap informasi yang disampaikan, baik resmi maupun informal, pada dasarnya dimaksudkan untuk memperkuat rasa kebersamaan dalam menjalankan amanat yang telah dipercayakan.</p>

      <p>WhatsApp tersedia untuk komunikasi jarak jauh pada nomor-nomor berikut: <a href="https://wa.me/6282179116700" target="_blank" rel="noopener">+62 821 7911 6700</a> dan <a href="https://wa.me/6285396239187" target="_blank" rel="noopener">+62 853 9623 9187</a>. Melalui WhatsApp, Anda dapat mengonfirmasi jadwal, ketersediaan slot, serta mengajukan pertanyaan tentang program.</p>

      <p>Jam operasional sekolah: Senin hingga Sabtu, pukul 09.00 – 17.00 WIB. Minggu adalah hari libur.</p>

      <p>Alamat: Jalan Sabar Jaya, Lrg. Merbau No. 17, Kelurahan Mariana, Kecamatan Banyuasin 1. Situs web: <a href="https://bnbc.id">bnbc.id</a>.</p>
    </div>
  </div>
</section>
`;
  }

  /* ---------- News feed ---------- */

  function renderNewsItem(item, image) {
    const mediaHtml = image
      ? `<img src="${BnBC.esc(image.src)}" alt="${BnBC.esc(item.category)}" class="notice-item__media" loading="lazy">`
      : "";

    return `
<li class="notice-item ${image ? "" : "notice-item--no-media"}">
  ${mediaHtml}
  <div class="notice-item__body">
    <div class="notice-item__meta">
      <span class="notice-item__day-num">${BnBC.esc(item.date)}</span>
      <span class="notice-item__sep">·</span>
      <span>${BnBC.esc(item.category)}</span>
    </div>
    <h3 class="notice-item__title">${BnBC.esc(item.title)}</h3>
    <p>${BnBC.esc(item.body)}</p>
  </div>
</li>`;
  }

  function fillNews() {
    const list = document.getElementById("noticeList");
    if (!list) return;
    if (!window.BnBCFeed) {
      list.innerHTML = `<li class="notice-item notice-item--no-media"><div class="notice-item__body"><div class="alert">Berita tidak tersedia.</div></div></li>`;
      return;
    }

    try {
      const NEWS_COUNT = 3;
      const { items, images } = window.BnBCFeed.generate(NEWS_COUNT);

      if (!items || items.length === 0) {
        list.innerHTML = `<li class="notice-item notice-item--no-media"><div class="notice-item__body"><div class="alert">Belum ada berita.</div></div></li>`;
        return;
      }

      list.innerHTML = items.map((item, i) => {
        const img = images && images[i] ? images[i] : null;
        return renderNewsItem(item, img);
      }).join("");
    } catch (err) {
      console.error("News feed failed:", err);
      list.innerHTML = `<li class="notice-item notice-item--no-media"><div class="notice-item__body"><div class="alert">Gagal memuat berita.</div></div></li>`;
    }
  }

  /* ---------- Mount ---------- */

  function mount() {
    const html = renderShell();
    // Render the page immediately, then fill the news section.
    setTimeout(fillNews, 0);
    return { html, cleanup: null };
  }

  Router.route("/", mount);
  Router.route("/index.html", mount);
})();

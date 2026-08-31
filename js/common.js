/* ==========================================================================
   B&B Courses — common utilities.

   No auth, no API server, no statistics. Just:
   • getData()   — read inlined JSON from window.__BnBC_DATA
   • esc()       — HTML escape
   • mdToHtml()  — tiny Markdown renderer used by lesson theory blocks
   • mobile nav wiring on DOMContentLoaded
   ========================================================================== */

const BnBC = {
  /**
   * Read a value from the inlined data bundle (window.__BnBC_DATA,
   * populated by data-bundle.js). Throws if the key is missing.
   *
   * Supported keys:
   *   "courses"                → __BnBC_DATA.courses
   *   "vocabulary"             → __BnBC_DATA.vocabulary
   *   "lessons/<file>"         → __BnBC_DATA.lessons[<file>]
   */
  getData(key) {
    const bundle = window.__BnBC_DATA || {};
    if (key === "courses" && bundle.courses) return bundle.courses;
    if (key === "vocabulary" && bundle.vocabulary) return bundle.vocabulary;
    if (key.startsWith("lessons/") && bundle.lessons) {
      const lessonKey = key.slice("lessons/".length);
      if (bundle.lessons[lessonKey]) return bundle.lessons[lessonKey];
      throw new Error("Lesson not found: " + lessonKey);
    }
    throw new Error("Data not available: " + key);
  },

  /** Simple HTML escape */
  esc(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  /**
   * Render a small subset of Markdown to HTML.
   * Supports the features actually used by lesson theory blocks:
   *   ## / ### headings, **bold**, *italic*,
   *   tables (| a | b | with --- separator),
   *   unordered lists (- / *), ordered lists (1.), blockquotes (>).
   */
  mdToHtml(md) {
    if (!md) return "";
    const lines = String(md).replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let i = 0;
    let inList = null;       // 'ul' | 'ol' | null
    let inTable = false;
    let tableRows = [];

    function closeList() {
      if (inList) { out.push("</" + inList + ">"); inList = null; }
    }
    function closeTable() {
      if (inTable) {
        if (tableRows.length >= 2) {
          const header = tableRows[0];
          let html = '<div class="md-table-wrap"><table class="md-table"><thead><tr>';
          header.forEach(c => {
            html += '<th style="text-align:left">' + inline(c.trim()) + '</th>';
          });
          html += '</tr></thead><tbody>';
          for (let r = 2; r < tableRows.length; r++) {
            html += '<tr>';
            tableRows[r].forEach(c => {
              html += '<td style="text-align:left">' + inline(c.trim()) + '</td>';
            });
            html += '</tr>';
          }
          html += '</tbody></table></div>';
          out.push(html);
        }
        inTable = false;
        tableRows = [];
      }
    }
    function inline(s) {
      return BnBC.esc(s)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>");
    }

    while (i < lines.length) {
      const line = lines[i];

      if (/^\s*$/.test(line)) {
        closeList();
        closeTable();
        i++;
        continue;
      }

      // Tables: a | line followed by a |---| separator line
      if (/^\s*\|.*\|\s*$/.test(line)) {
        closeList();
        const nextLine = lines[i + 1] || "";
        if (/^\s*\|?[\s:\-|]+\|?\s*$/.test(nextLine) && nextLine.includes("-")) {
          if (inTable) closeTable();
          tableRows.push(
            line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|"),
            nextLine.trim().replace(/^\|/, "").replace(/\|$/, "").split("|")
          );
          i += 2;
          inTable = true;
          while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
            tableRows.push(lines[i].trim().replace(/^\|/, "").replace(/\|$/, "").split("|"));
            i++;
          }
          closeTable();
          continue;
        }
        i++;
        continue;
      }

      closeTable();

      // Headings
      const h = line.match(/^(#{1,3})\s+(.*)$/);
      if (h) {
        closeList();
        const level = h[1].length;
        out.push("<h" + level + ">" + inline(h[2]) + "</h" + level + ">");
        i++;
        continue;
      }

      // Blockquote — detect warning ("Hindari") vs tip vs generic
      if (/^\s*>\s?/.test(line)) {
        closeList();
        const quote = line.replace(/^\s*>\s?/, "");
        let cls = "blockquote";
        if (/^\s*\*\*Hindari/i.test(quote)) {
          cls = "blockquote blockquote--warning";
        } else if (/^\s*\*\*(Tip|Tips)/i.test(quote)) {
          cls = "blockquote blockquote--tip";
        }
        out.push('<blockquote class="' + cls + '">' + inline(quote) + "</blockquote>");
        i++;
        continue;
      }

      // Mini-dialog heading: lines like "**Dialog 1 (formal):**" → styled label
      const dialogMatch = line.match(/^\s*\*\*(Dialog[^*]*)\*\*\s*:?\s*$/);
      if (dialogMatch) {
        closeList();
        out.push('<div class="mini-dialog-label">' + inline(dialogMatch[1]) + "</div>");
        i++;
        continue;
      }

      // Unordered list
      if (/^\s*[-*]\s+/.test(line)) {
        if (inList !== "ul") { closeList(); out.push("<ul>"); inList = "ul"; }
        out.push("<li>" + inline(line.replace(/^\s*[-*]\s+/, "")) + "</li>");
        i++;
        continue;
      }

      // Ordered list
      if (/^\s*\d+\.\s+/.test(line)) {
        if (inList !== "ol") { closeList(); out.push("<ol>"); inList = "ol"; }
        out.push("<li>" + inline(line.replace(/^\s*\d+\.\s+/, "")) + "</li>");
        i++;
        continue;
      }

      // Paragraph
      closeList();
      out.push("<p>" + inline(line.trim()) + "</p>");
      i++;
    }

    closeList();
    closeTable();
    return out.join("\n");
  }
};

window.BnBC = BnBC;

/* ---------- Mobile nav toggle ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("is-open"));
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => links.classList.remove("is-open"));
    });
  }
});

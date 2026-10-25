/* Builds the header, footer and page content from js/data.js.
   You normally never need to edit this file. */
(function () {
  "use strict";

  var S = window.SITE || {};
  var page = document.body.getAttribute("data-page") || "";
  var tz = S.timezone || "Asia/Kolkata";

  var NAV = [
    ["index.html", "Home", "home"],
    ["karyakram.html", "Karyakram", "karyakram"],
    ["gallery.html", "Gallery", "gallery"],
    ["about.html", "About", "about"],
    ["team.html", "Team", "team"],
    ["daan.html", "Daan", "daan"],
    ["contact.html", "Contact", "contact"]
  ];

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function put(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; return el; }

  function todayISO() {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  }
  function nowMinutes() {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    var get = function (t) { return parseInt(parts.filter(function (p) { return p.type === t; })[0].value, 10); };
    return get("hour") * 60 + get("minute");
  }
  function toMin(hhmm) { var p = String(hhmm).split(":"); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function fmt12(hhmm) {
    var m = toMin(hhmm), h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    return h + ":" + (mm < 10 ? "0" : "") + mm + " " + ap;
  }
  function parseDate(iso) { return new Date(iso + "T00:00:00"); }
  function longDate(iso) { return parseDate(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); }
  function initials(name) {
    return String(name).replace(/^(sample|shri|smt|dr)\.?\s+/i, "").split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  }
  function telHref(p) { return "tel:" + String(p).replace(/[^\d+]/g, ""); }

  /* ---------- header and footer ---------- */
  function buildHeader() {
    var links = NAV.map(function (n) {
      return '<li><a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : "") + (n[2] === "daan" ? ' class="nav-daan"' : "") + ">" + n[1] + "</a></li>";
    }).join("");
    put("site-header",
      '<header class="site"><div class="wrap bar">' +
      '<a class="brand" href="index.html"><span class="mark" aria-hidden="true">ने</span>' +
      '<span class="brand-text"><strong>' + esc(S.name) + "</strong><small>" + esc(S.place) + "</small></span></a>" +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav"><span class="sr">Menu</span><i></i></button>' +
      '<nav id="nav" aria-label="Main"><ul>' + links + "</ul></nav></div></header>");
    var hdr = $("header.site"), btn = $(".nav-toggle");
    btn.addEventListener("click", function () {
      var open = hdr.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && hdr.classList.contains("open")) { hdr.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); }
    });
  }

  function buildFooter() {
    var T = S.timings || {};
    var quick = NAV.map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + "</a></li>"; }).join("");
    var addr = (S.addressLines || []).map(esc).join("<br>");
    var contact = "";
    if (S.phone) contact += '<li><a href="' + telHref(S.phone) + '">' + esc(S.phone) + "</a></li>";
    if (S.email) contact += '<li><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></li>";
    put("site-footer",
      '<footer class="site"><div class="wrap"><div class="foot-grid">' +
      '<div><p class="foot-name">' + esc(S.name) + '</p><p class="foot-hindi">' + esc(S.nameHindi || "") + "</p><p>" + addr + "</p>" +
      (contact ? "<ul>" + contact + "</ul>" : "") + "</div>" +
      "<div><h2>Daily timings</h2><ul>" +
      "<li>Opens " + fmt12(T.open) + "</li><li>Abhishek " + fmt12(T.abhishek) + "</li><li>Aarti " + fmt12(T.aarti) + "</li><li>Closes " + fmt12(T.close) + "</li></ul></div>" +
      "<div><h2>Pages</h2><ul>" + quick + "</ul></div></div>" +
      '<p class="legal">Jai Jinendra. &copy; ' + new Date().getFullYear() + " " + esc(S.name) + ", " + esc(S.place) + ".</p></div></footer>");
  }

  /* ---------- today at the mandir (home) ---------- */
  function statusModel() {
    var T = S.timings, now = nowMinutes();
    var items = [["Mandir opens", T.open], ["Abhishek", T.abhishek], ["Aarti", T.aarti], ["Mandir closes", T.close]];
    var isOpen = now >= toMin(T.open) && now < toMin(T.close);
    var nextIdx = -1, i;
    for (i = 0; i < items.length; i++) { if (toMin(items[i][1]) > now) { nextIdx = i; break; } }
    var title, sub;
    if (isOpen) {
      title = "Open now";
      sub = nextIdx === items.length - 1 ? "Closes at " + fmt12(T.close) : "Next: " + items[nextIdx][0] + " at " + fmt12(items[nextIdx][1]);
    } else if (now < toMin(T.open)) {
      title = "Closed now"; sub = "Opens at " + fmt12(T.open);
    } else {
      title = "Closed for today"; sub = "Opens tomorrow at " + fmt12(T.open);
    }
    return { items: items, nextIdx: nextIdx, isOpen: isOpen, title: title, sub: sub, now: now };
  }
  function renderPanel() {
    var m = statusModel();
    var rows = m.items.map(function (it, idx) {
      var cls = idx === m.nextIdx ? "next" : (toMin(it[1]) <= m.now ? "done" : "");
      return '<li class="' + cls + '"><span>' + it[0] + "</span><time>" + fmt12(it[1]) + "</time></li>";
    }).join("");
    put("hero-panel",
      '<div class="panel"><p class="status ' + (m.isOpen ? "is-open" : "") + '"><span class="dot" aria-hidden="true"></span><strong>' + m.title + "</strong></p>" +
      '<p class="status-sub">' + m.sub + "</p><ol class=\"timeline\">" + rows + "</ol>" +
      '<p class="panel-note">' + esc(S.timingsNote || "Times are in Indian Standard Time.") + "</p></div>");
  }

  /* ---------- announcements ---------- */
  function renderAnnouncements(limit) {
    var list = (window.ANNOUNCEMENTS || []).slice().sort(function (a, b) {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      return a.date < b.date ? 1 : -1;
    });
    if (limit) list = list.slice(0, limit);
    if (!list.length) { put("announcements", '<p class="empty">No announcements right now.</p>'); return; }
    put("announcements", '<div class="notices">' + list.map(function (a) {
      return '<article class="notice' + (a.pinned ? " pinned" : "") + '"><h3>' + esc(a.title) + '</h3><p class="when">' + esc(longDate(a.date)) + "</p><p>" + esc(a.text) + "</p></article>";
    }).join("") + "</div>");
  }

  /* ---------- karyakram ---------- */
  function eventCard(e, past) {
    var d = parseDate(e.date);
    var when = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (e.endDate && e.endDate !== e.date) when = longDate(e.date) + " to " + longDate(e.endDate);
    var meta = [when, e.time, e.place].filter(Boolean).map(esc).join(", ");
    return '<article class="event' + (past ? " past" : "") + '"><div class="date" aria-hidden="true"><b>' + d.getDate() + "</b><span>" +
      d.toLocaleDateString("en-IN", { month: "short" }) + "</span></div><div>" +
      (e.type ? '<span class="tag">' + esc(e.type) + "</span>" : "") +
      "<h3>" + esc(e.title) + '</h3><p class="meta">' + meta + "</p>" + (e.text ? "<p>" + esc(e.text) + "</p>" : "") + "</div></article>";
  }
  function splitEvents() {
    var today = todayISO(), all = window.EVENTS || [];
    var up = all.filter(function (e) { return (e.endDate || e.date) >= today; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var past = all.filter(function (e) { return (e.endDate || e.date) < today; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    return { up: up, past: past };
  }
  function renderHomeEvents() {
    var up = splitEvents().up.slice(0, 3);
    put("home-events", up.length
      ? '<div class="events">' + up.map(function (e) { return eventCard(e, false); }).join("") + "</div>"
      : '<p class="empty">No karyakram is scheduled right now. Please check again soon.</p>');
  }
  function renderKaryakram() {
    var sp = splitEvents();
    var host = document.getElementById("events");
    if (!host) return;
    function show(which) {
      var list = which === "past" ? sp.past : sp.up;
      host.innerHTML = list.length
        ? '<div class="events">' + list.map(function (e) { return eventCard(e, which === "past"); }).join("") + "</div>"
        : '<p class="empty">' + (which === "past" ? "No past karyakram to show yet." : "No karyakram is scheduled right now. Please check again soon.") + "</p>";
      Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
        t.setAttribute("aria-pressed", t.getAttribute("data-tab") === which ? "true" : "false");
      });
    }
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
      t.addEventListener("click", function () { show(t.getAttribute("data-tab")); });
    });
    show("upcoming");
  }

  /* ---------- gallery ---------- */
  function albums() {
    return (window.ALBUMS || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }
  function cover(a) { return a.cover || (a.photos && a.photos[0] && a.photos[0].src) || ""; }
  function countText(a) {
    var p = (a.photos || []).length, v = (a.videos || []).length, out = [];
    if (p) out.push(p + (p === 1 ? " photo" : " photos"));
    if (v) out.push(v + (v === 1 ? " video" : " videos"));
    return out.join(", ") || "Coming soon";
  }
  function videoBlock(v) {
    var inner = v.youtube
      ? '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.youtube) + '" title="' + esc(v.title || "Video") + '" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>'
      : '<video controls preload="metadata" src="' + esc(v.src) + '"></video>';
    return "<div><div class=\"video\">" + inner + "</div>" + (v.title ? '<p class="vcap">' + esc(v.title) + "</p>" : "") + "</div>";
  }
  function openLightbox(photos, start) {
    var idx = start, dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", "Photo viewer");
    dlg.innerHTML = '<div class="lb"><button class="x" type="button" aria-label="Close">&times;</button>' +
      '<button class="prev" type="button" aria-label="Previous photo">&#8249;</button>' +
      '<button class="next" type="button" aria-label="Next photo">&#8250;</button>' +
      '<div style="text-align:center"><img alt=""><p></p></div></div>';
    document.body.appendChild(dlg);
    var img = $("img", dlg), cap = $("p", dlg);
    function draw() {
      var p = photos[idx];
      img.src = p.src; img.alt = p.caption || "";
      cap.textContent = (p.caption ? p.caption + " (" : "(") + (idx + 1) + " of " + photos.length + ")";
    }
    function step(n) { idx = (idx + n + photos.length) % photos.length; draw(); }
    $(".x", dlg).addEventListener("click", function () { dlg.close(); });
    $(".prev", dlg).addEventListener("click", function () { step(-1); });
    $(".next", dlg).addEventListener("click", function () { step(1); });
    dlg.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { dlg.remove(); });
    draw();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function renderGallery() {
    var host = document.getElementById("gallery");
    if (!host) return;
    var id = new URLSearchParams(location.search).get("album");
    var list = albums();
    var album = id ? list.filter(function (a) { return a.id === id; })[0] : null;
    if (!album) {
      host.innerHTML = list.length
        ? '<div class="albums">' + list.map(function (a) {
          var c = cover(a);
          return '<a class="album" href="gallery.html?album=' + encodeURIComponent(a.id) + '">' +
            (c ? '<img class="thumb" loading="lazy" alt="" src="' + esc(c) + '">' : '<span class="thumb"></span>') +
            '<div class="info"><h3>' + esc(a.title) + '</h3><p class="meta">' + esc(longDate(a.date)) + " &middot; " + countText(a) + "</p></div></a>";
        }).join("") + "</div>"
        : '<p class="empty">Albums will appear here soon.</p>';
      return;
    }
    document.title = album.title + " · Gallery · " + S.name + ", " + S.place;
    var h1 = $(".page-head h1"); if (h1) h1.textContent = album.title;
    var lead = $(".page-head p"); if (lead) lead.textContent = [longDate(album.date), album.description].filter(Boolean).join(". ");
    var photos = album.photos || [];
    host.innerHTML = '<a class="back" href="gallery.html">&larr; All albums</a>' +
      (photos.length ? '<div class="photos">' + photos.map(function (p, i) {
        return '<button class="photo" type="button" data-i="' + i + '" aria-label="Open photo ' + (i + 1) + '"><img loading="lazy" alt="' + esc(p.caption || "") + '" src="' + esc(p.src) + '"></button>';
      }).join("") + "</div>" : "") +
      ((album.videos || []).length ? '<div class="videos">' + album.videos.map(videoBlock).join("") + "</div>" : "") +
      (!photos.length && !(album.videos || []).length ? '<p class="empty">This album is empty for now.</p>' : "");
    Array.prototype.forEach.call(host.querySelectorAll(".photo"), function (b) {
      b.addEventListener("click", function () { openLightbox(photos, parseInt(b.getAttribute("data-i"), 10)); });
    });
  }
  function renderHomeGallery() {
    var a = albums().filter(function (x) { return (x.photos || []).length; })[0];
    var sec = document.getElementById("home-gallery-section");
    if (!a) { if (sec) sec.hidden = true; return; }
    put("home-gallery", '<div class="photos">' + a.photos.slice(0, 4).map(function (p) {
      return '<a class="photo" href="gallery.html?album=' + encodeURIComponent(a.id) + '"><img loading="lazy" alt="' + esc(p.caption || a.title) + '" src="' + esc(p.src) + '"></a>';
    }).join("") + "</div>");
    var cap = document.getElementById("home-gallery-title"); if (cap) cap.textContent = a.title;
  }

  /* ---------- team ---------- */
  function renderTeam() {
    var groups = window.TEAM || [];
    put("team", groups.length ? groups.map(function (g) {
      return '<section class="team-group"><h2>' + esc(g.group) + '</h2><div class="people">' + (g.members || []).map(function (m) {
        return '<div class="person">' + (m.photo ? '<img class="avatar" loading="lazy" alt="" src="' + esc(m.photo) + '">' : '<div class="avatar" aria-hidden="true">' + esc(initials(m.name)) + "</div>") +
          "<h3>" + esc(m.name) + '</h3><p class="role">' + esc(m.role) + "</p>" +
          (m.phone ? '<a class="call" href="' + telHref(m.phone) + '">' + esc(m.phone) + "</a>" : "") + "</div>";
      }).join("") + "</div></section>";
    }).join("") : '<p class="empty">Team details will be added soon.</p>');
  }

  /* ---------- about ---------- */
  function renderAbout() {
    var secs = window.ABOUT || [];
    put("about-toc", secs.map(function (s) { return '<a href="#' + esc(s.id) + '">' + esc(s.title) + "</a>"; }).join(""));
    put("about", secs.map(function (s) {
      return '<section id="' + esc(s.id) + '"><h2>' + esc(s.title) + "</h2>" +
        (s.paragraphs || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
        (s.list ? "<ul>" + s.list.map(function (li) { return "<li>" + esc(li) + "</li>"; }).join("") + "</ul>" : "") + "</section>";
    }).join(""));
  }

  /* ---------- daan ---------- */
  function copyBtn(text) { return '<button class="copy" type="button" data-copy="' + esc(text) + '">Copy</button>'; }
  function renderDaan() {
    var D = window.DAAN || {};
    var host = document.getElementById("daan");
    if (!host) return;
    if (!D.enabled) { host.innerHTML = '<p class="empty">Daan details will be added soon. Please contact the mandir office.</p>'; return; }
    var cards = "";
    if (D.upiId || D.qrImage) {
      cards += '<div class="card"><h2>UPI</h2>' +
        (D.qrImage ? '<img class="qr" alt="UPI QR code for ' + esc(S.name) + '" src="' + esc(D.qrImage) + '">' : "") +
        (D.upiId ? '<dl class="rows"><div><dt>UPI ID</dt><dd>' + esc(D.upiId) + " " + copyBtn(D.upiId) + "</dd></div></dl>" : "") + "</div>";
    }
    var bankKeys = Object.keys(D.bank || {}).filter(function (k) { return D.bank[k]; });
    if (bankKeys.length) {
      cards += '<div class="card"><h2>Bank transfer</h2><dl class="rows">' + bankKeys.map(function (k) {
        var copyable = /account number|ifsc/i.test(k);
        return "<div><dt>" + esc(k) + "</dt><dd>" + esc(D.bank[k]) + (copyable ? " " + copyBtn(D.bank[k]) : "") + "</dd></div>";
      }).join("") + "</dl></div>";
    }
    if (D.inPerson) cards += '<div class="card"><h2>At the mandir</h2><p>' + esc(D.inPerson) + "</p></div>";
    host.innerHTML = (D.intro ? '<p class="measure">' + esc(D.intro) + "</p>" : "") + '<div class="cards">' + cards + "</div>" + (D.note ? '<p class="note" style="margin-top:22px">' + esc(D.note) + "</p>" : "");
    Array.prototype.forEach.call(host.querySelectorAll(".copy"), function (b) {
      b.addEventListener("click", function () {
        var t = b.getAttribute("data-copy");
        var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1800); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { b.textContent = "Select and copy"; });
        else b.textContent = "Select and copy";
      });
    });
  }

  /* ---------- contact ---------- */
  function renderContact() {
    var T = S.timings || {};
    var host = document.getElementById("contact");
    if (!host) return;
    var reach = "";
    if (S.phone) reach += '<p><a href="' + telHref(S.phone) + '">' + esc(S.phone) + "</a></p>";
    if (S.whatsapp) reach += '<p><a href="https://wa.me/' + esc(S.whatsapp) + '">Message on WhatsApp</a></p>';
    if (S.email) reach += '<p><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></p>";
    if (!reach) reach = "<p>Phone and email will be added soon.</p>";
    host.innerHTML = '<div class="cards three">' +
      '<div class="card"><h2>Address</h2><p>' + (S.addressLines || []).map(esc).join("<br>") + "</p>" +
      (S.mapLink ? '<a class="btn btn-line" href="' + esc(S.mapLink) + '" rel="noopener">Open in Maps</a>' : "") + "</div>" +
      '<div class="card"><h2>Daily timings</h2><dl class="rows">' +
      "<div><dt>Mandir opens</dt><dd>" + fmt12(T.open) + "</dd></div><div><dt>Abhishek</dt><dd>" + fmt12(T.abhishek) + "</dd></div>" +
      "<div><dt>Aarti</dt><dd>" + fmt12(T.aarti) + "</dd></div><div><dt>Mandir closes</dt><dd>" + fmt12(T.close) + "</dd></div></dl></div>" +
      '<div class="card"><h2>Get in touch</h2>' + reach + "</div></div>";
  }

  /* ---------- go ---------- */
  buildHeader();
  buildFooter();
  var el;
  if ((el = document.getElementById("hero-name"))) el.textContent = S.name;
  if ((el = document.getElementById("hero-hindi"))) el.textContent = S.nameHindi || "";
  if ((el = document.getElementById("hero-lead"))) el.textContent = S.tagline || "";

  switch (page) {
    case "home": renderPanel(); setInterval(renderPanel, 60000); renderAnnouncements(5); renderHomeEvents(); renderHomeGallery(); break;
    case "karyakram": renderKaryakram(); break;
    case "gallery": renderGallery(); break;
    case "about": renderAbout(); break;
    case "team": renderTeam(); break;
    case "daan": renderDaan(); break;
    case "contact": renderContact(); break;
  }
})();

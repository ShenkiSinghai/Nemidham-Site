/* Builds the menu, footer and every page from js/data.js and js/i18n.js.
   Hindi is the default language; the visitor can switch to English.
   You normally never need to edit this file. */
(function () {
  "use strict";

  var S = window.SITE || {};
  var UIX = window.UI || {};
  var page = document.body.getAttribute("data-page") || "";
  var tz = S.timezone || "Asia/Kolkata";
  var lang = initLang();
  var timer = null;
  var globalBound = false;
  var firstRender = true;

  /* ---------- language ---------- */
  function initLang() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    if (q === "hi" || q === "en") { saveLang(q); return q; }
    try { var v = localStorage.getItem("nj-lang"); if (v === "hi" || v === "en") return v; } catch (e) {}
    return "hi";
  }
  function saveLang(l) { try { localStorage.setItem("nj-lang", l); } catch (e) {} }

  /* UI word: t("key", {name: "x"}) */
  function t(key, vars) {
    var s = (UIX[lang] || {})[key];
    if (s == null) s = (UIX.en || {})[key];
    if (s == null) s = key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  /* Content text: a plain string, or { hi: "...", en: "..." } */
  function L(v) {
    if (v && typeof v === "object" && !Array.isArray(v) && ("hi" in v || "en" in v)) {
      var x = v[lang];
      if (x == null || x === "") x = v.en || v.hi || "";
      return x;
    }
    return v == null ? "" : v;
  }
  function loc() { return lang === "hi" ? "hi-IN" : "en-IN"; }

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function put(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; return el; }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function todayISO() {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  }
  function nowMinutes() {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    var get = function (ty) { return parseInt(parts.filter(function (p) { return p.type === ty; })[0].value, 10); };
    return get("hour") * 60 + get("minute");
  }
  function toMin(hhmm) { var p = String(hhmm).split(":"); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function fmtTime(hhmm) {
    var m = toMin(hhmm), h = Math.floor(m / 60), mm = m % 60;
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    var clock = h12 + ":" + pad2(mm);
    if (lang === "hi") {
      var part = h < 4 ? "रात" : h < 12 ? "सुबह" : h < 16 ? "दोपहर" : h < 20 ? "शाम" : "रात";
      return part + " " + clock;
    }
    return clock + " " + (h >= 12 ? "PM" : "AM");
  }
  function parseDate(iso) { return new Date(iso + "T00:00:00"); }
  function longDate(iso) { return parseDate(iso).toLocaleDateString(loc(), { day: "numeric", month: "long", year: "numeric" }); }
  function fullDate(iso) { return parseDate(iso).toLocaleDateString(loc(), { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
  function rangeText(a, b) {
    try {
      return new Intl.DateTimeFormat(loc(), { day: "numeric", month: "long", year: "numeric" }).formatRange(parseDate(a), parseDate(b));
    } catch (e) { return longDate(a) + " – " + longDate(b); }
  }
  function dateBadge(iso) {
    var d = parseDate(iso);
    return '<div class="date" aria-hidden="true"><b>' + d.getDate() + "</b><span>" + esc(d.toLocaleDateString(loc(), { month: "short" })) + "</span></div>";
  }
  function initials(name) {
    var n = String(name).replace(/^(sample|shri|smt|dr|श्री|श्रीमती|डॉ)\.?\s+/i, "");
    return n.split(/\s+/).slice(0, 2).map(function (w) { return Array.from(w)[0] || ""; }).join("").toUpperCase();
  }
  function telHref(p) { return "tel:" + String(p).replace(/[^\d+]/g, ""); }
  function showTimings() { return S.showTimings !== false && S.timings; }

  var SOCIAL = [
    ["whatsappGroup", "social.whatsapp"],
    ["facebook", "social.facebook"],
    ["instagram", "social.instagram"],
    ["youtube", "social.youtube"]
  ];
  function socialList() {
    var s = S.social || {};
    return SOCIAL.filter(function (x) { return s[x[0]]; }).map(function (x) { return { url: s[x[0]], label: t(x[1]) }; });
  }

  /* ---------- menu ---------- */
  var NAV = [
    { k: "nav.home", href: "index.html", p: "home" },
    { k: "nav.yojana", href: "yojana.html", p: "yojana" },
    { k: "nav.karyakram", id: "kar", kids: [
      { k: "nav.karyakram_all", href: "karyakram.html", p: "karyakram" },
      { k: "nav.calendar", href: "calendar.html", p: "calendar" }
    ] },
    { k: "nav.gallery", href: "gallery.html", p: "gallery" },
    { k: "nav.about", id: "abt", kids: [
      { k: "nav.about_mandir", href: "about.html", p: "about" },
      { k: "nav.team", href: "team.html", p: "team" },
      { k: "nav.dharmshala", soon: true }
    ] },
    { k: "nav.visit", href: "visit.html", p: "visit" },
    { k: "nav.daan", href: "daan.html", p: "daan" }
  ];

  function navLink(n) {
    return '<a href="' + n.href + '"' + (n.p === page ? ' aria-current="page"' : "") + (n.cls ? ' class="' + n.cls + '"' : "") + ">" + esc(t(n.k)) + "</a>";
  }
  function navItem(n) {
    if (!n.kids) return "<li>" + navLink(n) + "</li>";
    var current = n.kids.some(function (c) { return c.p === page; });
    return '<li class="has-sub' + (current ? " current" : "") + '"><button type="button" class="sub-toggle" aria-expanded="false" aria-controls="sub-' + n.id + '">' +
      esc(t(n.k)) + '<span class="caret" aria-hidden="true"></span></button><ul class="sub" id="sub-' + n.id + '">' +
      n.kids.map(function (c) {
        return c.soon
          ? '<li><span class="soon-item">' + esc(t(c.k)) + "<small>" + esc(t("soon")) + "</small></span></li>"
          : "<li>" + navLink(c) + "</li>";
      }).join("") + "</ul></li>";
  }

  function closeSubs() {
    $$(".has-sub.open").forEach(function (li) {
      li.classList.remove("open");
      var b = $(".sub-toggle", li); if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  function buildHeader() {
    put("site-header",
      '<header class="site"><div class="wrap bar">' +
      '<a class="brand" href="index.html"><span class="mark" aria-hidden="true">ने</span>' +
      '<span class="brand-text"><strong>' + esc(L(S.name)) + "</strong><small>" + esc(L(S.place)) + "</small></span></a>" +
      '<nav id="nav" aria-label="' + esc(t("menu")) + '"><ul>' + NAV.map(navItem).join("") + "</ul></nav>" +
      '<div class="bar-right"><button class="lang" type="button" lang="' + esc(t("lang.code")) + '" aria-label="' + esc(t("lang.aria")) + '">' + esc(t("lang.btn")) + "</button>" +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav"><span class="sr">' + esc(t("menu")) + "</span><i></i></button></div>" +
      "</div></header>");

    var hdr = $("header.site"), btn = $(".nav-toggle", hdr);
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = hdr.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".sub-toggle", hdr).forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        var li = b.parentNode, willOpen = !li.classList.contains("open");
        closeSubs();
        if (willOpen) { li.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
      });
    });
    $(".lang", hdr).addEventListener("click", function () {
      lang = t("lang.code");
      saveLang(lang);
      render();
    });

    if (!globalBound) {
      globalBound = true;
      document.addEventListener("click", function (e) { if (!e.target.closest || !e.target.closest(".has-sub")) closeSubs(); });
      document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        closeSubs();
        var h = $("header.site");
        if (h && h.classList.contains("open")) { h.classList.remove("open"); var b = $(".nav-toggle", h); b.setAttribute("aria-expanded", "false"); b.focus(); }
      });
    }
  }

  function buildBanner() {
    var host = document.getElementById("site-banner");
    if (!host) return;
    var B = window.BANNER || {}, dismissed = false;
    try { dismissed = sessionStorage.getItem("nj-banner") === "1"; } catch (e) {}
    if (!B.enabled || dismissed || !L(B.text)) { host.innerHTML = ""; return; }
    host.innerHTML = '<div class="topbar"><div class="wrap topbar-in"><p>' + esc(L(B.text)) +
      (B.link ? ' <a href="' + esc(B.link) + '">' + esc(L(B.linkText) || t("banner.more")) + "</a>" : "") +
      '</p><button type="button" class="topbar-x" aria-label="' + esc(t("lb.close")) + '">&times;</button></div></div>';
    $(".topbar-x", host).addEventListener("click", function () {
      try { sessionStorage.setItem("nj-banner", "1"); } catch (e) {}
      host.innerHTML = "";
    });
  }

  /* ---------- footer ---------- */
  function buildFooter() {
    var pages = [["index.html", "nav.home"], ["yojana.html", "nav.yojana"], ["karyakram.html", "nav.karyakram_all"], ["calendar.html", "nav.calendar"],
      ["gallery.html", "nav.gallery"], ["about.html", "nav.about_mandir"], ["team.html", "nav.team"], ["visit.html", "nav.visit"], ["daan.html", "nav.daan"]];
    var addr = (L(S.addressLines) || []).map(function (a) { return esc(L(a)); }).join("<br>");
    var contact = "";
    if (S.phone) contact += '<li><a href="' + telHref(S.phone) + '">' + esc(S.phone) + "</a></li>";
    if (S.email) contact += '<li><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></li>";
    var soc = socialList().map(function (s) { return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a></li>"; }).join("");
    var T = S.timings || {};
    var timings = showTimings()
      ? "<div><h2>" + esc(t("f.timings")) + "</h2><ul><li>" + esc(t("tm.open")) + ": " + fmtTime(T.open) + "</li><li>" + esc(t("tm.abhishek")) + ": " + fmtTime(T.abhishek) +
        "</li><li>" + esc(t("tm.aarti")) + ": " + fmtTime(T.aarti) + "</li><li>" + esc(t("tm.close")) + ": " + fmtTime(T.close) + "</li></ul></div>"
      : "";
    put("site-footer",
      '<footer class="site"><div class="wrap"><div class="foot-grid">' +
      '<div><p class="foot-name">' + esc(L(S.name)) + '</p><p class="foot-hindi">' + esc(lang === "hi" ? S.name.en : S.name.hi) + "</p><p>" + addr + "</p>" +
      (contact ? "<ul>" + contact + "</ul>" : "") + "</div>" +
      timings +
      "<div><h2>" + esc(t("f.pages")) + "</h2><ul>" + pages.map(function (p) { return '<li><a href="' + p[0] + '">' + esc(t(p[1])) + "</a></li>"; }).join("") + "</ul>" +
      (soc ? "<h2 style=\"margin-top:1.2em\">" + esc(t("home.connect")) + "</h2><ul>" + soc + "</ul>" : "") + "</div></div>" +
      '<p class="legal">' + esc(t("f.legal", { year: new Date().getFullYear(), name: L(S.name), place: L(S.place) })) + "</p></div></footer>");
  }

  /* ---------- static texts ---------- */
  function applyStatic() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    var sk = $(".skip"); if (sk) sk.textContent = t("skip");
    var nm = L(S.name) + ", " + L(S.place);
    document.title = page === "home" ? nm : t("p." + page + ".h1") + " · " + nm;
  }

  /* ---------- home: hero ---------- */
  function renderHero() {
    var h1 = document.getElementById("hero-name"); if (!h1) return;
    h1.textContent = L(S.name);
    put("hero-sub", esc(lang === "hi" ? S.name.en : S.name.hi));
    var lead = document.getElementById("hero-lead"); if (lead) lead.textContent = L(S.tagline);
    var hero = document.getElementById("hero");
    if (hero && S.heroImage) {
      hero.classList.add("has-img");
      hero.style.backgroundImage = "linear-gradient(rgba(18,32,58,.82),rgba(18,32,58,.82)),url('" + String(S.heroImage).replace(/'/g, "%27") + "')";
    }
    var grid = document.getElementById("hero-grid");
    if (grid) grid.classList.toggle("solo", !showTimings());
  }

  function statusModel() {
    var T = S.timings, now = nowMinutes();
    var items = [["tm.open", T.open], ["tm.abhishek", T.abhishek], ["tm.aarti", T.aarti], ["tm.close", T.close]];
    var isOpen = now >= toMin(T.open) && now < toMin(T.close);
    var nextIdx = -1, i;
    for (i = 0; i < items.length; i++) { if (toMin(items[i][1]) > now) { nextIdx = i; break; } }
    var title, sub;
    if (isOpen) {
      title = t("status.open");
      sub = nextIdx === items.length - 1 ? t("status.closesAt", { time: fmtTime(T.close) }) : t("status.next", { what: t(items[nextIdx][0]), time: fmtTime(items[nextIdx][1]) });
    } else if (now < toMin(T.open)) {
      title = t("status.closed"); sub = t("status.opensAt", { time: fmtTime(T.open) });
    } else {
      title = t("status.closedToday"); sub = t("status.opensTomorrow", { time: fmtTime(T.open) });
    }
    return { items: items, nextIdx: nextIdx, isOpen: isOpen, title: title, sub: sub, now: now };
  }
  function renderPanel() {
    if (!showTimings()) { put("hero-panel", ""); return; }
    var m = statusModel();
    var rows = m.items.map(function (it, idx) {
      var cls = idx === m.nextIdx ? "next" : (toMin(it[1]) <= m.now ? "done" : "");
      return '<li class="' + cls + '"><span>' + esc(t(it[0])) + "</span><time>" + esc(fmtTime(it[1])) + "</time></li>";
    }).join("");
    put("hero-panel",
      '<div class="panel"><p class="status ' + (m.isOpen ? "is-open" : "") + '"><span class="dot" aria-hidden="true"></span><strong>' + esc(m.title) + "</strong></p>" +
      '<p class="status-sub">' + esc(m.sub) + '</p><ol class="timeline">' + rows + "</ol>" +
      '<p class="panel-note">' + esc(L(S.timingsNote) || t("tm.note")) + "</p></div>");
  }

  /* ---------- announcements ---------- */
  function renderAnnouncements(limit) {
    var list = (window.ANNOUNCEMENTS || []).slice().sort(function (a, b) {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      return a.date < b.date ? 1 : -1;
    });
    if (limit) list = list.slice(0, limit);
    if (!list.length) { put("announcements", '<p class="empty">' + esc(t("empty.notices")) + "</p>"); return; }
    put("announcements", '<div class="notices">' + list.map(function (a) {
      return '<article class="notice' + (a.pinned ? " pinned" : "") + '"><h3>' + esc(L(a.title)) + '</h3><p class="when">' + esc(longDate(a.date)) + "</p><p>" + esc(L(a.text)) + "</p></article>";
    }).join("") + "</div>");
  }

  /* ---------- yojana ---------- */
  function yojanaCard(y, compact) {
    var st = y.status || "active";
    var chip = '<span class="chip chip-' + esc(st) + '">' + esc(t("st." + st)) + "</span>";
    if (compact) {
      return '<article class="yojana compact"><div class="yhead"><h3><a href="yojana.html#' + esc(y.id) + '">' + esc(L(y.title)) + "</a></h3>" + chip + "</div><p>" + esc(L(y.short)) + "</p></article>";
    }
    var det = (y.details || []).filter(function (d) { return L(d); }).map(function (d) { return "<li>" + esc(L(d)) + "</li>"; }).join("");
    var money = "";
    if (y.target) money += "<div><dt>" + esc(t("y.target")) + "</dt><dd>" + esc(y.target) + "</dd></div>";
    if (y.raised) money += "<div><dt>" + esc(t("y.raised")) + "</dt><dd>" + esc(y.raised) + "</dd></div>";
    var btn = st === "soon" ? '<a class="btn btn-line" href="visit.html#contact">' + esc(t("y.ask")) + "</a>"
      : st === "done" ? "" : '<a class="btn btn-primary" href="daan.html#how">' + esc(t("y.give")) + "</a>";
    return '<article class="yojana" id="' + esc(y.id) + '"><div class="yhead"><h3>' + esc(L(y.title)) + "</h3>" + chip + "</div><p>" + esc(L(y.summary || y.short)) + "</p>" +
      (det ? "<ul>" + det + "</ul>" : "") + (money ? '<dl class="rows">' + money + "</dl>" : "") + (btn ? '<div class="btn-row">' + btn + "</div>" : "") + "</article>";
  }
  function renderYojanaPage() {
    var host = document.getElementById("yojana-list"); if (!host) return;
    var all = window.YOJANA || [];
    var now = all.filter(function (y) { return y.status !== "soon"; });
    var later = all.filter(function (y) { return y.status === "soon"; });
    host.innerHTML = '<p class="measure">' + esc(t("y.intro")) + "</p>" +
      (now.length ? '<section><h2>' + esc(t("y.now")) + '</h2><div class="ylist">' + now.map(function (y) { return yojanaCard(y); }).join("") + "</div></section>" : "") +
      (later.length ? '<section><h2>' + esc(t("y.later")) + '</h2><div class="ylist">' + later.map(function (y) { return yojanaCard(y); }).join("") + "</div></section>" : "");
  }
  function renderHomeYojana() {
    var all = window.YOJANA || [];
    put("home-yojana", all.length ? '<div class="cards three">' + all.map(function (y) { return yojanaCard(y, true); }).join("") + "</div>" : "");
  }

  /* ---------- karyakram + calendar ---------- */
  function eventCard(e, past) {
    var when = e.endDate && e.endDate !== e.date ? rangeText(e.date, e.endDate) : fullDate(e.date);
    var meta = [when, L(e.time), L(e.place)].filter(Boolean).map(esc).join(", ");
    return '<article class="event' + (past ? " past" : "") + '">' + dateBadge(e.date) + "<div>" +
      (L(e.type) ? '<span class="tag">' + esc(L(e.type)) + "</span>" : "") +
      "<h3>" + esc(L(e.title)) + '</h3><p class="meta">' + meta + "</p>" + (L(e.text) ? "<p>" + esc(L(e.text)) + "</p>" : "") + "</div></article>";
  }
  function splitByDate(list, endKey) {
    var today = todayISO();
    var up = list.filter(function (e) { return (e[endKey] || e.date) >= today; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var past = list.filter(function (e) { return (e[endKey] || e.date) < today; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    return { up: up, past: past };
  }
  function tabsHtml() {
    return '<div class="tabs" role="group" aria-label="' + esc(t("tabs.aria")) + '"><button class="tab" type="button" data-tab="upcoming" aria-pressed="true">' + esc(t("tab.upcoming")) +
      '</button><button class="tab" type="button" data-tab="past" aria-pressed="false">' + esc(t("tab.past")) + "</button></div>";
  }
  function wireTabs(host, show) {
    $$(".tab", host).forEach(function (b) {
      b.addEventListener("click", function () {
        var which = b.getAttribute("data-tab");
        $$(".tab", host).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        show(which);
      });
    });
    show("upcoming");
  }
  function renderHomeEvents() {
    var up = splitByDate(window.EVENTS || [], "endDate").up.slice(0, 3);
    put("home-events", up.length ? '<div class="events">' + up.map(function (e) { return eventCard(e, false); }).join("") + "</div>" : '<p class="empty">' + esc(t("empty.events")) + "</p>");
  }
  function renderKaryakram() {
    var host = document.getElementById("events"); if (!host) return;
    var sp = splitByDate(window.EVENTS || [], "endDate");
    host.innerHTML = '<p><a class="more" href="calendar.html">' + esc(t("nav.calendar")) + '</a></p>' + tabsHtml() + '<div id="events-list" aria-live="polite"></div>';
    var list = $("#events-list", host);
    wireTabs(host, function (which) {
      var items = which === "past" ? sp.past : sp.up;
      list.innerHTML = items.length ? '<div class="events">' + items.map(function (e) { return eventCard(e, which === "past"); }).join("") + "</div>"
        : '<p class="empty">' + esc(t(which === "past" ? "empty.past" : "empty.events")) + "</p>";
    });
  }
  function calCard(c, past) {
    var type = c.type || "other";
    return '<article class="event' + (past ? " past" : "") + '">' + dateBadge(c.date) + "<div>" +
      '<span class="tag tag-' + esc(type) + '">' + esc(t("cal." + type)) + "</span>" +
      "<h3>" + esc(L(c.title)) + '</h3><p class="meta">' + esc(fullDate(c.date)) + "</p>" + (L(c.note) ? "<p>" + esc(L(c.note)) + "</p>" : "") + "</div></article>";
  }
  function renderCalendar() {
    var host = document.getElementById("calendar"); if (!host) return;
    var sp = splitByDate(window.CALENDAR || [], "date");
    host.innerHTML = tabsHtml() + '<div id="cal-list" aria-live="polite"></div><p class="fine">' + esc(t("cal.note")) + "</p>";
    var list = $("#cal-list", host);
    wireTabs(host, function (which) {
      var items = which === "past" ? sp.past : sp.up;
      list.innerHTML = items.length ? '<div class="events">' + items.map(function (c) { return calCard(c, which === "past"); }).join("") + "</div>"
        : '<p class="empty">' + esc(t(which === "past" ? "empty.cal.past" : "empty.cal.up")) + "</p>";
    });
  }

  /* ---------- gallery ---------- */
  function albums() { return (window.ALBUMS || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }); }
  function cover(a) { return a.cover || (a.photos && a.photos[0] && a.photos[0].src) || ""; }
  function countText(a) {
    var p = (a.photos || []).length, v = (a.videos || []).length, out = [];
    if (p) out.push(t("g.photos", { n: p }));
    if (v) out.push(t("g.videos", { n: v }));
    return out.join(", ") || t("g.soon");
  }
  function videoBlock(v) {
    var ttl = L(v.title) || t("g.videos", { n: 1 });
    var inner = v.youtube
      ? '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.youtube) + '" title="' + esc(ttl) + '" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>'
      : '<video controls preload="metadata" src="' + esc(v.src) + '"></video>';
    return '<div><div class="video">' + inner + "</div>" + (L(v.title) ? '<p class="vcap">' + esc(L(v.title)) + "</p>" : "") + "</div>";
  }
  function openLightbox(photos, start) {
    var idx = start, dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", t("lb.label"));
    dlg.innerHTML = '<div class="lb"><button class="x" type="button" aria-label="' + esc(t("lb.close")) + '">&times;</button>' +
      '<button class="prev" type="button" aria-label="' + esc(t("lb.prev")) + '">&#8249;</button>' +
      '<button class="next" type="button" aria-label="' + esc(t("lb.next")) + '">&#8250;</button>' +
      '<div style="text-align:center"><img alt=""><p></p></div></div>';
    document.body.appendChild(dlg);
    var img = $("img", dlg), cap = $("p", dlg);
    function draw() {
      var p = photos[idx], c = L(p.caption);
      img.src = p.src; img.alt = c;
      cap.textContent = (c ? c + " (" : "(") + (idx + 1) + " / " + photos.length + ")";
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
    var host = document.getElementById("gallery"); if (!host) return;
    var id = null;
    try { id = new URLSearchParams(location.search).get("album"); } catch (e) {}
    var list = albums();
    var album = id ? list.filter(function (a) { return a.id === id; })[0] : null;
    if (!album) {
      host.innerHTML = list.length
        ? '<div class="albums">' + list.map(function (a) {
          var c = cover(a);
          return '<a class="album" href="gallery.html?album=' + encodeURIComponent(a.id) + '">' +
            (c ? '<img class="thumb" loading="lazy" alt="" src="' + esc(c) + '">' : '<span class="thumb"></span>') +
            '<div class="info"><h3>' + esc(L(a.title)) + '</h3><p class="meta">' + esc(longDate(a.date)) + " &middot; " + esc(countText(a)) + "</p></div></a>";
        }).join("") + "</div>"
        : '<p class="empty">' + esc(t("empty.albums")) + "</p>";
      return;
    }
    document.title = L(album.title) + " · " + t("p.gallery.h1") + " · " + L(S.name) + ", " + L(S.place);
    var h1 = $(".page-head h1"); if (h1) h1.textContent = L(album.title);
    var lead = $(".page-head p"); if (lead) lead.textContent = [longDate(album.date), L(album.description)].filter(Boolean).join(". ");
    var photos = album.photos || [];
    host.innerHTML = '<a class="back" href="gallery.html">' + esc(t("g.back")) + "</a>" +
      (photos.length ? '<div class="photos">' + photos.map(function (p, i) {
        return '<button class="photo" type="button" data-i="' + i + '" aria-label="' + esc(t("g.open", { n: i + 1 })) + '"><img loading="lazy" alt="' + esc(L(p.caption)) + '" src="' + esc(p.src) + '"></button>';
      }).join("") + "</div>" : "") +
      ((album.videos || []).length ? '<div class="videos">' + album.videos.map(videoBlock).join("") + "</div>" : "") +
      (!photos.length && !(album.videos || []).length ? '<p class="empty">' + esc(t("empty.album")) + "</p>" : "");
    $$(".photo", host).forEach(function (b) {
      b.addEventListener("click", function () { openLightbox(photos, parseInt(b.getAttribute("data-i"), 10)); });
    });
  }
  function renderHomeGallery() {
    var a = albums().filter(function (x) { return (x.photos || []).length; })[0];
    var sec = document.getElementById("home-gallery-section");
    if (!a) { if (sec) sec.hidden = true; return; }
    if (sec) sec.hidden = false;
    put("home-gallery", '<div class="photos">' + a.photos.slice(0, 4).map(function (p) {
      return '<a class="photo" href="gallery.html?album=' + encodeURIComponent(a.id) + '"><img loading="lazy" alt="' + esc(L(p.caption) || L(a.title)) + '" src="' + esc(p.src) + '"></a>';
    }).join("") + "</div>");
    var cap = document.getElementById("home-gallery-title"); if (cap) cap.textContent = L(a.title);
  }

  /* ---------- team + about ---------- */
  function renderTeam() {
    var groups = window.TEAM || [];
    put("team", groups.length ? groups.map(function (g) {
      return '<section class="team-group"><h2>' + esc(L(g.group)) + '</h2><div class="people">' + (g.members || []).map(function (m) {
        var nm = L(m.name);
        return '<div class="person">' + (m.photo ? '<img class="avatar" loading="lazy" alt="" src="' + esc(m.photo) + '">' : '<div class="avatar" aria-hidden="true">' + esc(initials(nm)) + "</div>") +
          "<h3>" + esc(nm) + '</h3><p class="role">' + esc(L(m.role)) + "</p>" +
          (m.phone ? '<a class="call" href="' + telHref(m.phone) + '">' + esc(m.phone) + "</a>" : "") + "</div>";
      }).join("") + "</div></section>";
    }).join("") : '<p class="empty">' + esc(t("empty.team")) + "</p>");
  }
  function renderAbout() {
    var secs = window.ABOUT || [];
    put("about-toc", '<p class="sr">' + esc(t("about.toc")) + "</p>" + secs.map(function (s) { return '<a href="#' + esc(s.id) + '">' + esc(L(s.title)) + "</a>"; }).join(""));
    put("about", secs.map(function (s) {
      return '<section id="' + esc(s.id) + '"><h2>' + esc(L(s.title)) + "</h2>" +
        (s.paragraphs || []).map(function (p) { return "<p>" + esc(L(p)) + "</p>"; }).join("") +
        (s.list ? "<ul>" + s.list.map(function (li) { return "<li>" + esc(L(li)) + "</li>"; }).join("") + "</ul>" : "") + "</section>";
    }).join(""));
  }

  /* ---------- daan ---------- */
  function copyBtn(text) { return '<button class="copy" type="button" data-copy="' + esc(text) + '">' + esc(t("copy")) + "</button>"; }
  function renderDaan() {
    var D = window.DAAN || {};
    var host = document.getElementById("daan"); if (!host) return;
    if (!D.enabled) { host.innerHTML = '<p class="empty">' + esc(t("d.soon")) + "</p>"; return; }
    var html = L(D.intro) ? '<p class="measure">' + esc(L(D.intro)) + "</p>" : "";

    var cards = "";
    if (D.upiId || D.qrImage) {
      cards += '<div class="card"><h3>' + esc(t("d.upi")) + "</h3>" +
        (D.qrImage ? '<img class="qr" alt="' + esc(t("d.upi") + " QR, " + L(S.name)) + '" src="' + esc(D.qrImage) + '">' : "") +
        (D.upiId ? '<dl class="rows"><div><dt>' + esc(t("d.upiid")) + "</dt><dd>" + esc(D.upiId) + " " + copyBtn(D.upiId) + "</dd></div></dl>" : "") + "</div>";
    }
    var bank = (D.bank || []).filter(function (b) { return b.value; });
    if (bank.length) {
      cards += '<div class="card"><h3>' + esc(t("d.bank")) + '</h3><dl class="rows">' + bank.map(function (b) {
        return "<div><dt>" + esc(L(b.label)) + "</dt><dd>" + esc(L(b.value)) + (b.copy ? " " + copyBtn(L(b.value)) : "") + "</dd></div>";
      }).join("") + "</dl></div>";
    }
    if (L(D.inPerson)) cards += '<div class="card"><h3>' + esc(t("d.person")) + "</h3><p>" + esc(L(D.inPerson)) + "</p></div>";
    html += '<section id="how"><h2>' + esc(t("d.how")) + '</h2><div class="cards three">' + cards + "</div>" +
      (L(D.note) ? '<p class="note">' + esc(L(D.note)) + "</p>" : "") + "</section>";

    var R = window.RECURRING || [];
    if (R.length) {
      html += '<section id="regular"><h2>' + esc(t("d.regular")) + '</h2><p class="measure">' + esc(t("d.regular_p")) + '</p><div class="cards three">' + R.map(function (r) {
        return '<div class="card"><span class="tag">' + esc(L(r.when)) + "</span><h3>" + esc(L(r.title)) + "</h3><p>" + esc(L(r.text)) + "</p>" +
          (L(r.how) ? '<p class="fine">' + esc(L(r.how)) + "</p>" : "") + "</div>";
      }).join("") + "</div></section>";
    }

    var TR = window.TRUST || {};
    if (TR.enabled !== false) {
      var tr = (TR.items || []).filter(function (x) { return x.value; });
      html += '<section id="trust"><h2>' + esc(t("d.trust")) + "</h2>" + (tr.length
        ? '<div class="card"><dl class="rows">' + tr.map(function (x) { return "<div><dt>" + esc(L(x.label)) + "</dt><dd>" + esc(L(x.value)) + "</dd></div>"; }).join("") + "</dl></div>"
        : '<p class="empty">' + esc(t("d.trust_soon")) + "</p>") + (L(TR.note) ? '<p class="fine">' + esc(L(TR.note)) + "</p>" : "") + "</section>";
    }

    html += '<section id="yojana"><h2>' + esc(t("d.yojana")) + '</h2><p class="measure">' + esc(t("d.yojana_p")) + '</p><a class="btn btn-line" href="yojana.html">' + esc(t("d.yojana_btn")) + "</a></section>";

    var P = (window.PUNYARJAK || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    if (P.length) {
      html += '<section id="punyarjak"><h2>' + esc(t("d.punya")) + '</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">' + esc(t("d.col_date")) + '</th><th scope="col">' +
        esc(t("d.col_kind")) + '</th><th scope="col">' + esc(t("d.col_name")) + "</th></tr></thead><tbody>" + P.map(function (p) {
          return "<tr><td>" + esc(longDate(p.date)) + "</td><td>" + esc(t("kind." + p.kind)) + "</td><td>" + esc(L(p.name)) + "</td></tr>";
        }).join("") + "</tbody></table></div></section>";
    }
    html += '<p class="thanks">' + esc(t("d.thanks")) + "</p>";
    host.innerHTML = html;

    $$(".copy", host).forEach(function (b) {
      b.addEventListener("click", function () {
        var txt = b.getAttribute("data-copy");
        var done = function () { b.textContent = t("copied"); setTimeout(function () { b.textContent = t("copy"); }, 1800); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { b.textContent = t("copyfail"); });
        else b.textContent = t("copyfail");
      });
    });
  }

  /* ---------- visit ---------- */
  function mapSrc() {
    if (S.mapEmbed) return S.mapEmbed;
    if (S.mapQuery) return "https://maps.google.com/maps?q=" + encodeURIComponent(S.mapQuery) + "&z=15&output=embed";
    return "";
  }
  function mapOpen() {
    if (S.mapLink) return S.mapLink;
    if (S.mapQuery) return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.mapQuery);
    return "";
  }
  function renderVisit() {
    var host = document.getElementById("visit"); if (!host) return;
    var src = mapSrc(), open = mapOpen(), T = S.timings || {};
    var html = '<section id="map"><h2>' + esc(t("v.map")) + "</h2>" +
      (src ? '<div class="mapbox"><iframe title="' + esc(t("v.maptitle")) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' + esc(src) + '"></iframe></div>' : '<p class="empty">' + esc(t("v.nomap")) + "</p>") +
      (open ? '<p><a class="btn btn-primary" href="' + esc(open) + '" target="_blank" rel="noopener">' + esc(t("v.open")) + "</a></p>" : "") + "</section>";

    var reach = "";
    if (S.phone) reach += '<p><a href="' + telHref(S.phone) + '">' + esc(S.phone) + "</a></p>";
    if (S.whatsapp) reach += '<p><a href="https://wa.me/' + esc(S.whatsapp) + '" target="_blank" rel="noopener">' + esc(t("v.wa")) + "</a></p>";
    if (S.email) reach += '<p><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></p>";
    if (!reach) reach = "<p>" + esc(t("v.nocontact")) + "</p>";

    html += '<div class="cards three"><div class="card" id="address"><h2>' + esc(t("v.address")) + "</h2><p>" +
      (L(S.addressLines) || []).map(function (a) { return esc(L(a)); }).join("<br>") + '</p></div><div class="card" id="contact"><h2>' + esc(t("v.contact")) + "</h2>" + reach + "</div>" +
      (showTimings() ? '<div class="card"><h2>' + esc(t("v.timings")) + '</h2><dl class="rows">' +
        "<div><dt>" + esc(t("tm.open")) + "</dt><dd>" + esc(fmtTime(T.open)) + "</dd></div>" +
        "<div><dt>" + esc(t("tm.abhishek")) + "</dt><dd>" + esc(fmtTime(T.abhishek)) + "</dd></div>" +
        "<div><dt>" + esc(t("tm.aarti")) + "</dt><dd>" + esc(fmtTime(T.aarti)) + "</dd></div>" +
        "<div><dt>" + esc(t("tm.close")) + "</dt><dd>" + esc(fmtTime(T.close)) + "</dd></div></dl></div>" : "") + "</div>";

    var how = window.HOWTO || [];
    if (how.length) {
      html += '<section id="reach"><h2>' + esc(t("v.reach")) + '</h2><div class="cards">' + how.map(function (h) {
        return '<div class="card"><h3>' + esc(L(h.title)) + "</h3><p>" + esc(L(h.text)) + "</p></div>";
      }).join("") + "</div></section>";
    }
    var soc = socialList();
    if (soc.length) {
      html += '<section id="follow"><h2>' + esc(t("v.follow")) + '</h2><div class="btn-row">' + soc.map(function (s) {
        return '<a class="btn btn-line" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>";
      }).join("") + "</div></section>";
    }
    host.innerHTML = html;
  }

  /* ---------- home: connect ---------- */
  function renderConnect() {
    var sec = document.getElementById("home-connect-section"); if (!sec) return;
    var soc = socialList();
    sec.hidden = !soc.length;
    put("home-connect", '<div class="btn-row">' + soc.map(function (s, i) {
      return '<a class="btn ' + (i === 0 ? "btn-primary" : "btn-line") + '" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>";
    }).join("") + "</div>");
  }

  /* ---------- go ---------- */
  function render() {
    if (timer) { clearInterval(timer); timer = null; }
    buildBanner();
    buildHeader();
    buildFooter();
    applyStatic();
    switch (page) {
      case "home":
        renderHero(); renderPanel(); timer = setInterval(renderPanel, 60000);
        renderHomeYojana(); renderAnnouncements(5); renderHomeEvents(); renderHomeGallery(); renderConnect();
        break;
      case "yojana": renderYojanaPage(); break;
      case "karyakram": renderKaryakram(); break;
      case "calendar": renderCalendar(); break;
      case "gallery": renderGallery(); break;
      case "about": renderAbout(); break;
      case "team": renderTeam(); break;
      case "daan": renderDaan(); break;
      case "visit": renderVisit(); break;
    }
    if (firstRender) {
      firstRender = false;
      if (location.hash.length > 1) {
        var el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (el) el.scrollIntoView();
      }
    }
  }
  render();
})();

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
  function vis(list) { return (list || []).filter(function (x) { return !x.hidden; }); }
  function showTimings() { return S.showTimings !== false && S.timings; }

  var SOCIAL = [
    ["whatsappGroup", "social.whatsapp", "wa"],
    ["facebook", "social.facebook", "fb"],
    ["instagram", "social.instagram", "ig"],
    ["youtube", "social.youtube", "yt"]
  ];
  /* Always lists all four platforms. url is "" when not filled in yet; the caller
     should then show the icon greyed out and not clickable. */
  function socialList() {
    var s = S.social || {};
    return SOCIAL.map(function (x) { return { url: s[x[0]] || "", label: t(x[1]), icon: x[2] }; });
  }
  var ICON_SVG = {
    wa: '<path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 1.8a8.2 8.2 0 017 12.5l-.2.4.6 2.3-2.4-.6-.4.2a8.2 8.2 0 11-4.6-14.8zm-3.4 4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.2.2 2 3 4.7 4.2 2.3 1 2.7.8 3.2.8.5 0 1.6-.6 1.8-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3l-2-1c-.3-.1-.5-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.8-1.4-1.7-1.5-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.4-.5-.6-.5h-.6z"/>',
    fb: '<path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.9.2-1.5 1.6-1.5h1.6V4.2C16.3 4.1 15.3 4 14.2 4c-2.4 0-4 1.5-4 4.1v2.3H7.6v3h2.6V21h3.3z"/>',
    ig: '<path d="M8 3h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5zm0 2a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3V8a3 3 0 00-3-3H8zm4 3.5A4.5 4.5 0 1112 17a4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM17.2 6.8a1 1 0 110 2 1 1 0 010-2z"/>',
    yt: '<path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.6-.8-2-.9C15.9 4 12 4 12 4h0s-3.9 0-6.8.2c-.4 0-1.2.1-2 .9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.7v1.6C2.2 14 2.4 15.8 2.4 15.8s.2 1.5.8 2.1c.8.8 1.8.8 2.3.9 1.6.2 7 .2 7 .2s3.9 0 6.8-.3c.4 0 1.2-.1 2-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.5v-1.6c0-1.7-.2-3.5-.2-3.5zM9.9 14.6V8.9l5.4 2.9-5.4 2.8z"/>'
  };
  function socialIconsHtml(cls) {
    return socialList().map(function (s) {
      var svg = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICON_SVG[s.icon] || "") + "</svg>";
      return s.url
        ? '<a class="' + cls + '" href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '">' + svg + "</a>"
        : '<span class="' + cls + ' off" aria-hidden="true" title="' + esc(s.label) + '">' + svg + "</span>";
    }).join("");
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
      '<a class="brand" href="index.html">' + (S.logo ? '<img class="mark" src="' + esc(S.logo) + '" alt="">' : '<span class="mark" aria-hidden="true">ने</span>') + '' +
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

  function ensureTop() {
    if (document.getElementById("site-top")) return;
    var b = document.getElementById("site-banner"), h = document.getElementById("site-header");
    if (!b || !h) return;
    var top = document.createElement("div");
    top.id = "site-top";
    b.parentNode.insertBefore(top, b);
    top.appendChild(b);
    top.appendChild(h);
  }

  function buildBanner() {
    var host = document.getElementById("site-banner");
    if (!host) return;
    var B = window.BANNER || {}, dismissed = false;
    try { dismissed = sessionStorage.getItem("nj-banner") === "1"; } catch (e) {}
    if (!B.enabled || dismissed || !L(B.text)) { host.innerHTML = ""; return; }
    host.innerHTML = '<div class="topbar"><div class="wrap topbar-in"><p><span class="tb-text">' + esc(L(B.text)) + "</span>" +
      (B.link ? '<a href="' + esc(B.link) + '">' + esc(L(B.linkText) || t("banner.more")) + "</a>" : "") +
      '</p><button type="button" class="topbar-x" aria-label="' + esc(t("lb.close")) + '">&times;</button></div></div>';
    $(".topbar-x", host).addEventListener("click", function () {
      try { sessionStorage.setItem("nj-banner", "1"); } catch (e) {}
      host.innerHTML = "";
    });
  }

  /* ---------- footer ---------- */
  var ANALYTICS_LOADED = false;
  function loadAnalytics() {
    if (ANALYTICS_LOADED) return;
    var id = String((S.analyticsId || "")).trim();
    if (!/^G-[A-Z0-9]+$/i.test(id)) return;
    ANALYTICS_LOADED = true;
    var s1 = document.createElement("script");
    s1.async = true; s1.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s1);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag("js", new Date()); gtag("config", id);
    window.gtag = gtag;
  }
  function counterHtml() {
    var c = S.goatcounter;
    if (!c) return "";
    return '<p class="foot-count"><img alt="' + esc(t("f.visitors")) + '" src="https://' + esc(c) + '.goatcounter.com/count?p=' + encodeURIComponent(location.pathname) + '"></p>';
  }
  function buildFooter() {
    loadAnalytics();
    var nameNow = String(L(S.name));
    var addr = (L(S.addressLines) || []).filter(function (a) { return String(L(a)).indexOf(nameNow) !== 0; }).map(function (a) { return esc(L(a)); }).join("<br>");
    var links = "";
    if (S.phone) links += '<li><a href="' + telHref(S.phone) + '">' + esc(S.phone) + "</a></li>";
    if (S.email) links += '<li><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></li>";
    var cred = S.credit && S.credit.name ? '<a class="foot-credit" href="' + esc(S.credit.url || "#") + '" target="_blank" rel="noopener">' + esc(t("f.by", { name: S.credit.name })) + "</a>" : "";
    put("site-footer",
      '<footer class="site"><div class="wrap"><div class="foot-grid">' +
      '<div><p class="foot-name">' + esc(L(S.name)) + "</p><p class=\"foot-addr\">" + addr + "</p></div>" +
      '<div><ul class="foot-links">' + links + "</ul><div class=\"foot-social\">" + socialIconsHtml("ficon") + "</div></div></div>" +
      '<div class="foot-bottom"><p class="legal">' + esc(t("f.legal", { year: new Date().getFullYear(), name: L(S.name), place: L(S.place) })) + "</p>" +
      counterHtml() + cred + "</div></div></footer>");
  }

  /* ---------- static texts ---------- */
  function applyStatic() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    var nm = L(S.name) + ", " + L(S.place);
    document.title = page === "home" ? nm : t("p." + page + ".h1") + " · " + nm;
  }

  /* ---------- home: hero ---------- */
  function renderHero() {
    var h1 = document.getElementById("hero-name"); if (!h1) return;
    h1.textContent = L(S.name);
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
    var list = vis(window.ANNOUNCEMENTS).slice().sort(function (a, b) {
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
    var link2 = !compact && y.link && y.link.href && L(y.link.text) ? '<a class="btn btn-line" href="' + esc(y.link.href) + '">' + esc(L(y.link.text)) + "</a>" : "";
    return '<article class="yojana" id="' + esc(y.id) + '"><div class="yhead"><h3>' + esc(L(y.title)) + "</h3>" + chip + "</div><p>" + esc(L(y.summary || y.short)) + "</p>" +
      (det ? "<ul>" + det + "</ul>" : "") + (money ? '<dl class="rows">' + money + "</dl>" : "") + (btn || link2 ? '<div class="btn-row">' + btn + link2 + "</div>" : "") + "</article>";
  }
  function renderYojanaPage() {
    var host = document.getElementById("yojana-list"); if (!host) return;
    var all = vis(window.YOJANA);
    var now = all.filter(function (y) { return y.status !== "soon"; });
    var later = all.filter(function (y) { return y.status === "soon"; });
    host.innerHTML = '<p class="measure">' + esc(t("y.intro")) + "</p>" +
      (now.length ? '<section><h2>' + esc(t("y.now")) + '</h2><div class="ylist">' + now.map(function (y) { return yojanaCard(y); }).join("") + "</div></section>" : "") +
      (later.length ? '<section><h2>' + esc(t("y.later")) + '</h2><div class="ylist">' + later.map(function (y) { return yojanaCard(y); }).join("") + "</div></section>" : "");
  }
  function renderHomeYojana() {
    var all = vis(window.YOJANA).filter(function (y) { return y.home !== false; });
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
    var evs = vis(window.EVENTS).filter(function (e) { return e.home !== false; });
    var up = splitByDate(evs, "endDate").up.slice(0, 3);
    put("home-events", up.length ? '<div class="events">' + up.map(function (e) { return eventCard(e, false); }).join("") + "</div>" : '<p class="empty">' + esc(t("empty.events")) + "</p>");
  }
  function renderKaryakram() {
    var host = document.getElementById("events"); if (!host) return;
    var sp = splitByDate(vis(window.EVENTS), "endDate");
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
    var sp = splitByDate(vis(window.CALENDAR), "date");
    host.innerHTML = tabsHtml() + '<div id="cal-list" aria-live="polite"></div><p class="fine">' + esc(t("cal.note")) + "</p>";
    var list = $("#cal-list", host);
    wireTabs(host, function (which) {
      var items = which === "past" ? sp.past : sp.up;
      list.innerHTML = items.length ? '<div class="events">' + items.map(function (c) { return calCard(c, which === "past"); }).join("") + "</div>"
        : '<p class="empty">' + esc(t(which === "past" ? "empty.cal.past" : "empty.cal.up")) + "</p>";
    });
  }

  /* ---------- gallery ---------- */
  var IMG_RE = /\.(jpe?g|png|gif|webp|avif|svg)$/i, VID_RE = /\.(mp4|webm|ogv|m4v|mov)$/i;

  function galleryList(kind) {
    var G = window.GALLERY || {};
    return vis(G[kind]).slice().sort(function (a, b) { return (a.date || "") < (b.date || "") ? 1 : -1; });
  }
  function fileUrl(folder, name) {
    var base = String(folder || "").replace(/^\/+|\/+$/g, "");
    var f = String(name).split("/").map(encodeURIComponent).join("/");
    return (base ? base.split("/").map(encodeURIComponent).join("/") + "/" : "") + f;
  }
  function ghInfo() {
    var g = S.github || {};
    if (g.user && g.repo) return g;
    var mt = location.hostname.match(/^([^.]+)\.github\.io$/i);
    if (!mt) return null;
    var seg = location.pathname.split("/").filter(Boolean)[0];
    return { user: mt[1], repo: seg && !/\.html?$/i.test(seg) ? seg : mt[1] + ".github.io" };
  }
  /* The site cannot see inside a folder by itself, so it asks GitHub for the file names. */
  function listFolder(folder, cb) {
    var key = "nj-gh:" + folder;
    try { var c = sessionStorage.getItem(key); if (c) { var o = JSON.parse(c); if (Date.now() - o.t < 600000) { cb(null, o.names); return; } } } catch (e) {}
    var g = ghInfo();
    if (!g || !window.fetch) { cb("nogithub"); return; }
    var url = "https://api.github.com/repos/" + encodeURIComponent(g.user) + "/" + encodeURIComponent(g.repo) + "/contents/" +
      String(folder).replace(/^\/+|\/+$/g, "").split("/").map(encodeURIComponent).join("/");
    fetch(url, { headers: { Accept: "application/vnd.github+json" } }).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    }).then(function (list) {
      var names = list.filter(function (x) { return x.type === "file"; }).map(function (x) { return x.name; })
        .sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); });
      try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), names: names })); } catch (e) {}
      cb(null, names);
    }).catch(function (e) { cb(String(e)); });
  }
  function norm(f) { return typeof f === "string" ? { file: f } : f; }
  function usesAuto(a, hasExplicit) { return a.auto === true || (!hasExplicit && a.auto !== false && !!a.folder); }

  /* cb(err, [{src, caption}]) */
  function albumPhotos(a, cb) {
    var explicit = (a.files || []).map(norm).filter(function (f) { return f.file; });
    var out = explicit.map(function (f) { return { src: fileUrl(a.folder, f.file), caption: f.caption, _n: f.file }; });
    if (!usesAuto(a, explicit.length)) { cb(null, out); return; }
    listFolder(a.folder, function (err, names) {
      if (err) { cb(out.length ? null : err, out); return; }
      var have = {}; explicit.forEach(function (f) { have[f.file] = true; });
      names.filter(function (n) { return IMG_RE.test(n) && !have[n]; }).forEach(function (n) { out.push({ src: fileUrl(a.folder, n), caption: "" }); });
      cb(null, out);
    });
  }
  /* cb(err, [{youtube|src, title}]) */
  function albumVideos(a, cb) {
    var items = (a.items || []).map(function (v) {
      if (v.file) return { src: fileUrl(a.folder, v.file), title: v.title, _n: v.file };
      return v;
    });
    if (!a.folder || !usesAuto(a, items.length)) { cb(null, items); return; }
    listFolder(a.folder, function (err, names) {
      if (err) { cb(items.length ? null : err, items); return; }
      var have = {}; items.forEach(function (v) { if (v._n) have[v._n] = true; });
      names.filter(function (n) { return VID_RE.test(n) && !have[n]; }).forEach(function (n) { items.push({ src: fileUrl(a.folder, n), title: "" }); });
      cb(null, items);
    });
  }

  function ytEmbed(v) {
    v = String(v || "").trim();
    var list = (v.match(/[?&]list=([\w-]+)/) || [])[1];
    var id = (v.match(/(?:[?&]v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) || [])[1];
    if (!id && /^[\w-]{11}$/.test(v)) id = v;
    var base = "https://www.youtube-nocookie.com/embed/";
    if (id) return base + id + (list ? "?list=" + list : "");
    if (list) return base + "videoseries?list=" + list;
    if (/^UC[\w-]{22}$/.test(v)) return base + "videoseries?list=UU" + v.slice(2);
    if (/^(PL|UU|OL|FL|RD)[\w-]+$/.test(v)) return base + "videoseries?list=" + v;
    return "";
  }
  function ytId(v) {
    var id = (String(v || "").match(/(?:[?&]v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) || [])[1];
    return id || (/^[\w-]{11}$/.test(String(v || "").trim()) ? String(v).trim() : "");
  }
  function videoBlock(v) {
    var ttl = L(v.title) || t("g.videos_main");
    var emb = v.youtube ? ytEmbed(v.youtube) : "";
    var inner = emb
      ? '<iframe src="' + esc(emb) + '" title="' + esc(ttl) + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>'
      : (v.src ? '<video controls preload="metadata" playsinline src="' + esc(v.src) + '"></video>' : "");
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

  function albumCover(a, kind) {
    if (a.cover) return a.cover;
    if (kind === "photos") {
      var f = (a.files || []).map(norm)[0];
      return f && f.file ? fileUrl(a.folder, f.file) : "";
    }
    var y = (a.items || []).filter(function (v) { return v.youtube && ytId(v.youtube); })[0];
    return y ? "https://i.ytimg.com/vi/" + ytId(y.youtube) + "/hqdefault.jpg" : "";
  }
  function countText(a, kind) {
    if (kind === "photos") { var n = (a.files || []).length; return n ? t("g.photos", { n: n }) : ""; }
    var v = (a.items || []).length; return v ? t("g.videos", { n: v }) : "";
  }
  function thumbHtml(src) { return src ? '<img class="thumb" loading="lazy" alt="" src="' + esc(src) + '" onerror="this.removeAttribute(\'src\')">' : '<span class="thumb"></span>'; }
  function setHead(title, lead) {
    var h1 = $(".page-head h1"), p = $(".page-head p");
    if (h1) h1.textContent = title;
    if (p) p.textContent = lead;
    document.title = title + " · " + L(S.name) + ", " + L(S.place);
  }

  function channelBlock() {
    var cid = String(S.youtubeChannelId || "").trim();
    if (!/^UC[\w-]{22}$/.test(cid)) return "";
    return '<section class="chan"><h2>' + esc(t("g.channel")) + '</h2><div class="video"><iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=UU' + esc(cid.slice(2)) +
      '" title="' + esc(t("g.channel")) + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div></section>';
  }

  function renderGallery() {
    var host = document.getElementById("gallery"); if (!host) return;
    var type = null, id = null;
    try { var qs = new URLSearchParams(location.search); type = qs.get("type"); id = qs.get("album"); } catch (e) {}
    if (type !== "photos" && type !== "videos") {
      type = null;
      if (id) { type = galleryList("photos").some(function (a) { return a.id === id; }) ? "photos" : (galleryList("videos").some(function (a) { return a.id === id; }) ? "videos" : null); }
    }

    /* level 1: the two main albums */
    if (!type) {
      var ph = galleryList("photos"), vd = galleryList("videos");
      function kindCard(kind, list) {
        var first = list.filter(function (a) { return albumCover(a, kind); })[0];
        return '<a class="album kind" href="gallery.html?type=' + kind + '">' + thumbHtml(first ? albumCover(first, kind) : "") +
          '<div class="info"><h3>' + esc(t("g." + kind + "_main")) + '</h3><p class="meta">' + esc(t("g." + kind + "_sub")) + " &middot; " + esc(t("g.n_albums", { n: list.length })) + "</p></div></a>";
      }
      host.innerHTML = '<div class="albums two">' + kindCard("photos", ph) + kindCard("videos", vd) + "</div>" + channelBlock();
      return;
    }

    var list = galleryList(type);
    var album = id ? list.filter(function (a) { return a.id === id; })[0] : null;

    /* level 2: occasion albums of one kind */
    if (!album) {
      setHead(t("g." + type + "_main"), t("g." + type + "_sub"));
      host.innerHTML = '<a class="back" href="gallery.html">' + esc(t("g.back_gallery")) + "</a>" + (list.length
        ? '<div class="albums">' + list.map(function (a) {
          var meta = [longDate(a.date), countText(a, type)].filter(Boolean).join(" · ");
          return '<a class="album" href="gallery.html?type=' + type + "&album=" + encodeURIComponent(a.id) + '">' + thumbHtml(albumCover(a, type)) +
            '<div class="info"><h3>' + esc(L(a.title)) + '</h3><p class="meta">' + esc(meta) + "</p></div></a>";
        }).join("") + "</div>"
        : '<p class="empty">' + esc(t(type === "photos" ? "empty.albums" : "g.none_videos")) + "</p>") + (type === "videos" ? channelBlock() : "");
      return;
    }

    /* level 3: one album */
    setHead(L(album.title), [longDate(album.date), L(album.description)].filter(Boolean).join(". "));
    var back = '<a class="back" href="gallery.html?type=' + type + '">' + esc(t("g.back_" + type)) + "</a>";
    host.innerHTML = back + '<p class="fine">' + esc(t("g.loading")) + "</p>";
    if (type === "photos") {
      albumPhotos(album, function (err, photos) {
        if (!photos.length) { host.innerHTML = back + '<p class="empty">' + esc(t(err ? "g.loadfail" : "empty.album")) + "</p>"; return; }
        host.innerHTML = back + '<div class="photos">' + photos.map(function (p, i) {
          return '<button class="photo" type="button" data-i="' + i + '" aria-label="' + esc(t("g.open", { n: i + 1 })) + '"><img loading="lazy" alt="' + esc(L(p.caption) || L(album.title)) + '" src="' + esc(p.src) + '"></button>';
        }).join("") + "</div>";
        $$(".photo", host).forEach(function (b) {
          b.addEventListener("click", function () { openLightbox(photos, parseInt(b.getAttribute("data-i"), 10)); });
        });
      });
    } else {
      albumVideos(album, function (err, items) {
        host.innerHTML = back + (items.length ? '<div class="videos">' + items.map(videoBlock).join("") + "</div>" : '<p class="empty">' + esc(t(err ? "g.loadfail" : "empty.album")) + "</p>");
      });
    }
  }

  function shuffle(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  /* Collects photos from every visible photo album (used for the Home slideshow). cb(photos) */
  function allPhotos(cb) {
    var albums = galleryList("photos").filter(function (x) { return (x.files || []).length || x.folder; });
    if (!albums.length) { cb([]); return; }
    var out = [], left = albums.length;
    albums.forEach(function (a) {
      albumPhotos(a, function (err, photos) {
        (photos || []).forEach(function (p) { out.push({ src: p.src, caption: p.caption, albumId: a.id, albumTitle: a.title }); });
        if (--left === 0) cb(out);
      });
    });
  }
  var slideTimer = null;
  function renderHomeGallery() {
    var sec = document.getElementById("home-gallery-section");
    var SS = S.slideshow || {};
    if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
    allPhotos(function (photos) {
      if (!photos.length) { if (sec) sec.hidden = true; return; }
      if (sec) sec.hidden = false;
      var cap = document.getElementById("home-gallery-title");

      if (SS.enabled !== false) {
        var pick = shuffle(photos).slice(0, SS.count || 10);
        var idx = 0;
        function draw() {
          var p = pick[idx];
          put("home-gallery", '<a class="slide" href="gallery.html?type=photos&album=' + encodeURIComponent(p.albumId) + '">' +
            '<img loading="lazy" alt="' + esc(L(p.caption) || L(p.albumTitle)) + '" src="' + esc(p.src) + '">' +
            '<span class="slide-cap">' + esc(L(p.albumTitle)) + "</span></a>" +
            (pick.length > 1 ? '<div class="slide-dots">' + pick.map(function (x, i) { return '<i class="' + (i === idx ? "on" : "") + '"></i>'; }).join("") + "</div>" : ""));
          if (cap) cap.textContent = L(p.albumTitle);
        }
        draw();
        if (pick.length > 1) slideTimer = setInterval(function () { idx = (idx + 1) % pick.length; draw(); }, Math.max(2, SS.seconds || 5) * 1000);
      } else {
        var a0 = photos[0];
        put("home-gallery", '<div class="photos">' + photos.slice(0, 4).map(function (p) {
          return '<a class="photo" href="gallery.html?type=photos&album=' + encodeURIComponent(p.albumId) + '"><img loading="lazy" alt="' + esc(L(p.caption) || L(p.albumTitle)) + '" src="' + esc(p.src) + '"></a>';
        }).join("") + "</div>");
        if (cap) cap.textContent = a0 ? L(a0.albumTitle) : "";
      }
    });
  }

  /* ---------- team + about ---------- */
  function renderTeam() {
    var groups = vis(window.TEAM);
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

    var R = vis(window.RECURRING);
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

    var P = vis(window.PUNYARJAK).slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (P.length) {
      html += '<section id="punyarjak"><h2>' + esc(t("d.punya")) + "</h2>" +
        '<div class="pfilter" role="group" aria-label="' + esc(t("d.punya")) + '">' +
        '<button class="pf" type="button" data-k="all" aria-pressed="true">' + esc(t("d.col_kind_all")) + "</button>" +
        '<button class="pf" type="button" data-k="saptahik" aria-pressed="false"><i class="dot dot-saptahik"></i>' + esc(t("kind.saptahik")) + "</button>" +
        '<button class="pf" type="button" data-k="masik" aria-pressed="false"><i class="dot dot-masik"></i>' + esc(t("kind.masik")) + "</button>" +
        '</div><div id="punya-body"></div></section>';
    }
    html += '<p class="thanks">' + esc(t("d.thanks")) + "</p>";
    var DR = vis(window.DRAVYA).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    if (DR.length) {
      html = html.replace('<section id="yojana">', '<section id="dravya"><h2>' + esc(t("d.dravya")) + '</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">' + esc(t("d.col_date")) +
        '</th><th scope="col">' + esc(t("d.col_donor")) + "</th></tr></thead><tbody>" + DR.map(function (p) {
          return "<tr><td>" + esc(longDate(p.date)) + "</td><td>" + esc(L(p.name)) + "</td></tr>";
        }).join("") + '</tbody></table></div></section><section id="yojana">');
    }
    host.innerHTML = html;

    if (P.length) {
      var pbody = $("#punya-body", host);
      function monthLabel(ym) { return new Date(ym + "-01T00:00:00").toLocaleDateString(loc(), { month: "long", year: "numeric" }); }
      function drawPunya(kind) {
        var rows = kind === "all" ? P : P.filter(function (p) { return p.kind === kind; });
        var months = {}, order = [];
        rows.forEach(function (p) {
          var ym = String(p.date).slice(0, 7);
          if (!months[ym]) { months[ym] = []; order.push(ym); }
          months[ym].push(p);
        });
        pbody.innerHTML = order.length ? order.map(function (ym) {
          return '<div class="pmonth"><h3>' + esc(monthLabel(ym)) + '</h3><div class="tbl-wrap"><table class="tbl"><tbody>' +
            months[ym].map(function (p) {
              return '<tr class="prow k-' + esc(p.kind) + '"><td><i class="dot dot-' + esc(p.kind) + '"></i>' + esc(longDate(p.date)) + "</td><td>" + esc(t("kind." + p.kind)) + "</td><td>" + esc(L(p.name)) + "</td></tr>";
            }).join("") + "</tbody></table></div></div>";
        }).join("") : '<p class="empty">' + esc(t("empty.punya")) + "</p>";
      }
      $$(".pf", host).forEach(function (b) {
        b.addEventListener("click", function () {
          $$(".pf", host).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
          drawPunya(b.getAttribute("data-k"));
        });
      });
      drawPunya("all");
    }

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

    var how = vis(window.HOWTO);
    if (how.length) {
      html += '<section id="reach"><h2>' + esc(t("v.reach")) + '</h2><div class="cards">' + how.map(function (h) {
        return '<div class="card"><h3>' + esc(L(h.title)) + "</h3><p>" + esc(L(h.text)) + "</p></div>";
      }).join("") + "</div></section>";
    }
    var soc = socialList();
    html += '<section id="follow"><h2>' + esc(t("v.follow")) + '</h2><div class="btn-row">' + soc.map(function (s) {
      return s.url
        ? '<a class="btn btn-line" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>"
        : '<span class="btn btn-line off" aria-disabled="true">' + esc(s.label) + "</span>";
    }).join("") + "</div></section>";
    host.innerHTML = html;
  }

  /* ---------- home: connect ---------- */
  function renderConnect() {
    var sec = document.getElementById("home-connect-section"); if (!sec) return;
    var soc = socialList();
    sec.hidden = !soc.some(function (s) { return s.url; });
    put("home-connect", '<div class="btn-row">' + soc.map(function (s, i) {
      return s.url
        ? '<a class="btn ' + (i === 0 ? "btn-primary" : "btn-line") + '" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>"
        : '<span class="btn btn-line off" aria-disabled="true">' + esc(s.label) + "</span>";
    }).join("") + "</div>");
  }

  /* ---------- go ---------- */
  function render() {
    if (timer) { clearInterval(timer); timer = null; }
    ensureTop();
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

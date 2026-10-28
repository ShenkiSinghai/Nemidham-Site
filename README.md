# Nemidham mandir website — notes for whoever runs this

Shri 1008 Neminath Digambar Jain Mandir, Nemidham. Plain HTML/CSS/JS — no WordPress, no database, no monthly bill, nothing to "break" in the usual sense. It just needs a place to sit online and a text file to be edited when something changes.

I'm writing this the way I'd explain it to whoever ends up looking after the site next — could be you in six months, could be someone else entirely who's never opened a code editor. Everything below is the stuff I'd actually tell them over a phone call, written down so I don't have to repeat it.

## The one file that matters

**`js/data.js`.** This has everything — address, timings, announcements, karyakram, team, daan details, gallery, all of it. You almost never need to touch anything else. Open it on GitHub, click the little pencil icon top-right, make your change, scroll down, hit "Commit changes." Give it a minute or two and the live site has it.

Everything in there is commented, line by line, so even if you've never written a line of code you should be able to find the right spot and know what to change without guessing.

## What each page actually is

- `index.html` — home. Timings, announcements, next 3 karyakram, latest photos.
- `karyakram.html` — full upcoming/past karyakram list.
- `calendar.html` — the Jain calendar (kalyanak, parv).
- `gallery.html` — photo and video albums.
- `about.html` — history, Bhagwan Neminath, visiting etiquette.
- `team.html` — trustees, committee, pujari.
- `daan.html` — UPI, QR, bank details, the shantidhara and dravya daan tables.
- `yojana.html` — bhumi daan, sant shala, murtis, dharmshala, all the ongoing yojanayein.
- `visit.html` — map, address, directions, phone.
- `contact.html` — just forwards to `visit.html`, kept so old links don't break.
- `gallery-helper.html` and `check.html` — these two are tools, not real pages (more on them below). They're deliberately kept out of the menu and out of search.

## Before this actually goes live

Go through `js/data.js` and find every bit marked **SAMPLE** — address, karyakram, team names, and especially the daan section. Get the bank/UPI details double-checked by the trustees before you publish; a wrong digit there is the one mistake that actually costs someone money.

For photos: just upload them into the folder the album points to (`images/gallery/<album-name>/`), on GitHub, same drag-and-drop way you'd upload anything. If the album doesn't have a `files: [...]` list, it'll pick the photos up by itself within a few minutes — no extra step.

## Putting it online

### GitHub Pages (what I'd use)
1. Free GitHub account.
2. New repository, call it whatever you like, keep it **Public**, create it.
3. "Uploading an existing file" — drag in everything from this folder, `css`/`js`/`images` and all. Commit.
4. Settings → Pages → Branch: `main`, folder `/ (root)`. Save.
5. Give it a few minutes, it'll be live at `https://your-username.github.io/repo-name/`.

### Cloudflare Pages (the other free option)
1. Free account at cloudflare.com.
2. Workers & Pages → Create → Pages → Upload assets.
3. Name it, drag the folder in, Deploy.
4. Live at `https://project-name.pages.dev`.

Either one is fine and free forever for a site this size, and your files stay in your own account — you're not locked into anything.

A real domain name (something like `nemidham.org`) runs about ₹800–1,200/year from any domain seller, and you can point it at either option above. Not required — the site works fine on the free address too.

## Updating things day to day

- **Text, a new karyakram, an announcement:** edit `js/data.js` on GitHub, commit, done.
- **Photos:** drop them in `images/gallery/`, then reference them from an album in `data.js`. Shrink them to around 1600px wide first — makes pages load noticeably faster on phones, which is where most people will actually open this.
- **Gallery albums:** two top-level kinds, Photos and Videos, each with "occasion" albums inside (Diwali, Vedi Pratishtha, whatever). To make a new album without hand-writing the code, open `gallery-helper.html`, fill the form, and paste what it gives you into `GALLERY` in `data.js`.
  - Photos, way one: list the filenames yourself — `files: ["1.jpg", "2.jpg"]`.
  - Photos, way two: skip the `files` line and add `auto: true` instead — the site will read whatever's in that folder on its own (needs `SITE.github` filled in).
  - Videos: `{ youtube: "the link", title: {...} }` — works for a single video, a playlist, or a whole channel, plays right there on the page. For a small uploaded clip instead of YouTube, use `{ file: "clip.mp4" }`.
- **Taking something down without deleting it:** add `hidden: true` to that item's block. It disappears from the site but stays in the file for later.
- **Team photos:** `images/team/`, then put the filename against that person in `data.js`.
- **UPI QR image:** save it as `images/upi-qr.png`, and `qrImage: "images/upi-qr.png"` in the daan section (already set up this way).

## The two tool pages

- **`check.html`** — open this if the site ever looks wrong, blank, or half-missing after an edit. It reads through `data.js` for you and tells you in plain words what's broken or still marked SAMPLE — a green tick, an orange "!", or a red "✖" next to each thing it checked. This is usually the fastest way to find a typo that broke something.
- **`gallery-helper.html`** — a little form that writes the gallery code block for you, so you don't have to get the punctuation right by hand when adding a new album.

Neither shows up in the site menu or in search engines on purpose — they're for whoever's editing, not for visitors.

## Logo, header, mandir name

`SITE.logo` points at `images/mandir-logo.png` — shows up in the header and as the browser tab icon. Swap the file (keep the same name, or change the path) to change it; the header displays it at a decent size now so the design inside the logo actually reads clearly, not as a tiny dot.

If the mandir's name ever changes, update `SITE.name` in `data.js` — and also the `<title>` text at the top of each `.html` file, since those don't pull from `data.js`.

## Languages

Hindi opens first. There's an "English" toggle in the menu. Every bit of content in `data.js` is written as `{ hi: "...", en: "..." }` — fill both when you add something new. The menu words, button labels, and other fixed site text live separately in `js/i18n.js`.

If you ever want Marathi or another language added on top, that's a bigger job — get someone to extend the language system, don't try to hack a third language into the `{hi, en}` pairs.

## Links, map, top banner

`LINKS` at the top of `data.js` is WhatsApp/Facebook/Instagram/YouTube. The social icons in the footer always show, even for the ones you haven't filled in yet — they just sit greyed out and un-clickable until you add a real link.

`mapEmbed` wants Google Maps' own "Share → Embed a map" code (just the `src="..."` link from it). `mapLink` is the plain "open in Google Maps" link for the directions button. `phone` is the contact number.

`BANNER` is the thin gold strip across the very top — leave it blank to hide it. `showTimings: false` on `SITE` hides the "mandir open now" box on the home page entirely, if you ever need that.

## Yojanayein and karyakram, and what shows on Home

- Add `home: false` to a yojana and it'll still show on the full Yojanayein page, just not on Home — handy once the list gets long.
- New karyakram: copy an existing block inside `EVENTS`, change the date/time/title. Home always shows the next 3 automatically; add `home: false` to one if you want it to stay listed on the Karyakram page but skip the Home spotlight.
- Old karyakram: don't need to touch them by hand anymore — anything more than 30 days past its date quietly drops off the "past" list on its own. Want to keep history longer than that? Change `KARYAKRAM_PAST_DAYS` near the top of `renderKaryakram()` in `js/main.js`.
- To pull an old karyakram instantly instead of waiting: `hidden: true` on its block, or just delete the block.

## Shantidhara punyarjak table

`PUNYARJAK` in `data.js` — one row per punyarjak: `date`, `kind` (`"saptahik"` or `"masik"`), `name`. Multiple people can share the same date (common for shantidhara), just add one row each.

By default the Daan page only shows the **current month's** names — keeps the table from turning into a long scroll of old entries. The filter buttons (all/saptahik/masik) still work inside that current-month view. If you'd rather it showed every month, past and future, flip `SITE.punyarjakCurrentMonthOnly` to `false` in `data.js`.

## Visitor count

Two separate things here, don't mix them up:

- **`SITE.analyticsId`** — your Google Analytics ID (starts with `G-`). This is the detailed stuff — where visitors come from, which pages, how long they stay — and it's private to you, visible only when you log into analytics.google.com. Nobody visiting the site sees these numbers.
- **The number in the footer** — that's a public running total, using a free service called GoatCounter:
  1. Sign up free at goatcounter.com, pick any site code (ours is `nemidham`).
  2. In the dashboard: Settings → Customise → turn on "Allow adding visitor counts on your website," save.
  3. Put that same code into `SITE.goatcounter` in `data.js`.
  4. It can take a few hours for a fresh visit to actually move the number — that's GoatCounter's own caching, nothing wrong on our end. Leave the field blank and the footer simply won't show a count at all.

## The small "Website by" line

Bottom-right of the footer. Change the name or link through `SITE.credit`, or set `credit: null` to remove it entirely.

## Home page photo slideshow

A horizontally scrolling strip on the home page, several photos visible at once, auto-advancing and also draggable/with arrow buttons. `SITE.slideshow.enabled: false` hides it entirely. `source` controls where the photos come from — `"all"` pulls randomly from every visible photo album, or write one album's id (e.g. `"vedi-pratishtha"`) to always pull from just that one. `count` and `seconds` control how many photos are in the strip and how often it auto-scrolls.

Right now there are 5 placeholder photos sitting in `images/gallery/vedi-pratishtha/` (`sample-1.jpg` through `sample-5.jpg`) just so the slideshow has something to show while the real photos aren't up yet. Swapping them out:
1. Upload your real photos into `images/gallery/vedi-pratishtha/` (GitHub → Add file → Upload files).
2. In `data.js`, find the `vedi-pratishtha` album and edit its `files: [...]` line — swap the `sample-*.jpg` names for your real filenames, or just delete the whole `files:` line and the site will pick up everything in that folder automatically.
3. Delete the 5 old `sample-*.jpg` files from the folder once you're done with them.

## Light/dark mode

There's a little sun/moon button in the header. Visitors can flip between light and dark; the site opens in light mode by default, and remembers whichever one a visitor last picked (just on their own device/browser, nothing you need to configure).

## A few things worth knowing

- Timings show in IST, on every visitor's own device — no timezone confusion for people viewing from elsewhere.
- Test on your own phone after any real change, not just the laptop — that's where most visitors will actually land.
- If something looks off after an edit, `check.html` first, before anything else.

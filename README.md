# Shri 1008 Neminath Digambar Jain Mandir, Nemidham: website guide

This is a plain website (HTML, CSS, JavaScript). No WordPress, no database, no monthly fee. It works on phones, tablets, laptops and desktops.

## What is inside

| File or folder | What it is |
|---|---|
| `index.html` | Home: today's timings, announcements, upcoming karyakram, latest photos |
| `karyakram.html` | Upcoming and past karyakram |
| `gallery.html` | Albums with photos and videos |
| `about.html` | History, Bhagwan Neminath, visiting etiquette |
| `team.html` | Trustees, committee, sevaks |
| `daan.html` | UPI, QR, bank details |
| `visit.html` | How to reach: map, address, directions, contact |
| `yojana.html` | Yojanayein (bhumi daan, sant shala, murtis, dharmshala) |
| `calendar.html` | Jain Calendar (kalyanak, parv) |
| `contact.html` | Old link, forwards to `visit.html` |
| `gallery-helper.html` | Helper: album ka code banata hai (copy-paste ke liye) |
| `check.html` | Check page: `data.js` ki galtiyan dhoondhta hai |
| `images/mandir-logo.png` | Mandir ka logo (header, favicon). Apna logo badalna ho to `SITE.logo` mein naya naam likhein |
| `images/upi-qr.png` | Daan page par dikhne wala UPI QR code |
| `js/data.js` | **All the content. This is the file you edit.** |
| `images/` | Your photos |

## Before you publish

Open `js/data.js` and replace everything marked **SAMPLE** with real details:
address, phone, announcements, karyakram, team, about text, and especially the **daan details**. Wrong bank or UPI details could send money to the wrong place, so check them with the trustees.

Photo albums: upload your photos into the folder named in `data.js` (e.g. `images/gallery/vedi-pratishtha/`) on GitHub. If the album has no `files` list, the photos appear by themselves within a few minutes.

## How to put it online for free

### Option A: GitHub Pages
1. Make a free account at github.com.
2. Click **New repository**. Name it `nemidham-site`. Keep it **Public**. Create it.
3. Click **uploading an existing file**. Drag in everything from this folder (all files and the `css`, `js`, `images` folders). Click **Commit changes**.
4. Go to **Settings, then Pages**. Under Branch choose `main` and `/ (root)`. Save.
5. After a few minutes your site is live at `https://YOUR-USERNAME.github.io/nemidham-site/`.

### Option B: Cloudflare Pages
1. Make a free account at cloudflare.com.
2. Go to **Workers & Pages, Create, Pages, Upload assets**.
3. Name the project, drag in this whole folder, and click **Deploy**.
4. Your site is live at `https://PROJECT-NAME.pages.dev`.

Both are free for a site like this and keep your files in your own account. If you ever want to leave, you just take the folder with you.

### Your own web address (optional)
A name like `neminathjinalay.org` costs roughly 800 to 1,200 rupees a year from any domain seller. You can connect it to either option above. The site works fine without it.

## How to update the website later

- **Change text, add a karyakram, add an announcement:** open `js/data.js` on GitHub, click the pencil icon, edit, click **Commit changes**. The site updates in a minute or two.
- **Add photos:** upload them into `images/gallery/`, then add them to an album in `data.js`. Resize photos to about 1600 pixels wide first so pages load fast on phones.
- **Gallery:** do main albums, Photos and Videos. Har ek ke andar occasion albums. Naya album: `gallery-helper.html` kholein, details bharein, jo code bane use `data.js` ke `GALLERY` mein paste karein.
  - Photo album, tarika 1: photos `images/gallery/<album>/` mein daalein aur `files: [...]` mein naam likhein.
  - Photo album, tarika 2: `auto: true` likhein, folder ki saari photos khud dikhengi (GitHub API se, `SITE.github` bhara ho).
  - Video: `{ youtube: "link ya ID", title: {...} }`. Single video, playlist ya channel (`UC...` ID) sab page par hi chalte hain. Chhoti video file ho to `{ file: "naam.mp4" }`.
- **Hide / remove:** kisi bhi item mein `hidden: true` likhein, wo site se hat jaata hai, delete nahi hota.
- **Check:** badlav ke baad `check.html` kholein; wo galti aur chhoote SAMPLE batata hai. Dono helper pages search mein nahi aate.
- **Team photos:** upload to `images/team/` and put the file name in `data.js`.
- **UPI QR picture:** upload as `images/upi-qr.png` and set `qrImage: "images/upi-qr.png"`.

## Adding Hindi and Marathi later
The site is built so that all words live in `js/data.js` and `js/main.js`. When you are ready, ask Claude to add a language switcher and translate the content. The headings and menu will need translating too.

## Good to know
- Timings are shown in Indian Standard Time on every visitor's device.
- The page titles in each `.html` file contain the mandir name. If the name changes, update those too.
- Test the site on your own phone after publishing.

## Languages
Hindi opens first. Visitors tap the English button in the menu. Every text in `js/data.js` is written as `{ hi: "...", en: "..." }`. Menu and button words are in `js/i18n.js`.

## Links, map and banner
In `js/data.js` fill `LINKS` (WhatsApp, Facebook, Instagram, YouTube, section 0 at the top), `mapEmbed` (Google Maps, Share, Embed a map, src link), `mapLink` and `phone`. Social icons always show; a link with `""` stays greyed out and cannot be clicked, fill it to make it active. `BANNER` controls the gold strip on top. `showTimings: false` hides the "Open now" box.

## Yojanayen, karyakram and the home page
- Har yojana mein `home: false` likhne se wo sirf Yojanayen page par dikhegi, Home par nahi. `hidden: true` se wo poori site se hat jaati hai.
- Naya karyakram jodhna ho: `EVENTS` mein ek `{ ... }` block copy-paste karke date, time, title badal dein. Home page apne aap aane wale 3 karyakram dikhata hai; ek karyakram ko Home se hatana ho (list par rakhte hue) to usme `home: false` likhein.
- Purana karyakram hatana ho: us block mein `hidden: true` likh dein, ya poora block hata dein.

## Visitor count aur Google Analytics
- `SITE.analyticsId` mein apna Google Analytics Measurement ID (G-... se shuru) likhein. Yeh numbers sirf aapko analytics.google.com par dikhte hain, visitors ko nahi.
- Footer mein sabko dikhne wala public visitor count ke liye GoatCounter (free, reliable):
  1. goatcounter.com par jaakar "Sign up" karein, koi bhi code chunein (jaise `nemidham`), email se account banayein.
  2. Dashboard mein **Settings → Customise → Allow adding visitor counts on your website** ko ON karein, aur Save karein.
  3. `js/data.js` mein `SITE.goatcounter` ke andar wahi code likhein (jaise `"nemidham"`, bina `.goatcounter.com` ke).
  4. Site republish hone ke kuch der baad footer mein count dikhne lagega (naya visit count hone mein kabhi-kabhi kuch ghante lag sakte hain, GoatCounter ki apni caching ki wajah se). Khali chhodne par count nahi dikhta.

## "Website by" credit
Footer ke neeche daayein kone mein ek chhota credit line hai. Naam ya link badalna ho to `SITE.credit` mein; hatana ho to `credit: null` likh dein.

## Home page slideshow
Home page par gallery ki sabhi albums se random photos ka slideshow chalta hai. `SITE.slideshow` mein `enabled: false` likhne se yeh band ho jaata hai aur sidha 4 photos dikhti hain; `count` aur `seconds` se photos ki sankhya aur speed badal sakte hain.

Abhi `images/gallery/vedi-pratishtha/` folder mein 5 **sample** photos (`sample-1.jpg` se `sample-5.jpg`) daali gayi hain, sirf yeh dikhane ke liye ki slideshow kaise chalta hai. Apni real photos lagane ke liye:
1. `images/gallery/vedi-pratishtha/` mein apni photos upload karein (GitHub par "Add file → Upload files").
2. `js/data.js` mein `vedi-pratishtha` album dhoondein aur usme jo `files: [...]` line hai usme se `sample-1.jpg` jaisi saari sample entries hata kar apni photos ke naam likh dein — ya pura `files: [...]` line hata dein, tab site folder ki saari photos khud hi dikha degi.
3. Purani 5 sample-*.jpg files ko `images/gallery/vedi-pratishtha/` se delete kar dein.

## Shantidhara punyarjak table
`PUNYARJAK` mein har row ek din ka punyarjak hai: `date`, `kind` ("saptahik" ya "masik"), aur `name`. Daan page par yeh mahine-waar table mein dikhte hain, saptahik aur masik alag rang se, aur visitor filter karke dekh sakte hain. Koi row na ho to table dikhta hi nahi.

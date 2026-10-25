# Neminath Jinalay, Nemidham: website guide

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
| `contact.html` | Address, timings, phone |
| `js/data.js` | **All the content. This is the file you edit.** |
| `images/` | Your photos |

## Before you publish

Open `js/data.js` and replace everything marked **SAMPLE** with real details:
address, phone, announcements, karyakram, team, about text, and especially the **daan details**. Wrong bank or UPI details could send money to the wrong place, so check them with the trustees.

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
- **Add a YouTube video:** in the album, add `{ youtube: "VIDEO_ID", title: "Name" }`. The ID is the part after `v=` in the video link.
- **Team photos:** upload to `images/team/` and put the file name in `data.js`.
- **UPI QR picture:** upload as `images/upi-qr.png` and set `qrImage: "images/upi-qr.png"`.

## Adding Hindi and Marathi later
The site is built so that all words live in `js/data.js` and `js/main.js`. When you are ready, ask Claude to add a language switcher and translate the content. The headings and menu will need translating too.

## Good to know
- Timings are shown in Indian Standard Time on every visitor's device.
- The page titles in each `.html` file contain the mandir name. If the name changes, update those too.
- Test the site on your own phone after publishing.

/* =====================================================================
   यह वेबसाइट की सारी जानकारी की फ़ाइल है। / THIS IS THE FILE YOU EDIT.
   Timings, announcements, yojanayen, karyakram, photos, team, about, daan,
   how to reach, social links: everything is here.

   Every text has two languages:   { hi: "हिंदी में", en: "In English" }

   Simple rules:
   - Keep the quote marks "like this" around text.
   - Keep the comma at the end of each item.
   - Add a new item by copying a whole { ... }, block and changing the text.
   - Delete an item by removing its whole { ... }, block.
   - Anything marked SAMPLE is only an example. Replace or delete it
     before the website goes public (search this file for the word SAMPLE).
   - Hindi: write easy Hindi. For hard words, write the English word in
     Devanagari letters (for example: गैलरी, कैलेंडर, टीम).
   - English: write Hindi words in English letters (Daan, Karyakram, Aarti).
   ===================================================================== */

/* ---------- 0. YOUR LINKS: WhatsApp, Facebook, Instagram, YouTube ----------
   Paste the full link between the quote marks.
   The four icons always show. A platform with "" (no link yet) is shown greyed out and cannot be clicked.
   The links open that platform directly. They appear on Home, on the How to reach page and in the footer. */
window.LINKS = {
  whatsappGroup: "https://chat.whatsapp.com/IECu8XuP7dLFaWeDHTsHMW?s=cl&p=a&mlu=4&ilr=4&iam=2",   // WhatsApp group invite link
  facebook: "",        // e.g. "https://www.facebook.com/yourpage"
  instagram: "",       // e.g. "https://www.instagram.com/yourpage"
  youtube: "https://youtube.com/@neminathjinalay"          // YouTube channel link
};

/* ---------- 1. Basic details ---------- */
window.SITE = {
  name:  { hi: "श्री 1008 नेमिनाथ दिगंबर जैन मंदिर", en: "Shri 1008 Neminath Digambar Jain Mandir" },
  place: { hi: "नेमिधाम", en: "Nemidham" },
  tagline: {
    hi: "नेमिधाम में रोज़ दर्शन, अभिषेक और आरती। आपके सहयोग से मंदिर का विकास आगे बढ़ रहा है।",
    en: "Daily darshan, abhishek and aarti at Nemidham. The mandir is growing with your support."
  },
  timezone: "Asia/Kolkata",

  // true shows the "Open now" box and daily timings. false hides them everywhere.
  showTimings: true,

  // 24-hour format "HH:MM". 6:30 AM = "06:30", 7:30 PM = "19:30"
  timings: { open: "06:30", abhishek: "07:30", aarti: "19:30", close: "21:00" },
  timingsNote: {
    hi: "त्योहार के दिनों में समय बदल सकता है। कृपया सूचनाएं देखें।",
    en: "Timings can change on festival days. Please check Announcements."
  },

  addressLines: [
    { hi: "श्री 1008 नेमिनाथ दिगंबर जैन मंदिर, नेमिधाम", en: "Shri 1008 Neminath Digambar Jain Mandir, Nemidham" },
    { hi: "बकोरी रोड, वाघोली", en: "Bakori Road, Wagholi" },
    { hi: "पुणे, महाराष्ट्र 412207", en: "Pune, Maharashtra 412207" }
  ],
  phone: "",       // e.g. "+91 98765 43210"
  whatsapp: "",    // number for chat: digits only with country code, e.g. "919876543210"
  email: "",       // e.g. "contact@example.org"

  // Map. Fill ONE of these and the map appears on the "How to reach" page:
  //  mapQuery: the place name or coordinates as Google Maps understands them,
  //            e.g. "Neminath Jinalay Nemidham" or "18.5204,73.8567"
  //  mapLink / mapEmbed: optional. Paste your own Google Maps share link /
  //            embed src if you want to override the automatic ones.
  mapQuery: "",
  mapLink: "https://www.google.com/maps/search/?api=1&query=18.587649567124686,74.00815587372229",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.6979918312923!2d74.00815587372229!3d18.587649567124686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c3005211eeaf%3A0x258f5a756ded4252!2sShri%201008%20Neminath%20Jinalay%2C%20Nemidham!5e0!3m2!1sen!2sin!4v1793055390325!5m2!1sen!2sin",

  // Social links: fill them in section 0 at the top of this file.
  social: window.LINKS,

  // Mandir logo shown in the menu. To use another picture, upload it to images/ and write its path here.
  // (images/jain-symbol.svg is the plain Jain symbol, if you ever want it back.)
  logo: "images/mandir-logo.png",

  // Visitor numbers. analyticsId: Google Analytics, private numbers for you (analytics.google.com).
  analyticsId: "G-BWWJVYC4Q4",

  // Visible visitor count shown in the footer (the public number everyone sees, not just you).
  // Make a free account at goatcounter.com (2 minutes, see README), then write its "site code" here
  // (if your dashboard is at nemidham.goatcounter.com, the code is "nemidham"). Leave "" to hide it.
  goatcounter: "",

  // Small credit shown at the bottom right of the footer. Set credit: null to hide it.
  credit: { name: "Shenki Singhai", url: "https://www.linkedin.com/in/shenki-singhai-20882061" },

  // Home page photo slideshow: random photos from your photo albums.
  slideshow: { enabled: true, count: 10, seconds: 5 },

  // Where this site lives on GitHub. Only needed for the automatic photo list in Gallery albums.
  github: { user: "shenkisinghai", repo: "Nemidham" },

  // Optional: your YouTube channel ID (starts with UC, find it in YouTube Studio > Settings > Channel > Advanced).
  // All the channel's videos then play inside the site's Videos gallery, and new uploads appear by themselves.
  youtubeChannelId: "",

  // Optional big photo behind the top of the Home page, e.g. "images/hero.jpg".
  heroImage: ""
};

/* ---------- 2. Top banner (the thin gold strip at the very top) ---------- */
// Set enabled: false to hide it. Use it for the one most important message.
window.BANNER = {
  enabled: true,
  text: {
    hi: "संत शाला और नई प्रतिमाओं के लिए सहयोग का अवसर।",
    en: "Be part of building the Sant Shala and the new pratimas."
  },
  link: "yojana.html",
  linkText: { hi: "योजनाएं देखें", en: "See Yojanayen" }
};

/* ---------- 3. Yojanayen (upcoming works of the mandir) ---------- */
// status: "active" (efforts underway), "soon" (coming later), "done" (completed)
// target / raised: optional, e.g. "₹ 11,00,000". Leave "" to hide.
// details: a short list of points (optional).
// link: optional button-like link inside the card, e.g. { href: "team.html", text: { hi: "...", en: "..." } }
// home: false  keeps a yojana off the Home page (it still shows on the Yojanayen page).
// hidden: true  hides a yojana everywhere without deleting it.
// To add a new yojana: copy one whole { ... }, block, paste it after the last one, and change the text and id.
// To remove one: delete its whole { ... }, block, or set  home: false  (only Home) / hidden: true  (everywhere).
window.YOJANA = [
  {
    id: "bhumi-daan",
    status: "active",
    title: { hi: "भूमि दान", en: "Bhumi Daan" },
    short: {
      hi: "मंदिर की अपनी भूमि के लिए भूमि दान लिया जा रहा है।",
      en: "Bhumi daan is being accepted for the mandir's own land."
    },
    summary: {
      hi: "मंदिर बना हुआ है, लेकिन अभी वह धार्मिक कार्य के लिए 3 साल के लिए दान की गई भूमि पर है। मंदिर की अपनी भूमि के लिए हम भूमि दान ले रहे हैं।",
      en: "The mandir is already built, but for now it stands on land given for religious use for 3 years. We are accepting bhumi daan so that the mandir can have its own land."
    },
    details: [
      { hi: "आवश्यक भूमि का क्षेत्रफल: 4000 वर्ग फुट।", en: "Land required: 4000 sq ft." },
      { hi: "भूमि दान करने के इच्छुक श्रद्धालु कृपया टीम पेज पर दिए गए सदस्यों से संपर्क करें।", en: "If you wish to donate land, please contact the members listed on the Team page." }
    ],
    link: { href: "team.html", text: { hi: "टीम पेज देखें", en: "See the Team page" } },
    target: "", raised: ""
  },
  {
    id: "sant-shala",
    status: "active",
    title: { hi: "संत शाला", en: "Sant Shala" },
    short: {
      hi: "साधु-संतों के ठहरने और साधना के लिए संत शाला का निर्माण।",
      en: "Building a Sant Shala for monks and sadhvis to stay and practise."
    },
    summary: {
      hi: "साधु-संतों के ठहरने और साधना के लिए मंदिर परिसर में संत शाला बनाने का प्रयास किया जा रहा है।",
      en: "We are working to build a Sant Shala within the mandir premises, where monks and sadhvis can stay and practise."
    },
    details: [
      { hi: "संत शाला से संबंधित जानकारी के लिए कृपया टीम से संपर्क करें।", en: "For information about the Sant Shala, please connect with the Team." }
    ],
    link: { href: "team.html", text: { hi: "टीम पेज देखें", en: "See the Team page" } },
    target: "", raised: ""
  },
  {
    id: "murti-mahavir",
    status: "active",
    title: { hi: "भगवान महावीर स्वामी की नई प्रतिमा", en: "New Pratima of Bhagwan Mahavir Swami" },
    short: {
      hi: "मंदिर जी में विराजमान की जाने वाली भगवान महावीर स्वामी की नई प्रतिमा।",
      en: "A new pratima of Bhagwan Mahavir Swami to be installed in the mandir."
    },
    summary: {
      hi: "भगवान महावीर स्वामी की नई प्रतिमा मंदिर जी में विराजमान की जाएगी।",
      en: "A new pratima of Bhagwan Mahavir Swami will be installed in the mandir."
    },
    details: [
      { hi: "8 इंच की अष्टधातु की प्रतिमा।", en: "An 8 inch pratima made of ashtadhatu (eight metals)." },
      { hi: "प्रतिमा की प्रतिष्ठा मुंबई में नवंबर 2026 में होने वाले पंचकल्याणक में की जाएगी।", en: "The pratima will be consecrated at the Panchkalyanak to be held in Mumbai in November 2026." }
    ],
    target: "", raised: ""
  },
  {
    id: "murti-munisuvratnath",
    status: "active",
    title: { hi: "भगवान मुनिसुव्रतनाथ की नई प्रतिमा", en: "New Pratima of Bhagwan Munisuvratnath" },
    short: {
      hi: "मंदिर जी में विराजमान की जाने वाली भगवान मुनिसुव्रतनाथ की नई प्रतिमा।",
      en: "A new pratima of Bhagwan Munisuvratnath to be installed in the mandir."
    },
    summary: {
      hi: "भगवान मुनिसुव्रतनाथ की नई प्रतिमा मंदिर जी में विराजमान की जाएगी।",
      en: "A new pratima of Bhagwan Munisuvratnath will be installed in the mandir."
    },
    details: [
      { hi: "8 इंच की अष्टधातु की प्रतिमा।", en: "An 8 inch pratima made of ashtadhatu (eight metals)." },
      { hi: "प्रतिमा की प्रतिष्ठा मुंबई में नवंबर 2026 में होने वाले पंचकल्याणक में की जाएगी।", en: "The pratima will be consecrated at the Panchkalyanak to be held in Mumbai in November 2026." }
    ],
    target: "", raised: ""
  },
  {
    id: "dharmshala",
    status: "soon",
    title: { hi: "धर्मशाला और आवास", en: "Dharmshala and aavas" },
    short: {
      hi: "यात्रियों के ठहरने की व्यवस्था भविष्य में की जाएगी।",
      en: "Stay for yatris will be arranged in future."
    },
    summary: {
      hi: "मंदिर आने वाले यात्रियों के लिए धर्मशाला और आवास की व्यवस्था भविष्य में की जाएगी। जानकारी जल्द यहाँ दी जाएगी।",
      en: "A dharmshala and aavas for visiting yatris will be arranged in future. Details will be shared here soon."
    },
    details: [],
    target: "", raised: ""
  }
];

/* ---------- 4. Announcements (shown on Home) ---------- */
// pinned: true keeps an item at the top.
// hidden: true hides an item without deleting it.
window.ANNOUNCEMENTS = [
  {
    date: "2026-10-26", pinned: true,
    title: { hi: "SAMPLE: हमारी नई वेबसाइट में आपका स्वागत है", en: "SAMPLE: Welcome to our new website" },
    text: {
      hi: "जय जिनेन्द्र। कार्यक्रम, तस्वीरें, योजनाएं और दान की जानकारी अब एक ही जगह है। इस सूचना की जगह अपनी सूचना लिखें।",
      en: "Jai Jinendra. Karyakram, photos, yojanayen and daan details are now in one place. Replace this announcement with your own."
    }
  },
  {
    date: "2026-10-20", pinned: false,
    title: { hi: "SAMPLE: त्योहार के दिनों में दर्शन का समय", en: "SAMPLE: Darshan timings on festival days" },
    text: {
      hi: "विशेष दिनों में समय बदल सकता है। जानकारी कुछ दिन पहले यहाँ दी जाएगी।",
      en: "On special days the timings may change. We will post the details here a few days before."
    }
  }
];

/* ---------- 5. Karyakram (events) ---------- */
// date: "YYYY-MM-DD". endDate is optional (for events of many days).
// time can be plain text like "8:00 AM", or { hi: "सुबह 8:00", en: "8:00 AM" }.
// Past events move to the "Past" tab by themselves.
// To remove a karyakram: delete its whole { ... }, block, or add  hidden: true,  inside it.
window.EVENTS = [
  {
    date: "2026-11-09", time: { hi: "सुबह 7:00", en: "7:00 AM" },
    place: { hi: "मंदिर जी", en: "Mandir ji" },
    type: { hi: "उत्सव", en: "Utsav" },
    title: { hi: "लाडू कार्यक्रम: भगवान महावीर स्वामी का मोक्ष कल्याणक", en: "Laddu Karyakram: Moksha Kalyanak of Bhagwan Mahavir Swami" },
    text: {
      hi: "भगवान महावीर स्वामी के मोक्ष कल्याणक के अवसर पर मंदिर जी में लाडू कार्यक्रम होगा। सभी श्रद्धालु आमंत्रित हैं।",
      en: "A Laddu Karyakram will be held at the mandir on the occasion of the Moksha Kalyanak of Bhagwan Mahavir Swami. All devotees are welcome."
    }
  },

  // TEMPLATE for the next karyakram. It is hidden. To use it: remove the line  hidden: true,
  // and change the text. To add one more, copy the whole { ... }, block.
  // home: false  keeps a karyakram off the Home page (it still shows on the Karyakram page).
  // To take a karyakram off the website later: delete its { ... }, block, or add  hidden: true,
  {
    hidden: true,
    date: "2026-12-01", time: { hi: "सुबह 8:00", en: "8:00 AM" },
    place: { hi: "मंदिर जी", en: "Mandir ji" },
    type: { hi: "पूजा", en: "Pooja" },
    title: { hi: "SAMPLE: कार्यक्रम का नाम", en: "SAMPLE: Name of the karyakram" },
    text: { hi: "SAMPLE: कार्यक्रम की जानकारी यहाँ लिखें।", en: "SAMPLE: Write the details of the karyakram here." }
  }
];

/* ---------- 6. Jain Calendar ---------- */
// type: "kalyanak", "parv", "tithi" or "other".
// Please copy these dates from a calendar / panchang you trust.
// hidden: true hides an item without deleting it.
window.CALENDAR = [
  {
    date: "2026-11-08", type: "parv",
    title: { hi: "SAMPLE: पर्व का नाम", en: "SAMPLE: Name of the parv" },
    note: { hi: "SAMPLE: तिथि और मंदिर में क्या होगा, यहाँ लिखें।", en: "SAMPLE: Write the tithi and what happens at the mandir." }
  },
  {
    date: "2026-11-20", type: "kalyanak",
    title: { hi: "SAMPLE: कल्याणक का नाम", en: "SAMPLE: Name of the kalyanak" },
    note: { hi: "", en: "" }
  },
  {
    date: "2026-10-01", type: "tithi",
    title: { hi: "SAMPLE: बीती हुई तिथि", en: "SAMPLE: A past tithi" },
    note: { hi: "", en: "" }
  }
];

/* ---------- 7. Gallery ---------- */
// The Gallery has two main albums: photos and videos. Inside each, you make albums by occasion.
//
// TO MAKE A NEW PHOTO ALBUM (3 steps)
//  1. On GitHub, upload your photos into a new folder, e.g. images/gallery/diwali-2026/
//  2. Copy one whole { ... }, block below, paste it right after, and change id, date, title, folder.
//  3. Choose how photos are listed:
//       files: [ "1.jpg", "2.jpg" ]   write the photo names yourself (always works), or
//       delete the files line         then the site reads the folder by itself, you only upload photos.
//     The page gallery-helper.html writes the block for you.
//  hidden: true  hides an album without deleting it.
//  cover: "images/gallery/diwali-2026/1.jpg"  is the picture shown on the album card (optional).
//
// TO ADD VIDEOS to a video album, list them in items:
//   { youtube: "https://www.youtube.com/watch?v=XXXXXXXXXXX", title: { hi: "", en: "" } }  a YouTube video or playlist link.
//   It plays inside the website, nobody has to go to YouTube.
//   { file: "video1.mp4", title: {...} }  a small video file uploaded into the album's folder (about 25 MB at most).
window.GALLERY = {
  photos: [
    {
      id: "vedi-pratishtha", date: "2026-05-09",
      title: { hi: "वेदी प्रतिष्ठा", en: "Vedi Pratishtha" },
      description: { hi: "", en: "" },
      // Upload the photos into this folder on GitHub. They then appear here by themselves.
      folder: "images/gallery/vedi-pratishtha"
    },
    {
      hidden: true,
      id: "sample-utsav", date: "2026-09-10",
      title: { hi: "SAMPLE: वार्षिक उत्सव", en: "SAMPLE: Annual Utsav" },
      description: { hi: "", en: "" },
      folder: "images/gallery",
      files: [
        { file: "sample-5.svg", caption: { hi: "नमूना फोटो 5", en: "Sample photo 5" } },
        { file: "sample-6.svg", caption: { hi: "नमूना फोटो 6", en: "Sample photo 6" } }
      ]
    }
  ],
  videos: [
    {
      hidden: true,
      id: "sample-videos", date: "2026-10-01",
      title: { hi: "SAMPLE: आरती के वीडियो", en: "SAMPLE: Aarti videos" },
      description: { hi: "यहाँ YouTube वीडियो का लिंक डालें।", en: "Paste your YouTube video links here." },
      items: [
        // { youtube: "https://www.youtube.com/watch?v=XXXXXXXXXXX", title: { hi: "शाम की आरती", en: "Evening Aarti" } }
      ]
    }
  ]
};

/* ---------- 8. Team ---------- */
// HOW TO CHANGE THE TEAM (all on GitHub, in this file):
//  - Add a person: copy one line  { name: "...", role: {...}, phone: "", photo: "" },  inside "members", paste it, edit it.
//      name   the person's name (plain text, or { hi: "...", en: "..." })
//      role   the responsibility, in Hindi and English
//      phone  mobile number, e.g. "+91 98765 43210". Shown under the name, tap to call. "" hides it.
//      photo  optional, e.g. "images/team/name.jpg". Without it, the initials show.
//  - Remove a person: delete that whole line.
//  - Add a new group (like "Sevaks"): copy a whole  { group: {...}, members: [ ... ] },  block and edit it.
//  - Hide a group for now: add  hidden: true,  inside its block (as Trustees below).
window.TEAM = [
  {
    // Trustees are hidden for now (everyone is on the working committee at the moment).
    // When trustees are appointed, delete the line "hidden: true," and fill in the names.
    hidden: true,
    group: { hi: "ट्रस्टी", en: "Trustees" },
    members: [
      { name: "SAMPLE Name One", role: { hi: "अध्यक्ष", en: "President" }, phone: "", photo: "" },
      { name: "SAMPLE Name Two", role: { hi: "सचिव", en: "Secretary" }, phone: "", photo: "" },
      { name: "SAMPLE Name Three", role: { hi: "कोषाध्यक्ष", en: "Treasurer" }, phone: "", photo: "" }
    ]
  },
  {
    group: { hi: "कार्यकारिणी", en: "Working committee" },
    members: [
      { name: "SAMPLE Name Four", role: { hi: "कार्यक्रम संयोजक", en: "Karyakram coordinator" }, phone: "", photo: "" },
      { name: "SAMPLE Name Five", role: { hi: "स्वयंसेवक संयोजक", en: "Volunteer coordinator" }, phone: "", photo: "" }
    ]
  },
  {
    group: { hi: "पुजारी", en: "Pujari" },
    members: [
      { name: "SAMPLE Name Six", role: { hi: "पुजारी", en: "Pujari" }, phone: "", photo: "" }
    ]
  }
];

/* ---------- 9. About page ---------- */
// Each section has an id (no spaces), a title, and paragraphs.
// Add  list: [ {hi:"",en:""}, ... ]  to show bullet points after the paragraphs.
window.ABOUT = [
  {
    id: "mandir",
    title: { hi: "मंदिर के बारे में", en: "About the mandir" },
    paragraphs: [
      {
        hi: "श्री 1008 नेमिनाथ दिगंबर जैन मंदिर, नेमिधाम भगवान नेमिनाथ को समर्पित जैन मंदिर है।",
        en: "Shri 1008 Neminath Digambar Jain Mandir, Nemidham is a Jain mandir dedicated to Bhagwan Neminath."
      },
      {
        hi: "मंदिर बना हुआ है और अभी धार्मिक कार्य के लिए 3 साल के लिए दान की गई भूमि पर है। मंदिर की अपनी भूमि के लिए भूमि दान लिया जा रहा है और विकास जारी है।",
        en: "The mandir is built and, for now, stands on land given for religious use for 3 years. Bhumi daan is being accepted for the mandir's own land, and development is going on."
      }
    ]
  },
  {
    id: "bhagwan",
    title: { hi: "भगवान नेमिनाथ", en: "Bhagwan Neminath" },
    paragraphs: [
      {
        hi: "भगवान नेमिनाथ जैन परंपरा में वर्तमान काल के 22वें तीर्थंकर माने जाते हैं। उनका चिह्न शंख है।",
        en: "Bhagwan Neminath is the 22nd Tirthankar of the present age in Jain tradition. His emblem is the conch (shankh)."
      },
      {
        hi: "उनकी करुणा के लिए उन्हें याद किया जाता है। परंपरा के अनुसार, विवाह के भोज के लिए इकट्ठे पशुओं को देखकर उन्होंने संसार त्याग दिया और दीक्षा ली। जैन परंपरा मानती है कि उन्होंने गिरनार में मोक्ष प्राप्त किया।",
        en: "He is remembered for his deep compassion. According to tradition, when he saw the animals gathered for his wedding feast, he turned away from worldly life and took diksha. Jain tradition holds that he attained moksha at Girnar."
      }
    ]
  },
  {
    id: "visit",
    title: { hi: "दर्शन के नियम", en: "Visiting the mandir" },
    paragraphs: [
      {
        hi: "आपका दर्शन के लिए स्वागत है। नीचे कुछ सामान्य नियम हैं। इन्हें अपने मंदिर के नियमों के अनुसार बदल लें।",
        en: "We welcome you for darshan. These are the usual courtesies. Please change this list to match your mandir's own rules."
      }
    ],
    list: [
      { hi: "साफ़ और सादे कपड़े पहनकर आएं।", en: "Wear clean, modest clothes." },
      { hi: "मंदिर में प्रवेश से पहले जूते-चप्पल बाहर उतारें।", en: "Remove footwear before entering." },
      { hi: "चमड़े की वस्तुएं मंदिर में न लाएं।", en: "Avoid leather items inside the mandir." },
      { hi: "मोबाइल साइलेंट रखें।", en: "Keep your phone on silent." },
      { hi: "फोटो लेने से पहले अनुमति लें।", en: "Please ask before taking photographs." }
    ]
  }
];

/* ---------- 10. How to reach ---------- */
// Add or remove blocks. "title" and "text" can be edited freely.
// hidden: true  hides a block without deleting it (the Parking block below is hidden for now).
window.HOWTO = [
  {
    title: { hi: "सड़क से", en: "By road" },
    text: {
      hi: "खराडी, पुणे से नगर रोड पर वाघोली की ओर आएं और बकोरी रोड पर मंदिर पहुँचें। खराडी से दूरी लगभग 10 किमी है।",
      en: "From Kharadi, Pune, take Nagar Road towards Wagholi, then Bakori Road to reach the mandir. It is about 10 km from Kharadi."
    }
  },
  {
    title: { hi: "रेल से", en: "By rail" },
    text: {
      hi: "सबसे नज़दीकी स्टेशन पुणे रेलवे स्टेशन है, जो लगभग 18 किमी दूर है। हडपसर रेलवे स्टेशन लगभग 14 किमी दूर है।",
      en: "The nearest station is Pune Railway Station, about 18 km away. Hadapsar Railway Station is about 14 km away."
    }
  },
  {
    title: { hi: "हवाई जहाज़ से", en: "By air" },
    text: {
      hi: "सबसे नज़दीकी हवाई अड्डा पुणे अंतरराष्ट्रीय हवाई अड्डा, विमान नगर है, जो लगभग 14 किमी दूर है।",
      en: "The nearest airport is Pune International Airport, Viman Nagar, about 14 km away."
    }
  },
  {
    hidden: true,
    title: { hi: "पार्किंग और सुविधाएं", en: "Parking and facilities" },
    text: { hi: "SAMPLE: पार्किंग, पीने का पानी आदि की जानकारी लिखें।", en: "SAMPLE: Write about parking, drinking water and other facilities." }
  }
];

/* ---------- 11. Daan ---------- */
// enabled: false shows "details coming soon" instead.
// Leave a field "" to hide it. Check every detail with the trustees first.
window.DAAN = {
  enabled: true,
  intro: {
    hi: "आपका दान मंदिर की रोज़ की पूजा, मंदिर के रखरखाव और ऊपर दी गई योजनाओं में काम आता है। आपके सहयोग के लिए धन्यवाद।",
    en: "Your daan supports daily pooja, the upkeep of the mandir and the yojanayen listed on this website. Thank you for your support."
  },
  upiId: "eazypay.mxv8ofmr7akehh1@icici",
  qrImage: "images/upi-qr.png",     // shown just below the UPI ID
  bank: [
    { label: { hi: "खाते का नाम", en: "Account name" }, value: "Jain Shravak Sangh" },
    { label: { hi: "बैंक", en: "Bank" }, value: "ICICI Bank" },
    { label: { hi: "खाता संख्या", en: "Account number" }, value: "172705005064", copy: true },
    { label: { hi: "IFSC", en: "IFSC" }, value: "ICIC0001727", copy: true },
    { label: { hi: "शाखा", en: "Branch" }, value: "Wagholi" }
  ],
  inPerson: {
    hi: "आप मंदिर कार्यालय में खुलने के समय में भी दान दे सकते हैं। रसीद दी जाएगी।",
    en: "You can also give daan at the mandir office during opening hours. A receipt will be given."
  },
  note: { hi: "", en: "" }
};

/* Regular daan and seva (every week / every month) */
window.RECURRING = [
  {
    title: { hi: "मासिक द्रव्य दान", en: "Masik Dravya Daan" },
    when: { hi: "हर महीने", en: "Every month" },
    text: {
      hi: "हर महीने मंदिर के लिए किसी भी तरह की सामग्री का दान, ख़ासकर पूजा की सामग्री। आप भी इसमें जुड़ सकते हैं।",
      en: "Every month, items of any kind can be given as daan to the mandir, mainly pooja items. You can join too."
    },
    how: {
      hi: "सामग्री दान करने के लिए कृपया टीम पेज पर दिए गए सदस्यों से संपर्क करें।",
      en: "To give items as daan, please contact the members listed on the Team page."
    }
  },
  {
    title: { hi: "साप्ताहिक शांतिधारा", en: "Saptahik Shantidhara" },
    when: { hi: "हर हफ्ते", en: "Every week" },
    text: {
      hi: "सप्ताह के किसी एक दिन (जैसे हर मंगलवार) के लिए एक या एक से अधिक श्रद्धालु अपना नाम दे सकते हैं। उस दिन हर हफ्ते उन्हीं पुण्यार्जकों के नाम से शांतिधारा होती है।",
      en: "One or more devotees can give their name for a particular day of the week (for example, every Tuesday). On that day each week, Shantidhara is performed in the name of those punyarjaks."
    },
    how: {
      hi: "पुण्यार्जक बनने के लिए कृपया टीम पेज पर दिए गए सदस्यों से संपर्क करें।",
      en: "To become a punyarjak, please contact the members listed on the Team page."
    }
  },
  {
    title: { hi: "मासिक शांतिधारा", en: "Masik Shantidhara" },
    when: { hi: "हर महीने", en: "Every month" },
    text: {
      hi: "महीने की किसी एक तारीख के लिए एक या एक से अधिक श्रद्धालु अपना नाम दे सकते हैं। उस तारीख को हर महीने उन्हीं पुण्यार्जकों के नाम से शांतिधारा होती है।",
      en: "One or more devotees can give their name for a particular date of the month. On that date each month, Shantidhara is performed in the name of those punyarjaks."
    },
    how: {
      hi: "पुण्यार्जक बनने के लिए कृपया टीम पेज पर दिए गए सदस्यों से संपर्क करें।",
      en: "To become a punyarjak, please contact the members listed on the Team page."
    }
  }
];

/* Shantidhara punyarjak list. Shown on the Daan page as a calendar-style table, month by month,
   with Saptahik and Masik dates told apart by colour, and a filter to show only one kind.
   kind: "saptahik" or "masik".   date: "YYYY-MM-DD".   name: the punyarjak (plain text or { hi, en }).
   TO ADD: copy one line, paste it, change date / kind / name.
   TO REMOVE: delete the line, or add  hidden: true  to it.
   If there are no rows, the table does not show. Only add a name with that person's permission. */
window.PUNYARJAK = [
  // { date: "2026-11-02", kind: "saptahik", name: "SAMPLE Name" },
  // { date: "2026-11-09", kind: "saptahik", name: "SAMPLE Name" },
  // { date: "2026-11-16", kind: "saptahik", name: "SAMPLE Name" },
  // { date: "2026-11-15", kind: "masik", name: "SAMPLE Name" }
];

/* ---------- 12. Trust and 80G details (shown on the Daan page) ---------- */
// Fill the value of each line when you have it. Lines with an empty value are hidden.
// If every value is empty, visitors see "details will be added soon".
// You can add more lines by copying one { ... }, block.
window.TRUST = {
  enabled: true,
  items: [
    { label: { hi: "ट्रस्ट का नाम", en: "Name of the trust" }, value: "" },
    { label: { hi: "रजिस्ट्रेशन नंबर", en: "Registration number" }, value: "" },
    { label: { hi: "PAN", en: "PAN" }, value: "" },
    { label: { hi: "80G नंबर", en: "80G number" }, value: "" },
    { label: { hi: "80G की वैधता", en: "80G valid till" }, value: "" },
    { label: { hi: "12A नंबर", en: "12A number" }, value: "" }
  ],
  note: {
    hi: "",   // e.g. "दान की रसीद मंदिर कार्यालय से मिलेगी।"
    en: ""    // e.g. "A receipt is given by the mandir office."
  }
};

/* Masik Dravya Daan: list of donors. If there are no rows, the table does not show.
   Only add a name with the person's permission. */
window.DRAVYA = [
  // { date: "2026-11-01", name: "SAMPLE Name" }
];

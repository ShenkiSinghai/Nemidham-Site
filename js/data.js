/* =====================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO CHANGE THE WEBSITE'S CONTENT.
   Timings, announcements, karyakram, photos, team, about text, daan details.

   Simple rules:
   - Keep the quote marks "like this" around text.
   - Keep the comma at the end of each item.
   - Add a new item by copying a whole { ... }, block and changing the text.
   - Delete an item by removing its whole { ... }, block.
   - Anything marked SAMPLE is only an example. Replace or delete it
     before the website goes public.
   ===================================================================== */

/* ---------- 1. Basic details ---------- */
window.SITE = {
  name: "Neminath Jinalay",
  nameHindi: "श्री नेमिनाथ जिनालय",
  place: "Nemidham, Wagholi, Pune",
  tagline: "Daily darshan, abhishek and aarti at Nemidham.",
  timezone: "Asia/Kolkata",

  // Use 24-hour format "HH:MM". 6:30 AM = "06:30", 7:30 PM = "19:30"
  timings: {
    open: "06:30",
    abhishek: "07:30",
    aarti: "19:30",
    close: "21:00"
  },
  timingsNote: "Timings can change on festival days. Please check Announcements.",

  // SAMPLE contact details. Replace with real ones.
  addressLines: ["Neminath Jinalay, Nemidham", "Bakroi Road", "Pune, 412207"],
  phone: "",                // e.g. "+91 98765 43210"
  whatsapp: "",             // digits only with country code, e.g. "919876543210"
  email: "",                // e.g. "contact@example.org"
  mapLink: ""               // paste the Google Maps share link of the mandir here
};

/* ---------- 2. Announcements (shown on Home) ---------- */
// pinned: true keeps an item at the top.
window.ANNOUNCEMENTS = [
  {
    title: "SAMPLE: Welcome to our new website",
    date: "2026-10-25",
    pinned: true,
    text: "Jai Jinendra. Karyakram, photos and daan details are now in one place. Replace this announcement with your own."
  },
  {
    title: "SAMPLE: Darshan timings on festival days",
    date: "2026-10-20",
    pinned: false,
    text: "On special days the timings may change. We will post the details here a few days before."
  }
];

/* ---------- 3. Karyakram (events) ---------- */
// date: "YYYY-MM-DD". endDate is optional for multi-day events.
// Past events move to the "Past" tab automatically.
window.EVENTS = [
  {
    title: "SAMPLE: Monthly Snatra Pooja",
    date: "2026-11-15",
    time: "8:00 AM",
    place: "Main hall",
    type: "Pooja",
    text: "All are welcome. Add details about what to bring and where to sit."
  },
  {
    title: "SAMPLE: Pravachan by Maharaj Saheb",
    date: "2026-11-22",
    endDate: "2026-11-24",
    time: "9:00 AM",
    place: "Pravachan hall",
    type: "Pravachan",
    text: "Add the name of the guest and any registration details."
  },
  {
    title: "SAMPLE: Annual Dhwajarohan",
    date: "2026-09-10",
    time: "7:00 AM",
    place: "Mandir premises",
    type: "Utsav",
    text: "This one is in the past, so it shows under the Past tab."
  }
];

/* ---------- 4. Gallery albums ---------- */
// Put photo files inside the images/gallery/ folder, then list them here.
// cover is optional. If you leave it out, the first photo is used.
// Videos: use { youtube: "VIDEO_ID", title: "..." } for a YouTube video
// (the ID is the part after v= in the link), or { src: "images/gallery/aarti.mp4", title: "..." }
// for a video file you upload yourself.
window.ALBUMS = [
  {
    id: "sample-aarti",
    title: "SAMPLE: Evening Aarti",
    date: "2026-10-01",
    description: "Replace these sample pictures with real photos.",
    photos: [
      { src: "images/gallery/sample-1.svg", caption: "Sample photo 1" },
      { src: "images/gallery/sample-2.svg", caption: "Sample photo 2" },
      { src: "images/gallery/sample-3.svg", caption: "Sample photo 3" },
      { src: "images/gallery/sample-4.svg", caption: "Sample photo 4" }
    ],
    videos: []
  },
  {
    id: "sample-utsav",
    title: "SAMPLE: Annual Utsav",
    date: "2026-09-10",
    description: "",
    photos: [
      { src: "images/gallery/sample-5.svg", caption: "Sample photo 5" },
      { src: "images/gallery/sample-6.svg", caption: "Sample photo 6" }
    ],
    videos: []
  }
];

/* ---------- 5. Team ---------- */
// photo is optional, e.g. "images/team/name.jpg". Without it, initials are shown.
// phone is optional.
window.TEAM = [
  {
    group: "Trustees",
    members: [
      { name: "SAMPLE Name One", role: "President", phone: "", photo: "" },
      { name: "SAMPLE Name Two", role: "Secretary", phone: "", photo: "" },
      { name: "SAMPLE Name Three", role: "Treasurer", phone: "", photo: "" }
    ]
  },
  {
    group: "Working committee",
    members: [
      { name: "SAMPLE Name Four", role: "Karyakram coordinator", phone: "", photo: "" },
      { name: "SAMPLE Name Five", role: "Volunteer coordinator", phone: "", photo: "" }
    ]
  },
  {
    group: "Pujari and sevaks",
    members: [
      { name: "SAMPLE Name Six", role: "Pujari", phone: "", photo: "" }
    ]
  }
];

/* ---------- 6. About page ---------- */
// Each section has an id (no spaces), a title, and paragraphs.
// Add "list: [...]" to show bullet points after the paragraphs.
window.ABOUT = [
  {
    id: "mandir",
    title: "About the mandir",
    paragraphs: [
      "Neminath Jinalay, Nemidham is a Jain mandir dedicated to Bhagwan Neminath.",
      "SAMPLE TEXT: Write the story of the mandir here. When it was founded, who started it, how the community came together, and important moments since then. Two or three short paragraphs are enough."
    ]
  },
  {
    id: "bhagwan",
    title: "Bhagwan Neminath",
    paragraphs: [
      "Bhagwan Neminath is the 22nd Tirthankar of the present age in Jain tradition. His emblem is the conch (shankh).",
      "He is remembered for his deep compassion. According to tradition, when he saw the animals gathered for his wedding feast, he turned away from worldly life and took diksha. Jain tradition holds that he attained moksha at Girnar in Gujarat."
    ]
  },
  {
    id: "temple",
    title: "The temple and its murtis",
    paragraphs: [
      "SAMPLE TEXT: Describe the main murti, the year of pratishtha, the architecture, and any other deities or shrines inside the mandir."
    ]
  },
  {
    id: "visit",
    title: "Visiting the mandir",
    paragraphs: [
      "We welcome you for darshan. These are the usual courtesies. Please update this list to match your mandir's own rules."
    ],
    list: [
      "Wear clean, modest clothes.",
      "Remove footwear before entering.",
      "Avoid leather items inside the mandir.",
      "Keep your phone on silent.",
      "Please ask before taking photographs."
    ]
  }
];

/* ---------- 7. Daan (donations) ---------- */
// SAMPLE values below are not real. Fill in your real details, or leave a field
// as "" and it will not be shown. Set enabled: false to show
// "details coming soon" instead.
window.DAAN = {
  enabled: true,
  intro: "Your daan helps with daily pooja, upkeep of the mandir and community karyakram. Thank you for your support.",
  upiId: "SAMPLE-add-your-upi-id",
  qrImage: "",              // e.g. "images/upi-qr.png" after you upload the QR picture
  bank: {
    "Account name": "SAMPLE: Trust name",
    "Bank": "SAMPLE: Bank name",
    "Account number": "SAMPLE-add-account-number",
    "IFSC": "SAMPLE-add-ifsc",
    "Branch": "SAMPLE: Branch"
  },
  inPerson: "You can also give daan at the mandir office during opening hours. A receipt will be given.",
  note: "Please check these details with the trustees before you transfer money."
};

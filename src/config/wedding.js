export const wedding = {
  bride: "Rukshana Parveen",
  groom: "Ashick",
  monogram: "R & A",
  bismillah: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ",
  tagline: "A journey of faith, love & a beautiful beginning",
  timezone: "Asia/Kolkata",
  events: {
    nikah: {
      date: "2026-12-27",
      time: "11:00 AM",
      durationHours: 2,
      venue: "Arulanandham Mahal",
      city: "Thanjavur, Tamil Nadu",
      mapQuery: "Arulanandham Mahal Thanjavur",
      label: "THE NIKAH",
      kicker: "WHERE TWO SOULS BECOME ONE",
      blurb: "In the presence of Allah, our families and loved ones, we begin our journey of faith and love."
    },
    walima: {
      date: "2026-12-30",
      time: "12:00 PM",
      durationHours: 3,
      venue: "Vasantha Mahal",
      city: "Namakkal, Tamil Nadu",
      mapQuery: "Vasantha Mahal Namakkal",
      label: "THE WALIMA",
      kicker: "A FEAST OF JOY AND BLESSINGS",
      blurb: "Join us as we celebrate with food, family and prayers for our new beginning."
    }
  },
  whatsapp: "919500938029",
  message: "With the blessings of Allah and our families, we invite you to celebrate our beginning.",

  // Phase 2: Section 2 - You're Invited Strings
  invitation: {
    label: "IN THE PRESENCE OF FAITH & FAMILY",
    heading: "You're invited",
    couple: "Rukshana Parveen & Ashick",
    subline: "Two hearts. Two families. One beautiful beginning."
  },

  // Phase 2: Section 3 - Quranic Verse & Dua Strings
  quranVerse: {
    label: "AND AMONG HIS SIGNS",
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    translation: "And among His signs is that He created for you spouses from among yourselves, that you may find tranquility in them, and He placed between you affection and mercy. Indeed, in that are signs for people who reflect.",
    reference: "Surah Ar-Rum · 30:21"
  },

  dua: {
    label: "A DUA FOR THE COUPLE",
    arabic: "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    translation: "May Allah bless you, shower His blessings upon you, and unite you both in goodness.",
    tapMessages: [
      "Barakallahu lakuma",
      "Ameen",
      "Mabrook!",
      "May Allah unite you in goodness",
      "May your home be full of mercy"
    ]
  },

  // Illustration: Watercolor of clasped hands (Sherwani sleeve & dupatta)
  illustration: {
    png: "/images/optimized/hands.png",
    webp: "/images/optimized/hands.webp",
    alt: "Watercolor illustration of clasped hands with cream-and-gold sherwani sleeve and plum dupatta"
  },
  couple: {
    caption: "Different paths, the same kind of forever.",
    belowText: "“May Allah make this bond a source of peace and mercy.”"
  },

  // Phase 5.5: Logo & Hero Background (Optimized transparent assets)
  logo: {
    png: "/images/optimized/logo_ar.png",
    webp: "/images/optimized/logo_ar.webp",
    alt: "A and R monogram of Ashick and Rukshana Parveen"
  },
  heroBg: {
    jpg: "/images/optimized/hero-bg.jpg",
    webp: "/images/optimized/hero-bg.webp"
  },

  // Phase 5.5: Intro Animation Timings (in seconds)
  intro: {
    duration: 3.6,
    openStart: 0.3,
    openEnd: 1.5,
    shimmerStart: 1.2,
    shimmerEnd: 2.2,
    breatheStart: 1.0,
    breatheEnd: 2.8,
    exitStart: 2.8,
    exitEnd: 3.6,
    heroTextStart: 3.2,
    maxWait: 4.0,
    failsafe: 7.0
  },

  // Phase 5: RSVP & Closing Config
  rsvp: {
    whatsapp: "919500938029",
    deadline: ""
  },

  closing: {
    label: "TOGETHER IS A BEAUTIFUL PLACE TO BE",
    heading: "Our forever begins with you.",
    arabic: "جَزَاكُمُ اللَّهُ خَيْرًا",
    translation: "May Allah reward you with goodness."
  }
};

/**
 * Parses event date (YYYY-MM-DD) and time (e.g. "11:00 AM") in IST (+05:30)
 */
export function parseEventDateTimeIST(dateStr, timeStr) {
  if (!dateStr || !timeStr) return new Date();
  const [year, month, day] = dateStr.split('-');
  const [timePart, modifier] = timeStr.trim().split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  const pad = (n) => String(n).padStart(2, '0');
  const isoString = `${year}-${month}-${day}T${pad(hours)}:${pad(minutes)}:00+05:30`;
  return new Date(isoString);
}

/**
 * Computes event start Date object with IST offset
 */
export function getEventStartDate(eventKey) {
  const ev = wedding.events[eventKey];
  if (!ev) return new Date();
  return parseEventDateTimeIST(ev.date, ev.time);
}

/**
 * Computes event end Date object based on durationHours
 */
export function getEventEndDate(eventKey) {
  const start = getEventStartDate(eventKey);
  const ev = wedding.events[eventKey];
  const duration = (ev && ev.durationHours) || 2;
  return new Date(start.getTime() + duration * 3600 * 1000);
}

/**
 * Computes weekday in en-IN locale using Intl.DateTimeFormat (never hardcoded)
 */
export function getEventWeekday(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  return new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(date);
}

/**
 * Formats full event date line with weekday: e.g. "Sunday, 27 December 2026"
 */
export function getFullEventDateLine(eventKey) {
  const ev = wedding.events[eventKey];
  if (!ev) return '';
  const weekday = getEventWeekday(ev.date);
  const [year, month, day] = ev.date.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  const monthName = date.toLocaleString('en-IN', { month: 'long' });
  return `${weekday}, ${day} ${monthName} ${year}`;
}

/**
 * Formats ISO date string (YYYY-MM-DD) into uppercase readable format (e.g., "27 DECEMBER 2026")
 */
export function formatWeddingDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  const monthName = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  return `${day} ${monthName} ${year}`;
}

/**
 * Formats ISO date string into abbreviated format (e.g. "27 DEC 2026")
 */
export function formatShortWeddingDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  const monthShort = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  return `${day} ${monthShort} ${year}`;
}

/**
 * Generates the invitation timeline summary string:
 * "NIKAH 27 DEC 2026 · WALIMA 30 DEC 2026"
 */
export function getInvitationTimelineLine() {
  const nikahDate = formatShortWeddingDate(wedding.events.nikah.date);
  const walimaDate = formatShortWeddingDate(wedding.events.walima.date);
  return `NIKAH ${nikahDate} · WALIMA ${walimaDate}`;
}

/**
 * Formats event header (e.g. "27 DECEMBER 2026 · THANJAVUR")
 */
export function getHeroEventDateString(eventKey = 'nikah') {
  const ev = wedding.events[eventKey];
  if (!ev) return '';
  const formattedDate = formatWeddingDate(ev.date);
  const cityName = ev.city.split(',')[0].trim().toUpperCase();
  return `${formattedDate} · ${cityName}`;
}

/**
 * Generates Google Maps URL from a query string using strictly mapQuery
 */
export function getGoogleMapsUrl(mapQuery) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
}

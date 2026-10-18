/* ════════════════════════════════════════════════════════════════
   IVORY · DAILY QUOTE — "a little something for Anveshika"
   ────────────────────────────────────────────────────────────────
   · Shows a fresh quote every time she opens the site.
   · Internet first (live quote APIs), then the bundled collection
     of 6,000 quotes, then a growing pool cached in localStorage.
   · All greetings, dates and the "Day X" streak are locked to
     Indian Standard Time (Asia/Kolkata), no matter where the
     browser thinks it is.
   · Save, copy, share, and a tiny "book of smiles" drawer.
   · Zero dependencies. Safe to fail: never breaks the music app.
   ════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── tiny config you can tweak ─────────────────────────────── */
  const GIRL = "Anveshika"; // who the card is for
  const FROM = "Shivam"; // who it's from

  /* the typewriter cycles through these names — edit freely */
  const HER_NAMES = ["Anveshika ✨", "Anvi 🌸", "Noor 🌙", "Sunshine ☀️", "My Favorite Person 🤍"];
  const TYPEWRITER = { typeMs: 85, deleteMs: 45, holdMs: 2600, gapMs: 480 };

  /* quotes that sound like her world — hand-written, always in the mix.
     Add as many as you like; they're tagged "just for you" (category 7). */
  const RELATABLE_QUOTES = [
    ["You overthink at 2 a.m. and still get up at 7 — that's not weakness, that's stamina.", "Shivam"],
    ["Chai can fix half your problems. The other half is sleep, but who's counting.", "Shivam"],
    ["Saying I'm fine has become your favourite full sentence. Try a different one today.", "Shivam"],
    ["Some days you're the sunshine, some days you just survive the weather. Both count.", "Shivam"],
    ["Anvi, you don't need to be perfect to be someone's favourite person.", "Shivam"],
    ["Noor means light, so please stop apologising for taking up space.", "Shivam"],
    ["Your playlists know you better than most people do.", "Shivam"],
    ["You give the best advice to everyone and take none of it. Classic you.", "Shivam"],
    ["Crying in the shower counts as self-care. Don't argue with me.", "Shivam"],
    ["You're not behind. You're just on a route nobody else is taking.", "Shivam"],
    ["The way you remember tiny details about people is a whole love language.", "Shivam"],
    ["Sunshine, your smile has better uptime than most apps.", "Shivam"],
    ["You're allowed to outgrow the things you once loved.", "Shivam"],
    ["Rest is not a reward you earn at the end. It's a requirement in the middle.", "Shivam"],
    ["You are the reason at least three people still believe in kindness.", "Shivam"],
    ["Overthinking is just imagination with the volume turned against you.", "Shivam"],
    ["You've survived every single one of your worst days. That's a 100% record.", "Shivam"],
    ["Not everyone will get you, and honestly, that's a them problem.", "Shivam"],
    ["You're soft and strong somehow at the same time. That's rare.", "Shivam"],
    ["Your 3 a.m. thoughts are not facts. They're just noise with confidence.", "Shivam"],
    ["Anveshika, you deserve the same gentleness you keep giving everyone else.", "Shivam"],
    ["Some mornings you win, some mornings you just show up. Showing up counts.", "Shivam"],
    ["You make ordinary days feel like they have a soundtrack.", "Shivam"],
    ["It's okay to be a work in progress and still be proud of the draft.", "Shivam"],
    ["You don't owe anyone a version of you that's easier to digest.", "Shivam"],
    ["The right people won't ask you to shrink.", "Shivam"],
    ["You've been strong for so long that resting feels weird. Do it anyway.", "Shivam"],
    ["The world gets louder when you're in a good mood. Protect that.", "Shivam"],
    ["Feelings are visitors. Some stay longer than they should, but none stay forever.", "Shivam"],
    ["You are not too much. You're a lot, for the right people, which is exactly the point.", "Shivam"],
    ["One day you'll look back at this version of you and be proud she kept going.", "Shivam"],
    ["Your laugh is the kind people remember.", "Shivam"],
    ["You're allowed to change your mind, your plans, even your personality. That's growth, not betrayal.", "Shivam"],
    ["Anvi, later is a completely valid answer to anything that's draining you.", "Shivam"],
    ["You treat strangers like they matter, and that says everything.", "Shivam"],
    ["Chai, music, and one text from the right person — that's a whole medicine cabinet.", "Shivam"],
    ["You're not cold. You're just tired, and there's a difference.", "Shivam"],
    ["The goal isn't to be happy every day. It's to be honest most days.", "Shivam"],
    ["You've got the kind of heart that makes seasons change.", "Shivam"],
    ["Even the moon takes a full month to come back around. Take your time too.", "Shivam"],
    ["You don't need a glow-up. You need sleep, water, and one week off.", "Shivam"],
    ["The version of you that's healing is not the version that's failing.", "Shivam"],
    ["Some people collect followers. You collect people. That's the better game.", "Shivam"],
    ["You don't just listen to songs, you live inside them for a while.", "Shivam"],
    ["Your playlists are love letters you never send.", "Shivam"],
    ["You're doing better than the voice in your head is charging you for.", "Shivam"],
  ];

  /* every greeting, date and streak on this card runs on this clock */
  const TIME_ZONE = "Asia/Kolkata";

  /* IST time-of-day bands — half-open ranges [from, to), hours 0–23 */
  const TIME_BANDS = [
    { from: 0, to: 5, greet: "Still awake,", icon: "moon", ps: "P.S. It's late in India—put your phone down soon and get some sleep." },
    { from: 5, to: 12, greet: "Good morning,", icon: "sunrise", ps: "P.S. Take a deep breath, drink some water, and own the day." },
    { from: 12, to: 17, greet: "Good afternoon,", icon: "sun", ps: "P.S. Unclench your shoulders and take a quick 2-minute break." },
    { from: 17, to: 21, greet: "Good evening,", icon: "dusk", ps: "P.S. Hope today treated you kindly. Time to unwind." },
    /* swap greet to "Winding down," if you prefer it over "Sweet dreams soon," */
    { from: 21, to: 24, greet: "Sweet dreams soon,", icon: "starmoon", ps: "P.S. Let go of today's stress—you did enough today." },
  ];

  const CATEGORY_LABELS = [
    "life",
    "love",
    "motivation",
    "wisdom",
    "success",
    "friendship",
    "smile",
    "just for you",
  ];
  /* how often each category comes up (higher = more often) */
  const WEIGHTS = [4, 26, 24, 8, 8, 4, 14, 14];

  const KEYS = {
    last: "ivory.dq.last",
    pool: "ivory.dq.pool",
    saved: "ivory.dq.saved",
    visits: "ivory.dq.visits",
    seen: "ivory.dq.seen",
  };

  /* ── inline SVG icons (lucide-style, 1.5px stroke) ────────── */
  const ICON_PATHS = {
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    sunrise: '<path d="M12 2v8"/><path d="m4.93 10.93 1.41-1.41"/><path d="m19.07 10.93-1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    dusk: '<path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z"/><path d="M19 15v4"/><path d="M17 17h4"/>',
    starmoon: '<path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a6.5 6.5 0 0 0 10 10Z"/><path d="M18 2l.7 1.8L20.5 4.5l-1.8.7L18 7l-.7-1.8L15.5 4.5l1.8-.7L18 2Z"/>',
    sparkles: '<path d="M12 3l1.9 4.8L18.7 9.7l-4.8 1.9L12 16.4l-1.9-4.8L5.3 9.7l4.8-1.9L12 3Z"/><path d="M19 15v4"/><path d="M17 17h4"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98"/><path d="M15.41 6.51l-6.82 3.98"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M12.6 8.7a1.7 1.7 0 0 0-2.4 0l-.2.2-.2-.2a1.7 1.7 0 0 0-2.4 2.4l2.6 2.6 2.6-2.6a1.7 1.7 0 0 0 0-2.4Z"/>',
  };

  function icon(name, size) {
    const s = size || 16;
    return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;
  }

  /* ── storage helpers (never throw) ─────────────────────────── */
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
  };

  /* ════════════════════════════════════════════════════════════
     QUOTE POOL — bundled collection + internet-grown extras
     ════════════════════════════════════════════════════════════ */
  const localQuotes = Array.isArray(window.IVORY_QUOTES) ? window.IVORY_QUOTES : [];
  /* the internet-grown pool is kept in localStorage — ignore anything malformed
     (older versions could store an author object, which renders as "[object Object]") */
  const extraQuotes = (store.get(KEYS.pool, []) || []).filter(
    (q) =>
      Array.isArray(q) &&
      typeof q[0] === "string" &&
      q[0].length >= 24 &&
      !/object object/i.test(String(q[1] || ""))
  );
  const pool = localQuotes.concat(Array.isArray(extraQuotes) ? extraQuotes : []);

  const byCategory = new Map();
  for (const q of pool) {
    const cat = typeof q[2] === "number" ? q[2] : 2;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push(q);
  }

  /* her hand-written notes live in the "just for you" bucket (index 7) */
  for (const rel of RELATABLE_QUOTES) {
    const q = [rel[0], rel[1] || "Shivam", 7];
    pool.push(q);
    if (!byCategory.has(7)) byCategory.set(7, []);
    byCategory.get(7).push(q);
  }

  function pickLocalQuote(avoidText) {
    if (!byCategory.size) return null;
    const total = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
    for (let attempt = 0; attempt < 25; attempt++) {
      let roll = Math.random() * total;
      let cat = 2;
      for (let i = 0; i < WEIGHTS.length; i++) {
        roll -= WEIGHTS[i];
        if (roll <= 0) {
          cat = i;
          break;
        }
      }
      const list = byCategory.get(cat) || byCategory.get(2) || pool;
      const q = list[Math.floor(Math.random() * list.length)];
      if (!q) continue;
      if (avoidText && q[0] === avoidText) continue;
      return q;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /* basic safety net for quotes that arrive live from the internet */
  const RISKY =
    /\b(fuck\w*|shit\w*|bitch\w*|sex\w*|porn\w*|rape|suicide|nigg\w*|cunt\w*|drugs?\b|kill yourself|damn\b|hate\b|death\b|die\b)\b/i;

  function looksFine(text, author) {
    if (typeof text !== "string") return false;
    const t = text.replace(/\s+/g, " ").trim();
    if (t.length < 24 || t.length > 260) return false;
    if (RISKY.test(t) || RISKY.test(String(author || ""))) return false;
    if (/https?:\/\//i.test(t)) return false;
    return true;
  }

  /* internet text arrives with html entities and stray tags — clean it */
  function tidy(text) {
    return String(text)
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;|&apos;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* same spirit as the offline build: keep the card pretty and kind */
  const GLUE = /["]{2}|[?!.,]"?\s*"(?=[A-Za-z])|[a-z]"[a-z]|[a-z]{2}[A-Z][a-z]/;
  const DIALOGUE = /\b(said|asked|replied|whispered|shouted|muttered|answered)\b/i;

  /* words that must stay capitalised when we un-title-case a quote */
  const KEEP_CAPS = new Set([
    "I", "I'm", "I've", "I'll", "I'd", "A", "God", "Lord", "Jesus", "Allah", "Buddha",
    "Krishna", "Shiva", "Ram", "Rama", "Quran", "Bible", "Gita", "India", "Indian",
    "America", "American", "English", "Hindi", "Sanskrit", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "January", "February",
    "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December", "Shakespeare", "Einstein", "Gandhi", "Rumi", "Mom", "Dad",
  ]);

  function isTitleCased(t) {
    const words = t.split(" ").filter((w) => /[A-Za-z]{3,}/.test(w));
    if (words.length < 4) return false;
    const caps = words.filter((w) => /^[A-Z]/.test(w)).length;
    return caps / words.length > 0.9;
  }

  /* "There Is No Substitute For Hard Work." → "There is no substitute for hard work." */
  function fixTitleCase(t) {
    return t
      .split(" ")
      .map((word, i) => {
        if (i === 0) return word;
        const bare = word.replace(/[^\w'’]/g, "");
        if (!bare || bare === bare.toUpperCase()) return word; // acronyms stay
        if (KEEP_CAPS.has(bare) || KEEP_CAPS.has(bare.replace(/’/g, "'"))) return word;
        return word.charAt(0).toLowerCase() + word.slice(1);
      })
      .join(" ");
  }

  function smellsBad(t) {
    if (GLUE.test(t)) return true;
    if (DIALOGUE.test(t)) return true;
    if (/[\u201c\u201d]/.test(t.slice(1, -1))) return true;
    if (/[,;:\-–—]\s*…?$/.test(t)) return true;
    if (isTitleCased(t)) return true;
    const words = t.split(" ").filter((w) => /[A-Za-z]{3,}/.test(w));
    if (words.length >= 6) {
      const caps = words.filter((w) => /^[A-Z]/.test(w)).length;
      if (caps / words.length > 0.72) return true;
    }
    return false;
  }

  function sanitizeIncoming(text, author) {
    let clean = tidy(text)
      .replace(/^["'\u201c\u201d\u2018\u2019\s]+/, "")
      .replace(/["'\u201c\u201d\u2018\u2019\s]+$/, "")
      .replace(/([A-Za-z])'([A-Za-z])/g, "$1\u2019$2")
      .replace(/\s+/g, " ")
      .trim();
    if (isTitleCased(clean)) clean = fixTitleCase(clean);
    if (!looksFine(clean, author)) return null;
    if (smellsBad(clean)) return null;
    if (RISKY.test(clean)) return null;
    const pretty = /^[a-z]/.test(clean) ? clean.charAt(0).toUpperCase() + clean.slice(1) : clean;
    return pretty;
  }

  /* ════════════════════════════════════════════════════════════
     INTERNET LAYER
     ════════════════════════════════════════════════════════════ */
  async function fetchJSON(url, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  /* APIs disagree on shape — normalise the author into a plain name */
  function authorName(raw) {
    if (!raw) return "";
    if (typeof raw === "string") return raw.replace(/\s+/g, " ").trim();
    if (typeof raw === "object") {
      const name = raw.name || raw.fullName || raw.title || raw.author || "";
      return typeof name === "string" ? name.replace(/\s+/g, " ").trim() : "";
    }
    return String(raw).trim();
  }

  /* some APIs send tags as objects, some as strings */
  function tagNames(list) {
    if (!Array.isArray(list)) return [];
    return list
      .map((t) => (typeof t === "string" ? t : t && (t.name || t.slug || t.id) ? String(t.name || t.slug || t.id) : ""))
      .map((t) => t.toLowerCase().trim())
      .filter(Boolean);
  }

  /* One live quote from whichever friendly API answers first. */
  async function fetchLiveQuote() {
    const tries = [
      async () => {
        const d = await fetchJSON("https://api.quotable.kurokeita.dev/api/quotes/random", 4500);
        const q = d.quote || d;
        return [q.content || q.text || q.quote, authorName(q.author)];
      },
      async () => {
        const d = await fetchJSON("https://thequoteshub.com/api/random-quote", 4500);
        return [d.text || d.quote || d.content, authorName(d.author)];
      },
      async () => {
        const d = await fetchJSON("https://dummyjson.com/quotes/random", 4500);
        return [d.quote || d.text, authorName(d.author)];
      },
    ];
    for (const attempt of tries) {
      try {
        const [text, author] = await attempt();
        const clean = sanitizeIncoming(text, author);
        if (clean) {
          return { text: clean, author: String(author || "").trim() };
        }
      } catch {
        /* try the next one */
      }
    }
    return null;
  }

  /* Quietly grows the offline pool with quotes fetched from the internet. */
  async function growPool() {
    const grown = store.get(KEYS.pool, []);
    if (grown.length > 2600) return;

    const additions = [];
    /* dummyjson — paginate so one slow page can't lose the whole batch */
    for (let skip = 0; skip < 1500; skip += 150) {
      try {
        const page = await fetchJSON(`https://dummyjson.com/quotes?limit=150&skip=${skip}`, 6000);
        const rows = page.quotes || [];
        if (!rows.length) break;
        for (const row of rows) {
          const who = authorName(row.author);
          const text = sanitizeIncoming(row.quote || row.text, who);
          if (text) additions.push([text, who, 2]);
        }
      } catch {
        break; // offline — the bundled collection is already there
      }
    }

    for (let page = 1; page <= 3; page++) {
      try {
        const d = await fetchJSON(
          `https://api.quotable.kurokeita.dev/api/quotes?limit=100&page=${page}`,
          6000
        );
        for (const row of d.results || []) {
          const who = authorName(row.author);
          const text = sanitizeIncoming(row.content || row.text || row.quote, who);
          if (text) {
            const tags = tagNames(row.tags);
            const tag = tags.find((t) =>
              ["love", "romantic", "romance", "happiness", "humor", "success", "wisdom", "friendship", "life", "inspirational"].includes(t)
            );
            const cat =
              { love: 1, romantic: 1, romance: 1, happiness: 6, humor: 6, success: 4, wisdom: 3, friendship: 5, life: 0, inspirational: 2 }[tag] ?? 2;
            additions.push([text, who, cat]);
          }
        }
      } catch {
        break;
      }
    }

    if (!additions.length) return;

    /* de-dupe against what we already have, tag by first 40 chars */
    const known = new Set(pool.map((q) => String(q[0]).slice(0, 40).toLowerCase()));
    const fresh = additions
      .filter((q) => !known.has(String(q[0]).slice(0, 40).toLowerCase()))
      .map((q) => [String(q[0]).replace(/\s+/g, " ").trim(), q[1], q[2]]);

    if (!fresh.length) return;

    const merged = grown.concat(fresh).slice(0, 2600);
    if (store.set(KEYS.pool, merged)) {
      for (const q of fresh) {
        if (!byCategory.has(q[2])) byCategory.set(q[2], []);
        byCategory.get(q[2]).push(q);
        pool.push(q);
      }
    }
  }

  /* ════════════════════════════════════════════════════════════
     IST ENGINE — every greeting, date and streak reads Asia/Kolkata
     ════════════════════════════════════════════════════════════ */
  let istFormats = null; // null = untried, false = unsupported
  function getIstFormats() {
    if (istFormats !== null) return istFormats;
    try {
      istFormats = {
        hour: new Intl.DateTimeFormat("en-IN", { timeZone: TIME_ZONE, hour: "numeric", hourCycle: "h23" }),
        date: new Intl.DateTimeFormat("en-IN", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }),
        label: new Intl.DateTimeFormat("en-IN", { timeZone: TIME_ZONE, weekday: "long", month: "short", day: "numeric" }),
      };
    } catch {
      istFormats = false; // ancient browser — fall back to the local clock
    }
    return istFormats;
  }

  function localClockFallback(now) {
    const pad = (n) => String(n).padStart(2, "0");
    return {
      hour: now.getHours(),
      dateKey: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      dateLabel: `${now.toLocaleDateString("en-IN", { weekday: "long" })}, ${now.toLocaleDateString("en-IN", { month: "short" })} ${now.getDate()}`,
    };
  }

  /* { hour: 0–23 IST, dateKey: "YYYY-MM-DD", dateLabel: "Sunday, Oct 18" } */
  function istNow() {
    const now = new Date();
    const f = getIstFormats();
    if (!f) return localClockFallback(now);
    try {
      const hour = parseInt(f.hour.format(now), 10);
      const dp = f.date.formatToParts(now);
      const lp = f.label.formatToParts(now);
      const grab = (parts, type) => (parts.find((p) => p.type === type) || {}).value || "";
      return {
        hour: isNaN(hour) ? now.getHours() : hour,
        dateKey: `${grab(dp, "year")}-${grab(dp, "month")}-${grab(dp, "day")}`,
        dateLabel: `${grab(lp, "weekday")}, ${grab(lp, "month")} ${grab(lp, "day")}`,
      };
    } catch {
      return localClockFallback(now);
    }
  }

  function bandFor(hour) {
    for (const b of TIME_BANDS) if (hour >= b.from && hour < b.to) return b;
    return TIME_BANDS[1];
  }

  /* older versions stored browser-local days as "Sun Oct 18 2026" —
     convert them to IST YYYY-MM-DD keys so the streak survives */
  const LEGACY_MONTH = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
  function legacyDayToKey(s) {
    const m = /^\w{3} (\w{3}) (\d{1,2}) (\d{4})$/.exec(String(s).trim());
    if (!m || !LEGACY_MONTH[m[1]]) return null;
    return `${m[3]}-${String(LEGACY_MONTH[m[1]]).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
  }

  /* counts one visit per IST calendar day — the "Day X" streak */
  function visitCount(todayKey) {
    const data = store.get(KEYS.visits, null);
    if (!data || typeof data !== "object") return { count: 1, isNew: true };
    if (!Array.isArray(data.days)) data.days = [];

    let migrated = false;
    const days = [];
    for (const d of data.days) {
      const key = typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : legacyDayToKey(d);
      if (!key) continue;
      if (key !== d) migrated = true;
      if (!days.includes(key)) days.push(key);
    }
    if (migrated) {
      data.days = days;
      store.set(KEYS.visits, data);
    }

    if (!days.includes(todayKey)) {
      days.push(todayKey);
      data.days = days;
      if (!data.first) data.first = todayKey;
      store.set(KEYS.visits, data);
      return { count: days.length, isNew: true };
    }
    return { count: Math.max(1, days.length), isNew: false };
  }

  /* live snapshot of the IST clock, refreshed on boot + tab focus */
  const clock = { hour: 12, dateKey: "", dateLabel: "", band: TIME_BANDS[1], visits: { count: 1, isNew: true } };
  function refreshClock() {
    const now = istNow();
    clock.hour = now.hour;
    clock.dateKey = now.dateKey;
    clock.dateLabel = now.dateLabel;
    clock.band = bandFor(now.hour);
    clock.visits = visitCount(now.dateKey);
  }

  function authorLine(raw) {
    const who = String(raw || "").replace(/^[\s\u2013\u2014-]+/, "").replace(/\s+/g, " ").trim();
    return who ? "— " + who : "— someone wise";
  }

  /* ════════════════════════════════════════════════════════════
     MARKUP
     ════════════════════════════════════════════════════════════ */
  refreshClock();

  function buildCard() {
    const band = clock.band;
    const wrap = document.createElement("section");
    wrap.className = "dq-wrap";
    wrap.id = "dq-wrap";
    wrap.setAttribute("aria-label", "Daily quote for " + GIRL);
    wrap.innerHTML = `
      <article class="dq-card" id="dq-card">
        <header class="dq-head">
          <div class="dq-id">
            <button class="dq-badge" id="dq-badge" type="button" title="Send some love" aria-label="Send some love">A</button>
            <div class="dq-heading">
              <h2 class="dq-title">
                <span class="dq-icon dq-icon--${band.icon}" id="dq-icon">${icon(band.icon, 18)}</span><span class="dq-greet" id="dq-greet">${band.greet}</span><span class="dq-tw" id="dq-tw" aria-label="${GIRL}"></span>
              </h2>
            </div>
          </div>
          <div class="dq-pill">
            <span id="dq-date">${clock.dateLabel}</span>
          </div>
        </header>

        <blockquote class="dq-body">
          <span class="dq-mark" aria-hidden="true">&ldquo;</span>
          <p class="dq-quote" id="dq-quote" aria-live="polite"><span class="dq-skeleton" style="display:inline-block;width:70%"></span></p>
          <p class="dq-author">
            <span id="dq-author"></span>
            <span class="dq-fresh" id="dq-fresh" title="Fresh from the internet">${icon("sparkles", 12)}</span>
          </p>
          <p class="dq-ps" id="dq-ps">${band.ps}</p>
        </blockquote>

        <div class="dq-actions">
          <button class="dq-btn dq-btn--primary" id="dq-next" type="button" title="Another quote"><span class="dq-ico">${icon("sparkles", 15)}</span><span class="dq-btn-t">One more</span></button>
          <button class="dq-btn dq-btn--icon" id="dq-save" type="button" title="Save" aria-pressed="false"><span class="dq-ico">${icon("heart", 15)}</span><span class="dq-btn-t dq-sr">Save</span></button>
          <button class="dq-btn dq-btn--icon" id="dq-share" type="button" title="Share"><span class="dq-ico">${icon("share", 15)}</span><span class="dq-btn-t dq-sr">Share</span></button>
          <button class="dq-btn dq-btn--icon" id="dq-copy" type="button" title="Copy"><span class="dq-ico">${icon("copy", 15)}</span><span class="dq-btn-t dq-sr">Copy</span></button>
          <span class="dq-spacer"></span>
          <button class="dq-btn dq-btn--icon dq-btn--book" id="dq-open-saved" type="button" title="Her little book"><span class="dq-ico">${icon("book", 15)}</span><span class="dq-count" id="dq-count"></span><span class="dq-btn-t dq-sr">Her little book</span></button>
        </div>

        <div class="dq-saved" id="dq-saved">
          <div class="dq-saved-head">
            <h3 class="dq-saved-title">Quotes ${GIRL} kept</h3>
            <button class="dq-btn" id="dq-clear" type="button"><span class="dq-btn-t">Clear all</span></button>
          </div>
          <ul class="dq-saved-list" id="dq-saved-list"></ul>
        </div>

        <footer class="dq-foot">
          <span class="dq-sig">made with <span class="dq-h">&hearts;</span> by ${FROM}</span>
        </footer>
      </article>`;

    return wrap;
  }

  /* ════════════════════════════════════════════════════════════
     RENDER LOGIC
     ════════════════════════════════════════════════════════════ */
  let card, els, current = null;

  /* ════════════════════════════════════════════════════════════
     MUSIC DOCK — the card steps aside while a song plays
     ════════════════════════════════════════════════════════════ */
  let musicPlaying = false;
  const hookedMedia = new WeakSet();

  function applyMusicDock() {
    const wrap = card && document.body.contains(card) ? card : document.getElementById("dq-wrap");
    if (wrap) wrap.classList.toggle("is-playing", musicPlaying);
  }

  function setMusicPlaying(on) {
    on = !!on;
    if (on === musicPlaying) return;
    musicPlaying = on;
    applyMusicDock();
  }

  function hookMedia(el) {
    if (!el || hookedMedia.has(el)) return;
    hookedMedia.add(el);
    /* a play() with no source behind it isn't a song — don't duck for it */
    const hasSource = () => Boolean(el.currentSrc || el.src || (el.querySelector && el.querySelector("source")));
    el.addEventListener("play", () => setMusicPlaying(hasSource()));
    el.addEventListener("playing", () => setMusicPlaying(true));
    el.addEventListener("pause", () => setMusicPlaying(false));
    el.addEventListener("ended", () => setMusicPlaying(false));
    el.addEventListener("error", () => setMusicPlaying(false));
  }

  /* media events don't bubble — capture them for anything in the DOM … */
  document.addEventListener("play", (e) => hookMedia(e.target), true);

  /* … and wrap play() once so the music app's detached <audio> is caught too.
     Never touches playback itself: if play fails or is blocked, the card
     simply comes back. */
  if (window.HTMLMediaElement && !window.__ivoryDqMediaPatched) {
    window.__ivoryDqMediaPatched = true;
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      try {
        hookMedia(this);
      } catch {
        /* keep playback untouched */
      }
      const result = nativePlay.apply(this, arguments);
      if (result && typeof result.catch === "function") result.catch(() => setMusicPlaying(false));
      return result;
    };
  }

  function quoteToObject(text, author, cat) {
    return { t: text, a: author || "", c: typeof cat === "number" ? cat : -1 };
  }

  function applyQuote(q, opts) {
    opts = opts || {};
    current = q;

    const paint = () => {
      els.quote.textContent = q.t;
      els.author.textContent = authorLine(q.a);
      els.ps.textContent = clock.band.ps;
      syncSaveButton();

      els.quote.classList.remove("is-swapping");
      els.ps.classList.remove("is-swapping");
    };

    if (opts.animate === false || !els.quote.textContent.trim() || els.quote.querySelector(".dq-skeleton")) {
      paint();
      return;
    }

    els.quote.classList.add("is-swapping");
    els.ps.classList.add("is-swapping");
    setTimeout(paint, 190);
  }

  /* clipboard with a fallback that also works when the API is blocked */
  async function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* fall through to the legacy path */
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }

  /* icon-only buttons give feedback by swapping to a checkmark for a beat */
  function flashCheck(btn) {
    const ico = btn && btn.querySelector(".dq-ico");
    if (!ico) return;
    if (!ico.dataset.orig) ico.dataset.orig = ico.innerHTML;
    ico.innerHTML = icon("check", 15);
    clearTimeout(Number(ico.dataset.t) || 0);
    ico.dataset.t = setTimeout(() => {
      ico.innerHTML = ico.dataset.orig;
      delete ico.dataset.t;
    }, 1600);
  }

  function flashFresh() {
    els.fresh.classList.add("is-on");
    setTimeout(() => els.fresh.classList.remove("is-on"), 4200);
  }

  /* ── internet upgrade: swap in a live quote when it arrives ── */
  async function tryLiveQuote() {
    const live = await fetchLiveQuote();
    if (!live || !card || !document.body.contains(card)) return;
    if (current && live.text.toLowerCase() === current.t.toLowerCase()) return;

    const seenRecent = store.get(KEYS.seen, []);
    const key = live.text.slice(0, 46).toLowerCase();
    if (Array.isArray(seenRecent) && seenRecent.includes(key)) return;

    remember(key);
    applyQuote(quoteToObject(live.text, live.author, -1), { animate: true });
    flashFresh();
  }

  function remember(key) {
    const seen = store.get(KEYS.seen, []);
    const list = Array.isArray(seen) ? seen : [];
    list.unshift(key);
    store.set(KEYS.seen, list.slice(0, 120));
  }

  function nextQuote(useInternet) {
    const prev = current ? current.t : "";
    if (prev) remember(prev.slice(0, 46).toLowerCase());

    const q = pickLocalQuote(prev);
    if (q) applyQuote(quoteToObject(q[0], q[1], q[2]));

    if (useInternet) {
      lastInternetTry = Date.now();
      tryLiveQuote();
    }
  }

  let lastInternetTry = 0;

  /* ── typewriter for her names ────────────────────────────── */
  function useTypewriter(el) {
    if (!el) return;
    const words = HER_NAMES.length ? HER_NAMES : [GIRL];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = words[0];
      return;
    }
    el.innerHTML = '<span class="dq-tw-text"></span><span class="dq-tw-cursor" aria-hidden="true">|</span>';
    const out = el.querySelector(".dq-tw-text");
    let wordIdx = 0, charIdx = 0, deleting = false;

    (function tick() {
      if (!el.isConnected) return; // the card re-rendered — let go quietly
      const word = words[wordIdx];
      charIdx += deleting ? -1 : 1;
      out.textContent = word.slice(0, Math.max(0, charIdx));
      let wait = deleting ? TYPEWRITER.deleteMs : TYPEWRITER.typeMs;
      if (!deleting && charIdx >= word.length) {
        wait = TYPEWRITER.holdMs;
        deleting = true;
      } else if (deleting && charIdx <= 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        wait = TYPEWRITER.gapMs;
      }
      setTimeout(tick, wait);
    })();
  }

  /* ── saved quotes ("her little book") ─────────────────────── */
  function savedList() {
    const list = store.get(KEYS.saved, []);
    return Array.isArray(list) ? list : [];
  }

  function isSaved(q) {
    return savedList().some((s) => s.t === q.t);
  }

  function syncSaveButton() {
    if (!current || !els) return;
    const on = isSaved(current);
    els.save.classList.toggle("is-on", on);
    els.save.setAttribute("aria-pressed", on ? "true" : "false");
    els.saveLabel.textContent = on ? "Saved" : "Save";
    els.save.title = on ? "Saved to her little book" : "Save";
    const list = savedList();
    els.count.textContent = list.length ? String(list.length) : "";
  }

  function renderSaved() {
    const list = savedList();
    els.list.innerHTML = "";
    if (!list.length) {
      els.list.innerHTML = `<li class="dq-saved-empty">Nothing saved yet — tap Save on a quote you love and it will wait here for you.</li>`;
      return;
    }
    for (const item of list) {
      const li = document.createElement("li");
      li.className = "dq-saved-item";
      const body = document.createElement("p");
      body.textContent = "“" + item.t + "”";
      if (item.a) {
        const who = document.createElement("span");
        who.textContent = authorLine(item.a);
        body.appendChild(who);
      }
      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "✕";
      del.title = "remove";
      del.addEventListener("click", () => {
        const left = savedList().filter((s) => s.t !== item.t);
        store.set(KEYS.saved, left);
        renderSaved();
        syncSaveButton();
      });
      li.appendChild(body);
      li.appendChild(del);
      els.list.appendChild(li);
    }
  }

  const BURST_COLORS = ["#f472b6", "#c084fc", "#fb7185", "#fda4af"];
  function heartBurst(target) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = target.getBoundingClientRect();
    const host = els.card.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const bit = document.createElement("span");
      bit.className = "dq-heart";
      bit.style.color = BURST_COLORS[i % BURST_COLORS.length];
      bit.innerHTML = icon("heart", 14).replace('fill="none"', 'fill="currentColor" stroke="none"');
      bit.style.left = rect.left - host.left + rect.width / 2 - 7 + "px";
      bit.style.top = rect.top - host.top + "px";
      bit.style.setProperty("--dx", (Math.random() * 90 - 45).toFixed(0) + "px");
      bit.style.animationDelay = (i * 55).toFixed(0) + "ms";
      els.card.appendChild(bit);
      setTimeout(() => bit.remove(), 1400 + i * 60);
    }
  }

  /* keep the greeting, date and streak honest while the tab stays open */
  function refreshClockUI() {
    const prevBand = clock.band;
    const prevKey = clock.dateKey;
    refreshClock();
    if (!els || !document.body.contains(els.card)) return;
    if (clock.band !== prevBand) {
      els.icon.className = "dq-icon dq-icon--" + clock.band.icon;
      els.icon.innerHTML = icon(clock.band.icon, 18);
      els.greet.textContent = clock.band.greet;
      els.ps.textContent = clock.band.ps;
    }
    if (clock.dateKey !== prevKey) {
      els.date.textContent = clock.dateLabel;
    }
  }

  /* ════════════════════════════════════════════════════════════
     MOUNT + WIRE UP
     ════════════════════════════════════════════════════════════ */
  function mount() {
    const host = document.querySelector(".content-body");
    if (!host) return false;
    if (document.getElementById("dq-wrap")) return true;

    card = buildCard();
    host.insertBefore(card, host.firstChild);
    applyMusicDock();

    els = {
      card: card.querySelector("#dq-card"),
      quote: card.querySelector("#dq-quote"),
      author: card.querySelector("#dq-author"),
      ps: card.querySelector("#dq-ps"),
      fresh: card.querySelector("#dq-fresh"),
      save: card.querySelector("#dq-save"),
      saveLabel: card.querySelector("#dq-save .dq-btn-t"),
      count: card.querySelector("#dq-count"),
      saved: card.querySelector("#dq-saved"),
      list: card.querySelector("#dq-saved-list"),
      icon: card.querySelector("#dq-icon"),
      greet: card.querySelector("#dq-greet"),
      date: card.querySelector("#dq-date"),
    };

    useTypewriter(card.querySelector("#dq-tw"));

    /* first quote: instant, from the collection */
    const last = store.get(KEYS.last, "");
    const first = pickLocalQuote(typeof last === "string" ? last : "");
    if (first) applyQuote(quoteToObject(first[0], first[1], first[2]));

    /* ── interactions ── */
    card.querySelector("#dq-next").addEventListener("click", () => nextQuote(true));
    card.querySelector("#dq-badge").addEventListener("click", (e) => heartBurst(e.currentTarget));

    els.save.addEventListener("click", (e) => {
      if (!current) return;
      const list = savedList();
      if (isSaved(current)) {
        store.set(KEYS.saved, list.filter((s) => s.t !== current.t));
      } else {
        list.unshift({ t: current.t, a: current.a });
        store.set(KEYS.saved, list.slice(0, 200));
        heartBurst(e.currentTarget);
      }
      renderSaved();
      syncSaveButton();
    });

    card.querySelector("#dq-copy").addEventListener("click", async (e) => {
      if (!current) return;
      const btn = e.currentTarget; // capture now: currentTarget is null after await
      const label = btn.querySelector(".dq-btn-t");
      const who = authorLine(current.a).replace(/^— /, "");
      const text = `“${current.t}”${who !== "someone wise" ? " — " + who : ""}`;
      const ok = await copyText(text);
      const old = label.textContent;
      label.textContent = ok ? "Copied" : "Can't copy";
      if (ok) flashCheck(btn);
      setTimeout(() => (label.textContent = old), 1600);
    });

    card.querySelector("#dq-share").addEventListener("click", async (e) => {
      if (!current) return;
      const who = authorLine(current.a).replace(/^— /, "");
      const text = `“${current.t}”${who !== "someone wise" ? " — " + who : ""}`;
      const payload = {
        title: `A quote for ${GIRL}`,
        text: `${text}\n\nFrom ${FROM}, with love ❤️`,
      };
      const btn = e.currentTarget;
      const label = btn.querySelector(".dq-btn-t");
      try {
        if (navigator.share) {
          await navigator.share(payload);
          return;
        }
      } catch {
        return; // she cancelled the share sheet — that's fine
      }
      const old = label.textContent;
      const ok = await copyText(payload.text);
      label.textContent = ok ? "Copied" : "Can't share";
      if (ok) flashCheck(btn);
      setTimeout(() => (label.textContent = old), 1600);
    });

    card.querySelector("#dq-open-saved").addEventListener("click", () => {
      els.saved.classList.toggle("is-open");
      renderSaved();
    });

    card.querySelector("#dq-clear").addEventListener("click", () => {
      store.set(KEYS.saved, []);
      renderSaved();
      syncSaveButton();
    });

    renderSaved();
    syncSaveButton();

    /* remember what she last saw, so the next open feels new */
    if (current) store.set(KEYS.last, current.t);
    window.addEventListener("beforeunload", () => {
      if (current) store.set(KEYS.last, current.t);
    });

    /* ── fresh from the internet, right after first paint ── */
    setTimeout(() => {
      tryLiveQuote();
      setTimeout(growPool, 2500);
    }, 400);

    /* a gentle nudge if she leaves the tab open all day (IST may roll over) */
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        refreshClockUI();
        if (Date.now() - lastInternetTry > 20 * 60 * 1000) {
          lastInternetTry = Date.now();
          tryLiveQuote();
        }
      }
    });

    return true;
  }

  function boot() {
    if (!mount()) {
      /* the app may still be rendering its shell — try again shortly */
      let tries = 0;
      const timer = setInterval(() => {
        tries++;
        if (mount() || tries > 40) clearInterval(timer);
      }, 250);
      return;
    }

    /* keep it alive: the app re-renders its home view now and then */
    const host = document.querySelector(".content-body");
    if (host && "MutationObserver" in window) {
      const observer = new MutationObserver(() => {
        if (!document.getElementById("dq-wrap")) mount();
      });
      observer.observe(host, { childList: true });
    }
    setInterval(() => {
      if (!document.getElementById("dq-wrap")) mount();
    }, 6000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      try {
        boot();
      } catch (err) {
        console.warn("[daily-quote] skipped:", err);
      }
    });
  } else {
    try {
      boot();
    } catch (err) {
      console.warn("[daily-quote] skipped:", err);
    }
  }

  /* small hook for tinkering from the console */
  window.IvoryDailyQuote = {
    next: () => nextQuote(true),
    saved: () => savedList(),
    size: () => pool.length,
    buckets: () => Object.fromEntries([...byCategory].map(([k, v]) => [k, v.length])),
    pick: () => {
      const q = pickLocalQuote();
      return q ? q[0].slice(0, 60) : null;
    },
    clock: () => ({
      hour: clock.hour,
      dateKey: clock.dateKey,
      dateLabel: clock.dateLabel,
      band: clock.band.greet,
      day: clock.visits.count,
    }),
  };
})();

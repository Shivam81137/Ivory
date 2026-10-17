/**
 * build_quotes.mjs
 * ------------------------------------------------------------------
 * Builds `quotes-data.js` — the offline quote collection that powers
 * Anveshika's Daily Quote card inside Ivory.
 *
 * It merges several free/public quote datasets, keeps the most loved
 * ones, cleans + de-dupes everything, drops anything rude or broken,
 * adds a hand-written "for Anveshika" section, and writes one compact
 * JS file.
 *
 * Run:  node scripts/build_quotes.mjs
 * ------------------------------------------------------------------
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.join(__dirname, "..", "quotes-data.js");

/* Category codes used in the output file (numbers = small file) */
const CAT = {
  LIFE: 0,
  LOVE: 1,
  MOTIVATION: 2,
  WISDOM: 3,
  SUCCESS: 4,
  FRIENDSHIP: 5,
  SMILE: 6,
  FOR_YOU: 7,
};

const MAX_QUOTES = 6000;
const MIN_LEN = 24;
const MAX_LEN = 220;

/* ══════════════════════════════════════════════════════════════
   1. HAND-WRITTEN NOTES FOR ANVESHIKA  (always kept, category 7)
   ══════════════════════════════════════════════════════════════ */
const FOR_ANVESHIKA = [
  ["You are the best thing that happened to an ordinary day.", "Shivam"],
  ["If smiles were a currency, you'd be the richest person I know.", "Shivam"],
  ["The world got a little softer the day you were born, Anveshika.", "Shivam"],
  ["You don't have to be perfect today. You just have to be you. That's already my favourite.", "Shivam"],
  ["Some people light up rooms. You light up whole lives.", "Shivam"],
  ["Whenever life feels heavy, remember: someone is proud of you just for getting through today.", "Shivam"],
  ["You are proof that good hearts still exist.", "Shivam"],
  ["Take a deep breath, Anveshika. You are exactly where you need to be.", "Shivam"],
  ["Your laugh is my favourite song, and I've heard a lot of songs.", "Shivam"],
  ["On the days you can't love yourself, borrow my love. I have plenty.", "Shivam"],
  ["You make ordinary moments feel like movie scenes.", "Shivam"],
  ["Be gentle with yourself today. You're doing better than you think.", "Shivam"],
  ["Every version of you — tired, happy, messy, glowing — is worth loving.", "Shivam"],
  ["If you ever doubt yourself, come read this card. It's still true.", "Shivam"],
  ["You are allowed to rest. Even stars disappear for a while and come back shining.", "Shivam"],
  ["The sun doesn't rush, and neither should you. Bloom at your own pace.", "Shivam"],
  ["You are someone's answered prayer. (Mine, to be exact.)", "Shivam"],
  ["Keep going, Anveshika. Your dreams are closer than they look from here.", "Shivam"],
  ["Drink some water, smile at yourself, and go win the day.", "Shivam"],
  ["You are the calm in my chaos and the chaos in my calm.", "Shivam"],
  ["Nothing about you is ordinary — not your eyes, not your heart, not your mind.", "Shivam"],
  ["Some days are hard. But you, my love, are harder to stop.", "Shivam"],
  ["I hope today gives you a reason to smile before it gives you a reason to worry.", "Shivam"],
  ["You are my favourite notification, my favourite thought, my favourite person.", "Shivam"],
  ["Grow through what you go through — you've already grown so much.", "Shivam"],
  ["Remember: you survived every single bad day so far. That's a 100% success rate.", "Shivam"],
  ["You are strong, but you don't always have to be. Sometimes just being is enough.", "Shivam"],
  ["I wish you could see yourself the way I see you — you'd never doubt yourself again.", "Shivam"],
  ["Whatever you're chasing today, don't forget to breathe. I've got your back.", "Shivam"],
  ["Your kindness is a superpower. Never let the world talk you out of it.", "Shivam"],
  ["Today is going to be a good day, because you're in it.", "Shivam"],
  ["Even on your worst day, you are someone's best thing.", "Shivam"],
  ["Slow mornings, warm coffee, and someone who adores you. That's your reminder.", "Shivam"],
  ["You don't need to be everyone's favourite. You're already mine.", "Shivam"],
  ["Every time you open this page, a quote waits for you — because you deserve little surprises.", "Shivam"],
  ["If you're reading this and feeling low, this is me hugging you through the screen.", "Shivam"],
  ["You are the plot twist the universe wrote for me.", "Shivam"],
  ["Wear that smile today, Anveshika. It's your best accessory.", "Shivam"],
  ["May today be as beautiful as the way you say my name.", "Shivam"],
  ["Life is short, but my list of things I adore about you is not.", "Shivam"],
  ["When you feel like giving up, remember there's a whole person rooting for you here.", "Shivam"],
  ["You are allowed to be both a masterpiece and a work in progress at the same time.", "Shivam"],
  ["Your presence is a gift, and I never want to return it.", "Shivam"],
  ["Keep dreaming loudly, Anveshika. I love the sound of your ambition.", "Shivam"],
  ["You turned my ordinary life into a limited edition.", "Shivam"],
];

/* ══════════════════════════════════════════════════════════════
   2. CLEANING + FILTERING
   ══════════════════════════════════════════════════════════════ */

/* words we never want on her card */
const BLOCK =
  /\b(fuck\w*|shit\w*|bitch\w*|cunt\w*|dick\b|porn\w*|sex\w*|rape\w*|whore\w*|slut\w*|bastard\w*|nigg\w*|suicide|kill yourself|kys\b|nazi|hitler|drugs?\b|masturbat\w*|orgasm\w*|condom\w*|boobs?\b|tits?\b|horny|lust\w*|murder\w*|corpse\b|behead\w*|damn\w*|cursing|curse\w*|tongue|tattoo\w*|herpes|pee\w*|poop\w*|toilet\w*|fart\w*|vomit\w*|puke\w*|diarrhea|snot\w*|booger\w*|underwear|hangover\w*)\b/i;

/* the card is a mood-lifter: skip the heavy, dark, or upsetting ones */
const NEGATIVE =
  /\b(hate[ds]?|hatred|hating|deadly|dead|kills?|killed|killing|die|died|death|dying|mourn\w*|funerals?|graves?|murder\w*|wars?\b|weapons?|bombs?|terror\w*|torture\w*|abuse\w*|cancer|diseases?|sickness|illness\w*|hospital\w*|poverty|starving|slaves?|slavery|oppress\w*|cruel\w*|brutal\w*|horror|nightmares?|depress\w*|despair|misery|miserable|suffer\w*|suffering|painful|tears?|crying|cried|weep\w*|lonely|loneliness|sorrow\w*|regrets?\b|guilt\w*|shame\w*|jealous\w*|envy|envious|angry|anger\b|rage\b|revenge|betray\w*|cheat\w*|liars?|lying|steal\w*|theft|prison|jail|crimes?\b|criminals?|killer\w*|corrupt\w*|disasters?|tragedy|tragic|victims?|slaughter\w*|violence|violent\w*|destruction|destroy\w*|drown\w*|hell\b|devils?\b|bully\w*|slapped|fat\b|ugly|stupid\w*|idiot\w*|fools?\b|foolish|sad\w*|failure\b|failed|bankrupt\w*|divorce\w*|breakup|broken heart|wounds?\b|thorns?\b|worst\b|addict\w*|alcohol\w*|drunk\w*|smok\w*|cigarettes?|vulgar\w*|linger\w*|enem\w*|hopeless)\b/i;

/* politics / doom-scroll noise — not what this card is for */
const NOISE =
  /\b(government|president|minister|election|senate|congress|parliament|embassy|diplomac\w*|treaty|military|army|navy|senator|republican|democrat|communis\w*|capitalis\w*|socialis\w*|inflation|taxes?|tariffs?|recession|pandemic|vaccin\w*|covid|coronavirus|bitcoin|crypto\w*|gdp|unemployment)\b/i;

const JUNK =
  /(https?:\/\/|www\.|<|>|\{|\}|\\|\||\bTODO\b|\bundefined\b|\bnull\b|^\s*(source|see also)\s*:)/i;

  /* tiny typography repairs for scraped text */
const TYPO_FIXES = [
  [/\bdont\b/gi, "don't"], [/\bcant\b/gi, "can't"], [/\bwont\b/gi, "won't"],
  [/\bisnt\b/gi, "isn't"], [/\barent\b/gi, "aren't"], [/\bwasnt\b/gi, "wasn't"],
  [/\bwerent\b/gi, "weren't"], [/\bdidnt\b/gi, "didn't"], [/\bdoesnt\b/gi, "doesn't"],
  [/\bcouldnt\b/gi, "couldn't"], [/\bwouldnt\b/gi, "wouldn't"], [/\bshouldnt\b/gi, "shouldn't"],
  [/\bhasnt\b/gi, "hasn't"], [/\bhavent\b/gi, "haven't"], [/\bhadnt\b/gi, "hadn't"],
  [/\byoure\b/gi, "you're"], [/\btheyre\b/gi, "they're"], [/\btheyve\b/gi, "they've"],
  [/\btheres\b/gi, "there's"], [/\bthats\b/gi, "that's"], [/\bwhats\b/gi, "what's"],
  [/\bwheres\b/gi, "where's"], [/\bive\b/gi, "I've"], [/\byouve\b/gi, "you've"],
  [/\bweve\b/gi, "we've"], [/\bIm\b/g, "I'm"], [/\bId\b/g, "I'd"], [/\byall\b/gi, "y'all"],
];

function cleanText(raw) {
  if (typeof raw !== "string") return "";
  let t = raw
    .replace(/\u00a0/g, " ")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // markdown styling left over from scraped sources
  t = t.replace(/\*+/g, "").replace(/_{2,}/g, "");
  // truncated-quote markers
  t = t.replace(/\[\s*(\.{2,}|…)\s*\]/g, " ");
  t = t.replace(/\(\s*(\.{2,}|…)\s*\)/g, " ");
  // strip wrapping quotes
  t = t.replace(/^["'“”‘’\s]+/, "").replace(/["'“”‘’\s]+$/, "");
  // remove emoji + pictographs (they render oddly inside the card)
  t = t.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/gu, "");
  // leftover attribution glued to the text
  t = t.replace(/\s*[-–—]\s*(anonymous|unknown|author unknown)\s*$/i, "");
  // collapses any ".." or stray double spaces
  t = t.replace(/\s*\.{2,}\s*/g, "… ").replace(/\s+/g, " ").trim();
  // typography: common missing apostrophes + curly apostrophes
  for (const [re, fix] of TYPO_FIXES) t = t.replace(re, fix);
  t = t.replace(/([A-Za-z])'([A-Za-z])/g, "$1\u2019$2");
  // missing space after punctuation from bad scrapes: "over,Smile because"
  t = t.replace(/([a-z0-9])([.!?,;:])([A-Z])/g, "$1$2 $3");
  // a sentence that starts lowercase looks like a bug on the card
  if (/^[a-z]/.test(t)) t = t.charAt(0).toUpperCase() + t.slice(1);
  return t;
}

function cleanAuthor(raw) {
  if (typeof raw !== "string") return "";
  let a = cleanText(raw);
  a = a.replace(/\s*\(.*?\)\s*$/, "").trim(); // drop "(via ...)" tails
  if (/^(unknown|anonymous|author unknown|n\/a|none|-)$/i.test(a)) return "";
  if (a.length > 42) return "";
  a = a.replace(/^by\s+/i, "").trim();
  if (/^(unknown|anonymous)$/i.test(a)) return "";
  return a;
}

function looksBroken(t, trusted) {
  if (!t) return true;
  const letters = (t.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  if (letters < t.length * 0.55) return true; // too much punctuation/symbols
  if (!/[A-Za-z]{3}/.test(t)) return true;
  if (/(.)\1{5,}/.test(t)) return true; // aaaaaaaa
  const words = t.split(" ").filter(Boolean);
  if (words.length < 4) return true;
  const longWords = words.filter((w) => w.length > 22).length;
  if (longWords > 2) return true;
  if (/^(is|are|was|were|the|a|an|and|but|or)\b/i.test(t) && t.length < 60) return true;
  if (trusted) return false;

  /* "Every Word Capitalised Like This" — ugly scrape artefacts, not quotes */
  const meaningful = words.filter((w) => /[A-Za-z]{3,}/.test(w));
  if (meaningful.length >= 3) {
    const caps = meaningful.filter((w) => /^[A-Z]/.test(w)).length;
    if (caps / meaningful.length >= 0.99) return true; // fully title-cased
  }
  if (meaningful.length >= 6) {
    const caps = meaningful.filter((w) => /^[A-Z]/.test(w)).length;
    if (caps / meaningful.length > 0.72) return true;
  }
  return false;
}

function goodQuote(t, a, trusted) {
  if (!t) return false;
  if (t.length < MIN_LEN || t.length > MAX_LEN) return false;
  if (trusted) return true; // hand-written notes are always welcome
  if (BLOCK.test(t) || BLOCK.test(a)) return false;
  if (NEGATIVE.test(t)) return false;
  if (NOISE.test(t)) return false;
  if (JUNK.test(t)) return false;
  if (looksBroken(t)) return false;

  /* ── book-dialogue leftovers from bad scrapes ── */
  if (/["]{2}/.test(t)) return false; // he said""she said
  if (/[?!.,]"?\s*"(?=[A-Za-z])/.test(t)) return false;
  if (/[?!.,]"\s*[A-Za-z]/.test(t)) return false;
  if (/\b(said|asked|replied|whispered|shouted|muttered|answered)\b/i.test(t)) return false;
  if (/[a-z]"[a-z]/.test(t)) return false; // "Growth of Love"so much
  if (/[\u201c\u201d]/.test(t.slice(1, -1))) return false; // curly quotes inside
  /* two words glued together by a lost space: "muchJust", "heartAnd" */
  if (/[a-z]{2}[A-Z][a-z]/.test(t)) return false;

  // a quote ending in a dangling hyphen / comma feels cut off
  if (/[,;:\-–—]\s*…?$/.test(t)) return false;
  return true;
}

const keyOf = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 72);

/* naive category guesser used for datasets without tags/genres */
const LOVE_RE =
  /\b(love|loved|lover|beloved|heart|hearts|kiss|kisses|romance|romantic|darling|sweetheart|soulmate|beloved|adore|adored|forever with)\b/i;
const SUCCESS_RE =
  /\b(success|successful|winner|win|winning|goal|goals|dream|dreams|ambition|excellence|achieve|achievement|work hard|hard work|discipline|wealth|rich|effort)\b/i;
const FRIEND_RE =
  /\b(friend|friends|friendship|companion|together|brotherhood|sisterhood|companionship|bond)\b/i;
const SMILE_RE =
  /\b(laugh|laughter|smile|smiles|smiling|joy|happy|happiness|fun|funny|joke|dance|dancing|celebrate|delight)\b/i;
const WISDOM_RE =
  /\b(wisdom|wise|knowledge|truth|truths|understanding|learn|learning|experience|patience|humility|time|thinking|thoughts)\b/i;

function guessCat(t) {
  if (LOVE_RE.test(t)) return CAT.LOVE;
  if (SMILE_RE.test(t)) return CAT.SMILE;
  if (SUCCESS_RE.test(t)) return CAT.SUCCESS;
  if (FRIEND_RE.test(t)) return CAT.FRIENDSHIP;
  if (WISDOM_RE.test(t)) return CAT.WISDOM;
  return CAT.MOTIVATION;
}

const TAG_MAP = {
  life: CAT.LIFE, beauty: CAT.LIFE, nature: CAT.LIFE, music: CAT.LIFE,
  inspirational: CAT.MOTIVATION, inspiration: CAT.MOTIVATION, "inspirational-quotes": CAT.MOTIVATION,
  motivational: CAT.MOTIVATION, motivation: CAT.MOTIVATION, hope: CAT.MOTIVATION,
  courage: CAT.MOTIVATION, strength: CAT.MOTIVATION, resilience: CAT.MOTIVATION,
  perseverance: CAT.MOTIVATION, determination: CAT.MOTIVATION, confidence: CAT.MOTIVATION,
  "self-esteem": CAT.MOTIVATION, encouragement: CAT.MOTIVATION, optimism: CAT.MOTIVATION,
  "self-improvement": CAT.MOTIVATION, "personal-growth": CAT.MOTIVATION,
  "personal-development": CAT.MOTIVATION, "self-love": CAT.MOTIVATION, "self-care": CAT.MOTIVATION,
  "positive-thinking": CAT.MOTIVATION, "positive-attitude": CAT.MOTIVATION,
  "positive-mindset": CAT.MOTIVATION, "positive-outlook": CAT.MOTIVATION,
  "positive-quotes": CAT.MOTIVATION, "positive-thoughts": CAT.MOTIVATION,
  positivity: CAT.MOTIVATION, "self-help": CAT.MOTIVATION, selfhelp: CAT.MOTIVATION,
  attitude: CAT.MOTIVATION, change: CAT.MOTIVATION,
  wisdom: CAT.WISDOM, "wisdom-quotes": CAT.WISDOM, philosophy: CAT.WISDOM,
  philosophical: CAT.WISDOM, truth: CAT.WISDOM, truthfulness: CAT.WISDOM,
  knowledge: CAT.WISDOM, education: CAT.WISDOM, learning: CAT.WISDOM,
  "mind-power": CAT.WISDOM, purpose: CAT.WISDOM, meaning: CAT.WISDOM,
  patience: CAT.WISDOM, "inner-peace": CAT.WISDOM, mindful: CAT.WISDOM,
  meditation: CAT.WISDOM, faith: CAT.WISDOM, time: CAT.WISDOM, "famous-quotes": CAT.WISDOM,
  famous: CAT.WISDOM,
  success: CAT.SUCCESS, "success-quotes": CAT.SUCCESS, business: CAT.SUCCESS,
  leadership: CAT.SUCCESS, work: CAT.SUCCESS, dreams: CAT.SUCCESS, goals: CAT.SUCCESS,
  ambition: CAT.SUCCESS,
  friendship: CAT.FRIENDSHIP, friend: CAT.FRIENDSHIP, friends: CAT.FRIENDSHIP,
  compassion: CAT.FRIENDSHIP, empathy: CAT.FRIENDSHIP, generosity: CAT.FRIENDSHIP,
  kindness: CAT.FRIENDSHIP,
  humor: CAT.SMILE, humour: CAT.SMILE, funny: CAT.SMILE, happiness: CAT.SMILE,
  happy: CAT.SMILE, smile: CAT.SMILE, smiles: CAT.SMILE, laughing: CAT.SMILE,
  laughter: CAT.SMILE, joy: CAT.SMILE, cheerful: CAT.SMILE, delight: CAT.SMILE,
  wonder: CAT.SMILE, gratitude: CAT.SMILE,
  love: CAT.LOVE, "love-quotes": CAT.LOVE, romance: CAT.LOVE, romantic: CAT.LOVE,
  relationships: CAT.LOVE, marriage: CAT.LOVE, affection: CAT.LOVE,
  "unconditional-love": CAT.LOVE, "power-of-love": CAT.LOVE, poetry: CAT.LOVE,
};

function mapTags(list) {
  if (!Array.isArray(list)) return null;
  for (const raw of list) {
    const tag = String(raw).toLowerCase().trim();
    if (tag in TAG_MAP) return TAG_MAP[tag];
  }
  return null;
}

/* ══════════════════════════════════════════════════════════════
   3. FETCHING
   ══════════════════════════════════════════════════════════════ */

async function getJSON(url, timeout = 25000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "user-agent": "ivory-quote-builder/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const bag = []; // { t, a, c, p }  p = popularity (higher = more loved)

function push(text, author, cat, popularity = 0, trusted = false) {
  const t = cleanText(text);
  const a = cleanAuthor(author);
  if (!goodQuote(t, a, trusted)) return false;
  bag.push({
    t,
    a,
    c: typeof cat === "number" ? cat : guessCat(t),
    p: Number(popularity) || 0,
  });
  return true;
}

/* ── the huge Goodreads-style dataset (48k quotes with popularity) ── */

/* tags that mean "this one will make her feel good" */
const FRIENDLY_TAGS = new Set([
  "love", "romantic", "romance", "relationships", "happiness", "happy", "humor", "funny",
  "smile", "laughter", "inspirational", "inspiration", "inspirational-quotes", "motivation",
  "motivational", "positive-thinking", "positive-attitude", "positive-mindset", "positive-outlook",
  "positive-quotes", "positive-thoughts", "positivity", "hope", "faith", "success", "dreams",
  "friendship", "kindness", "gratitude", "joy", "life", "wisdom", "truth", "mind-power",
  "self-improvement", "personal-growth", "personal-development", "self-esteem", "confidence",
  "encouragement", "mindful", "meditation", "purpose", "meaning", "compassion", "empathy",
  "generosity", "patience", "courage", "strength", "resilience", "perseverance", "determination",
  "self-love", "self-care", "inner-peace", "optimism", "cheerful", "delight", "wonder", "beauty",
  "nature", "music", "quotes", "quote",
]);

/* topics we never want on a card meant to make her smile */
const HEAVY_TAGS =
  /^(death|suicide|suicidal-thoughts|sad|sadness|grief|grieving|mourning|depression|depressed|anger|hate|hatred|war|violence|addiction|addict|abuse|divorce|breakup|break-up|pain|suffering|illness|disease|cancer|trauma|loss|loneliness|lonely|fear|anxiety|stress|struggle|darkness|evil|sin|guilt|shame|jealousy|envy|bitterness|sorrow|despair|hopeless|tragedy|murder|crime|prison|jail|poverty|hunger|famine|homeless|disaster|sex|sexual|erotica|drugs|alcohol|cigarettes|smoking)$/;

async function srcPopular48k() {
  const data = await getJSON(
    "https://raw.githubusercontent.com/akmittal/quotes-dataset/master/quotes.json",
    60000
  );
  const rows = data
    .filter((r) => {
      const tags = (r.Tags || []).map((t) => String(t).toLowerCase().trim());
      // skip quotes whose attribution is known to be wrong / unverifiable
      if (tags.some((t) => t.startsWith("misattributed") || t === "attributed-no-source")) return false;
      // skip heavy topics outright
      if (tags.some((t) => HEAVY_TAGS.test(t))) return false;
      // keep only quotes the dataset itself labels as uplifting
      return tags.some((t) => FRIENDLY_TAGS.has(t));
    })
    .sort((a, b) => (Number(b.Popularity) || 0) - (Number(a.Popularity) || 0));

  let kept = 0;
  for (const row of rows) {
    if (push(row.Quote, row.Author, mapTags(row.Tags), (Number(row.Popularity) || 0) * 1000)) kept++;
    if (kept >= 12000) break; // plenty; the ranking will keep the best
  }
  return kept;
}

/* ── Quotable (community mirror of the classic API) ─────────────── */
async function srcQuotableMirror() {
  let kept = 0;
  for (let page = 1; page <= 26; page++) {
    let data;
    try {
      data = await getJSON(
        `https://api.quotable.kurokeita.dev/api/quotes?limit=100&page=${page}`,
        20000
      );
    } catch {
      break;
    }
    const results = data.results || data.data || [];
    if (!results.length) break;
    for (const row of results) {
      const cat = mapTags(row.tags);
      if (push(row.content, row.author, cat, 0)) kept++;
    }
    if (results.length < 100) break;
    await sleep(150);
  }
  return kept;
}

/* ── JamesFT open quote database ────────────────────────────────── */
async function srcJamesFT() {
  const data = await getJSON(
    "https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json",
    40000
  );
  let kept = 0;
  for (const row of data) {
    const cat = mapTags([row.quoteGenre]) ?? guessCat(cleanText(row.quoteText));
    if (push(row.quoteText, row.quoteAuthor, cat, 0)) kept++;
  }
  return kept;
}

/* ── DummyJSON quotes (handy, also used live at runtime) ────────── */
async function srcDummyJSON() {
  const first = await getJSON("https://dummyjson.com/quotes?limit=1&skip=0");
  const total = Math.min(first.total || 0, 3000);
  let kept = 0;
  for (let skip = 0; skip < total; skip += 150) {
    const page = await getJSON(`https://dummyjson.com/quotes?limit=150&skip=${skip}`);
    for (const row of page.quotes || []) {
      if (push(row.quote, row.author, null, 0)) kept++;
    }
  }
  return kept;
}

/* ── dwyl quotes ────────────────────────────────────────────────── */
async function srcDwyl() {
  const data = await getJSON(
    "https://cdn.jsdelivr.net/gh/dwyl/quotes@master/quotes.json",
    25000
  );
  let kept = 0;
  for (const row of data) if (push(row.text, row.author, null, 0)) kept++;
  return kept;
}

/* ── ZenQuotes: gives 50 random quotes per call ─────────────────── */
async function srcZenQuotes() {
  let kept = 0;
  for (let i = 0; i < 8; i++) {
    let data;
    try {
      data = await getJSON("https://zenquotes.io/api/quotes", 20000);
    } catch {
      break;
    }
    if (!Array.isArray(data)) break;
    for (const row of data) {
      if (row && row.q && row.q.length < 400) {
        if (push(row.q, row.a, null, 5)) kept++;
      }
    }
    await sleep(3500); // stay inside their free-tier limits
  }
  return kept;
}

/* ── hand-picked classics + desi lines ─────────────────────────── */
async function srcCurated() {
  const rows = [
    ["The best way to predict your future is to create it.", "Abraham Lincoln", CAT.MOTIVATION],
    ["Happiness is not something ready made. It comes from your own actions.", "Dalai Lama", CAT.SMILE],
    ["You miss 100% of the shots you don't take.", "Wayne Gretzky", CAT.MOTIVATION],
    ["The only way to do great work is to love what you do.", "Steve Jobs", CAT.SUCCESS],
    ["In the middle of difficulty lies opportunity.", "Albert Einstein", CAT.MOTIVATION],
    ["It always seems impossible until it's done.", "Nelson Mandela", CAT.MOTIVATION],
    ["The future belongs to those who believe in the beauty of their dreams.", "Eleanor Roosevelt", CAT.MOTIVATION],
    ["Do what you can, with what you have, where you are.", "Theodore Roosevelt", CAT.MOTIVATION],
    ["A smooth sea never made a skilled sailor.", "Franklin D. Roosevelt", CAT.MOTIVATION],
    ["Fall seven times, stand up eight.", "Japanese Proverb", CAT.MOTIVATION],
    ["Little by little, one travels far.", "J. R. R. Tolkien", CAT.MOTIVATION],
    ["The sun himself is weak when he first rises, and gathers strength and courage as the day gets on.", "Charles Dickens", CAT.MOTIVATION],
    ["Keep your face always toward the sunshine, and shadows will fall behind you.", "Walt Whitman", CAT.MOTIVATION],
    ["No act of kindness, no matter how small, is ever wasted.", "Aesop", CAT.LIFE],
    ["Wherever you go, go with all your heart.", "Confucius", CAT.LIFE],
    ["The journey of a thousand miles begins with a single step.", "Lao Tzu", CAT.WISDOM],
    ["What you seek is seeking you.", "Rumi", CAT.LOVE],
    ["Love is the bridge between two hearts, and the only map that never fails.", "Rumi", CAT.LOVE],
    ["You are not a drop in the ocean. You are the entire ocean in a drop.", "Rumi", CAT.WISDOM],
    ["Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", "Rumi", CAT.WISDOM],
    ["Raise your words, not your voice. It is rain that grows flowers, not thunder.", "Rumi", CAT.WISDOM],
    ["Let yourself be silently drawn by the strange pull of what you really love.", "Rumi", CAT.LOVE],
    ["Sit quietly and listen to the voice within; it knows the way home.", "Rumi", CAT.WISDOM],
    ["Gratitude turns what we have into enough.", "Aesop", CAT.LIFE],
    ["Jika kamu tidak tahan lelahnya belajar, maka kamu akan menanggung perihnya kebodohan.", "Imam Syafi'i", CAT.WISDOM],
    ["Tum mujhe yun hi nahi acche lagte, kuch toh hai jo mera tumse juda hai.", "", CAT.LOVE],
    ["Zindagi mein sab kuch mil jaata hai, bas waqt se pehle nahi milta.", "", CAT.LIFE],
    ["Khushiyan chhoti chhoti cheezon mein chhupi hoti hain.", "", CAT.SMILE],
    ["Neend se pehle tumhara naam, aur subah pehli tumhari yaad.", "", CAT.LOVE],
    ["Dua mein bhi tum, khwab mein bhi tum, aur dil ki har dhadkan mein sirf tum.", "", CAT.LOVE],
    ["Jab tum saath ho, toh safar bhi manzil lagta hai.", "", CAT.LOVE],
    ["Muskuraye raho, kyunki tumhari muskaan kisi ki poori duniya hai.", "", CAT.SMILE],
    ["Sabr karo, achhe dino ka intezaar bhi ek ibadat hai.", "", CAT.MOTIVATION],
    ["Tum jahan jahan jaogi, roshni saath lekar jaogi.", "", CAT.LOVE],
    ["Mushkil waqt mein bhi himmat mat chhodo, yeh waqt bhi guzar jayega.", "", CAT.MOTIVATION],
  ];
  let kept = 0;
  for (const [t, a, c] of rows) if (push(t, a, c, 20)) kept++;
  return kept;
}

/* ══════════════════════════════════════════════════════════════
   4. MAIN
   ══════════════════════════════════════════════════════════════ */

const SOURCES = [
  ["Top 48k loved quotes", srcPopular48k],
  ["Quotable mirror", srcQuotableMirror],
  ["JamesFT open quotes", srcJamesFT],
  ["DummyJSON quotes", srcDummyJSON],
  ["dwyl quotes", srcDwyl],
  ["ZenQuotes", srcZenQuotes],
  ["Curated classics", srcCurated],
];

console.log("Fetching quote sources…\n");

for (const [name, fn] of SOURCES) {
  try {
    const n = await fn();
    console.log(`  ✓ ${name.padEnd(24)} ${String(n).padStart(5)} kept`);
  } catch (err) {
    console.log(`  ✗ ${name.padEnd(24)} failed: ${err.message}`);
  }
}

/* personal notes (always included) */
for (const [t, a] of FOR_ANVESHIKA) push(t, a, CAT.FOR_YOU, 9999, true);
console.log(`  ✓ ${"For Anveshika".padEnd(24)} ${String(FOR_ANVESHIKA.length).padStart(5)} kept`);

/* ── de-duplicate (keep the most popular / authored version) ──── */
function score(q) {
  let s = Math.min(q.p, 25); // how loved the quote is
  if (q.c === CAT.FOR_YOU) s += 100000;
  if (q.a) s += 15;
  if (q.c === CAT.MOTIVATION || q.c === CAT.LOVE) s += 8;
  if (q.c === CAT.SMILE || q.c === CAT.SUCCESS) s += 6;
  if (q.c === CAT.WISDOM) s += 5;
  if (q.t.length >= 40 && q.t.length <= 165) s += 10; // the sweet spot for a card
  if (q.t.length <= 120) s += 4; // short ones read best on a phone
  if (/^[A-Z"“']/.test(q.t)) s += 2;
  if (/,/.test(q.a)) s -= 10; // book/movie attributions read worse standalone
  if (/--/.test(q.t)) s -= 3; // heavy literary punctuation
  return s;
}

const seen = new Map();
for (const q of bag) {
  const k = keyOf(q.t);
  if (!k || k.length < 12) continue;
  const prev = seen.get(k);
  if (!prev || score(q) > score(prev)) seen.set(k, q);
}

/* pick a balanced mix: a quota per category, so the card never feels samey */
const QUOTA = {
  [CAT.FOR_YOU]: 999, // her personal notes — always all of them
  [CAT.MOTIVATION]: 1700,
  [CAT.LOVE]: 1500,
  [CAT.SMILE]: 850,
  [CAT.WISDOM]: 650,
  [CAT.SUCCESS]: 550,
  [CAT.LIFE]: 400,
  [CAT.FRIENDSHIP]: 350,
};

const byCat = new Map();
for (const q of [...seen.values()].sort((a, b) => score(b) - score(a))) {
  if (!byCat.has(q.c)) byCat.set(q.c, []);
  byCat.get(q.c).push(q);
}

let quotes = [];
const leftovers = [];
for (const [cat, list] of byCat) {
  const quota = QUOTA[cat] ?? 400;
  quotes.push(...list.slice(0, quota));
  leftovers.push(...list.slice(quota));
}
if (quotes.length < MAX_QUOTES) {
  leftovers.sort((a, b) => score(b) - score(a));
  quotes.push(...leftovers.slice(0, MAX_QUOTES - quotes.length));
} else if (quotes.length > MAX_QUOTES) {
  quotes.sort((a, b) => score(b) - score(a));
  quotes = quotes.slice(0, MAX_QUOTES);
}

/* shuffle a little so daily picks feel random, without losing the good stuff */
for (let i = quotes.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  if (Math.random() < 0.35) [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
}

/* ── counts per category ──────────────────────────────────── */
const catNames = ["Life", "Love", "Motivation", "Wisdom", "Success", "Friendship", "Smile", "For You"];
const catCount = {};
for (const q of quotes) catCount[catNames[q.c]] = (catCount[catNames[q.c]] || 0) + 1;

/* ── write the file ───────────────────────────────────────── */
const packed = quotes.map((q) => [q.t, q.a, q.c]);
const stamp = new Date().toISOString().slice(0, 10);

const out = `/*!
 * Ivory · Daily Quote Collection
 * Generated: ${stamp}
 * ${packed.length} quotes for Anveshika — the offline safety net for her Daily Quote card.
 * Format: [quote, author, categoryCode]  (category table lives in daily-quote.js)
 * Rebuild with: node scripts/build_quotes.mjs
 */
window.IVORY_QUOTES = ${JSON.stringify(packed).replace(/<\//g, "<\\/")};
window.IVORY_QUOTES_META = { count: ${packed.length}, generated: "${stamp}" };
`;

await fs.writeFile(OUT_FILE, out, "utf8");

const kb = (Buffer.byteLength(out, "utf8") / 1024).toFixed(0);
console.log("\n─── result ───────────────────────────────────────");
console.log(`  kept        : ${packed.length} unique quotes`);
console.log(`  categories  : ${JSON.stringify(catCount)}`);
console.log(`  file        : quotes-data.js (${kb} KB)`);

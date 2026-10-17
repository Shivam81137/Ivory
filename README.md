# Ivory 🎵

Ivory is a modern, responsive music streaming web application designed to deliver a seamless listening experience. It features a sleek user interface, comprehensive track discovery, and synchronized real-time lyrics, all powered by external APIs.

## Features

* **Rich Music Catalog:** Search and discover music seamlessly.
* **Real-Time Lyrics:** View perfectly synced lyrics for your favorite tracks.
* **Responsive UI:** A beautifully designed interface that works flawlessly across desktop, tablet, and mobile devices.
* **Audio Playback Controls:** Smooth and intuitive media player with play, pause, skip, and volume controls.
* **Customizable Streaming:** Easily configure your streaming sources, search behavior, and API keys via `STREAMING_CONFIG.js`.
* **Daily Quote Card:** A personal, auto-updating quote card for Anveshika at the top of the home view — a fresh quote on every visit (live from the internet when online, with a bundled collection of 6,000 quotes as an offline safety net), plus save ❤️, copy and share. See [Daily quote card](#daily-quote-card).

## Tech Stack

* **Frontend:** Vanilla HTML5, CSS3, and JavaScript
* **APIs:** 
  * iTunes Search API (Track and metadata retrieval)
  * LRCLIB (Synchronized lyrics)
  * Optional: YouTube Data API v3, Spotify Web API, Last.fm API
* **PWA Support:** Service worker (`sw.js`) and manifest included for Progressive Web App capabilities.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Since Ivory is built with Vanilla web technologies, no build tools or package managers are required! All you need is a modern web browser.

### Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ivory.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd ivory
   ```
3. **Open the app:**
   Simply open `index.html` in your web browser. 
   
   *Note: For the best experience and to avoid potential CORS issues with some APIs or Service Workers, we recommend serving the folder using a local web server (e.g., using the "Live Server" extension in VS Code, or running `python -m http.server` in your terminal).*

### Configuration

You can customize the player's behavior by editing the `STREAMING_CONFIG.js` file. Here you can:
- Enable/disable streaming sources (iTunes, Deezer, JioSaavn).
- Add optional API keys (YouTube, Spotify, Last.fm) for enhanced features like background videos or better metadata.
- Adjust search timeout, result limits, and regional settings.

> **Important Security Note:** Never commit your actual API keys to a public repository. The provided `STREAMING_CONFIG.js` uses placeholders by default. If you add your own keys, ensure you don't accidentally push them!

---

## Daily quote card

A soft glass card that sits at the top of the home view and greets **Anveshika** with a different quote every time she opens the site.

**How it works**

1. **Instant** — a quote from the bundled collection (`quotes-data.js`, **6,000 quotes**) appears as soon as the page paints. No waiting, no blank card.
2. **Live** — right after the first paint it asks the internet for a fresh quote (Quotable mirror → TheQuotesHub → DummyJSON) and gently swaps it in with a `✨ fresh from the internet` tag when one arrives.
3. **Remembers** — the last quote and favourites live in `localStorage`, so she never sees the same quote twice in a row and nothing needs a server.
4. **Grows** — after a few seconds, quotes fetched from the internet are added to the local pool (capped at 2,600) so the collection keeps getting bigger over time.
5. **Offline** — with no internet at all the card still works perfectly from the bundled collection. The service worker caches everything.

**Extras she'll find**

* 🕰️ A greeting that changes with the time of day (`Good morning…`, `Still awake, sunshine?`)
* 🌷 `Day N` — a little counter of how many days she has opened the app
* 🤍 **Save** — quotes she loves go into "Her little book" (a drawer inside the card)
* 📤 Share / 📋 Copy, plus a rotating `P.S.` love note and floating hearts when she taps the monogram

**Files**

| File | What it is |
| --- | --- |
| `daily-quote.js` | Card markup, quote picking, internet layer, saving/sharing |
| `daily-quote.css` | Card styling (matches the Ivory glass/neon theme, mobile-aware) |
| `quotes-data.js` | The generated offline collection: `[quote, author, category]` |
| `scripts/build_quotes.mjs` | Rebuilds `quotes-data.js` from public datasets |

**Rebuilding the collection** (optional, needs internet):

```bash
npm run build:quotes
```

It merges several public quote datasets, keeps the most loved ones, filters out anything rude, dark or badly scraped, adds a hand-written "for Anveshika" section, and rewrites `quotes-data.js`. Stats are printed when it finishes.

**Tuning it**

Open `daily-quote.js` and change:

* `GIRL` / `FROM` — the names on the card.
* `WEIGHTS` — how often each category (love, motivation, smile…) shows up.
* `PS_LINES` — the little `P.S.` notes under the quote.
* The list of sources inside `fetchLiveQuote()` — the live quote APIs.

Local preview: `npm run dev` then open <http://localhost:5173>.

# Ivory 🎵

Ivory is a modern, responsive music streaming web application designed to deliver a seamless listening experience. It features a sleek user interface, comprehensive track discovery, and synchronized real-time lyrics, all powered by external APIs.

## Features

* **Rich Music Catalog:** Search and discover music seamlessly.
* **Real-Time Lyrics:** View perfectly synced lyrics for your favorite tracks.
* **Responsive UI:** A beautifully designed interface that works flawlessly across desktop, tablet, and mobile devices.
* **Audio Playback Controls:** Smooth and intuitive media player with play, pause, skip, and volume controls.
* **Customizable Streaming:** Easily configure your streaming sources, search behavior, and API keys via `STREAMING_CONFIG.js`.

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

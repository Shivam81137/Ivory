// ═══════════════════════════════════════════════════════════════════════════
// IVORY MUSIC PLAYER - STREAMING CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

// This file allows you to customize your online streaming behavior
// and add optional API keys for enhanced features

const IVORY_STREAMING_CONFIG = {
    // ─── API Keys (Optional) ───────────────────────────────────────────────
    // These services work WITHOUT keys, but you can add them for better rates
    
    // YouTube Data API V3 - For Canvas/Background Videos
    // Get from: https://console.cloud.google.com
    YOUTUBE_API_KEY: "YOUR_YOUTUBE_API_KEY",
    
    // Spotify Web API - For metadata enrichment
    // Get from: https://developer.spotify.com
    SPOTIFY_CLIENT_ID: "",
    SPOTIFY_CLIENT_SECRET: "",
    
    // Last.fm - For song history and recommendations
    // Get from: https://www.last.fm/api/account/create
    LASTFM_API_KEY: "",
    
    // ─── Feature Toggles ───────────────────────────────────────────────────
    
    // Enable/Disable streaming sources
    ENABLE_DEEZER: true,           // 70M+ songs, HQ streaming
    ENABLE_JIOSAAVN: true,         // 30M+ Indian music, HQ streaming  
    ENABLE_ITUNES: true,           // 50M+ songs, previews
    ENABLE_SPOTIFY: false,         // Requires OAuth setup
    ENABLE_YOUTUBE_CANVAS: false,  // Background video while playing
    
    // ─── Search Configuration ───────────────────────────────────────────────
    
    // Maximum results per source
    MAX_RESULTS_PER_SOURCE: 15,    // Total results will be ~45-60
    
    // Search timeout (ms)
    SEARCH_TIMEOUT: 5000,           // Wait max 5s for all sources
    
    // Auto-fetch album art
    AUTO_FETCH_ART: true,
    AUTO_FETCH_LYRICS: true,
    AUTO_FETCH_VIDEO: false,        // YouTube background
    
    // ─── Quality & Performance ─────────────────────────────────────────────
    
    // Preferred streaming quality
    PREFERRED_QUALITY: "high",      // Options: "high", "normal", "low"
    
    // Enable adaptive bitrate streaming
    ADAPTIVE_BITRATE: true,
    
    // Cache search results (seconds)
    SEARCH_CACHE_TTL: 3600,         // 1 hour
    
    // Cache album art (days)
    ART_CACHE_DAYS: 30,
    
    // ─── UI Customization ──────────────────────────────────────────────────
    
    // Show source badges in search results
    SHOW_SOURCE_BADGE: true,
    
    // Show quality indicator (FULL/Preview)
    SHOW_QUALITY_INDICATOR: true,
    
    // Show streaming source in now-playing
    SHOW_SOURCE_IN_PLAYER: true,
    
    // ─── Regional Settings ─────────────────────────────────────────────────
    
    // Your region for better recommendations
    REGION: "auto",                // "auto", "IN", "US", "GB", etc.
    
    // Preferred language for search results
    SEARCH_LANGUAGE: "en",         // "en", "hi", "pu" (Punjabi)
    
    // ─── Logging & Debugging ───────────────────────────────────────────────
    
    // Enable debug logs in console
    DEBUG_MODE: false,
    
    // Log API requests
    LOG_API_CALLS: false,
    
    // Log streaming errors
    LOG_STREAMING_ERRORS: true,
    
    // ─── Advanced Settings ─────────────────────────────────────────────────
    
    // CORS proxy (if you need to handle cross-origin)
    CORS_PROXY: "",                 // Leave empty for standard fetching
    
    // Retry failed streams
    MAX_RETRIES: 3,
    
    // Retry delay (ms)
    RETRY_DELAY: 1000,
    
    // ─── Feature: Recommendations ──────────────────────────────────────────
    
    // Enable "Similar Songs" feature
    ENABLE_RECOMMENDATIONS: true,
    
    // Show trending songs
    SHOW_TRENDING: true,
    
    // ─── Feature: Social ───────────────────────────────────────────────────
    
    // Share plays to social media
    ENABLE_SHARING: true,
    
    // Save favorites to cloud
    ENABLE_CLOUD_SYNC: false,
};

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE: How to Add Your Own API Keys
// ═══════════════════════════════════════════════════════════════════════════

/*
STEP 1: Get API Keys

YouTube Canvas API:
  - Go to: https://console.cloud.google.com
  - Create project
  - Enable "YouTube Data API V3"
  - Create OAuth 2.0 credentials
  - Copy API key to YOUTUBE_API_KEY above

Spotify API:
  - Go to: https://developer.spotify.com
  - Create app
  - Copy Client ID and Secret
  - You'll need OAuth2 implementation

Last.fm API:
  - Go to: https://www.last.fm/api
  - Click "Create API Account"
  - Copy API key

STEP 2: Add Keys to This File
  - Replace the values above
  - Keys are NOT sent to our servers
  - Only used by your browser

STEP 3: Reload Player
  - Clear browser cache
  - Reload Ivory player
  - Features automatically enable
*/

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE: How to Customize Search Behavior
// ═══════════════════════════════════════════════════════════════════════════

/*
EXAMPLE 1: Faster Search (3-second timeout)
  Change: SEARCH_TIMEOUT: 3000
  Effect: Fewer complete results, but instant response

EXAMPLE 2: More Results Per Source
  Change: MAX_RESULTS_PER_SOURCE: 25
  Effect: Slower search, but more options to choose from

EXAMPLE 3: Focus on Indian Music
  Change: 
    ENABLE_JIOSAAVN: true
    ENABLE_DEEZER: true
    ENABLE_ITUNES: false
  Effect: Only Indian and Deezer music shows

EXAMPLE 4: Low Bandwidth Mode
  Change:
    PREFERRED_QUALITY: "low"
    ADAPTIVE_BITRATE: true
  Effect: Less data, better for slow connections

EXAMPLE 5: Privacy Mode (No tracking)
  Change:
    ENABLE_RECOMMENDATIONS: false
    ENABLE_CLOUD_SYNC: false
    ENABLE_SHARING: false
  Effect: Complete privacy, no external connections
*/

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT FOR USE IN SCRIPT
// ═══════════════════════════════════════════════════════════════════════════

// Make globally available
if (typeof window !== 'undefined') {
    window.IVORY_CONFIG = IVORY_STREAMING_CONFIG;
}

// For Node.js/Module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IVORY_STREAMING_CONFIG;
}

// ═══════════════════════════════════════════════════════════════════════════
// USAGE IN SCRIPT.JS
// ═══════════════════════════════════════════════════════════════════════════

/*
In script.js, use config like:

    const config = window.IVORY_CONFIG || IVORY_STREAMING_CONFIG;
    
    if (config.ENABLE_DEEZER) {
        // Deezer search enabled
    }
    
    if (config.DEBUG_MODE) {
        console.log('Debug:', ...);
    }
    
    const maxResults = config.MAX_RESULTS_PER_SOURCE;
*/

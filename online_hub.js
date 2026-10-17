/* ============================================================================
 * Ivory Online Hub  —  infinite online songs + open-source music servers
 * ----------------------------------------------------------------------------
 * Adds three things to the Ivory player, without touching its core playback:
 *
 *   1. MUSIC SERVERS (Subsonic / OpenSubsonic compatible)
 *        Navidrome, Airsonic, Gonic, Supersonic, Funkwhale, Subsonic, …
 *        - metadata is spoken over the Subsonic REST API using JSONP, so it
 *          works even when the server does not send CORS headers
 *        - audio streams need CORS (see the "CORS proxy" field / README note)
 *
 *   2. INFINITE RADIO (Audius) — a key-less, free, full-length open catalog.
 *
 *   3. "EXTRA SONGS" — every non-local (online) song that gets played is
 *        collected here and can be replayed as its own endless list.
 *
 * Loaded with `defer` AFTER script.js, so the globals it wraps
 * (renderHome / _resolveAdjacentIndex / playSongAtIndex / songs / currentIndex)
 * already exist.
 * ========================================================================== */
(function () {
  'use strict';
  if (window.IvoryHub) return;

  var CFG_KEY   = 'ivory_servers_v1';
  var EXTRA_KEY = 'ivory_extra_songs_v1';
  var MAX_EXTRA = 500;
  var APP_NAME  = 'ivory';
  var API_VER   = '1.16.1';
  var CLIENT    = 'IvoryWeb';

  /* ══════════════════════════════ utilities ══════════════════════════════ */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function fmtDur(sec) {
    sec = Math.max(0, Math.round(Number(sec) || 0));
    if (typeof window.formatTime === 'function') { try { return window.formatTime(sec); } catch (e) {} }
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function toast(msg, ms) {
    try {
      var t = document.createElement('div');
      t.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);' +
        'background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:12px 22px;' +
        'border-radius:10px;font-size:14px;z-index:100001;box-shadow:0 8px 24px rgba(0,0,0,.35);' +
        'max-width:80vw;text-align:center;pointer-events:none';
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(function () { try { t.remove(); } catch (e) {} }, ms || 2600);
    } catch (e) {}
  }

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, ms); })
    ]);
  }

  function normBase(url) {
    var u = String(url || '').trim().replace(/\/+$/, '');
    if (u && !/^https?:\/\//i.test(u)) u = 'http://' + u;
    return u;
  }

  /* ══════════════════════════════ MD5 (Subsonic token auth) ══════════════
   * Subsonic token auth is md5(password + salt). WebCrypto has no MD5, so we
   * ship a small, spec-compliant implementation. */

  var MD5_S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];
  var MD5_K = (function () {
    var k = [];
    for (var i = 0; i < 64; i++) k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
    return k;
  })();

  function md5(str) {
    var bytes = Array.from(new TextEncoder().encode(String(str)));
    var origLen = bytes.length;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    var bitLen = origLen * 8;
    for (var i = 0; i < 8; i++) { bytes.push(bitLen & 0xff); bitLen = Math.floor(bitLen / 256); }

    var a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    var rol = function (x, c) { return (x << c) | (x >>> (32 - c)); };

    for (var off = 0; off < bytes.length; off += 64) {
      var M = new Array(16);
      for (var j = 0; j < 16; j++) {
        M[j] = bytes[off + j * 4] | (bytes[off + j * 4 + 1] << 8) |
               (bytes[off + j * 4 + 2] << 16) | (bytes[off + j * 4 + 3] << 24);
      }
      var A = a0, B = b0, C = c0, D = d0;
      for (var r = 0; r < 64; r++) {
        var F, g;
        if (r < 16) { F = (B & C) | (~B & D); g = r; }
        else if (r < 32) { F = (D & B) | (~D & C); g = (5 * r + 1) % 16; }
        else if (r < 48) { F = B ^ C ^ D; g = (3 * r + 5) % 16; }
        else { F = C ^ (B | ~D); g = (7 * r) % 16; }
        F = (F + A + MD5_K[r] + M[g]) | 0;
        A = D; D = C; C = B;
        B = (B + rol(F, MD5_S[r])) | 0;
      }
      a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
    }
    var hexLE = function (n) {
      var s = '';
      for (var b = 0; b < 4; b++) s += ('0' + ((n >>> (b * 8)) & 0xff).toString(16)).slice(-2);
      return s;
    };
    return hexLE(a0) + hexLE(b0) + hexLE(c0) + hexLE(d0);
  }

  function randSalt(n) {
    var s = '', chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < (n || 10); i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  /* ═════════════════════════════ JSONP transport ════════════════════════ */

  var cbSeq = 0;
  function jsonp(url, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var cb = '__ivory_cb_' + (++cbSeq);
      var script = document.createElement('script');
      var timer = null;
      var done = false;
      function cleanup() {
        if (timer) clearTimeout(timer);
        try { delete window[cb]; } catch (e) { window[cb] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      }
      window[cb] = function (data) {
        if (done) return; done = true;
        cleanup();
        resolve(data);
      };
      script.onerror = function () {
        if (done) return; done = true;
        cleanup();
        reject(new Error('jsonp network error'));
      };
      timer = setTimeout(function () {
        if (done) return; done = true;
        cleanup();
        reject(new Error('jsonp timeout'));
      }, timeoutMs || 15000);
      script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'f=jsonp&callback=' + cb;
      document.head.appendChild(script);
    });
  }

  /* ═════════════════════════════ Servers (Subsonic) ═════════════════════ */

  var Servers = {
    list: [],

    load: function () {
      try { this.list = JSON.parse(localStorage.getItem(CFG_KEY)) || []; }
      catch (e) { this.list = []; }
      if (!Array.isArray(this.list)) this.list = [];
      return this.list;
    },
    save: function () {
      try { localStorage.setItem(CFG_KEY, JSON.stringify(this.list)); } catch (e) {}
    },
    get: function (id) {
      for (var i = 0; i < this.list.length; i++) if (this.list[i].id === id) return this.list[i];
      return null;
    },
    add: function (cfg) {
      var srv = {
        id: uid('srv'), name: cfg.name || 'Music Server', url: normBase(cfg.url),
        user: cfg.user || '', password: cfg.password || '', apiKey: cfg.apiKey || '',
        proxy: cfg.proxy || '', corsOK: (cfg.corsOK !== false)
      };
      var existing = this.list.findIndex(function (s) { return s.url === srv.url && s.user === srv.user; });
      if (existing >= 0) { srv.id = this.list[existing].id; this.list[existing] = srv; }
      else this.list.push(srv);
      this.save();
      return srv;
    },
    remove: function (id) {
      this.list = this.list.filter(function (s) { return s.id !== id; });
      this.save();
    },

    authParams: function (srv) {
      var q = new URLSearchParams();
      q.set('u', srv.user || '');
      q.set('v', API_VER);
      q.set('c', CLIENT);
      if (srv.apiKey) {
        q.set('apiKey', srv.apiKey);
      } else if (srv.password) {
        var salt = randSalt(10);
        q.set('s', salt);
        q.set('t', md5(srv.password + salt));
      }
      return q;
    },

    /* One REST call. Tries a CORS fetch first (which also probes CORS),
       then silently falls back to JSONP. Returns the `subsonic-response`. */
    rest: function (srv, endpoint, params) {
      var q = this.authParams(srv);
      Object.keys(params || {}).forEach(function (k) { q.set(k, params[k]); });
      var jsonUrl = normBase(srv.url) + '/rest/' + endpoint + '.view?' + q.toString();

      var self = this;
      var tryFetch = (srv.corsOK === false)
        ? Promise.reject(new Error('cors disabled'))
        : withTimeout(fetch(jsonUrl, { mode: 'cors', cache: 'no-store' }), 12000)
            .then(function (r) {
              if (!r.ok) throw new Error('HTTP ' + r.status);
              return r.json();
            })
            .then(function (data) { srv.corsOK = true; return data; })
            .catch(function (e) { srv.corsOK = false; throw e; });

      return tryFetch
        .then(unpack)
        .catch(function () { return jsonp(jsonUrl, 15000).then(unpack); });
    },

    ping: function (srv) {
      return this.rest(srv, 'ping', {}).then(function (res) {
        return { version: res.version, openSubsonic: !!res.openSubsonic, corsOK: srv.corsOK !== false };
      });
    },
    search: function (srv, query, count) {
      return this.rest(srv, 'search3', {
        query: query, songCount: count || 15, songOffset: 0, artistCount: 0, albumCount: 0
      }).then(function (res) {
        return (res.searchResult3 && res.searchResult3.song) || [];
      });
    },
    random: function (srv, size, genre) {
      var params = { size: size || 20 };
      if (genre) params.genre = genre;
      return this.rest(srv, 'getRandomSongs', params).then(function (res) {
        return (res.randomSongs && res.randomSongs.song) || [];
      });
    },
    playlists: function (srv) {
      return this.rest(srv, 'getPlaylists', {}).then(function (res) {
        return (res.playlists && res.playlists.playlist) || [];
      });
    },
    genres: function (srv) {
      return this.rest(srv, 'getGenres', {}).then(function (res) {
        return (res.genres && res.genres.genre) || [];
      });
    },

    streamUrl: function (srv, songId) {
      var q = this.authParams(srv);
      q.set('id', songId);
      var raw = normBase(srv.url) + '/rest/stream.view?' + q.toString();
      return srv.proxy ? srv.proxy + encodeURIComponent(raw) : raw;
    },
    coverUrl: function (srv, coverId, size) {
      var q = this.authParams(srv);
      q.set('id', coverId);
      if (size) q.set('size', size);
      return normBase(srv.url) + '/rest/getCoverArt.view?' + q.toString();
    },

    mapSong: function (srv, child) {
      var art = child.coverArt
        ? this.coverUrl(srv, child.coverArt, 300)
        : 'IMAGES/logoo.png';
      return {
        title: child.title || 'Unknown',
        artist: child.artist || 'Unknown Artist',
        album: child.album || '',
        file: this.streamUrl(srv, child.id),
        art: art,
        folder: '\u2601\ufe0f ' + srv.name,
        durationFormatted: child.duration ? fmtDur(child.duration) : '',
        _isOnline: true,
        _source: 'subsonic',
        _onlineId: srv.id + ':' + child.id,
        _serverId: srv.id,
        _serverName: srv.name,
        _fullLink: this.streamUrl(srv, child.id),
        _quality: 'full'
      };
    }
  };

  function unpack(data) {
    var res = (data && data['subsonic-response']) || data;
    if (!res) throw new Error('empty response');
    if (res.status === 'failed') {
      throw new Error((res.error && res.error.message) || ('server error ' + (res.error && res.error.code)));
    }
    return res;
  }

  /* ═════════════════════════════ Audius (free catalog) ══════════════════ */

  var AUDIUS_HOSTS = ['https://discoveryprovider.audius.co', 'https://api.audius.co'];
  var AUDIUS_GENRES = ['', 'Electronic', 'Hip-Hop/R&B', 'Lo-Fi', 'Rock', 'Jazz'];

  var Audius = {
    api: function (path, params) {
      var qs = new URLSearchParams({ app_name: APP_NAME });
      Object.keys(params || {}).forEach(function (k) { if (params[k] !== undefined && params[k] !== '') qs.set(k, params[k]); });
      var attempts = AUDIUS_HOSTS.map(function (host) {
        return function () {
          return withTimeout(fetch(host + '/v1' + path + '?' + qs.toString(), { mode: 'cors' }), 12000)
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
        };
      });
      return attempts.reduce(function (chain, fn) { return chain.catch(fn); }, Promise.reject(new Error('no host')));
    },
    trending: function (genre, limit, offset) {
      var p = { limit: limit || 20, offset: offset || 0 };
      if (genre) p.genre = genre;
      return this.api('/tracks/trending', p).then(function (d) { return (d && d.data) || []; });
    },
    search: function (query, limit, offset) {
      return this.api('/tracks/search', { query: query, limit: limit || 20, offset: offset || 0 })
        .then(function (d) { return (d && d.data) || []; });
    },
    streamEndpoint: function (id) {
      return AUDIUS_HOSTS[0] + '/v1/tracks/' + encodeURIComponent(id) + '/stream?app_name=' + APP_NAME;
    },
    mapTrack: function (t) {
      var user = t.user || {};
      var art = (t.artwork && (t.artwork['480x480'] || t.artwork['150x150'])) || 'IMAGES/logoo.png';
      var id = t.id || t.track_id;
      return {
        title: t.title || 'Unknown',
        artist: user.name || user.handle || 'Audius Artist',
        album: t.genre || 'Audius',
        file: this.streamEndpoint(id),
        art: art,
        folder: '\ud83c\udfa7 AUDIUS',
        durationFormatted: t.duration ? fmtDur(t.duration) : '',
        _isOnline: true,
        _source: 'audius',
        _onlineId: 'audius:' + id,
        _fullLink: t.permalink ? ('https://audius.co' + t.permalink) : this.streamEndpoint(id),
        _quality: 'full'
      };
    }
  };

  /* ══════════════════════════ Extra-songs collection ════════════════════ */

  var Extra = {
    list: [],
    load: function () {
      try { this.list = JSON.parse(localStorage.getItem(EXTRA_KEY)) || []; }
      catch (e) { this.list = []; }
      if (!Array.isArray(this.list)) this.list = [];
      return this.list;
    },
    save: function () {
      try { localStorage.setItem(EXTRA_KEY, JSON.stringify(this.list.slice(-MAX_EXTRA))); } catch (e) {}
    },
    keyOf: function (s) { return (s._source || '') + '|' + (s._onlineId || s.file || s.title); },
    remember: function (song) {
      if (!song || !song._isOnline) return false;
      var key = this.keyOf(song);
      for (var i = 0; i < this.list.length; i++) if (this.keyOf(this.list[i]) === key) return false;
      this.list.push({
        title: song.title, artist: song.artist, album: song.album, art: song.art,
        file: song.file, folder: song.folder, durationFormatted: song.durationFormatted,
        _isOnline: true, _source: song._source, _onlineId: song._onlineId,
        _serverId: song._serverId, _serverName: song._serverName,
        _fullLink: song._fullLink, _quality: song._quality
      });
      if (this.list.length > MAX_EXTRA) this.list = this.list.slice(-MAX_EXTRA);
      this.save();
      try { UI.refresh(); } catch (e) {}
      return true;
    },
    clear: function () { this.list = []; this.save(); try { UI.refresh(); } catch (e) {} }
  };

  /* ═══════════════════════════ Infinite queue engine ════════════════════ */

  var Infinite = (function () {
    function songsArr() { return (window.music && window.music.songs) || window.songs || null; }
    function currentIdx() { try { return (typeof currentIndex === 'number') ? currentIndex : -1; } catch (e) { return -1; } }

    var engine = {
      active: null,
      BUFFER: 15,
      FETCH: 20,
      _busy: false,
      _seq: 0,

      ahead: function () {
        var S = songsArr(); if (!S) return 0;
        var ci = currentIdx();
        return ci < 0 ? 0 : (S.length - ci);
      },

      findExisting: function (song) {
        var S = songsArr();
        if (!S || !song || !song._onlineId) return null;
        for (var i = 0; i < S.length; i++) {
          if (S[i]._onlineId === song._onlineId && S[i]._source === song._source) return S[i];
        }
        return null;
      },

      isAppended: function (song) { return !!this.findExisting(song); },

      append: function (song) {
        var S = songsArr();
        if (!S || !song || !song.file) return false;
        if (this.findExisting(song)) return false;
        S.push(song);
        return true;
      },

      stop: function () { if (this.active) console.log('[Ivory] infinite session ended:', this.active.title); this.active = null; },

      _fill: function () {
        var s = this.active;
        if (!s || s.exhausted || this._busy) return;
        if (s.added >= s.max) { s.exhausted = true; return; }
        if (this.ahead() >= this.BUFFER) return;

        var self = this;
        var token = ++this._seq;
        this._busy = true;

        Promise.resolve(s.fetcher(s.cursor, this.FETCH))
          .then(function (list) {
            if (token !== self._seq) return;
            s.cursor += self.FETCH;
            var arr = Array.isArray(list) ? list : [];
            if (arr.length < self.FETCH) s.exhausted = true;
            var added = 0;
            arr.forEach(function (song) { if (self.append(song)) { added++; s.added++; } });
            if (added === 0) { s._stall = (s._stall || 0) + 1; if (s._stall >= 3) s.exhausted = true; }
            else s._stall = 0;
            if (added) console.log('[Ivory] \u221e appended ' + added + ' (total ' + s.added + ') for "' + s.title + '"');
          })
          .catch(function (err) {
            console.warn('[Ivory] refill failed:', err && err.message);
            s.exhausted = true;
          })
          .then(function () {
            if (token !== self._seq) return;
            self._busy = false;
            self._fill();
          });
      },

      /* Fetch a batch WITHOUT playing, so the UI can show the track list first.
         Returns the songs to display (existing queue instances are reused so
         that the app's renderSongList() can map them back to global indices). */
      load: function (title, fetcher, count) {
        this.active = { title: title, fetcher: fetcher, cursor: 0, added: 0, max: 400, exhausted: false, _stall: 0 };
        this._seq++;
        this._busy = false;
        var n = count || 25;
        var self = this;
        return Promise.resolve(fetcher(0, n)).then(function (list) {
          var arr = Array.isArray(list) ? list : [];
          self.active.cursor = n;
          if (arr.length < n) self.active.exhausted = true;
          var out = [];
          arr.forEach(function (song) {
            var existing = self.findExisting(song);
            if (existing) { out.push(existing); }
            else if (self.append(song)) { self.active.added++; out.push(song); }
          });
          return out;
        }).catch(function (err) {
          console.warn('[Ivory] could not load list:', err && err.message);
          return [];
        });
      },

      start: function (title, fetcher, autoplay) {
        var S = songsArr();
        this.active = { title: title, fetcher: fetcher, cursor: 0, added: 0, max: 400, exhausted: false, _stall: 0 };
        this._seq++;
        this._busy = false;
        var startIndex = S ? S.length : 0;

        var self = this;
        return Promise.resolve(fetcher(0, this.FETCH))
          .then(function (list) {
            var arr = Array.isArray(list) ? list : [];
            self.active.cursor = self.FETCH;
            if (arr.length < self.FETCH) self.active.exhausted = true;
            arr.forEach(function (song) { if (self.append(song)) self.active.added++; });
          })
          .catch(function (err) { console.warn('[Ivory] could not start infinite list:', err && err.message); })
          .then(function () {
            if (autoplay !== false && typeof window.playSongAtIndex === 'function' && S && S.length > startIndex) {
              window.playSongAtIndex(startIndex);
            }
            self._fill();
            return { ok: !!(S && S.length > startIndex), startIndex: startIndex };
          });
      }
    };
    return engine;
  })();

  /* ═══════════════════════════ infinite fetchers ════════════════════════ */

  function audiusGenreFetcher(genre) {
    return function (offset, limit) {
      return Audius.trending(genre, limit, offset).then(function (tracks) {
        return tracks.map(function (t) { return Audius.mapTrack(t); });
      });
    };
  }
  function audiusSearchFetcher(query) {
    return function (offset, limit) {
      return Audius.search(query, limit, offset).then(function (tracks) {
        return tracks.map(function (t) { return Audius.mapTrack(t); });
      });
    };
  }
  function serverRandomFetcher(srv) {
    return function (offset, limit) {
      return Servers.random(srv, limit).then(function (children) {
        return children.map(function (c) { return Servers.mapSong(srv, c); });
      });
    };
  }
  function extraFetcher() {
    return function (offset, limit) {
      var pool = Extra.list;
      var n = pool.length;
      if (!n) return Promise.resolve([]);
      var start = ((offset % n) + n) % n;      /* rotate so extras never run dry */
      var out = [];
      for (var i = 0; i < Math.min(limit, n); i++) {
        out.push(JSON.parse(JSON.stringify(pool[(start + i) % n])));
      }
      return Promise.resolve(out);
    };
  }

  /* Shared rotation point: every newly created stream starts somewhere new, so
     a repeat click on the card appends fresh songs instead of hitting the dedupe. */
  var COMBINED_WINDOW = 120;
  var combinedOffset = 0;

  /* One endless stream made of *every* source: all Audius genres, any connected
     music server, and the collected "extra" songs — mixed together. Each call
     gets its own per-source cursors so the mix keeps advancing. */
  function combinedFetcher() {
    var sources = [];
    AUDIUS_GENRES.forEach(function (genre) { sources.push(audiusGenreFetcher(genre)); });
    Servers.list.forEach(function (srv) { sources.push(serverRandomFetcher(srv)); });
    if (Extra.list.length) sources.push(extraFetcher());

    var cursors = sources.map(function () { return combinedOffset; });

    return function (offset, limit) {
      if (!sources.length) return Promise.resolve([]);
      var per = Math.max(1, Math.floor((limit || 20) / sources.length));
      var jobs = sources.map(function (fn, i) {
        var c = cursors[i] % COMBINED_WINDOW;
        cursors[i] += per;
        return withTimeout(Promise.resolve(fn(c, per)).catch(function () { return []; }), 9000)
          .catch(function () { return []; });
      });
      combinedOffset = (combinedOffset + per) % COMBINED_WINDOW;
      return Promise.all(jobs).then(function (groups) {
        var out = [];
        groups.forEach(function (g) { (g || []).forEach(function (s) { if (s) out.push(s); }); });
        return out;
      });
    };
  }

  /* ══════════════════════════════ UI layer ══════════════════════════════ */

  var UI = {
    stylesInjected: false,

    injectStyles: function () {
      if (this.stylesInjected || document.getElementById('ivory-hub-style')) return;
      var st = document.createElement('style');
      st.id = 'ivory-hub-style';
      st.textContent = [
        '#ivory-hub-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.66);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}',
        '#ivory-hub-modal{background:#12131a;color:#fff;width:min(460px,100%);max-height:90vh;overflow:auto;border-radius:16px;padding:20px;box-shadow:0 24px 70px rgba(0,0,0,.65);border:1px solid rgba(255,255,255,.09)}',
        '#ivory-hub-modal h3{margin:0 0 4px;font-size:1.15rem}',
        '#ivory-hub-modal .iv-sub{font-size:.78rem;opacity:.6;margin-bottom:14px;line-height:1.4}',
        '.iv-field{display:block;margin:10px 0}',
        '.iv-field span{display:block;font-size:.74rem;opacity:.66;margin-bottom:4px;letter-spacing:.02em}',
        '.iv-field input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:9px;border:1px solid rgba(255,255,255,.14);background:#0a0b10;color:#fff;font-size:.9rem;outline:none}',
        '.iv-field input:focus{border-color:#667eea}',
        '.iv-row{display:flex;gap:10px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}',
        '.iv-btn{padding:10px 18px;border-radius:9px;border:none;cursor:pointer;font-weight:600;font-size:.86rem}',
        '.iv-btn.primary{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff}',
        '.iv-btn.ghost{background:transparent;color:#bbb;border:1px solid rgba(255,255,255,.16)}',
        '.iv-status{font-size:.78rem;margin-top:12px;min-height:1.1em;line-height:1.4}',
        '.iv-status.ok{color:#5de6a0}.iv-status.err{color:#ff7b7b}.iv-status.info{color:#9db7ff}',
        '.iv-server-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 11px;border:1px solid rgba(255,255,255,.1);border-radius:10px;margin-top:8px;font-size:.84rem}',
        '.iv-server-row b{font-weight:600}.iv-server-row small{opacity:.55}',
        '.iv-x{background:transparent;border:none;color:#ff8080;cursor:pointer;font-size:.8rem}',
        '.iv-hub-gear{float:right;background:transparent;border:1px solid rgba(255,255,255,.18);color:#cfcfe6;' +
          'width:26px;height:26px;line-height:1;border-radius:50%;cursor:pointer;font-size:14px;padding:0}',
        '.iv-hub-gear:hover{border-color:#667eea;color:#fff}'
      ].join('');
      document.head.appendChild(st);
      this.stylesInjected = true;
    },

    hubCard: function (o) {
      var onclick = o.onclick || '';
      var onplay = o.onplay || onclick;
      return '' +
        '<div class="music-card" onclick="' + onclick + '">' +
          '<div class="card-img-wrapper">' +
            '<img src="' + esc(o.img || 'IMAGES/logoo.png') + '" alt="' + esc(o.title) + '" loading="lazy" ' +
                 'onerror="this.onerror=null;this.src=\'IMAGES/logoo.png\';" style="object-fit:cover">' +
            '<button class="play-fab" aria-label="Play now" title="Play now" onclick="event.stopPropagation();' + onplay + '">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' +
            '</button>' +
          '</div>' +
          '<div class="card-details"><h3>' + esc(o.title) + '</h3><p>' + esc(o.subtitle || '') + '</p></div>' +
        '</div>';
    },

    buildSection: function () {
      /* One single card that carries the songs of *every* source combined. */
      var total = AUDIUS_GENRES.length + Servers.list.length + (Extra.list.length ? 1 : 0);
      var section = document.createElement('div');
      section.className = 'home-section';
      section.id = 'ivory-infinite-section';
      section.innerHTML =
        '<h2 class="section-title">\u267e\ufe0f Infinite &amp; Online' +
          '<button class="iv-hub-gear" title="Connect a music server" aria-label="Connect a music server" ' +
                  'onclick="ivoryHubOpenSettings()">\uff0b</button>' +
        '</h2>' +
        '<div class="card-grid home-card-grid" id="ivory-infinite-grid">' +
          UI.hubCard({
            title: '\u267e\ufe0f Infinite Songs',
            subtitle: 'All online tracks \u00b7 ' + total + ' sources \u00b7 tap for tracks',
            img: 'IMAGES/english_hits.jpg',
            onclick: 'ivoryHubOpenInfinite()',
            onplay:  'ivoryHubPlayInfinite()'
          }) +
        '</div>';
      return section;
    },

    homeVisible: function (body) {
      if (!body) return false;
      if (body.querySelector('.song-list-container')) return false;
      if (body.querySelector('.card-grid:not(.home-card-grid)')) return false;
      return true;
    },

    inject: function () {
      var body = document.querySelector('.content-body');
      if (!this.homeVisible(body)) return;
      if (document.getElementById('ivory-infinite-section')) return;
      if (!body) return;
      var section = this.buildSection();
      /* place it in the section right after "Browse by Genre" */
      var genreGrid = body.querySelector('#genre-grid');
      var genreSection = genreGrid ? genreGrid.closest('.home-section') : null;
      if (genreSection && genreSection.parentNode === body) {
        body.insertBefore(section, genreSection.nextSibling);
      } else {
        var first = body.querySelector('.home-section');
        if (first) body.insertBefore(section, first);
        else body.insertBefore(section, body.firstChild);
      }
    },

    refresh: function () {
      var existing = document.getElementById('ivory-infinite-section');
      if (!existing) return;
      var fresh = this.buildSection();
      existing.parentNode.replaceChild(fresh, existing);
    },

    /* ── server settings modal ── */
    openSettings: function () {
      this.injectStyles();
      if (document.getElementById('ivory-hub-backdrop')) return;

      var backdrop = document.createElement('div');
      backdrop.id = 'ivory-hub-backdrop';
      var serverRows = Servers.list.map(function (srv) {
        return '<div class="iv-server-row"><span><b>' + esc(srv.name) + '</b><br><small>' + esc(srv.url) +
          (srv.corsOK === false ? ' \u00b7 \u26a0 audio needs CORS' : '') + '</small></span>' +
          '<button class="iv-x" data-remove="' + esc(srv.id) + '">Remove</button></div>';
      }).join('');

      backdrop.innerHTML =
        '<div id="ivory-hub-modal" role="dialog" aria-modal="true">' +
          '<h3>Connect Music Server</h3>' +
          '<div class="iv-sub">Works with any <b>OpenSubsonic / Subsonic</b> server — Navidrome, Airsonic, ' +
            'Gonic, Supersonic, Funkwhale. Your songs stream straight into the player as an endless queue.</div>' +
          (serverRows ? '<div style="margin-bottom:10px">' + serverRows + '</div>' : '') +
          '<label class="iv-field"><span>Display name</span><input id="iv-n" placeholder="My Navidrome" autocomplete="off"></label>' +
          '<label class="iv-field"><span>Server URL</span><input id="iv-u" placeholder="https://music.example.com" autocomplete="off"></label>' +
          '<label class="iv-field"><span>Username</span><input id="iv-user" autocomplete="off"></label>' +
          '<label class="iv-field"><span>Password</span><input id="iv-pass" type="password" autocomplete="off"></label>' +
          '<label class="iv-field"><span>API key (optional \u2014 alternative to password)</span><input id="iv-key" autocomplete="off"></label>' +
          '<label class="iv-field"><span>CORS proxy prefix (optional)</span><input id="iv-proxy" placeholder="https://api.allorigins.win/raw?url=" autocomplete="off"></label>' +
          '<div class="iv-status info" id="iv-status">Audio streaming needs the server to allow CORS. If it does not, add a proxy prefix above.</div>' +
          '<div class="iv-row">' +
            '<button class="iv-btn ghost" id="iv-close">Close</button>' +
            '<button class="iv-btn primary" id="iv-save">Test &amp; Save</button>' +
          '</div>' +
        '</div>';

      document.body.appendChild(backdrop);

      var $ = function (id) { return backdrop.querySelector('#' + id); };
      var setStatus = function (msg, cls) {
        var el = $('iv-status'); if (!el) return;
        el.className = 'iv-status ' + (cls || 'info');
        el.textContent = msg;
      };

      $('iv-close').addEventListener('click', function () { backdrop.remove(); });
      backdrop.addEventListener('click', function (e) { if (e.target === backdrop) backdrop.remove(); });
      backdrop.addEventListener('click', function (e) {
        var id = e.target && e.target.getAttribute && e.target.getAttribute('data-remove');
        if (id) {
          Servers.remove(id);
          toast('Server removed');
          backdrop.remove();
          UI.refresh();
          UI.openSettings();
        }
      });

      $('iv-save').addEventListener('click', function () {
        var cfg = {
          name: $('iv-n').value.trim() || 'Music Server',
          url: $('iv-u').value.trim(),
          user: $('iv-user').value.trim(),
          password: $('iv-pass').value,
          apiKey: $('iv-key').value.trim(),
          proxy: $('iv-proxy').value.trim()
        };
        if (!cfg.url) { setStatus('Enter the server URL.', 'err'); return; }
        setStatus('Testing connection\u2026', 'info');
        var probe = { id: 'probe', name: cfg.name, url: normBase(cfg.url), user: cfg.user,
                      password: cfg.password, apiKey: cfg.apiKey, proxy: cfg.proxy, corsOK: true };
        Servers.ping(probe).then(function (info) {
          var saved = Servers.add(cfg);
          saved.corsOK = info.corsOK;
          Servers.save();
          var note = info.corsOK
            ? 'Connected \u2713 (Subsonic v' + (info.version || '?') + '). Audio streaming ready.'
            : 'Connected \u2713 \u2014 metadata via JSONP. Audio needs CORS on the server (or a proxy prefix).';
          setStatus(note, info.corsOK ? 'ok' : 'err');
          toast('Connected: ' + saved.name);
          UI.refresh();
          setTimeout(function () { var b = document.getElementById('ivory-hub-backdrop'); if (b) b.remove(); }, 1200);
        }).catch(function (err) {
          setStatus('Connection failed: ' + (err && err.message ? err.message : err) +
            '  \u2014 check URL/credentials.', 'err');
        });
      });
    }
  };

  /* ══════════════════════════ public / inline API ═══════════════════════ */

  window.ivoryHubOpenSettings = function () { UI.openSettings(); };

  /* Card body → show the track list (never auto-play). The list is rendered by
     the app's own renderSongList(), which the global back button already knows
     how to leave. The infinite session stays armed so playback keeps refilling. */
  function openList(title, fetcher, count) {
    if (typeof window.renderSongList !== 'function') { toast('List view unavailable'); return; }
    toast('Loading ' + title + '\u2026', 1400);
    Infinite.load(title, fetcher, count || 25).then(function (list) {
      if (!list || !list.length) { toast('No songs available for ' + title); return; }
      try { window.renderSongList(list, title); } catch (e) { console.warn('[Ivory] list render failed', e); }
      try { var b = document.querySelector('.content-body'); if (b) b.scrollTop = 0; } catch (e) {}
    });
  }

  window.ivoryHubOpenServer = function (id) {
    var srv = Servers.get(id);
    if (!srv) { toast('Server not found'); return; }
    openList('\u2601\ufe0f ' + srv.name, serverRandomFetcher(srv), 25);
  };

  window.ivoryHubOpenAudius = function (genreIndex) {
    var genre = AUDIUS_GENRES[genreIndex || 0] || '';
    openList('\ud83c\udfa7 Audius ' + (genre || 'Trending'), audiusGenreFetcher(genre), 25);
  };

  window.ivoryHubOpenExtra = function () {
    if (!Extra.list.length) { toast('No extra online songs collected yet'); return; }
    openList('\u2b50 Extra Songs', extraFetcher(), Math.max(1, Math.min(200, Extra.list.length)));
  };

  window.ivoryHubPlayServer = function (id) {
    var srv = Servers.get(id);
    if (!srv) { toast('Server not found'); return; }
    toast('Starting infinite radio: ' + srv.name);
    Infinite.start('\u2601\ufe0f ' + srv.name, serverRandomFetcher(srv), true)
      .then(function (r) { if (!r.ok) toast('Server returned no songs'); });
  };

  window.ivoryHubPlayAudius = function (genreIndex) {
    var genre = AUDIUS_GENRES[genreIndex || 0] || '';
    toast('Infinite radio: Audius ' + (genre || 'Trending'));
    Infinite.start('\ud83c\udfa7 Audius ' + (genre || 'Trending'), audiusGenreFetcher(genre), true)
      .then(function (r) { if (!r.ok) toast('Audius is unavailable right now'); });
  };

  window.ivoryHubPlayExtra = function () {
    if (!Extra.list.length) { toast('No extra online songs collected yet'); return; }
    toast('Playing ' + Extra.list.length + ' extra songs');
    Infinite.start('\u2b50 Extra Songs', extraFetcher(), true);
  };

  /* The single combined card: every source's songs in one place. */
  window.ivoryHubOpenInfinite = function () {
    openList('\u267e\ufe0f Infinite Songs', combinedFetcher(), 30);
  };

  window.ivoryHubPlayInfinite = function () {
    toast('Infinite radio \u00b7 all online songs');
    Infinite.start('\u267e\ufe0f Infinite Songs', combinedFetcher(), true)
      .then(function (r) { if (!r.ok) toast('No online songs available right now'); });
  };

  /* Server search — consumed by script.js's search dropdown. */
  window.IvoryServerSearch = function (query) {
    if (!Servers.list.length || !query || !query.trim()) return Promise.resolve([]);
    var jobs = Servers.list.map(function (srv) {
      return Servers.search(srv, query, 10)
        .then(function (children) { return children.map(function (c) { return Servers.mapSong(srv, c); }); })
        .catch(function () { return []; });
    });
    return Promise.all(jobs).then(function (groups) {
      var out = [];
      groups.forEach(function (g) { g.forEach(function (s) { out.push(s); }); });
      return out.slice(0, 15);
    });
  };

  /* Audius search (for the search bar too). */
  window.IvoryAudiusSearch = function (query) {
    if (!query || !query.trim()) return Promise.resolve([]);
    return Audius.search(query, 10, 0)
      .then(function (tracks) { return tracks.map(function (t) { return Audius.mapTrack(t); }); })
      .catch(function () { return []; });
  };

  window.IvoryHub = {
    Servers: Servers, Audius: Audius, Infinite: Infinite, Extra: Extra, UI: UI, md5: md5,
    reload: function () { Servers.load(); Extra.load(); UI.refresh(); UI.inject(); },
    version: '1.0.0'
  };

  /* ════════════════════════════ boot + hooks ════════════════════════════ */

  function ensureSongsLoaded() {
    if (window.music && window.music.songs) return true;
    return false;
  }

  function hookGlobal(name, factory) {
    try {
      var orig = window[name];
      if (typeof orig !== 'function') return false;
      window[name] = factory(orig);
      return true;
    } catch (e) { return false; }
  }

  function boot() {
    Servers.load();
    Extra.load();
    UI.injectStyles();

    /* Keep the home section alive across re-renders. */
    hookGlobal('renderHome', function (orig) {
      return function () {
        var r = orig.apply(this, arguments);
        try { UI.inject(); } catch (e) {}
        return r;
      };
    });

    /* Trigger refills when the queue advances + collect "extra" songs. */
    hookGlobal('_resolveAdjacentIndex', function (orig) {
      return function (step) {
        try { if (step > 0) Infinite._fill(); } catch (e) {}
        return orig.apply(this, arguments);
      };
    });

    hookGlobal('playSongAtIndex', function (orig) {
      return function (index) {
        var r = orig.apply(this, arguments);
        try {
          var S = window.music && window.music.songs;
          var song = S && S[index];
          if (song) {
            Extra.remember(song);
            if (song._isOnline) Infinite._fill(); else Infinite.stop();
          }
        } catch (e) {}
        return r;
      };
    });

    /* Safety net: re-inject if the router clears .content-body. */
    try {
      var body = document.querySelector('.content-body');
      if (body && window.MutationObserver) {
        var t = null;
        new MutationObserver(function () {
          clearTimeout(t);
          t = setTimeout(function () { try { UI.inject(); } catch (e) {} }, 60);
        }).observe(body, { childList: true });
      }
    } catch (e) {}

    /* Backup hooks on the live audio element. */
    try {
      var audio = document.querySelector('audio');
      if (audio) {
        audio.addEventListener('play', function () {
          try {
            var S = window.music && window.music.songs;
            var song = S && S[currentIndex];
            if (song) { Extra.remember(song); if (song._isOnline) Infinite._fill(); }
          } catch (e) {}
        });
      }
    } catch (e) {}

    if (!ensureSongsLoaded()) {
      // Wait for the global music API if script.js is still initialising.
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (ensureSongsLoaded() || tries > 40) { clearInterval(iv); try { UI.inject(); } catch (e) {} }
      }, 100);
    } else {
      try { UI.inject(); } catch (e) {}
    }

    console.log('\u267e\ufe0f Ivory Online Hub ready \u2014 servers:', Servers.list.length,
      '\u00b7 extra:', Extra.list.length);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 0); });
  } else {
    setTimeout(boot, 0);
  }
})();

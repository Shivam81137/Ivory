(function applyPromotedListOrderingPatch() {
  if (typeof makeSongKey !== "function") return;
  if (typeof renderPlaylist !== "function" || typeof renderSongList !== "function") return;

  function prioritizeAndDedupeList(list) {
    if (!Array.isArray(list) || list.length === 0) return [];

    // Deduplicate first
    var seen = new Set();
    var deduped = list.filter(function (song) {
      if (!song) return false;
      var key = makeSongKey(song);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Check if the list is specifically for Global Hits or Hindi Hits category
    var isGlobalHitsCategory = deduped.length > 0 && deduped.every(function (song) {
      return song.folder === 'Global Hits';
    });
    var isHindiHitsCategory = deduped.length > 0 && deduped.every(function (song) {
      return song.folder === 'Hindi Hits';
    });

    if (isGlobalHitsCategory || isHindiHitsCategory) {
      // Sort strictly by _customOrder if defined
      return deduped.sort(function (a, b) {
        var aOrder = typeof a._customOrder === 'number' ? a._customOrder : 10000;
        var bOrder = typeof b._customOrder === 'number' ? b._customOrder : 10000;
        if (aOrder !== bOrder) return aOrder - bOrder;
        
        // Secondary sort to maintain stable order for remaining songs
        var aNew = a._isNewImport ? 0 : 1;
        var bNew = b._isNewImport ? 0 : 1;
        if (aNew !== bNew) return aNew - bNew;
        
        return 0; // maintain original relative order
      });
    }

    // Default promotion logic for other categories
    var promoted = [];
    var regular = [];
    deduped.forEach(function (song) {
      if (song._isNewImport) promoted.push(song);
      else regular.push(song);
    });
    return promoted.concat(regular);
  }

  var baseRenderPlaylist = renderPlaylist;
  renderPlaylist = function patchedRenderPlaylist(playlistSongs) {
    return baseRenderPlaylist(prioritizeAndDedupeList(playlistSongs || songs));
  };

  var baseRenderSongList = renderSongList;
  renderSongList = function patchedRenderSongList(playlistSongs, titleOverride) {
    return baseRenderSongList(prioritizeAndDedupeList(playlistSongs || []), titleOverride);
  };

  if (typeof safeRenderPlaylist === "function") {
    var baseSafeRenderPlaylist = safeRenderPlaylist;
    safeRenderPlaylist = function patchedSafeRenderPlaylist(playlistSongs) {
      return baseSafeRenderPlaylist(prioritizeAndDedupeList(playlistSongs || songs));
    };
  }

  if (typeof safeRenderSongList === "function") {
    var baseSafeRenderSongList = safeRenderSongList;
    safeRenderSongList = function patchedSafeRenderSongList(playlistSongs, titleOverride) {
      return baseSafeRenderSongList(prioritizeAndDedupeList(playlistSongs || []), titleOverride);
    };
  }

  if (window.music) {
    window.music.renderPlaylist = renderPlaylist;
    window.music.renderSongList = renderSongList;
  }
})();

(function applyLyricsFallbackPatch() {
  if (typeof LyricsManager !== "object" || !LyricsManager) return;

  LyricsManager.fetchLyricsFallback = async function fetchLyricsFallback(artist, title) {
    var cleanTitle = String(title || "")
      .replace(/\(.*?\)|\[.*?\]/g, "")
      .replace(/\b(ft|feat)\.?\b.*$/i, "")
      .split("-")[0]
      .trim();

    var artistCandidates = String(artist || "")
      .split(/,|&|\||\bfeat\.?\b/i)
      .map(function (value) {
        return value.trim();
      })
      .filter(Boolean);

    var uniqueArtists = Array.from(new Set(artistCandidates.length ? artistCandidates : [String(artist || "").trim()]));

    for (var i = 0; i < uniqueArtists.length; i += 1) {
      var artistName = uniqueArtists[i];
      try {
        var endpoint =
          "https://api.lyrics.ovh/v1/" +
          encodeURIComponent(artistName) +
          "/" +
          encodeURIComponent(cleanTitle || String(title || ""));

        var response = await fetch(endpoint);
        if (!response.ok) continue;

        var data = await response.json();
        var lyrics = data && typeof data.lyrics === "string" ? data.lyrics.trim() : "";
        if (!lyrics || /not found/i.test(lyrics)) continue;

        return lyrics;
      } catch (error) {
        // Try next artist candidate.
      }
    }

    return "";
  };

  var primaryFetchLyrics = LyricsManager.fetchLyrics && LyricsManager.fetchLyrics.bind(LyricsManager);
  if (typeof primaryFetchLyrics !== "function") return;

  LyricsManager.fetchLyrics = async function patchedFetchLyrics(artist, title, duration) {
    await primaryFetchLyrics(artist, title, duration);

    // Keep existing lyrics unchanged; fallback only when primary ended with no result.
    var hasSynced = Array.isArray(this.currentLyrics) && this.currentLyrics.length > 0;
    var hasPlain =
      !!(this.container && this.container.querySelector && this.container.querySelector(".lyrics-text")) ||
      !!(this.fsContainer && this.fsContainer.querySelector && this.fsContainer.querySelector(".lyrics-text"));

    if (hasSynced || hasPlain) return;

    var fallbackLyrics = await this.fetchLyricsFallback(artist, title);
    if (fallbackLyrics) {
      this.renderPlain(fallbackLyrics);
    }
  };
})();

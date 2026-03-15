(function applyPromotedListOrderingPatch() {
  if (typeof makeSongKey !== "function") return;
  if (typeof renderPlaylist !== "function" || typeof renderSongList !== "function") return;

  function prioritizeAndDedupeList(list) {
    if (!Array.isArray(list) || list.length === 0) return [];

    var promoted = [];
    var regular = [];

    list.forEach(function (song) {
      if (!song) return;
      if (song._isNewImport) promoted.push(song);
      else regular.push(song);
    });

    var seen = new Set();
    return promoted.concat(regular).filter(function (song) {
      var key = makeSongKey(song);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
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

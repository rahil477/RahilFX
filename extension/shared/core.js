(function (root) {
  'use strict';
  function formatSrtTime(seconds) {
    var ms = Math.max(0, Math.round(Number(seconds) * 1000));
    var hours = Math.floor(ms / 3600000); ms %= 3600000;
    var minutes = Math.floor(ms / 60000); ms %= 60000;
    var wholeSeconds = Math.floor(ms / 1000); ms %= 1000;
    function pad(value, size) { return String(value).padStart(size, '0'); }
    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(wholeSeconds, 2) + ',' + pad(ms, 3);
  }
  function transcriptToSrt(text, wordsPerCue, secondsPerCue) {
    var clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return '';
    var words = clean.split(' ');
    var size = Math.max(1, Math.min(12, parseInt(wordsPerCue, 10) || 4));
    var duration = Math.max(1, Math.min(15, Number(secondsPerCue) || 2.5));
    var cues = [];
    for (var i = 0; i < words.length; i += size) {
      var start = cues.length * duration;
      cues.push(String(cues.length + 1) + '\n' + formatSrtTime(start) + ' --> ' + formatSrtTime(start + duration) + '\n' + words.slice(i, i + size).join(' '));
    }
    return cues.join('\n\n') + '\n';
  }
  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }
  var api = { formatSrtTime: formatSrtTime, transcriptToSrt: transcriptToSrt, escapeHtml: escapeHtml };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RFXCore = api;
}(typeof window !== 'undefined' ? window : globalThis));

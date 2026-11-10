const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../extension/shared/core.js');

test('formats SRT timestamps with milliseconds', () => {
  assert.equal(core.formatSrtTime(62.345), '00:01:02,345');
});

test('segments manual transcript into numbered SRT cues', () => {
  const srt = core.transcriptToSrt('one two three four five', 2, 1.5);
  assert.match(srt, /1\n00:00:00,000 --> 00:00:01,500\none two/);
  assert.match(srt, /3\n00:00:03,000 --> 00:00:04,500\nfive/);
});

test('returns no cues for an empty transcript and escapes HTML', () => {
  assert.equal(core.transcriptToSrt('   ', 2, 2), '');
  assert.equal(core.escapeHtml('<script>'), '&lt;script&gt;');
});

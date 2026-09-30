import assert from 'node:assert/strict';
import test from 'node:test';
import { parseVideoUrl, resolveVideoPlayback } from './video.js';

test('parses supported hosted video URLs', () => {
  assert.equal(parseVideoUrl('https://www.youtube.com/watch?v=abc123def45')?.type, 'youtube');
  assert.equal(parseVideoUrl('https://youtu.be/abc123def45')?.type, 'youtube');
  assert.equal(parseVideoUrl('https://vimeo.com/123456')?.type, 'vimeo');
  assert.equal(parseVideoUrl('https://drive.google.com/file/d/file123/view')?.type, 'google');
  assert.equal(parseVideoUrl('https://cdn.example/video.mp4?token=x')?.type, 'direct');
});

test('rejects unsafe and non-video URLs', () => {
  assert.equal(parseVideoUrl('javascript:alert(1)'), null);
  assert.equal(parseVideoUrl('https://example.com/page'), null);
  assert.equal(parseVideoUrl('https://youtube.com/'), null);
});

test('resolves relative upload paths for the playback origin', () => {
  const originalWindow = globalThis.window;
  globalThis.window = { location: { origin: 'http://localhost:5173' } };
  try {
    assert.equal(
      resolveVideoPlayback({ url: '/uploads/demo.mp4' })?.url,
      'http://localhost:5173/uploads/demo.mp4',
    );
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});
import React, { useRef, useState } from 'react';
import api from '../../services/api';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatSize = (bytes) => {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Extract YouTube video ID from watch, shorts, youtu.be URLs. */
const getYouTubeId = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('?')[0];
    if (u.pathname.includes('/shorts/')) return u.pathname.split('/shorts/')[1]?.split('?')[0];
    return u.searchParams.get('v');
  } catch {
    return null;
  }
};

/** Extract Vimeo video ID. */
const getVimeoId = (url) => {
  try {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

/** Convert a Google Drive share URL to an embeddable preview URL. */
const normalizeGoogleDriveUrl = (url) => {
  try {
    const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    if (url.includes('drive.google.com') && url.includes('/preview')) return url;
    return null;
  } catch {
    return null;
  }
};

/** Detect the video type/source from a URL string. */
const detectUrlType = (url) => {
  if (!url) return 'unknown';
  if (/youtu\.be|youtube\.com/i.test(url)) return 'youtube';
  if (/vimeo\.com/i.test(url)) return 'vimeo';
  if (/drive\.google\.com/i.test(url)) return 'google';
  if (/\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url)) return 'direct';
  return 'url';
};

/** Build an embed URL for preview (returns null if not embeddable). */
const getEmbedUrl = (video) => {
  const src = video.url;
  const srcType = video.type || detectUrlType(src);
  if (srcType === 'youtube') {
    const id = getYouTubeId(src);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (srcType === 'vimeo') {
    const id = getVimeoId(src);
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (srcType === 'google') return normalizeGoogleDriveUrl(src);
  return null;
};

const SOURCE_LABELS = {
  upload: '📁 Uploaded',
  youtube: '▶ YouTube',
  vimeo: '🎬 Vimeo',
  google: '🔵 Google Drive',
  direct: '🎞 Video',
  url: '🔗 Video',
};

// ─────────────────────────────────────────────────────────────────────────────
// VideoCard — shown in the video list
// ─────────────────────────────────────────────────────────────────────────────

function VideoCard({ video, index, onRemove }) {
  const [failed, setFailed] = useState(false);
  const srcType = video.type || detectUrlType(video.url);
  const embedUrl = getEmbedUrl(video);
  const sourceLabel = SOURCE_LABELS[srcType] || SOURCE_LABELS.url;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#ebded8] bg-white shadow-sm">
      <div className="aspect-video w-full overflow-hidden bg-[#f4efed]">
        {(srcType === 'upload' || srcType === 'direct') ? (
          <video
            src={video.url}
            controls
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : embedUrl && !failed ? (
          <iframe
            src={embedUrl}
            title={video.title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="text-3xl">🎬</span>
            <p className="text-xs font-semibold text-[#776763]">{video.title || 'Video'}</p>
            <a
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-[#a83f32] px-4 py-2 text-xs font-bold text-white"
            >
              Open Video ↗
            </a>
          </div>
        )}
      </div>
      <div className="px-3 py-2">
        <p className="truncate text-sm font-semibold text-[#2d2323]">
          {video.title || video.originalName || 'Untitled video'}
        </p>
        <p className="mt-0.5 text-xs text-[#776763]">{sourceLabel}</p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-red-600 shadow-sm opacity-0 transition group-hover:opacity-100"
        aria-label="Remove video"
      >
        ✕
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AddVideoModal — 3-tab modal
// ─────────────────────────────────────────────────────────────────────────────

const TABS = ['Upload from Device', 'Video URL', 'Google Video'];

function AddVideoModal({ onAdd, onClose, placeId }) {
  const fileRef = useRef(null);
  const [tab, setTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlPreview, setUrlPreview] = useState(null);
  const [googleInput, setGoogleInput] = useState('');
  const [googleTitle, setGoogleTitle] = useState('');
  const [googlePreview, setGooglePreview] = useState(null);
  const [error, setError] = useState('');

  // Tab 0 — Device Upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setUploadedFile(null);
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('video', file);
    const query = placeId ? `?placeId=${encodeURIComponent(placeId)}` : '';
    try {
      const { data } = await api.post(`/media/upload-video${query}`, formData, {
        onUploadProgress: (evt) => {
          if (evt.total) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      });
      setUploadedFile({ url: data.data.url, name: file.name, size: file.size });
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const confirmUpload = () => {
    if (!uploadedFile) return;
    onAdd({ type: 'upload', url: uploadedFile.url, title: uploadedFile.name, originalName: uploadedFile.name });
  };

  // Tab 1 — Video URL
  const previewUrlInput = () => {
    setError('');
    setUrlPreview(null);
    const trimmed = urlInput.trim();
    if (!trimmed) { setError('Please enter a URL.'); return; }
    try { new URL(trimmed); } catch { setError('Invalid URL.'); return; }
    const srcType = detectUrlType(trimmed);
    const embedUrl = getEmbedUrl({ type: srcType, url: trimmed });
    setUrlPreview({ embedUrl, srcType });
  };

  const confirmUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const srcType = detectUrlType(trimmed);
    onAdd({ type: srcType === 'youtube' || srcType === 'vimeo' ? srcType : 'url', url: trimmed, title: urlTitle.trim() });
  };

  // Tab 2 — Google Video
  const previewGoogle = () => {
    setError('');
    setGooglePreview(null);
    const trimmed = googleInput.trim();
    if (!trimmed) { setError('Please enter a Google Drive URL.'); return; }
    if (!trimmed.includes('drive.google.com') && !trimmed.includes('docs.google.com')) {
      setError('Please enter a Google Drive sharing URL.');
      return;
    }
    const embedUrl = normalizeGoogleDriveUrl(trimmed);
    setGooglePreview({ embedUrl });
  };

  const confirmGoogle = () => {
    const trimmed = googleInput.trim();
    if (!trimmed) return;
    onAdd({ type: 'google', url: trimmed, title: googleTitle.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#ebded8] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ebded8] px-5 py-4">
          <h3 className="text-base font-bold text-[#2d2323]">Add Video</h3>
          <button type="button" onClick={onClose} className="text-xl font-bold text-[#776763] hover:text-[#a83f32]">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#ebded8]">
          {TABS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => { setTab(i); setError(''); }}
              className={`flex-1 px-2 py-3 text-[11px] font-bold transition sm:text-xs ${
                tab === i ? 'border-b-2 border-[#a83f32] text-[#a83f32]' : 'text-[#776763] hover:text-[#2d2323]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-5">
          {/* ── TAB 0: Upload from Device ── */}
          {tab === 0 && (
            <div className="space-y-4">
              <p className="text-xs text-[#776763]">Supported: MP4, WebM, MOV &bull; Max 200 MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.avi,.mkv"
                className="hidden"
                onChange={handleFileChange}
              />
              {!uploadedFile && !uploading && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e7dcd7] bg-[#fffaf8] px-4 py-10 text-sm font-semibold text-[#a83f32] transition hover:border-[#a83f32]"
                >
                  <span className="text-3xl">📁</span>
                  <span>Choose Video File</span>
                </button>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#776763]">
                    <span>Uploading…</span><span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f4efed]">
                    <div
                      className="h-full rounded-full bg-[#a83f32] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadedFile && (
                <div className="rounded-xl border border-[#ebded8] bg-[#fffaf8] p-3 space-y-3">
                  <video src={uploadedFile.url} controls className="aspect-video w-full rounded-lg bg-black" />
                  <p className="truncate text-xs font-semibold text-[#2d2323]">{uploadedFile.name}</p>
                  <p className="text-xs text-[#776763]">{formatSize(uploadedFile.size)}</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={confirmUpload} className="flex-1 rounded-lg bg-[#a83f32] py-2 text-sm font-bold text-white">
                      ✔ Add This Video
                    </button>
                    <button type="button" onClick={() => { setUploadedFile(null); setError(''); }} className="rounded-lg border border-[#ebded8] px-3 py-2 text-sm font-semibold text-[#776763]">
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 1: Video URL ── */}
          {tab === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-[#776763]">Paste a YouTube, YouTube Shorts, Vimeo, or direct video URL.</p>
              <div className="space-y-2">
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-[#e7dcd7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#a83f32]"
                />
                <input
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="Video title (optional)"
                  className="w-full rounded-xl border border-[#e7dcd7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#a83f32]"
                />
              </div>
              <button
                type="button"
                onClick={previewUrlInput}
                className="rounded-lg border border-[#ebded8] bg-white px-4 py-2 text-sm font-semibold text-[#2d2323] hover:border-[#a83f32]"
              >
                Preview
              </button>

              {urlPreview && (
                <div className="overflow-hidden rounded-xl border border-[#ebded8]">
                  {urlPreview.embedUrl ? (
                    <iframe
                      src={urlPreview.embedUrl}
                      title="Preview"
                      allowFullScreen
                      className="aspect-video w-full border-0"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-[#f4efed] p-4 text-center">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-[#2d2323]">Direct video URL detected</p>
                        <a href={urlInput} target="_blank" rel="noreferrer" className="text-xs text-[#a83f32] underline">
                          Open to verify ↗
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                disabled={!urlInput.trim()}
                onClick={confirmUrl}
                className="w-full rounded-lg bg-[#a83f32] py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                Add Video
              </button>
            </div>
          )}

          {/* ── TAB 2: Google Video ── */}
          {tab === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-[#776763]">Paste a Google Drive video sharing link.</p>
              <div className="rounded-lg bg-[#fffaf8] px-3 py-2 text-xs text-[#776763] font-mono break-all">
                https://drive.google.com/file/d/FILE_ID/view
              </div>
              <div className="space-y-2">
                <input
                  value={googleInput}
                  onChange={(e) => setGoogleInput(e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full rounded-xl border border-[#e7dcd7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#a83f32]"
                />
                <input
                  value={googleTitle}
                  onChange={(e) => setGoogleTitle(e.target.value)}
                  placeholder="Video title (optional)"
                  className="w-full rounded-xl border border-[#e7dcd7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#a83f32]"
                />
              </div>
              <button
                type="button"
                onClick={previewGoogle}
                className="rounded-lg border border-[#ebded8] bg-white px-4 py-2 text-sm font-semibold text-[#2d2323] hover:border-[#a83f32]"
              >
                Preview
              </button>

              {googlePreview && (
                <div className="overflow-hidden rounded-xl border border-[#ebded8]">
                  {googlePreview.embedUrl ? (
                    <>
                      <iframe
                        src={googlePreview.embedUrl}
                        title="Google Drive Preview"
                        allowFullScreen
                        className="aspect-video w-full border-0"
                      />
                      <p className="px-3 py-1.5 text-xs text-[#776763]">
                        If the preview is blank, the sharing permission may need to be set to "Anyone with the link".
                      </p>
                    </>
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-[#f4efed] p-4 text-center">
                      <span className="text-3xl">🔵</span>
                      <p className="text-xs font-semibold text-[#2d2323]">Unable to detect a playable Google Drive link.</p>
                      <p className="text-xs text-[#776763]">The link will still be saved — viewers can open it in Google Drive.</p>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                disabled={!googleInput.trim()}
                onClick={confirmGoogle}
                className="w-full rounded-lg bg-[#a83f32] py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                Add Google Video
              </button>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

const MAX_VIDEOS = 20;

export default function BusinessVideoUploader({ label = 'Video Gallery', value = [], onChange, placeId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const videos = Array.isArray(value) ? value : [];

  const addVideo = (video) => {
    if (videos.length >= MAX_VIDEOS) return;
    onChange([...videos, video]);
    setModalOpen(false);
  };

  const removeVideo = (index) => {
    onChange(videos.filter((_, i) => i !== index));
  };

  return (
    <section className="rounded-2xl border border-dashed border-[#e7dcd7] bg-[#fffaf8] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[#2d2323]">{label}</h3>
          <p className="mt-0.5 text-xs text-[#776763]">
            Add via device upload, YouTube / Vimeo URL, or Google Drive link.
          </p>
        </div>
        <span className="text-xs font-semibold text-[#776763]">{videos.length}/{MAX_VIDEOS} Videos</span>
      </div>

      {videos.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <VideoCard key={`${video.url}-${index}`} video={video} index={index} onRemove={removeVideo} />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid h-32 place-items-center rounded-xl border border-dashed border-[#e7dcd7] bg-white text-sm text-[#776763]">
          No videos added yet
        </div>
      )}

      <button
        type="button"
        disabled={videos.length >= MAX_VIDEOS}
        onClick={() => setModalOpen(true)}
        className="mt-4 rounded-xl bg-[#a83f32] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#8f3128] disabled:cursor-not-allowed disabled:opacity-50"
      >
        + Add Video
      </button>

      {modalOpen && (
        <AddVideoModal onAdd={addVideo} onClose={() => setModalOpen(false)} placeId={placeId} />
      )}
    </section>
  );
}

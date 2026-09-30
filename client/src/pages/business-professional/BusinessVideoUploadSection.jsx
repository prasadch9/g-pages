import React from 'react';

/**
 * BusinessVideoUploadSection
 * Reusable video upload and showcase component for Business & Professional Services forms.
 * Supports:
 * - Direct video file upload from device (MP4, WebM, MOV, etc.)
 * - Video URL adding (YouTube, Vimeo, web video)
 * - Video preview player
 * - Video caption editing
 * - Video deletion
 */
export default function BusinessVideoUploadSection({
  mallVideos = [],
  setMallVideos,
  mallVideoUrl = '',
  setMallVideoUrl,
  mallVideoCaption = '',
  setMallVideoCaption,
  handleMallVideoFiles,
  addMallVideoUrl,
  title = 'Business Videos & Showcase (Optional)',
  description = 'Upload video files or add video links to showcase your office, team, work, and services in your public brand gallery.',
  theme = 'sky',
}) {
  const isSky = theme === 'sky';
  const isOrange = theme === 'orange';
  const isIndigo = theme === 'indigo';

  const borderColor = isOrange ? 'border-orange-200' : isIndigo ? 'border-indigo-200' : 'border-sky-200';
  const bgColor = isOrange ? 'bg-orange-50/40' : isIndigo ? 'bg-indigo-50/40' : 'bg-sky-50/40';
  const btnBg = isOrange ? 'bg-orange-600 hover:bg-orange-700' : isIndigo ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-sky-700 hover:bg-sky-800';
  const btnOutline = isOrange ? 'border-orange-600 text-orange-700 hover:bg-orange-50' : isIndigo ? 'border-indigo-600 text-indigo-700 hover:bg-indigo-50' : 'border-sky-600 text-sky-700 hover:bg-sky-50';

  const inputClass = 'w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink/40';

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (handleMallVideoFiles) {
        handleMallVideoFiles(e.target.files);
      } else if (setMallVideos) {
        const selected = Array.from(e.target.files);
        setMallVideos((current) => [
          ...(current || []),
          ...selected.map((file) => ({
            file,
            url: '',
            caption: '',
            preview: URL.createObjectURL(file),
          })),
        ]);
      }
      e.target.value = '';
    }
  };

  const handleAddUrl = (e) => {
    e?.preventDefault();
    if (!mallVideoUrl?.trim()) return;
    if (addMallVideoUrl) {
      addMallVideoUrl();
    } else if (setMallVideos) {
      setMallVideos((current) => [
        ...(current || []),
        { url: mallVideoUrl.trim(), caption: mallVideoCaption?.trim() || '' },
      ]);
      setMallVideoUrl?.('');
      setMallVideoCaption?.('');
    }
  };

  const handleRemove = (index) => {
    if (!setMallVideos) return;
    setMallVideos((current) => {
      const target = current[index];
      if (target?.preview) {
        try {
          URL.revokeObjectURL(target.preview);
        } catch (_) {}
      }
      return current.filter((_, i) => i !== index);
    });
  };

  const handleCaptionChange = (index, value) => {
    if (!setMallVideos) return;
    setMallVideos((current) =>
      current.map((item, i) => (i === index ? { ...item, caption: value } : item))
    );
  };

  return (
    <div className={`col-span-2 rounded-2xl border ${borderColor} ${bgColor} p-4 sm:p-5`}>
      {/* Header with Title and Upload Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-display text-base font-semibold text-slate-800">{title}</h4>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>

        <div>
          <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl ${btnBg} px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition active:scale-95`}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload Video File</span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              multiple
              className="hidden"
              onChange={onFileSelect}
            />
          </label>
        </div>
      </div>

      {/* URL Input Form */}
      <div className="mt-4 rounded-xl border border-line/60 bg-white/80 p-3 backdrop-blur-sm">
        <p className="text-xs font-medium text-slate-600">Or add a YouTube / Web video URL:</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1.2fr_1fr_auto]">
          <input
            type="url"
            value={mallVideoUrl || ''}
            onChange={(e) => setMallVideoUrl?.(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or direct video link"
            className={inputClass}
          />
          <input
            value={mallVideoCaption || ''}
            onChange={(e) => setMallVideoCaption?.(e.target.value)}
            placeholder="Video caption / title (optional)"
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${btnOutline}`}
          >
            Add URL
          </button>
        </div>
      </div>

      {/* List of Attached Videos */}
      {mallVideos && mallVideos.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-700">
            Selected Videos ({mallVideos.length}):
          </p>
          <div className="grid gap-2 sm:grid-cols-1">
            {mallVideos.map((item, index) => {
              const isFile = Boolean(item.file);
              const previewSrc = item.preview || item.url;
              const isYouTube = !isFile && (item.url?.includes('youtube.com') || item.url?.includes('youtu.be'));

              return (
                <div
                  key={item.preview || item.url || index}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Media Thumbnail / Video Element */}
                    <div className="relative flex h-16 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-900 text-white">
                      {item.preview ? (
                        <video
                          src={item.preview}
                          className="h-full w-full object-cover"
                          preload="metadata"
                        />
                      ) : isYouTube ? (
                        <div className="flex flex-col items-center justify-center text-red-500">
                          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          <span className="text-[9px] font-bold text-white">YouTube</span>
                        </div>
                      ) : item.url ? (
                        <video
                          src={item.url}
                          className="h-full w-full object-cover"
                          preload="metadata"
                        />
                      ) : (
                        <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {item.file?.name || item.url || `Video ${index + 1}`}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {isFile
                          ? `${(item.file.size / (1024 * 1024)).toFixed(1)} MB · Ready for upload`
                          : isYouTube
                          ? 'YouTube embed link'
                          : 'Online video link'}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Caption Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.caption || ''}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                      placeholder="Caption / description"
                      className="w-full rounded border border-line px-2.5 py-1.5 text-xs sm:w-48"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 active:scale-95"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

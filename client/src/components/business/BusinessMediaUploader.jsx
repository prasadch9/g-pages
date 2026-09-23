import React, { useMemo, useRef, useState } from 'react';
import api from '../../services/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const supportedTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

const isValidImageUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return value.startsWith('/uploads/') || value.startsWith('/images/');
  }
};

const imageName = (url) => {
  try {
    return decodeURIComponent(new URL(url, window.location.origin).pathname.split('/').pop() || 'Image');
  } catch {
    return 'Image';
  }
};

const verifyImageUrl = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve();
  image.onerror = () => reject(new Error('Invalid image URL.')); 
  image.src = url;
});

const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let size = bytes / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export default function BusinessMediaUploader({
  label,
  value,
  onChange,
  placeId,
  multiple = false,
  max = 10,
  previewClassName = 'h-36',
  helpText,
  type = 'image',
}) {
  const inputRef = useRef(null);
  const [urlValue, setUrlValue] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState('');
  const [replaceIndex, setReplaceIndex] = useState(null);
  const [metaMap, setMetaMap] = useState({});

  const values = useMemo(
    () => (multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : [])).filter(Boolean),
    [multiple, value]
  );

  const remainingCount = multiple ? max - values.length : 0;
  const atLimit = multiple ? values.length >= max : values.length >= 1;

  const commit = (nextList) => {
    if (multiple) {
      onChange(nextList.slice(0, max));
      return;
    }
    onChange(nextList[0] || '');
  };

  const updateMeta = (url, entry) => {
    setMetaMap((current) => ({ ...current, [url]: entry }));
  };

  const removeValue = (index) => {
    const next = values.filter((_, itemIndex) => itemIndex !== index);
    setError('');
    commit(next);
  };

  const addValues = (nextValues) => {
    if (multiple && values.length + nextValues.length > max) {
      setError(`Maximum ${max} images allowed.`);
      return;
    }

    if (!multiple && nextValues.length > 0) {
      commit(nextValues.slice(-1));
      setError('');
      return;
    }

    const combined = [...values, ...nextValues].slice(0, max);
    setError('');
    commit(combined);
  };

  const openPicker = (targetIndex = null) => {
    setReplaceIndex(targetIndex);
    inputRef.current?.click();
  };

  const chooseFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) {
      setError('Please select an image.');
      return;
    }

    if (files.some((file) => !supportedTypes.has(file.type))) {
      setError('Invalid image format. Please use JPG, JPEG, PNG, or WEBP.');
      return;
    }

    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      setError('Maximum file size exceeded. Please use images under 5 MB.');
      return;
    }

    if (multiple && values.length + files.length > max) {
      setError(`Maximum ${max} gallery images allowed.`);
      return;
    }

    setUploading(true);
    setError('');
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const query = placeId ? `?placeId=${encodeURIComponent(placeId)}` : '';
        const { data } = await api.post(`/media/upload${query}`, formData);
        const url = data.data.url;
        uploaded.push(url);
        updateMeta(url, { name: file.name, size: file.size });
      }

      if (replaceIndex !== null) {
        const current = [...values];
        const replacement = uploaded[0] || '';
        current[replaceIndex] = replacement;
        commit(current);
      } else {
        addValues(uploaded);
      }
      setReplaceIndex(null);
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || uploadError.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const previewUrl = async (candidate) => {
    if (!candidate.trim()) {
      setError('Please select an image.');
      return;
    }

    if (!isValidImageUrl(candidate)) {
      setError('Invalid image URL.');
      return;
    }

    try {
      await verifyImageUrl(candidate);
      setPendingPreviewUrl(candidate);
      setError('');
    } catch {
      setError('Unable to load image. Please use a valid accessible image URL.');
    }
  };

  const confirmPreviewImage = () => {
    if (!pendingPreviewUrl) return;
    if (replaceIndex !== null) {
      const next = [...values];
      next[replaceIndex] = pendingPreviewUrl;
      commit(next);
      setReplaceIndex(null);
    } else {
      addValues([pendingPreviewUrl]);
    }
    setPendingPreviewUrl('');
    setUrlValue('');
  };

  const renderPrimaryActions = () => (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={uploading || atLimit}
        onClick={() => openPicker()}
        className="rounded-lg bg-[#0f6cbf] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d5ea3] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? 'Uploading…' : 'Upload from Device'}
      </button>

      <button
        type="button"
        onClick={() => setError('Google Drive / Photos is not configured for this project yet. Connect Google access to enable this option.')}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-sky-200 hover:text-sky-700"
      >
        Google Drive / Photos
      </button>

      <button
        type="button"
        onClick={() => setMobileMenuOpen(false)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-sky-200 hover:text-sky-700"
      >
        Image URL
      </button>
    </div>
  );

  return (
    <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
          {helpText && <p className="mt-1 text-xs text-slate-500">{helpText}</p>}
        </div>
        {multiple && (
          <span className="text-xs font-semibold text-slate-500">
            {values.length}/{max} Images
          </span>
        )}
      </div>

      {values.length > 0 ? (
        <div className={`mt-4 grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
          {values.map((url, index) => {
            const meta = metaMap[url] || { name: imageName(url), size: null };
            return (
              <figure key={`${url}-${index}`} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <img src={url} alt={`${label} ${index + 1}`} className={`${previewClassName} w-full object-cover`} />
                <figcaption className="space-y-1 border-t border-slate-200 bg-white/95 px-2 py-1.5 text-[11px] text-slate-600">
                  <div className="truncate font-medium">{meta.name}</div>
                  {meta.size && <div>{formatFileSize(meta.size)}</div>}
                </figcaption>
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => openPicker(index)}
                    className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-red-600 shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              </figure>
            );
          })}
        </div>
      ) : (
        <div className={`${previewClassName} mt-4 grid place-items-center rounded-xl border border-dashed border-slate-200 bg-white text-sm text-slate-500`}>
          {type === 'logo' ? 'No logo selected' : type === 'cover' ? 'No cover image selected' : 'No image selected'}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple={multiple} className="hidden" onChange={chooseFiles} />

      <div className="mt-4 hidden gap-2 sm:flex">
        <button
          type="button"
          disabled={uploading || atLimit}
          onClick={() => openPicker()}
          className="rounded-lg bg-[#0f6cbf] px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Upload from Device
        </button>
        <button
          type="button"
          onClick={() => setError('Google Drive / Photos is not configured for this project yet. Connect Google access to enable this option.')}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
        >
          Google Drive / Photos
        </button>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
        >
          Image URL
        </button>
      </div>

      <div className="mt-3 block sm:hidden">
        <button
          type="button"
          className="w-full rounded-lg bg-[#0f6cbf] px-4 py-3 text-sm font-semibold text-white shadow-sm"
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          + Add Image
        </button>
        {mobileMenuOpen && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="space-y-2">
              <button type="button" className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-3 text-left text-sm font-medium text-slate-700" disabled={uploading || atLimit} onClick={() => { setMobileMenuOpen(false); openPicker(); }}>
                📁 Upload from Device
              </button>
              <button type="button" className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-3 text-left text-sm font-medium text-slate-700" onClick={() => { setMobileMenuOpen(false); setError('Google Drive / Photos is not configured for this project yet.'); }}>
                ☁ Google Drive / Photos
              </button>
              <button type="button" className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-3 text-left text-sm font-medium text-slate-700" onClick={() => { setMobileMenuOpen(false); setMobileMenuOpen(true); }}>
                🔗 Image URL
              </button>
              <button type="button" className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {(mobileMenuOpen || !multiple) && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={urlValue}
              onChange={(event) => setUrlValue(event.target.value)}
              placeholder="Image URL"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-300"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => previewUrl(urlValue)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              >
                Preview
              </button>
              <button
                type="button"
                disabled={!urlValue.trim() || uploading || atLimit}
                onClick={() => previewUrl(urlValue)}
                className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <h4 className="text-lg font-semibold text-slate-800">Image Preview</h4>
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <img src={pendingPreviewUrl} alt="Preview" className="h-52 w-full object-cover" onError={() => setError('Unable to load image.')} />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={confirmPreviewImage}
                className="flex-1 rounded-lg bg-[#0f6cbf] px-3 py-2 text-sm font-semibold text-white"
              >
                Use This Image
              </button>
              <button
                type="button"
                onClick={() => setPendingPreviewUrl('')}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      {multiple && remainingCount >= 0 && <p className="mt-2 text-xs text-slate-500">{values.length}/{max} images added</p>}
    </section>
  );
}

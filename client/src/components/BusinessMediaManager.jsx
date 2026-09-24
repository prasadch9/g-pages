import React, { useRef, useState } from 'react';
import api from '../services/api';

const mediaUrl = (url) => url?.startsWith('/uploads/') ? url : url;

export default function BusinessMediaManager({ place, onUpdated }) {
  const inputRef = useRef(null);
  const [mediaType, setMediaType] = useState('image');
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const choose = (event) => {
    setError('');
    setFiles(Array.from(event.target.files || []));
  };

  const upload = async () => {
    if (!files.length) return;
    setBusy(true);
    setError('');
    try {
      const form = new FormData();
      form.append('mediaType', mediaType);
      files.forEach((file) => form.append('files', file));
      const { data } = await api.post(`/places/${place._id}/media`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) setError(`Uploading ${Math.round((event.loaded / event.total) * 100)}%`);
        },
      });
      setFiles([]);
      setError('');
      onUpdated(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (index, type) => {
    setError('');
    try {
      const { data } = await api.delete(`/places/${place._id}/media`, { data: { mediaType: type, index } });
      onUpdated(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const images = place.images || [];
  const videos = place.videos || [];
  const approved = place.applicationStatus === 'approved' || place.status === 'approved';

  return (
    <div className="mt-4 rounded-xl border border-cyan-100 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h3 className="font-display text-base font-semibold text-ink">Media manager</h3><p className="mt-1 text-xs text-ink/50">{approved ? 'Manage approved business media.' : 'Upload application photos for admin review. Premium video management unlocks after approval.'}</p></div>
        <div className="flex gap-1 rounded border border-line p-1 text-xs"><button type="button" onClick={() => setMediaType('image')} className={`rounded px-3 py-1.5 ${mediaType === 'image' ? 'bg-ink text-paper' : 'text-ink/60'}`}>Photos</button><button type="button" disabled={!approved} onClick={() => setMediaType('video')} className={`rounded px-3 py-1.5 disabled:opacity-40 ${mediaType === 'video' ? 'bg-ink text-paper' : 'text-ink/60'}`}>Videos</button></div>
      </div>
      <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 flex min-h-24 w-full flex-col items-center justify-center rounded-lg border border-dashed border-cyan-300 bg-cyan-50/50 text-sm text-cyan-800 hover:bg-cyan-50">+ Upload {mediaType === 'image' ? 'photos' : 'videos'}<span className="mt-1 text-xs text-cyan-700/60">Click to browse multiple files</span></button>
      <input ref={inputRef} type="file" hidden multiple accept={mediaType === 'image' ? 'image/jpeg,image/png,image/webp' : 'video/mp4,video/webm,video/quicktime'} onChange={choose} />
      {files.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-xs text-ink/60">{files.length} selected</span><button type="button" disabled={busy} onClick={upload} className="rounded bg-cyan-700 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{busy ? 'Uploading…' : 'Upload now'}</button></div>}
      {error && <p className={`mt-2 text-xs ${error.startsWith('Uploading') ? 'text-cyan-700' : 'text-vermilion'}`}>{error}</p>}
      {images.length > 0 && <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">{images.map((image, index) => <div key={`${image}-${index}`} className="group relative"><img src={mediaUrl(image)} alt={`${place.name} media ${index + 1}`} className="aspect-square w-full rounded object-cover" /><button type="button" onClick={() => remove(index, 'image')} className="absolute right-1 top-1 hidden rounded bg-black/70 px-1.5 py-1 text-xs text-white group-hover:block">Delete</button></div>)}</div>}
      {videos.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">{videos.map((video, index) => <div key={video.url || index} className="relative rounded border border-line p-2"><video controls preload="metadata" src={mediaUrl(video.url)} className="w-full rounded" /><button type="button" onClick={() => remove(index, 'video')} className="mt-2 text-xs text-vermilion hover:underline">Delete video</button></div>)}</div>}
    </div>
  );
}

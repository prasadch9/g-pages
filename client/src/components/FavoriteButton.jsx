import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function FavoriteButton({ placeId, initialFavorited = false, iconOnly = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post(`/favorites/${placeId}`);
      setFavorited(data.favorited);
    } catch {
      // Silently ignore — the button just won't toggle if the request fails
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={favorited ? 'Unlike this place' : 'Like this place'}
      title={favorited ? 'Unlike this place' : 'Like this place'}
      className={`${iconOnly ? 'flex h-10 w-10 items-center justify-center rounded-full border p-0 text-xl' : 'flex items-center gap-1.5 rounded border px-4 py-2 text-sm'} transition ${
        favorited
          ? 'border-red-500 bg-red-500/10 text-red-500'
          : iconOnly
            ? 'border-[#b1164c]/30 bg-white/80 text-[#b1164c] hover:bg-white'
            : 'border-line text-ink/70 hover:border-ink/30'
      }`}
    >
      <svg viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true"><path d="M20.8 4.8a5.6 5.6 0 0 0-7.9 0L12 5.7l-.9-.9a5.6 5.6 0 0 0-7.9 7.9L12 21l8.8-8.3a5.6 5.6 0 0 0 0-7.9Z"/></svg>
      {!iconOnly && (favorited ? 'Saved' : 'Save')}
    </button>
  );
}

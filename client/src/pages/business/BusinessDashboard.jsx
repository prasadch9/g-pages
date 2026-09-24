import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const STATUS_STYLES = {
  pending: 'bg-marigold/20 text-marigold-dark',
  approved: 'bg-moss/15 text-moss',
  rejected: 'bg-vermilion/10 text-vermilion',
  suspended: 'bg-ink/10 text-ink/50',
};

export default function BusinessDashboard() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [chats, setChats] = useState([]);
  const [reply, setReply] = useState({});

  useEffect(() => {
    api
      .get('/places/mine')
      .then(({ data }) => setPlaces(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    api.get('/chat/business').then(({ data }) => setChats(data.data)).catch(() => setChats([]));
  }, []);

  const sendReply = async (message) => {
    const body = reply[message.user?._id] || '';
    if (!body.trim()) return;
    const { data } = await api.post(`/chat/business/${message.place?._id}`, { user: message.user?._id, body });
    setChats((current) => [...current, data.data]);
    setReply((current) => ({ ...current, [message.user?._id]: '' }));
  };

  const handleDelete = async (place) => {
    if (!window.confirm(`Delete ${place.name}? This cannot be undone.`)) return;
    setDeletingId(place._id);
    try {
      await api.delete(`/places/${place._id}`);
      setPlaces((current) => current.filter((item) => item._id !== place._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const counts = places.reduce(
    (acc, p) => ({ ...acc, [p.status]: (acc[p.status] || 0) + 1 }),
    {}
  );

  const deleteListing = async (place) => {
    if (!window.confirm(`Delete ${place.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/places/${place._id}`);
      setPlaces((current) => current.filter((item) => item._id !== place._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Business dashboard</h1>
          <p className="mt-1 text-sm text-ink/55">Manage your listings and track their performance.</p>
        </div>
        <Link
          to="/business/listings/new"
          className="rounded bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink-light"
        >
          + Add Business
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total listings', value: places.length },
          { label: 'Approved', value: counts.approved || 0 },
          { label: 'Pending review', value: counts.pending || 0 },
          { label: 'Rejected', value: counts.rejected || 0 },
        ].map((stat) => (
          <div key={stat.label} className="rounded border border-line bg-white/50 p-4">
            <div className="font-display text-2xl font-semibold text-ink">{stat.value}</div>
            <div className="text-xs text-ink/50">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-medium text-ink">Your listings</h2>

        {loading && <p className="mt-4 text-sm text-ink/50">Loading…</p>}
        {error && <p className="mt-4 text-sm text-vermilion">{error}</p>}

        {!loading && places.length === 0 && (
          <div className="mt-4 rounded border border-dashed border-line p-10 text-center text-sm text-ink/45">
            You haven't listed a business yet.{' '}
            <Link to="/business/listings/new" className="text-ink underline underline-offset-2">
              Create your first listing
            </Link>
          </div>
        )}

        <div className="mt-4 flex flex-col divide-y divide-line rounded border border-line bg-white/40">
          {places.map((place) => (
            <div key={place._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="font-display text-[15px] font-medium text-ink">{place.name}</div>
                <div className="text-xs text-ink/45">
                  {place.category?.name} · {place.pageType || 'static'} page · {place.views} views · {place.favoritesCount} favorites
                </div>
                {place.status === 'rejected' && place.rejectionReason && (
                  <div className="mt-1 text-xs text-vermilion">Reason: {place.rejectionReason}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {place.status === 'approved' && <Link to={`/place/${place._id}`} target="_blank" className="rounded border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-ink/40">View profile</Link>}
                <Link to={`/business/listings/${place._id}/edit`} className="rounded border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-ink/40">Edit profile</Link>
                <span className={`rounded-sm px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[place.status]}`}>{place.status}</span>
                <button type="button" onClick={() => handleDelete(place)} disabled={deletingId === place._id} className="rounded border border-vermilion/30 px-3 py-1.5 text-xs font-semibold text-vermilion hover:bg-vermilion/10 disabled:opacity-50">{deletingId === place._id ? 'Deleting…' : 'Delete'}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-medium text-ink">Chat messages</h2>
        <div className="mt-4 flex flex-col divide-y divide-line rounded border border-line bg-white/40">
          {chats.length === 0 && <p className="p-5 text-sm text-ink/50">No chat messages yet.</p>}
          {chats.map((message) => <div key={message._id} className="p-4"><div className="text-sm font-semibold text-ink">{message.place?.name} · {message.user?.name || message.user?.email}</div><p className="mt-1 text-sm text-ink/70">{message.body}</p><div className="mt-2 flex gap-2"><input value={reply[message.user?._id] || ''} onChange={(event) => setReply((current) => ({ ...current, [message.user?._id]: event.target.value }))} placeholder="Reply to this user" className="min-w-0 flex-1 rounded border border-line px-3 py-2 text-sm" /><button type="button" onClick={() => sendReply(message)} className="rounded bg-ink px-3 py-2 text-xs font-semibold text-paper">Reply</button></div></div>)}
        </div>
      </section>
    </div>
  );
}

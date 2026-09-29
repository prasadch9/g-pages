import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BusinessMediaManager from '../../components/BusinessMediaManager';
import BusinessChatInbox from '../../components/BusinessChatInbox';

const STATUS_STYLES = {
  pending: 'bg-marigold/20 text-marigold-dark',
  submitted: 'bg-marigold/20 text-marigold-dark',
  under_review: 'bg-marigold/20 text-marigold-dark',
  resubmitted: 'bg-marigold/20 text-marigold-dark',
  approved: 'bg-moss/15 text-moss',
  rejected: 'bg-vermilion/10 text-vermilion',
  suspended: 'bg-ink/10 text-ink/50',
};

function BusinessEnquiryInbox() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');

  const loadEnquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/enquiries/business');
      setEnquiries(data.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load business enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEnquiries(); }, []);

  const updateStatus = async (enquiry, status) => {
    setSavingId(enquiry._id);
    setError('');
    try {
      const { data } = await api.put(`/enquiries/${enquiry._id}/status`, { status });
      setEnquiries((current) => current.map((item) => item._id === enquiry._id ? data.data : item));
    } catch (err) {
      setError(err.message || 'Unable to update this enquiry.');
    } finally {
      setSavingId('');
    }
  };

  return <section id="enquiries" className="mt-10">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-medium text-ink">Website Enquiries</h2>
        <p className="mt-1 text-sm text-ink/50">Course, admission and contact-form enquiries for your listings.</p>
      </div>
      <button type="button" onClick={loadEnquiries} disabled={loading} className="rounded border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 disabled:opacity-50">{loading ? 'Refreshing…' : 'Refresh'}</button>
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-vermilion">{error}</p>}
    {loading && <p className="mt-4 text-sm text-ink/50">Loading enquiries…</p>}
    {!loading && !error && enquiries.length === 0 && <p className="mt-4 rounded border border-dashed border-line p-5 text-sm text-ink/50">No website enquiries yet.</p>}
    {!loading && enquiries.length > 0 && <div className="mt-4 divide-y divide-line border-y border-line bg-white/50">
      {enquiries.map((enquiry) => {
        const status = enquiry.status || 'new';
        const statusStyle = status === 'responded' ? 'bg-moss/15 text-moss' : status === 'closed' ? 'bg-ink/10 text-ink/55' : 'bg-blue-100 text-blue-800';
        return <article key={enquiry._id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-ink">{enquiry.name}</h3><span className={`rounded-sm px-2 py-1 text-[10px] font-semibold capitalize ${statusStyle}`}>{status}</span><span className="text-xs text-ink/45">{enquiry.place?.name}</span></div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/55">{enquiry.email && <a href={`mailto:${enquiry.email}`} className="hover:text-ink">{enquiry.email}</a>}{enquiry.phone && <a href={`tel:${enquiry.phone}`} className="hover:text-ink">{enquiry.phone}</a>}<time>{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : ''}</time></div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/75">{enquiry.message}</p>
          </div>
          <div className="flex items-start gap-2 sm:justify-end">
            {status === 'new' && <button type="button" onClick={() => updateStatus(enquiry, 'responded')} disabled={savingId === enquiry._id} className="rounded border border-moss/30 px-3 py-1.5 text-xs font-semibold text-moss disabled:opacity-50">Mark responded</button>}
            {status !== 'closed' && <button type="button" onClick={() => updateStatus(enquiry, 'closed')} disabled={savingId === enquiry._id} className="rounded border border-line px-3 py-1.5 text-xs font-semibold text-ink/60 disabled:opacity-50">Close</button>}
            {status === 'closed' && <button type="button" onClick={() => updateStatus(enquiry, 'new')} disabled={savingId === enquiry._id} className="rounded border border-line px-3 py-1.5 text-xs font-semibold text-ink/60 disabled:opacity-50">Reopen</button>}
          </div>
        </article>;
      })}
    </div>}
  </section>;
}

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

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Business dashboard</h1>
          <p className="mt-1 text-sm text-ink/55">Manage your listings and track their performance.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#enquiries" className="rounded border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink/40">Website Enquiries</a>
          <Link
            to="/business/listings/new"
            className="rounded bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink-light"
          >
            + Add Business
          </Link>
        </div>
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

      <BusinessEnquiryInbox />

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

        <div className="mt-4 divide-y divide-line border-y border-line bg-white/40">
          {places.map((place) => (
            <div key={place._id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <h3 className="truncate font-display text-[15px] font-medium text-ink">{place.name}</h3>
                  <span className={`shrink-0 rounded-sm px-2 py-1 text-[11px] font-medium capitalize ${STATUS_STYLES[place.status] || STATUS_STYLES.suspended}`}>
                    {place.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    to={`/business/listings/${place._id}/edit`}
                    state={{ editPlace: place }}
                    className="rounded border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-ink/40"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(place)}
                    disabled={deletingId === place._id}
                    className="rounded border border-vermilion/30 px-3 py-1.5 text-xs font-semibold text-vermilion transition hover:bg-vermilion/10 disabled:opacity-50"
                  >
                    {deletingId === place._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
              <details className="group mt-2">
                <summary className="w-fit cursor-pointer text-xs text-ink/50 marker:text-ink/40 hover:text-ink">
                  Photos &amp; videos
                </summary>
                <BusinessMediaManager
                  place={place}
                  onUpdated={(updated) => setPlaces((current) => current.map((item) => item._id === updated._id ? updated : item))}
                />
              </details>
            </div>
          ))}
        </div>
      </div>
      <BusinessChatInbox />


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

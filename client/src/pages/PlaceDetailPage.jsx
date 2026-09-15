import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FavoriteButton from '../components/FavoriteButton';
import ReviewsSection from '../components/ReviewsSection';

const DAY_LABELS = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
const REPORT_REASONS = [
  ['incorrect_information', 'Incorrect information'],
  ['closed_business', 'Closed business'],
  ['duplicate_listing', 'Duplicate listing'],
  ['fake_listing', 'Fake listing'],
  ['inappropriate_content', 'Inappropriate content'],
  ['other', 'Other'],
];

function EnquiryForm({ placeId }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/enquiries', { place: placeId, ...form });
      setStatus('sent');
      setForm({ ...form, message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return <p className="rounded border border-moss/40 bg-moss/5 p-4 text-sm text-moss">Your enquiry has been sent. The business will contact you soon.</p>;
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded border border-line bg-white/50 p-4">
      <h3 className="font-display text-lg font-medium text-ink">Contact this business</h3>
      <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded border border-line bg-white px-3 py-2 text-[14px] outline-none focus:border-ink/40" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded border border-line bg-white px-3 py-2 text-[14px] outline-none focus:border-ink/40" />
      <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded border border-line bg-white px-3 py-2 text-[14px] outline-none focus:border-ink/40" />
      <textarea required rows={3} placeholder="What would you like to ask?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded border border-line bg-white px-3 py-2 text-[14px] outline-none focus:border-ink/40" />
      {status === 'error' && <p className="text-sm text-vermilion">Something went wrong. Please try again.</p>}
      <button type="submit" disabled={status === 'sending'} className="rounded bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-light disabled:opacity-60">
        {status === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}

function ReportModal({ placeId, onClose }) {
  const [reason, setReason] = useState(REPORT_REASONS[0][0]);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idle');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/reports', { place: placeId, reason, description });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-sm rounded-md bg-paper p-5">
        {status === 'sent' ? (
          <>
            <p className="text-[15px] text-ink">Thanks — our team will review this listing.</p>
            <button onClick={onClose} className="mt-4 rounded border border-line px-4 py-2 text-sm">Close</button>
          </>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <h3 className="font-display text-lg font-medium text-ink">Report this listing</h3>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="rounded border border-line bg-white px-3 py-2 text-[14px]">
              {REPORT_REASONS.map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <textarea rows={3} placeholder="Add details (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="rounded border border-line bg-white px-3 py-2 text-[14px]" />
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="flex-1 rounded border border-line px-4 py-2 text-sm">Cancel</button>
              <button type="submit" disabled={status === 'sending'} className="flex-1 rounded bg-vermilion px-4 py-2 text-sm font-medium text-paper disabled:opacity-60">
                {status === 'sending' ? 'Submitting…' : 'Submit report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PlaceDetailPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/places/${id}`)
      .then(({ data }) => setPlace(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: place?.name, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    }
  };

  if (loading) return <div className="container-page py-20 text-center text-ink/50">Loading…</div>;
  if (error || !place) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Listing not found</h1>
        <Link to="/" className="mt-4 inline-block text-vermilion underline underline-offset-2">Back to homepage</Link>
      </div>
    );
  }

  const mapsUrl = place.coordinates?.lat
    ? `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;

  return (
    <div className="container-page py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-ink/50">{place.category?.name}</p>
          <h1 className="mt-1 flex items-center gap-2 font-display text-3xl font-semibold text-ink">
            {place.name}
            {place.verified && (
              <span className="rounded bg-moss px-2 py-0.5 text-xs font-medium text-paper">Verified</span>
            )}
          </h1>
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <span className="text-marigold-dark">{'★'.repeat(Math.round(place.rating?.average || 0))}</span>
            <span className="text-ink/45">
              {place.rating?.average || 0} ({place.rating?.count || 0} reviews)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <FavoriteButton placeId={place._id} />
          <button onClick={handleShare} className="rounded border border-line px-4 py-2 text-sm text-ink/70 hover:border-ink/30">
            Share
          </button>
          <button onClick={() => setShowReport(true)} className="rounded border border-line px-4 py-2 text-sm text-ink/70 hover:border-ink/30">
            Report
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-10">
          {/* Gallery */}
          {place.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {place.images.map((img, i) => (
                <img key={i} src={img} alt={`${place.name} photo ${i + 1}`} className="h-28 w-full rounded object-cover" />
              ))}
            </div>
          )}

          {/* About */}
          {place.description && (
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">About</h2>
              <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink/65">{place.description}</p>
            </div>
          )}

          {/* Services */}
          {place.services?.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Services</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {place.services.map((s) => (
                  <span key={s} className="rounded border border-line bg-white/60 px-3 py-1 text-sm text-ink/70">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Timings */}
          {place.workingHours?.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Timings</h2>
              <div className="mt-3 grid max-w-xs grid-cols-2 gap-y-1.5 text-sm">
                {place.workingHours.map((wh) => (
                  <React.Fragment key={wh.day}>
                    <span className="text-ink/60">{DAY_LABELS[wh.day]}</span>
                    <span className="text-ink">{wh.closed ? 'Closed' : `${wh.open} – ${wh.close}`}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <ReviewsSection placeId={place._id} />
        </div>

        {/* Sidebar: contact + map */}
        <aside className="flex flex-col gap-5">
          <div className="rounded border border-line bg-white/50 p-5">
            <h3 className="font-display text-lg font-medium text-ink">Contact</h3>
            <div className="mt-3 flex flex-col gap-2 text-[14px] text-ink/70">
              {place.phone && <a href={`tel:${place.phone}`} className="hover:text-ink">📞 {place.phone}</a>}
              {place.email && <a href={`mailto:${place.email}`} className="hover:text-ink">✉️ {place.email}</a>}
              <p>📍 {place.address}</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-vermilion hover:underline">
                Get directions
              </a>
              {place.website && (
                <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-vermilion hover:underline">
                  Visit official website
                </a>
              )}
            </div>
          </div>

          <EnquiryForm placeId={place._id} />
        </aside>
      </div>

      {showReport && <ReportModal placeId={place._id} onClose={() => setShowReport(false)} />}
    </div>
  );
}

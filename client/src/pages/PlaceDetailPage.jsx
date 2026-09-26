import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FavoriteButton from '../components/FavoriteButton';
import ReviewsSection from '../components/ReviewsSection';
import { resolveFoodBusinessType } from '../components/public/PublicProfileShared';

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

function SchoolActionButtons({ place, onShare, onReport, onDelete }) {
  const website = place.website && (place.website.startsWith('http') ? place.website : `https://${place.website}`);

  return (
    <div className="flex flex-wrap gap-2">
      <div className="[&>button]:border-white/60 [&>button]:text-white [&>button]:hover:border-white [&>button]:hover:bg-white/15">
        <FavoriteButton placeId={place._id} />
      </div>
      <button type="button" onClick={onShare} className="rounded border border-white/60 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm hover:border-white hover:bg-white/15">
        ↗ Share
      </button>
      <button type="button" onClick={onReport} className="rounded border border-white/60 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm hover:border-white hover:bg-white/15">
        ⚑ Report
      </button>
      {website && (
        <a href={website} target="_blank" rel="noopener noreferrer" className="rounded border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-100">
          Visit website
        </a>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} className="rounded border border-vermilion px-4 py-2 text-sm font-medium text-vermilion hover:bg-vermilion/10">
          Delete listing
        </button>
      )}
    </div>
  );
}

function ContactLink({ href, icon, label, children }) {
  return (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex min-w-0 items-center gap-2 rounded border border-line bg-white px-3 py-2 text-sm text-ink/70 transition hover:border-cyan-300 hover:text-ink">
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <span className="truncate">{children || label}</span>
    </a>
  );
}

function SchoolDetailLayout({ place, mapsUrl, socialLinks, academics, onShare, onReport, onDelete }) {
  const website = place.website && (place.website.startsWith('http') ? place.website : `https://${place.website}`);
  const cover = place.coverImage || place.images?.[0];
  const highlights = place.attributes?.highlights || place.attributes?.keyHighlights || place.services || [];
  const admissions = academics.admission || academics.admissions || academics.admissionProcess || academics.eligibility;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(place.address)}&output=embed`;
  const whatsappUrl = socialLinks.whatsapp
    ? (socialLinks.whatsapp.startsWith('http') ? socialLinks.whatsapp : `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`)
    : null;

  return (
    <div className="container-page py-8 sm:py-10">
      <section className="overflow-hidden rounded-[1.5rem] border border-[#b8e7e5] bg-white shadow-[0_18px_55px_rgba(16,42,67,0.12)]">
        <div className="relative h-[330px] overflow-hidden bg-[#082f49] sm:h-[430px]">
          {cover ? <img src={cover} alt={`${place.name} cover`} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-[linear-gradient(135deg,#073b4c,#0b7285_55%,#14b8a6)]" />}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,31,49,.08)_10%,rgba(4,31,49,.32)_44%,rgba(4,31,49,.96)_100%)]" />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm sm:left-8 sm:top-8">
            <span className="h-2 w-2 rounded-full bg-cyan-300" /> {place.category?.name || 'School'}
          </div>
          <div className="absolute bottom-0 left-0 right-0 grid gap-5 p-5 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="flex flex-wrap items-center gap-2 font-display text-3xl font-semibold leading-tight sm:text-5xl">
                {place.name}
                {place.verified && <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-[#063047]">✓ Verified</span>}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/85">
                <span className="text-amber-300" aria-label={`${place.rating?.average || 0} out of 5 stars`}>{'★'.repeat(Math.round(place.rating?.average || 0))}{'☆'.repeat(5 - Math.round(place.rating?.average || 0))}</span>
                <span className="font-semibold text-white">{place.rating?.average || 0}</span>
                <span>({place.rating?.count || 0} reviews)</span>
              </div>
              <p className="mt-3 flex max-w-2xl items-start gap-2 text-sm leading-relaxed text-white/80"><span aria-hidden="true">⌖</span>{place.address}</p>
            </div>
            <SchoolActionButtons place={place} onShare={onShare} onReport={onReport} onDelete={onDelete} />
          </div>
        </div>
        <div className="grid divide-y divide-line bg-[#f5fbfb] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[[place.rating?.count || 0, 'Parent reviews'], [place.facilities?.length || 0, 'Listed facilities'], [place.images?.length || 0, 'School photos']].map(([value, label]) => (
            <div key={label} className="flex items-center gap-3 px-5 py-4 sm:justify-center sm:px-3">
              <span className="font-display text-2xl font-semibold text-[#087f8c]">{value}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/50">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <nav aria-label="School detail sections" className="sticky top-0 z-20 -mx-5 mt-5 overflow-x-auto border-y border-line bg-paper/95 px-5 py-3 backdrop-blur sm:static sm:mx-0 sm:rounded-full sm:border sm:px-4">
        <div className="flex min-w-max gap-2 text-sm font-semibold text-ink/60">
          {[['#overview', 'Overview'], ['#facilities', 'Facilities'], ['#academics', 'Academics'], ['#reviews', 'Reviews'], ['#location', 'Location']].map(([href, label]) => <a key={href} href={href} className="rounded-full px-3 py-1.5 transition hover:bg-cyan-100 hover:text-cyan-800">{label}</a>)}
        </div>
      </nav>

      <div className="mt-6 flex flex-col gap-5">
        <section id="overview" className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-[0_8px_30px_rgba(16,42,67,0.05)] sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Get to know the campus</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Overview</h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-700">About the school</h3>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/65">{place.description || 'School information will be updated soon.'}</p>
              {website && <a href={website} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-medium text-cyan-700 hover:underline">Open official website ↗</a>}
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-700">Key highlights</h3>
              {highlights.length > 0 ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {highlights.map((highlight) => <div key={highlight} className="rounded-xl border border-cyan-100 bg-[linear-gradient(135deg,#f0fdfa,#ecfeff)] px-3 py-3 text-sm font-medium text-ink/75"><span className="mr-2 text-cyan-700">✓</span>{highlight}</div>)}
                </div>
              ) : <p className="mt-3 text-sm text-ink/50">Highlights will be updated soon.</p>}
            </div>
          </div>
          {(place.phone || place.email || whatsappUrl || socialLinks.instagram || socialLinks.facebook || website) && (
            <div className="mt-7 border-t border-line pt-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-700">Contact</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {place.phone && <ContactLink href={`tel:${place.phone}`} icon="☎" label="Call">{place.phone}</ContactLink>}
                {whatsappUrl && <ContactLink href={whatsappUrl} icon="◉" label="WhatsApp" />}
                {socialLinks.instagram && <ContactLink href={socialLinks.instagram} icon="◎" label="Instagram" />}
                {socialLinks.facebook && <ContactLink href={socialLinks.facebook} icon="f" label="Facebook" />}
                {website && <ContactLink href={website} icon="↗" label="Website" />}
              </div>
            </div>
          )}
        </section>

        <section id="facilities" className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Built for everyday learning</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Facilities &amp; Infrastructure</h2>
          {place.facilities?.length > 0 ? <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{place.facilities.map((facility) => <div key={facility} className="group rounded-xl border border-line bg-paper/60 px-4 py-4 text-sm font-medium text-ink/75 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50"><span className="mr-2 text-cyan-700">◆</span>{facility}</div>)}</div> : <p className="mt-4 text-sm text-ink/50">Facility details will be updated soon.</p>}
        </section>

        <section id="academics" className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
          <h2 className="font-display text-2xl font-semibold text-ink">Academics &amp; Admission</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[['Board', academics.board], ['Curriculum', academics.curriculum], ['Classes', academics.classes], ['Admission', admissions]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="rounded-lg bg-cyan-50/70 p-4"><div className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{label}</div><div className="mt-2 text-sm leading-relaxed text-ink/75">{Array.isArray(value) ? value.join(', ') : value}</div></div>)}
          </div>
          {!academics.board && !academics.curriculum && !academics.classes && !admissions && <p className="mt-4 text-sm text-ink/50">Academic and admission details will be updated soon.</p>}
        </section>

        <section id="reviews" className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7"><ReviewsSection placeId={place._id} /></section>

        <section id="location" className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
          <h2 className="font-display text-2xl font-semibold text-ink">Location</h2>
          <p className="mt-3 flex items-start gap-2 text-[15px] leading-relaxed text-ink/65"><span aria-hidden="true">⌖</span>{place.address}</p>
          <div className="mt-5 overflow-hidden rounded-xl border border-line bg-ink/5">
            <iframe title={`Map showing ${place.name}`} src={mapEmbedUrl} className="h-72 w-full border-0 sm:h-96" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-medium text-cyan-700 hover:underline">Open in Google Maps ↗</a>
        </section>
      </div>
    </div>
  );
}

export default function PlaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleAdminDelete = async () => {
    if (!window.confirm(`Delete "${place.name}" permanently? This cannot be undone.`)) return;

    try {
      await api.delete(`/admin/businesses/${place._id}`);
      navigate('/admin/businesses');
    } catch (err) {
      setError(err.message);
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
  const socialLinks = place.socialLinks || {};
  const academics = place.attributes || {};
  const gallery = place.images || [];
  const isSchoolCategory = ['school', 'schools'].includes((place.category?.slug || '').toLowerCase()) || ['school', 'schools'].includes((place.category?.name || '').toLowerCase());
  const foodBusinessType = resolveFoodBusinessType(place);
  const businessType = place.attributes?.businessProfile?.businessType;
  const isRestaurant = businessType === 'restaurant'
    || (!businessType && !place.attributes?.businessProfile && Boolean(place.attributes?.restaurantProfile))
    || ['restaurant', 'restaurants'].includes((place.subcategory?.slug || place.category?.slug || '').toLowerCase())
    || ['restaurant', 'restaurants'].includes((place.subcategory?.name || place.category?.name || '').toLowerCase());

  if (isSchoolCategory) {
    return (
      <>
        <SchoolDetailLayout
          place={place}
          mapsUrl={mapsUrl}
          socialLinks={socialLinks}
          academics={academics}
          onShare={handleShare}
          onReport={() => setShowReport(true)}
          onDelete={user?.role === 'admin' ? handleAdminDelete : null}
        />
        {showReport && <ReportModal placeId={place._id} onClose={() => setShowReport(false)} />}
      </>
    );
  }

  if (foodBusinessType) return <Navigate to={`/business/${place._id}`} replace />;

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
          {isRestaurant && (
            <Link to={`/business/${place._id}`} className="rounded border border-vermilion bg-vermilion px-4 py-2 text-sm font-medium text-paper hover:bg-vermilion/90">
              Restaurant profile
            </Link>
          )}
          <FavoriteButton placeId={place._id} />
          <button onClick={handleShare} className="rounded border border-line px-4 py-2 text-sm text-ink/70 hover:border-ink/30">
            Share
          </button>
          <button onClick={() => setShowReport(true)} className="rounded border border-line px-4 py-2 text-sm text-ink/70 hover:border-ink/30">
            Report
          </button>
          {user?.role === 'admin' && (
            <button onClick={handleAdminDelete} className="rounded border border-vermilion px-4 py-2 text-sm font-medium text-vermilion hover:bg-vermilion/10">
              Delete listing
            </button>
          )}
        </div>
      </div>

      {place.coverImage && (
        <div className="mt-8 overflow-hidden rounded-xl border border-line bg-ink/5 shadow-sm">
          <img src={place.coverImage} alt={`${place.name} cover`} className="h-56 w-full object-cover sm:h-80" />
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-10">
          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {gallery.map((img, i) => (
                <img key={i} src={img} alt={`${place.name} photo ${i + 1}`} className="h-32 w-full rounded-lg object-cover transition hover:scale-[1.02] sm:h-36" />
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

          {place.facilities?.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Facilities</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {place.facilities.map((facility) => (
                  <div key={facility} className="rounded border border-line bg-white/60 px-3 py-2 text-sm text-ink/70">{facility}</div>
                ))}
              </div>
            </div>
          )}

          {(academics.board || academics.classes || academics.curriculum) && (
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Academics</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {academics.board && <div className="rounded border border-line bg-white/60 p-3"><div className="text-xs uppercase tracking-wide text-ink/45">Curriculum</div><div className="mt-1 text-sm font-medium text-ink">{academics.board}</div></div>}
                {academics.curriculum && <div className="rounded border border-line bg-white/60 p-3"><div className="text-xs uppercase tracking-wide text-ink/45">Curriculum</div><div className="mt-1 text-sm font-medium text-ink">{academics.curriculum}</div></div>}
                {academics.classes && <div className="rounded border border-line bg-white/60 p-3"><div className="text-xs uppercase tracking-wide text-ink/45">Classes</div><div className="mt-1 text-sm font-medium text-ink">{academics.classes}</div></div>}
              </div>
            </div>
          )}

          {place.video && (
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">See the school</h2>
              <a href={place.video} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex rounded bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-light">
                Watch school video
              </a>
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
              {socialLinks.whatsapp && <a href={socialLinks.whatsapp.startsWith('http') ? socialLinks.whatsapp : `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-vermilion hover:underline">WhatsApp</a>}
              {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-vermilion hover:underline">Instagram</a>}
              {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-vermilion hover:underline">Facebook</a>}
            </div>
          </div>

          <EnquiryForm placeId={place._id} />
        </aside>
      </div>

      {showReport && <ReportModal placeId={place._id} onClose={() => setShowReport(false)} />}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FavoriteButton from '../components/FavoriteButton';
import ReviewsSection from '../components/ReviewsSection';
import { resolveFoodBusinessType } from '../components/public/PublicProfileShared';
import BusinessPageLayouts from '../components/BusinessPageLayouts';
import SunriseSchoolPage from '../components/SunriseSchoolPage';
import CollegePage from '../components/CollegePage';
import UniversityPage from '../components/UniversityPage';
import SolarPage from './SolarPage';

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
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.post('/enquiries', { place: placeId, ...form });
      setStatus('sent');
      setForm({ ...form, message: '' });
    } catch (err) {
      console.error('Enquiry submission failed:', err);
      setStatus('error');
      setError(err.message);
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
      {status === 'error' && <p className="text-sm text-vermilion">{error || 'We could not send the enquiry. Please try again.'}</p>}
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
  const [selectedImage, setSelectedImage] = useState(null);
  const website = place.website && (place.website.startsWith('http') ? place.website : `https://${place.website}`);
  const cover = place.coverImage || place.images?.[0];
  const highlights = place.attributes?.highlights || place.attributes?.keyHighlights || place.services || [];
  const admissions = academics.admission || academics.admissions || academics.admissionProcess || academics.eligibility;
  const videoUrl = place.video || place.attributes?.video;
  const mapQuery = place.coordinates?.lat && place.coordinates?.lng
    ? `${place.coordinates.lat},${place.coordinates.lng}`
    : place.address;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const whatsappUrl = socialLinks.whatsapp
    ? (socialLinks.whatsapp.startsWith('http') ? socialLinks.whatsapp : `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`)
    : null;

  return (
    <div className="school-page container-page py-6 sm:py-10">
      <section className="school-hero overflow-hidden rounded-[1.25rem] border border-white/70 bg-white shadow-[0_22px_60px_rgba(16,42,67,0.16)]">
        <div className="relative h-[280px] overflow-hidden bg-[#12395a] sm:h-[390px]">
          {cover ? <img src={cover} alt={`${place.name} cover`} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-[#dbeff3]" />}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,32,58,.88),rgba(10,91,104,.38)_48%,rgba(244,114,73,.58))]" />
          <div className="absolute left-5 top-5 rounded-full border border-[#ffd45a]/80 bg-[#062b4d]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffe18a] shadow-lg backdrop-blur-sm sm:left-7 sm:top-7">{place.category?.name || 'School'} profile</div>
          <div className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto bg-[#071d33]/45 px-4 py-3 backdrop-blur-sm sm:px-6">
            {(place.images?.length ? place.images : cover ? [cover] : []).map((image, index) => (
              <button key={`${image}-${index}`} type="button" onClick={() => setSelectedImage(image)} className="shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-white">
                <img src={image} alt={`${place.name} photo ${index + 1}`} className={`h-11 w-16 rounded-md border-2 object-cover sm:h-14 sm:w-20 ${index === 0 ? 'border-white' : 'border-white/60'}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 px-5 py-5 sm:px-8 sm:py-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e76f51]">Trusted learning community</p>
            <h1 className="mt-2 flex flex-wrap items-center gap-2 font-display text-3xl font-semibold leading-tight text-[#17324d] sm:text-5xl">
              {place.name}
              {place.verified && <span className="rounded-sm bg-[#edf4ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#32724b]">✓ Verified</span>}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink/60">
              <span className="rounded-sm bg-[#fff6df] px-2.5 py-1 text-[#a47b2c]" aria-label={`${place.rating?.average || 0} out of 5 stars`}>{'★'.repeat(Math.round(place.rating?.average || 0))}{'☆'.repeat(5 - Math.round(place.rating?.average || 0))}</span>
              <span className="font-semibold text-[#17324d]">{place.rating?.average || 0}</span>
              <span>({place.rating?.count || 0} reviews)</span>
              <span className="hidden text-ink/35 sm:inline">•</span>
              <span>⌖ {place.address}</span>
            </div>
          </div>
          <div className="[&>div]:gap-2 [&_button]:border-[#d8e4ec] [&_button]:bg-[#f8fbfd] [&_button]:px-3 [&_button]:py-2.5 [&_button]:text-xs [&_button]:font-semibold [&_button]:text-[#31536d] [&_a]:border-[#d8e4ec] [&_a]:bg-[#f8fbfd] [&_a]:px-3 [&_a]:py-2.5 [&_a]:text-xs [&_a]:font-semibold [&_a]:text-[#31536d]">
            <SchoolActionButtons place={place} onShare={onShare} onReport={onReport} onDelete={onDelete} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-[#edf1f3] bg-[#fbfdff] px-5 py-4 sm:px-8">
          {['Walk-in service', 'Online enquiries', 'Verified information'].map((label, index) => <span key={label} className={`rounded-sm px-3 py-1.5 text-[10px] font-bold ${index === 0 ? 'bg-[#eef4f6] text-[#31536d]' : index === 1 ? 'bg-[#fff6df] text-[#a47b2c]' : 'bg-[#edf4ef] text-[#32724b]'}`}>{label}</span>)}
        </div>
      </section>

      <div className="school-stats mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [place.rating?.count || 0, 'Parent reviews', 'bg-[#dff8f1] text-[#087f73]'],
          [place.facilities?.length || 0, 'Facilities', 'bg-[#fff0d0] text-[#a45d08]'],
          [place.images?.length || 0, 'Campus photos', 'bg-[#eee5ff] text-[#7141b5]'],
          [academics.classes || '1-12', 'Classes offered', 'bg-[#dff2ff] text-[#14628e]'],
        ].map(([value, label, tone]) => (
          <div key={label} className={`rounded-xl border border-white/80 px-4 py-4 shadow-[0_8px_20px_rgba(16,42,67,0.06)] ${tone}`}>
            <div className="font-display text-2xl font-semibold">{value}</div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">{label}</div>
          </div>
        ))}
      </div>

      <nav aria-label="School detail sections" className="sticky top-0 z-20 -mx-5 mt-6 overflow-x-auto border-y border-[#bde4df] bg-[#effcf9]/95 px-5 py-3 shadow-sm backdrop-blur sm:static sm:mx-0 sm:rounded-full sm:border sm:px-3">
        <div className="flex min-w-max gap-1 text-sm font-semibold text-[#31536d]">
          {[['#overview', 'Overview'], ['#facilities', 'Facilities'], ['#academics', 'Academics'], ['#reviews', 'Reviews'], ['#location', 'Location']].map(([href, label], index) => <a key={href} href={href} className={`rounded-sm px-4 py-2 transition ${index === 0 ? 'bg-[#17324d] text-white shadow-sm' : 'hover:bg-white hover:text-[#a47b2c]'}`}>{label}</a>)}
        </div>
      </nav>

      <div className="mt-6 flex flex-col gap-5">
        <section id="overview" className="school-section rounded-[1rem] border border-[#cfe6e5] bg-[linear-gradient(135deg,#ffffff_0%,#f2fbfa_100%)] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.06)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47b2c]">Get to know the campus</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Overview</h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#17324d]">A place to learn and grow</h3>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/65">{place.description || 'School information will be updated soon.'}</p>
              {website && <a href={website} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-medium text-cyan-700 hover:underline">Open official website ↗</a>}
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-[#17324d]">Key Highlights</h3>
              {highlights.length > 0 ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {highlights.map((highlight) => <div key={highlight} className="flex items-start gap-2 border-b border-[#e8dfcb] px-1 py-2.5 text-xs font-medium text-ink/70"><span className="mt-0.5 text-[#a47b2c]">●</span>{highlight}</div>)}
                </div>
              ) : <p className="mt-3 text-sm text-ink/50">Highlights will be updated soon.</p>}
            </div>
          </div>
          <div className="mt-7 rounded-[1rem] border border-[#f0d8b0] bg-[linear-gradient(135deg,#fff8e9,#fff1eb)] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a50c9]">Watch video</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ink">Video Tour</h3>
              </div>
              <span className="text-[10px] text-ink/40">{place.name}</span>
            </div>
            <div className="relative mt-3 h-44 overflow-hidden rounded-xl bg-[#dbeff3] shadow-inner sm:h-56">
              {videoUrl?.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? <video src={videoUrl} controls className="h-full w-full object-cover" /> : cover && <img src={cover} alt={`${place.name} video preview`} className="h-full w-full object-cover" />}
              <div className="absolute inset-0 bg-[#17324d]/20" />
              {videoUrl ? (
                <a href={videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${place.name} video`} className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#7a3fd0] text-xl text-white shadow-lg transition hover:scale-105 hover:bg-[#6733b5]">▶</a>
              ) : (
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-ink/55">Video coming soon</span>
              )}
            </div>
            {videoUrl && <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-xs font-semibold text-[#6941af] hover:underline">Watch video ↗</a>}
          </div>
          {(place.phone || place.email || whatsappUrl || socialLinks.instagram || socialLinks.facebook || website) && (
            <div className="mt-8 border-t border-line pt-6">
              <h3 className="font-display text-xl font-semibold text-ink">Contact the school</h3>
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

        <section className="school-section rounded-[1rem] border border-[#ddd2f2] bg-[linear-gradient(135deg,#faf8ff,#f1f8ff)] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6950a8]">At a glance</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">School Quick Facts</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[
              ['Board', academics.board], ['Established', academics.establishedYear], ['Classes', academics.classes], ['Gender', academics.gender],
              ['Medium', academics.medium], ['Type', academics.type], ['Capacity', academics.studentCapacity], ['Ratio', academics.studentTeacherRatio],
            ].filter(([, value]) => value).map(([label, value]) => <div key={label} className="rounded-xl border border-white bg-white/80 p-4 shadow-sm"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6950a8]">{label}</div><div className="mt-2 text-sm font-semibold text-[#17324d]">{value}</div></div>)}
          </div>
        </section>

        {(academics.principalMessage || academics.vision || academics.mission) && <section className="school-section rounded-[1rem] border border-[#cfe6e5] bg-[linear-gradient(135deg,#f1fbf8,#ffffff)] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#168b9a]">The people and purpose behind the campus</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Our story</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[["Principal's message", academics.principalMessage], ['Vision', academics.vision], ['Mission', academics.mission]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="rounded-xl border border-[#d6ebe8] bg-white p-5"><h3 className="font-display text-xl font-semibold text-[#17324d]">{label}</h3><p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/65">{value}</p></div>)}
          </div>
        </section>}

        {academics.faculty?.length > 0 && <section className="school-section rounded-[1rem] border border-[#cbdde9] bg-[#f1f8fc] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#31536d]">The people who make learning happen</p><h2 className="mt-2 font-display text-3xl font-semibold text-ink">Faculty &amp; Staff</h2><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{academics.faculty.map((member) => <div key={member} className="rounded-xl border border-white bg-white p-4 text-sm font-semibold text-ink/75 shadow-sm"><span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f2f8] text-[#31536d]">✦</span>{member}</div>)}</div></section>}

        {academics.achievements?.length > 0 && <section className="school-section rounded-[1rem] border border-[#f0d8b0] bg-[linear-gradient(135deg,#fffaf2,#fff1eb)] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47b2c]">Moments worth celebrating</p><h2 className="mt-2 font-display text-3xl font-semibold text-ink">Achievements</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{academics.achievements.map((item) => <div key={item} className="rounded-xl border border-[#f0d8b0] bg-white/80 p-4 text-sm font-semibold text-ink/75"><span className="mr-2 text-xl text-[#c58a22]">★</span>{item}</div>)}</div></section>}

        {academics.events?.length > 0 && <section className="school-section rounded-[1rem] border border-[#cfe6e5] bg-[#f1fbf8] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#168b9a]">Life beyond the classroom</p><h2 className="mt-2 font-display text-3xl font-semibold text-ink">Events &amp; Activities</h2><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{academics.events.map((event) => <div key={event} className="rounded-xl border border-[#d6ebe8] bg-white p-4 text-sm font-semibold text-ink/75"><div className="mb-3 text-xs font-bold uppercase tracking-wide text-[#168b9a]">Campus calendar</div>{event}</div>)}</div></section>}

        {(academics.admissionProcess || academics.eligibility || academics.feeInformation) && <section className="school-section rounded-[1rem] border border-[#e8dfcb] bg-[#fffaf2] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47b2c]">Plan the next step</p><h2 className="mt-2 font-display text-3xl font-semibold text-ink">Admissions</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{[['Admission process', academics.admissionProcess], ['Eligibility', academics.eligibility], ['Fee information', academics.feeInformation]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="rounded-xl border border-[#f0d8b0] bg-white p-5"><h3 className="font-display text-xl font-semibold text-[#17324d]">{label}</h3><p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/65">{value}</p></div>)}</div></section>}

        <section id="facilities" className="school-section rounded-[1rem] border border-[#f0d8b0] bg-[linear-gradient(135deg,#fffaf2,#fff3ed)] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47b2c]">Built for everyday learning</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Facilities &amp; Infrastructure</h2>
          {place.facilities?.length > 0 ? <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{place.facilities.map((facility) => <div key={facility} className="group rounded-md border border-[#e8dfcb] bg-white px-4 py-4 text-sm font-semibold text-ink/75 transition hover:-translate-y-1 hover:border-[#c9a95e] hover:shadow-md"><span className="mr-2 text-[#a47b2c]">✦</span>{facility}</div>)}</div> : <p className="mt-4 text-sm text-ink/50">Facility details will be updated soon.</p>}
        </section>

        <section id="academics" className="school-section rounded-[1rem] border border-[#cbdde9] bg-[linear-gradient(135deg,#f1f8fc,#eef7f5)] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47b2c]">The learning journey</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Academics &amp; Admission</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[['Board', academics.board], ['Curriculum', academics.curriculum], ['Classes', academics.classes], ['School Type', academics.type], ['Student Type', academics.gender], ['Admission', admissions]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="rounded-md border border-[#e8dfcb] bg-white p-4"><div className="text-xs font-bold uppercase tracking-wide text-[#a47b2c]">{label}</div><div className="mt-2 text-sm font-semibold leading-relaxed text-ink/75">{Array.isArray(value) ? value.join(', ') : value}</div></div>)}
          </div>
          {!academics.board && !academics.curriculum && !academics.classes && !academics.type && !academics.gender && !admissions && <p className="mt-4 text-sm text-ink/50">Academic and admission details will be updated soon.</p>}
        </section>

        <section id="reviews" className="school-section rounded-[1rem] border border-[#ddd2f2] bg-[linear-gradient(135deg,#faf8ff,#f4f1ff)] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-8"><ReviewsSection placeId={place._id} /></section>

        <section id="location" className="school-section rounded-[1rem] border border-[#cfe6e5] bg-[linear-gradient(135deg,#f1fbf8,#edf7fc)] p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#168b9a]">Find the campus</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Location</h2>
          <p className="mt-3 flex items-start gap-2 text-[15px] leading-relaxed text-ink/65"><span aria-hidden="true">⌖</span>{place.address}</p>
          <div className="mt-5 overflow-hidden rounded-xl border border-line bg-ink/5">
            <iframe title={`Map showing ${place.name}`} src={mapEmbedUrl} className="h-72 w-full border-0 sm:h-96" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-medium text-cyan-700 hover:underline">Open in Google Maps ↗</a>
        </section>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071d33]/90 p-4" role="dialog" aria-modal="true" onClick={() => setSelectedImage(null)}>
          <button type="button" onClick={() => setSelectedImage(null)} className="absolute right-5 top-5 text-3xl text-white" aria-label="Close image">×</button>
          <img src={selectedImage} alt={`${place.name} enlarged`} className="max-h-[90vh] max-w-full rounded-md object-contain" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
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
  const rawAcademics = place.attributes || {};
  const academics = {
    ...rawAcademics,
    principalMessage: rawAcademics.principalMessage || rawAcademics.principal?.message,
    // Keep the complete entries. The school layout uses their descriptions,
    // dates and uploaded images in addition to their names.
    faculty: (rawAcademics.faculty || []).filter((member) => typeof member === 'string' || member?.name),
    achievements: (rawAcademics.achievements || []).filter((item) => typeof item === 'string' || item?.title || item?.name),
    events: (rawAcademics.events || rawAcademics.schoolEvents || []).filter((item) => typeof item === 'string' || item?.name || item?.title),
  };
  if ((!place.facilities || place.facilities.length === 0) && rawAcademics.schoolFacilities?.length) {
    place.facilities = rawAcademics.schoolFacilities.map((facility) => facility.name).filter(Boolean);
  }
  const gallery = place.images || [];
  const pageType = place.pageType === 'dynamic' ? 'dynamic' : 'static';
  const isSchoolCategory = ['school', 'schools'].includes((place.category?.slug || '').toLowerCase()) || ['school', 'schools'].includes((place.category?.name || '').toLowerCase());
  const foodBusinessType = resolveFoodBusinessType(place);
  const businessType = place.attributes?.businessProfile?.businessType;
  const isRestaurant = businessType === 'restaurant'
    || (!businessType && !place.attributes?.businessProfile && Boolean(place.attributes?.restaurantProfile))
    || ['restaurant', 'restaurants'].includes((place.subcategory?.slug || place.category?.slug || '').toLowerCase())
    || ['restaurant', 'restaurants'].includes((place.subcategory?.name || place.category?.name || '').toLowerCase());
  const isCollegeCategory = ['college', 'colleges'].includes((place.category?.slug || '').toLowerCase()) || ['college', 'colleges'].includes((place.category?.name || '').toLowerCase());
  const isUniversityCategory = ['university', 'universities'].includes((place.category?.slug || '').toLowerCase()) || ['university', 'universities'].includes((place.category?.name || '').toLowerCase());
  const isSolarCategory = ['solar'].includes((place.category?.slug || '').toLowerCase()) || ['solar'].includes((place.category?.name || '').toLowerCase());

  // School listings always use the full school website layout so their
  // submitted academic, media, admissions, and campus sections are visible.
  if (isSchoolCategory) {
    return (
      <>
        <SunriseSchoolPage
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
  if (isCollegeCategory) {
    return <CollegePage place={place} mapsUrl={mapsUrl} onShare={handleShare} onReport={() => setShowReport(true)} />;
  }

  if (isUniversityCategory) {
    return <UniversityPage place={place} mapsUrl={mapsUrl} onShare={handleShare} onReport={() => setShowReport(true)} />;
  }

  if (isSolarCategory) {
    return <SolarPage place={place} />;
  }

  if (pageType === 'dynamic') {
    return (
      <>
        <BusinessPageLayouts
          place={place}
          mapsUrl={mapsUrl}
          onShare={handleShare}
          onReport={() => setShowReport(true)}
          pageType={pageType}
        />
        {showReport && <ReportModal placeId={place._id} onClose={() => setShowReport(false)} />}
      </>
    );
  }

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

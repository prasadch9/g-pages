import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FavoriteButton from '../components/FavoriteButton';
import ReviewsSection from '../components/ReviewsSection';
import WeddingBusinessWebsite from '../components/public/WeddingBusinessWebsite';
import PropertyBusinessWebsite from '../components/public/PropertyBusinessWebsite';
import { resolveFoodBusinessType, resolvePropertyBusinessType, resolveWeddingBusinessType, PublicVideoCard } from '../components/public/PublicProfileShared';
import {
  getLocationText,
  getWebsiteUrl,
  getWhatsAppUrl,
  isHealthcareBusiness,
  normalizeList,
} from '../utils/healthcare';

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

function HealthcareDetailLayout({ place, mapsUrl, onShare, onReport, onDelete }) {
  const logo = place.logo || null;
  const cover = place.coverImage || place.images?.[0] || null;
  const gallery = (place.images || []).slice(0, 10);
  const videos = (place.attributes?.businessProfile?.common?.videos || place.attributes?.videos || []).filter(Boolean);
  const socialLinks = place.socialLinks || {};
  const website = getWebsiteUrl(place.website);
  const whatsappUrl = getWhatsAppUrl(socialLinks.whatsapp || place.phone);
  const services = normalizeList(place.services || []);
  const departments = normalizeList(place.attributes?.departments || place.departments || []);
  const facilities = normalizeList(place.facilities || []);
  const description = place.description || '';
  const siteLinks = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#about' },
    { label: 'Gallery', href: '#gallery' },
    ...(videos.length > 0 ? [{ label: 'Videos', href: '#videos' }] : []),
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];
  const businessHours = Array.isArray(place.workingHours) ? place.workingHours : [];
  const today = new Date().getDay();
  const weekdayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayKey = weekdayMap[today];
  const todayHours = businessHours.find((rule) => rule.day === todayKey);
  const isOpen = todayHours ? !todayHours.closed && todayHours.open && todayHours.close : false;
  const ratingValue = typeof place.rating?.average === 'number' ? place.rating.average : null;
  const reviewsCount = typeof place.rating?.count === 'number' ? place.rating.count : 0;
  const emergencyAvailable = Boolean(place.attributes?.emergencyAvailable ?? place.emergencyAvailable);
  const emergencyPhone = place.attributes?.emergencyPhone || place.emergencyPhone || null;
  const profileDescription = description.length > 260 ? `${description.slice(0, 260).trim()}…` : description;
  const locationText = getLocationText(place.address || place.location?.city?.name || '');

  return (
    <div className="bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
              {logo ? (
                <img src={logo} alt={`${place.name} logo`} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl text-sky-700">✚</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-slate-900">{place.name}</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            {siteLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-slate-600 transition hover:text-sky-700">{link.label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button type="button" aria-label="Search hospital" className="rounded-full border border-slate-200 p-2 text-slate-600 hover:border-sky-200 hover:text-sky-700">⌕</button>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">{getLocationText(place.location?.city?.name || place.city || place.location?.district?.name || '') || getLocationText(place.address)}</span>
            <button type="button" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700">Book Appointment</button>
          </div>
        </div>
      </header>

      <main className="pb-24">
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <div className="relative h-[420px] sm:h-[500px]">
              {cover ? (
                <img src={cover} alt={`${place.name} cover`} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#e0f2fe,#dbeafe,#eff6ff)]" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,47,73,0.78),rgba(8,47,73,0.25),rgba(15,23,42,0.15))]" />
              <div className="absolute inset-0 flex items-end">
                <div className="grid w-full gap-6 px-5 pb-6 sm:px-8 sm:pb-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                  <div className="max-w-2xl text-white">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/60 bg-white/10 backdrop-blur-sm">
                        {logo ? <img src={logo} alt={`${place.name} logo`} className="h-full w-full object-cover" /> : <span className="text-2xl">✚</span>}
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-sky-100">{place.category?.name || place.subcategory?.name || 'Healthcare'}</p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{place.name}</h1>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-100">
                      {ratingValue !== null && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                          <span className="text-yellow-300">★</span>
                          <span>{ratingValue.toFixed(1)}</span>
                          <span>({reviewsCount} reviews)</span>
                        </span>
                      )}
                      {todayHours && (
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${isOpen ? 'border-emerald-300/60 bg-emerald-500/20 text-emerald-100' : 'border-red-300/60 bg-red-500/20 text-red-100'}`}>
                          <span className="h-2 w-2 rounded-full bg-current" />
                          {isOpen ? 'Open now' : 'Closed'}
                        </span>
                      )}
                    </div>

                    {(description || locationText) && (
                      <div className="space-y-3 text-sm leading-relaxed text-slate-100/90">
                        {description && <p>{profileDescription || description}</p>}
                        {locationText && <p className="flex items-start gap-2"><span>📍</span><span>{locationText}</span></p>}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3">
                    {gallery.slice(0, 2).map((image, index) => (
                      <div key={`${image}-${index}`} className="h-28 overflow-hidden rounded-2xl border border-white/20 bg-white/5 shadow-lg sm:h-36">
                        <img src={image} alt={`${place.name} ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    ))}
                    {gallery.length === 0 && (
                      <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-white/40 bg-white/5 text-sm text-slate-100/80 sm:h-36">
                        Hospital gallery will appear here when added.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-2">
            {place.phone && (
              <a href={`tel:${place.phone}`} className="rounded-full bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-800">Call</a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600">WhatsApp</a>
            )}
            {place.address && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-900">Directions</a>
            )}
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-sky-200 hover:text-sky-700">Website</a>
            )}
            <button type="button" onClick={onShare} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-sky-200 hover:text-sky-700">Share</button>
            <div className="inline-flex rounded-full border border-slate-200 bg-white shadow-sm">
              <FavoriteButton placeId={place._id} />
            </div>
            <button type="button" onClick={onReport} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-red-200 hover:text-red-700">Report</button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
            {place.name && <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Hospital Name</p><p className="mt-3 text-base font-semibold text-slate-900">{place.name}</p></div>}
            {place.category?.name || place.subcategory?.name ? <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Category</p><p className="mt-3 text-base font-semibold text-slate-900">{place.subcategory?.name || place.category?.name}</p></div> : null}
            {locationText ? <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Location</p><p className="mt-3 text-base font-semibold text-slate-900">{locationText}</p></div> : null}
            {ratingValue !== null ? <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Rating</p><p className="mt-3 text-base font-semibold text-slate-900">{ratingValue.toFixed(1)} / 5</p></div> : null}
            {reviewsCount > 0 ? <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Reviews</p><p className="mt-3 text-base font-semibold text-slate-900">{reviewsCount}</p></div> : null}
            {todayHours && <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-[0.12em] text-slate-500">Status</p><p className={`mt-3 text-base font-semibold ${isOpen ? 'text-emerald-600' : 'text-red-600'}`}>{isOpen ? 'Open' : 'Closed'}</p></div>}
            {emergencyAvailable && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-red-600">Emergency</p>
                <p className="mt-3 text-base font-semibold text-red-700">Available {emergencyPhone ? `• ${emergencyPhone}` : ''}</p>
              </div>
            )}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">About Us</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Trusted care, built around your wellbeing</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-600">{description || 'Hospital information will be updated soon.'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Contact</p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {place.phone && <p>📞 {place.phone}</p>}
                  {place.email && <p>✉️ {place.email}</p>}
                  {place.address && <p>📍 {place.address}</p>}
                  {website && <p>🌐 {website}</p>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {services.length > 0 && (
          <section id="services" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Specialised Care</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Medical Services</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {services.map((service, index) => (
                <div key={`${service}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-xl text-sky-700">{['🚑', '🩺', 'ICU', '🧪', '💊', '🧬', '🔪', '🤰'][index % 8]}</div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{service}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">Available at this hospital with patient-focused care and expert support.</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {departments.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Clinical Expertise</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Departments &amp; Specialities</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {departments.map((department, index) => (
                <div key={`${department}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <p className="text-base font-semibold text-slate-900">{department}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section id="gallery" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Hospital Gallery</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Hospital Gallery</h2>
              </div>
              {gallery.length > 0 && <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">View All Photos</button>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.slice(0, 10).map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                  <img src={image} alt={`${place.name} photo ${index + 1}`} className="h-56 w-full object-cover transition duration-300 hover:scale-[1.02]" loading="lazy" />
                </div>
              ))}
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section id="videos" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Video Gallery</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Hospital &amp; Healthcare Videos</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, index) => (
                <PublicVideoCard key={`${video.url || video}-${index}`} video={typeof video === 'string' ? { url: video } : video} />
              ))}
            </div>
          </section>
        )}

        {facilities.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Infrastructure</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Facilities &amp; Infrastructure</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {facilities.map((facility, index) => (
                <div key={`${facility}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700">{['🚑', 'ICU', '🏥', '🚐', '🅿️', '♿', '🪑', '☕'][index % 8]}</div>
                  <h3 className="text-lg font-semibold text-slate-900">{facility}</h3>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <ReviewsSection placeId={place._id} />
            </div>
            <div id="contact" className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Location &amp; Contact</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Location &amp; Contact</h2>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                {place.address && <p>📍 {place.address}</p>}
                {place.phone && <p>📞 {place.phone}</p>}
                {place.email && <p>✉️ {place.email}</p>}
                {website && <p>🌐 {website}</p>}
                {businessHours.length > 0 && <p>🕒 {businessHours.map((hour) => `${hour.day?.toUpperCase()}: ${hour.closed ? 'Closed' : `${hour.open}–${hour.close}`}`).join(' | ')}</p>}
              </div>
              {place.address && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <iframe title={`${place.name} map`} src={`https://www.google.com/maps?q=${encodeURIComponent(place.address)}&output=embed`} className="h-64 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                {place.address && <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-800">View on Google Maps</a>}
                {place.address && <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-sky-200 hover:text-sky-700">Get Directions</a>}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-900 text-slate-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                {logo ? <img src={logo} alt={`${place.name} logo`} className="h-full w-full object-cover" /> : <span className="text-xl text-sky-300">✚</span>}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{place.name}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">{description || 'Healthcare services and patient support.'}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Quick Links</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              {siteLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:text-white">{link.label}</a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Contact</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              {place.phone && <a href={`tel:${place.phone}`} className="hover:text-white">{place.phone}</a>}
              {place.email && <a href={`mailto:${place.email}`} className="hover:text-white">{place.email}</a>}
              {website && <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-white">{website}</a>}
              {businessHours.length > 0 && <span>{businessHours.filter((hour) => hour.day).slice(0, 2).map((hour) => `${hour.day.toUpperCase()}: ${hour.closed ? 'Closed' : `${hour.open}–${hour.close}`}`).join(' • ')}</span>}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Follow Us</h3>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
              {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-700 px-3 py-2 hover:border-sky-500 hover:text-white">Facebook</a>}
              {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-700 px-3 py-2 hover:border-sky-500 hover:text-white">Instagram</a>}
              {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-700 px-3 py-2 hover:border-sky-500 hover:text-white">YouTube</a>}
              {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-700 px-3 py-2 hover:border-sky-500 hover:text-white">LinkedIn</a>}
              {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-700 px-3 py-2 hover:border-sky-500 hover:text-white">X/Twitter</a>}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-xs text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p>© {new Date().getFullYear()} {place.name}. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
              <a href="#" className="hover:text-white">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-4 lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              {logo ? <img src={logo} alt={`${place.name} logo`} className="h-full w-full object-cover" /> : <span className="text-xs text-sky-700">✚</span>}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900">{place.name}</p>
              {ratingValue !== null && <p className="text-[10px] text-slate-500">★ {ratingValue.toFixed(1)}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {place.phone && <a href={`tel:${place.phone}`} className="rounded-full bg-sky-600 px-3 py-2 text-xs font-semibold text-white">Call</a>}
            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white">WhatsApp</a>}
            {place.address && <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-slate-800 px-3 py-2 text-xs font-semibold text-white">Map</a>}
          </div>
        </div>
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

  useEffect(() => {
    const active = Boolean(place && (isHealthcareBusiness(place) || resolveWeddingBusinessType(place) || resolvePropertyBusinessType(place)));
    window.dispatchEvent(new CustomEvent('gpages:healthcare-detail', { detail: { active } }));
    return () => {
      window.dispatchEvent(new CustomEvent('gpages:healthcare-detail', { detail: { active: false } }));
    };
  }, [place]);

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
  const weddingBusinessType = resolveWeddingBusinessType(place);
  const propertyBusinessType = resolvePropertyBusinessType(place);
  const businessType = place.attributes?.businessProfile?.businessType;
  const isRestaurant = businessType === 'restaurant'
    || (!businessType && !place.attributes?.businessProfile && Boolean(place.attributes?.restaurantProfile))
    || ['restaurant', 'restaurants'].includes((place.subcategory?.slug || place.category?.slug || '').toLowerCase())
    || ['restaurant', 'restaurants'].includes((place.subcategory?.name || place.category?.name || '').toLowerCase());

  if (isHealthcareBusiness(place)) {
    return (
      <>
        <HealthcareDetailLayout
          place={place}
          mapsUrl={mapsUrl}
          onShare={handleShare}
          onReport={() => setShowReport(true)}
          onDelete={user?.role === 'admin' ? handleAdminDelete : null}
        />
        {showReport && <ReportModal placeId={place._id} onClose={() => setShowReport(false)} />}
      </>
    );
  }

  if (weddingBusinessType) {
    return <WeddingBusinessWebsite place={place} weddingType={weddingBusinessType} />;
  }

  if (propertyBusinessType) {
    return <PropertyBusinessWebsite place={place} propertyType={propertyBusinessType} />;
  }

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

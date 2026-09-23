import React, { useState } from 'react';
import FavoriteButton from './FavoriteButton';
import ReviewsSection from './ReviewsSection';
import { getCategoryModules } from '../data/businessPageConfig';

const MODULE_LABELS = {
  portfolio: 'Portfolio',
  albums: 'Albums',
  videos: 'Videos',
  testimonials: 'Testimonials',
  offers: 'Offers',
  events: 'Events',
  menu: 'Menu & Signature Items',
  courses: 'Courses & Programs',
  departments: 'Departments',
  doctors: 'Doctors & Specialists',
  facilities: 'Facilities',
  services: 'Services',
  products: 'Products',
  projects: 'Projects',
  fleet: 'Fleet & Service Areas',
  artworks: 'Artworks & Collections',
};

function normaliseUrl(value) {
  if (!value) return null;
  return value.startsWith('http') ? value : `https://${value}`;
}

function moduleKey(value) {
  return String(value || '').toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ContactLinks({ place }) {
  const links = [
    place.phone && [`tel:${place.phone}`, 'Call', '☎'],
    place.email && [`mailto:${place.email}`, 'Email', '✉'],
    place.socialLinks?.whatsapp && [normaliseUrl(place.socialLinks.whatsapp), 'WhatsApp', '◉'],
    place.socialLinks?.facebook && [normaliseUrl(place.socialLinks.facebook), 'Facebook', 'f'],
    place.socialLinks?.instagram && [normaliseUrl(place.socialLinks.instagram), 'Instagram', '◎'],
    place.website && [normaliseUrl(place.website), 'Official website', '↗'],
  ].filter(Boolean);

  if (!links.length) return <p className="text-sm text-ink/45">Contact details will be added soon.</p>;
  return <div className="grid gap-2 sm:grid-cols-2">{links.map(([href, label, icon]) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink/70 hover:border-[#a47b2c] hover:text-ink"><span className="text-[#a47b2c]">{icon}</span>{label}</a>)}</div>;
}

function MediaGallery({ place }) {
  const [selected, setSelected] = useState(null);
  const images = place.images || [];
  if (!images.length) return <div className="rounded-xl border border-dashed border-line bg-white/60 p-8 text-center text-sm text-ink/45">No photos yet.</div>;
  return <>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{images.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => setSelected(image)} className="group overflow-hidden rounded-xl border border-line bg-white text-left"><img src={image} alt={`${place.name} photo ${index + 1}`} loading="lazy" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" /></button>)}</div>
    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071d33]/90 p-4" role="dialog" aria-modal="true" onClick={() => setSelected(null)}><button type="button" className="absolute right-5 top-5 text-3xl text-white" onClick={() => setSelected(null)} aria-label="Close image">×</button><img src={selected} alt={`${place.name} enlarged`} className="max-h-[90vh] max-w-full rounded-lg object-contain" onClick={(event) => event.stopPropagation()} /></div>}
  </>;
}

function ModuleSection({ module, place }) {
  const label = MODULE_LABELS[module] || module.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
  const values = place.attributes?.[module] || place[module];
  if (!values?.length && typeof values !== 'string') return null;
  const items = Array.isArray(values) ? values : [values];
  return <section className="rounded-xl border border-[#e8dfcb] bg-white p-5 shadow-sm sm:p-6"><h2 className="font-display text-2xl font-semibold text-ink">{label}</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{items.map((item, index) => { const details = typeof item === 'object' ? item : null; return <div key={`${details?.name || item}-${index}`} className="rounded-lg bg-[#fff8e9] px-3 py-3 text-sm text-ink/70">{details ? <><p className="font-semibold text-ink">{details.name || details.title || 'Details'}</p>{details.duration && <p className="mt-1">Duration: {details.duration}</p>}{details.type && <p className="mt-1">Type: {details.type}</p>}{details.medium && <p className="mt-1">Medium: {details.medium}</p>}{details.subjects && <p className="mt-1">Subjects: {details.subjects}</p>}{details.eligibility && <p className="mt-1">Eligibility: {details.eligibility}</p>}{details.fee && <p className="mt-1">Fee: {details.fee}</p>}{details.description && <p className="mt-1">{details.description}</p>}</> : item}</div>; })}</div></section>;
}

function SharedHeader({ place, dynamic, onShare, onReport }) {
  const cover = place.coverImage || place.images?.[0];
  return <section className={`overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(16,42,67,0.12)] ${dynamic ? 'ring-1 ring-[#e8dfcb]' : ''}`}>
    <div className="relative h-56 overflow-hidden bg-[#17324d] sm:h-80">{cover && <img src={cover} alt={`${place.name} cover`} className="h-full w-full object-cover" />}<div className="absolute inset-0 bg-gradient-to-t from-[#071d33]/90 via-[#071d33]/15 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f5d98d]">{place.subcategory || place.category?.name || 'Business'}</p><div className="mt-2 flex items-center gap-3">{place.logo && <img src={place.logo} alt={`${place.name} logo`} className="h-12 w-12 rounded-lg bg-white object-contain p-1" />}<h1 className="font-display text-3xl font-semibold sm:text-5xl">{place.name}</h1></div><p className="mt-2 text-sm text-white/75">⌖ {place.address}</p></div></div>
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5"><div className="flex items-center gap-2 text-sm"><span className="text-[#a47b2c]">{'★'.repeat(Math.round(place.rating?.average || 0))}</span><span className="text-ink/55">{place.rating?.average || 0} ({place.rating?.count || 0} reviews)</span>{place.verified && <span className="rounded-sm bg-[#edf4ef] px-2 py-1 text-xs font-semibold text-[#32724b]">Verified</span>}</div><div className="flex gap-2"><FavoriteButton placeId={place._id} /><button type="button" onClick={onShare} className="rounded border border-line px-3 py-2 text-xs text-ink/65">Share</button><button type="button" onClick={onReport} className="rounded border border-line px-3 py-2 text-xs text-ink/65">Report</button></div></div>
  </section>;
}

export default function BusinessPageLayouts({ place, mapsUrl, onShare, onReport, pageType = 'static' }) {
  const dynamic = pageType === 'dynamic';
  const modules = getCategoryModules(moduleKey(place.subcategory || place.category?.slug), pageType);
  return <div className="container-page py-8 sm:py-10"><SharedHeader place={place} dynamic={dynamic} onShare={onShare} onReport={onReport} /><div className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]"><main className="flex flex-col gap-5"><section className="rounded-xl border border-[#cfe6e5] bg-[#f2fbfa] p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47b2c]">About this business</p><h2 className="mt-2 font-display text-3xl font-semibold text-ink">{dynamic ? 'A closer look' : 'Overview'}</h2><p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink/65">{place.description || 'Business information will be added soon.'}</p></section>{place.services?.length > 0 && <section className="rounded-xl border border-[#f0d8b0] bg-[#fffaf2] p-5 sm:p-7"><h2 className="font-display text-2xl font-semibold text-ink">Services</h2><div className="mt-4 flex flex-wrap gap-2">{place.services.map((service) => <span key={service} className="rounded-full bg-white px-3 py-2 text-sm text-ink/70 shadow-sm">{service}</span>)}</div></section>}{dynamic && modules.filter((module) => !['hero', 'about', 'services', 'gallery', 'location', 'hours', 'socialMedia', 'website'].includes(module)).map((module) => <ModuleSection key={module} module={module} place={place} />)}<section className="rounded-xl border border-[#ddd2f2] bg-[#faf8ff] p-5 sm:p-7"><h2 className="font-display text-2xl font-semibold text-ink">Gallery</h2><div className="mt-4"><MediaGallery place={place} /></div></section><section className="rounded-xl border border-line bg-white p-5 sm:p-7"><ReviewsSection placeId={place._id} /></section></main><aside className="flex flex-col gap-5"><section className="rounded-xl border border-[#e8dfcb] bg-white p-5 shadow-sm"><h2 className="font-display text-xl font-semibold text-ink">Contact</h2><div className="mt-4"><ContactLinks place={place} /></div><a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex w-full justify-center rounded-lg bg-[#17324d] px-4 py-3 text-sm font-semibold text-white">Get directions</a></section><section className="overflow-hidden rounded-xl border border-[#cfe6e5] bg-[#f1fbf8] p-2"><iframe title={`Map showing ${place.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(place.address)}&output=embed`} className="h-64 w-full rounded-lg border-0" loading="lazy" /></section></aside></div></div>;
}

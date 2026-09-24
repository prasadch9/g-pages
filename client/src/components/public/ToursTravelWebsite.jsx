import React, { useMemo, useState } from 'react';
import ReviewsSection from '../ReviewsSection';
import { getProfileData, ImageFrame, PublicVideoCard, safeUrl } from './PublicProfileShared';
import { getWhatsAppUrl } from '../../utils/healthcare';
import api from '../../services/api';

const iconMap = {
  'Tour Packages': '✦',
  'Family Trips': '⌂',
  'Honeymoon Trips': '♡',
  'Group Tours': '◈',
  'Corporate Trips': '▣',
  'Bus / Car Booking': '▰',
  'Flight Booking': '✈',
  'Hotel Booking': '⌂',
  'Airport Pickup': '↗',
  'Travel Guide': '✧',
  'Comfortable Vehicles': '▰',
  'Experienced Drivers': '◎',
  '24/7 Support': '◷',
  'Safe Travel': '✓',
  'Easy Booking': '↗',
  'Experienced Guides': '✧',
  'Customized Packages': '✦',
};

const defaultServices = ['Tour Packages', 'Family Trips', 'Group Tours', 'Hotel Booking', 'Airport Pickup', 'Travel Guide'];
const defaultFacilities = ['Comfortable Vehicles', 'Experienced Drivers', '24/7 Support', 'Safe Travel', 'Easy Booking', 'Customized Packages'];
const list = (value) => Array.isArray(value) ? value.filter(Boolean) : String(value || '').split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
const first = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');
const actionClass = 'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-lg';
const anchor = (label) => `#${label.toLowerCase().replace(/[^a-z]+/g, '-')}`;

function ImagePlaceholder({ label, className = '' }) {
  return <div className={`grid h-full w-full place-items-center bg-[linear-gradient(135deg,#dbe8ef,#8aa7b5)] p-6 text-center text-[#102a43] ${className}`}><div><span className="text-4xl">✦</span><p className="mt-2 text-xs font-bold uppercase tracking-[0.18em]">{label}</p><p className="mt-1 text-xs opacity-70">Upload an image from the business editor</p></div></div>;
}

function Media({ src, alt, label, className = '', eager = false }) {
  return src ? <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} className={`h-full w-full object-cover ${className}`} /> : <ImagePlaceholder label={label} className={className} />;
}

function parseItems(value, fallback = []) {
  if (Array.isArray(value)) return value;
  const values = list(value);
  return values.length ? values.map((name) => ({ name })) : fallback.map((name) => ({ name }));
}

function SocialActions({ label }) {
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const share = async () => {
    if (navigator.share) await navigator.share({ title: label, url: window.location.href });
    else { await navigator.clipboard?.writeText(window.location.href); setShared(true); }
  };
  return <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-[#557180]"><button type="button" onClick={() => setLiked((value) => !value)} className={`rounded-full border px-2.5 py-1.5 ${liked ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-[#d9e5e8] bg-white'}`}>♥ {liked ? 'Liked' : 'Like'}</button><button type="button" onClick={share} className="rounded-full border border-[#d9e5e8] bg-white px-2.5 py-1.5">↗ {shared ? 'Copied' : 'Share'}</button><a href="#contact" className="rounded-full border border-[#d9e5e8] bg-white px-2.5 py-1.5">💬 Comment</a><a href="#contact" className="rounded-full border border-[#d9e5e8] bg-white px-2.5 py-1.5">⚑ Report</a></div>;
}

function FloatingActions({ phone, whatsapp, social }) {
  const call = phone ? `tel:${String(phone).replace(/\s/g, '')}` : '#contact';
  const instagram = safeUrl(social.instagram);
  return <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 md:flex">
    <a href={whatsapp || '#contact'} target={whatsapp ? '_blank' : undefined} rel="noreferrer" title="WhatsApp" className="grid h-11 w-11 place-items-center rounded-full bg-[#1d9b63] text-lg text-white shadow-lg">◉</a>
    <a href="#contact" title="Live chat" className="grid h-11 w-11 place-items-center rounded-full bg-[#e3aa42] text-lg text-[#102a43] shadow-lg">⌁</a>
    {instagram && <a href={instagram} target="_blank" rel="noreferrer" title="Instagram" className="grid h-11 w-11 place-items-center rounded-full bg-[#102a43] text-sm font-bold text-white shadow-lg">IG</a>}
    {instagram && <a href={instagram} target="_blank" rel="noreferrer" title="Instagram Reels" className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-[#e3aa42] text-sm font-bold text-[#102a43] shadow-lg">R</a>}
    <a href={call} title="Call" className="grid h-11 w-11 place-items-center rounded-full bg-white text-lg text-[#102a43] shadow-lg">☎</a>
  </div>;
}

export default function ToursTravelWebsite({ place }) {
  const profile = getProfileData(place);
  const specific = place.attributes?.businessProfile?.categorySpecific || {};
  const gallery = (profile.gallery?.length ? profile.gallery : place.images || []).filter(Boolean).slice(0, 10);
  const social = profile.socialMedia || {};
  const phone = place.phone || profile.phone || '';
  const whatsapp = getWhatsAppUrl(social.whatsapp || profile.whatsapp || phone);
  const call = phone ? `tel:${String(phone).replace(/\s/g, '')}` : '#contact';
  const email = place.email || profile.email || '';
  const location = [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name, profile.pincode].filter(Boolean).join(', ');
  const maps = place.coordinates?.lat ? `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}` : location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : '#contact';
  const services = list(specific['Travel Services'] || profile.services || place.services);
  const visibleServices = services.length ? services.map((name) => ({ name })) : defaultServices.map((name) => ({ name }));
  const facilities = list(specific.Facilities || profile.infrastructure || place.facilities);
  const visibleFacilities = facilities.length ? facilities.map((name) => ({ name })) : defaultFacilities.map((name) => ({ name }));
  const packages = parseItems(specific['Tour Packages'] || profile.packages || profile.packageDetails);
  const destinations = parseItems(specific.Destinations || profile.destinations);
  const vehicles = parseItems(specific.Vehicles || profile.vehicles);
  const experience = first(specific.Experience, profile.experience, 'Years of thoughtful journeys and local expertise');
  const philosophy = first(specific['Travel Philosophy'], profile.mission, 'We make every journey feel personal, comfortable, and beautifully planned.');
  const tagline = first(profile.tagline, 'Go farther. Travel better.');
  const about = first(profile.about, 'Thoughtfully planned journeys, trusted guidance, and memorable experiences for every kind of traveller.');
  const videos = Array.isArray(profile.videos) ? profile.videos.filter(Boolean).map((video) => typeof video === 'string' ? { url: video, title: 'Travel experience' } : video) : [];
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [shared, setShared] = useState(false);
  const logo = profile.logo || place.logo;
  const hero = profile.coverImage || place.coverImage;
  const aboutImage = gallery[0];
  const share = async () => { if (navigator.share) await navigator.share({ title: place.name, url: window.location.href }); else { await navigator.clipboard?.writeText(window.location.href); setShared(true); } };
  const submitEnquiry = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setEnquiryError('');
    setEnquirySubmitting(true);
    try {
      await api.post('/enquiries', {
        place: place._id,
        name: form.get('name'),
        phone: form.get('phone'),
        email: form.get('email'),
        message: [
          `Destination / package: ${form.get('destination') || 'Not specified'}`,
          `Travel date: ${form.get('travelDate') || 'Not specified'}`,
          `Travellers: ${form.get('travellers') || 'Not specified'}`,
          `Message: ${form.get('message')}`,
        ].join('\n'),
      });
      setEnquirySent(true);
      event.currentTarget.reset();
    } catch (error) {
      setEnquiryError(error.message || 'Unable to send your enquiry right now.');
    } finally {
      setEnquirySubmitting(false);
    }
  };
  const packageImage = (item, index) => item.image || gallery[(index + 1) % Math.max(gallery.length, 1)];

  return <div className="min-h-screen bg-[#f8fbfc] font-body text-[#17324d]" style={{ '--travel-navy': '#102a43', '--travel-gold': '#e3aa42', '--travel-teal': '#0d7c83' }}>
    <div className="hidden bg-[#102a43] px-5 py-1.5 text-[10px] font-bold text-white/75 sm:block"><div className="mx-auto flex max-w-[1440px] items-center justify-end gap-4"><span>Plan your next escape with {place.name}</span><a href={safeUrl(social.instagram) || '#contact'} target={social.instagram ? '_blank' : undefined} rel="noreferrer" className="text-[#f1cb76]">Instagram</a><a href={safeUrl(social.facebook) || '#contact'} target={social.facebook ? '_blank' : undefined} rel="noreferrer" className="text-[#f1cb76]">Facebook</a><a href={safeUrl(social.youtube) || '#contact'} target={social.youtube ? '_blank' : undefined} rel="noreferrer" className="text-[#f1cb76]">YouTube</a></div></div>
    <header className="sticky top-0 z-40 border-b border-[#d9e5e8] bg-white/95 shadow-sm backdrop-blur"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-3 sm:px-8"><a href="#home" className="flex min-w-0 items-center gap-3"><div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#d9e5e8] bg-[#eaf2f3]"><Media src={logo} alt={`${place.name} logo`} label="Business logo" /></div><div className="min-w-0"><p className="truncate font-display text-xl font-bold text-[#102a43]">{place.name}</p><p className="truncate text-xs text-[#66808b]">{tagline}</p></div></a><nav className="hidden items-center gap-5 text-xs font-bold lg:flex">{['Home', 'About', 'Tour Packages', 'Destinations', 'Services', 'Gallery', 'Contact'].map((item) => <a key={item} href={anchor(item)} className="transition-colors hover:text-[#0d7c83]">{item}</a>)}</nav><div className="hidden items-center gap-2 md:flex"><a href={call} className="rounded-full border border-[#cbdde1] px-4 py-2 text-xs font-bold">Call</a><a href={whatsapp || '#contact'} target={whatsapp ? '_blank' : undefined} rel="noreferrer" className="rounded-full bg-[#1d9b63] px-4 py-2 text-xs font-bold text-white">WhatsApp</a><a href="#contact" className="rounded-full bg-[#e3aa42] px-4 py-2 text-xs font-bold text-[#102a43]">Book / Enquire</a></div><button type="button" onClick={() => setMenuOpen((value) => !value)} className="rounded-lg border border-[#cbdde1] px-3 py-2 text-lg lg:hidden" aria-label="Open navigation">☰</button></div>{menuOpen && <nav className="border-t border-[#d9e5e8] bg-white px-5 py-2 lg:hidden">{['Home', 'About', 'Tour Packages', 'Destinations', 'Services', 'Gallery', 'Contact'].map((item) => <a key={item} href={anchor(item)} onClick={() => setMenuOpen(false)} className="block border-b border-[#eef3f4] py-3 text-sm font-semibold">{item}</a>)}</nav>}</header>

    <main><section id="home" className="relative isolate min-h-[600px] overflow-hidden bg-[#102a43] text-white sm:min-h-[680px]"><div className="absolute inset-0"><Media src={hero || gallery[0]} alt={`${place.name} travel banner`} label="Hero banner" eager /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,31,51,.94),rgba(16,42,67,.63),rgba(16,42,67,.1))]" /></div><div className="relative mx-auto flex min-h-[600px] max-w-[1440px] items-end px-6 py-16 sm:min-h-[680px] sm:px-12 lg:items-center"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f1cb76]">Tours & Travels</p><h1 className="mt-4 font-display text-5xl font-bold leading-[.98] sm:text-7xl">{place.name}</h1><p className="mt-5 max-w-xl text-2xl font-semibold text-white/90 sm:text-3xl">{tagline}</p><p className="mt-5 max-w-xl text-base leading-7 text-white/75">{about}</p><div className="mt-8 flex flex-wrap gap-3"><a href="#packages" className={`${actionClass} bg-[#e3aa42] text-[#102a43]`}>Explore Packages</a><a href="#contact" className={`${actionClass} border border-white/40 bg-white/10 text-white`}>Contact Us</a>{videos[0] && <a href="#videos" className={`${actionClass} border border-white/40 bg-transparent text-white`}>▷ Watch Video</a>}</div>{location && <p className="mt-7 text-sm text-white/70">⌖ {location}</p>}</div></div></section>

    <section className="border-b border-[#d9e5e8] bg-white"><div className="mx-auto grid max-w-[1300px] gap-px bg-[#d9e5e8] sm:grid-cols-3"><div className="bg-white px-6 py-6 text-center"><p className="font-display text-2xl font-bold text-[#102a43]">{experience}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[#66808b]">Experience</p></div><div className="bg-white px-6 py-6 text-center"><p className="font-display text-2xl font-bold text-[#102a43]">{gallery.length || '—'}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[#66808b]">Travel stories</p></div><div className="bg-white px-6 py-6 text-center"><p className="font-display text-2xl font-bold text-[#102a43]">{place.rating?.average ? `${Number(place.rating.average).toFixed(1)} / 5` : 'Trusted'}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[#66808b]">Traveller rating</p></div></div></section>

    <section id="about" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center"><div className="h-[360px] overflow-hidden rounded-3xl bg-[#dce9ec] shadow-xl sm:h-[480px]"><Media src={aboutImage} alt={`${place.name} travel experience`} label="About us image" /></div><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d7c83]">About us</p><h2 className="mt-3 font-display text-4xl font-bold text-[#102a43] sm:text-5xl">Journeys made with care.</h2><p className="mt-6 whitespace-pre-line text-base leading-8 text-[#58717e]">{about}</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-[#eaf2f3] p-5"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0d7c83]">Our experience</p><p className="mt-2 text-sm leading-6 text-[#385768]">{experience}</p></div><div className="rounded-2xl bg-[#f8edd7] p-5"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#a56f1f]">Our philosophy</p><p className="mt-2 text-sm leading-6 text-[#385768]">{philosophy}</p></div></div></div></section>

    <section id="packages" className="bg-white px-5 py-20 sm:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d7c83]">Curated escapes</p><h2 className="mt-3 font-display text-4xl font-bold text-[#102a43] sm:text-5xl">Our Tour Packages</h2></div><a href="#contact" className="text-sm font-bold text-[#0d7c83]">Plan a custom trip →</a></div><div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{packages.length ? packages.map((item, index) => <article key={`${item.name || item.title || 'package'}-${index}`} className="overflow-hidden rounded-3xl border border-[#d9e5e8] bg-white shadow-[0_15px_40px_rgba(16,42,67,.08)]"><div className="h-56"><Media src={packageImage(item, index)} alt={item.title || item.name || 'Tour package'} label="Package image" /></div><div className="p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#0d7c83]">{item.destination || item.location || 'Curated journey'}</p><h3 className="mt-2 font-display text-2xl font-bold text-[#102a43]">{item.title || item.name || 'Travel package'}</h3></div>{item.price && <p className="shrink-0 font-bold text-[#a56f1f]">{item.price}</p>}</div>{(item.days || item.nights) && <p className="mt-3 text-sm font-semibold text-[#66808b]">{item.days || '—'} days · {item.nights || '—'} nights</p>}<p className="mt-4 text-sm leading-6 text-[#58717e]">{item.description || 'A carefully planned experience with comfortable travel and local guidance.'}</p>{item.included && <p className="mt-3 text-xs font-semibold text-[#0d7c83]">Includes: {Array.isArray(item.included) ? item.included.join(' · ') : item.included}</p>}<div className="mt-6 flex gap-2"><button type="button" onClick={() => setReviewOpen(true)} className="flex-1 rounded-full border border-[#cbdde1] px-3 py-2.5 text-xs font-bold">View Details</button><a href="#contact" className="flex-1 rounded-full bg-[#e3aa42] px-3 py-2.5 text-center text-xs font-bold text-[#102a43]">Enquire Now</a></div></div></article>) : <div className="col-span-full rounded-3xl border border-dashed border-[#9cb8bf] bg-[#f8fbfc] p-12 text-center"><p className="font-display text-2xl font-bold">Your next journey starts here.</p><p className="mt-2 text-sm text-[#66808b]">Tour packages added by the business owner will appear in this space.</p></div>}</div></div></section>

    <section id="destinations" className="bg-[#102a43] px-5 py-20 text-white sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f1cb76]">Go somewhere wonderful</p><h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Popular Destinations</h2><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{destinations.length ? destinations.slice(0, 8).map((item, index) => <article key={`${item.name || item.title || 'destination'}-${index}`} className="group relative min-h-[260px] overflow-hidden rounded-3xl"><Media src={item.image || gallery[(index + 2) % Math.max(gallery.length, 1)]} alt={item.name || item.title || 'Destination'} label="Destination image" className="transition duration-500 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071b31] via-[#071b31cc] to-transparent p-5 pt-16"><h3 className="font-display text-2xl font-bold">{item.name || item.title || 'Destination'}</h3><p className="mt-1 text-sm text-white/70">{item.description || 'A memorable place to discover.'}</p><a href="#contact" className="mt-3 inline-block text-xs font-bold text-[#f1cb76]">View details →</a></div></article>) : <div className="col-span-full rounded-3xl border border-white/20 p-10 text-center text-white/70">Destinations added by the business owner will appear here.</div>}</div></div></section>

    <section id="services" className="px-5 py-20 sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d7c83]">Travel made simple</p><h2 className="mt-3 font-display text-4xl font-bold text-[#102a43] sm:text-5xl">Services for every kind of traveller.</h2><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleServices.map((item, index) => <article key={`${item.name}-${index}`} className="rounded-2xl border border-[#d9e5e8] bg-white p-6 shadow-sm"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eaf2f3] text-xl text-[#0d7c83]">{iconMap[item.name] || '✦'}</span><h3 className="mt-5 font-display text-xl font-bold text-[#102a43]">{item.name}</h3><p className="mt-2 text-sm leading-6 text-[#66808b]">{item.description || 'Personalised planning, clear communication, and dependable support.'}</p></article>)}</div></div></section>

    {vehicles.length > 0 && <section id="vehicles" className="bg-[#edf4f5] px-5 py-20 sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d7c83]">Travel comfortably</p><h2 className="mt-3 font-display text-4xl font-bold text-[#102a43]">Our Vehicles</h2><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{vehicles.map((item, index) => <article key={`${item.name || item.title}-${index}`} className="overflow-hidden rounded-3xl bg-white shadow-sm"><div className="h-48"><Media src={item.image || gallery[index % Math.max(gallery.length, 1)]} alt={item.name || item.title || 'Travel vehicle'} label="Vehicle image" /></div><div className="p-5"><h3 className="font-display text-xl font-bold">{item.name || item.title || 'Travel vehicle'}</h3><p className="mt-2 text-sm text-[#66808b]">{item.capacity || item.seating || 'Comfortable seating'} · {item.ac || 'AC / Non-AC options'}</p><p className="mt-3 text-sm text-[#58717e]">{item.description || 'Clean, comfortable transport for your journey.'}</p><a href="#contact" className="mt-5 inline-block text-sm font-bold text-[#0d7c83]">Enquire Now →</a></div></article>)}</div></div></section>}

    <section id="facilities" className="bg-white px-5 py-20 sm:px-8"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d7c83]">Travel with confidence</p><h2 className="mt-3 font-display text-4xl font-bold text-[#102a43] sm:text-5xl">Why choose us</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{visibleFacilities.map((item, index) => <div key={`${item.name}-${index}`} className="rounded-2xl border border-[#d9e5e8] p-5"><span className="text-2xl text-[#e3aa42]">{iconMap[item.name] || '✓'}</span><h3 className="mt-4 font-bold">{item.name}</h3><p className="mt-2 text-sm leading-6 text-[#66808b]">{item.description || 'A thoughtful detail that makes your journey easier.'}</p></div>)}</div></div></section>

    <section id="gallery" className="bg-[#071b31] px-5 py-20 text-white sm:px-8"><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f1cb76]">The view from here</p><h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Travel gallery</h2></div><span className="text-xs text-white/55">{gallery.length}/10 photos</span></div><div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{gallery.length ? gallery.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => setLightbox(image)} className={`overflow-hidden rounded-2xl ${index === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}><img src={image} alt={`${place.name} travel gallery ${index + 1}`} className="h-full w-full object-cover transition duration-500 hover:scale-105" /></button>) : <div className="col-span-full rounded-3xl border border-dashed border-white/30 p-12 text-center text-white/65">Up to 10 travel photos uploaded by the business owner will appear here.</div>}</div></div></section>

    {videos.length > 0 && <section id="videos" className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d7c83]">Travel experiences</p><h2 className="mt-3 font-display text-4xl font-bold text-[#102a43]">Our Videos</h2></div><SocialActions label="Travel videos" /></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{videos.slice(0, 6).map((video, index) => <div key={`${video.url}-${index}`}><PublicVideoCard video={video} /><p className="mt-2 text-sm font-bold text-[#102a43]">{video.title || 'Travel experience'}</p></div>)}</div></section>}

    <section id="reviews" className="bg-[#f8edd7] px-5 py-20 sm:px-8"><div className="mx-auto max-w-5xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a56f1f]">From our travellers</p><h2 className="mt-3 font-display text-4xl font-bold text-[#102a43]">Customer Reviews</h2></div><button type="button" onClick={() => setReviewOpen(true)} className="rounded-full bg-[#102a43] px-5 py-3 text-sm font-bold text-white">Submit Your Review</button></div><div className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-8"><ReviewsSection placeId={place._id} /></div></div></section>

    <section id="contact" className="bg-white px-5 py-20 sm:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0d7c83]">Start planning</p><h2 className="mt-3 font-display text-4xl font-bold text-[#102a43] sm:text-5xl">Let&apos;s plan your next escape.</h2><div className="mt-7 space-y-4 text-sm leading-6 text-[#58717e]">{location && <p>⌖ {location}</p>}{phone && <p>☎ <a href={call} className="font-bold text-[#102a43]">{phone}</a></p>}{whatsapp && <p>◉ <a href={whatsapp} target="_blank" rel="noreferrer" className="font-bold text-[#102a43]">WhatsApp us</a></p>}{email && <p>✉ <a href={`mailto:${email}`} className="font-bold text-[#102a43]">{email}</a></p>}<p>◷ Open for travel enquiries and trip planning.</p></div><div className="mt-7 flex flex-wrap gap-3"><a href={maps} target="_blank" rel="noreferrer" className={`${actionClass} bg-[#102a43] text-white`}>Get Directions</a><button type="button" onClick={share} className={`${actionClass} border border-[#cbdde1] bg-white`}>↗ {shared ? 'Link copied' : 'Share'}</button></div>{place.address && <div className="mt-8 overflow-hidden rounded-2xl border border-[#d9e5e8]"><iframe title={`${place.name} location map`} src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`} className="h-56 w-full" loading="lazy" /></div>}</div><form onSubmit={submitEnquiry} className="rounded-3xl bg-[#edf4f5] p-6 sm:p-8"><h3 className="font-display text-2xl font-bold text-[#102a43]">Send an enquiry</h3><div className="mt-6 grid gap-4 sm:grid-cols-2"><input name="name" required placeholder="Name" className="rounded-xl border-0 px-4 py-3 text-sm outline-none ring-1 ring-[#cbdde1] focus:ring-2 focus:ring-[#0d7c83]" /><input name="phone" required placeholder="Phone" type="tel" className="rounded-xl border-0 px-4 py-3 text-sm outline-none ring-1 ring-[#cbdde1] focus:ring-2 focus:ring-[#0d7c83]" /><input name="email" placeholder="Email" type="email" className="rounded-xl border-0 px-4 py-3 text-sm outline-none ring-1 ring-[#cbdde1] focus:ring-2 focus:ring-[#0d7c83]" /><input name="destination" placeholder="Destination / package" className="rounded-xl border-0 px-4 py-3 text-sm outline-none ring-1 ring-[#cbdde1] focus:ring-2 focus:ring-[#0d7c83]" /><input name="travelDate" placeholder="Travel date" type="date" className="rounded-xl border-0 px-4 py-3 text-sm outline-none ring-1 ring-[#cbdde1] focus:ring-2 focus:ring-[#0d7c83]" /><input name="travellers" placeholder="Travellers" type="number" min="1" className="rounded-xl border-0 px-4 py-3 text-sm outline-none ring-1 ring-[#cbdde1] focus:ring-2 focus:ring-[#0d7c83]" /><textarea name="message" required placeholder="Tell us about your trip" rows="5" className="sm:col-span-2 rounded-xl border-0 px-4 py-3 text-sm outline-none ring-1 ring-[#cbdde1] focus:ring-2 focus:ring-[#0d7c83]" /></div>{enquiryError && <p className="mt-4 text-sm font-semibold text-red-600">{enquiryError}</p>}<button disabled={enquirySubmitting} className="mt-5 rounded-full bg-[#e3aa42] px-6 py-3 text-sm font-bold text-[#102a43] disabled:opacity-60">{enquirySubmitting ? 'Sending…' : enquirySent ? 'Enquiry received' : 'Send Enquiry'}</button></form></div></section></main>

    <footer className="bg-[#071b31] px-5 py-12 text-white sm:px-8"><div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4"><div><div className="flex items-center gap-3"><div className="h-11 w-11 overflow-hidden rounded-xl bg-white"><Media src={logo} alt={`${place.name} logo`} label="Logo" /></div><p className="font-display text-xl font-bold">{place.name}</p></div><p className="mt-4 text-sm leading-6 text-white/60">{about}</p></div><div><h3 className="font-bold">Location</h3><p className="mt-4 text-sm leading-6 text-white/60">{location || 'Address available from the business owner'}</p><a href={maps} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-bold text-[#f1cb76]">Google Maps · Get Directions</a></div><div><h3 className="font-bold">Contact Details</h3><div className="mt-4 space-y-2 text-sm text-white/60">{phone && <a href={call} className="block">{phone}</a>}{whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="block">WhatsApp</a>}{email && <a href={`mailto:${email}`} className="block">{email}</a>}<p>Travel enquiries welcome</p></div></div><div><h3 className="font-bold">Social Media</h3><div className="mt-4 flex flex-wrap gap-2 text-sm text-white/70">{Object.entries(social).filter(([, value]) => value).map(([name, value]) => <a key={name} href={safeUrl(value)} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-3 py-2">{name}</a>)}{!Object.values(social).some(Boolean) && <span className="text-white/50">Social links added by the business owner will appear here.</span>}</div></div></div><div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5 text-xs text-white/45"><span>© {new Date().getFullYear()} {place.name}. All rights reserved.</span><span className="flex items-center gap-3"><strong>Listed on G-PAGES</strong><a href="/" className="text-[#f1cb76]">Contact G-PAGES</a><a href="/" className="text-[#f1cb76]">Back to Home</a></span></div></footer>
    <FloatingActions phone={phone} whatsapp={whatsapp} social={social} />
    {lightbox && <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={() => setLightbox(null)}><button type="button" onClick={() => setLightbox(null)} className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#102a43]">Close</button><img src={lightbox} alt={`${place.name} enlarged travel photo`} className="max-h-[88vh] max-w-[94vw] object-contain" onClick={(event) => event.stopPropagation()} /></div>}
    {reviewOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#071b31]/70 p-4" onClick={() => setReviewOpen(false)}><div className="w-full max-w-lg rounded-3xl bg-white p-7" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">Submit Your Review</h2><button type="button" onClick={() => setReviewOpen(false)} className="text-xl">×</button></div><div className="mt-5 grid gap-3"><input placeholder="Name" className="rounded-xl border border-[#cbdde1] px-4 py-3 text-sm" /><input placeholder="Email / Phone" className="rounded-xl border border-[#cbdde1] px-4 py-3 text-sm" /><select className="rounded-xl border border-[#cbdde1] px-4 py-3 text-sm"><option>Rating</option><option>5 stars</option><option>4 stars</option><option>3 stars</option></select><textarea placeholder="Review" rows="4" className="rounded-xl border border-[#cbdde1] px-4 py-3 text-sm" /><button type="button" onClick={() => setReviewOpen(false)} className="rounded-full bg-[#e3aa42] px-5 py-3 text-sm font-bold">Submit Review</button></div></div></div>}
  </div>;
}
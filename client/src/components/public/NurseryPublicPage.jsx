import React, { useMemo, useState } from 'react';
import ReviewsSection from '../ReviewsSection';
import { getProfileData, ImageFrame } from './PublicProfileShared';
import { getWhatsAppUrl } from '../../utils/healthcare';

const GREEN = '#147a20';
const serviceDefaults = [
  ['Indoor Plants', 'Air purifying and decorative plants', '🌿'], ['Outdoor Plants', 'Garden, avenue and flowering plants', '🌺'],
  ['Saplings', 'Fruit plants, vegetable plants and tree saplings', '🌱'], ['Gardening Products', 'Pots, soil, fertilizers and tools', '🪴'],
  ['Landscaping Services', 'Garden design and maintenance', '🌳'], ['Plant Care Guidance', 'Expert advice for healthy plants', '👥'],
];
const infrastructureDefaults = [
  ['Spacious Nursery', 'Large display area with wide plant variety', '⌂'], ['Parking Facility', 'Ample parking space for customers', 'P'],
  ['Irrigation System', 'Modern watering and care systems', '💧'], ['Plant Care Unit', 'Healthy and high-quality plant maintenance', '🌿'],
  ['Home Delivery', 'Safe and fast delivery to your doorstep', '🚚'], ['Expert Support', 'Professional guidance and after-sales support', '◉'],
];
const asList = (value) => Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean) : value ? [value] : [];
const media = (item) => typeof item === 'string' ? item : item?.image || item?.url || item?.src || '';
const label = (item, fallback) => typeof item === 'string' ? item : item?.name || item?.title || fallback;
const url = (value) => value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : '';

function SectionTitle({ children, action }) {
  return <div className="mb-3 flex items-end justify-between gap-3"><div><h2 className="text-xl font-extrabold tracking-tight text-[#102550] sm:text-2xl">{children}</h2><span className="mt-1 block h-[3px] w-9 rounded bg-[#16852a]" /></div>{action}</div>;
}

export default function NurseryPublicPage({ place }) {
  const profile = getProfileData(place);
  const specific = place.attributes?.businessProfile?.categorySpecific || {};
  const common = place.attributes?.businessProfile?.common || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(-1);
  const [activeVideo, setActiveVideo] = useState(null);
  const gallery = useMemo(() => asList(common.gallery || specific.galleryImages || profile.gallery || place.images).map(media).filter(Boolean).slice(0, 10), [common.gallery, specific.galleryImages, profile.gallery, place.images]);
  const hero = profile.coverImage || place.coverImage || gallery[0] || '';
  const aboutImage = profile.aboutImage || specific.aboutImage || gallery[1] || gallery[0] || hero;
  const services = asList(specific.services || profile.services);
  const videos = asList(common.videos || profile.videos || place.videos).map((v) => typeof v === 'string' ? { url: v } : v).filter((v) => v?.url || v?.src);
  const infrastructure = asList(specific.infrastructure || specific.features || place.facilities || profile.infrastructure);
  const phone = place.phone || profile.phone || common.phone || '';
  const whatsapp = getWhatsAppUrl(place.socialLinks?.whatsapp || profile.socialMedia?.whatsapp || phone);
  const email = place.email || profile.email || common.email || '';
  const address = [place.address, place.location?.city?.name, place.location?.state?.name].filter(Boolean).join(', ');
  const directions = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : '';
  const products = asList(specific.productItems || specific.productsList || (Array.isArray(specific.products) ? specific.products : [])).filter((item) => typeof item === 'object');
  const social = profile.socialMedia || {};
  const stats = [[specific.plantVarieties || '500+', 'Plant Varieties', '🌱'], [specific.happyCustomers || '10K+', 'Happy Customers', '👥'], [specific.yearsExperience || specific.yearsInBusiness || '5+', 'Years of Experience', '★'], [specific.plantQuality || '100%', 'Plant Quality', '♥']];
  const nav = [['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Gallery', '#gallery'], ['Contact', '#contact']];
  const imageTile = (src, alt, className = '') => <div className={`overflow-hidden bg-[#e8f0e8] ${className}`}>{src ? <ImageFrame src={src} alt={alt} /> : <div className="grid h-full min-h-24 place-items-center text-4xl text-[#4b9150]" aria-label={alt}>🌿</div>}</div>;

  return <div className="min-h-screen overflow-x-hidden bg-white font-sans text-[#172033]">
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white shadow-sm"><div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-7">
      <a href="#home" className="flex min-w-0 items-center gap-2">{profile.logo || place.logo ? <img src={profile.logo || place.logo} alt={`${place.name} logo`} className="h-11 w-11 shrink-0 object-contain" /> : <span className="text-3xl text-green-700">🌿</span>}<span className="min-w-0"><strong className="block truncate font-serif text-lg leading-5 text-green-800 sm:text-2xl">{place.name}</strong><small className="block truncate text-[10px] text-slate-600">{profile.tagline || common.tagline || 'Plants for a Greener Tomorrow'}</small></span></a>
      <nav className="hidden items-center gap-1 lg:flex">{nav.map(([name, href], i) => <a key={href} href={href} className={`rounded-md px-4 py-2 text-xs font-semibold ${i === 0 ? 'bg-green-800 text-white' : 'text-slate-600 hover:text-green-800'}`}>{name}</a>)}</nav>
      <div className="hidden items-center gap-3 sm:flex">{phone && <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-xs font-bold text-green-900">☎ {phone}</a>}<a href={directions || '#contact'} target={directions ? '_blank' : undefined} rel="noreferrer" className="rounded-md bg-green-700 px-4 py-2.5 text-xs font-bold text-white">⌖ Visit Our Nursery</a></div>
      <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="rounded-md border px-3 py-2 text-lg lg:hidden">☰</button>
    </div>{menuOpen && <nav className="border-t bg-white px-4 py-2 lg:hidden">{nav.map(([name, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b py-3 text-sm font-semibold last:border-0">{name}</a>)}<div className="flex gap-2 py-3">{phone && <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex-1 rounded bg-green-800 p-3 text-center text-sm font-bold text-white">Call Now</a>}{whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="flex-1 rounded bg-green-600 p-3 text-center text-sm font-bold text-white">WhatsApp</a>}</div></nav>}</header>

    <main>
      <section id="home" className="relative isolate min-h-[390px] overflow-hidden bg-[#142117] text-white sm:min-h-[440px]">{hero && <div className="absolute inset-0 -z-10"><ImageFrame src={hero} alt={`${place.name} nursery`} eager /><div className="absolute inset-0 bg-gradient-to-r from-[#07140bcc] via-[#07140b80] to-[#07140b20]" /></div>}<div className="mx-auto grid min-h-[390px] max-w-[1440px] items-center gap-7 px-5 py-10 sm:min-h-[440px] sm:px-8 lg:grid-cols-[1fr_.8fr]"><div><span className="mb-2 block h-[3px] w-9 bg-green-500" /><h1 className="max-w-2xl font-serif text-4xl font-bold leading-[1.02] sm:text-5xl lg:text-6xl">Bring Nature<br /><span className="text-[#ffd35b]">Closer</span> to Your Home</h1><p className="mt-3 max-w-lg text-sm leading-5 text-white/90 sm:text-base">Wide range of indoor, outdoor and decorative plants to make your space greener and healthier.</p><div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-[11px] font-semibold">{['🌿 Wide Variety of Plants', '🚚 Home Delivery', '⚙ Expert Guidance', '🌳 Landscaping Support'].map((x) => <span key={x}>{x}</span>)}</div><div className="mt-6 flex flex-wrap gap-3"><a href="#services" className="rounded-md bg-green-700 px-5 py-3 text-sm font-bold">🌿 Explore Plants</a><a href={directions || '#contact'} target={directions ? '_blank' : undefined} rel="noreferrer" className="rounded-md bg-white px-5 py-3 text-sm font-bold text-slate-900">⌖ Visit Our Nursery</a></div></div><aside className="hidden justify-self-end border-l-2 border-green-700 bg-[#fff9e8]/95 px-7 py-5 font-serif text-2xl italic leading-tight text-[#263b23] shadow-xl md:block">Green<br />Plants<br />Happier<br />Lives <span className="text-green-700">🌿</span></aside></div></section>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-7">
        <section id="about" className="grid gap-5 py-5 md:grid-cols-2 md:items-center"><div className="h-48 overflow-hidden rounded-lg sm:h-56">{imageTile(aboutImage, `${place.name} nursery entrance`, 'h-full')}</div><div><SectionTitle>About Us</SectionTitle><p className="text-xs leading-[1.45] text-slate-600 sm:text-sm">{place.description || profile.about || `${place.name} is your one-stop destination for a wide variety of indoor and outdoor plants, decorative plants, gardening products and landscaping solutions. We are passionate about bringing nature closer to you and helping create greener, cleaner and healthier spaces.`}</p><a href="#contact" className="mt-2 inline-flex rounded-md bg-green-800 px-5 py-2 text-xs font-bold text-white">Read More</a><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{stats.map(([value, text, icon]) => <div key={text} className="rounded-md bg-[#f4f8f4] px-2 py-2 text-center"><span className="text-xl text-green-700">{icon}</span><strong className="block text-sm text-[#102550]">{value}</strong><small className="text-[10px] text-slate-600">{text}</small></div>)}</div></div></section>

        <section id="services" className="pb-5"><SectionTitle action={<a href="#contact" className="text-[11px] font-bold text-green-800">View All Services →</a>}>Our Services</SectionTitle><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{serviceDefaults.map(([title, description, icon], i) => { const entry = services[i]; const titleText = label(entry, title); return <article key={titleText} className="overflow-hidden rounded-md border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">{imageTile(media(entry) || gallery[i], titleText, 'aspect-[4/3]')}<div className="flex gap-2 p-2"><span className="text-xl text-green-700">{icon}</span><div><h3 className="text-[11px] font-extrabold text-[#102550]">{titleText}</h3><p className="mt-0.5 text-[10px] leading-4 text-slate-600">{entry?.description || (typeof entry === 'string' ? description : entry?.description) || description}</p></div></div></article>;})}</div></section>

        {products.length > 0 && <section className="pb-5"><SectionTitle>Featured Plants</SectionTitle><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{products.slice(0, 10).map((item, i) => <article key={item._id || item.name || i} className="overflow-hidden rounded-lg border bg-white shadow-sm">{imageTile(media(item), item.name || item.title, 'aspect-[4/3]')}<div className="p-3"><h3 className="font-bold text-green-900">{item.name || item.title}</h3>{item.description && <p className="mt-1 text-xs text-slate-600">{item.description}</p>}{item.price && <p className="mt-2 font-bold text-green-800">{item.offerPrice || item.price}</p>}<a href={phone ? `tel:${phone.replace(/\s/g, '')}` : '#contact'} className="mt-2 inline-block text-xs font-bold text-green-800">Enquire →</a></div></article>)}</div></section>}

        <section id="gallery" className="pb-5"><SectionTitle action={<span className="text-[11px] font-bold text-green-800">View All Photos →</span>}>Our Gallery</SectionTitle>{gallery.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{gallery.map((src, i) => <button key={`${src}-${i}`} type="button" onClick={() => setPhotoIndex(i)} className="aspect-[4/3] overflow-hidden rounded-md" aria-label={`Open nursery photo ${i + 1}`}><ImageFrame src={src} alt={`${place.name} nursery ${i + 1}`} className="transition hover:scale-105" /></button>)}</div> : <p className="rounded-md bg-[#f4f8f4] p-5 text-sm text-slate-600">Nursery photos will appear here.</p>}</section>

        {videos.length > 0 && <section className="pb-5"><SectionTitle action={<a href="#videos" className="text-[11px] font-bold text-green-800">View All Videos →</a>}>Our Videos</SectionTitle><div id="videos" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{videos.slice(0, 3).map((video, i) => <button key={video.url || video.src || i} type="button" onClick={() => setActiveVideo(video)} className="relative aspect-video overflow-hidden rounded-lg bg-[#173322] text-left text-white">{imageTile(video.thumbnail || video.image || gallery[i], video.title || 'Nursery video', 'absolute inset-0 opacity-80')}<span className="absolute inset-0 grid place-items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-red-600 text-white">▶</span></span><span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-3 text-sm font-bold">{video.title || ['Plant Care Tips', 'Nursery Tour', 'Landscaping Ideas'][i]}</span>{video.duration && <span className="absolute bottom-3 right-3 text-xs">{video.duration}</span>}</button>)}</div></section>}

        <section className="pb-5"><SectionTitle>Our Infrastructure</SectionTitle><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{infrastructureDefaults.map(([name, description, icon], i) => { const item = infrastructure[i]; const title = label(item, name); return <article key={title} className="rounded-md border border-slate-100 bg-white p-3 text-center shadow-sm"><span className="text-3xl font-bold text-green-700">{icon}</span><h3 className="mt-1 text-xs font-extrabold text-[#102550]">{title}</h3><p className="mt-1 text-[10px] leading-4 text-slate-600">{item?.description || description}</p></article>; })}</div></section>

        <section id="reviews" className="pb-6"><SectionTitle>Customer Reviews</SectionTitle><div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:p-5"><ReviewsSection placeId={place._id} /></div></section>
      </div>
    </main>

    <footer id="contact" className="bg-[#00331f] px-5 py-7 text-white sm:px-8"><div className="mx-auto grid max-w-[1440px] gap-6 sm:grid-cols-2 lg:grid-cols-4"><section><h2 className="font-bold text-green-300">📍 Our Location</h2><p className="mt-2 text-xs leading-5 text-white/80">{place.name}<br />{address || 'Address not provided'}</p>{directions && <a href={directions} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded bg-green-700 px-3 py-2 text-xs font-bold">Get Directions</a>}</section><section><h2 className="font-bold text-green-300">☎ Contact Details</h2><div className="mt-2 space-y-2 text-xs text-white/85">{phone && <a className="block" href={`tel:${phone.replace(/\s/g, '')}`}>☎ {phone}</a>}{whatsapp && <a className="block" href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>}{email && <a className="block" href={`mailto:${email}`}>✉ {email}</a>}{place.website && <a className="block" href={url(place.website)} target="_blank" rel="noreferrer">◎ {place.website}</a>}</div></section><section><h2 className="font-bold text-green-300">▣ Follow Us</h2><div className="mt-3 flex flex-wrap gap-3 text-xs">{Object.entries(social).filter(([key, value]) => key !== 'whatsapp' && value).map(([key, value]) => <a key={key} href={url(value)} target="_blank" rel="noreferrer" className="capitalize">{key}</a>)}</div></section><section><h2 className="font-bold">🟢 Powered by G-Pages</h2><p className="mt-2 text-xs text-white/75">Create your business website with G-Pages.</p><a href="/" className="mt-3 inline-block rounded bg-green-700 px-4 py-2 text-xs font-bold">↑ Back to Home</a></section></div></footer>
    {photoIndex >= 0 && <div role="presentation" className="fixed inset-0 z-[70] grid place-items-center bg-black/90 p-4" onClick={() => setPhotoIndex(-1)}><button type="button" aria-label="Close gallery" className="absolute right-5 top-5 rounded bg-white px-4 py-2 font-bold text-black" onClick={() => setPhotoIndex(-1)}>Close</button><img src={gallery[photoIndex]} alt={`${place.name} gallery enlarged`} className="max-h-[88vh] max-w-[94vw] rounded object-contain" /></div>}
    {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
  </div>;
}

function VideoModal({ video, onClose }) {
  const source = video.url || video.src || '';
  let embed = '';
  try { const parsed = new URL(source); const id = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v') || parsed.pathname.match(/\/embed\/([^/]+)/)?.[1]; if (id) embed = `https://www.youtube.com/embed/${id}?autoplay=1`; } catch { /* direct video */ }
  return <div role="presentation" className="fixed inset-0 z-[75] grid place-items-center bg-black/90 p-4" onClick={onClose}><section role="dialog" aria-modal="true" aria-label={video.title || 'Nursery video'} className="relative w-full max-w-4xl bg-black" onClick={(event) => event.stopPropagation()}><button type="button" aria-label="Close video" onClick={onClose} className="absolute right-2 top-2 z-10 rounded-full bg-black/70 px-3 py-2 text-white">×</button><div className="aspect-video">{embed ? <iframe title={video.title || 'Nursery video'} src={embed} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full border-0" /> : <video src={source} controls autoPlay playsInline className="h-full w-full" />}</div></section></div>;
}

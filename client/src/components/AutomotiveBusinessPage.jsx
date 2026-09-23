import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import ReviewsSection from './ReviewsSection';

const DEFAULT_SERVICES = ['Car Service', 'Repairs', 'Detailing', 'Diagnostics', 'Tyres & Alignment', 'AC Service', 'Body & Paint', 'Roadside Assistance'];
const SERVICE_ICONS = ['🔧', '⚙', '✨', '▣', '◉', '❄', '🎨', '🚗'];

const getServiceIcon = (service = '') => {
  const value = service.toLowerCase();
  if (value.includes('tyre') || value.includes('tire') || value.includes('alignment')) return '🛞';
  if (value.includes('brake') || value.includes('repair') || value.includes('engine')) return '⚙';
  if (value.includes('wash') || value.includes('detail') || value.includes('polish')) return '✨';
  if (value.includes('diagnostic') || value.includes('checkup') || value.includes('inspection')) return '▣';
  if (value.includes('ac') || value.includes('air')) return '❄';
  if (value.includes('paint') || value.includes('body')) return '🎨';
  if (value.includes('road') || value.includes('assistance') || value.includes('towing')) return '🚑';
  if (value.includes('battery') || value.includes('electrical')) return '🔋';
  if (value.includes('service') || value.includes('care')) return '🔧';
  if (value.includes('car')) return '🚗';
  return '🔧';
};

const toUrl = (value, protocol = 'https://') => value && (value.startsWith('http') ? value : `${protocol}${value}`);
const toInstagramUrl = (value) => {
  if (!value) return null;
  if (value.startsWith('http')) return value;
  return `https://instagram.com/${value.replace(/^@/, '').trim()}`;
};

const getVideoEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (parsed.hostname.includes('vimeo.com')) return `https://player.vimeo.com/video${parsed.pathname}`;
  } catch {
    return url;
  }
  return url;
};

function BusinessHeader({ place }) {
  const links = [['#home', 'Home'], ['#services', 'Services'], ['#gallery', 'Gallery'], ['#videos', 'Videos'], ['#reviews', 'Reviews'], ['#contact', 'Contact']];
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[#294258] bg-[#061c31]/95 text-white shadow-lg backdrop-blur">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
        <Link to="/categories" className="flex min-w-0 items-center gap-3" aria-label="Back to categories">
          {place.logo && <img src={place.logo} alt={`${place.name} logo`} className="h-10 w-auto max-w-[116px] object-contain" />}
          <span className={`${place.logo ? 'border-l border-white/25 pl-3' : ''} text-sm font-semibold text-white sm:text-base`}>{place.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Business sections">
          {links.map(([href, label]) => <a key={href} href={href} className="border-b-2 border-transparent px-1 py-6 text-[13px] font-medium text-white/75 transition hover:border-[#f7b718] hover:text-white">{label}</a>)}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link to="/categories" className="hidden rounded-full border border-white/50 px-4 py-2 text-xs font-semibold text-white transition hover:border-[#f7b718] hover:bg-[#f7b718] hover:text-[#061c31] sm:block">← Back to G-Pages</Link>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded border border-white/50 lg:hidden" aria-label="Toggle business menu" aria-expanded={menuOpen}>
            <span className="relative block h-4 w-5"><span className={`absolute left-0 top-0 h-0.5 w-5 bg-white transition ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} /><span className={`absolute left-0 top-2 h-0.5 w-5 bg-white transition ${menuOpen ? 'opacity-0' : ''}`} /><span className={`absolute left-0 top-4 h-0.5 w-5 bg-white transition ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} /></span>
          </button>
        </div>
      </div>
      {menuOpen && <nav className="border-t border-[#294258] bg-[#061c31] px-5 py-3 lg:hidden" aria-label="Mobile business sections">{links.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-white/10 py-3 text-sm text-white/80 transition last:border-0 hover:text-[#f7b718]">{label}</a>)}<Link to="/categories" onClick={() => setMenuOpen(false)} className="block py-3 text-sm font-semibold text-[#f7b718]">← Back to G-Pages</Link></nav>}
    </header>
  );
}

function BusinessFooter({ place, socialLinks }) {
  const safeLinks = socialLinks || {};
  const whatsapp = safeLinks.whatsapp ? toUrl(safeLinks.whatsapp, 'https://wa.me/') : null;
  const instagram = toInstagramUrl(safeLinks.instagram);
  const facebook = safeLinks.facebook ? toUrl(safeLinks.facebook) : null;
  const chatSupport = safeLinks.chatSupport ? toUrl(safeLinks.chatSupport) : null;

  return (
    <footer className="bg-[#061c31] text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.2fr_1fr_1.5fr]">
        <div className="col-span-2 md:col-span-1">
          {place.logo ? <img src={place.logo} alt={`${place.name} logo`} className="h-12 max-w-[150px] object-contain" /> : <p className="text-xl font-black text-white">{place.name}</p>}
          <p className="mt-2 text-xs">Drive better · Drive safer</p>
        </div>
        <div className="flex flex-col gap-2 text-xs"><span className="font-semibold text-white">Quick Links</span><Link to="/categories" className="flex items-center gap-2 hover:text-[#f7b718]"><FooterIcon type="home" /> Home</Link>{whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#f7b718]"><FooterIcon type="whatsapp" /> WhatsApp</a>}{instagram && <a href={instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#f7b718]"><FooterIcon type="instagram" /> Instagram</a>}{facebook && <a href={facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#f7b718]"><FooterIcon type="facebook" /> Facebook</a>}{place.phone && <a href={`tel:${place.phone}`} className="flex items-center gap-2 hover:text-[#f7b718]"><FooterIcon type="phone" /> Call</a>}{chatSupport && <a href={chatSupport} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#f7b718]"><FooterIcon type="chat" /> Chat support</a>}</div>
        <div className="text-xs"><p className="font-semibold text-white">Get in touch</p>{place.phone && <a href={`tel:${place.phone}`} className="mt-2 block hover:text-[#f7b718]">☎ {place.phone}</a>}<p className="mt-1">⌖ {place.address}</p></div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-[11px] sm:px-8">© {new Date().getFullYear()} {place.name}. Listed on G-PAGES.</div>
    </footer>
  );
}

function FooterIcon({ type }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></>,
    whatsapp: <><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" /><path d="M9.2 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.2.1.4-.1.6l-.5.6c.7 1.2 1.6 2 2.8 2.6l.5-.5c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.3.6-.2 1-.8 1.4-1.6 1.4-2.1-.1-5.8-3.4-6.5-6.2-.2-.7.1-1.1.7-1.2Z" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>,
    facebook: <path d="M14 21v-8h2.7l.4-3H14V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H8v3h2.8v8" />,
    phone: <path d="M7 4.5 9.5 4l1.6 4-2 1.5a13 13 0 0 0 5.4 5.4l1.5-2 4 1.6-.5 2.5c-.2 1-1 1.6-2 1.5C10.8 17.6 6.4 13.2 5.5 6.5c-.1-1 .5-1.8 1.5-2Z" />,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.2-.6L4 20l1.4-3.8A7.4 7.4 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" /><path d="M8 11.5h.1M12 11.5h.1M16 11.5h.1" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">{paths[type]}</svg>;
}

function ActionButtons({ place, mapsUrl, socialLinks }) {
  const safeLinks = socialLinks || {};
  const whatsapp = safeLinks.whatsapp ? toUrl(safeLinks.whatsapp, 'https://wa.me/') : null;
  const website = place.website ? toUrl(place.website) : null;
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {place.phone && <a href={`tel:${place.phone}`} className="rounded-full bg-[#f7b718] px-4 py-2 text-xs font-bold text-[#061c31] transition hover:bg-[#ffd45f]">☎ Call now</a>}
      {whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="rounded-full bg-[#20bd72] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#159b5b]">◉ WhatsApp</a>}
      <a href={mapsUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/60 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white hover:bg-white/20">⌖ Get directions</a>
      {website && <a href={website} target="_blank" rel="noreferrer" className="rounded-full border border-white/60 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white hover:bg-white/20">◎ Visit website</a>}
    </div>
  );
}

export default function AutomotiveBusinessPage({ place, mapsUrl, socialLinks, onShare, onReport, onDelete, onReviewPosted }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const services = place.services?.length ? place.services : DEFAULT_SERVICES;
  const gallery = place.images?.length ? place.images : [place.coverImage].filter(Boolean);
  const videos = [...(place.videos || []), ...(place.video ? [place.video] : [])].filter((video, index, items) => video && items.indexOf(video) === index);
  const rating = Number(place.rating?.average || 0).toFixed(1);
  const cover = place.coverImage || gallery[0];
  const aboutImage = place.aboutImage || place.coverImage || gallery[0];
  const website = toUrl(place.website);
  const description = place.description || `${place.name} is located at ${place.address || 'a convenient local location'}. Visit us for trusted automotive service and support.`;
  const openGallery = (index = 0) => {
    setActiveGalleryIndex(index);
    setGalleryOpen(true);
  };
  const openVideo = (index = 0) => {
    setActiveVideoIndex(index);
    setVideoModalOpen(true);
  };
  const showPreviousImage = () => setActiveGalleryIndex((index) => (index - 1 + gallery.length) % gallery.length);
  const showNextImage = () => setActiveGalleryIndex((index) => (index + 1) % gallery.length);

  return (
    <div className="bg-[#f4f8fb] text-[#102a43]">
      <BusinessHeader place={place} />
      <main>
        <section id="home" className="relative overflow-hidden bg-[#061c31]">
          {cover && <img src={cover} alt="" className="absolute right-0 top-0 h-[230px] w-full object-contain object-center opacity-90 sm:inset-y-0 sm:h-full sm:object-right sm:w-[62%]" style={{ maskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,.18) 12%, #000 31%, #000 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,.18) 12%, #000 31%, #000 100%)' }} />}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,28,49,.18)_0%,#061c31_48%,#061c31_100%)] sm:bg-[linear-gradient(90deg,#061c31_0%,#061c31_39%,rgba(6,28,49,.72)_47%,rgba(6,28,49,.16)_66%,rgba(6,28,49,.04)_100%)]" />
          <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-end gap-8 px-5 pb-12 pt-[250px] sm:min-h-[470px] sm:items-center sm:px-8 sm:py-14 lg:grid-cols-[1fr_0.9fr]">
            <div className="max-w-xl text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f7b718]">Drive better · Drive safer</p>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">{place.name}</h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">{description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs"><span className="text-lg text-[#f7b718]">★</span><strong>{rating}</strong><span>({place.rating?.count || 0} reviews)</span>{place.verified && <span className="rounded-full bg-[#20bd72] px-3 py-1 font-semibold">✓ Verified business</span>}</div>
              <p className="mt-3 text-xs text-white/75">⌖ {place.address}</p>
              <ActionButtons place={place} mapsUrl={mapsUrl} socialLinks={socialLinks} />
            </div>
            <div className="relative hidden min-h-[310px] items-end justify-end lg:flex">
              <div className="absolute right-0 top-2 max-w-[180px] rotate-[-7deg] text-right font-display text-3xl italic leading-none text-white">Keep Your<br /><span className="text-[#f7b718]">Ride in<br />Top Shape</span></div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#d9e2ec] bg-white"><div className="mx-auto grid max-w-7xl divide-y divide-[#d9e2ec] sm:grid-cols-4 sm:divide-x sm:divide-y-0">{[['⚒', 'Expert Technicians', 'Skilled & Certified Team'], ['⬟', 'Trusted Service', 'Honest & Transparent'], ['▣', '10+ Years Experience', 'In Automotive Service'], ['★', '1000+ Happy Customers', 'Across the city']].map(([icon, title, text]) => <div key={title} className="flex items-center gap-3 px-5 py-4"><span className="text-2xl text-[#0b3a5b]">{icon}</span><div><p className="text-xs font-bold">{title}</p><p className="mt-1 text-[10px] text-[#60758a]">{text}</p></div></div>)}</div></section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1.2fr_.9fr] lg:items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f0a900]">About us</p><h2 className="mt-2 font-display text-3xl font-semibold">Driven by Passion,<br />Built for Performance</h2><p className="mt-4 text-sm leading-relaxed text-[#60758a]">{description}</p><a href="#contact" className="mt-5 inline-flex rounded-full bg-[#061c31] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0b3a5b]">Learn more →</a></div>
          {aboutImage && <img src={aboutImage} alt={`${place.name} about us`} className="h-64 w-full rounded object-contain" />}
          <div className="grid gap-4">
            {[['🚗', 'Multi-Brand Service Center', 'All major car brands under one roof'], ['⚙', 'Genuine Spare Parts', 'Original parts for better performance'], ['◉', 'Advanced Diagnostics', 'Accurate & quick issue detection'], ['⬟', 'Customer Satisfaction', 'Our priority, always']].map(([icon, title, text]) => (
              <div key={title} className="flex items-center gap-3 border-b border-[#d9e2ec] pb-3 last:border-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf2f7] text-lg text-[#0b3a5b]" aria-hidden="true">{icon}</span>
                <div><p className="text-xs font-bold text-[#102a43]">{title}</p><p className="mt-1 text-[10px] text-[#60758a]">{text}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="bg-white py-12"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f0a900]">Our services</p><div className="flex items-end justify-between gap-4"><h2 className="mt-2 font-display text-3xl font-semibold">Comprehensive Car Care Services</h2></div><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{services.map((service, index) => <div key={service} className="group flex min-h-[150px] flex-col justify-between rounded-xl border border-[#d9e2ec] bg-[#f8fbfd] p-4 text-center transition hover:-translate-y-1 hover:border-[#f7b718] hover:shadow-lg"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#061c31] text-2xl text-[#f7b718] shadow-sm">{getServiceIcon(service)}</div><div className="mt-3"><p className="text-xs font-bold text-[#102a43]">{service}</p><p className="mt-1 text-[10px] text-[#60758a]">Professional service</p></div></div>)}</div></div></section>

        <section id="gallery" className="bg-[#061c31] py-12 text-white"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="grid gap-8 lg:grid-cols-[.8fr_1.5fr] lg:items-end"><div className="lg:pb-1"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7b718]">Photo gallery</p><h2 className="mt-2 font-display text-3xl font-semibold">Our Work Speaks for Itself</h2><p className="mt-2 text-sm text-white/70">A glimpse of our workshop, service bays and happy customers.</p>{gallery.length > 0 && <button type="button" onClick={() => openGallery(0)} className="mt-5 rounded-full border border-white/60 px-4 py-2 text-xs font-bold text-white transition hover:border-[#f7b718] hover:bg-[#f7b718] hover:text-[#061c31]">View All Photos →</button>}</div><div>{gallery.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{gallery.slice(0, 8).map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => openGallery(index)} className="overflow-hidden text-left"><img src={image} alt={`${place.name} gallery ${index + 1}`} className="h-40 w-full object-contain transition duration-300" /></button>)}</div> : <p className="mt-5 text-sm text-white/60">Gallery images will appear here when added by the business.</p>}</div></div></div></section>

        {videos.length > 0 && <section id="videos" className="bg-white py-12"><div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[.8fr_1.5fr] lg:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f0a900]">Video showcase</p><h2 className="mt-2 font-display text-3xl font-semibold">Watch Our Service In Action</h2><p className="mt-3 text-sm leading-relaxed text-[#60758a]">See how we keep every vehicle running at its best.</p></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{videos.map((video, index) => <div key={`${video}-${index}`} className="overflow-hidden border border-[#d9e2ec] bg-[#f8fbfd]"><iframe title={`${place.name} service video ${index + 1}`} src={getVideoEmbedUrl(video)} className="h-44 w-full border-0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /><p className="px-3 py-2 text-xs font-semibold text-[#102a43]">{place.name} service video {index + 1}</p></div>)}</div></div></section>}

        {galleryOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061c31]/95 p-5 sm:p-10" role="dialog" aria-modal="true" aria-label={`${place.name} photo gallery`}><div className="w-full max-w-6xl"><div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7b718]">Photo gallery</p><p className="mt-1 text-sm text-white/70">{activeGalleryIndex + 1} of {gallery.length}</p></div><button type="button" onClick={() => setGalleryOpen(false)} className="rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#f7b718] hover:text-[#f7b718]" aria-label="Close photo gallery">Close ×</button></div><div className="relative mt-5 flex items-center justify-center"><button type="button" onClick={showPreviousImage} className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-[#061c31]/80 text-2xl text-white transition hover:border-[#f7b718] hover:text-[#f7b718]" aria-label="Previous image">‹</button><img src={gallery[activeGalleryIndex]} alt={`${place.name} gallery ${activeGalleryIndex + 1}`} className="max-h-[72vh] w-full object-contain" /><button type="button" onClick={showNextImage} className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-[#061c31]/80 text-2xl text-white transition hover:border-[#f7b718] hover:text-[#f7b718]" aria-label="Next image">›</button></div><div className="mt-5 flex gap-2 overflow-x-auto pb-2">{gallery.map((image, index) => <button type="button" key={`${image}-thumb-${index}`} onClick={() => setActiveGalleryIndex(index)} className={`shrink-0 overflow-hidden border-2 ${index === activeGalleryIndex ? 'border-[#f7b718]' : 'border-transparent opacity-65 hover:opacity-100'}`}><img src={image} alt={`${place.name} thumbnail ${index + 1}`} className="h-16 w-24 object-contain" /></button>)}</div></div></div>}

        <section id="reviews" className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><div className="rounded border border-[#d9e2ec] bg-white p-5 sm:p-8"><ReviewsSection placeId={place._id} onReviewPosted={onReviewPosted} /></div></section>

        <section id="contact" className="bg-white py-12"><div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-2"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f0a900]">Location & contact</p><h2 className="mt-2 font-display text-3xl font-semibold">Ready to help keep you moving.</h2><p className="mt-4 text-sm leading-relaxed text-[#60758a]">{place.address}</p>{place.phone && <a href={`tel:${place.phone}`} className="mt-4 block text-sm font-semibold text-[#0b3a5b] hover:text-[#f0a900]">☎ {place.phone}</a>}{place.email && <a href={`mailto:${place.email}`} className="mt-2 block text-sm text-[#0b3a5b] hover:text-[#f0a900]">✉ {place.email}</a>}<div className="mt-5 flex flex-wrap gap-2"><FavoriteButton placeId={place._id} /><button type="button" onClick={onShare} className="rounded-full border border-[#d9e2ec] px-4 py-2 text-xs font-semibold transition hover:border-[#f7b718]">↗ Share</button><button type="button" onClick={onReport} className="rounded-full border border-[#d9e2ec] px-4 py-2 text-xs font-semibold transition hover:border-[#f7b718]">⚑ Report</button></div></div><iframe title={`Map showing ${place.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(place.address)}&output=embed`} className="h-64 w-full border-0" loading="lazy" /></div></section>
      </main>
      <BusinessFooter place={place} socialLinks={socialLinks} />
    </div>
  );
}

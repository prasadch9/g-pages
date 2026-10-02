import React, { useMemo, useState } from 'react';
import ReviewsSection from '../../../components/ReviewsSection';
import { getProfileData, ImageFrame } from '../../../components/public/PublicProfileShared';
import { getWhatsAppUrl } from '../../healthcare-medical/healthcareUtils';

const serviceDefaults = [
  ['Wedding Catering', 'Traditional and modern wedding menus'],
  ['Birthday Parties', 'Delicious food for memorable celebrations'],
  ['Corporate Events', 'Professional catering for business events'],
  ['House Functions', 'Home-style authentic cuisine'],
  ['Outdoor Catering', 'Fresh service for open-air events'],
  ['Special Menu', 'Customizable vegetarian and non-vegetarian menus'],
];

const menuDefaults = [
  { name: 'Paneer Butter Masala', category: 'Main Course', dietType: 'Veg' },
  { name: 'Veg Biryani', category: 'Main Course', dietType: 'Veg' },
  { name: 'Chicken Biryani', category: 'Main Course', dietType: 'Non-Veg' },
  { name: 'Mutton Curry', category: 'Main Course', dietType: 'Non-Veg' },
  { name: 'Prawn Fry', category: 'Starters', dietType: 'Non-Veg' },
  { name: 'Veg Thali', category: 'Main Course', dietType: 'Veg' },
  { name: 'South Indian Meals', category: 'Main Course', dietType: 'Veg' },
  { name: 'Traditional Desserts', category: 'Desserts', dietType: 'Veg' },
];

const menuFilters = ['All', 'Veg', 'Non-Veg', 'Starters', 'Main Course', 'Desserts', 'Beverages'];
const featureItems = [
  ['✿', 'Hygienic Kitchen'],
  ['♜', 'Experienced Chefs'],
  ['✧', 'Quality Ingredients'],
  ['▦', 'Modern Equipment'],
  ['☷', 'Customized Menu'],
  ['◷', 'On-Time Delivery'],
  ['♟', 'Well Trained Staff'],
  ['▤', 'Large Scale Catering'],
];
const whyChooseItems = ['Quality Ingredients', 'Experienced Chefs', 'Custom Menu Options', 'Hygienic Preparation', 'Timely Service'];
const videoTitleDefaults = ['Wedding Catering Highlight', 'Live Cooking', 'Corporate Event', 'Birthday Party'];

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  return value ? [value] : [];
};
const firstPopulatedList = (...values) => values.map(toList).find((items) => items.length) || [];
const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
const mediaSource = (item) => typeof item === 'string' ? item : item?.url || item?.src || item?.image || '';
const mediaCategory = (item) => typeof item === 'object' ? normalize(item.category || item.type) || 'others' : 'others';
const ensureUrl = (value) => value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : '';
const getAddress = (place) => [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name].filter(Boolean).join(', ');
const usableHours = (value) => toList(value).filter((hour) => hour?.day && (hour.open || hour.close || hour.closed));

function getVideoSource(video) {
  const url = video?.url || video?.src || '';
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const youtubeId = parsed.hostname.includes('youtu.be')
      ? parsed.pathname.slice(1).split('/')[0]
      : parsed.searchParams.get('v') || parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];
    if (youtubeId) return { type: 'embed', src: `https://www.youtube.com/embed/${youtubeId}?autoplay=1` };
    const vimeoId = parsed.pathname.match(/\/(?:video\/)?(\d+)/)?.[1];
    if (parsed.hostname.includes('vimeo.com') && vimeoId) return { type: 'embed', src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1` };
    const driveId = parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
    if (parsed.hostname.includes('drive.google.com') && driveId) return { type: 'embed', src: `https://drive.google.com/file/d/${driveId}/preview` };
    return { type: 'video', src: url };
  } catch {
    return { type: 'video', src: ensureUrl(url) };
  }
}

function isMenuItemForFilter(item, filter) {
  if (filter === 'All') return true;
  const tags = [item.category, item.type, item.dietType, item.foodType, item.kind].map(normalize).filter(Boolean);
  if (filter === 'Veg') return tags.some((tag) => tag === 'veg' || tag === 'vegetarian') && !tags.some((tag) => tag.includes('non veg') || tag.includes('non vegetarian'));
  if (filter === 'Non-Veg') return tags.some((tag) => tag.includes('non veg') || tag.includes('non vegetarian') || tag === 'nonveg');
  const target = normalize(filter);
  return tags.some((tag) => tag === target || tag.includes(target));
}

function MenuCard({ item, image, fallback }) {
  const name = typeof item === 'string' ? item : item.name || item.title || 'Menu selection';
  const description = typeof item === 'object' ? item.description : '';
  const price = typeof item === 'object' ? item.price : '';
  const category = typeof item === 'object' ? item.category || item.dietType || item.type : '';
  const isNonVeg = normalize(item.dietType || item.foodType || item.type || item.category).includes('non veg');
  return (
    <article className="overflow-hidden rounded-lg border border-[#f0e2e7] bg-white shadow-[0_8px_20px_rgba(73,18,43,.06)] transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(180,18,80,.12)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f7eee8]">
        {image ? <ImageFrame src={mediaSource(image)} alt={name} /> : <div className="grid h-full place-items-center text-4xl text-[#ad7137]">♨</div>}
        <span className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-white/95 px-2 py-1 text-[9px] font-bold ${isNonVeg ? 'text-[#ad252d]' : 'text-[#217b45]'}`}><span className={`h-2 w-2 rounded-full ${isNonVeg ? 'bg-[#b52a31]' : 'bg-[#25884d]'}`} />{category || (fallback ? 'Menu selection' : 'Menu')}</span>
      </div>
      <div className="p-3"><div className="flex items-start justify-between gap-2"><h3 className="text-xs font-bold leading-5 text-[#4b2435]">{name}</h3>{price && <span className="shrink-0 text-xs font-bold text-[#a6104c]">{price}</span>}</div>{description && <p className="mt-1 text-[11px] leading-4 text-[#755e67]">{description}</p>}</div>
    </article>
  );
}

function CateringVideoModal({ video, onClose }) {
  const source = getVideoSource(video);
  if (!source) return null;
  return (
    <div role="presentation" className="fixed inset-0 z-[70] grid place-items-center bg-[#170b13]/90 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-label={video.title || 'Catering video'} className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close video" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-xl text-white">×</button>
        <div className="aspect-video">{source.type === 'embed' ? <iframe src={source.src} title={video.title || 'Catering video'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full border-0" /> : <video src={source.src} controls autoPlay playsInline className="h-full w-full" />}</div>
        <p className="px-4 py-3 text-sm font-semibold text-white">{video.title || 'Catering video'}</p>
      </section>
    </div>
  );
}

export default function CateringServicesPublicPage({ place }) {
  const profile = getProfileData(place);
  const specific = place.attributes?.businessProfile?.categorySpecific || {};
  const common = place.attributes?.businessProfile?.common || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuFilter, setMenuFilter] = useState('All');
  const [lightboxImage, setLightboxImage] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const portfolio = toList(specific.portfolio);
  const portfolioImages = portfolio.map((item) => {
    if (typeof item === 'string') return item;
    const url = item.image || item.url || item.photo;
    return url ? { url, category: item.category } : null;
  }).filter(Boolean);
  const gallery = useMemo(() => {
    const source = profile.gallery?.length ? profile.gallery : place.images?.length ? place.images : portfolioImages;
    return source.map((image, index) => ({ src: mediaSource(image), category: mediaCategory(image), index })).filter((item) => item.src).slice(0, 10);
  }, [place.images, profile.gallery, portfolioImages]);

  const videoSource = profile.videos?.length ? profile.videos : place.videos?.length ? place.videos : place.video ? place.video : [];
  const videos = toList(videoSource).map((video) => typeof video === 'string' ? { url: video } : video).filter((video) => video?.url || video?.src);
  const savedServices = firstPopulatedList(specific.services, specific.selectedOptions, place.services, profile.services);
  const services = savedServices.length ? savedServices : serviceDefaults.map(([name, description]) => ({ name, description }));
  const savedMenu = firstPopulatedList(specific.menuItems, profile.menuItems);
  const menuItems = savedMenu.length ? savedMenu : menuDefaults;
  const visibleMenu = menuItems.filter((item) => isMenuItemForFilter(typeof item === 'string' ? { name: item } : item, menuFilter));

  const businessName = place.name || common.businessName || 'Catering Services';
  const tagline = profile.tagline || place.tagline || '';
  const about = place.description || profile.about || 'A trusted catering team serving quality food for celebrations, family gatherings and events.';
  const phone = place.phone || profile.phone || common.phone || '';
  const whatsappValue = place.socialLinks?.whatsapp || profile.socialMedia?.whatsapp || profile.whatsapp || phone;
  const whatsappUrl = getWhatsAppUrl(whatsappValue);
  const callUrl = phone ? `tel:${String(phone).replace(/\s+/g, '')}` : '';
  const email = place.email || profile.email || common.email || '';
  const logo = profile.logo || place.logo || '';
  const heroImage = profile.coverImage || place.coverImage || gallery[0]?.src || '';
  const aboutImage = profile.aboutImage || specific.aboutImage || gallery[1]?.src || gallery[0]?.src || heroImage;
  const socialLinks = profile.socialMedia || place.socialLinks || {};
  const hoursSource = toList(profile.openingHours).length ? profile.openingHours : place.workingHours || [];
  const hours = usableHours(hoursSource);
  const location = getAddress(place);
  const mapUrl = location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : '';
  const yearsExperience = specific.yearsExperience || profile.yearsExperience;
  const eventsServed = specific.eventsServed || specific.eventsCompleted || specific.eventsOrganized;
  const happyCustomers = specific.happyCustomers || specific.customersServed;
  const ratingAverage = Number(place.rating?.average || 0);
  const reviewCount = Number(place.rating?.count || 0);
  const featureValues = firstPopulatedList(specific.features, profile.infrastructure);
  const navItems = [['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Menu', '#menu'], ['Gallery', '#gallery'], ['Contact', '#contact']];

  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#3b2930]">
      <header className="sticky top-0 z-40 border-b border-[#f0e2e6] bg-white/95 shadow-sm backdrop-blur">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-2.5 sm:px-7">
          <a href="#home" className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-[#efdae1] bg-[#fff7f8]">{logo ? <ImageFrame src={logo} alt={`${businessName} logo`} /> : <span className="font-display text-xl font-bold text-[#a20d46]">{businessName.slice(0, 1)}</span>}</div>
            <div className="min-w-0"><p className="truncate font-display text-lg font-bold text-[#8d1639] sm:text-xl">{businessName}</p><p className="truncate text-[10px] text-[#6f5b60]">{tagline || 'Catering Services'}</p></div>
          </a>
          <nav className="hidden items-center gap-6 text-xs font-semibold lg:flex xl:gap-8">{navItems.map(([label, href], index) => <a key={href} href={href} className={`relative py-3 transition-colors after:absolute after:bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-transform ${index === 0 ? 'text-[#c20d54] after:scale-x-100 after:bg-[#c20d54]' : 'after:scale-x-0 after:bg-[#c20d54] hover:text-[#c20d54] hover:after:scale-x-100'}`}>{label}</a>)}</nav>
          <div className="hidden items-center gap-2 md:flex"><a href="/" className="hidden shrink-0 rounded-full border border-current/20 px-3 py-1.5 text-[11px] font-bold md:inline-flex">← Back to G-Pages</a>{phone && <a href={callUrl} className="inline-flex items-center gap-2 rounded-md border border-[#edbfce] px-3 py-2 text-xs font-bold text-[#49222d]"><span className="text-base text-[#ba154a]">☎</span><span>Call Now<br /><span className="font-medium">{phone}</span></span></a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#10a85a] px-3 py-2 text-xs font-bold text-white"><span className="text-base">◉</span> WhatsApp</a>}</div>
          <button type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)} className="rounded border border-[#ead8df] px-3 py-2 text-lg lg:hidden">☰</button>
        </div>
        {menuOpen && <nav className="border-t border-[#f0e2e6] bg-white px-4 py-2 lg:hidden">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-[#f8edf0] py-3 text-sm font-semibold last:border-0">{label}</a>)}<div className="flex gap-2 py-3">{phone && <a href={callUrl} className="flex-1 rounded bg-[#b51249] p-2 text-center text-xs font-bold text-white">Call Now</a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded bg-[#10a85a] p-2 text-center text-xs font-bold text-white">WhatsApp</a>}</div></nav>}
      </header>

      <main>
        <section id="home" className="relative isolate overflow-hidden bg-[#251920] text-white">
          <div className="absolute inset-0">{heroImage && <ImageFrame src={heroImage} alt={`${businessName} catering hero`} eager />}<div className="absolute inset-0 bg-gradient-to-r from-[#1e1216]/95 via-[#281719]/75 to-[#281719]/25" /></div>
          <div className="relative mx-auto grid min-h-[500px] max-w-[1500px] items-center gap-7 px-5 py-10 sm:min-h-[560px] sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-12">
            <div className="max-w-[650px]"><p className="text-[10px] font-extrabold uppercase tracking-[.28em] text-[#f7cf6c]">TRADITIONAL TASTE, PERFECTLY SERVED</p><h1 className="mt-4 font-display text-5xl font-bold leading-[.98] sm:text-6xl lg:text-[68px]">Delicious Food<br />For Your<br /><span className="text-[#ffd36b]">Special Moments</span></h1><p className="mt-4 max-w-lg text-sm font-medium leading-6 text-white/90 sm:text-base">Wedding Catering | Birthday Parties | Corporate Events<br />House Functions | Outdoor Catering | and More...</p>{about && <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">{about}</p>}<div className="mt-6 flex flex-wrap gap-3"><a href="#contact" className="rounded-md bg-[#b51249] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/20">Get a Quote <span aria-hidden="true">→</span></a><a href="#menu" className="rounded-md border border-white/80 bg-white/10 px-5 py-3 text-sm font-bold text-white">View Menu</a></div><div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold text-white/90 sm:text-xs">{[['✿', 'Hygienic Food'], ['♟', 'Experienced Team'], ['☷', 'Custom Menu'], ['◷', 'On-Time Service']].map(([icon, text]) => <span key={text} className="inline-flex items-center gap-1.5"><span className="text-base text-[#f8d16e]">{icon}</span>{text}</span>)}</div></div>
            <div className="relative hidden min-h-[380px] lg:block">{heroImage && <div className="absolute inset-4 overflow-hidden rounded-xl border-2 border-white/80 shadow-2xl"><ImageFrame src={heroImage} alt={`${businessName} buffet`} /></div>}{gallery.slice(0, 3).map((item, index) => <button key={item.src} type="button" onClick={() => setLightboxImage(item.src)} className={`absolute z-10 w-[46%] overflow-hidden rounded-lg border-2 border-white shadow-xl transition hover:-translate-y-1 ${index === 0 ? 'right-0 top-4 rotate-2' : index === 1 ? 'bottom-10 right-2 -rotate-1' : 'bottom-0 left-0 rotate-1'}`}><ImageFrame src={item.src} alt={`${businessName} food gallery ${index + 1}`} className="h-32 w-full object-cover xl:h-40" /></button>)}{!heroImage && gallery.length === 0 && <div className="absolute inset-8 grid place-items-center rounded-xl border border-white/20 bg-white/5 text-center text-sm text-white/70">Add catering photos to showcase your menu</div>}</div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-[1500px] gap-5 px-4 py-7 sm:px-7 lg:grid-cols-[.9fr_1.15fr_.75fr] lg:items-center">
          <div className="relative min-h-[220px] overflow-hidden rounded-xl bg-[#f7ece7] sm:min-h-[270px]">{aboutImage ? <ImageFrame src={aboutImage} alt={`${businessName} kitchen and catering team`} /> : <div className="grid h-full min-h-[220px] place-items-center text-5xl text-[#ab6b35]">♨</div>}</div>
          <div className="py-2"><p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#bd174b]">ABOUT US</p><h2 className="mt-2 font-display text-3xl font-bold text-[#64152f] sm:text-4xl">About Us <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-3 text-sm leading-6 text-[#6a555d]">{about}</p><a href="#contact" className="mt-4 inline-flex rounded-md bg-[#b51249] px-4 py-2.5 text-xs font-bold text-white">Know More About Us →</a><div className="mt-5 flex flex-wrap gap-5">{yearsExperience && <div><p className="font-display text-xl font-bold text-[#4a2732]">{yearsExperience}+</p><p className="text-[10px] text-[#79636b]">Years of Experience</p></div>}{happyCustomers && <div><p className="font-display text-xl font-bold text-[#4a2732]">{happyCustomers}+</p><p className="text-[10px] text-[#79636b]">Happy Customers</p></div>}{eventsServed && <div><p className="font-display text-xl font-bold text-[#4a2732]">{eventsServed}+</p><p className="text-[10px] text-[#79636b]">Events Served</p></div>}{reviewCount > 0 && <div><p className="font-display text-xl font-bold text-[#4a2732]">{ratingAverage.toFixed(1)} / 5</p><p className="text-[10px] text-[#79636b]">Customer Rating</p></div>}</div></div>
          <aside className="rounded-xl bg-[#fff4f6] p-4 shadow-[0_10px_24px_rgba(100,20,48,.07)]"><div className="border-b border-[#efdde3] pb-3"><h3 className="text-sm font-bold text-[#522335]">Our Vision</h3><p className="mt-1 text-xs leading-5 text-[#745f66]">{specific.vision || 'To serve the best food and create unforgettable moments.'}</p></div><div className="border-b border-[#efdde3] py-3"><h3 className="text-sm font-bold text-[#522335]">Our Mission</h3><p className="mt-1 text-xs leading-5 text-[#745f66]">{specific.mission || 'To provide delicious, hygienic and affordable catering with excellent service.'}</p></div><div className="pt-3"><h3 className="text-sm font-bold text-[#522335]">Why Choose Us</h3><ul className="mt-2 space-y-1 text-[11px] leading-4 text-[#745f66]">{whyChooseItems.map((item) => <li key={item}><span className="mr-1 text-[#bd174b]">✓</span>{item}</li>)}</ul></div></aside>
        </section>

        <section id="services" className="bg-[#fff8f8] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#94183d]">Our Catering Services <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745e66]">We cater for every occasion with a wide range of menu options.</p></div><a href="#services" className="hidden rounded-md border border-[#d88ea8] px-3 py-2 text-xs font-bold text-[#a20d46] sm:inline-flex">View All Services →</a></div><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{services.slice(0, 6).map((item, index) => { const title = typeof item === 'string' ? item : item.name || item.title || serviceDefaults[index % serviceDefaults.length][0]; const description = typeof item === 'object' && item.description ? item.description : serviceDefaults.find(([name]) => normalize(name) === normalize(title))?.[1] || `Freshly prepared ${title.toLowerCase()} for your occasion.`; const image = typeof item === 'object' ? item.image || item.photo : ''; const photo = image || gallery[index % Math.max(gallery.length, 1)]?.src; return <article key={`${title}-${index}`} className="group overflow-hidden rounded-lg border border-[#f0e1e5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[16/10] overflow-hidden bg-[#f6ece7]">{photo ? <ImageFrame src={mediaSource(photo)} alt={title} className="transition duration-300 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-3xl text-[#b07339]">{['♨', '✿', '▦', '⌂', '♨', '✧'][index % 6]}</div>}<span className="absolute bottom-2 left-2 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-lg text-[#bd174b]">{['♨', '♧', '▦', '⌂', '✿', '✧'][index % 6]}</span></div><div className="p-3"><h3 className="text-xs font-bold leading-5 text-[#4d2635]">{title}</h3><p className="mt-1 text-[10px] leading-4 text-[#755f67]">{description}</p></div></article>; })}</div></div></section>

        <section id="menu" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#94183d]">Our Menu <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745e66]">Explore our delicious menu options</p></div><div className="flex flex-wrap gap-1.5">{menuFilters.map((filter) => <button key={filter} type="button" aria-pressed={menuFilter === filter} onClick={() => setMenuFilter(filter)} className={`rounded-md px-3 py-2 text-[10px] font-semibold transition ${menuFilter === filter ? 'bg-[#b51249] text-white' : 'border border-[#eadde1] bg-white text-[#4b313a] hover:border-[#b51249]'}`}>{filter}</button>)}</div></div>{!savedMenu.length && <p className="mt-2 text-[10px] text-[#806a72]">Sample selections. Ask us for the current menu.</p>}<div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">{visibleMenu.map((item, index) => { const image = typeof item === 'object' ? item.image || item.photo : ''; const photo = image || gallery[index % Math.max(gallery.length, 1)]?.src; return <MenuCard key={`${typeof item === 'string' ? item : item.name || item.title}-${index}`} item={item} image={photo} fallback={!savedMenu.length} />; })}</div>{visibleMenu.length === 0 && <p className="mt-4 rounded-md bg-[#fff8f8] p-5 text-sm text-[#755f67]">No menu items match this filter.</p>}<a href="#menu" className="mt-4 inline-flex rounded-md border border-[#d88ea8] px-4 py-2 text-xs font-bold text-[#a20d46]">View Full Menu →</a></section>

        <section id="gallery" className="bg-[#fff9f8] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#94183d]">Gallery <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745e66]">A glimpse of recent catering events</p></div><a href="#gallery" className="rounded-md border border-[#d88ea8] px-3 py-2 text-[10px] font-bold text-[#a20d46]">▣ View All Photos ({gallery.length})</a></div>{gallery.length ? <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">{gallery.map((item) => <button key={`${item.src}-${item.index}`} type="button" onClick={() => setLightboxImage(item.src)} className="aspect-[4/3] overflow-hidden rounded-lg bg-[#f4e7e1] shadow-sm"><ImageFrame src={item.src} alt={`${businessName} catering photo ${item.index + 1}`} className="transition duration-300 hover:scale-105" /></button>)}</div> : <p className="mt-4 rounded-lg bg-white p-5 text-sm text-[#755f67]">Catering photos have not been added yet.</p>}</div></section>

        <section id="videos" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#94183d]">Videos <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745e66]">Watch event highlights and cooking specials</p></div><a href="#videos" className="rounded-md border border-[#d88ea8] px-3 py-2 text-xs font-bold text-[#a20d46]">▶ View All Videos</a></div>{videos.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{videos.slice(0, 8).map((video, index) => { const image = video.thumbnail || video.image || gallery[index % Math.max(gallery.length, 1)]?.src || ''; return <button key={`${video.url || video.src}-${index}`} type="button" onClick={() => setActiveVideo(video)} className="group overflow-hidden rounded-lg border border-[#f0e1e5] bg-white text-left shadow-sm"><div className="relative aspect-video overflow-hidden bg-[#3d221f]">{image && <ImageFrame src={mediaSource(image)} alt={video.title || videoTitleDefaults[index % videoTitleDefaults.length]} className="transition duration-300 group-hover:scale-105" />}<span className="absolute inset-0 grid place-items-center bg-black/15"><span className="grid h-12 w-12 place-items-center rounded-full border border-white/80 bg-[#a91545]/90 pl-1 text-lg text-white shadow-lg">▶</span></span>{video.duration && <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-1 text-[10px] font-bold text-white">{video.duration}</span>}</div><span className="block truncate px-3 py-2.5 text-xs font-bold text-[#4b2435]">{video.title || videoTitleDefaults[index % videoTitleDefaults.length]}</span></button>; })}</div> : <p className="mt-4 rounded-lg bg-[#fff8f8] p-5 text-sm text-[#755f67]">Event videos have not been added yet.</p>}</section>

        <section id="features" className="bg-[#fff9f7] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><h2 className="font-display text-3xl font-bold text-[#94183d]">Features &amp; Infrastructure <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745e66]">Our facilities for a better catering experience</p><div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">{featureItems.map(([icon, title], index) => { const savedFeature = featureValues.find((item) => normalize(typeof item === 'string' ? item : item.name || item.title) === normalize(title)); const label = typeof savedFeature === 'string' ? savedFeature : savedFeature?.name || savedFeature?.title || title; return <article key={title} className={`rounded-lg border border-[#f1e5e8] p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${['bg-[#fff7ed]', 'bg-[#f0f7ed]', 'bg-[#fff0f5]', 'bg-[#f2f0fa]'][index % 4]}`}><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/85 text-xl text-[#b51249]">{icon}</span><h3 className="mt-2 text-[10px] font-bold leading-4 text-[#50333e]">{label}</h3></article>; })}</div></div></section>

        <section id="reviews" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="mb-4"><h2 className="font-display text-3xl font-bold text-[#94183d]">Customer Reviews <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745e66]">Share your experience with us</p></div><div className="rounded-xl border border-[#f0e1e5] bg-white p-3 shadow-sm sm:p-5"><ReviewsSection placeId={place._id} /></div></section>
      </main>

      <section id="contact" className="marriage-wedding-footer bg-[#35091f] px-4 py-7 text-white sm:px-7"><div className="mx-auto grid max-w-[1500px] gap-6 sm:grid-cols-2 lg:grid-cols-4"><div><h3 className="font-display text-lg font-bold">Our Location</h3><p className="mt-2 text-xs leading-5 text-white/75">{location || 'Address not provided'}</p>{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded border border-[#e2aa4e] px-3 py-2 text-[10px] font-bold text-[#ffda81]">⌖ View on Map</a>}</div><div><h3 className="font-display text-lg font-bold">Contact Details</h3><div className="mt-2 space-y-1.5 text-xs text-white/75">{phone && <a href={callUrl} className="block">☎ {phone}</a>}{email && <a href={`mailto:${email}`} className="block">✉ {email}</a>}{hours.length ? hours.map((hour) => <p key={hour.day} className="capitalize">◷ {hour.day}: {hour.closed ? 'Closed' : `${hour.open || ''}${hour.open && hour.close ? ' - ' : ''}${hour.close || ''}`}</p>) : <p>Working hours not provided</p>}</div></div><div><h3 className="font-display text-lg font-bold">Follow Us</h3><div className="mt-3 flex flex-wrap gap-2">{Object.entries(socialLinks).filter(([network, value]) => value && (network !== 'whatsapp' || whatsappUrl)).map(([network, value]) => <a key={network} href={network === 'whatsapp' ? whatsappUrl : ensureUrl(value)} target="_blank" rel="noreferrer" aria-label={network} className="grid h-9 min-w-9 place-items-center rounded bg-white/15 px-2 text-xs font-bold capitalize hover:bg-white/25">{network.slice(0, 1)}</a>)}</div><p className="mt-2 text-xs text-white/65">Stay connected for menu updates</p></div><div><h3 className="font-display text-lg font-bold">G-Pages</h3><p className="mt-2 text-xs text-white/75">Powered by G-Pages</p><p className="text-xs text-white/65">Create your business website</p><div className="mt-3 flex flex-wrap gap-2"><a href="/contact" className="rounded bg-white px-3 py-2 text-[10px] font-bold text-[#35091f]">Contact Us</a><a href="/" className="rounded bg-white px-3 py-2 text-[10px] font-bold text-[#35091f]">⌂ Back to Home</a></div></div></div></section>

      <div className="fixed bottom-3 left-1/2 z-40 w-[92%] max-w-sm -translate-x-1/2 rounded-full border border-[#f0dce3] bg-white/95 p-2 shadow-lg backdrop-blur md:hidden"><div className="flex gap-2">{phone && <a href={callUrl} className="flex-1 rounded-full bg-[#b51249] px-3 py-2.5 text-center text-xs font-bold text-white">Call</a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#10a85a] px-3 py-2.5 text-center text-xs font-bold text-white">WhatsApp</a>}</div></div>
      {lightboxImage && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={() => setLightboxImage('')}><button type="button" onClick={() => setLightboxImage('')} aria-label="Close image" className="absolute right-4 top-4 rounded bg-white px-4 py-2 text-sm font-bold text-[#4a102c]">Close</button><img src={lightboxImage} alt={`${businessName} catering photo enlarged`} className="max-h-[90vh] max-w-[94vw] rounded-lg object-contain" onClick={(event) => event.stopPropagation()} /></div>}
      {activeVideo && <CateringVideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}

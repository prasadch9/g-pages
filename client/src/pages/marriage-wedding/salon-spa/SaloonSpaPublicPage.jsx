import React, { useMemo, useState } from 'react';
import ReviewsSection from '../../../components/ReviewsSection';
import { getProfileData, ImageFrame } from '../../../components/public/PublicProfileShared';
import { getWhatsAppUrl } from '../../healthcare-medical/healthcareUtils';

const serviceDefaults = [
  ['Hair Cuts & Styling', 'Trendy haircuts, hairstyling and haircare'],
  ['Hair Treatments', 'Smoother, shinier and healthier hair'],
  ['Skin Care', 'Facials and personalized skin treatments'],
  ['Bridal Makeup', 'Complete bridal makeover packages'],
  ['Party Makeup', 'Look your best for special occasions'],
  ['Manicure & Pedicure', 'Nail care and hands and feet grooming'],
  ['Spa & Wellness', 'Relaxing spa therapies for body and mind'],
  ["Men's Grooming", 'Haircuts, beard styling and facial care'],
];

const galleryFilters = ['All', 'Hair Styling', 'Makeup', 'Skin Care', 'Spa', 'Bridal', 'Nails', "Men's Grooming"];
const galleryAliases = {
  'Hair Styling': ['hair', 'hairstyle', 'haircut'],
  Makeup: ['makeup', 'make up'],
  'Skin Care': ['skin', 'facial', 'face'],
  Spa: ['spa', 'massage', 'relaxation', 'wellness'],
  Bridal: ['bridal', 'bride', 'wedding'],
  Nails: ['nail', 'manicure', 'pedicure'],
  "Men's Grooming": ['men', 'grooming', 'beard'],
};
const featureItems = [
  ['✧', 'Modern & Stylish Interior'],
  ['✿', 'Hygienic & Sanitized Tools'],
  ['♧', 'Premium Beauty Products'],
  ['◫', 'Private Treatment Rooms'],
  ['♡', 'Relaxing Spa Area'],
  ['♟', 'Experienced Professionals'],
  ['▦', 'Comfortable Waiting Lounge'],
  ['◇', 'Affordable Packages'],
];
const whyChooseItems = ['Professional & Experienced Staff', 'Premium Branded Products', 'Hygienic & Safe Environment', 'Personalized Consultations', 'Relaxing Ambience', 'Affordable Packages'];
const videoTitleDefaults = ['Bridal Makeup Transformation', 'Hair Styling Tutorial', 'Facial Treatment Process', 'Spa Relaxation Therapy'];

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  return value ? [value] : [];
};
const firstPopulatedList = (...values) => values.map(toList).find((items) => items.length) || [];
const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
const mediaSource = (item) => typeof item === 'string' ? item : item?.url || item?.src || item?.image || '';
const mediaCategory = (item) => typeof item === 'object' ? normalize(item.category || item.type || item.name || item.title) || 'others' : 'others';
const ensureUrl = (value) => value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : '';
const getAddress = (place) => [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name].filter(Boolean).join(', ');
const availableHours = (value) => toList(value).filter((hour) => hour?.day && (hour.open || hour.close || hour.closed));

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

function SaloonVideoModal({ video, onClose }) {
  const source = getVideoSource(video);
  if (!source) return null;
  return (
    <div role="presentation" className="fixed inset-0 z-[70] grid place-items-center bg-[#09090a]/90 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-label={video.title || 'Salon video'} className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close video" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-xl text-white">×</button>
        <div className="aspect-video">{source.type === 'embed' ? <iframe src={source.src} title={video.title || 'Salon video'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full border-0" /> : <video src={source.src} controls autoPlay playsInline className="h-full w-full" />}</div>
        <p className="px-4 py-3 text-sm font-semibold text-white">{video.title || 'Salon video'}</p>
      </section>
    </div>
  );
}

function SaloonServiceCard({ item, index, gallery }) {
  const title = typeof item === 'string' ? item : item.name || item.title || serviceDefaults[index % serviceDefaults.length][0];
  const description = typeof item === 'object' && item.description
    ? item.description
    : serviceDefaults.find(([name]) => normalize(name) === normalize(title))?.[1] || `Professional ${title.toLowerCase()} care tailored to you.`;
  const image = typeof item === 'object' && (item.image || item.photo) ? item.image || item.photo : gallery[index % Math.max(gallery.length, 1)]?.src;
  return (
    <article className="group overflow-hidden rounded-xl border border-[#eee7d9] bg-white shadow-[0_10px_26px_rgba(30,25,18,.09)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(173,135,58,.2)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f2eee7]">{image ? <ImageFrame src={mediaSource(image)} alt={title} className="transition duration-300 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-4xl text-[#a88136]">✧</div>}<span className="absolute bottom-2 left-2 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-xl text-[#b48b3b] shadow">{['✂', '✧', '❀', '♡', '✿', '◇', '☼', '♙'][index % 8]}</span></div>
      <div className="p-3.5"><h3 className="font-display text-sm font-bold text-[#35251e]">{title}</h3><p className="mt-1 text-[11px] leading-5 text-[#71645b]">{description}</p></div>
    </article>
  );
}

function SaloonOfferCard({ offer, index, gallery, appointmentUrl }) {
  const title = typeof offer === 'string' ? offer : offer.name || offer.title || `Salon package ${index + 1}`;
  const image = typeof offer === 'object' ? offer.image || offer.photo || gallery[index % Math.max(gallery.length, 1)]?.src : gallery[index % Math.max(gallery.length, 1)]?.src;
  const included = toList(typeof offer === 'object' ? offer.includedServices || offer.services : []);
  return (
    <article className="overflow-hidden rounded-xl border border-[#e8dfca] bg-white shadow-[0_10px_25px_rgba(30,25,18,.08)]">
      <div className="aspect-[16/8] bg-[#eee9df]">{image && <ImageFrame src={mediaSource(image)} alt={title} />}</div>
      <div className="p-4"><h3 className="font-display text-lg font-bold text-[#34251c]">{title}</h3>{typeof offer === 'object' && offer.description && <p className="mt-2 text-sm leading-5 text-[#75675a]">{offer.description}</p>}{included.length > 0 && <p className="mt-2 text-xs leading-5 text-[#75675a]">{included.join(' · ')}</p>}<div className="mt-3 flex flex-wrap items-center gap-2">{typeof offer === 'object' && offer.originalPrice && <span className="text-xs text-[#867a6e] line-through">{offer.originalPrice}</span>}{typeof offer === 'object' && offer.price && <span className="text-sm font-bold text-[#a47c2f]">{offer.price}</span>}{typeof offer === 'object' && offer.validity && <span className="ml-auto text-[10px] text-[#867a6e]">{offer.validity}</span>}</div><a href={appointmentUrl} className="mt-4 inline-flex rounded-md bg-[#a88235] px-4 py-2 text-xs font-bold text-white">Book Appointment</a></div>
    </article>
  );
}

export default function SaloonSpaPublicPage({ place }) {
  const profile = getProfileData(place);
  const specific = place.attributes?.businessProfile?.categorySpecific || {};
  const common = place.attributes?.businessProfile?.common || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [lightboxImage, setLightboxImage] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const gallery = useMemo(() => {
    const source = profile.gallery?.length ? profile.gallery : place.images || [];
    return source.map((image, index) => ({ src: mediaSource(image), category: mediaCategory(image), index })).filter((item) => item.src).slice(0, 10);
  }, [place.images, profile.gallery]);
  const videosSource = profile.videos?.length ? profile.videos : place.videos?.length ? place.videos : place.video ? place.video : [];
  const videos = toList(videosSource).map((video) => typeof video === 'string' ? { url: video } : video).filter((video) => video?.url || video?.src);
  const savedServices = firstPopulatedList(specific.services, specific.selectedOptions, place.services, profile.services);
  const services = savedServices.length ? savedServices : serviceDefaults.map(([name, description]) => ({ name, description }));
  const savedOffers = firstPopulatedList(specific.offers, profile.offers, specific.packages, profile.packages);
  const offers = savedOffers.length ? savedOffers : (specific.membershipDescription || specific.membershipPrice ? [{ name: 'Membership Package', description: specific.membershipDescription, price: specific.membershipPrice }] : []);
  const features = firstPopulatedList(specific.features, profile.infrastructure);

  const businessName = place.name || common.businessName || 'Saloon & Spa';
  const tagline = profile.tagline || place.tagline || '';
  const about = place.description || profile.about || 'A relaxing salon and spa offering professional hair, skin, beauty and wellness services with premium products and personal care.';
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
  const hours = availableHours(hoursSource);
  const location = [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name].filter(Boolean).join(', ');
  const mapUrl = location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : '';
  const appointmentUrl = specific.appointmentUrl || profile.appointmentUrl || callUrl || whatsappUrl || '#contact';
  const yearsExperience = specific.yearsExperience || profile.yearsExperience;
  const happyClients = specific.happyClients || specific.clientsServed;
  const expertStylists = specific.expertStylists || specific.teamSize;
  const ratingAverage = Number(place.rating?.average || 0);
  const reviewCount = Number(place.rating?.count || 0);
  const visibleGallery = galleryFilter === 'All' ? gallery : gallery.filter((item) => (galleryAliases[galleryFilter] || []).some((alias) => item.category.includes(alias)));
  const navItems = [['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Gallery', '#gallery'], ['Offers', '#offers'], ['Contact', '#contact']];

  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#322b24]">
      <header className="sticky top-0 z-40 border-b border-[#eee5d5] bg-white/95 shadow-sm backdrop-blur">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-2.5 sm:px-7">
          <a href="#home" className="flex min-w-0 items-center gap-2.5"><div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-[#e9dfcb] bg-[#faf7f0]">{logo ? <ImageFrame src={logo} alt={`${businessName} logo`} /> : <span className="font-display text-xl font-bold text-[#a47c2f]">{businessName.slice(0, 1)}</span>}</div><div className="min-w-0"><p className="truncate font-display text-lg font-bold text-[#44331f] sm:text-xl">{businessName}</p><p className="truncate text-[10px] text-[#786d5d]">{tagline || 'Saloon & Spa'}</p></div></a>
          <nav className="hidden items-center gap-6 text-xs font-semibold lg:flex xl:gap-8">{navItems.map(([label, href], index) => <a key={href} href={href} className={`relative py-3 transition-colors after:absolute after:bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-transform ${index === 0 ? 'text-[#9b782e] after:scale-x-100 after:bg-[#b58b36]' : 'after:scale-x-0 after:bg-[#b58b36] hover:text-[#9b782e] hover:after:scale-x-100'}`}>{label}</a>)}</nav>
          <div className="hidden items-center gap-2 md:flex"><a href="/" className="hidden shrink-0 rounded-full border border-current/20 px-3 py-1.5 text-[11px] font-bold md:inline-flex">← Back to G-Pages</a>{phone && <a href={callUrl} className="inline-flex items-center gap-2 rounded-md border border-[#d8c291] px-3 py-2 text-xs font-bold text-[#3d3020]"><span className="text-base text-[#a27c2d]">☎</span><span>Call Now<br /><span className="font-medium">{phone}</span></span></a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#10a85a] px-3 py-2 text-xs font-bold text-white"><span className="text-base">◉</span> WhatsApp</a>}</div>
          <button type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)} className="rounded border border-[#e7dece] px-3 py-2 text-lg lg:hidden">☰</button>
        </div>
        {menuOpen && <nav className="border-t border-[#eee5d5] bg-white px-4 py-2 lg:hidden">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-[#f3eee3] py-3 text-sm font-semibold last:border-0">{label}</a>)}<div className="flex gap-2 py-3">{phone && <a href={callUrl} className="flex-1 rounded bg-[#a88235] p-2 text-center text-xs font-bold text-white">Call Now</a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded bg-[#10a85a] p-2 text-center text-xs font-bold text-white">WhatsApp</a>}</div></nav>}
      </header>

      <main>
        <section id="home" className="relative isolate overflow-hidden bg-[#171717] text-white">
          <div className="absolute inset-0">{heroImage && <ImageFrame src={heroImage} alt={`${businessName} salon and spa`} eager />}<div className="absolute inset-0 bg-gradient-to-r from-[#11100f]/95 via-[#171411]/80 to-[#191512]/30" /></div>
          <div className="relative mx-auto grid min-h-[500px] max-w-[1500px] items-center gap-7 px-5 py-10 sm:min-h-[560px] sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-12">
            <div className="max-w-[650px]"><p className="text-[10px] font-extrabold uppercase tracking-[.28em] text-[#dfbe73]">PROFESSIONAL SALON &amp; SPA SERVICES</p><h1 className="mt-4 font-display text-5xl font-bold leading-[.98] sm:text-6xl lg:text-[68px]">Relax Rejuvenate<br /><span className="text-[#e2c27a]">Look Beautiful</span></h1><p className="mt-4 max-w-lg text-sm font-medium leading-6 text-white/90 sm:text-base">Expert Hair, Skin, Beauty &amp; Spa Services<br />for a Fresher, Healthier, Happier You</p>{tagline && <p className="mt-2 text-sm text-white/70">{tagline}</p>}<div className="mt-5 flex flex-wrap gap-4 text-[10px] font-semibold text-white/90">{[['✧', 'Expert Stylists'], ['♧', 'Premium Products'], ['◇', 'Hygienic & Safe'], ['♡', 'Personalized Care']].map(([icon, label]) => <span key={label} className="inline-flex items-center gap-1.5"><span className="text-sm text-[#e2c27a]">{icon}</span>{label}</span>)}</div><div className="mt-6 flex flex-wrap gap-3"><a href={appointmentUrl} className="rounded-md bg-[#a88235] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/25">Book Appointment <span aria-hidden="true">→</span></a><a href="#services" className="rounded-md border border-[#d6bd83] bg-white/10 px-5 py-3 text-sm font-bold text-white">View Our Services</a></div></div>
            <div className="relative hidden min-h-[380px] lg:block">{heroImage && <div className="absolute inset-4 overflow-hidden rounded-xl border border-[#d3b56e] shadow-2xl"><ImageFrame src={heroImage} alt={`${businessName} beauty treatment`} /></div>}{gallery.slice(0, 3).map((item, index) => <div key={item.src} className={`absolute z-10 w-[46%] overflow-hidden rounded-lg border border-[#d4bc83] bg-[#29251e] shadow-xl ${index === 0 ? 'right-0 top-4 rotate-2' : index === 1 ? 'bottom-10 right-2 -rotate-1' : 'bottom-0 left-0 rotate-1'}`}><ImageFrame src={item.src} alt={`${businessName} salon service ${index + 1}`} className="h-28 w-full object-cover xl:h-32" /><span className="absolute bottom-0 left-0 right-0 bg-black/65 px-2 py-1 text-[10px] font-semibold text-[#f5dfaa]">{['Hair Styling', 'Skin Care', 'Bridal Makeup'][index]}</span></div>)}<div className="absolute right-[48%] top-1/2 z-10 -translate-y-1/2 -rotate-6 rounded-lg border border-[#b89953] bg-[#151411]/85 px-3 py-3 font-display text-xl italic leading-6 text-[#e4cd91] shadow-lg">Beauty<br />Care<br />Makes<br />A Happier You</div>{!heroImage && gallery.length === 0 && <div className="absolute inset-8 grid place-items-center rounded-xl border border-white/20 bg-white/5 text-center text-sm text-white/70">Add salon photos to showcase your services</div>}</div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-[1500px] gap-5 px-4 py-7 sm:px-7 lg:grid-cols-[.9fr_1.15fr_.75fr] lg:items-center">
          <div className="relative min-h-[220px] overflow-hidden rounded-xl bg-[#ede8dd] sm:min-h-[270px]">{aboutImage ? <ImageFrame src={aboutImage} alt={`${businessName} interior`} /> : <div className="grid h-full min-h-[220px] place-items-center text-5xl text-[#a88235]">✧</div>}</div>
          <div className="py-2"><p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#a88235]">ABOUT US</p><h2 className="mt-2 font-display text-3xl font-bold text-[#49351f] sm:text-4xl">About Us <span className="text-sm text-[#c39d54]">〰</span></h2><p className="mt-3 text-sm leading-6 text-[#6c6256]">{about}</p><p className="mt-2 text-xs leading-5 text-[#786e60]">Hair styling, skin treatments, bridal makeovers, grooming and wellness services in a calm, welcoming space.</p><a href="#contact" className="mt-4 inline-flex rounded-md bg-[#a88235] px-4 py-2.5 text-xs font-bold text-white">Know More About Us →</a><div className="mt-5 flex flex-wrap gap-5">{yearsExperience && <div><p className="font-display text-xl font-bold text-[#413323]">{yearsExperience}+</p><p className="text-[10px] text-[#786d5d]">Years of Experience</p></div>}{happyClients && <div><p className="font-display text-xl font-bold text-[#413323]">{happyClients}+</p><p className="text-[10px] text-[#786d5d]">Happy Clients</p></div>}{expertStylists && <div><p className="font-display text-xl font-bold text-[#413323]">{expertStylists}+</p><p className="text-[10px] text-[#786d5d]">Expert Stylists</p></div>}{reviewCount > 0 && <div><p className="font-display text-xl font-bold text-[#413323]">{ratingAverage.toFixed(1)} / 5</p><p className="text-[10px] text-[#786d5d]">Client Rating</p></div>}</div></div>
          <aside className="rounded-xl bg-[#f8f3e8] p-4 shadow-[0_10px_24px_rgba(62,48,25,.08)]"><div className="border-b border-[#e8dcc1] pb-3"><h3 className="text-sm font-bold text-[#44341f]">Our Vision</h3><p className="mt-1 text-xs leading-5 text-[#766b5d]">{specific.vision || 'To make everyone feel confident and beautiful every day.'}</p></div><div className="border-b border-[#e8dcc1] py-3"><h3 className="text-sm font-bold text-[#44341f]">Our Mission</h3><p className="mt-1 text-xs leading-5 text-[#766b5d]">{specific.mission || 'To provide high-quality, affordable beauty and wellness services with excellent care.'}</p></div><div className="pt-3"><h3 className="text-sm font-bold text-[#44341f]">Why Choose Us</h3><ul className="mt-2 space-y-1 text-[11px] leading-4 text-[#766b5d]">{whyChooseItems.map((item) => <li key={item}><span className="mr-1 text-[#a88235]">✓</span>{item}</li>)}</ul></div></aside>
        </section>

        <section id="services" className="bg-[#faf8f3] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#573c25]">Our Services <span className="text-sm text-[#b6924b]">〰</span></h2><p className="mt-1 text-xs text-[#786d60]">Discover beauty and grooming services designed for you.</p></div><a href="#services" className="hidden rounded-md border border-[#cfba87] px-3 py-2 text-xs font-bold text-[#8f6e2d] sm:inline-flex">View All Services →</a></div><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{services.slice(0, 8).map((item, index) => <SaloonServiceCard key={`${typeof item === 'string' ? item : item.name || item.title}-${index}`} item={item} index={index} gallery={gallery} />)}</div></div></section>

        <section id="gallery" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#573c25]">Gallery <span className="text-sm text-[#b6924b]">〰</span></h2><p className="mt-1 text-xs text-[#786d60]">A glimpse of our salon, spa services and happy clients.</p></div><div className="flex flex-wrap gap-1.5">{galleryFilters.map((filter) => <button key={filter} type="button" aria-pressed={galleryFilter === filter} onClick={() => setGalleryFilter(filter)} className={`rounded-md px-3 py-2 text-[10px] font-semibold transition ${galleryFilter === filter ? 'bg-[#a88235] text-white' : 'border border-[#e8e0d0] bg-white text-[#493d30] hover:border-[#a88235]'}`}>{filter}</button>)}<a href="#gallery" className="rounded-md border border-[#cbb47e] px-3 py-2 text-[10px] font-bold text-[#8f6e2d]">▣ View All Photos ({gallery.length})</a></div></div>{gallery.length ? <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">{visibleGallery.map((item) => <button key={`${item.src}-${item.index}`} type="button" onClick={() => setLightboxImage(item.src)} className="aspect-[4/3] overflow-hidden rounded-lg bg-[#eee8dc] shadow-sm"><ImageFrame src={item.src} alt={`${businessName} salon photo ${item.index + 1}`} className="transition duration-300 hover:scale-105" /></button>)}</div> : <p className="mt-4 rounded-lg bg-[#faf8f3] p-5 text-sm text-[#786d60]">Salon and spa photos have not been added yet.</p>}{gallery.length > 0 && visibleGallery.length === 0 && <p className="mt-3 text-xs text-[#786d60]">No photos are tagged for {galleryFilter}.</p>}</section>

        <section id="videos" className="bg-[#faf8f3] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#573c25]">Videos <span className="text-sm text-[#b6924b]">〰</span></h2><p className="mt-1 text-xs text-[#786d60]">Watch our salon services, makeovers and spa treatments.</p></div><a href="#videos" className="rounded-md border border-[#cfba87] px-3 py-2 text-xs font-bold text-[#8f6e2d]">▶ View All Videos</a></div>{videos.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{videos.slice(0, 8).map((video, index) => { const image = video.thumbnail || video.image || gallery[index % Math.max(gallery.length, 1)]?.src || ''; return <button key={`${video.url || video.src}-${index}`} type="button" onClick={() => setActiveVideo(video)} className="group overflow-hidden rounded-lg border border-[#e8dfce] bg-white text-left shadow-sm"><div className="relative aspect-video overflow-hidden bg-[#27231e]">{image && <ImageFrame src={mediaSource(image)} alt={video.title || videoTitleDefaults[index % videoTitleDefaults.length]} className="transition duration-300 group-hover:scale-105" />}<span className="absolute inset-0 grid place-items-center bg-black/20"><span className="grid h-12 w-12 place-items-center rounded-full border border-[#e7d199] bg-black/50 pl-1 text-lg text-[#f5dfaa] shadow-lg">▶</span></span>{video.duration && <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-1 text-[10px] font-bold text-white">{video.duration}</span>}</div><span className="block truncate px-3 py-2.5 text-xs font-bold text-[#35291e]">{video.title || videoTitleDefaults[index % videoTitleDefaults.length]}</span></button>; })}</div> : <p className="mt-4 rounded-lg bg-white p-5 text-sm text-[#786d60]">Salon and spa videos have not been added yet.</p>}</div></section>

        <section id="features" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><h2 className="font-display text-3xl font-bold text-[#573c25]">Features &amp; Infrastructure <span className="text-sm text-[#b6924b]">〰</span></h2><p className="mt-1 text-xs text-[#786d60]">Our facilities for a luxurious and comfortable experience.</p><div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">{featureItems.map(([icon, title], index) => { const savedFeature = features.find((item) => normalize(typeof item === 'string' ? item : item.name || item.title).includes(normalize(title))); const label = typeof savedFeature === 'string' ? savedFeature : savedFeature?.name || savedFeature?.title || title; return <article key={title} className={`rounded-lg border border-[#eae2d4] p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${['bg-[#f7f3e9]', 'bg-[#f4f6ef]', 'bg-[#f9eff2]', 'bg-[#f2f0ea]'][index % 4]}`}><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/85 text-xl text-[#a88235]">{icon}</span><h3 className="mt-2 text-[10px] font-bold leading-4 text-[#4a3c2b]">{label}</h3></article>; })}</div></section>

        <section id="offers" className="bg-[#faf8f3] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#573c25]">Salon Offers <span className="text-sm text-[#b6924b]">〰</span></h2><p className="mt-1 text-xs text-[#786d60]">Packages and special treatments for your next visit</p></div></div>{offers.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{offers.slice(0, 6).map((offer, index) => <SaloonOfferCard key={`${typeof offer === 'string' ? offer : offer.name || offer.title}-${index}`} offer={offer} index={index} gallery={gallery} appointmentUrl={appointmentUrl} />)}</div> : <div className="mt-4 rounded-xl border border-dashed border-[#d9ceb6] bg-white p-5 text-sm text-[#716659]">Contact us to ask about bridal, spa and grooming packages.<a href={appointmentUrl} className="ml-2 font-bold text-[#9a762f]">Enquire now →</a></div>}</div></section>

        <section id="reviews" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="mb-4"><h2 className="font-display text-3xl font-bold text-[#573c25]">Customer Reviews <span className="text-sm text-[#b6924b]">〰</span></h2><p className="mt-1 text-xs text-[#786d60]">Share your experience with us.</p></div><div className="rounded-xl border border-[#e9e1d3] bg-white p-3 shadow-sm sm:p-5"><ReviewsSection placeId={place._id} /></div></section>
      </main>

      <section id="contact" className="marriage-wedding-footer relative overflow-hidden bg-[#111110] px-4 py-7 text-white sm:px-7"><div className="pointer-events-none absolute -bottom-8 -left-5 text-7xl text-[#c4a357]/30">✿</div><div className="pointer-events-none absolute -right-4 top-2 text-6xl text-[#c4a357]/20">❀</div><div className="relative mx-auto grid max-w-[1500px] gap-6 sm:grid-cols-2 lg:grid-cols-4"><div><h3 className="font-display text-lg font-bold text-[#ecd58f]">Our Location</h3><p className="mt-2 text-xs leading-5 text-white/75">{location || 'Address not provided'}</p>{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded border border-[#bd9a4b] px-3 py-2 text-[10px] font-bold text-[#eed48e]">⌖ View on Map</a>}</div><div><h3 className="font-display text-lg font-bold text-[#ecd58f]">Contact Details</h3><div className="mt-2 space-y-1.5 text-xs text-white/75">{phone && <a href={callUrl} className="block">☎ {phone}</a>}{email && <a href={`mailto:${email}`} className="block">✉ {email}</a>}{hours.length ? hours.map((hour) => <p key={hour.day} className="capitalize">◷ {hour.day}: {hour.closed ? 'Closed' : `${hour.open || ''}${hour.open && hour.close ? ' - ' : ''}${hour.close || ''}`}</p>) : <p>Working hours not provided</p>}</div></div><div><h3 className="font-display text-lg font-bold text-[#ecd58f]">Follow Us</h3><div className="mt-3 flex flex-wrap gap-2">{Object.entries(socialLinks).filter(([network, value]) => value && (network !== 'whatsapp' || whatsappUrl)).map(([network, value]) => <a key={network} href={network === 'whatsapp' ? whatsappUrl : ensureUrl(value)} target="_blank" rel="noreferrer" aria-label={network} className="grid h-9 min-w-9 place-items-center rounded bg-white/10 px-2 text-xs font-bold capitalize hover:bg-white/20">{network.slice(0, 1)}</a>)}</div><p className="mt-2 text-xs text-white/60">Follow us for salon news, tips and offers</p></div><div><h3 className="font-display text-lg font-bold text-[#ecd58f]">G-Pages</h3><p className="mt-2 text-xs text-white/75">Powered by G-Pages</p><p className="text-xs text-white/60">Create your business website</p><div className="mt-3 flex flex-wrap gap-2"><a href="/contact" className="rounded bg-[#e3cc87] px-3 py-2 text-[10px] font-bold text-[#201b13]">Contact Us</a><a href="/" className="rounded bg-white px-3 py-2 text-[10px] font-bold text-[#201b13]">⌂ Back to Home</a></div></div></div></section>

      <div className="fixed bottom-3 left-1/2 z-40 w-[92%] max-w-sm -translate-x-1/2 rounded-full border border-[#e9dfcb] bg-white/95 p-2 shadow-lg backdrop-blur md:hidden"><div className="flex gap-2">{phone && <a href={callUrl} className="flex-1 rounded-full bg-[#a88235] px-3 py-2.5 text-center text-xs font-bold text-white">Call</a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#10a85a] px-3 py-2.5 text-center text-xs font-bold text-white">WhatsApp</a>}</div></div>
      {lightboxImage && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={() => setLightboxImage('')}><button type="button" onClick={() => setLightboxImage('')} aria-label="Close image" className="absolute right-4 top-4 rounded bg-white px-4 py-2 text-sm font-bold text-[#34251c]">Close</button><img src={lightboxImage} alt={`${businessName} spa photo enlarged`} className="max-h-[90vh] max-w-[94vw] rounded-lg object-contain" onClick={(event) => event.stopPropagation()} /></div>}
      {activeVideo && <SaloonVideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}

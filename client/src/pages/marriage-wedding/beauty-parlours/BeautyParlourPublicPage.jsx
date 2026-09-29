import React, { useMemo, useState } from 'react';
import ReviewsSection from '../../../components/ReviewsSection';
import { getProfileData, ImageFrame } from '../../../components/public/PublicProfileShared';
import { getWhatsAppUrl } from '../../healthcare-medical/healthcareUtils';

const serviceDefaults = [
  ['Bridal Makeup', 'Complete bridal makeover packages'],
  ['Party Makeup', 'Professional looks for special occasions'],
  ['Facial Treatments', 'Treatments for a healthy, radiant glow'],
  ['Hair Styling', 'Haircuts, styling and treatments'],
  ['Skin Care', 'Personalized skin care solutions'],
  ['Manicure & Pedicure', 'Nail care and beauty treatments'],
  ['Threading & Waxing', 'Smooth, comfortable hair removal'],
  ['Mehendi Art', 'Beautiful mehendi designs for your occasion'],
];

const galleryFilters = ['All', 'Bridal Makeup', 'Party Makeup', 'Facial', 'Hair Styling', 'Nails', 'Mehendi'];
const galleryAliases = {
  'Bridal Makeup': ['bridal', 'bride'],
  'Party Makeup': ['party makeup', 'party'],
  Facial: ['facial', 'skin'],
  'Hair Styling': ['hair', 'hairstyle'],
  Nails: ['nail', 'manicure', 'pedicure'],
  Mehendi: ['mehendi', 'henna'],
};
const featureItems = [
  ['✧', 'Modern & Stylish Interior'],
  ['✿', 'Hygienic Environment'],
  ['♧', 'Premium Beauty Products'],
  ['♟', 'Experienced Beauticians'],
  ['❄', 'AC & Comfortable Ambience'],
  ['▦', 'Clean Makeup Stations'],
  ['♡', 'Relaxing Waiting Area'],
  ['◇', 'Affordable Packages'],
];
const whyChooseItems = ['Certified & Experienced Staff', 'Premium Beauty Products', 'Clean & Hygienic Environment', 'Personalized Beauty Care', 'Affordable Packages', 'Bridal & Party Makeup Experts'];
const videoTitleDefaults = ['Bridal Makeup Transformation', 'Party Makeup Look', 'Facial Treatment', 'Hair Styling Tutorial'];

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

function BeautyVideoModal({ video, onClose }) {
  const source = getVideoSource(video);
  if (!source) return null;
  return (
    <div role="presentation" className="fixed inset-0 z-[70] grid place-items-center bg-[#170b13]/90 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-label={video.title || 'Beauty video'} className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close video" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-xl text-white">×</button>
        <div className="aspect-video">{source.type === 'embed' ? <iframe src={source.src} title={video.title || 'Beauty video'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full border-0" /> : <video src={source.src} controls autoPlay playsInline className="h-full w-full" />}</div>
        <p className="px-4 py-3 text-sm font-semibold text-white">{video.title || 'Beauty video'}</p>
      </section>
    </div>
  );
}

function BeautyServiceCard({ item, index, gallery }) {
  const title = typeof item === 'string' ? item : item.name || item.title || serviceDefaults[index % serviceDefaults.length][0];
  const description = typeof item === 'object' && item.description
    ? item.description
    : serviceDefaults.find(([name]) => normalize(name) === normalize(title))?.[1] || `Professional ${title.toLowerCase()} tailored to your needs.`;
  const image = typeof item === 'object' && (item.image || item.photo) ? item.image || item.photo : gallery[index % Math.max(gallery.length, 1)]?.src;
  return (
    <article className="group overflow-hidden rounded-xl border border-[#f0e1e8] bg-white shadow-[0_10px_26px_rgba(85,20,50,.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(185,15,85,.13)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f8eaf0]">{image ? <ImageFrame src={mediaSource(image)} alt={title} className="transition duration-300 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-4xl text-[#bd2770]">✿</div>}<span className="absolute bottom-2 left-2 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-xl text-[#bd1764] shadow">{['✿', '✧', '❀', '♧', '♡', '◇', '✦', '❋'][index % 8]}</span></div>
      <div className="p-3.5"><h3 className="font-display text-sm font-bold text-[#4c1838]">{title}</h3><p className="mt-1 text-[11px] leading-5 text-[#755d68]">{description}</p></div>
    </article>
  );
}

function BeautyOfferCard({ offer, index, gallery, appointmentUrl }) {
  const title = typeof offer === 'string' ? offer : offer.name || offer.title || `Beauty package ${index + 1}`;
  const image = typeof offer === 'object' ? offer.image || offer.photo || gallery[index % Math.max(gallery.length, 1)]?.src : gallery[index % Math.max(gallery.length, 1)]?.src;
  const included = toList(typeof offer === 'object' ? offer.includedServices || offer.services : []);
  return (
    <article className="overflow-hidden rounded-xl border border-[#efdee6] bg-white shadow-[0_10px_25px_rgba(90,20,50,.07)]">
      <div className="aspect-[16/8] bg-[#f8e9ef]">{image && <ImageFrame src={mediaSource(image)} alt={title} />}</div>
      <div className="p-4"><h3 className="font-display text-lg font-bold text-[#501832]">{title}</h3>{typeof offer === 'object' && offer.description && <p className="mt-2 text-sm leading-5 text-[#765d68]">{offer.description}</p>}{included.length > 0 && <p className="mt-2 text-xs leading-5 text-[#765d68]">{included.join(' · ')}</p>}<div className="mt-3 flex flex-wrap items-center gap-2">{typeof offer === 'object' && offer.originalPrice && <span className="text-xs text-[#88747c] line-through">{offer.originalPrice}</span>}{typeof offer === 'object' && offer.price && <span className="text-sm font-bold text-[#ae1457]">{offer.price}</span>}{typeof offer === 'object' && offer.validity && <span className="ml-auto text-[10px] text-[#88747c]">{offer.validity}</span>}</div><a href={appointmentUrl} className="mt-4 inline-flex rounded-md bg-[#bc145c] px-4 py-2 text-xs font-bold text-white">Book Now</a></div>
    </article>
  );
}

export default function BeautyParlourPublicPage({ place }) {
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
  const videoSource = profile.videos?.length ? profile.videos : place.videos?.length ? place.videos : place.video ? place.video : [];
  const videos = toList(videoSource).map((video) => typeof video === 'string' ? { url: video } : video).filter((video) => video?.url || video?.src);
  const savedServices = firstPopulatedList(specific.services, specific.selectedOptions, place.services, profile.services);
  const services = savedServices.length ? savedServices : serviceDefaults.map(([name, description]) => ({ name, description }));
  const offers = firstPopulatedList(specific.offers, profile.offers, specific.packages, profile.packages);
  const features = firstPopulatedList(specific.features, profile.infrastructure);

  const businessName = place.name || common.businessName || 'Beauty Parlour';
  const tagline = profile.tagline || place.tagline || '';
  const about = place.description || profile.about || 'A professional beauty studio offering makeup, hair, skin and bridal services with attention to hygiene, quality products and personalized care.';
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
  const beautyExperts = specific.beautyExperts || specific.teamSize;
  const ratingAverage = Number(place.rating?.average || 0);
  const reviewCount = Number(place.rating?.count || 0);
  const visibleGallery = galleryFilter === 'All' ? gallery : gallery.filter((item) => (galleryAliases[galleryFilter] || []).some((alias) => item.category.includes(alias)));
  const navItems = [['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Gallery', '#gallery'], ['Offers', '#offers'], ['Contact', '#contact']];

  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#3b2930]">
      <header className="sticky top-0 z-40 border-b border-[#f0e1e8] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-2.5 sm:px-7">
          <a href="#home" className="flex min-w-0 items-center gap-2.5"><div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-[#efdae4] bg-[#fff7fa]">{logo ? <ImageFrame src={logo} alt={`${businessName} logo`} /> : <span className="font-display text-xl font-bold text-[#bd1260]">{businessName.slice(0, 1)}</span>}</div><div className="min-w-0"><p className="truncate font-display text-lg font-bold text-[#9c1551] sm:text-xl">{businessName}</p><p className="truncate text-[10px] text-[#745d67]">{tagline || 'Beauty Parlour'}</p></div></a>
          <nav className="hidden items-center gap-6 text-xs font-semibold lg:flex xl:gap-8">{navItems.map(([label, href], index) => <a key={href} href={href} className={`relative py-3 transition-colors after:absolute after:bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-transform ${index === 0 ? 'text-[#c20d63] after:scale-x-100 after:bg-[#c20d63]' : 'after:scale-x-0 after:bg-[#c20d63] hover:text-[#c20d63] hover:after:scale-x-100'}`}>{label}</a>)}</nav>
          <div className="hidden items-center gap-2 md:flex">{phone && <a href={callUrl} className="inline-flex items-center gap-2 rounded-md border border-[#efb9d0] px-3 py-2 text-xs font-bold text-[#472238]"><span className="text-base text-[#c10c5b]">☎</span><span>Call Now<br /><span className="font-medium">{phone}</span></span></a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#10a85a] px-3 py-2 text-xs font-bold text-white"><span className="text-base">◉</span> WhatsApp</a>}</div>
          <button type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)} className="rounded border border-[#ead8e0] px-3 py-2 text-lg lg:hidden">☰</button>
        </div>
        {menuOpen && <nav className="border-t border-[#f0e1e8] bg-white px-4 py-2 lg:hidden">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-[#f8edf1] py-3 text-sm font-semibold last:border-0">{label}</a>)}<div className="flex gap-2 py-3">{phone && <a href={callUrl} className="flex-1 rounded bg-[#bb145e] p-2 text-center text-xs font-bold text-white">Call Now</a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded bg-[#10a85a] p-2 text-center text-xs font-bold text-white">WhatsApp</a>}</div></nav>}
      </header>

      <main>
        <section id="home" className="relative isolate overflow-hidden bg-[#f8e9ed] text-white">
          <div className="absolute inset-0">{heroImage && <ImageFrame src={heroImage} alt={`${businessName} beauty hero`} eager />}<div className="absolute inset-0 bg-gradient-to-r from-[#fff2f1]/95 via-[#fff0ef]/78 to-[#321522]/15" /></div>
          <div className="relative mx-auto grid min-h-[500px] max-w-[1500px] items-center gap-7 px-5 py-10 sm:min-h-[560px] sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-12">
            <div className="max-w-[650px] text-[#40172d]"><p className="text-[10px] font-extrabold uppercase tracking-[.28em] text-[#b21759]">PROFESSIONAL BEAUTY CARE</p><h1 className="mt-4 font-display text-5xl font-bold leading-[.98] sm:text-6xl lg:text-[68px]">Enhance Your<br /><span className="text-[#c40d63]">Natural Beauty</span></h1><p className="mt-4 max-w-lg text-sm font-medium leading-6 text-[#54263c] sm:text-base">Expert beauty services for every occasion<br />Bridal | Party | Skin | Hair | Makeup | More</p>{tagline && <p className="mt-2 text-sm text-[#71465a]">{tagline}</p>}<div className="mt-5 flex flex-wrap gap-4 text-[10px] font-semibold text-[#4d3340]">{[['✧', 'Expert Stylists'], ['♡', 'Hygienic & Safe'], ['♧', 'Premium Products'], ['✿', 'Personalized Care']].map(([icon, label]) => <span key={label} className="inline-flex items-center gap-1.5"><span className="text-sm text-[#bd1760]">{icon}</span>{label}</span>)}</div><div className="mt-6 flex flex-wrap gap-3"><a href={appointmentUrl} className="rounded-md bg-[#bd145b] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#8b123f]/20">Book Appointment <span aria-hidden="true">→</span></a><a href="#services" className="rounded-md border border-[#bb8a48] bg-white/85 px-5 py-3 text-sm font-bold text-[#431d32]">View Our Services</a></div></div>
            <div className="relative hidden min-h-[380px] lg:block">{heroImage && <div className="absolute inset-4 overflow-hidden rounded-xl border-2 border-white shadow-2xl"><ImageFrame src={heroImage} alt={`${businessName} bridal beauty`} /></div>}{gallery.slice(0, 3).map((item, index) => <button key={item.src} type="button" onClick={() => setLightboxImage(item.src)} className={`absolute z-10 w-[46%] overflow-hidden rounded-lg border-2 border-white shadow-xl transition hover:-translate-y-1 ${index === 0 ? 'right-0 top-4 rotate-2' : index === 1 ? 'bottom-10 right-2 -rotate-1' : 'bottom-0 left-0 rotate-1'}`}><ImageFrame src={item.src} alt={`${businessName} beauty gallery ${index + 1}`} className="h-32 w-full object-cover xl:h-40" /></button>)}<div className="absolute right-[48%] top-1/2 z-10 -translate-y-1/2 -rotate-6 rounded-lg bg-[#fffaf2]/90 px-3 py-3 font-display text-xl italic leading-6 text-[#6b304e] shadow-lg">Beauty<br />Care<br />Makes<br />A<br />Happier<br />You</div>{!heroImage && gallery.length === 0 && <div className="absolute inset-8 grid place-items-center rounded-xl border border-[#cfb1bb] bg-white/70 text-center text-sm text-[#765568]">Add beauty photos to showcase your work</div>}</div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-[1500px] gap-5 px-4 py-7 sm:px-7 lg:grid-cols-[.9fr_1.15fr_.75fr] lg:items-center">
          <div className="relative min-h-[220px] overflow-hidden rounded-xl bg-[#f7e8ed] sm:min-h-[270px]">{aboutImage ? <ImageFrame src={aboutImage} alt={`${businessName} salon interior`} /> : <div className="grid h-full min-h-[220px] place-items-center text-5xl text-[#bb2463]">✿</div>}</div>
          <div className="py-2"><p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#be145d]">ABOUT US</p><h2 className="mt-2 font-display text-3xl font-bold text-[#611535] sm:text-4xl">About Us <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-3 text-sm leading-6 text-[#6d5661]">{about}</p><p className="mt-2 text-xs leading-5 text-[#775f69]">Professional beauty services, experienced beauticians, quality products and personalized care for every occasion.</p><a href="#contact" className="mt-4 inline-flex rounded-md bg-[#bd145b] px-4 py-2.5 text-xs font-bold text-white">Know More About Us →</a><div className="mt-5 flex flex-wrap gap-5">{yearsExperience && <div><p className="font-display text-xl font-bold text-[#4b2234]">{yearsExperience}+</p><p className="text-[10px] text-[#79636c]">Years of Experience</p></div>}{happyClients && <div><p className="font-display text-xl font-bold text-[#4b2234]">{happyClients}+</p><p className="text-[10px] text-[#79636c]">Happy Clients</p></div>}{beautyExperts && <div><p className="font-display text-xl font-bold text-[#4b2234]">{beautyExperts}+</p><p className="text-[10px] text-[#79636c]">Beauty Experts</p></div>}{reviewCount > 0 && <div><p className="font-display text-xl font-bold text-[#4b2234]">{ratingAverage.toFixed(1)} / 5</p><p className="text-[10px] text-[#79636c]">Client Satisfaction</p></div>}</div></div>
          <aside className="rounded-xl bg-[#fff3f7] p-4 shadow-[0_10px_24px_rgba(100,20,48,.07)]"><div className="border-b border-[#efdde5] pb-3"><h3 className="text-sm font-bold text-[#52233b]">Our Vision</h3><p className="mt-1 text-xs leading-5 text-[#745d69]">{specific.vision || 'To make every woman feel beautiful, confident and empowered.'}</p></div><div className="border-b border-[#efdde5] py-3"><h3 className="text-sm font-bold text-[#52233b]">Our Mission</h3><p className="mt-1 text-xs leading-5 text-[#745d69]">{specific.mission || 'To provide high-quality beauty services with hygiene and affordable prices.'}</p></div><div className="pt-3"><h3 className="text-sm font-bold text-[#52233b]">Why Choose Us</h3><ul className="mt-2 space-y-1 text-[11px] leading-4 text-[#745d69]">{whyChooseItems.map((item) => <li key={item}><span className="mr-1 text-[#bd145b]">✓</span>{item}</li>)}</ul></div></aside>
        </section>

        <section id="services" className="bg-[#fff8fb] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#94164b]">Our Services <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">Explore our services to look and feel your best.</p></div><a href="#services" className="hidden rounded-md border border-[#d88eae] px-3 py-2 text-xs font-bold text-[#a20d50] sm:inline-flex">View All Services →</a></div><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{services.slice(0, 8).map((item, index) => <BeautyServiceCard key={`${typeof item === 'string' ? item : item.name || item.title}-${index}`} item={item} index={index} gallery={gallery} />)}</div></div></section>

        <section id="gallery" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#94164b]">Gallery <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">A glimpse of our work and happy clients.</p></div><div className="flex flex-wrap gap-1.5">{galleryFilters.map((filter) => <button key={filter} type="button" aria-pressed={galleryFilter === filter} onClick={() => setGalleryFilter(filter)} className={`rounded-md px-3 py-2 text-[10px] font-semibold transition ${galleryFilter === filter ? 'bg-[#bb145c] text-white' : 'border border-[#eadce3] bg-white text-[#503844] hover:border-[#bb145c]'}`}>{filter}</button>)}<a href="#gallery" className="rounded-md border border-[#d88eae] px-3 py-2 text-[10px] font-bold text-[#a20d50]">▣ View All Photos ({gallery.length})</a></div></div>{gallery.length ? <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">{visibleGallery.map((item) => <button key={`${item.src}-${item.index}`} type="button" onClick={() => setLightboxImage(item.src)} className="aspect-[4/3] overflow-hidden rounded-lg bg-[#f5e8ed] shadow-sm"><ImageFrame src={item.src} alt={`${businessName} beauty photo ${item.index + 1}`} className="transition duration-300 hover:scale-105" /></button>)}</div> : <p className="mt-4 rounded-lg bg-[#fff8fb] p-5 text-sm text-[#755e68]">Beauty photos have not been added yet.</p>}{gallery.length > 0 && visibleGallery.length === 0 && <p className="mt-3 text-xs text-[#745d68]">No photos are tagged for {galleryFilter}.</p>}</section>

        <section id="videos" className="bg-[#fff8fb] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#94164b]">Videos <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">Watch beauty transformations and client experiences.</p></div><a href="#videos" className="rounded-md border border-[#d88eae] px-3 py-2 text-xs font-bold text-[#a20d50]">▶ View All Videos</a></div>{videos.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{videos.slice(0, 8).map((video, index) => { const image = video.thumbnail || video.image || gallery[index % Math.max(gallery.length, 1)]?.src || ''; return <button key={`${video.url || video.src}-${index}`} type="button" onClick={() => setActiveVideo(video)} className="group overflow-hidden rounded-lg border border-[#f0e0e8] bg-white text-left shadow-sm"><div className="relative aspect-video overflow-hidden bg-[#45182e]">{image && <ImageFrame src={mediaSource(image)} alt={video.title || videoTitleDefaults[index % videoTitleDefaults.length]} className="transition duration-300 group-hover:scale-105" />}<span className="absolute inset-0 grid place-items-center bg-black/15"><span className="grid h-12 w-12 place-items-center rounded-full border border-white/80 bg-[#bd145b]/90 pl-1 text-lg text-white shadow-lg">▶</span></span>{video.duration && <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-1 text-[10px] font-bold text-white">{video.duration}</span>}</div><span className="block truncate px-3 py-2.5 text-xs font-bold text-[#4d1836]">{video.title || videoTitleDefaults[index % videoTitleDefaults.length]}</span></button>; })}</div> : <p className="mt-4 rounded-lg bg-white p-5 text-sm text-[#755e68]">Beauty videos have not been added yet.</p>}</div></section>

        <section id="features" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><h2 className="font-display text-3xl font-bold text-[#94164b]">Features &amp; Infrastructure <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">Our parlour facilities for a comfortable and premium experience.</p><div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">{featureItems.map(([icon, title], index) => { const savedFeature = features.find((item) => normalize(typeof item === 'string' ? item : item.name || item.title).includes(normalize(title))); const label = typeof savedFeature === 'string' ? savedFeature : savedFeature?.name || savedFeature?.title || title; return <article key={title} className={`rounded-lg border border-[#f1e4e9] p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${['bg-[#fff7ed]', 'bg-[#f3f7ec]', 'bg-[#fff0f6]', 'bg-[#f3f0fa]'][index % 4]}`}><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/85 text-xl text-[#b9175c]">{icon}</span><h3 className="mt-2 text-[10px] font-bold leading-4 text-[#503441]">{label}</h3></article>; })}</div></div></section>

        <section id="offers" className="bg-[#fff8fb] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#94164b]">Beauty Offers <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">Packages and special services for your next visit</p></div></div>{offers.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{offers.slice(0, 6).map((offer, index) => <BeautyOfferCard key={`${typeof offer === 'string' ? offer : offer.name || offer.title}-${index}`} offer={offer} index={index} gallery={gallery} appointmentUrl={appointmentUrl} />)}</div> : <div className="mt-4 rounded-xl border border-dashed border-[#e6cdd8] bg-white p-5 text-sm text-[#755e68]">Ask us about bridal, party and pre-bridal packages.<a href={appointmentUrl} className="ml-2 font-bold text-[#af1558]">Enquire now →</a></div>}</div></section>

        <section id="reviews" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="mb-4"><h2 className="font-display text-3xl font-bold text-[#94164b]">Customer Reviews <span className="text-sm text-[#dca33f]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">Share your experience with us.</p></div><div className="rounded-xl border border-[#f0e0e8] bg-white p-3 shadow-sm sm:p-5"><ReviewsSection placeId={place._id} /></div></section>
      </main>

      <section id="contact" className="relative overflow-hidden bg-[#35091f] px-4 py-7 text-white sm:px-7"><div className="pointer-events-none absolute -bottom-8 -left-5 text-7xl text-[#c53571]/30">❀</div><div className="pointer-events-none absolute -right-4 top-2 text-6xl text-[#c53571]/20">✿</div><div className="relative mx-auto grid max-w-[1500px] gap-6 sm:grid-cols-2 lg:grid-cols-4"><div><h3 className="font-display text-lg font-bold">Our Location</h3><p className="mt-2 text-xs leading-5 text-white/75">{location || 'Address not provided'}</p>{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded border border-[#e2aa4e] px-3 py-2 text-[10px] font-bold text-[#ffda81]">⌖ View on Map</a>}</div><div><h3 className="font-display text-lg font-bold">Contact Details</h3><div className="mt-2 space-y-1.5 text-xs text-white/75">{phone && <a href={callUrl} className="block">☎ {phone}</a>}{email && <a href={`mailto:${email}`} className="block">✉ {email}</a>}{hours.length ? hours.map((hour) => <p key={hour.day} className="capitalize">◷ {hour.day}: {hour.closed ? 'Closed' : `${hour.open || ''}${hour.open && hour.close ? ' - ' : ''}${hour.close || ''}`}</p>) : <p>Working hours not provided</p>}</div></div><div><h3 className="font-display text-lg font-bold">Follow Us</h3><div className="mt-3 flex flex-wrap gap-2">{Object.entries(socialLinks).filter(([network, value]) => value && (network !== 'whatsapp' || whatsappUrl)).map(([network, value]) => <a key={network} href={network === 'whatsapp' ? whatsappUrl : ensureUrl(value)} target="_blank" rel="noreferrer" aria-label={network} className="grid h-9 min-w-9 place-items-center rounded bg-white/15 px-2 text-xs font-bold capitalize hover:bg-white/25">{network.slice(0, 1)}</a>)}</div><p className="mt-2 text-xs text-white/65">Follow us for beauty tips, looks and offers</p></div><div><h3 className="font-display text-lg font-bold">G-Pages</h3><p className="mt-2 text-xs text-white/75">Powered by G-Pages</p><p className="text-xs text-white/65">Create your business website</p><div className="mt-3 flex flex-wrap gap-2"><a href="/contact" className="rounded bg-white px-3 py-2 text-[10px] font-bold text-[#35091f]">Contact Us</a><a href="/" className="rounded bg-white px-3 py-2 text-[10px] font-bold text-[#35091f]">⌂ Back to Home</a></div></div></div></section>

      <div className="fixed bottom-3 left-1/2 z-40 w-[92%] max-w-sm -translate-x-1/2 rounded-full border border-[#f0dce3] bg-white/95 p-2 shadow-lg backdrop-blur md:hidden"><div className="flex gap-2">{phone && <a href={callUrl} className="flex-1 rounded-full bg-[#bd145b] px-3 py-2.5 text-center text-xs font-bold text-white">Call</a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#10a85a] px-3 py-2.5 text-center text-xs font-bold text-white">WhatsApp</a>}</div></div>
      {lightboxImage && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={() => setLightboxImage('')}><button type="button" onClick={() => setLightboxImage('')} aria-label="Close image" className="absolute right-4 top-4 rounded bg-white px-4 py-2 text-sm font-bold text-[#4a102c]">Close</button><img src={lightboxImage} alt={`${businessName} beauty photo enlarged`} className="max-h-[90vh] max-w-[94vw] rounded-lg object-contain" onClick={(event) => event.stopPropagation()} /></div>}
      {activeVideo && <BeautyVideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}

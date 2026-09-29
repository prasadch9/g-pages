import React, { useMemo, useState } from 'react';
import ReviewsSection from '../ReviewsSection';
import { getProfileData, ImageFrame } from './PublicProfileShared';
import { getWhatsAppUrl } from '../../utils/healthcare';

const serviceDefaults = [
  ['Wedding Planning', 'Complete wedding planning and management'],
  ['Engagements', 'Beautiful engagement ceremonies'],
  ['Birthday Parties', 'Memorable birthday celebrations'],
  ['Corporate Events', 'Professional corporate events and meetings'],
  ['Theme Parties', 'Unique themed celebrations'],
  ['All Types of Events', 'Custom events planned around your needs'],
];

const galleryFilters = ['All', 'Weddings', 'Engagements', 'Birthdays', 'Corporate Events', 'Theme Parties'];
const featureItems = [
  ['✿', 'Beautiful Decor Themes'],
  ['▦', 'Premium Venue Options'],
  ['♫', 'Sound & Lighting Arrangements'],
  ['✧', 'Stage & Backdrop Designs'],
  ['♨', 'Catering Coordination'],
  ['▣', 'Photography & Videography'],
  ['♟', 'Guest Management'],
  ['➤', 'Transport & Accommodation'],
];
const whyChooseItems = [
  'Creative & Unique Concepts',
  'Experienced Event Planners',
  'Customized Packages',
  'End-to-End Management',
  'On-Time Execution',
  'Client Satisfaction',
];
const videoTitleDefaults = ['Wedding Highlight', 'Corporate Event', 'Birthday Celebration', 'Engagement Ceremony'];

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  return value ? [value] : [];
};
const firstPopulatedList = (...values) => values.map(toList).find((items) => items.length) || [];
const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
const mediaSource = (item) => typeof item === 'string' ? item : item?.url || item?.src || item?.image || '';
const mediaType = (item) => typeof item === 'object' ? normalize(item.category || item.type) || 'others' : 'others';
const ensureUrl = (value) => value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : '';
const addressParts = (place) => [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name].filter(Boolean);
const openingHours = (hours = []) => hours.filter((item) => item?.day && (item.open || item.close || item.closed));

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

function ServiceCard({ item, index, gallery }) {
  const title = typeof item === 'string' ? item : item.name || item.title || 'Event service';
  const description = typeof item === 'object' && item.description
    ? item.description
    : serviceDefaults.find(([name]) => normalize(name) === normalize(title))?.[1] || `Thoughtful ${title.toLowerCase()} planning, coordination and on-the-day support.`;
  const image = typeof item === 'object' && (item.image || item.photo)
    ? item.image || item.photo
    : gallery[index % Math.max(gallery.length, 1)]?.src;
  return (
    <article className="group overflow-hidden rounded-xl border border-[#f0e2e8] bg-white shadow-[0_10px_26px_rgba(85,20,50,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(185,15,85,0.14)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#f9e7ee]">
        {image ? <ImageFrame src={mediaSource(image)} alt={title} className="transition duration-300 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-4xl text-[#c40c59]">✿</div>}
        <span className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-xl text-[#c40c59] shadow">{['♡', '✧', '♧', '▦', '❋', '✿'][index % 6]}</span>
      </div>
      <div className="p-4"><h3 className="font-display text-lg font-bold text-[#4a102c]">{title}</h3><p className="mt-1.5 text-sm leading-6 text-[#6e5761]">{description}</p></div>
    </article>
  );
}

function VideoModal({ video, onClose }) {
  const source = getVideoSource(video);
  if (!source) return null;
  return (
    <div role="presentation" className="fixed inset-0 z-[70] grid place-items-center bg-[#170b13]/90 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-label={video.title || 'Event video'} className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close video" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-xl text-white">×</button>
        <div className="aspect-video">
          {source.type === 'embed'
            ? <iframe src={source.src} title={video.title || 'Event video'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full border-0" />
            : <video src={source.src} controls autoPlay playsInline className="h-full w-full" />}
        </div>
        <p className="px-4 py-3 text-sm font-semibold text-white">{video.title || 'Event video'}</p>
      </section>
    </div>
  );
}

export default function EventOrganizerPublicPage({ place }) {
  const profile = getProfileData(place);
  const specific = place.attributes?.businessProfile?.categorySpecific || {};
  const common = place.attributes?.businessProfile?.common || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [lightboxImage, setLightboxImage] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const portfolio = toList(specific.portfolio);
  const portfolioImages = portfolio.map((item) => {
    if (typeof item === 'string') return item;
    const src = item.image || item.url || item.photo;
    return src ? { url: src, category: item.category } : null;
  }).filter(Boolean);
  const gallery = useMemo(() => {
    const source = profile.gallery?.length ? profile.gallery : place.images?.length ? place.images : portfolioImages;
    return source.map((image, index) => ({ image, src: mediaSource(image), category: mediaType(image), index })).filter((item) => item.src).slice(0, 10);
  }, [place.images, profile.gallery, portfolioImages]);
  const videos = useMemo(() => {
    const source = profile.videos?.length ? profile.videos : place.videos?.length ? place.videos : place.video ? place.video : [];
    return toList(source).map((video) => typeof video === 'string' ? { url: video } : video).filter((video) => video?.url || video?.src);
  }, [place.video, place.videos, profile.videos]);

  const rawServices = firstPopulatedList(specific.services, specific.selectedOptions, place.services, profile.services);
  const services = rawServices.length ? rawServices : serviceDefaults.map(([name, description]) => ({ name, description }));
  const packages = firstPopulatedList(specific.packages, profile.packages);
  const phone = place.phone || profile.phone || common.phone || '';
  const whatsappValue = place.socialLinks?.whatsapp || profile.socialMedia?.whatsapp || profile.whatsapp || phone;
  const whatsappUrl = getWhatsAppUrl(whatsappValue);
  const callUrl = phone ? `tel:${String(phone).replace(/\s+/g, '')}` : '';
  const email = place.email || profile.email || common.email || '';
  const businessName = place.name || common.businessName || 'Event Organizer';
  const tagline = profile.tagline || place.tagline || '';
  const about = place.description || profile.about || '';
  const coverImage = profile.coverImage || place.coverImage || gallery[0]?.src || '';
  const aboutImage = profile.aboutImage || specific.aboutImage || gallery[1]?.src || gallery[0]?.src || coverImage;
  const socialLinks = profile.socialMedia || place.socialLinks || {};
  const profileHours = openingHours(profile.openingHours || []);
  const hours = profileHours.length ? profileHours : openingHours(place.workingHours || []);
  const location = addressParts(place).join(', ');
  const mapUrl = location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : '';
  const yearsExperience = specific.yearsExperience || profile.yearsExperience;
  const eventsCompleted = specific.eventsCompleted || specific.eventsOrganized || profile.eventsCompleted;
  const ratingAverage = Number(place.rating?.average || 0);
  const reviewCount = Number(place.rating?.count || 0);
  const visibleGallery = galleryFilter === 'All' ? gallery : gallery.filter((item) => item.category === normalize(galleryFilter));
  const navItems = [['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Gallery', '#gallery'], ['Packages', '#packages'], ['Contact', '#contact']];

  return (
    <div className="min-h-screen bg-white text-[#392532]">
      <header className="sticky top-0 z-40 border-b border-[#f2e2e9] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-2.5 sm:px-7">
          <a href="#home" className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-[#f0d9e3] bg-[#fff6fa]">
              {profile.logo || place.logo ? <ImageFrame src={profile.logo || place.logo} alt={`${businessName} logo`} /> : <span className="font-display text-xl font-bold text-[#bd0d58]">{businessName.slice(0, 1)}</span>}
            </div>
            <div className="min-w-0"><p className="truncate font-display text-lg font-bold text-[#a10d4c] sm:text-xl">{businessName}</p><p className="truncate text-[10px] text-[#79616d]">{tagline || 'Event Organizers'}</p></div>
          </a>
          <nav className="hidden items-center gap-6 text-xs font-semibold lg:flex xl:gap-8">{navItems.map(([label, href], index) => <a key={href} href={href} className={`relative py-3 transition-colors after:absolute after:bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-transform ${index === 0 ? 'text-[#c20d5a] after:scale-x-100 after:bg-[#c20d5a]' : 'after:scale-x-0 after:bg-[#c20d5a] hover:text-[#c20d5a] hover:after:scale-x-100'}`}>{label}</a>)}</nav>
          <div className="hidden items-center gap-2 md:flex">
            {phone && <a href={callUrl} className="inline-flex items-center gap-2 rounded-md border border-[#efb8ce] px-3 py-2 text-xs font-bold text-[#461b31]"><span className="text-base text-[#c10c56]">☎</span><span>Call Now<br /><span className="font-medium">{phone}</span></span></a>}
            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#11a857] px-3 py-2 text-xs font-bold text-white"><span className="text-base">◉</span> WhatsApp</a>}
          </div>
          <button type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)} className="rounded border border-[#ead8e0] px-3 py-2 text-lg lg:hidden">☰</button>
        </div>
        {menuOpen && <nav className="border-t border-[#f2e2e9] bg-white px-4 py-2 lg:hidden">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-[#f8edf1] py-3 text-sm font-semibold last:border-0">{label}</a>)}<div className="flex gap-2 py-3">{phone && <a href={callUrl} className="flex-1 rounded bg-[#c20d5a] p-2 text-center text-xs font-bold text-white">Call Now</a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded bg-[#11a857] p-2 text-center text-xs font-bold text-white">WhatsApp</a>}</div></nav>}
      </header>

      <main>
        <section id="home" className="relative isolate overflow-hidden bg-[#1c1221] text-white">
          <div className="absolute inset-0">{coverImage && <ImageFrame src={coverImage} alt={`${businessName} event hero`} eager />}<div className="absolute inset-0 bg-gradient-to-r from-[#160f1c]/95 via-[#1b1025]/75 to-[#23112a]/25" /></div>
          <div className="relative mx-auto grid min-h-[500px] max-w-[1500px] items-center gap-7 px-5 py-10 sm:min-h-[560px] sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-12">
            <div className="max-w-[650px]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#ffd47b]">PROFESSIONAL EVENT MANAGEMENT</p>
              <h1 className="mt-4 font-display text-5xl font-bold leading-[.98] sm:text-6xl lg:text-[68px]">Making Your<br />Special Moments<br /><span className="text-[#ffd16a]">Extraordinary</span></h1>
              <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-white/90 sm:text-base">Weddings | Engagements | Birthday Parties | Corporate Events | and More...</p>
              {about && <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">{about}</p>}
              <div className="mt-6 flex flex-wrap gap-3"><a href="#contact" className="rounded-md bg-[#c10c58] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/20">Plan Your Event <span aria-hidden="true">→</span></a><a href="#gallery" className="rounded-md border border-[#edb453] bg-black/20 px-5 py-3 text-sm font-bold text-white">View Our Work <span aria-hidden="true">▶</span></a></div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold text-white/90 sm:text-xs">{[['✎', 'Creative Planning'], ['♟', 'Experienced Team'], ['◇', 'Customized Packages'], ['✥', 'End-to-End Support']].map(([icon, label]) => <span key={label} className="inline-flex items-center gap-1.5"><span className="text-base text-[#ffd47b]">{icon}</span>{label}</span>)}</div>
            </div>
            <div className="relative hidden min-h-[380px] lg:block">
              {coverImage && <div className="absolute inset-4 overflow-hidden rounded-xl border-2 border-white/85 shadow-2xl"><ImageFrame src={coverImage} alt={`${businessName} event setup`} /></div>}
              {gallery.slice(0, 3).map((item, index) => <button key={item.src} type="button" onClick={() => setLightboxImage(item.src)} className={`absolute z-10 w-[46%] overflow-hidden rounded-lg border-2 border-white shadow-xl transition hover:-translate-y-1 ${index === 0 ? 'right-0 top-4 rotate-2' : index === 1 ? 'bottom-10 right-2 -rotate-1' : 'bottom-0 left-0 rotate-1'}`}><ImageFrame src={item.src} alt={`${businessName} gallery ${index + 1}`} className="h-32 w-full object-cover xl:h-40" /></button>)}
              {!coverImage && gallery.length === 0 && <div className="absolute inset-8 grid place-items-center rounded-xl border border-white/20 bg-white/5 text-center text-sm text-white/70">Add event photos to showcase your work</div>}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-[1500px] gap-5 px-4 py-7 sm:px-7 lg:grid-cols-[.9fr_1.15fr_.75fr] lg:items-center">
          <div className="relative min-h-[220px] overflow-hidden rounded-xl bg-[#f8e8ee] sm:min-h-[270px]"><ImageFrame src={aboutImage} alt={`${businessName} event`} />{!aboutImage && <div className="absolute inset-0 grid place-items-center text-4xl text-[#c20d5a]">✿</div>}</div>
          <div className="py-2"><p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#c20d5a]">ABOUT US</p><h2 className="mt-2 font-display text-3xl font-bold text-[#4a102c] sm:text-4xl">About Us <span className="text-sm text-[#dfa93d]">〰</span></h2><p className="mt-3 text-sm leading-6 text-[#6a5660]">{about || tagline || 'Creating thoughtful, seamless experiences for every celebration.'}</p><a href="#contact" className="mt-4 inline-flex rounded-md bg-[#c10c58] px-4 py-2.5 text-xs font-bold text-white">Know More About Us →</a>
            <div className="mt-5 flex flex-wrap gap-5">{eventsCompleted && <div><p className="font-display text-xl font-bold text-[#4a102c]">{eventsCompleted}+</p><p className="text-[10px] text-[#79636d]">Events Organized</p></div>}{yearsExperience && <div><p className="font-display text-xl font-bold text-[#4a102c]">{yearsExperience}+</p><p className="text-[10px] text-[#79636d]">Years of Experience</p></div>}{reviewCount > 0 && <div><p className="font-display text-xl font-bold text-[#4a102c]">{ratingAverage.toFixed(1)} / 5</p><p className="text-[10px] text-[#79636d]">Client Satisfaction</p></div>}</div>
          </div>
          <aside className="rounded-xl bg-[#fff4f7] p-4 shadow-[0_10px_24px_rgba(106,27,62,.07)]">
            <div className="border-b border-[#efdde4] pb-3"><h3 className="text-sm font-bold text-[#4a102c]">Our Vision</h3><p className="mt-1 text-xs leading-5 text-[#745c67]">{specific.vision || 'To create extraordinary events that bring people together.'}</p></div>
            <div className="border-b border-[#efdde4] py-3"><h3 className="text-sm font-bold text-[#4a102c]">Our Mission</h3><p className="mt-1 text-xs leading-5 text-[#745c67]">{specific.mission || 'To deliver memorable and seamless event experiences.'}</p></div>
            <div className="pt-3"><h3 className="text-sm font-bold text-[#4a102c]">Why Choose Us</h3><ul className="mt-2 space-y-1 text-[11px] leading-4 text-[#745c67]">{whyChooseItems.map((item) => <li key={item}><span className="mr-1 text-[#bf0d57]">✓</span>{item}</li>)}</ul></div>
          </aside>
        </section>

        <section id="services" className="bg-[#fff8fa] px-4 py-7 sm:px-7">
          <div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#a10d4c]">Our Services <span className="text-sm text-[#dfa93d]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">From planning to execution, we handle every detail</p></div><a href="#packages" className="hidden rounded-md border border-[#d886a7] px-3 py-2 text-xs font-bold text-[#b50c53] sm:inline-flex">View All Services →</a></div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{services.slice(0, 6).map((item, index) => <ServiceCard key={`${typeof item === 'string' ? item : item.name || item.title}-${index}`} item={item} index={index} gallery={gallery} />)}</div>
          </div>
        </section>

        <section id="gallery" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#a10d4c]">Gallery <span className="text-sm text-[#dfa93d]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">Glimpses of recent events</p></div><div className="flex flex-wrap items-center gap-1.5">{galleryFilters.map((filter) => <button key={filter} type="button" onClick={() => setGalleryFilter(filter)} aria-pressed={galleryFilter === filter} className={`rounded-md px-3 py-2 text-[10px] font-semibold transition ${galleryFilter === filter ? 'bg-[#bd0c55] text-white' : 'border border-[#eadce3] bg-white text-[#4c3841] hover:border-[#bd0c55]'}`}>{filter}</button>)}<a href="#gallery" className="rounded-md border border-[#ce7d9e] px-3 py-2 text-[10px] font-bold text-[#b50c53]">▣ View All Photos ({gallery.length})</a></div></div>
          {gallery.length > 0 ? <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">{visibleGallery.map((item) => <button key={`${item.src}-${item.index}`} type="button" onClick={() => setLightboxImage(item.src)} className="aspect-[4/3] overflow-hidden rounded-lg bg-[#f6e8ed] shadow-sm"><ImageFrame src={item.src} alt={`${businessName} event photo ${item.index + 1}`} className="transition duration-300 hover:scale-105" /></button>)}</div> : <p className="mt-4 rounded-lg bg-[#fff6f9] p-5 text-sm text-[#745d68]">Event photos have not been added yet.</p>}
          {gallery.length > 0 && visibleGallery.length === 0 && <p className="mt-3 text-xs text-[#745d68]">No photos are tagged for {galleryFilter}.</p>}
        </section>

        <section id="videos" className="bg-[#fff8fa] px-4 py-7 sm:px-7">
          <div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#a10d4c]">Videos <span className="text-sm text-[#dfa93d]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">Watch the highlights of our events</p></div><a href="#videos" className="rounded-md border border-[#d886a7] px-3 py-2 text-xs font-bold text-[#b50c53]">▶ View All Videos</a></div>
            {videos.length > 0 ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{videos.slice(0, 8).map((video, index) => {
              const thumbnail = video.thumbnail || video.image || gallery[index % Math.max(gallery.length, 1)]?.src || '';
              return <button key={`${video.url || video.src}-${index}`} type="button" onClick={() => setActiveVideo(video)} className="group overflow-hidden rounded-lg border border-[#f0e0e7] bg-white text-left shadow-sm">
                <div className="relative aspect-video overflow-hidden bg-[#3b1830]">{thumbnail && <ImageFrame src={mediaSource(thumbnail)} alt={video.title || videoTitleDefaults[index % videoTitleDefaults.length]} className="transition duration-300 group-hover:scale-105" />}<span className="absolute inset-0 grid place-items-center bg-black/15"><span className="grid h-12 w-12 place-items-center rounded-full border border-white/80 bg-[#bd0c55]/90 pl-1 text-lg text-white shadow-lg">▶</span></span>{video.duration && <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-1 text-[10px] font-bold text-white">{video.duration}</span>}</div>
                <span className="block truncate px-3 py-2.5 text-xs font-bold text-[#4a102c]">{video.title || videoTitleDefaults[index % videoTitleDefaults.length]}</span>
              </button>;
            })}</div> : <p className="mt-4 rounded-lg bg-white p-5 text-sm text-[#745d68]">Event videos have not been added yet.</p>}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7">
          <div><h2 className="font-display text-3xl font-bold text-[#a10d4c]">Features &amp; Infrastructure <span className="text-sm text-[#dfa93d]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">Our facilities for a perfect event experience</p></div>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">{featureItems.map(([icon, title], index) => <article key={title} className={`rounded-lg border border-[#f1e5eb] p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${['bg-[#fff7ed]', 'bg-[#f4f0ff]', 'bg-[#fff0f5]', 'bg-[#eff9f4]'][index % 4]}`}><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/80 text-xl text-[#bd0c55]">{icon}</span><h3 className="mt-2 text-[10px] font-bold leading-4 text-[#4a3340]">{title}</h3></article>)}</div>
        </section>

        <section id="packages" className="bg-[#fff8fa] px-4 py-7 sm:px-7">
          <div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold text-[#a10d4c]">Packages <span className="text-sm text-[#dfa93d]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">Flexible options for your celebration</p></div>{phone && <a href={callUrl} className="rounded-md bg-[#bd0c55] px-4 py-2 text-xs font-bold text-white">Discuss a Package</a>}</div>
            {packages.length > 0 ? <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{packages.slice(0, 6).map((item, index) => <article key={`${item.name || item.title || 'package'}-${index}`} className="overflow-hidden rounded-lg border border-[#f0e0e7] bg-white shadow-sm"><div className="aspect-[16/7] bg-[#f8e8ee]">{(item.image || gallery[index % Math.max(gallery.length, 1)]?.src) && <ImageFrame src={item.image || gallery[index % Math.max(gallery.length, 1)]?.src} alt={item.name || item.title || 'Event package'} />}</div><div className="p-4"><h3 className="font-display text-lg font-bold text-[#4a102c]">{item.name || item.title || `Package ${index + 1}`}</h3>{item.description && <p className="mt-2 text-sm leading-6 text-[#6e5761]">{item.description}</p>}{item.price && <p className="mt-3 font-bold text-[#bd0c55]">{item.price}</p>}</div></article>)}</div> : <p className="mt-4 rounded-lg border border-dashed border-[#e5cbd6] bg-white p-5 text-sm text-[#745d68]">Contact us to plan a package around your event.</p>}
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7">
          <div className="mb-4"><h2 className="font-display text-3xl font-bold text-[#a10d4c]">Customer Reviews <span className="text-sm text-[#dfa93d]">〰</span></h2><p className="mt-1 text-xs text-[#745d68]">Share your experience with us</p></div>
          <div className="rounded-xl border border-[#f0e0e7] bg-white p-3 shadow-sm sm:p-5"><ReviewsSection placeId={place._id} /></div>
        </section>

        <section id="contact" className="bg-[#310b26] px-4 py-7 text-white sm:px-7">
          <div className="mx-auto grid max-w-[1500px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div><h3 className="font-display text-lg font-bold">Our Location</h3><p className="mt-2 text-xs leading-5 text-white/75">{location || 'Address not provided'}</p>{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded border border-[#e3a443] px-3 py-2 text-[10px] font-bold text-[#ffd87c]">⌖ View on Map</a>}</div>
            <div><h3 className="font-display text-lg font-bold">Contact Details</h3><div className="mt-2 space-y-1.5 text-xs text-white/75">{phone && <a href={callUrl} className="block">☎ {phone}</a>}{email && <a href={`mailto:${email}`} className="block">✉ {email}</a>}{hours.length ? hours.map((hour) => <p key={hour.day} className="capitalize">◷ {hour.day}: {hour.closed ? 'Closed' : `${hour.open || ''}${hour.open && hour.close ? ' - ' : ''}${hour.close || ''}`}</p>) : <p>Working hours not provided</p>}</div></div>
            <div><h3 className="font-display text-lg font-bold">Follow Us</h3><div className="mt-3 flex flex-wrap gap-2">{Object.entries(socialLinks).filter(([, value]) => value).map(([network, value]) => <a key={network} href={ensureUrl(value)} target="_blank" rel="noreferrer" aria-label={network} className="grid h-9 min-w-9 place-items-center rounded bg-white/15 px-2 text-xs font-bold capitalize hover:bg-white/25">{network.slice(0, 1)}</a>)}</div><p className="mt-2 text-xs text-white/65">Stay connected for event updates</p></div>
            <div><h3 className="font-display text-lg font-bold">G-Pages</h3><p className="mt-2 text-xs text-white/75">Powered by G-Pages</p><div className="mt-3 flex flex-wrap gap-2"><a href="/contact" className="rounded bg-white px-3 py-2 text-[10px] font-bold text-[#310b26]">Contact Us</a><a href="/" className="rounded bg-white px-3 py-2 text-[10px] font-bold text-[#310b26]">⌂ Back to Home</a></div></div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-3 left-1/2 z-40 w-[92%] max-w-sm -translate-x-1/2 rounded-full border border-[#f0dce3] bg-white/95 p-2 shadow-lg backdrop-blur md:hidden"><div className="flex gap-2">{phone && <a href={callUrl} className="flex-1 rounded-full bg-[#bd0c55] px-3 py-2.5 text-center text-xs font-bold text-white">Call</a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#11a857] px-3 py-2.5 text-center text-xs font-bold text-white">WhatsApp</a>}</div></div>

      {lightboxImage && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={() => setLightboxImage('')}><button type="button" onClick={() => setLightboxImage('')} aria-label="Close image" className="absolute right-4 top-4 rounded bg-white px-4 py-2 text-sm font-bold text-[#4a102c]">Close</button><img src={lightboxImage} alt={`${businessName} event enlarged`} className="max-h-[90vh] max-w-[94vw] rounded-lg object-contain" onClick={(event) => event.stopPropagation()} /></div>}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}

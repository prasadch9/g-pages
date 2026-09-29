import React, { useMemo, useState } from 'react';
import ReviewsSection from '../ReviewsSection';
import { getProfileData, ImageFrame, PublicVideoCard } from './PublicProfileShared';
import { getWhatsAppUrl } from '../../utils/healthcare';

const serviceTypes = [
  'Weddings',
  'Receptions',
  'Engagements',
  'Birthday Parties',
  'Corporate Events',
  'Naming Ceremonies',
  'Cultural Events',
  'Get Together',
];

const facilityTypes = [
  'Spacious AC Halls',
  'Dining Area',
  'Bridal Room',
  'Groom Room',
  'Ample Parking',
  'Generator Backup',
  'CCTV Security',
  'Lift Facility',
  'Clean Restrooms',
  'Decor Support',
];

const facilityAliases = {
  'Spacious AC Halls': ['air conditioning', 'ac hall', 'ac halls', 'air-conditioned'],
  'Dining Area': ['dining hall', 'dining area'],
  'Bridal Room': ['bridal room'],
  'Groom Room': ['groom room'],
  'Ample Parking': ['parking'],
  'Generator Backup': ['generator', 'power backup'],
  'CCTV Security': ['cctv', 'security'],
  'Lift Facility': ['lift'],
  'Clean Restrooms': ['restroom', 'washroom'],
  'Decor Support': ['decoration', 'decor support'],
};

const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
const asList = (value) => Array.isArray(value) ? value.filter(Boolean) : value ? String(value).split(/[\n,]/).map((item) => item.trim()).filter(Boolean) : [];
const toUrl = (value) => value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : '';
const getValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');
const mediaUrl = (image) => typeof image === 'string' ? image : image?.url || image?.src || image?.image || '';
const mediaCategory = (image) => typeof image === 'object' ? normalize(image.category || image.type) : 'others';

const videoItems = (profile, place) => {
  const videos = profile.videos?.length ? profile.videos : place.videos?.length ? place.videos : place.video ? place.video : [];
  return (Array.isArray(videos) ? videos : [videos]).map((video) => typeof video === 'string' ? { url: video } : video).filter((video) => video?.url);
};

const displayHours = (hours = []) => hours.filter((item) => item?.day && (item.open || item.close || item.closed));

export default function FunctionHallPublicPage({ place }) {
  const profile = getProfileData(place);
  const specific = place.attributes?.businessProfile?.categorySpecific || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [lightbox, setLightbox] = useState('');

  const gallery = useMemo(() => {
    const items = profile.gallery?.length ? profile.gallery : place.images || [];
    return items.map((image, index) => ({ image, src: mediaUrl(image), category: mediaCategory(image), index })).filter((item) => item.src);
  }, [place.images, profile.gallery]);
  const videos = useMemo(() => videoItems(profile, place), [place.video, place.videos, profile.videos]);

  const facilityTerms = Object.values(facilityAliases).flat().map(normalize);
  const serviceOptions = [
    ...asList(profile.services),
    ...asList(place.services),
    ...asList(specific.eventTypes),
  ];
  const savedServices = [...new Set(serviceOptions
    .map((item) => typeof item === 'object' ? item.name || item.title : item)
    .filter((item) => item && !facilityTerms.some((term) => normalize(item).includes(term))))];
  const services = savedServices.length ? savedServices : serviceTypes;
  const savedFacilities = [
    ...asList(profile.infrastructure),
    ...asList(place.facilities),
    ...asList(place.services),
    ...asList(specific.services),
    ...asList(specific.selectedOptions),
  ];
  const facilities = facilityTypes.map((label) => {
    const aliases = facilityAliases[label].map(normalize);
    const available = savedFacilities.some((item) => aliases.some((alias) => normalize(typeof item === 'object' ? item.name : item).includes(alias)));
    return { label, available };
  });

  const phone = place.phone || profile.phone || '';
  const whatsappNumber = place.socialLinks?.whatsapp || profile.socialMedia?.whatsapp || profile.whatsapp || phone;
  const whatsappUrl = getWhatsAppUrl(whatsappNumber);
  const callUrl = phone ? `tel:${String(phone).replace(/\s+/g, '')}` : '';
  const email = place.email || profile.email || '';
  const website = toUrl(place.website || profile.website);
  const socialLinks = profile.socialMedia || place.socialLinks || {};
  const hours = displayHours(profile.openingHours || place.workingHours || []);
  const location = [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name].filter(Boolean).join(', ');
  const cover = profile.coverImage || place.coverImage || gallery[0]?.src || '';
  const businessName = place.name || profile.businessName || 'Function Hall';
  const tagline = profile.tagline || place.tagline || 'A beautiful venue for your special celebrations';
  const about = place.description || profile.about || '';
  const years = getValue(specific.yearsExperience, profile.yearsExperience);
  const completedEvents = getValue(specific.eventsCompleted, specific.successfulEvents, profile.eventsCompleted);
  const ratingAverage = Number(place.rating?.average || 0);
  const reviewCount = Number(place.rating?.count || 0);
  const mapUrl = place.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}` : '';
  const bookingHref = callUrl || (whatsappUrl ? whatsappUrl : '#contact');
  const galleryCategories = ['All', 'Weddings', 'Receptions', 'Engagements', 'Corporate Events', 'Others'];
  const visibleGallery = galleryFilter === 'All'
    ? gallery
    : gallery.filter((item) => item.category === normalize(galleryFilter));
  const navItems = [
    ['Home', '#home'],
    ['About', '#about'],
    ['Services', '#services'],
    ['Gallery', '#gallery'],
    ['Facilities', '#facilities'],
    ['Contact', '#contact'],
  ];

  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#34252b]">
      <header className="sticky top-0 z-40 border-b border-[#f0dce3] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-2.5 sm:px-7">
          <a href="#home" className="flex min-w-0 items-center gap-2.5">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#f1dbe2] bg-[#fff7f9]">
              {profile.logo || place.logo ? <ImageFrame src={profile.logo || place.logo} alt={`${businessName} logo`} /> : <span className="grid h-full place-items-center font-display text-xl font-bold text-[#b30d4b]">{businessName.slice(0, 1)}</span>}
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold text-[#a20b43] sm:text-xl">{businessName}</p>
              <p className="truncate text-[10px] text-[#684b55]">{tagline}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-xs font-semibold lg:flex xl:gap-8">
            {navItems.map(([label, href]) => <a key={href} href={href} className="hover:text-[#b30d4b]">{label}</a>)}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {phone && <a href={callUrl} className="inline-flex items-center gap-2 rounded-md border border-[#efb6cc] px-3 py-2 text-xs font-bold text-[#34252b]"><span className="text-[#c11150]">☎</span><span>Call Now<br /><span className="font-medium">{phone}</span></span></a>}
            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#12a85a] px-3 py-2 text-xs font-bold text-white"><span>◉</span> WhatsApp</a>}
          </div>

          <button type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)} className="rounded border border-[#efdce3] px-3 py-2 text-lg lg:hidden">☰</button>
        </div>

        {menuOpen && <nav className="border-t border-[#f0dce3] bg-white px-4 py-2 lg:hidden">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-[#faedf1] py-3 text-sm font-semibold last:border-0">{label}</a>)}<div className="flex gap-2 py-3">{phone && <a href={callUrl} className="flex-1 rounded bg-[#b30d4b] p-2 text-center text-xs font-bold text-white">Call Now</a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded bg-[#12a85a] p-2 text-center text-xs font-bold text-white">WhatsApp</a>}</div></nav>}
      </header>

      <main>
        <section id="home" className="relative isolate min-h-[500px] overflow-hidden bg-[#201b25] text-white sm:min-h-[560px]">
          <div className="absolute inset-0">{cover && <ImageFrame src={cover} alt={`${businessName} venue`} eager />}<div className="absolute inset-0 bg-gradient-to-r from-[#090c18]/90 via-[#10182a]/55 to-[#10182a]/10" /></div>
          <div className="relative mx-auto grid min-h-[500px] max-w-[1500px] items-end gap-8 px-5 pb-10 pt-10 sm:min-h-[560px] sm:px-8 sm:pb-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#ffd57b]">Premium Function Hall</p>
              <h1 className="mt-4 max-w-xl font-display text-5xl font-bold leading-[0.98] sm:text-6xl lg:text-7xl">{specific.heroTitle || 'Celebrate Your Special Moments'}</h1>
              <p className="mt-3 text-sm font-medium text-white/90 sm:text-base">{services.slice(0, 4).join(' | ') || tagline}</p>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">{about || tagline}</p>
              <a href={bookingHref} className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#bd0c4d] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/20">Book Now <span aria-hidden="true">→</span></a>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-semibold text-white/90">
                {facilities.filter((facility) => facility.available).slice(0, 4).map((facility) => <span key={facility.label}>✦ {facility.label}</span>)}
                {specific.maxCapacity && <span>♙ Capacity up to {specific.maxCapacity}</span>}
              </div>
            </div>

            <div className="hidden items-end gap-2 lg:flex">
              {gallery.slice(0, 3).map((item, index) => <button key={item.src} type="button" onClick={() => setLightbox(item.src)} className={`w-1/3 overflow-hidden rounded-lg border-2 border-white/80 shadow-xl ${index === 1 ? 'mb-8' : ''}`}><ImageFrame src={item.src} alt={`${businessName} hall ${index + 1}`} className="h-36 w-full object-cover xl:h-44" /></button>)}
              {gallery.length === 0 && <div className="ml-auto max-w-[250px] rounded-lg border border-white/40 bg-black/30 p-5 text-sm">{tagline}</div>}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-7 lg:grid-cols-[1.05fr_1fr_.75fr]">
          <div className="h-52 overflow-hidden rounded-md bg-[#f3e8ec] sm:h-64 lg:h-full lg:min-h-[210px]">
            <ImageFrame src={gallery[1]?.src || cover} alt={`${businessName} main hall`} />
          </div>
          <div className="py-1">
            <p className="font-display text-2xl font-bold text-[#b30d4b]">About Us <span className="text-sm text-[#e7a542]">〰</span></p>
            <p className="mt-2 text-xs leading-5 text-[#54434a]">{about || tagline}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              {years && <div><strong className="block text-base text-[#39252e]">{years}+</strong><span className="text-[#725c64]">Years of Experience</span></div>}
              {completedEvents && <div><strong className="block text-base text-[#39252e]">{completedEvents}+</strong><span className="text-[#725c64]">Successful Events</span></div>}
              {reviewCount > 0 && <div><strong className="block text-base text-[#39252e]">{ratingAverage.toFixed(1)} / 5</strong><span className="text-[#725c64]">Customer Satisfaction</span></div>}
            </div>
          </div>
          <aside className="grid content-start gap-3 rounded-lg bg-[#fff4f6] p-4 text-xs">
            <div><h3 className="font-bold text-[#4b2634]">Our Vision</h3><p className="mt-1 leading-5 text-[#705963]">{specific.vision || about || tagline}</p></div>
            <div className="border-t border-[#f2dce4] pt-3"><h3 className="font-bold text-[#4b2634]">Our Mission</h3><p className="mt-1 leading-5 text-[#705963]">{specific.mission || about || tagline}</p></div>
            <div className="border-t border-[#f2dce4] pt-3"><h3 className="font-bold text-[#4b2634]">Why Choose Us</h3><ul className="mt-1 space-y-1 text-[#705963]">{facilities.filter((facility) => facility.available).slice(0, 4).map((facility) => <li key={facility.label}>✓ {facility.label}</li>)}{facilities.every((facility) => !facility.available) && <li>{tagline}</li>}</ul></div>
          </aside>
        </section>

        <section id="services" className="mx-auto max-w-[1500px] px-4 pb-5 sm:px-7">
          <div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-2xl font-bold text-[#b30d4b]">Our Services <span className="text-sm text-[#e7a542]">〰</span></h2><p className="text-xs text-[#725c64]">{tagline}</p></div></div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">{services.slice(0, 8).map((service, index) => <div key={`${service}-${index}`} className="overflow-hidden rounded-md border border-[#f4e5eb] bg-[#fff7f9] text-center"><div className="grid h-14 place-items-center bg-[#f9e8ee] text-xl text-[#c31453]">{['♡', '♢', '◇', '♙', '♧', '✿', '♫', '✤'][index]}</div><p className="px-1 py-2 text-[10px] font-bold leading-4 text-[#44343a]">{service}</p></div>)}</div>
        </section>

        <section id="gallery" className="mx-auto max-w-[1500px] px-4 py-2 sm:px-7">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-2xl font-bold text-[#b30d4b]">Gallery <span className="text-sm text-[#e7a542]">〰</span></h2><p className="text-xs text-[#725c64]">Photos from {businessName}</p></div><div className="flex flex-wrap items-center gap-1.5">{galleryCategories.map((category) => <button key={category} type="button" onClick={() => setGalleryFilter(category)} className={`rounded px-2.5 py-1.5 text-[10px] font-semibold ${galleryFilter === category ? 'bg-[#b30d4b] text-white' : 'border border-[#eadce2] bg-white text-[#4b2634]'}`}>{category}</button>)}<a href="#gallery" className="ml-1 rounded border border-[#c31453] px-2.5 py-1.5 text-[10px] font-bold text-[#b30d4b]">▣ View All Photos ({gallery.length})</a></div></div>
          {gallery.length ? <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{visibleGallery.map((item) => <button key={`${item.src}-${item.index}`} type="button" onClick={() => setLightbox(item.src)} className="aspect-[4/3] overflow-hidden rounded-md bg-[#f4e8ec]"><ImageFrame src={item.src} alt={`${businessName} gallery photo ${item.index + 1}`} className="transition duration-300 hover:scale-105" /></button>)}</div> : <p className="mt-3 rounded-md bg-[#fff7f9] p-5 text-sm text-[#725c64]">Gallery photos have not been added yet.</p>}
          {gallery.length > 0 && visibleGallery.length === 0 && <p className="mt-3 text-xs text-[#725c64]">No photos are tagged for {galleryFilter}.</p>}
        </section>

        <section id="videos" className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7">
          <div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-2xl font-bold text-[#b30d4b]">Videos <span className="text-sm text-[#e7a542]">〰</span></h2><p className="text-xs text-[#725c64]">Watch venue and event highlights</p></div><a href="#videos" className="rounded border border-[#dca0b7] px-3 py-1.5 text-[10px] font-bold text-[#b30d4b]">▶ View All Videos</a></div>
          {videos.length ? <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{videos.slice(0, 8).map((video, index) => <div key={`${video.url}-${index}`} className="relative"><PublicVideoCard video={video} />{video.duration && <span className="absolute right-2 top-2 rounded bg-black/75 px-1.5 py-1 text-[10px] font-bold text-white">{video.duration}</span>}</div>)}</div> : <p className="mt-3 rounded-md bg-[#fff7f9] p-5 text-sm text-[#725c64]">Event videos have not been added yet.</p>}
        </section>

        <section id="facilities" className="bg-[#fff7f9] px-4 py-5 sm:px-7">
          <div className="mx-auto max-w-[1500px]"><h2 className="font-display text-2xl font-bold text-[#b30d4b]">Features &amp; Infrastructure <span className="text-sm text-[#e7a542]">〰</span></h2><p className="text-xs text-[#725c64]">Facilities listed for this venue</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{facilities.map((facility, index) => <div key={facility.label} className={`flex min-h-14 items-center gap-2 rounded-md border px-3 py-2 ${facility.available ? 'border-[#f0e2e7] bg-white' : 'border-transparent bg-white/60 opacity-60'}`}><span className={`grid h-8 w-8 shrink-0 place-items-center rounded text-base ${facility.available ? 'bg-[#fff0f4] text-[#c31453]' : 'bg-[#f1edef] text-[#a2969b]'}`}>{['❄', '♜', '♧', '♙', 'P', 'ϟ', '◉', '↟', '♧', '✿'][index]}</span><span className="text-[10px] font-bold leading-4">{facility.label}</span><span className="ml-auto text-xs" aria-label={facility.available ? 'Available' : 'Not confirmed'}>{facility.available ? '✓' : '·'}</span></div>)}</div>
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7">
          <div className="mb-3"><h2 className="font-display text-2xl font-bold text-[#b30d4b]">Customer Reviews <span className="text-sm text-[#e7a542]">〰</span></h2><p className="text-xs text-[#725c64]">Share your experience with us</p></div>
          <div className="rounded-md border border-[#f2e4e9] bg-white p-3 sm:p-5"><ReviewsSection placeId={place._id} /></div>
        </section>

        <section id="contact" className="bg-[#4a0828] px-4 py-6 text-white sm:px-7">
          <div className="mx-auto grid max-w-[1500px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div><h3 className="font-display text-lg font-bold">Our Location</h3><p className="mt-2 text-xs leading-5 text-white/75">{location || 'Address not provided'}</p>{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded border border-[#eea9c0] px-3 py-1.5 text-[10px] font-bold">⌖ View on Map</a>}</div>
            <div><h3 className="font-display text-lg font-bold">Contact Details</h3><div className="mt-2 space-y-1.5 text-xs text-white/75">{phone && <a href={callUrl} className="block">☎ {phone}</a>}{email && <a href={`mailto:${email}`} className="block">✉ {email}</a>}{website && <a href={website} target="_blank" rel="noreferrer" className="block">↗ {website}</a>}{hours.map((hour) => <p key={hour.day} className="capitalize">{hour.day}: {hour.closed ? 'Closed' : `${hour.open || ''}${hour.open && hour.close ? ' - ' : ''}${hour.close || ''}`}</p>)}{hours.length === 0 && <p>Working hours not provided</p>}</div></div>
            <div><h3 className="font-display text-lg font-bold">Follow Us</h3><div className="mt-3 flex flex-wrap gap-2">{Object.entries(socialLinks).filter(([, value]) => value).map(([network, value]) => <a key={network} href={toUrl(value)} target="_blank" rel="noreferrer" aria-label={network} className="grid h-8 min-w-8 place-items-center rounded bg-white/15 px-2 text-[10px] font-bold capitalize">{network}</a>)}</div><p className="mt-2 text-xs text-white/65">Stay connected for latest updates</p></div>
            <div><h3 className="font-display text-lg font-bold">G-Pages</h3><p className="mt-2 text-xs text-white/75">Powered by G-Pages</p><div className="mt-3 flex flex-wrap gap-2"><a href="/contact" className="rounded bg-white px-3 py-2 text-[10px] font-bold text-[#4a0828]">Contact</a><a href="/" className="rounded bg-white px-3 py-2 text-[10px] font-bold text-[#4a0828]">⌂ Back to Home</a></div></div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-3 left-1/2 z-40 w-[92%] max-w-sm -translate-x-1/2 rounded-full border border-[#f0dce3] bg-white/95 p-2 shadow-lg backdrop-blur md:hidden"><div className="flex gap-2">{phone && <a href={callUrl} className="flex-1 rounded-full bg-[#b30d4b] px-3 py-2 text-center text-xs font-bold text-white">Call</a>}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#12a85a] px-3 py-2 text-center text-xs font-bold text-white">WhatsApp</a>}<a href={bookingHref} className="flex-1 rounded-full bg-[#f9eaf0] px-3 py-2 text-center text-xs font-bold text-[#4a0828]">Book</a></div></div>

      {lightbox && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={() => setLightbox('')}><button type="button" onClick={() => setLightbox('')} className="absolute right-4 top-4 rounded bg-white px-3 py-2 text-sm font-bold text-[#4a0828]">Close</button><img src={lightbox} alt={`${businessName} gallery preview`} className="max-h-[90vh] max-w-[94vw] object-contain" onClick={(event) => event.stopPropagation()} /></div>}
    </div>
  );
}

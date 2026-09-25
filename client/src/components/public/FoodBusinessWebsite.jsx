import React, { useMemo, useState } from 'react';
import ReviewsSection from '../ReviewsSection';
import { getProfileData, ImageFrame, PublicVideoCard } from './PublicProfileShared';
import { getWhatsAppUrl } from '../../utils/healthcare';

const variants = {
  restaurant: {
    key: 'restaurant', label: 'Restaurant', eyebrow: 'Authentic taste. Unforgettable moments.', accent: '#a83f32', dark: '#2f1711', soft: '#fff8f3', nav: ['Home', 'About Us', 'Menu', 'Specials', 'Gallery', 'Videos', 'Reviews', 'Contact'], heroCta: 'View Our Menu', secondaryCta: 'Book a Table', sections: ['Our Popular Dishes', 'About Us', 'Our Services', 'Our Gallery'],
  },
  'coffee-shop': {
    key: 'coffee-shop', label: 'Coffee Shop', eyebrow: 'Slow mornings. Better coffee.', accent: '#8b5e3c', dark: '#2d211b', soft: '#fbf7f0', nav: ['Home', 'About', 'Coffee', 'Menu', 'Gallery', 'Videos', 'Reviews', 'Contact'], heroCta: 'Explore Menu', secondaryCta: 'Visit Us', sections: ['Coffee Menu', 'About Café', 'Café Services', 'Gallery'],
  },
  bakery: {
    key: 'bakery', label: 'Sweet Shop & Bakery', eyebrow: 'Made fresh for meaningful moments.', accent: '#b66a55', dark: '#44231e', soft: '#fff8f7', nav: ['Home', 'About', 'Sweets', 'Cakes', 'Bakery', 'Gallery', 'Videos', 'Contact'], heroCta: 'View Products', secondaryCta: 'Order / Enquire', sections: ['Featured Products', 'About Us', 'Bakery Services', 'Our Gallery'],
  },
  catering: {
    key: 'catering', label: 'Catering Services', eyebrow: 'Thoughtful food for every gathering.', accent: '#b46b28', dark: '#2c2118', soft: '#fffaf2', nav: ['Home', 'About', 'Services', 'Menu', 'Packages', 'Gallery', 'Videos', 'Contact'], heroCta: 'View Packages', secondaryCta: 'Request Quote', sections: ['Our Services', 'About Catering', 'Event Menu', 'Our Gallery'],
  },
  'food-processing': {
    key: 'food-processing', label: 'Food Processing', eyebrow: 'Quality products. Consistent processes.', accent: '#2d6a4f', dark: '#102d2a', soft: '#f4faf7', nav: ['Home', 'About', 'Products', 'Manufacturing', 'Certifications', 'Gallery', 'Videos', 'Contact'], heroCta: 'View Products', secondaryCta: 'Contact Us', sections: ['Our Products', 'About Company', 'Manufacturing', 'Product Gallery'],
  },
};

const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[_\s]+/g, '-');
const toList = (value) => Array.isArray(value) ? value.filter(Boolean) : String(value || '').split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
const safeUrl = (value) => value && (/^https?:\/\//i.test(value) ? value : `https://${value}`);

function resolveVariant(place, profile) {
  const value = normalize(profile.businessType || place.subcategory?.slug || place.subcategory?.name || place.category?.slug || place.category?.name);
  if (value.includes('coffee')) return variants['coffee-shop'];
  if (value.includes('sweet') || value.includes('bakery')) return variants.bakery;
  if (value.includes('catering')) return variants.catering;
  if (value.includes('processing')) return variants['food-processing'];
  return variants.restaurant;
}

function dataValues(profile, ...keys) {
  for (const key of keys) {
    const value = profile[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
}

function ActionButton({ href, children, variant, external = false, style, title }) {
  if (!href) return null;
  return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} title={title} className={variant} style={style}>{children}</a>;
}

function FoodFooterIcon({ type }) {
  const paths = {
    phone: <path d="M7 4.5 9.5 4l1.6 4-2 1.5a13 13 0 0 0 5.4 5.4l1.5-2 4 1.6-.5 2.5c-.2 1-1 1.6-2 1.5C10.8 17.6 6.4 13.2 5.5 6.5c-.1-1 .5-1.8 1.5-2Z" />,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>,
    facebook: <path d="M14 21v-8h2.7l.4-3H14V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H8v3h2.8v8" />,
    youtube: <><rect x="3" y="5" width="18" height="14" rx="4" /><path d="m10 9 5 3-5 3Z" /></>,
    linkedin: <><path d="M6 9v10M6 5v.1M10 19v-6a4 4 0 0 1 8 0v6M10 9v10" /><circle cx="6" cy="5" r="1" /></>,
    whatsapp: <><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" /><path d="M9.2 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.2.1.4-.1.6l-.5.6c.7 1.2 1.6 2 2.8 2.6l.5-.5c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.3.6-.2 1-.8 1.4-1.6 1.4-2.1-.1-5.8-3.4-6.5-6.2-.2-.7.1-1.1.7-1.2Z" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.1 0l2-2A5 5 0 0 0 12 3.9l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">{paths[String(type).toLowerCase()] || paths.link}</svg>;
}

export default function FoodBusinessWebsite({ place }) {
  const profile = getProfileData(place);
  const variant = resolveVariant(place, profile);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const gallery = (profile.gallery?.length ? profile.gallery : place.images || []).filter(Boolean).slice(0, 10);
  const videoSource = profile.videos?.length ? profile.videos : place.video || place.videos || [];
  const videos = (Array.isArray(videoSource) ? videoSource : [videoSource]).map((v) => (typeof v === 'string' ? { url: v } : v)).filter((v) => v && v.url);
  const services = toList(profile.services || place.services);
  const facilities = toList(profile.infrastructure || place.facilities);
  const structuredProducts = dataValues(profile, 'menuItems', 'productsList');
  const products = Array.isArray(structuredProducts) && structuredProducts.length
    ? structuredProducts.filter((item) => item && (item.name || item.title))
    : toList(dataValues(profile, 'products', 'menu', 'cateringServices', 'beverageCategories', 'snacks')).map((name) => ({ name }));
  const social = profile.socialMedia || {};
  const phone = place.phone || profile.phone;
  const whatsapp = social.whatsapp || profile.whatsapp || phone;
  const website = safeUrl(place.website || profile.website);
  const maps = place.coordinates?.lat ? `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}` : place.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}` : '';
  const reservation = dataValues(profile, 'reservationUrl', 'bookingUrl', 'enquiryUrl');
  const actionUrl = reservation || (phone ? `tel:${phone}` : '#contact');
  const hours = Array.isArray(profile.openingHours) ? profile.openingHours : [];
  const location = [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name].filter(Boolean).join(', ');
  const highlights = [...services, ...facilities].filter(Boolean).slice(0, 6);
  const aboutImage = profile.aboutImage || gallery[1] || '';
  const productImages = gallery.slice(0, Math.min(products.length, 6));
  const navHref = (label) => label === 'Menu' ? '#menu' : label === 'Specials' ? '#specials' : `#${label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  const callUrl = phone ? `tel:${String(phone).replace(/\s/g, '')}` : '';
  const whatsappUrl = getWhatsAppUrl(whatsapp) || '';
  const structuredOffers = dataValues(profile, 'offers', 'specialOffersList');
  const specialOffers = Array.isArray(structuredOffers) && structuredOffers.length
    ? structuredOffers.filter((offer) => offer && (offer.title || offer.name))
    : toList(dataValues(profile, 'specialOffers', 'specialItems')).map((title) => ({ title }));
  const actionClass = 'inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-bold transition hover:brightness-95';

  return <div className="min-h-screen text-[#332622]" style={{ backgroundColor: variant.soft, '--food-accent': variant.accent, '--food-dark': variant.dark }}>
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a href="#home" className="flex min-w-0 items-center gap-3"><div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-black/10 bg-white"><ImageFrame src={profile.logo} alt={`${place.name} logo`} /></div><div className="min-w-0"><p className="truncate font-display text-xl font-bold" style={{ color: variant.dark }}>{place.name}</p><p className="truncate text-[11px] text-black/55">{profile.tagline || variant.label}</p></div></a>
        <nav className="hidden items-center gap-6 text-xs font-bold lg:flex">{variant.nav.map((item) => <a key={item} href={navHref(item)} className="hover:opacity-60">{item}</a>)}</nav>
        <div className="hidden items-center gap-2 md:flex">{whatsappUrl ? <ActionButton href={whatsappUrl} external title="Chat on WhatsApp" variant="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-xl text-white shadow-sm hover:bg-emerald-600" style={{ color: 'white' }}><span aria-hidden="true">💬</span><span className="sr-only">WhatsApp</span></ActionButton> : <ActionButton href={callUrl} variant={`${actionClass} border border-black/10 bg-white`}>Call</ActionButton>}<ActionButton href={actionUrl} external={Boolean(reservation)} variant={`${actionClass} text-white`} style={{ backgroundColor: variant.accent }}>{variant.secondaryCta}</ActionButton></div>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded border border-black/15 px-3 py-2 text-lg lg:hidden" aria-label="Open navigation">☰</button>
      </div>
      {menuOpen && <nav className="border-t border-black/10 bg-white px-5 py-2 lg:hidden">{variant.nav.map((item) => <a key={item} href={navHref(item)} onClick={() => setMenuOpen(false)} className="block border-b border-black/10 py-3 text-sm font-semibold">{item}</a>)}</nav>}
    </header>

    <main>
      <section id="home" className="px-0 pb-0"><div className="relative isolate mx-auto min-h-[480px] max-w-[1520px] overflow-hidden text-white sm:min-h-[570px]"><div className="absolute inset-0"><ImageFrame src={profile.coverImage || gallery[0]} alt={`${place.name} cover`} eager /><div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${variant.dark}e8 0%, ${variant.dark}99 42%, transparent 86%)` }} /></div><div className="relative flex min-h-[480px] items-end px-6 py-12 sm:min-h-[570px] sm:px-12 sm:py-16"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200">{variant.eyebrow}</p><p className="mt-4 text-sm font-semibold uppercase tracking-[0.15em] text-white/75">{place.subcategory?.name || place.category?.name || variant.label}</p><h1 className="mt-2 font-display text-5xl font-bold leading-[0.98] sm:text-7xl">{profile.tagline || place.name}</h1>{profile.about && <p className="mt-5 max-w-xl text-base leading-7 text-white/85">{profile.about}</p>}<div className="mt-7 flex flex-wrap gap-3"><a href="#products" className={`${actionClass} text-white`} style={{ backgroundColor: variant.accent }}>{variant.heroCta}</a><a href={actionUrl} target={reservation ? '_blank' : undefined} rel={reservation ? 'noreferrer' : undefined} className={`${actionClass} border border-white/70 bg-white/10 text-white`}>{variant.secondaryCta}</a></div>{location && <p className="mt-5 text-sm text-white/75">⌖ {location}</p>}</div></div></div></section>

      {highlights.length > 0 && <section className="border-b border-black/10 bg-white"><div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-black/10 sm:grid-cols-3 lg:grid-cols-6">{highlights.map((item) => <div key={item} className="px-4 py-6 text-center"><div className="mx-auto mb-2 text-2xl" style={{ color: variant.accent }}>✦</div><p className="text-sm font-bold">{item}</p></div>)}</div></section>}

      <section id="about-us" className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div className="h-72 overflow-hidden rounded-lg sm:h-96"><ImageFrame src={aboutImage} alt={`${place.name} interior`} /></div><div><p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: variant.accent }}>About Us</p><h2 className="mt-2 font-display text-4xl font-bold" style={{ color: variant.dark }}>{variant.label === 'Food Processing' ? 'Built on quality and consistency' : `Welcome to ${place.name}`}</h2>{profile.about && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-black/65">{profile.about}</p>}<div className="mt-6 grid grid-cols-2 gap-4">{profile.cuisineType && <div><span className="text-xs uppercase text-black/45">Cuisine</span><strong className="mt-1 block">{profile.cuisineType}</strong></div>}{profile.priceRange && <div><span className="text-xs uppercase text-black/45">Price range</span><strong className="mt-1 block">{profile.priceRange}</strong></div>}{profile.establishedYear && <div><span className="text-xs uppercase text-black/45">Established</span><strong className="mt-1 block">{profile.establishedYear}</strong></div>}</div></div></section>

      {products.length > 0 && <section id={variant.key === 'food-processing' ? 'products' : 'menu'} className="bg-white px-5 py-14 sm:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: variant.accent }}>{variant.key === 'food-processing' ? 'Products' : 'Featured'}</p><h2 className="mt-2 font-display text-4xl font-bold" style={{ color: variant.dark }}>{variant.sections[0]}</h2></div><a href="#contact" className="text-sm font-bold" style={{ color: variant.accent }}>View all →</a></div><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map((item, index) => <article key={`${item.name || item}-${index}`} className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm"><div className="h-44">{item.image || productImages[index] ? <img src={item.image || productImages[index]} alt={item.name || item} loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-3xl" style={{ backgroundColor: `${variant.accent}18`, color: variant.accent }}>✦</div>}</div><div className="p-4"><h3 className="font-bold">{item.name || item}</h3>{item.category && <p className="mt-1 text-xs font-semibold" style={{ color: variant.accent }}>{item.category}</p>}{item.description && <p className="mt-2 text-sm text-black/60">{item.description}</p>}{item.price && <p className="mt-3 text-sm font-bold">{item.price}</p>}{item.dietary && <p className="mt-1 text-xs text-black/50">{item.dietary}</p>}</div></article>)}</div></div></section>}

      {specialOffers.length > 0 && <section id="specials" className="px-5 py-10 sm:px-8"><div className="mx-auto max-w-7xl rounded-lg border border-black/10 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: variant.accent }}>Specials</p><h2 className="mt-2 font-display text-3xl font-bold" style={{ color: variant.dark }}>Today&apos;s specials</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{specialOffers.map((offer, index) => <div key={`${offer.title || offer.name}-${index}`} className="rounded-md border border-black/10 p-4"><h3 className="text-sm font-bold">{offer.title || offer.name}</h3>{offer.description && <p className="mt-2 text-sm text-black/60">{offer.description}</p>}{offer.validity && <p className="mt-2 text-xs text-black/50">Valid: {offer.validity}</p>}{offer.discount && <p className="mt-2 text-sm font-bold" style={{ color: variant.accent }}>{offer.discount}</p>}</div>)}</div></div></section>}

      {services.length > 0 && <section id="services" className="px-5 py-14 sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: variant.accent }}>{variant.sections[2]}</p><h2 className="mt-2 font-display text-4xl font-bold" style={{ color: variant.dark }}>{variant.key === 'food-processing' ? 'Manufacturing & capabilities' : variant.sections[2]}</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map((item) => <div key={item} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm"><div className="text-2xl" style={{ color: variant.accent }}>✦</div><h3 className="mt-4 font-bold">{item}</h3></div>)}</div></div></section>}

      {facilities.length > 0 && <section id="facilities" className="bg-white px-5 py-14 sm:px-8"><div className="mx-auto max-w-7xl"><h2 className="font-display text-4xl font-bold" style={{ color: variant.dark }}>{variant.key === 'food-processing' ? 'Facilities & quality' : 'Services & facilities'}</h2><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{facilities.map((item) => <div key={item} className="rounded-lg border border-black/10 p-4 text-sm font-bold">{item}</div>)}</div></div></section>}

      {gallery.length > 0 && <section id="gallery" className="px-5 py-14 sm:px-8" style={{ backgroundColor: variant.dark, color: 'white' }}><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200">{variant.sections[3]}</p><h2 className="mt-2 font-display text-4xl font-bold">Gallery</h2><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{gallery.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => setLightbox(image)} className="aspect-square overflow-hidden rounded-lg text-left"><img src={image} alt={`${place.name} gallery ${index + 1}`} loading="lazy" className="h-full w-full object-cover transition hover:scale-105" /></button>)}</div></div></section>}

      <section id="videos" className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: variant.accent }}>Videos</p>
        <h2 className="mt-2 font-display text-4xl font-bold" style={{ color: variant.dark }}>Video Gallery</h2>
        {videos.length > 0 ? (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => (
              <PublicVideoCard key={`${video.url}-${index}`} video={video} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-black/15 bg-black/[0.02] p-8 text-center">
            <p className="text-sm font-medium text-black/55">No videos added yet.</p>
          </div>
        )}
      </section>

      {hours.length > 0 && <section id="hours" className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><h2 className="font-display text-4xl font-bold" style={{ color: variant.dark }}>Opening hours</h2><div className="mt-6 max-w-xl divide-y divide-black/10 rounded-lg border border-black/10 bg-white">{hours.map((hour) => <div key={hour.day} className="flex justify-between gap-4 px-5 py-3 text-sm"><span className="capitalize text-black/55">{hour.day}</span><strong>{hour.closed ? 'Closed' : `${hour.open || ''} - ${hour.close || ''}`}</strong></div>)}</div></section>}

      <section id="reviews" className="bg-white px-5 py-14 sm:px-8"><div className="mx-auto max-w-5xl"><ReviewsSection placeId={place._id} /></div></section>

      <section id="contact" className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_.8fr]"><div><p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: variant.accent }}>Contact</p><h2 className="mt-2 font-display text-4xl font-bold" style={{ color: variant.dark }}>Come by, call, or enquire</h2><div className="mt-5 space-y-3 text-sm text-black/65">{location && <p>⌖ {location}</p>}{phone && <p>☎ {phone}</p>}{place.email && <p>✉ {place.email}</p>}{website && <p>◉ {website}</p>}</div><div className="mt-6 flex flex-wrap gap-2"><ActionButton href={callUrl} variant={`${actionClass} text-white`} style={{ backgroundColor: variant.accent }}>Call</ActionButton><ActionButton href={whatsappUrl} external variant={`${actionClass} bg-emerald-500 text-white`}>WhatsApp</ActionButton><ActionButton href={maps} external variant={`${actionClass} border border-black/10 bg-white`}>Directions</ActionButton></div><div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">{Object.entries(social).filter(([, value]) => value).map(([name, value]) => <a key={name} href={safeUrl(value)} target="_blank" rel="noreferrer" style={{ color: variant.accent }}>{name}</a>)}</div></div>{place.address && <iframe title={`${place.name} map`} src={`https://www.google.com/maps?q=${encodeURIComponent(place.address)}&output=embed`} className="h-72 w-full rounded-lg border border-black/10" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}</section>
    </main>

    <footer className="px-5 py-10 text-white sm:px-8" style={{ backgroundColor: variant.dark }}><div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4"><div><div className="flex items-center gap-3"><div className="h-11 w-11 overflow-hidden rounded-full bg-white"><ImageFrame src={profile.logo} alt={`${place.name} logo`} /></div><p className="font-display text-xl font-bold">{place.name}</p></div></div><div><h3 className="font-bold">Quick Links</h3><div className="mt-3 space-y-2 text-sm text-white/70">{variant.nav.slice(0, 6).map((item) => <a key={item} href={navHref(item)} className="block hover:text-white">{item}</a>)}</div></div><div><h3 className="font-bold">Contact Us</h3><div className="mt-3 space-y-2 text-sm text-white/70">{phone && <a href={callUrl} className="flex items-center gap-2 hover:text-white"><FoodFooterIcon type="phone" />{phone}</a>}{place.email && <a href={`mailto:${place.email}`} className="flex items-center gap-2 hover:text-white"><FoodFooterIcon type="email" />{place.email}</a>}{location && <p className="flex items-start gap-2"><FoodFooterIcon type="location" /><span>{location}</span></p>}</div></div><div><h3 className="font-bold">Follow Us</h3><div className="mt-3 flex flex-wrap gap-2 text-sm text-white/70">{Object.entries(social).filter(([, value]) => value).map(([name, value]) => <a key={name} href={safeUrl(value)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 hover:text-white"><FoodFooterIcon type={name} />{name}</a>)}</div></div></div><div className="mx-auto mt-8 max-w-7xl border-t border-white/15 pt-4 text-xs text-white/45">© {new Date().getFullYear()} {place.name}. All rights reserved.</div></footer>

    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 p-2 shadow-xl backdrop-blur lg:hidden"><div className="mx-auto flex max-w-md gap-2"><ActionButton href={callUrl} variant={`${actionClass} flex-1 bg-black text-white px-2 py-2.5 text-xs`}>Call</ActionButton><ActionButton href={whatsappUrl} external variant={`${actionClass} flex-1 bg-emerald-500 text-white px-2 py-2.5 text-xs`}>WhatsApp</ActionButton><ActionButton href={actionUrl} external={Boolean(reservation)} variant={`${actionClass} flex-1 text-white px-2 py-2.5 text-xs`} style={{ backgroundColor: variant.accent }}>{variant.key === 'food-processing' ? 'Enquire' : variant.heroCta}</ActionButton></div></div>
    {lightbox && <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={() => setLightbox(null)}><button type="button" onClick={() => setLightbox(null)} className="absolute right-4 top-4 rounded bg-white px-3 py-2 text-sm font-bold text-black">Close</button><img src={lightbox} alt={`${place.name} enlarged gallery`} className="max-h-[90vh] max-w-[94vw] object-contain" onClick={(event) => event.stopPropagation()} /></div>}
  </div>;
}

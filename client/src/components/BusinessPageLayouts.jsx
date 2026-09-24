import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import ReviewsSection from './ReviewsSection';
import { CATEGORY_MODULES } from '../data/businessConfig';
import { getCategoryConfig } from '../data/businessConfig';
import BusinessChat from './BusinessChat';

const safeExternalUrl = (value) => {
  if (!value) return null;
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
};

function ContactPanel({ place, mapsUrl, onReport }) {
  const website = safeExternalUrl(place.website);
  return (
    <aside className="flex flex-col gap-4">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
        <div className="mt-4 flex flex-col gap-2 text-sm text-ink/70">
          {place.phone && <a href={`tel:${place.phone}`} className="hover:text-cyan-700">Call {place.phone}</a>}
          {place.email && <a href={`mailto:${place.email}`} className="hover:text-cyan-700">{place.email}</a>}
          <span>{place.address}</span>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-cyan-700 hover:underline">Get directions</a>
          {website && <a href={website} target="_blank" rel="noopener noreferrer" className="font-medium text-cyan-700 hover:underline">Visit official website</a>}
          <button type="button" onClick={onReport} className="text-left font-medium text-vermilion hover:underline">Report listing</button>
        </div>
      </div>
      <ReviewsSection placeId={place._id} />
    </aside>
  );
}

function BusinessHeader({ place, sections }) {
  const whatsapp = place.socialLinks?.whatsapp;
  const whatsappUrl = whatsapp ? (whatsapp.startsWith('http') ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g, '')}`) : null;
  return <header className="border-b border-[#b8e7e5] bg-[#082f49] text-white"><div className="container-page flex flex-wrap items-center justify-between gap-4 py-4"><Link to="/" className="text-sm text-white/70 hover:text-white">← Back to G-PAGES</Link><div className="order-first flex min-w-0 items-center gap-3 sm:order-none"><img src={place.logo || '/images/branding/gpages-logo.png'} alt={`${place.name} logo`} className="h-10 w-10 rounded-lg bg-white object-contain p-1" /><span className="truncate font-display text-lg font-semibold">{place.name}</span></div><nav className="flex max-w-full gap-3 overflow-x-auto text-xs font-semibold text-white/70">{sections.map(([id, label]) => <a key={id} href={`#${id}`} className="whitespace-nowrap hover:text-white">{label}</a>)}{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-[#7ee2a8]">WhatsApp</a>}</nav></div></header>;
}

function BusinessFooter({ place }) {
  return <footer className="mt-10 bg-[#071d33] py-8 text-paper/70"><div className="container-page flex flex-wrap items-center justify-between gap-3 text-sm"><span>{place.name}</span><Link to="/" className="hover:text-white">Back to G-PAGES</Link></div></footer>;
}

function Hero({ place, dynamic, onShare }) {
  const cover = place.coverImage || place.images?.[0];
  return (
    <section className={`relative overflow-hidden rounded-[1.5rem] ${dynamic ? 'border border-cyan-100 shadow-[0_20px_60px_rgba(8,127,140,.16)]' : 'border border-line shadow-sm'}`}>
      <div className="relative min-h-[300px] overflow-hidden bg-[#082f49] sm:min-h-[390px]">
        {cover ? <img src={cover} alt={`${place.name} cover`} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-[linear-gradient(135deg,#082f49,#0b7285_58%,#14b8a6)]" />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,31,49,.08),rgba(4,31,49,.92))]" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-9">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-cyan-200">
            <span>{place.category?.name}</span>{place.subcategory && <><span>/</span><span>{place.subcategory}</span></>}
            {dynamic && <span className="rounded-full bg-amber-300 px-2.5 py-1 text-[10px] text-[#063047]">Premium</span>}
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">{place.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">{place.description || 'Business information and services from the G-PAGES directory.'}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <FavoriteButton placeId={place._id} />
            <button type="button" onClick={onShare} className="rounded border border-white/50 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15">Share</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Media({ place, dynamic }) {
  const images = place.images || [];
  const videos = dynamic ? (place.videos || []).filter((video) => video.url) : [];
  return (
    <>
      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
        <h2 className="font-display text-2xl font-semibold text-ink">{dynamic ? 'Gallery & showcase' : 'Gallery'}</h2>
        {images.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${place.name} gallery ${index + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />)}</div> : <p className="mt-4 text-sm text-ink/50">No photos yet.</p>}
        {dynamic && videos.length > 0 && <div className="mt-7 grid gap-4 md:grid-cols-2">{videos.map((video, index) => <video key={video.url || index} controls preload="metadata" className="w-full rounded-xl bg-ink" src={video.url} />)}</div>}
      </section>
      {dynamic && place.testimonials?.length > 0 && <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7"><h2 className="font-display text-2xl font-semibold text-ink">Testimonials</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{place.testimonials.map((item, index) => <blockquote key={item._id || index} className="rounded-xl bg-cyan-50 p-4 text-sm text-ink/70">“{item.text || item.quote}”<footer className="mt-2 font-semibold text-cyan-800">{item.name || 'Customer'}</footer></blockquote>)}</div></section>}
    </>
  );
}

function ContentModules({ place, dynamic }) {
  const configuredModules = getCategoryConfig(place.subcategory).modules;
  const modules = dynamic ? (configuredModules.length ? configuredModules : CATEGORY_MODULES[place.subcategory] || []) : [];
  const data = place.categoryData || {};
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-700">{dynamic ? 'Business highlights' : 'What we offer'}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Services & information</h2>
      {place.services?.length > 0 && <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{place.services.map((service) => <div key={service} className="rounded-xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm font-medium text-ink/75">{service}</div>)}</div>}
      {modules.length > 0 && <div className="mt-6 grid gap-3 sm:grid-cols-2">{modules.map((module) => { const value = data[module]; if (!value || (Array.isArray(value) && value.length === 0)) return null; return <div key={module} className="rounded-xl border border-line p-4"><h3 className="font-semibold capitalize text-ink">{module.replace(/[A-Z]/g, (letter) => ` ${letter}`)}</h3><p className="mt-2 text-sm text-ink/55">{Array.isArray(value) ? value.join(', ') : value}</p></div>; })}</div>}
      {!place.services?.length && !modules.length && <p className="mt-4 text-sm text-ink/50">Business information will be updated soon.</p>}
    </section>
  );
}

const religiousThemeMap = {
  Temples: {
    nav: ['Home', 'About', 'Pooja & Sevas', 'Events', 'Gallery', 'Contact'],
    palette: 'bg-[#f9f3ea] text-[#382517] border-[#d8b892]',
    hero: 'from-[#4a1d11]/90 via-[#7a3f1d]/75 to-[#1b100c]/90',
    accent: 'bg-[#9a5f34] text-white',
    highlight: 'bg-[#f2e1ca] text-[#4a2b14]',
    badge: 'bg-[#dcb06e] text-[#2b1c11]',
    cta: 'Book Darshan',
  },
  Churches: {
    nav: ['Home', 'About', 'Worship', 'Events', 'Gallery', 'Contact'],
    palette: 'bg-[#f4f8ff] text-[#172b46] border-[#bacfe8]',
    hero: 'from-[#102b52]/90 via-[#214d7d]/75 to-[#101e34]/90',
    accent: 'bg-[#204f82] text-white',
    highlight: 'bg-[#eaf1ff] text-[#17385b]',
    badge: 'bg-[#d4b167] text-[#172b46]',
    cta: 'Join Service',
  },
  Trusts: {
    nav: ['Home', 'About', 'Mission', 'Impact', 'Programs', 'Contact'],
    palette: 'bg-[#f5faf4] text-[#173325] border-[#bfd7c8]',
    hero: 'from-[#163b2e]/90 via-[#2d5e4d]/75 to-[#101b17]/90',
    accent: 'bg-[#2d6650] text-white',
    highlight: 'bg-[#edf7ee] text-[#214a3b]',
    badge: 'bg-[#d7aa5b] text-[#173325]',
    cta: 'Support Us',
  },
  NGOs: {
    nav: ['Home', 'About', 'Mission', 'Programs', 'Volunteers', 'Contact'],
    palette: 'bg-[#f7f8f3] text-[#1b2f35] border-[#d0e1d9]',
    hero: 'from-[#10343e]/90 via-[#235f68]/75 to-[#101b20]/90',
    accent: 'bg-[#1b6a73] text-white',
    highlight: 'bg-[#edf4f7] text-[#1f4f58]',
    badge: 'bg-[#d8b067] text-[#1b2f35]',
    cta: 'Volunteer',
  },
  Associations: {
    nav: ['Home', 'About', 'Members', 'Activities', 'Events', 'Contact'],
    palette: 'bg-[#f4f8fc] text-[#1d2c3d] border-[#c7d8ec]',
    hero: 'from-[#1b2f47]/90 via-[#356186]/75 to-[#101b29]/90',
    accent: 'bg-[#355d82] text-white',
    highlight: 'bg-[#edf3fb] text-[#223e5f]',
    badge: 'bg-[#d8b16c] text-[#1d2c3d]',
    cta: 'Become a Member',
  },
};

function getReligiousTheme(subcategory) {
  const normalized = String(subcategory || 'Temples').trim().toLowerCase();
  if (normalized === 'churches' || normalized === 'church') return religiousThemeMap.Churches;
  if (normalized === 'trusts' || normalized === 'trust') return religiousThemeMap.Trusts;
  if (normalized === 'ngos' || normalized === 'ngo') return religiousThemeMap.NGOs;
  if (normalized === 'associations' || normalized === 'association') return religiousThemeMap.Associations;
  return religiousThemeMap.Temples;
}

export function ReligiousSocialBrandPage({ place, mapsUrl, onShare, onReport }) {
  const subcategory = place?.subcategory || 'Temples';
  const theme = getReligiousTheme(subcategory);
  const cover = place.coverImage || place.images?.[0] || null;
  const images = Array.isArray(place.images) ? place.images.slice(0, 8) : [];
  const services = Array.isArray(place.services) ? place.services.filter(Boolean) : [];
  const categoryData = place.categoryData || {};
  const driveCards = [
    ['Mission', categoryData.mission || categoryData.vision || 'Community-first service and growth'],
    ['Programs', categoryData.programs || categoryData.activities || categoryData.poojaServices || categoryData.worshipServices || 'Program details will be updated soon.'],
    ['Impact', categoryData.impact || categoryData.memberships || categoryData.communityPrograms || 'Dedicated service to the community and members'],
    ['Events', categoryData.events || categoryData.festivals || 'Upcoming events and gathering details'],
  ];
  const navItems = theme.nav.map((label) => ({
    label,
    href: `#${label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')}`,
  }));

  return (
    <div className={`min-h-screen ${theme.palette}`}>
      <header className="sticky top-0 z-40 border-b border-current/10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {place.logo ? (
              <img src={place.logo} alt={`${place.name} logo`} className="h-11 w-11 rounded-xl object-contain bg-white p-1 shadow-sm" />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3ebdf] text-lg font-bold text-[#5a341a] shadow-sm">{(place.name || 'O').charAt(0).toUpperCase()}</div>
            )}
            <div className="min-w-0">
              <div className="truncate font-display text-lg font-bold text-[#1d120d] sm:text-xl">{place.name}</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5a341a]">{subcategory}</div>
            </div>
          </div>

          <nav className="hidden items-center gap-5 text-sm font-medium text-[#2a231d] lg:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-[#7a3f1d]">{item.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="inline-flex items-center rounded-full border border-current/10 bg-[#f6f2ea] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4a2b14] transition hover:bg-[#efe4d3]">
              Back to Home
            </Link>
            {place.website && (
              <a href={safeExternalUrl(place.website) || '#'} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#c7d0d8] bg-white px-3 py-2 text-xs font-semibold text-[#1f2d3d] shadow-sm sm:px-4 sm:text-sm">
                Website
              </a>
            )}
            {place.socialLinks?.whatsapp && (
              <a href={place.socialLinks.whatsapp.startsWith('http') ? place.socialLinks.whatsapp : `https://wa.me/${place.socialLinks.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-xs font-bold text-white shadow-sm" aria-label="WhatsApp">
                W
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        <section id="home" className={`relative mx-auto w-full overflow-hidden rounded-[2rem] border ${theme.palette} shadow-[0_20px_60px_rgba(33,20,14,0.09)]`}>
          {cover ? <img src={cover} alt={`${place.name} cover`} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-[linear-gradient(135deg,#3d2a1d,#7a3f1d_45%,#1d120d)]" />}
          <div className={`absolute inset-0 bg-gradient-to-r ${theme.hero}`} />
          <div className="relative z-10 flex min-h-[500px] flex-col justify-end p-6 sm:min-h-[560px] sm:p-8 lg:min-h-[620px] lg:p-10">
            <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              {place.category?.name || 'Religious & Social'} · {subcategory}
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">{place.name}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{place.description || 'Detailed information about this community organization will be updated soon.'}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={place.phone ? `tel:${place.phone}` : '#contact'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${theme.badge}`}>
                {theme.cta}<span aria-hidden="true">→</span>
              </a>
              {place.socialLinks?.whatsapp && (
                <a href={place.socialLinks.whatsapp.startsWith('http') ? place.socialLinks.whatsapp : `https://wa.me/${place.socialLinks.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg font-bold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/15" aria-label="WhatsApp">
                  W
                </a>
              )}
              {place.website && <a href={safeExternalUrl(place.website) || '#'} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15">Website</a>}
              {place.address && <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15">View Location</a>}
            </div>
          </div>
        </section>

        <section id="about" className="mt-6 grid gap-6 rounded-[2rem] border border-current/10 bg-white p-5 shadow-sm sm:p-7 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a3f1d]">About</div>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#1d120d]">About this {subcategory}</h2>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-[#4b4038]">{place.description || 'Organization details will be updated soon.'}</p>
          </div>
          <div className={`rounded-[1.5rem] border ${theme.highlight} p-4`}>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a3f1d]">Quick information</div>
            <div className="mt-4 space-y-3 text-sm text-[#3d2a1d]">
              {place.phone && <div><strong>Phone:</strong> {place.phone}</div>}
              {place.email && <div><strong>Email:</strong> {place.email}</div>}
              {place.address && <div><strong>Address:</strong> {place.address}</div>}
              {place.website && <div><strong>Website:</strong> {place.website}</div>}
            </div>
          </div>
        </section>

        {(services.length || Object.keys(categoryData).length > 0) && (
          <section id="programs" className="mt-6 rounded-[2rem] border border-current/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a3f1d]">Services & Programs</div>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#1d120d]">Our offerings</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {driveCards.map(([label, value], index) => (
                <div key={label} className="rounded-[1.25rem] border border-current/10 bg-[#faf7f2] p-4">
                  <div className="text-2xl">{['🛕', '🙏', '❤️', '🌿'][index % 4]}</div>
                  <div className="mt-3 text-base font-semibold text-[#1d120d]">{label}</div>
                  <p className="mt-2 text-sm leading-6 text-[#54473d]">{Array.isArray(value) ? value.join(', ') : value}</p>
                </div>
              ))}
            </div>
            {services.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <span key={`${service}-${index}`} className="rounded-full border border-current/10 bg-[#f9f3ea] px-3 py-2 text-sm font-medium text-[#3d2a1d]">{service}</span>
                ))}
              </div>
            )}
          </section>
        )}

        {images.length > 0 && (
          <section id="gallery" className="mt-6 rounded-[2rem] border border-current/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a3f1d]">Gallery</div>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#1d120d]">Gallery</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {images.map((image, index) => (
                <a key={`${image}-${index}`} href={image} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[1.25rem] border border-current/10 bg-[#faf7f2]">
                  <img src={image} alt={`${place.name} gallery ${index + 1}`} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-[1.03]" />
                </a>
              ))}
            </div>
          </section>
        )}

        {place.address && (
          <section id="contact" className="mt-6 rounded-[2rem] border border-current/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a3f1d]">Location & Contact</div>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#1d120d]">Visit us</h2>
            <div className="mt-5 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-3 text-sm leading-7 text-[#4b4038]">
                {place.address && <div><strong>Address:</strong> {place.address}</div>}
                {place.phone && <div><strong>Phone:</strong> {place.phone}</div>}
                {place.email && <div><strong>Email:</strong> {place.email}</div>}
                {place.website && <div><strong>Website:</strong> {place.website}</div>}
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-current/10">
                <iframe title={`${place.name} map`} src={`https://www.google.com/maps?q=${encodeURIComponent(place.address)}&output=embed`} className="h-72 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export function StaticBusinessPage({ place, mapsUrl, onShare, onReport }) {
  return <PremiumBusinessPage place={place} mapsUrl={mapsUrl} onShare={onShare} onReport={onReport} />;
}

export function DynamicBusinessPage({ place, mapsUrl, onShare, onReport }) {
  return <PremiumBusinessPage place={place} mapsUrl={mapsUrl} onShare={onShare} onReport={onReport} />;
}

export function PremiumBusinessPage({ place, mapsUrl, onShare, onReport }) {
  const data = place.categoryData || {};
  const has = (key) => data[key] && (!Array.isArray(data[key]) || data[key].length > 0);
  const sections = [['overview', 'About'], ['services', 'Services']];
  if (place.images?.length) sections.push(['gallery', 'Gallery']);
  if (place.videos?.length || place.video) sections.push(['videos', 'Videos']);
  if (place.testimonials?.length) sections.push(['reviews', 'Reviews']);
  sections.push(['contact', 'Contact']);
  return <><BusinessHeader place={place} sections={sections} /><div className="bg-[radial-gradient(circle_at_8%_8%,rgba(20,184,166,0.10),transparent_22rem),radial-gradient(circle_at_92%_35%,rgba(59,130,246,0.09),transparent_26rem)]"><div className="container-page py-8 sm:py-10"><Hero place={place} dynamic onShare={onShare} /><div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]"><main className="flex flex-col gap-5"><section id="overview" className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7"><h2 className="font-display text-2xl font-semibold text-ink">About {place.name}</h2>{place.description && <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/65">{place.description}</p>}{Object.keys(data).length > 0 && <div className="mt-5 grid gap-3 sm:grid-cols-2">{Object.entries(data).filter(([, value]) => value && (!Array.isArray(value) || value.length)).map(([key, value]) => <div key={key} className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4"><div className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{key.replace(/[A-Z]/g, (letter) => ` ${letter}`)}</div><div className="mt-2 text-sm text-ink/70">{Array.isArray(value) ? value.join(', ') : value}</div></div>)}</div>}</section><section id="services"><ContentModules place={place} dynamic /></section>{(place.images?.length || place.videos?.length || place.video) && <section id="gallery"><Media place={place} dynamic /></section>}{place.testimonials?.length > 0 && <section id="reviews" className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7"><ReviewsSection placeId={place._id} /></section>}<section id="contact" className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7"><h2 className="font-display text-2xl font-semibold text-ink">Location &amp; contact</h2><p className="mt-3 text-[15px] text-ink/65">{place.address}</p></section></main><ContactPanel place={place} mapsUrl={mapsUrl} onReport={onReport} /></div></div></div><BusinessFooter place={place} /><BusinessChat place={place} /></>;
}

export function BusinessPreviewLink({ place }) {
  return <Link to={`/place/${place._id}`} className="text-sm font-medium text-cyan-700 hover:underline">Preview public page</Link>;
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import ReviewsSection from './ReviewsSection';
import { CATEGORY_MODULES, getCategoryConfig } from '../data/businessConfig';
import { getCategoryModules } from '../data/businessPageConfig';
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
  const normalizedSubcategory = String(subcategory || '').trim().toLowerCase();
  const isNgo = ['ngo', 'ngos'].includes(normalizedSubcategory);
  const theme = getReligiousTheme(subcategory);
  const cover = place.coverImage || place.images?.[0] || null;
  const images = Array.isArray(place.images) ? place.images.slice(0, 8) : [];
  const services = Array.isArray(place.services) ? place.services.filter(Boolean) : [];
  const categoryData = place.categoryData || {};
  const website = safeExternalUrl(place.website);
  const whatsappUrl = place.socialLinks?.whatsapp ? (place.socialLinks.whatsapp.startsWith('http') ? place.socialLinks.whatsapp : `https://wa.me/${place.socialLinks.whatsapp.replace(/\D/g, '')}`) : null;
  const socialLinks = place.socialLinks || {};
  const mission = categoryData.mission || categoryData.vision || place.description || 'We work for a stronger, healthier, and more empowered community.';
  const programs = categoryData.programs || categoryData.causes || categoryData.projects || services.length ? (categoryData.programs || categoryData.causes || categoryData.projects || services) : ['Education Support', 'Healthcare Access', 'Women Empowerment', 'Child Welfare'];
  const impactStats = [
    { label: 'People Supported', value: categoryData.impact?.match(/\d+/)?.[0] || '10,000+' },
    { label: 'Children Educated', value: categoryData.impact?.match(/\d+/g)?.[1] || '500+' },
    { label: 'Medical Aid Provided', value: categoryData.impact?.match(/\d+/g)?.[2] || '2,000+' },
    { label: 'Community Projects', value: categoryData.impact?.match(/\d+/g)?.[3] || '50+' },
  ];
  const galleryItems = images.length ? images : [
    'https://images.unsplash.com/photo-1517486800579-88f4f6b6c49b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80'
  ];
  const eventCards = Array.isArray(categoryData.events) ? categoryData.events.slice(0, 3) : [
    { title: 'Free Health Camp', date: '15 Apr', summary: 'Free health checkup and support for families in need.' },
    { title: 'Education Support Program', date: '22 Apr', summary: 'Distribution of school kits and learning support.' },
    { title: 'Tree Plantation Drive', date: '05 May', summary: 'Community environmental sustainability drive.' },
  ];
  const testimonials = [
    { name: 'Priya Sharna', text: 'This NGO has truly changed lives in our community with education and wellness support.', rating: 5 },
    { name: 'Ravi Kumar', text: 'The support and opportunities provided by this organization are inspiring and life-changing.', rating: 5 },
  ];

  if (isNgo) {
    return (
      <div className="min-h-screen bg-[#f5f7f2] text-[#1d2a24]">
        <header className="sticky top-0 z-40 border-b border-[#dfe8de] bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              {place.logo ? (
                <img src={place.logo} alt={`${place.name} logo`} className="h-11 w-11 rounded-full object-cover ring-2 ring-[#dfe8de]" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf5eb] text-lg font-bold text-[#1c7245] ring-2 ring-[#dfe8de]">{(place.name || 'H').charAt(0).toUpperCase()}</div>
              )}
              <div className="min-w-0 leading-tight">
                <div className="truncate font-display text-lg font-bold text-[#123127]">{place.name}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#51705d]">Helping Today, Building Tomorrow</div>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm font-medium text-[#1d2a24] lg:flex">
              <Link to="/" className="text-[#1d2a24] hover:text-[#1c7245]">Home</Link>
              <a href="#about" className="hover:text-[#1c7245]">About</a>
              <a href="#services" className="hover:text-[#1c7245]">Our Services</a>
              <a href="#gallery" className="hover:text-[#1c7245]">Gallery</a>
              <a href="#events" className="hover:text-[#1c7245]">Events</a>
              <a href="#contact" className="hover:text-[#1c7245]">Contact</a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6eef6] text-sm font-bold text-[#1d2a24]">◎</a>}
              {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6eef6] text-sm font-bold text-[#1d2a24]">f</a>}
              {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4cc96d] text-sm font-bold text-white">W</a>}
              <a href={website || '#contact'} target={website ? '_blank' : undefined} rel={website ? 'noopener noreferrer' : undefined} className="rounded-full bg-[#1c7245] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-sm hover:bg-[#155a38]">Donate Now</a>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <section id="home" className="overflow-hidden rounded-[30px] border border-[#dfe8de] bg-white shadow-[0_18px_55px_rgba(12,34,20,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative flex flex-col justify-center bg-[linear-gradient(135deg,#f4fbf7,#edf7f0_35%,#f7f9f2)] p-6 sm:p-8 lg:p-10">
                <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c7245]">Education • Health • Community • Empowerment</div>
                <h1 className="max-w-xl font-display text-4xl font-bold leading-[1.02] text-[#123127] sm:text-5xl lg:text-[4rem]">
                  Together We Build<br />A Brighter Future
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#3a4d46]">
                  {mission}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#contact" className="rounded-full bg-[#1c7245] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#155a38]">Support Our Mission</a>
                  {website && <a href={website} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#cfe4d5] bg-white px-5 py-3 text-sm font-semibold text-[#123127] hover:bg-[#f5faf6]">Watch Our Story</a>}
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {['Education for All', 'Better Healthcare', 'Clean Environment', 'Community Support', 'Women Empowerment', 'Child Welfare'].map((tag) => (
                    <div key={tag} className="rounded-full border border-[#d7e9db] bg-[#f5faf6] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#214b3b]">{tag}</div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[360px] bg-[#dfeee7]">
                {cover ? <img src={cover} alt={`${place.name} cover`} className="h-full w-full object-cover" /> : <img src="https://images.unsplash.com/photo-1517486800579-88f4f6b6c49b?auto=format&fit=crop&w=1200&q=80" alt={`${place.name} cover`} className="h-full w-full object-cover" />}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,56,41,0.15),rgba(16,56,41,0.5))]" />
                <div className="absolute inset-x-6 bottom-6 rounded-[26px] border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1c7245] text-xl shadow-sm">♡</div>
                    <div>
                      <div className="text-lg font-bold">Small Actions</div>
                      <div className="text-sm text-white/80">Big Impact</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="mt-8 grid gap-6 rounded-[30px] bg-white p-6 shadow-[0_18px_55px_rgba(12,34,20,0.05)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <div className="overflow-hidden rounded-[24px] border border-[#dfe8de] bg-[#eaf3ed]">
              {galleryItems[0] && <img src={galleryItems[0]} alt={`${place.name} about`} className="h-full w-full object-cover" />}
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c7245]">About us</div>
              <h2 className="mt-3 font-display text-3xl font-bold text-[#123127] sm:text-4xl">Making a Difference in Our Community</h2>
              <p className="mt-4 text-base leading-8 text-[#3d4f48]">{mission}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium text-[#1b4337]">
                {(Array.isArray(categoryData.causes) ? categoryData.causes : ['Education Support', 'Healthcare Access', 'Community Development', 'Sustainable Future']).slice(0, 4).map((item) => (
                  <span key={item} className="rounded-full border border-[#dfe8de] bg-[#f5faf6] px-3 py-2">{item}</span>
                ))}
              </div>
              <a href="#services" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#edf7f0] px-4 py-2 text-sm font-semibold text-[#1c7245] hover:bg-[#e5f3ea]">Learn More <span aria-hidden="true">→</span></a>
            </div>
          </section>

          <section id="services" className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c7245]">Our services</div>
                <h2 className="mt-2 font-display text-3xl font-bold text-[#123127]">We Provide Support & Solutions</h2>
              </div>
              <div className="hidden items-center gap-2 text-sm text-[#476559] sm:flex">
                <button type="button" className="rounded-full border border-[#dfe8de] bg-white px-3 py-2">Like</button>
                <button type="button" className="rounded-full border border-[#dfe8de] bg-white px-3 py-2">Share</button>
                <button type="button" className="rounded-full border border-[#dfe8de] bg-white px-3 py-2">Comment</button>
                <button type="button" className="rounded-full border border-[#dfe8de] bg-white px-3 py-2">Report</button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {programs.slice(0, 5).map((service, index) => (
                <div key={`${service}-${index}`} className="rounded-[22px] border border-[#dfe8de] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#edf7f0] text-3xl">{['🎓', '🩺', '🌿', '👩', '🤝'][index % 5]}</div>
                  <div className="mt-4 text-xl font-bold text-[#123127]">{typeof service === 'string' ? service : service.title}</div>
                  <div className="mt-2 text-sm leading-6 text-[#4d605a]">{typeof service === 'string' ? 'Dedicated support to create meaningful social impact.' : service.summary}</div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1c7245]">Learn More <span aria-hidden="true">→</span></div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-4 bg-white p-4 shadow-[0_18px_55px_rgba(12,34,20,0.05)] sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
            {impactStats.map((stat) => (
              <div key={stat.label} className="rounded-[20px] border border-[#dfe8de] bg-[#f7faf7] p-5 text-center">
                <div className="font-display text-3xl font-bold text-[#1c7245]">{stat.value}</div>
                <div className="mt-2 text-sm text-[#4d605a]">{stat.label}</div>
              </div>
            ))}
            <div className="flex items-center justify-center rounded-[20px] border border-[#dfe8de] bg-[#f7faf7] p-5 text-center text-[#1c7245]">
              <div className="font-display text-3xl font-bold">Your Support</div>
            </div>
          </section>

          <section id="gallery" className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c7245]">Our gallery</div>
                <h2 className="mt-2 font-display text-3xl font-bold text-[#123127]">Moments of Hope & Change</h2>
              </div>
              <a href={galleryItems[0]} target="_blank" rel="noopener noreferrer" className="hidden text-sm font-semibold text-[#1c7245] hover:underline sm:inline-flex">View All Photos →</a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {galleryItems.slice(0, 5).map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-[22px] border border-[#dfe8de] bg-white shadow-sm">
                  <img src={image} alt={`${place.name} gallery ${index + 1}`} className="h-56 w-full object-cover" />
                </div>
              ))}
            </div>
          </section>

          <section id="events" className="mt-10 rounded-[30px] bg-white p-6 shadow-[0_18px_55px_rgba(12,34,20,0.05)] lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c7245]">Events & News</div>
                <h2 className="mt-2 font-display text-3xl font-bold text-[#123127]">Latest Updates & Activities</h2>
              </div>
              <a href="#contact" className="hidden text-sm font-semibold text-[#1c7245] hover:underline sm:inline-flex">View All →</a>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {eventCards.map((event, index) => (
                <div key={`${event.title}-${index}`} className="overflow-hidden rounded-[22px] border border-[#dfe8de] bg-[#f9fbf9]">
                  <div className="flex h-40 items-center justify-center bg-[linear-gradient(135deg,#dfeee7,#cfe8d8)] text-3xl font-bold text-[#1c7245]">{event.date}</div>
                  <div className="p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#1c7245]">{event.date}</div>
                    <h3 className="mt-2 text-xl font-bold text-[#123127]">{event.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#4d605a]">{event.summary || event.description || 'A community activity designed to create meaningful impact.'}</p>
                    <a href="#contact" className="mt-4 inline-flex text-sm font-semibold text-[#1c7245]">Read More →</a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-[30px] bg-white p-6 shadow-[0_18px_55px_rgba(12,34,20,0.05)] lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c7245]">Testimonials</div>
                <h2 className="mt-2 font-display text-3xl font-bold text-[#123127]">What People Say</h2>
              </div>
              <a href="#contact" className="hidden text-sm font-semibold text-[#1c7245] hover:underline sm:inline-flex">View All →</a>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {testimonials.map((t) => (
                <div key={t.name} className="rounded-[24px] border border-[#dfe8de] bg-[#f7faf7] p-5">
                  <div className="mb-3 text-[#f7b500] text-lg">{'★'.repeat(t.rating)}</div>
                  <p className="text-base leading-8 text-[#3d4f48]">“{t.text}”</p>
                  <div className="mt-4 font-semibold text-[#123127]">{t.name}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="contact" className="mt-10 overflow-hidden rounded-[30px] bg-[#0d422d] text-white">
            <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#bfe3cb]">Be a part of the change</div>
                <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Your support helps us reach more people, create better opportunities and build stronger communities.</h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={website || '#contact'} target={website ? '_blank' : undefined} rel={website ? 'noopener noreferrer' : undefined} className="rounded-full bg-[#1c7245] px-5 py-3 text-sm font-semibold text-white hover:bg-[#155a38]">Donate Now</a>
                  <a href={whatsappUrl || '#contact'} target={whatsappUrl ? '_blank' : undefined} rel={whatsappUrl ? 'noopener noreferrer' : undefined} className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Contact Details</a>
                </div>
              </div>
              <div className="grid gap-4 rounded-[26px] bg-white/5 p-5 backdrop-blur-sm">
                {place.address && <div><div className="text-xs font-bold uppercase tracking-[0.15em] text-[#bfe3cb]">Our location</div><div className="mt-2 text-sm leading-7 text-white/90">{place.address}</div></div>}
                {place.phone && <div><div className="text-xs font-bold uppercase tracking-[0.15em] text-[#bfe3cb]">Phone</div><div className="mt-2 text-sm text-white/90">{place.phone}</div></div>}
                {place.email && <div><div className="text-xs font-bold uppercase tracking-[0.15em] text-[#bfe3cb]">Email</div><div className="mt-2 text-sm text-white/90">{place.email}</div></div>}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

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
            {theme.nav.map((label) => (
              <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')}`} className="transition hover:text-[#7a3f1d]">{label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="inline-flex items-center rounded-full border border-current/10 bg-[#f6f2ea] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4a2b14] transition hover:bg-[#efe4d3]">
              Back to Home
            </Link>
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#c7d0d8] bg-white px-3 py-2 text-xs font-semibold text-[#1f2d3d] shadow-sm sm:px-4 sm:text-sm">
                Website
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-xs font-bold text-white shadow-sm" aria-label="WhatsApp">
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
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg font-bold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/15" aria-label="WhatsApp">
                  W
                </a>
              )}
              {website && <a href={website} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15">Website</a>}
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
              {website && <div><strong>Website:</strong> {place.website}</div>}
            </div>
          </div>
        </section>

        {(services.length || Object.keys(categoryData).length > 0) && (
          <section id="programs" className="mt-6 rounded-[2rem] border border-current/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a3f1d]">Services & Programs</div>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#1d120d]">Our offerings</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from(new Set([...(Array.isArray(categoryData.programs) ? categoryData.programs : []), ...(Array.isArray(categoryData.causes) ? categoryData.causes : []), ...services])).slice(0, 4).map((value, index) => (
                <div key={`${value}-${index}`} className="rounded-[1.25rem] border border-current/10 bg-[#faf7f2] p-4">
                  <div className="text-2xl">{['🛕', '🙏', '❤️', '🌿'][index % 4]}</div>
                  <div className="mt-3 text-base font-semibold text-[#1d120d]">{value}</div>
                </div>
              ))}
            </div>
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
                {website && <div><strong>Website:</strong> {place.website}</div>}
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

const MODULE_LABELS = {
  portfolio: 'Portfolio',
  albums: 'Albums',
  videos: 'Videos',
  testimonials: 'Testimonials',
  offers: 'Offers',
  events: 'Events',
  menu: 'Menu & Signature Items',
  courses: 'Courses & Programs',
  departments: 'Departments',
  doctors: 'Doctors & Specialists',
  facilities: 'Facilities',
  services: 'Services',
  products: 'Products',
  projects: 'Projects',
  fleet: 'Fleet & Service Areas',
  artworks: 'Artworks & Collections',
};

function normaliseUrl(value) {
  if (!value) return null;
  return value.startsWith('http') ? value : `https://${value}`;
}

function moduleKey(value) {
  return String(value || '').toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ContactLinks({ place }) {
  const links = [
    place.phone && [`tel:${place.phone}`, 'Call', '☎'],
    place.email && [`mailto:${place.email}`, 'Email', '✉'],
    place.socialLinks?.whatsapp && [normaliseUrl(place.socialLinks.whatsapp), 'WhatsApp', '◉'],
    place.socialLinks?.facebook && [normaliseUrl(place.socialLinks.facebook), 'Facebook', 'f'],
    place.socialLinks?.instagram && [normaliseUrl(place.socialLinks.instagram), 'Instagram', '◎'],
    place.website && [normaliseUrl(place.website), 'Official website', '↗'],
  ].filter(Boolean);

  if (!links.length) return <p className="text-sm text-ink/45">Contact details will be added soon.</p>;
  return <div className="grid gap-2 sm:grid-cols-2">{links.map(([href, label, icon]) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-3 text-sm text-ink/70 hover:border-[#a47b2c] hover:text-ink"><span className="text-[#a47b2c]">{icon}</span>{label}</a>)}</div>;
}

function MediaGallery({ place }) {
  const [selected, setSelected] = useState(null);
  const images = place.images || [];
  if (!images.length) return <div className="rounded-xl border border-dashed border-line bg-white/60 p-8 text-center text-sm text-ink/45">No photos yet.</div>;
  return <>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{images.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => setSelected(image)} className="group overflow-hidden rounded-xl border border-line bg-white text-left"><img src={image} alt={`${place.name} photo ${index + 1}`} loading="lazy" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" /></button>)}</div>
    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071d33]/90 p-4" role="dialog" aria-modal="true" onClick={() => setSelected(null)}><button type="button" className="absolute right-5 top-5 text-3xl text-white" onClick={() => setSelected(null)} aria-label="Close image">×</button><img src={selected} alt={`${place.name} enlarged`} className="max-h-[90vh] max-w-full rounded-lg object-contain" onClick={(event) => event.stopPropagation()} /></div>}
  </>;
}

function ModuleSection({ module, place }) {
  const label = MODULE_LABELS[module] || module.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
  const values = place.attributes?.[module] || place[module];
  if (!values?.length && typeof values !== 'string') return null;
  const items = Array.isArray(values) ? values : [values];
  return <section className="rounded-xl border border-[#e8dfcb] bg-white p-5 shadow-sm sm:p-6"><h2 className="font-display text-2xl font-semibold text-ink">{label}</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{items.map((item, index) => { const details = typeof item === 'object' ? item : null; return <div key={`${details?.name || item}-${index}`} className="rounded-lg bg-[#fff8e9] px-3 py-3 text-sm text-ink/70">{details ? <><p className="font-semibold text-ink">{details.name || details.title || 'Details'}</p>{details.duration && <p className="mt-1">Duration: {details.duration}</p>}{details.type && <p className="mt-1">Type: {details.type}</p>}{details.medium && <p className="mt-1">Medium: {details.medium}</p>}{details.subjects && <p className="mt-1">Subjects: {details.subjects}</p>}{details.eligibility && <p className="mt-1">Eligibility: {details.eligibility}</p>}{details.fee && <p className="mt-1">Fee: {details.fee}</p>}{details.description && <p className="mt-1">{details.description}</p>}</> : item}</div>; })}</div></section>;
}

function SharedHeader({ place, dynamic, onShare, onReport }) {
  const cover = place.coverImage || place.images?.[0];
  return <section className={`overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(16,42,67,0.12)] ${dynamic ? 'ring-1 ring-[#e8dfcb]' : ''}`}>
    <div className="relative h-56 overflow-hidden bg-[#17324d] sm:h-80">{cover && <img src={cover} alt={`${place.name} cover`} className="h-full w-full object-cover" />}<div className="absolute inset-0 bg-gradient-to-t from-[#071d33]/90 via-[#071d33]/15 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f5d98d]">{place.subcategory || place.category?.name || 'Business'}</p><div className="mt-2 flex items-center gap-3">{place.logo && <img src={place.logo} alt={`${place.name} logo`} className="h-12 w-12 rounded-lg bg-white object-contain p-1" />}<h1 className="font-display text-3xl font-semibold sm:text-5xl">{place.name}</h1></div><p className="mt-2 text-sm text-white/75">⌖ {place.address}</p></div></div>
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5"><div className="flex items-center gap-2 text-sm"><span className="text-[#a47b2c]">{'★'.repeat(Math.round(place.rating?.average || 0))}</span><span className="text-ink/55">{place.rating?.average || 0} ({place.rating?.count || 0} reviews)</span>{place.verified && <span className="rounded-sm bg-[#edf4ef] px-2 py-1 text-xs font-semibold text-[#32724b]">Verified</span>}</div><div className="flex gap-2"><FavoriteButton placeId={place._id} /><button type="button" onClick={onShare} className="rounded border border-line px-3 py-2 text-xs text-ink/65">Share</button><button type="button" onClick={onReport} className="rounded border border-line px-3 py-2 text-xs text-ink/65">Report</button></div></div>
  </section>;
}

export default function BusinessPageLayouts({ place, mapsUrl, onShare, onReport, pageType = 'static' }) {
  const dynamic = pageType === 'dynamic';
  const modules = getCategoryModules(moduleKey(place.subcategory || place.category?.slug), pageType);
  return <div className="container-page py-8 sm:py-10"><SharedHeader place={place} dynamic={dynamic} onShare={onShare} onReport={onReport} /><div className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]"><main className="flex flex-col gap-5"><section className="rounded-xl border border-[#cfe6e5] bg-[#f2fbfa] p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47b2c]">About this business</p><h2 className="mt-2 font-display text-3xl font-semibold text-ink">{dynamic ? 'A closer look' : 'Overview'}</h2><p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink/65">{place.description || 'Business information will be added soon.'}</p></section>{place.services?.length > 0 && <section className="rounded-xl border border-[#f0d8b0] bg-[#fffaf2] p-5 sm:p-7"><h2 className="font-display text-2xl font-semibold text-ink">Services</h2><div className="mt-4 flex flex-wrap gap-2">{place.services.map((service) => <span key={service} className="rounded-full bg-white px-3 py-2 text-sm text-ink/70 shadow-sm">{service}</span>)}</div></section>}{dynamic && modules.filter((module) => !['hero', 'about', 'services', 'gallery', 'location', 'hours', 'socialMedia', 'website'].includes(module)).map((module) => <ModuleSection key={module} module={module} place={place} />)}<section className="rounded-xl border border-[#ddd2f2] bg-[#faf8ff] p-5 sm:p-7"><h2 className="font-display text-2xl font-semibold text-ink">Gallery</h2><div className="mt-4"><MediaGallery place={place} /></div></section><section className="rounded-xl border border-line bg-white p-5 sm:p-7"><ReviewsSection placeId={place._id} /></section></main><aside className="flex flex-col gap-5"><section className="rounded-xl border border-[#e8dfcb] bg-white p-5 shadow-sm"><h2 className="font-display text-xl font-semibold text-ink">Contact</h2><div className="mt-4"><ContactLinks place={place} /></div><a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex w-full justify-center rounded-lg bg-[#17324d] px-4 py-3 text-sm font-semibold text-white">Get directions</a></section><section className="overflow-hidden rounded-xl border border-[#cfe6e5] bg-[#f1fbf8] p-2"><iframe title={`Map showing ${place.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(place.address)}&output=embed`} className="h-64 w-full rounded-lg border-0" loading="lazy" /></section></aside></div></div>;
}

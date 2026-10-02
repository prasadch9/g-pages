import React, { useMemo, useState } from 'react';
import ReviewsSection from '../../components/ReviewsSection';
import { getProfileData, ImageFrame, PublicVideoCard, VideoGallery } from '../../components/public/PublicProfileShared';
import { getWhatsAppUrl } from '../healthcare-medical/healthcareUtils';
import { PhoneIcon, WhatsAppIcon } from '../healthcare-medical/HealthcareIcons';

const configs = {
  'marriage-bureau': {
    label: 'Marriage Bureau',
    eyebrow: 'TRUSTED MATRIMONIAL SERVICE',
    nav: ['Home', 'About', 'Services', 'Gallery', 'Success Stories', 'Contact'],
    cta: 'Call Now',
    tagline: 'Find Your Perfect Life Partner',
  },
  'function-hall': { label: 'Function Hall', eyebrow: 'A beautiful setting for your celebration.', nav: ['Home', 'About', 'Venue', 'Packages', 'Gallery', 'Contact'], cta: 'Check Availability' },
  'event-organizer': { label: 'Event Organizer', eyebrow: 'Thoughtful planning for unforgettable moments.', nav: ['Home', 'About', 'Services', 'Packages', 'Portfolio', 'Contact'], cta: 'Request a Quote' },
  'catering-service': { label: 'Catering Services', eyebrow: 'Food, hospitality, and celebrations made memorable.', nav: ['Home', 'About', 'Services', 'Menu', 'Gallery', 'Contact'], cta: 'Enquire Now' },
  'flower-decoration': { label: 'Flower Decoration', eyebrow: 'Floral details that transform every celebration.', nav: ['Home', 'About', 'Services', 'Packages', 'Portfolio', 'Contact'], cta: 'Enquire Now' },
  'fashion-designer': { label: 'Fashion Designer', eyebrow: 'Designs made for your most important moments.', nav: ['Home', 'About', 'Collections', 'Services', 'Gallery', 'Contact'], cta: 'Enquire Now' },
  'beauty-parlour': { label: 'Beauty Parlour', eyebrow: 'Feel confident for your special day.', nav: ['Home', 'About', 'Services', 'Packages', 'Gallery', 'Contact'], cta: 'Book Now' },
  'saloon-spa': { label: 'Saloon & Spa', eyebrow: 'Relax, refresh, and get celebration-ready.', nav: ['Home', 'About', 'Services', 'Packages', 'Gallery', 'Contact'], cta: 'Book Now' },
};

const list = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const toUrl = (value) => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const getValue = (profile, ...keys) => keys.map((key) => profile[key]).find((value) => value !== undefined && value !== null && value !== '');

const defaultImages = [
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1527049979667-7a9d7a0fa6c8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80',
];

const defaultServices = [
  'Profile Registration',
  'Match Suggestions',
  'Premium Membership',
  'Community Search',
  'Horoscope Matching',
  'Family Consultation',
  'Event Meetups',
  'Customer Support',
];

const defaultFeatures = [
  { title: 'Verified Profiles', text: '100% genuine profiles', icon: '✓' },
  { title: 'Secure & Private', text: 'Your data is always safe', icon: '🔒' },
  { title: 'Experienced Team', text: 'Professional matchmakers', icon: '👥' },
  { title: 'Modern Office', text: 'Comfortable meeting area', icon: '🏢' },
  { title: 'Personal Consultation', text: 'One-to-one guidance', icon: '💬' },
  { title: 'Pan India Service', text: 'Available across India', icon: '📍' },
];

const defaultVideoCards = [
  { title: 'Happy Couple Story', duration: '02:15', image: defaultImages[3] },
  { title: 'Client Testimonial', duration: '03:20', image: defaultImages[7] },
  { title: 'Marriage Event Highlights', duration: '01:45', image: defaultImages[1] },
  { title: 'Success Story - 2', duration: '02:38', image: defaultImages[8] },
];

const produceGallery = (profile, place) => {
  const raw = profile.gallery && profile.gallery.length ? profile.gallery : place.images && place.images.length ? place.images : defaultImages;
  return raw.filter(Boolean).slice(0, 10);
};

export default function WeddingBusinessWebsite({ place, weddingType }) {
  const profile = getProfileData(place);
  const config = configs[weddingType] || configs['marriage-bureau'];
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const gallery = useMemo(() => produceGallery(profile, place), [profile, place]);
  const heroImage = profile.coverImage || gallery[0] || defaultImages[0];
  const services = useMemo(() => {
    const fromProfile = list(profile.services || place.services);
    return fromProfile.length ? fromProfile : defaultServices;
  }, [profile, place]);

  const videos = useMemo(() => {
    return (profile.videos && profile.videos.length ? profile.videos : [])
      .map((item) => (typeof item === 'string' ? { url: item } : item))
      .filter((item) => item && (item.url || item.src));
  }, [profile.videos]);

  const social = profile.socialMedia || place.socialLinks || {};
  const primaryPhone = place.phone || profile.phone || '';
  const primaryWhatsApp = place.whatsapp || profile.whatsapp || social.whatsapp || primaryPhone;
  const website = toUrl(place.website || profile.website);
  const callUrl = primaryPhone ? `tel:${String(primaryPhone).replace(/\s+/g, '')}` : '';
  const whatsappUrl = getWhatsAppUrl(primaryWhatsApp);

  const locationText = [
    place.address,
    place.location?.area?.name,
    place.location?.city?.name,
    place.location?.district?.name,
    place.location?.state?.name,
    profile.pincode,
  ].filter(Boolean).join(', ');

  const mapsUrl = place.coordinates?.lat ? `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}` : place.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}` : '';
  const businessDescription = place.description || profile.about || 'A trusted matrimonial service dedicated to helping families discover meaningful matches with care, privacy and confidence.';
  const businessName = place.name || 'Sri Lakshmi Marriage Bureau';
  const logo = profile.logo || place.logo || '';
  const heroTitle = config.tagline || 'Find Your Perfect Life Partner';

  const navLinks = useMemo(() => {
    const base = config.nav.map((item) => ({ label: item, href: `#${item.toLowerCase().replace(/[^a-z]+/g, '-')}` }));
    if (videos.length > 0 && !base.some((link) => link.href === '#videos' || link.href === '#success-stories')) {
      const contactIdx = base.findIndex((l) => l.href === '#contact');
      if (contactIdx !== -1) {
        base.splice(contactIdx, 0, { label: 'Videos', href: '#videos' });
      } else {
        base.push({ label: 'Videos', href: '#videos' });
      }
    }
    return base;
  }, [config.nav, videos.length]);

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#4b1227]">
      <header className="sticky top-0 z-40 border-b border-[#f3dfe5] bg-white/95 shadow-[0_8px_20px_rgba(75,18,39,0.05)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border border-[#f6dfe6] bg-white shadow-sm">
              <ImageFrame src={logo} alt={`${businessName} logo`} className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-bold text-[#4b1227]">{businessName}</p>
              <p className="truncate text-[11px] uppercase tracking-[0.08em] text-[#8a5a6a]">{place.tagline || 'Find Your Perfect Life Partner'}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#4b1227] lg:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="relative pb-1 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#d4145a] after:transition-transform hover:after:scale-x-100">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a href="/" className="inline-flex shrink-0 items-center rounded-full border border-[#f3dfe5] bg-white px-3 py-2 text-xs font-semibold text-[#4b1227]">&larr; Back to G-Pages</a>
            {primaryPhone && (
              <a href={callUrl} className="inline-flex items-center gap-2 rounded-full border border-[#f4d6e1] bg-[#fff7fa] px-4 py-2 text-sm font-semibold text-[#4b1227] shadow-sm transition hover:bg-[#fff0f5]">
                <PhoneIcon />
                <span>Call Now</span>
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0ba046] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-full border border-[#f3dfe5] bg-white px-3 py-2 text-xl text-[#4b1227] lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-[#f5e2e9] bg-white px-4 py-3 lg:hidden">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="block border-b border-[#f9edf2] py-3 text-sm font-semibold text-[#4b1227] last:border-b-0">
                {link.label}
              </a>
            ))}
            <a href="/" onClick={() => setMenuOpen(false)} className="block border-b border-[#f9edf2] py-3 text-sm font-semibold text-[#4b1227]">← Back to G-Pages</a>
            <div className="mt-3 flex gap-2">
              {primaryPhone && <a href={callUrl} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#d4145a] px-3 py-2 text-center text-xs font-bold text-white"><PhoneIcon />Call Now</a>}
              {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0ba046] px-3 py-2 text-center text-xs font-bold text-white"><WhatsAppIcon className="h-4 w-4" />WhatsApp</a>}
            </div>
          </nav>
        )}
      </header>

      <main className="bg-[#fffaf7]">
        <section id="home" className="relative overflow-hidden bg-[#fff5f2]">
          <div className="absolute inset-0 opacity-40" aria-hidden="true">
            <div className="absolute left-[-5%] top-[-8%] h-44 w-44 rounded-full bg-[#f9dfe5] blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-3%] h-48 w-48 rounded-full bg-[#f5d7d2] blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-4 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.08fr_1.02fr] lg:pb-20 lg:pt-14">
            <div className="max-w-[620px]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#d4145a]">{config.eyebrow}</p>
              <h1 className="mt-5 font-display text-5xl leading-[0.95] text-[#4b1227] sm:text-6xl lg:text-[72px]">
                Find Your
                <span className="block">Perfect</span>
                <span className="block">Life Partner</span>
              </h1>
              <p className="mt-5 max-w-[510px] text-lg leading-8 text-[#5a3845]">
                Bringing hearts together for a brighter tomorrow.
                <span className="mt-2 block">Trusted by thousands of happy families.</span>
              </p>

              <div className="mt-7 flex flex-wrap gap-4 text-sm font-medium text-[#5a3845]">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-[#f3dfe5]">✓ Verified Profiles</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-[#f3dfe5]">✓ Personalized Support</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-[#f3dfe5]">✓ 100% Secure</span>
              </div>

              <div className="relative z-10 mt-8 max-w-[760px] rounded-[26px] bg-white p-4 shadow-[0_26px_60px_rgba(75,18,39,0.12)] ring-1 ring-[#f0d4dd] sm:p-5">
                <div className="flex gap-2 pb-3 text-sm font-semibold text-[#7a4360]">
                  <button type="button" className="rounded-full bg-[#f9edf2] px-4 py-2 text-[#4b1227]">Bride</button>
                  <button type="button" className="rounded-full px-4 py-2">Groom</button>
                  <button type="button" className="rounded-full px-4 py-2">By Profile ID</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="block rounded-xl border border-[#f3dfe5] bg-[#fff8fa] p-3 text-sm">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d3051]">Age</span>
                    <select className="w-full bg-transparent text-[#4b1227] outline-none">
                      <option>18 - 30</option>
                    </select>
                  </label>
                  <label className="block rounded-xl border border-[#f3dfe5] bg-[#fff8fa] p-3 text-sm">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d3051]">Religion</span>
                    <select className="w-full bg-transparent text-[#4b1227] outline-none">
                      <option>Any</option>
                    </select>
                  </label>
                  <label className="block rounded-xl border border-[#f3dfe5] bg-[#fff8fa] p-3 text-sm">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d3051]">Community</span>
                    <select className="w-full bg-transparent text-[#4b1227] outline-none">
                      <option>Any</option>
                    </select>
                  </label>
                  <label className="block rounded-xl border border-[#f3dfe5] bg-[#fff8fa] p-3 text-sm">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d3051]">Location</span>
                    <select className="w-full bg-transparent text-[#4b1227] outline-none">
                      <option>Any</option>
                    </select>
                  </label>
                </div>
                <button type="button" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4145a] px-5 py-3 text-base font-bold text-white shadow-lg shadow-[#d4145a]/25 transition hover:brightness-110">
                  🔍 Search Matches
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[34px] border border-[#f0d4dd] bg-[#f6dfe5] shadow-[0_28px_70px_rgba(75,18,39,0.15)]">
                <div className="absolute left-8 top-6 rounded-full bg-[#fff5f7]/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7d3051] shadow-sm">
                  trusted
                </div>
                <ImageFrame src={heroImage} alt={`${businessName} hero`} className="h-[560px] w-full object-cover" eager />
                <div className="absolute inset-0 bg-gradient-to-r from-[#4b1227]/10 via-[#4b1227]/0 to-[#4b1227]/15" />
              </div>

              <div className="absolute bottom-12 right-4 max-w-[220px] -rotate-[8deg] rounded-[20px] bg-[#fff3f7]/90 px-4 py-3 text-center shadow-[0_18px_35px_rgba(75,18,39,0.15)] backdrop-blur-sm">
                <p className="font-display text-3xl font-bold leading-none text-[#4b1227]">Together</p>
                <p className="mt-1 text-xl text-[#7d3051]">is a</p>
                <p className="font-display text-3xl font-bold leading-none text-[#4b1227]">Beautiful</p>
                <p className="mt-1 text-xl text-[#7d3051]">Beginning</p>
                <span className="mt-2 block text-2xl text-[#d4145a]">♥</span>
              </div>

              <div className="absolute bottom-3 right-3 rounded-[20px] bg-white/90 p-4 shadow-[0_18px_35px_rgba(75,18,39,0.15)] backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#fbe8ee] text-xl text-[#d4145a]">👩‍❤️‍👨</div>
                  <div>
                    <p className="text-2xl font-black text-[#4b1227]">5,000+</p>
                    <p className="text-xs font-semibold text-[#7d3051]">Successful Matches</p>
                  </div>
                </div>
                <div className="mt-3 flex -space-x-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-[#f7d9a7] via-[#f3c0c9] to-[#e5c4fc]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr_0.8fr]">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#d4145a]">ABOUT US</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-[#4b1227] sm:text-[50px]">
                Helping You Find
                <span className="block">A Happier Tomorrow</span>
              </h2>
              <p className="mt-5 text-base leading-8 text-[#5a3845]">{businessDescription}</p>
              <button type="button" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#fbeaf0] px-5 py-3 text-sm font-bold text-[#4b1227] transition hover:bg-[#f8dfe9]">
                Know More About Us →
              </button>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[28px] border border-[#f1dfe7] shadow-[0_22px_40px_rgba(75,18,39,0.12)]">
                <ImageFrame src={gallery[1] || heroImage} alt={`${businessName} couple photo`} className="h-[370px] w-full object-cover sm:h-[440px]" />
              </div>
              <div className="absolute -bottom-5 left-6 rounded-[18px] bg-white px-4 py-3 text-center shadow-[0_18px_32px_rgba(75,18,39,0.12)]">
                <div className="text-3xl text-[#d9a441]">🏆</div>
                <div className="mt-1 text-xl font-black text-[#4b1227]">10+</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a4360]">Years of Experience</div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { value: '5000+', label: 'Happy Couples' },
                { value: '100+', label: 'Communities Covered' },
                { value: '10+', label: 'Years of Experience' },
                { value: '100%', label: 'Verified Profiles' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[22px] border border-[#f4dfe7] bg-[#fff7f9] p-4 shadow-sm">
                  <p className="font-display text-3xl font-bold text-[#d4145a]">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-[#6c4253]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="bg-[#fff6f8] px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-[#d4145a]">OUR SERVICES</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-[#4b1227] sm:text-[52px]">Our Matrimonial Services</h2>
              </div>
              <button type="button" className="hidden items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#4b1227] shadow-sm ring-1 ring-[#f0d4dd] md:inline-flex">
                View All Services →
              </button>
            </div>

            <p className="mt-5 max-w-[740px] text-base leading-8 text-[#5a3845]">
              We offer a wide range of matrimonial services to help you find the right match with ease and confidence.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service, index) => {
                const iconMap = ['📝', '💑', '💎', '👥', '🔮', '👨‍👩‍👧‍👦', '🎉', '💬'];
                return (
                  <div key={`${service}-${index}`} className="group rounded-[24px] border border-[#f1dfe7] bg-white p-5 shadow-[0_14px_28px_rgba(75,18,39,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(212,20,90,0.08)]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0f5] text-2xl text-[#d4145a] shadow-sm">
                      {iconMap[index % iconMap.length]}
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-[#4b1227]">{service}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6e4758]">
                      {service === 'Profile Registration' && 'Create your profile with verified details'}
                      {service === 'Match Suggestions' && 'Personalized partner recommendations'}
                      {service === 'Premium Membership' && 'Access to verified & exclusive profiles'}
                      {service === 'Community Search' && 'Search within your preferred community'}
                      {service === 'Horoscope Matching' && 'Match based on horoscope compatibility'}
                      {service === 'Family Consultation' && 'Expert guidance for better matches'}
                      {service === 'Event Meetups' && 'Exclusive meet & greet events'}
                      {service === 'Customer Support' && 'Dedicated support at every step'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="gallery" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#d4145a]">GALLERY</p>
              <h2 className="mt-3 font-display text-4xl leading-tight text-[#4b1227] sm:text-[52px]">Our Happy Couples & Events</h2>
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-[#f0d4dd] bg-white px-5 py-3 text-sm font-bold text-[#4b1227] shadow-sm">
              View All Photos ({gallery.length})
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setLightbox(image)}
                className="group overflow-hidden rounded-[24px] border border-[#f3dfe5] bg-white shadow-[0_16px_30px_rgba(75,18,39,0.05)]"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <ImageFrame src={image} alt={`${businessName} gallery ${index + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="success-stories" className="bg-white px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#d4145a]">VIDEOS</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-[#4b1227] sm:text-[52px]">Success Stories &amp; Special Moments</h2>
              </div>
              {videos.length > 0 && (
                <button type="button" className="inline-flex items-center gap-2 rounded-full border border-[#f0d4dd] bg-white px-5 py-3 text-sm font-bold text-[#4b1227] shadow-sm">
                  View All Videos ({videos.length})
                </button>
              )}
            </div>

            {videos.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {videos.map((video, index) => (
                  <PublicVideoCard key={`${video.url || video.src || index}-${index}`} video={video} />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-[#7a4360]">Videos have not been added yet.</p>
            )}
          </div>
        </section>

        <section className="bg-[#fff7f9] px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#d4145a]">FEATURES</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-[#4b1227] sm:text-[52px]">Features & Infrastructure</h2>
            <h3 className="mt-2 text-xl font-semibold text-[#7a4360]">Why Choose Us</h3>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {defaultFeatures.map((feature, index) => (
                <div key={feature.title} className="rounded-[24px] border border-[#f1dfe7] bg-white p-5 shadow-[0_12px_26px_rgba(75,18,39,0.04)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fbeaf0] text-2xl text-[#d4145a]">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#4b1227]">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#684555]">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#d4145a]">REVIEWS</p>
              <h2 className="mt-3 font-display text-4xl leading-tight text-[#4b1227] sm:text-[52px]">What Our Clients Say</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[26px] border border-[#f2dfe6] bg-[#fff7fa] p-5 shadow-[0_16px_28px_rgba(75,18,39,0.05)]">
              <h3 className="font-display text-3xl text-[#4b1227]">Share Your Experience</h3>
              <div className="mt-6 flex gap-1 text-3xl text-[#d9a441]">
                {[1, 2, 3, 4, 5].map((star) => <span key={star}>★</span>)}
              </div>
              <textarea
                rows={5}
                placeholder="Write your review here..."
                className="mt-5 w-full rounded-2xl border border-[#f0d4dd] bg-white px-4 py-3 text-sm text-[#4b1227] outline-none placeholder:text-[#9b7081]"
              />
              <button type="button" className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#d4145a] px-5 py-3 text-base font-bold text-white shadow-lg shadow-[#d4145a]/20 transition hover:brightness-110">
                Submit Review
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { name: 'Priya Sharma', date: '12 Sep 2024', content: 'Very professional and supportive team. I found the perfect match through Sri Lakshmi Marriage Bureau.' },
                { name: 'Ramesh Kumar', date: '5 Aug 2024', content: 'Great service and genuine profiles. The team guided us throughout the entire process.' },
                { name: 'Anjali Reddy', date: '20 Jul 2024', content: 'Good communication and very helpful support. Thank you for helping us find the right match.' },
              ].map((review) => (
                <div key={review.name} className="rounded-[24px] border border-[#f0d4dd] bg-white p-5 shadow-[0_14px_30px_rgba(75,18,39,0.05)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f0d4dd] to-[#f5e2d7] text-sm font-bold text-[#4b1227]">
                      {review.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="font-bold text-[#4b1227]">{review.name}</p>
                      <p className="text-xs text-[#7a4360]">{review.date}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-[#d9a441]">★★★★★</div>
                  <p className="mt-3 text-sm leading-7 text-[#5a3845]">“{review.content}”</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-[#f0d4dd] bg-white p-4 shadow-[0_14px_30px_rgba(75,18,39,0.04)]">
            <ReviewsSection placeId={place._id} />
          </div>
        </section>
      </main>

      <footer className="bg-[#4b1227] text-[#fef7f7]" data-mobile-footer-layout="columns">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-12 sm:px-8 lg:grid-cols-4" data-marriage-wedding-footer-grid>
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-white/15 bg-white/10">
                <ImageFrame src={logo} alt={`${businessName} logo`} className="object-cover" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">{businessName}</h3>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl font-bold text-white">Our Location</h3>
            <p className="mt-4 text-sm leading-7 text-[#f4dfe7]">{locationText || 'Address will be updated soon.'}</p>
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-[#ffd7e6] hover:text-white">
                View on Map
              </a>
            )}
          </div>

          <div>
            <h3 className="font-display text-2xl font-bold text-white">Contact Details</h3>
            <div className="mt-4 space-y-2 text-sm text-[#f4dfe7]">
              {primaryPhone && <a href={callUrl} className="block">{primaryPhone}</a>}
              {place.email && <a href={`mailto:${place.email}`} className="block">{place.email}</a>}
              <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl font-bold text-white">Quick Links</h3>
            <div className="mt-4 space-y-2 text-sm text-[#f4dfe7]">
              <a href="#contact" className="block">Contact</a>
              <a href="#home" className="block">Back to Home</a>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-3 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-full border border-[#f0d4dd] bg-white/95 p-2 shadow-[0_18px_50px_rgba(75,18,39,0.18)] backdrop-blur md:hidden">
        <div className="flex gap-2">
          {primaryPhone && <a href={callUrl} className="flex-1 rounded-full bg-[#d4145a] px-3 py-2 text-center text-xs font-bold text-white">Call</a>}
          {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#0ba046] px-3 py-2 text-center text-xs font-bold text-white">WhatsApp</a>}
          <a href="#home" className="flex-1 rounded-full bg-[#f9edf2] px-3 py-2 text-center text-xs font-bold text-[#4b1227]">Top</a>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4" onClick={() => setLightbox(null)}>
          <button type="button" onClick={() => setLightbox(null)} className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#4b1227]">Close</button>
          <img src={lightbox} alt={`${businessName} preview`} className="max-h-[90vh] max-w-[92vw] rounded-2xl object-contain" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

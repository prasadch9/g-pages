import React, { useState } from 'react';
import ReviewsSection from '../ReviewsSection';
import FavoriteButton from '../FavoriteButton';
import { PublicVideoCard } from './PublicProfileShared';
import { getHealthcareSubcategory, getLocationText, getWebsiteUrl, getWhatsAppUrl, normalizeList } from '../../utils/healthcare';

const navItems = [
  ['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Departments', '#departments'],
  ['Doctors / Team', '#team'], ['Facilities', '#facilities'], ['Gallery', '#gallery'], ['Contact', '#contact'],
];

const subcategoryContent = {
  hospitals: { eyebrow: 'Hospital care', about: 'About Hospital', services: 'Medical Services', departments: 'Departments', team: 'Doctors / Team', facilities: 'Facilities', gallery: 'Hospital Gallery' },
  'multispeciality hospitals': { eyebrow: 'Multispeciality care', about: 'About Hospital', services: 'Medical Services', departments: 'Departments & Specialities', team: 'Doctors / Team', facilities: 'Facilities', gallery: 'Hospital Gallery' },
  cardiology: { eyebrow: 'Cardiac care', about: 'About Cardiology Centre', services: 'Cardiac Services', departments: 'Cardiology Specialities', team: 'Doctors / Team', facilities: 'Diagnostic Facilities', gallery: 'Cardiology Gallery' },
  ent: { eyebrow: 'ENT care', about: 'About ENT Centre', services: 'ENT Services', departments: 'Treatments', team: 'ENT Specialists', facilities: 'Diagnostic Facilities', gallery: 'ENT Gallery' },
  dental: { eyebrow: 'Dental care', about: 'About Dental Clinic', services: 'Dental Services', departments: 'Treatments', team: 'Dentists', facilities: 'Clinic Facilities', gallery: 'Dental Gallery' },
  'hearing solutions': { eyebrow: 'Hearing care', about: 'About Hearing Centre', services: 'Hearing Services', departments: 'Hearing Tests & Solutions', team: 'Specialists', facilities: 'Facilities', gallery: 'Hearing Gallery' },
  'fitness centres': { eyebrow: 'Wellness & movement', about: 'About Fitness Centre', services: 'Fitness Programs', departments: 'Training Programs', team: 'Trainers', facilities: 'Facilities', gallery: 'Fitness Gallery' },
};

const getValue = (place, ...keys) => {
  const sources = [place?.attributes?.businessProfile?.categorySpecific, place?.attributes?.businessProfile?.common, place?.attributes];
  for (const source of sources) {
    for (const key of keys) {
      if (source?.[key] !== undefined && source[key] !== null && source[key] !== '') return source[key];
    }
  }
  return null;
};

const getPeople = (place) => {
  const people = getValue(place, 'doctors', 'team', 'doctorsTeam', 'members');
  return Array.isArray(people) ? people : [];
};

const getSocialLinks = (place) => place.socialLinks || place.attributes?.businessProfile?.common?.socialLinks || {};

export default function HealthcareWebsite({ place, mapsUrl, onShare, onReport, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const subcategory = getHealthcareSubcategory(place);
  const content = subcategoryContent[subcategory] || subcategoryContent.hospitals;
  const isFitness = subcategory === 'fitness centres';
  const logo = place.logo || '';
  const cover = place.coverImage || '';
  const gallery = (place.images || []).filter(Boolean).slice(0, 10);
  const videos = (place.attributes?.businessProfile?.common?.videos || place.attributes?.videos || []).filter(Boolean);
  const services = normalizeList(place.services || getValue(place, 'services', 'medicalServices', 'programs') || []);
  const departments = normalizeList(getValue(place, 'departments', 'specialities', 'specialties') || []);
  const facilities = normalizeList(place.facilities || getValue(place, 'facilities', 'equipment', 'amenities') || []);
  const treatments = normalizeList(getValue(place, 'treatments', 'procedures', 'trainingPrograms') || []);
  const people = getPeople(place);
  const socialLinks = getSocialLinks(place);
  const website = getWebsiteUrl(place.website);
  const whatsapp = getWhatsAppUrl(socialLinks.whatsapp || place.phone);
  const location = [place.address, getLocationText(place.location?.area), getLocationText(place.location?.city), getLocationText(place.location?.district), getLocationText(place.location?.state), getValue(place, 'pincode')].filter(Boolean).join(', ');
  const emergency = Boolean(getValue(place, 'emergencyAvailable'));
  const emergencyPhone = getValue(place, 'emergencyPhone');
  const appointmentUrl = getValue(place, 'appointmentUrl', 'bookingUrl', 'enquiryUrl');
  const description = place.description || getValue(place, 'about', 'overview') || '';
  const hours = Array.isArray(place.workingHours) ? place.workingHours : [];
  const rating = typeof place.rating?.average === 'number' && place.rating.average > 0 ? place.rating.average : null;
  const sectionTitle = isFitness ? 'Train with purpose' : 'Care built around you';
  const serviceHighlights = services.slice(0, 8);

  const actionLinks = [
    place.phone && ['Call', `tel:${place.phone}`, 'bg-sky-700'],
    whatsapp && ['WhatsApp', whatsapp, 'bg-emerald-600'],
    place.address && ['Directions', mapsUrl, 'bg-slate-800'],
    website && ['Website', website, 'border border-slate-200 bg-white text-slate-700'],
    appointmentUrl && ['Appointment', appointmentUrl, 'bg-teal-600'],
  ].filter(Boolean);

  const currentNavItems = videos.length > 0
    ? [...navItems.slice(0, 7), ['Videos', '#videos'], ...navItems.slice(7)]
    : navItems;

  return <div className={isFitness ? 'min-h-screen bg-[#f2fbf7] text-slate-900' : 'min-h-screen bg-white text-slate-900'}>
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#home" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">{logo ? <img src={logo} alt={`${place.name} logo`} className="h-full w-full object-contain" /> : <span className="text-xl font-semibold text-teal-700">✚</span>}</div>
          <div className="min-w-0"><p className="truncate text-lg font-bold text-slate-900">{place.name}</p><p className="truncate text-xs text-slate-500">{place.attributes?.tagline || content.eyebrow}</p></div>
        </a>
        <nav className="hidden items-center gap-5 xl:flex">{currentNavItems.map(([label, href]) => <a key={label} href={href} className="text-xs font-semibold text-slate-600 hover:text-sky-700">{label}</a>)}</nav>
        <div className="hidden items-center gap-2 md:flex">{place.phone && <a href={`tel:${place.phone}`} className="text-sm font-semibold text-slate-700">{place.phone}</a>}{appointmentUrl && <a href={appointmentUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-bold text-white">Appointment</a>}</div>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:hidden" aria-label="Open navigation">☰</button>
      </div>
      {menuOpen && <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">{currentNavItems.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700">{label}</a>)}</nav>}
    </header>

    <main>
      <section id="home" className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className={`relative overflow-hidden rounded-[28px] ${isFitness ? 'bg-emerald-950' : 'bg-sky-950'}`}>
          {cover && <img src={cover} alt={`${place.name} cover`} className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/15" />
          <div className="relative flex min-h-[440px] items-end px-5 py-8 sm:min-h-[520px] sm:px-10 sm:py-12">
            <div className="max-w-2xl text-white"><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">{content.eyebrow}</p><p className="mt-3 text-sm font-medium text-cyan-100">{place.category?.name || place.subcategory?.name}</p><h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">{place.name}</h1>{description && <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-100 sm:text-lg">{description}</p>}<div className="mt-6 flex flex-wrap gap-3">{actionLinks.slice(0, 3).map(([label, href, style]) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={`rounded-lg px-4 py-3 text-sm font-bold ${style}`}>{label}</a>)}</div>{emergency && <div className="mt-5 inline-flex rounded-lg border border-red-200/40 bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-50">Emergency available{emergencyPhone ? ` · ${emergencyPhone}` : ''}</div>}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{serviceHighlights.map((service) => <div key={service} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm font-bold text-slate-900">{service}</p><p className="mt-1 text-xs text-slate-500">Available information from this business</p></div>)}</div></section>

      <section id="about" className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{content.about}</p><h2 className="mt-2 text-3xl font-bold text-slate-900">{sectionTitle}</h2>{description && <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">{description}</p>}</div><div className="rounded-3xl bg-slate-50 p-6"><p className="text-sm font-bold text-slate-900">At a glance</p><div className="mt-4 space-y-3 text-sm text-slate-600">{rating !== null && <p>Rated {rating.toFixed(1)} / 5</p>}{place.verified && <p>Verified business</p>}{hours.length > 0 && <p>{hours.length} business hours entries available</p>}{getValue(place, 'yearsOfService', 'establishedYear') && <p>{getValue(place, 'yearsOfService', 'establishedYear')} years of service</p>}</div></div></section>

      {services.length > 0 && <section id="services" className="bg-slate-50"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{content.services}</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map((service) => <div key={service} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold text-slate-900">{service}</h3></div>)}</div></div></section>}

      {departments.length > 0 && <section id="departments" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{content.departments}</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{departments.map((item) => <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold shadow-sm">{item}</div>)}</div></section>}

      {treatments.length > 0 && <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold text-slate-900">Treatments & solutions</h2><div className="mt-4 flex flex-wrap gap-2">{treatments.map((item) => <span key={item} className="rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800">{item}</span>)}</div></section>}

      {people.length > 0 && <section id="team" className="bg-slate-50"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{content.team}</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{people.map((person, index) => <div key={`${person.name || 'person'}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{person.photo && <img src={person.photo} alt={person.name || 'Team member'} className="h-48 w-full object-cover" loading="lazy" />}<div className="p-4"><h3 className="font-bold text-slate-900">{person.name}</h3>{person.qualification && <p className="mt-1 text-sm text-slate-600">{person.qualification}</p>}{person.speciality && <p className="text-sm text-slate-600">{person.speciality}</p>}{person.experience && <p className="mt-2 text-xs text-slate-500">{person.experience}</p>}</div></div>)}</div></div></section>}

      {facilities.length > 0 && <section id="facilities" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{content.facilities}</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{facilities.map((facility) => <div key={facility} className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold shadow-sm">{facility}</div>)}</div></section>}

      {gallery.length > 0 && <section id="gallery" className="bg-slate-50"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">{content.gallery}</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{gallery.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setLightboxImage(image)} className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm"><img src={image} alt={`${place.name} gallery ${index + 1}`} loading="lazy" className="h-56 w-full object-cover transition hover:scale-[1.02]" /></button>)}</div></div></section>}

      {videos.length > 0 && (
        <section id="videos" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Video Gallery</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Hospital &amp; Healthcare Videos</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => (
              <PublicVideoCard key={`${video.url || video}-${index}`} video={typeof video === 'string' ? { url: video } : video} />
            ))}
          </div>
        </section>
      )}

      <section id="contact" className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Contact</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Visit or contact {place.name}</h2><div className="mt-5 space-y-3 text-sm text-slate-600">{location && <p>📍 {location}</p>}{place.phone && <p>📞 {place.phone}</p>}{place.email && <p>✉️ {place.email}</p>}{website && <p>🌐 {website}</p>}</div><div className="mt-6 flex flex-wrap gap-2">{actionLinks.map(([label, href, style]) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={`rounded-lg px-4 py-2.5 text-sm font-bold ${style}`}>{label}</a>)}</div></div>{place.address && <iframe title={`${place.name} location`} src={`https://www.google.com/maps?q=${encodeURIComponent(place.address)}&output=embed`} className="h-72 w-full rounded-2xl border border-slate-200" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}</section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"><ReviewsSection placeId={place._id} /></section>
    </main>

    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8"><div><div className="flex items-center gap-3">{logo && <img src={logo} alt={`${place.name} logo`} className="h-11 w-11 rounded-lg object-contain" />}<p className="font-bold text-white">{place.name}</p></div>{description && <p className="mt-4 text-sm leading-relaxed">{description}</p>}</div><div><h3 className="font-bold text-white">Explore</h3><div className="mt-3 space-y-2 text-sm">{navItems.slice(0, 6).map(([label, href]) => <a key={label} href={href} className="block hover:text-white">{label}</a>)}</div></div><div><h3 className="font-bold text-white">Contact</h3><div className="mt-3 space-y-2 text-sm">{place.phone && <a href={`tel:${place.phone}`} className="block hover:text-white">{place.phone}</a>}{place.email && <a href={`mailto:${place.email}`} className="block hover:text-white">{place.email}</a>}{location && <p>{location}</p>}</div></div><div><h3 className="font-bold text-white">Social</h3><div className="mt-3 flex flex-wrap gap-2 text-sm">{Object.entries(socialLinks).filter(([, value]) => value).map(([name, value]) => <a key={name} href={value} target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 px-3 py-2 hover:border-teal-400 hover:text-white">{name}</a>)}</div></div></div><div className="border-t border-slate-800 py-4 text-center text-xs">© {new Date().getFullYear()} {place.name}</div></footer>

    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur lg:hidden"><div className="mx-auto flex max-w-md gap-2">{actionLinks.slice(0, 3).map(([label, href, style]) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={`flex-1 rounded-lg px-2 py-2.5 text-center text-xs font-bold ${style}`}>{label}</a>)}</div></div>

    {lightboxImage && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/90 p-4" role="dialog" aria-modal="true" onClick={() => setLightboxImage(null)}><button type="button" onClick={() => setLightboxImage(null)} className="absolute right-4 top-4 rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-900">Close</button><img src={lightboxImage} alt={`${place.name} enlarged gallery`} className="max-h-[85vh] max-w-full rounded-xl object-contain" onClick={(event) => event.stopPropagation()} /></div>}
    <div className="sr-only"><FavoriteButton placeId={place._id} /><button type="button" onClick={onShare}>Share</button><button type="button" onClick={onReport}>Report</button>{onDelete && <button type="button" onClick={onDelete}>Delete</button>}</div>
  </div>;
}

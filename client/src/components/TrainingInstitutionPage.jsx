import React, { useEffect, useState } from 'react';
import ReviewsSection from './ReviewsSection';
import api from '../services/api';

const courses = [
  ['⌘', 'Web Development', 'HTML, CSS, JavaScript, React, Node.js and more.', '6 Months', '#1266e8'],
  ['▥', 'Data Science & Analytics', 'Python, Machine Learning, Data Visualization.', '6 Months', '#22b879'],
  ['⚑', 'Digital Marketing', 'SEO, Social Media, Google Ads, Content Marketing.', '4 Months', '#ec1670'],
  ['▤', 'Tally & Accounting', 'Tally ERP 9, GST, MS Office.', '3 Months', '#f5ad08'],
  ['▱', 'Spoken English', 'Improve your communication and confidence.', '2 Months', '#7629d8'],
  ['▣', 'Graphic Designing', 'Photoshop, Illustrator, CorelDRAW and more.', '4 Months', '#13b8c8'],
];

const galleryDefaults = [
  ['Computer Lab', 'photo-1519389950473-47ba0277781c'],
  ['Classroom Sessions', 'photo-1523050854058-8df90110c9f1'],
  ['Hands-on Practice', 'photo-1521737711867-e3b97375f902'],
  ['Student Achievements', 'photo-1523580494863-6f3031224c94'],
  ['Our Campus', 'photo-1562774053-701939374585'],
];

const imageUrl = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
const safeUrl = (value) => value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : '';

function SectionTitle({ eyebrow, title, action }) {
  return <div className="flex items-center justify-between gap-3"><div><p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-blue-700">{eyebrow}</p><h2 className="mt-1 text-xl font-extrabold text-[#123764] sm:text-2xl">{title}</h2></div>{action && <a href={action.href} className="shrink-0 text-[9px] font-bold text-blue-700">{action.label} →</a>}</div>;
}

function CourseEnquiryForm({ place, course, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.post('/enquiries', { place: place._id, ...form, message: `Course enquiry for ${course.name}. ${form.message}` });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Unable to send your enquiry. Please try again.');
    }
  };
  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#041b3a]/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Enroll in ${course.name}`} onClick={onClose}><form onSubmit={submit} onClick={(event) => event.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="relative bg-gradient-to-r from-[#06366b] via-blue-800 to-cyan-600 px-7 py-6 text-white"><button type="button" onClick={onClose} className="absolute right-4 top-3 text-3xl" aria-label="Close form">×</button><p className="text-[10px] font-bold uppercase tracking-[.2em] text-sky-100">Start building your future</p><h2 className="mt-2 text-2xl font-black">Program Enquiry</h2><p className="mt-1 text-sm text-white/85">{course.name} · {place.name}</p></div><div className="p-6 sm:p-8">{status === 'sent' ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-800">✓ Your enquiry was sent. {place.name} will contact you soon.</div> : <><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">Full name<input required maxLength={100} placeholder="Enter your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm"/></label><label className="text-xs font-bold">Email address<input required type="email" maxLength={150} placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm"/></label><label className="text-xs font-bold sm:col-span-2">Phone number<input type="tel" placeholder="Your contact number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm"/></label><label className="text-xs font-bold sm:col-span-2">Your message<textarea required maxLength={850} rows={3} placeholder={`I am interested in ${course.name}...`} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm"/></label></div>{error && <p role="alert" className="mt-3 text-xs text-red-700">{error}</p>}<button type="submit" disabled={status === 'sending'} className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-extrabold text-white disabled:opacity-60">{status === 'sending' ? 'Sending…' : 'Send Course Enquiry →'}</button><p className="mt-3 text-center text-[10px] text-slate-500">Your details will go directly to this institution’s business account.</p></>}</div></form></div>;
}

function CourseDetailPage({ place, course, image, phone, onBack }) {
  const [enrollOpen, setEnrollOpen] = useState(false);
  return <div className="min-h-screen bg-[#f4f9ff] text-[#12345d]"><header className="flex h-16 items-center border-b border-blue-100 bg-white px-5 sm:px-8"><button type="button" onClick={onBack} className="rounded-full border border-blue-200 px-4 py-2 text-xs font-bold text-blue-800">← All Training Programs</button><strong className="ml-4 truncate">{place.name}</strong></header><main className="mx-auto max-w-6xl px-4 py-8 sm:px-8"><div className="grid overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2"><img src={course.image || image} alt={course.name} className="h-64 w-full object-cover sm:h-96"/><div className="flex flex-col justify-center p-6 sm:p-10"><p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Training Program</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{course.name}</h1><p className="mt-4 text-sm leading-relaxed text-slate-600">{course.description || 'Build practical, career-ready skills through guided projects and expert-led training.'}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-blue-50 p-3"><small className="block text-[9px] font-bold uppercase text-blue-700">Duration</small><span className="mt-1 block text-xs font-semibold">{course.duration || 'Flexible batches'}</span></div><div className="rounded-lg bg-blue-50 p-3"><small className="block text-[9px] font-bold uppercase text-blue-700">Level</small><span className="mt-1 block text-xs font-semibold">{course.level || 'Beginner to Advanced'}</span></div>{course.fee && <div className="rounded-lg bg-blue-50 p-3"><small className="block text-[9px] font-bold uppercase text-blue-700">Course fee</small><span className="mt-1 block text-xs font-semibold">{course.fee}</span></div>}</div><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setEnrollOpen(true)} className="rounded-full bg-orange-500 px-6 py-3 text-xs font-extrabold text-white">Enroll / Enquire →</button>{phone && <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="rounded-full border border-blue-300 px-6 py-3 text-xs font-bold text-blue-800">☎ Call {phone}</a>}</div></div></div></main>{enrollOpen && <CourseEnquiryForm place={place} course={course} onClose={() => setEnrollOpen(false)}/>}</div>;
}

export default function TrainingInstitutionPage({ place, onReport }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const attrs = place.attributes || {};
  const profile = attrs.trainingInstitution || attrs.trainingInstitute || attrs.academy || attrs;
  const coursesList = profile.courses || profile.programs || profile.trainingPrograms || [];
  const trainingPhotos = (profile.galleryPhotos || []).filter((item) => item?.url);
  const trainingVideos = (profile.galleryVideos || []).filter((item) => item?.url);
  const gallery = [...trainingPhotos.map((item) => item.url), ...(place.images || [])].filter(Boolean);
  const galleryItems = trainingPhotos.length
    ? trainingPhotos.slice(0, 5).map((item, i) => [item.url, item.title || `Training photo ${i + 1}`])
    : gallery.length ? gallery.slice(0, 5).map((src, i) => [src, profile.galleryTitles?.[i] || ['Computer Lab', 'Classroom Sessions', 'Hands-on Practice', 'Student Achievements', 'Our Campus'][i]]) : galleryDefaults.map(([title, id]) => [imageUrl(id), title]);
  const heroImage = place.coverImage || gallery[0] || imageUrl('photo-1523240795612-9a054b0db644');
  const aboutImage = profile.aboutImage || gallery[1] || gallery[0] || imageUrl('photo-1524178232363-1fb2b075b655');
  const highlights = profile.highlights || ['Expert Trainers', 'Hands-on Learning', '100% Placement Support'];
  const facilities = profile.facilities || place.facilities || ['Modern Infrastructure', 'Hands-on Training', 'Experienced Trainers', 'Flexible Batches'];
  const testimonials = profile.testimonials || [];
  const impact = profile.impact || [['🎓', profile.studentsTrained || '500+', 'Students Trained'], ['▣', profile.placements || '300+', 'Placements'], ['★', profile.satisfaction || '4.8/5', 'Student Satisfaction'], ['♟', profile.partners || '50+', 'Industry Partners']];
  const phone = place.phone ? `tel:${place.phone}` : '#contact';
  const callNumber = place.phone || profile.phone || '';
  const social = { ...profile.socialLinks, ...(place.socialLinks || {}) };
  const socialItems = [
    ['WhatsApp', social.whatsapp, '◉'],
    ['Instagram', social.instagram, '◎'],
    ['Facebook', social.facebook, 'f'],
    ['LinkedIn', social.linkedin, 'in'],
  ].filter(([, href]) => href);

  useEffect(() => {
    const openCourse = (event) => {
      const link = event.target.closest('a[aria-label^="Enquire about "]');
      if (!link) return;
      event.preventDefault();
      const courseName = link.getAttribute('aria-label').replace('Enquire about ', '');
      const savedCourse = coursesList.find((course) => (course.name || course.title) === courseName);
      const fallback = courses.find((course) => course[1] === courseName);
      setSelectedCourse(savedCourse
        ? { ...savedCourse, name: savedCourse.name || savedCourse.title, description: savedCourse.description || savedCourse.subjects }
        : { name: courseName, description: fallback?.[2] || '', duration: fallback?.[3] || '', image: gallery[0] });
    };
    document.addEventListener('click', openCourse);
    return () => document.removeEventListener('click', openCourse);
  }, [coursesList, gallery]);

  if (selectedCourse) return <CourseDetailPage place={place} course={selectedCourse} image={gallery[0] || imageUrl('photo-1524178232363-1fb2b075b655')} phone={callNumber} onBack={() => setSelectedCourse(null)} />;
  const socialHref = (name, value) => name === 'WhatsApp'
    ? (/^https?:\/\//i.test(value) ? value : `https://wa.me/${String(value).replace(/\D/g, '')}`)
    : safeUrl(value);

  return <div className="training-page min-h-screen bg-[#f7fbff] text-[#12345d]">
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur"><div className="mx-auto flex h-[62px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8"><a href="#top" className="flex min-w-0 items-center gap-2.5">{place.logo ? <img src={place.logo} alt="" className="h-10 w-10 object-contain" /> : <span className="text-3xl text-blue-700">🎓</span>}<span className="min-w-0"><strong className="block truncate text-sm sm:text-base">{place.name}</strong><small className="block text-[9px] tracking-wider text-slate-500">Learn · Practice · Grow</small></span></a><nav className="hidden items-center gap-7 text-[10px] font-bold lg:flex"><a href="#top" className="text-blue-700">Home</a><a href="#courses">Courses</a><a href="#about">About Us</a><a href="#facilities">Facilities</a><a href="#gallery">Gallery</a><a href="#placement">Placement</a><a href="#reviews">Reviews</a><a href={`#review-comment-${place._id}`}>Comments</a><a href="#contact">Contact</a></nav><div className="flex shrink-0 items-center gap-3"><a href={phone} className="hidden text-[10px] font-bold sm:block">☎ {place.phone || 'Contact us'}</a><a href="#contact" className="rounded-full bg-blue-700 px-4 py-2 text-[10px] font-bold text-white">Enrol Now →</a></div></div></header>

    <section id="top" className="relative isolate min-h-[285px] overflow-hidden bg-[#06366b] sm:min-h-[350px]"><img src={heroImage} alt={`${place.name} training`} className="absolute inset-0 -z-20 h-full w-full object-cover"/><div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,35,75,.98)_0%,rgba(3,43,83,.88)_42%,rgba(3,43,83,.18)_100%)]"/><div className="mx-auto flex min-h-[285px] max-w-[1440px] items-center px-5 py-10 sm:min-h-[350px] sm:px-8"><div className="max-w-xl text-white"><span className="rounded-full bg-teal-600/90 px-4 py-1.5 text-[10px] font-bold">✦ Your Future Starts Here</span><h1 className="mt-4 text-4xl font-black leading-[1.04] sm:text-6xl">Build Your Skills<br/><span className="text-[#ffc313]">For a Better Tomorrow</span></h1><p className="mt-3 max-w-lg text-xs leading-relaxed text-white/85 sm:text-sm">{place.description || 'Join our industry-focused training programs and gain practical skills with expert guidance, hands-on learning and placement support.'}</p><div className="mt-5 flex flex-wrap gap-3"><a href="#courses" className="rounded-lg bg-[#ffc313] px-5 py-3 text-[10px] font-extrabold text-[#12345d]">Explore Courses →</a><a href="#contact" className="rounded-lg border border-white/50 px-5 py-3 text-[10px] font-bold text-white">Contact Us</a></div><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-semibold text-white/90">{highlights.slice(0, 3).map((item, i) => <span key={i}>✦　{typeof item === 'string' ? item : item.name}</span>)}</div></div></div></section>

    <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-8"><div className="grid gap-5 xl:grid-cols-[1.65fr_1fr_.72fr]">
      <section id="courses" className="border-b border-blue-100 pb-5 xl:border-b-0 xl:border-r xl:pr-5"><SectionTitle eyebrow="Our Courses" title="Popular Training Programs" action={{href:'#courses-grid',label:'View All Courses →'}}/><p className="mt-2 max-w-lg text-xs text-slate-600">Choose from a wide range of industry-relevant courses designed to build your skills and boost your career.</p><div id="courses-grid" className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">{(coursesList.length ? coursesList.slice(0, 6).map((course, i) => [course.icon || ['⌘','▥','⚑','▤','▱','▣'][i % 6], course.name || course.title || `Training Program ${i + 1}`, course.description || course.subjects || '', course.duration || 'Enquire for duration', ['#1266e8','#22b879','#ec1670','#f5ad08','#7629d8','#13b8c8'][i % 6]]) : courses).map(([icon,name,description,duration,color], i) => <article key={`${name}-${i}`} className="flex min-h-[88px] gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-[0_3px_12px_#12345d0d]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg text-white shadow" style={{backgroundColor:color}}>{icon}</span><div className="min-w-0 flex-1"><h3 className="text-[11px] font-extrabold">{name}</h3><p className="mt-1 line-clamp-2 text-[9px] leading-snug text-slate-500">{description || 'Practical training guided by experienced instructors.'}</p><span className="mt-2 inline-block rounded-full bg-blue-50 px-2 py-1 text-[8px] font-bold text-blue-700">Duration: {duration}</span></div><a href="#contact" aria-label={`Enquire about ${name}`} className="mt-auto text-sm text-blue-600">➜</a></article>)}</div></section>

      <section id="about" className="border-b border-blue-100 pb-5 xl:border-b-0 xl:border-r xl:px-1 xl:pr-5"><SectionTitle eyebrow="About Us" title={`Welcome to ${place.name}`}/><p className="mt-2 text-xs leading-relaxed text-slate-700">{profile.about || place.description || `${place.name} is a training institution dedicated to empowering learners with practical skills, experienced trainers and career-focused programs.`}</p><div className="mt-4 grid grid-cols-2 gap-2 text-[9px] font-bold sm:grid-cols-4">{['Experienced Trainers','Modern Infrastructure','Hands-on Training','Placement Support'].map((item,i)=><span key={item} className="rounded bg-blue-50 p-2 text-center">{['♟','▣','✦','▤'][i]}<br/>{item}</span>)}</div><div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3"><img src={aboutImage} alt="Training session" className="h-28 w-full rounded-lg object-cover sm:h-32"/><p className="max-w-24 text-center font-serif text-base font-bold italic text-blue-800">Learn Today<br/>Lead Tomorrow</p></div></section>

      <aside className="rounded-xl bg-[#eaf5ff] p-4 sm:p-5"><h2 className="text-xl font-extrabold">Our Impact</h2><p className="text-xs">Numbers That Speak</p><div className="mt-3 divide-y divide-blue-200">{impact.slice(0,4).map(([icon,value,label],i)=><div key={i} className="flex items-center gap-4 py-2"><span className="w-9 text-center text-xl text-blue-700">{icon}</span><span><strong className="block text-lg leading-tight">{value}</strong><small className="text-[9px] text-slate-600">{label}</small></span></div>)}</div><div className="mt-2 rounded-lg bg-[#073971] p-3 text-xs font-bold text-white">◎　Your Skills<br/>　　 Our Priority</div></aside>
    </div>

    <section id="facilities" className="-mx-4 mt-5 bg-[#eaf6ff] px-4 py-4 sm:-mx-8 sm:px-8"><div className="mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-[.95fr_3fr]"><div><SectionTitle eyebrow="Why Choose Us" title="Your Success, Our Commitment"/><p className="mt-2 text-[10px] leading-relaxed text-slate-600">We are committed to providing the best learning experience through flexible batches, affordable fees and complete career support.</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{(facilities.length ? facilities.slice(0,5) : ['Job Oriented Training','Flexible Batches','Certification','Placement Support','Lifetime Support']).map((item,i)=><div key={i} className="rounded-lg p-2"><span className="text-xl text-blue-700">{['◎','▦','▣','♟','☏'][i]}</span><h3 className="mt-1 text-[10px] font-bold">{typeof item === 'string' ? item : item.name}</h3><p className="mt-1 text-[9px] text-slate-500">{typeof item === 'object' ? item.description : ['Skills that match industry demands.','Weekday and weekend batches available.','Get recognized with industry certificates.','Dedicated placement cell until you get placed.','Access to resources and guidance after course completion.'][i]}</p></div>)}</div></div></section>

    <div className="mt-5 grid gap-5 lg:grid-cols-[2fr_1fr]"><section id="gallery"><SectionTitle eyebrow="Our Gallery" title="A glimpse of our training environment"/><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{galleryItems.map(([src,title],i)=><figure key={`${src}-${i}`}><img src={src} alt={title} className="h-20 w-full rounded-lg object-cover shadow-sm sm:h-24"/><figcaption className="mt-1 text-[9px] font-bold">▣　{title}</figcaption></figure>)}</div></section><section className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm"><SectionTitle eyebrow="What Our Students Say" title="Real Stories, Real Success"/><div className="mt-3 space-y-2">{(testimonials.length ? testimonials.slice(0,2) : [{name:'Our Students',quote:'Supportive trainers and practical sessions helped me build confidence and prepare for my next career step.'}]).map((item,i)=><blockquote key={i} className="rounded-lg bg-blue-50 p-3 text-[10px] leading-relaxed text-slate-600">“{item.quote || item.message || item.review}”<footer className="mt-2 font-bold text-[#12345d]">— {item.name || item.student || 'Student'}</footer></blockquote>)}</div></section></div>

    {(profile.videoUrl || trainingVideos.length > 0) && <section className="mt-5 rounded-xl border border-blue-100 bg-white p-4"><SectionTitle eyebrow="Training videos" title="See our training in action"/><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[...(profile.videoUrl ? [{ title: 'Training introduction', url: profile.videoUrl }] : []), ...trainingVideos].map((item, index) => <figure key={`training-video-${index}`} className="overflow-hidden rounded-lg border border-blue-100 bg-slate-950">{/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(item.url) ? <video src={safeUrl(item.url)} controls className="h-40 w-full object-contain"/> : <a href={safeUrl(item.url)} target="_blank" rel="noreferrer" className="grid h-40 place-items-center text-sm font-bold text-white">▶ Open {item.title || 'training video'}</a>}{item.title && <figcaption className="bg-white p-2 text-xs font-semibold">{item.title}</figcaption>}</figure>)}</div></section>}
    <section id="placement" className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#073971] p-4 text-white"><div><p className="text-[10px] text-white/70">Ready to build your future?</p><h2 className="text-lg font-extrabold">Get started with {place.name} today!</h2></div><div className="flex flex-wrap gap-4 text-[9px] font-bold"><span>✦ Expert Guidance</span><span>♟ Hands-on Training</span><span>▣ Placement Support</span></div><a href="#contact" className="rounded-full bg-[#ffc313] px-5 py-2.5 text-[10px] font-extrabold text-[#12345d]">Enrol Now →</a></section>
    <section id="contact" className="mt-5 grid gap-4 rounded-xl bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr] sm:items-center"><div><SectionTitle eyebrow="Get in touch" title="Start learning today"/><p className="mt-2 text-xs text-slate-600">{place.address}</p><div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">{place.phone && <a href={phone} className="rounded-full bg-blue-700 px-3 py-2 text-white">☎ Call {place.phone}</a>}{place.email && <a href={`mailto:${place.email}`} className="rounded-full bg-blue-50 px-3 py-2 text-blue-800">✉ Email</a>}{place.website && <a href={safeUrl(place.website)} target="_blank" rel="noreferrer" className="rounded-full bg-blue-50 px-3 py-2 text-blue-800">Visit website ↗</a>}{socialItems.map(([name, value, icon]) => <a key={name} href={socialHref(name, value)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-blue-50 px-3 py-2 text-blue-800">{icon} {name}</a>)}</div>{onReport && <button type="button" onClick={onReport} className="mt-3 text-[10px] text-blue-700">Report incorrect information</button>}</div><iframe title={`Map showing ${place.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(place.address || place.name)}&output=embed`} className="h-40 w-full rounded-lg border-0" loading="lazy"/></section>
    <section id="reviews" className="mt-5 rounded-xl bg-white p-5"><ReviewsSection placeId={place._id}/></section></main>
    <footer className="mt-5 bg-[#061b35] px-5 py-5 text-white"><div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2">{place.logo && <img src={place.logo} alt="" className="h-9 w-9 object-contain"/>}<strong>{place.name}</strong></div><nav className="flex gap-4 text-[9px] text-white/75"><a href="#courses">Courses</a><a href="#about">About Us</a><a href="#gallery">Gallery</a><a href="#contact">Contact</a></nav><small className="text-[9px] text-white/55">© {new Date().getFullYear()} {place.name}. All rights reserved.</small></div></footer>
  </div>;
}

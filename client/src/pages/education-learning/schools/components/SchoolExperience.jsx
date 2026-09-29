import React, { useState } from 'react';
import ReviewsSection from '../../../../components/ReviewsSection';
import api from '../../../../services/api';

const heroFallback = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=2400&q=90';
const studentsFallback = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=88';
const activityTypes = [
  ['🏃', 'Sports'], ['🎨', 'Arts'], ['🎵', 'Music'], ['💃', 'Dance'],
  ['🔬', 'Science'], ['🤖', 'Robotics'], ['🗣️', 'Debate'], ['📚', 'Literary Club'],
];

function textOf(item) {
  return typeof item === 'string' ? item : item?.title || item?.name || '';
}

function imageSource(item) {
  return typeof item === 'string' ? item : item?.image || item?.photo || item?.url || item?.src || '';
}

function videoEmbedUrl(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtu.be')) return `https://www.youtube-nocookie.com/embed/${parsedUrl.pathname.slice(1)}?autoplay=1`;
    if (parsedUrl.hostname.includes('youtube.com')) {
      const videoId = parsedUrl.searchParams.get('v') || parsedUrl.pathname.split('/').pop();
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    if (parsedUrl.hostname.includes('vimeo.com')) return `https://player.vimeo.com/video/${parsedUrl.pathname.split('/').pop()}?autoplay=1`;
    return url;
  } catch {
    return url;
  }
}

function SchoolExperience({ place, mapsUrl, socialLinks = {}, academics = {}, onShare, onReport, onDelete }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageCollection, setSelectedImageCollection] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '', class: '', message: '' });
  const [enquiryStatus, setEnquiryStatus] = useState('idle');
  const [enquiryError, setEnquiryError] = useState('');
  const schoolName = place.name || 'School';
  const principal = typeof academics.principal === 'object' ? academics.principal : {};
  const faculty = Array.isArray(academics.faculty) ? academics.faculty : [];
  const facilities = academics.schoolFacilities?.length ? academics.schoolFacilities : (place.facilities || []);
  const facilityImages = academics.facilityImages || [];
  const facultyImages = academics.facultyImages || [];
  const eventImages = academics.eventImages || [];
  const events = academics.schoolEvents?.length ? academics.schoolEvents : (academics.events || []);
  const newsNotices = (Array.isArray(academics.newsNotices)
    ? academics.newsNotices
    : String(academics.newsNotices || '').split(/[\n,]/))
    .map((notice) => typeof notice === 'string' ? notice.trim() : notice?.title || notice?.name || '')
    .filter(Boolean);
  const facilityItems = facilities.length ? facilities : ['Quality Education', 'Experienced Teachers', 'Modern Laboratories', 'Smart Classrooms', 'Sports & Fitness', 'Student Safety'];
  const eventItems = events.length ? events : ['Annual Day', 'Science Exhibition', 'Sports Day'];
  const noticeItems = newsNotices.length ? newsNotices : ['Admissions open for 2026 - 27', 'Examination Schedule', 'Holiday Notice', 'Parent Meeting'];
  const achievements = academics.achievements || [];
  const gallery = [
    ...(academics.galleryItems || []).map((item) => typeof item === 'string' ? { image: item } : item),
    ...(place.images || []).map((image) => ({ image })),
  ].filter((item) => item?.image || item?.photo || item?.url);
  const cover = place.coverImage || gallery[0]?.image || gallery[0]?.photo || heroFallback;
  const galleryItems = gallery.length ? gallery : [{ image: cover, caption: 'Our Campus' }];
  const imageViewerItems = [...new Map([
    { src: cover, alt: `${schoolName} campus` },
    { src: imageSource(gallery[1]) || studentsFallback, alt: 'Students learning in class' },
    ...gallery.map((item, index) => ({ src: imageSource(item), alt: item.caption || item.title || `${schoolName} campus ${index + 1}` })),
    ...(academics.principalImage ? [{ src: academics.principalImage, alt: principal.name || 'School principal' }] : []),
    ...faculty.map((person, index) => {
      const member = typeof person === 'string' ? { name: person } : person;
      return { src: member.photo || member.image || imageSource(facultyImages[index]), alt: member.name || 'School faculty' };
    }),
    ...eventImages.map((image, index) => ({ src: imageSource(image), alt: `${textOf(events[index]) || 'School event'} photo` })),
    ...events.map((event, index) => ({ src: typeof event === 'object' ? imageSource(event) : '', alt: `${textOf(event) || 'School event'} photo` })),
  ].filter((item) => item.src).map((item) => [item.src, item])).values()];
  const galleryViewerItems = [...new Map(galleryItems.map((item) => ({ src: imageSource(item), alt: item.caption || item.title || `${schoolName} campus` })).filter((item) => item.src).map((item) => [item.src, item])).values()];
  const activeImageItems = selectedImageCollection || imageViewerItems;
  const activeImageIndex = activeImageItems.findIndex((item) => item.src === selectedImage);
  const openImageViewer = (image, items = imageViewerItems) => {
    setSelectedImageCollection(items);
    setSelectedImage(image);
  };
  const classes = String(academics.classes || '').split(',').map((value) => value.trim()).filter(Boolean);
  const website = place.website ? (place.website.startsWith('http') ? place.website : `https://${place.website}`) : '';
  const whatsappValue = socialLinks.whatsapp || place.phone;
  const whatsapp = whatsappValue
    ? (whatsappValue.startsWith('http') ? whatsappValue : `https://wa.me/${whatsappValue.replace(/\D/g, '')}`)
    : '';
  const facebookUrl = socialLinks.facebook || `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
  const mapQuery = place.coordinates?.lat && place.coordinates?.lng
    ? `${place.coordinates.lat},${place.coordinates.lng}`
    : place.address || schoolName;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const googleMapsUrl = mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const whyChoose = String(academics.whyChooseUs || '').split(/[\n,]/).map((value) => value.trim()).filter(Boolean);
  const vision = academics.vision;
  const mission = academics.mission;
  const schoolHistory = academics.schoolHistory?.trim()
    || 'The school history will be shared here soon.';
  const studentActivities = (Array.isArray(academics.studentActivities)
    ? academics.studentActivities
    : String(academics.studentActivities || academics.academicActivities || '').split(/[\n,]/))
    .map((activity) => typeof activity === 'string' ? activity.trim() : activity?.name || activity?.title || '')
    .filter(Boolean);
  const displayedActivities = studentActivities.length
    ? studentActivities
    : activityTypes.map(([, label]) => label);
  const videos = academics.schoolVideos || [];
  const videoUrl = videos[0]?.url || (Array.isArray(place.video) ? place.video[0] : place.video);
  const selectedImageIndex = imageViewerItems.findIndex((item) => item.src === selectedImage);
  const moveImage = (direction) => {
    if (!imageViewerItems.length) return;
    const currentIndex = Math.max(activeImageIndex, 0);
    const nextIndex = (currentIndex + direction + activeImageItems.length) % activeImageItems.length;
    setSelectedImage(activeImageItems[nextIndex].src);
  };
  const openVideoViewer = () => {
    if (videoUrl) setSelectedVideo(videoUrl);
    else if (imageViewerItems[0]) openImageViewer(imageViewerItems[0].src);
  };
  const scrollToAdmissions = (event) => {
    event.preventDefault();
    document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const scrollToAdmissionsForm = (event) => {
    event.preventDefault();
    document.getElementById('admissions-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submitEnquiry = async (event) => {
    event.preventDefault();
    setEnquiryStatus('sending');
    setEnquiryError('');
    try {
      await api.post('/enquiries', {
        place: place._id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        message: `Admission enquiry${enquiry.class ? ` for ${enquiry.class}` : ''}: ${enquiry.message}`,
      });
      setEnquiryStatus('sent');
      setEnquiry((current) => ({ ...current, message: '' }));
    } catch (error) {
      setEnquiryStatus('error');
      setEnquiryError(error.message || 'We could not send your enquiry. Please try again.');
    }
  };

  return <div className="school-experience min-h-screen overflow-hidden bg-[#eef5f3] text-[#17324d]" onClick={(event) => {
    if (!(event.target instanceof Element)) return;
    const image = event.target.closest('main img');
    if (!image || image.closest('a, [data-video-trigger]')) return;
    openImageViewer(image.currentSrc || image.src);
  }}>
    <div className="school-utility bg-[#0e2d45] text-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-2 text-[11px] sm:px-6">
        <p className="truncate"><span className="text-[#ffc84a]">Admissions open for {academics.admissionYear || '2026 - 27'}</span><span className="mx-3 text-white/35">|</span><span className="text-white/80">Build a brighter future with us</span></p>
        <div className="hidden shrink-0 items-center gap-5 sm:flex">{place.phone && <a href={`tel:${place.phone}`} className="font-medium text-white/90">☎ {place.phone}</a>}{place.address && <span className="max-w-60 truncate text-white/80">⌖ {place.address}</span>}<a href="#admissions-form" onClick={scrollToAdmissionsForm} className="bg-[#ffc84a] px-4 py-1.5 font-bold text-[#092d4b]">Apply Now</a></div>
      </div>
    </div>

    <header className="school-header sticky top-0 z-40 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-4 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-3 py-3">
          {place.logo ? <img src={place.logo} alt={`${schoolName} logo`} className="h-11 w-11 object-contain" /> : <span className="school-mark" aria-hidden="true">📖</span>}
          <span className="min-w-0"><strong className="block truncate font-display text-base font-bold text-[#0b3455] sm:text-lg">{schoolName}</strong><small className="block truncate text-[10px] font-semibold uppercase text-[#58736f]">{academics.tagline || 'Learn · Grow · Achieve'}</small></span>
        </a>
        <nav aria-label="School navigation" className="school-navigation hidden items-center gap-5 whitespace-nowrap text-[11px] font-semibold text-[#31516b] lg:flex">
          {[['Home', '#top'], ['About Us', '#about'], ['Academics', '#academics'], ['Facilities', '#facilities'], ['Admissions', '#admissions'], ['Activities', '#activities'], ['Gallery', '#gallery'], ['Achievements', '#achievements'], ['Faculty', '#faculty'], ['Events', '#events'], ['Notices', '#events'], ['Contact', '#contact']].map(([label, href]) => <a key={label} href={href} onClick={label === 'Admissions' ? scrollToAdmissions : undefined} className="py-5">{label}</a>)}
        </nav>
        <a href="#contact" className="school-contact-link hidden shrink-0 px-4 py-2 text-[11px] font-bold sm:inline-flex">Visit us <span aria-hidden="true">↗</span></a>
      </div>
    </header>

    <main id="top" className="w-full bg-[#edf4f4] px-0 py-0">
      <section className="school-reference-hero relative isolate overflow-hidden bg-[#0c2f49] text-white">
        <img src={cover} alt={`${schoolName} campus`} className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%),linear-gradient(90deg,rgba(8,36,54,.85),rgba(10,52,72,.72))]" />
        <div className="relative flex min-h-[350px] items-center px-5 py-7 sm:px-8 lg:px-10">
          <div className="relative z-10 max-w-[630px] pt-2">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#d9eaf5]">Welcome to {schoolName}</p>
            <h1 className="font-display text-5xl font-black leading-[0.86] tracking-[-0.08em] text-white sm:text-[4.2rem]">Building Minds.<br />Shaping <span className="text-[#f6cf59]">Futures.</span></h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/80">{academics.aboutDescription || place.description || 'A place where knowledge meets character, creativity and excellence.'}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#about" className="school-primary-action px-5 py-3 text-sm font-bold">Explore Our School <span aria-hidden="true">→</span></a>
              <a href="#admissions" onClick={scrollToAdmissions} className="school-secondary-action px-5 py-3 text-sm font-semibold">Admissions {academics.admissionYear || '2026 - 27'}</a>
            </div>
          </div>

        </div>

        <div className="school-reference-stats mx-auto grid max-w-[1280px] grid-cols-2 gap-0 px-4 pb-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:pb-0">
          {[
            ['◉', academics.board || 'CBSE / State Board', 'Curriculum'],
            ['▦', academics.classes || 'Classes 1 - 12', 'Pre Nursery to XII'],
            ['♙', `${academics.totalTeachers || 'Experienced'}`, 'Faculty'],
            ['▣', 'Transport', 'Facility'],
            ['⬟', 'Safe & Secure', 'Campus'],
            ['▰', 'Smart', 'Classrooms'],
          ].map(([icon, value, label], index) => (
            <div key={label} className={`flex items-center gap-2 border border-[#d8e6f0] bg-white px-3 py-3 text-[#123a62] ${index > 2 ? 'hidden sm:flex' : 'flex'} lg:flex`}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#1672ce] text-sm font-bold text-white">{icon}</span>
              <span className="min-w-0"><strong className="block truncate text-[10px] font-bold">{value}</strong><small className="block truncate text-[9px] text-[#627a90]">{label}</small></span>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="school-band school-about bg-[#f1f6fb] px-4 py-2 sm:px-6">
        <div className="school-inner mx-auto max-w-[1280px] bg-white p-3 shadow-sm sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_1.05fr_1.35fr]">
            <div className="school-about-photo relative min-h-[240px] overflow-hidden rounded-sm bg-[#dfe9e4]">
              <img src={academics.aboutImage || gallery[0]?.image || cover} alt={`${schoolName} campus`} className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute bottom-2 left-2 rounded-sm bg-white/90 px-2 py-1 font-display text-xs italic text-[#18375d]">A legacy of learning.</span>
            </div>
            <div className="px-1 py-1">
              <p className="school-eyebrow text-[10px] font-bold uppercase tracking-[0.12em]">About Our School</p>
              <h2 className="mt-1 font-display text-xl font-bold leading-tight text-[#12477f]">{schoolName}</h2>
              <p className="mt-2 line-clamp-4 text-[10px] leading-relaxed text-[#4e647a]">{academics.aboutDescription || place.description || 'Committed to providing quality education and holistic development to every student. Our learning environment encourages curiosity, confidence and character.'}</p>
              <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[8px] text-[#506983]">
                {[
                  ['Established', academics.establishedYear],
                  ['Board', academics.board],
                  ['Type', academics.schoolType],
                  ['Medium', academics.medium],
                  ['Classes', academics.classes],
                  ['Students', academics.totalStudents],
                ].filter(([, value]) => value).map(([label, value]) => <div key={label} className="flex gap-1"><dt className="font-bold">{label}:</dt><dd className="truncate">{value}</dd></div>)}
              </dl>
              <a href="#academics" className="mt-2 inline-flex rounded-sm bg-[#1768bc] px-3 py-1 text-[9px] font-bold text-white">Read More →</a>
            </div>
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_.72fr] lg:grid-cols-[1fr_1fr_.72fr]">
              <article className="rounded-sm bg-[#f4f8fc] p-2"><h3 className="text-[11px] font-bold text-[#164c85]">◉ &nbsp;Our Vision</h3><p className="mt-1 text-[9px] leading-relaxed text-[#566e86]">{vision || 'To create confident, responsible and compassionate individuals ready to contribute to society.'}</p></article>
              <article className="rounded-sm bg-[#f4f8fc] p-2"><h3 className="text-[11px] font-bold text-[#164c85]">◉ &nbsp;Our Mission</h3><p className="mt-1 text-[9px] leading-relaxed text-[#566e86]">{mission || 'To provide quality education through innovative teaching, technology and holistic development.'}</p></article>
              <article className="border-l border-[#dce7f1] pl-2"><h3 className="text-[11px] font-bold text-[#164c85]">Our Values</h3><ul className="mt-1 space-y-1">{['Integrity', 'Excellence', 'Discipline', 'Creativity', 'Respect', 'Responsibility'].map((value, index) => <li key={value} className="flex items-center gap-1 text-[8px] font-semibold text-[#536b83]"><span className={`grid h-4 w-4 place-items-center rounded-full text-[8px] text-white ${['bg-[#36bdc1]', 'bg-[#3196dc]', 'bg-[#fb8847]', 'bg-[#7da344]', 'bg-[#777dc2]', 'bg-[#25a775]'][index]}`}>{['✓', '★', '✦', '●', '✓', '●'][index]}</span>{value}</li>)}</ul></article>
            </div>
          </div>
        </div>
      </section>

      <section id="history" className="school-band bg-[#f1f6fb] px-4 py-2 sm:px-6">
        <div className="mx-auto grid max-w-[1280px] gap-3 rounded-md border border-[#dce8f2] bg-white p-4 shadow-sm sm:grid-cols-[.65fr_1.35fr] sm:items-center">
          <div className="rounded-sm bg-[#12477f] px-4 py-4 text-white">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#b9dcff]">Our Journey</p>
            <p className="mt-1 font-display text-3xl font-bold">{academics.establishedYear || 'Since day one'}</p>
            <p className="mt-1 text-[10px] text-white/75">{academics.establishedYear ? 'Established' : schoolName}</p>
          </div>
          <div className="px-1 py-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2672b9]">How we began</p>
            <h2 className="mt-1 font-display text-xl font-bold text-[#12477f]">School History</h2>
            <p className="mt-2 whitespace-pre-line text-[11px] leading-relaxed text-[#526b83]">{schoolHistory}</p>
          </div>
        </div>
      </section>

      <section className="school-band bg-[#f1f6fb] px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3">
          <article id="principal-message" className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-md border border-[#dce9f4] bg-white p-3 shadow-sm">
            <div><h2 className="text-sm font-bold text-[#12477f]">Principal’s Message</h2><p className="mt-2 line-clamp-4 text-[11px] leading-relaxed text-[#50677e]">“{academics.principalMessage || 'Dear Parents, Students and Well-Wishers, our school believes in creating an environment where every child feels valued, supported and inspired. We focus on academic excellence, character building and the overall development of every student.'}”</p><p className="mt-2 text-[10px] font-bold text-[#174f93]">{principal.name || academics.principalName || 'School Principal'}</p><p className="text-[9px] text-[#75889b]">Principal · School Leadership</p></div>
            {academics.principalImage ? <img src={academics.principalImage} alt={principal.name || 'School principal'} className="h-24 w-24 self-center rounded-full border-2 border-[#cde2f6] object-cover" /> : <div className="grid h-24 w-24 self-center place-items-center rounded-full bg-[#e7f1fa] text-3xl text-[#2675bd]">♙</div>}
          </article>
          <article id="why-choose" className="rounded-md border border-[#dce9f4] bg-white p-3 shadow-sm">
            <h2 className="text-sm font-bold text-[#12477f]">Why Choose Our School?</h2>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(whyChoose.length ? whyChoose : ['Quality Education', 'Experienced Teachers', 'Modern Laboratories', 'Smart Classrooms', 'Sports & Fitness', 'Safe Transportation']).slice(0, 6).map((item, index) => <div key={`${item}-${index}`} className="flex min-h-14 items-center gap-2 rounded-md border border-[#e1ebf4] bg-[#fbfdff] p-2"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white ${['bg-[#16a77d]', 'bg-[#1677d2]', 'bg-[#f06e38]', 'bg-[#e74f75]', 'bg-[#f3a817]', 'bg-[#567ce8]'][index]}`}>{['✿', '♙', '⚗', '▣', '⚽', '✓'][index]}</span><span className="text-[9px] font-bold leading-tight text-[#254a72]">{item}</span></div>)}
            </div>
          </article>
        </div>
      </section>

      <section className="school-band bg-[#f1f6fb] px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3">
          <article id="academics" className="rounded-md border border-[#dce8f2] bg-white p-3 shadow-sm">
            <h2 className="font-display text-base font-bold text-[#12477f]">Academic Excellence</h2>
            <div className="mt-3 grid gap-2 md:grid-cols-[1fr_.85fr]">
              <div className="grid grid-cols-3 divide-x divide-[#d7e5f1]">
                {[
                  ['Curriculum', academics.board || 'CBSE', academics.curriculum || 'State Board'],
                  ['Classes', academics.classes || 'Classes 1 - 12', academics.medium || 'English Medium'],
                  ['Teaching Methodology', academics.teachingMethod || 'Smart Learning', 'Activity Based Learning'],
                ].map(([title, first, second]) => <div key={title} className="px-2 first:pl-0"><h3 className="text-[9px] font-bold text-[#194c82]">{title}</h3><p className="mt-2 text-[8px] font-semibold text-[#425f7c]">● {first}</p><p className="mt-2 text-[8px] font-semibold text-[#425f7c]">● {second}</p></div>)}
              </div>
              <div className="relative min-h-24 overflow-hidden rounded-sm bg-[#dceaf4]">
                <img src={gallery[1]?.image || studentsFallback} alt="Students learning in class" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </div>
          </article>

          <article id="facilities" className="rounded-md border border-[#dce8f2] bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-display text-base font-bold text-[#12477f]">Our Facilities</h2><button type="button" onClick={() => setShowAllFacilities((current) => !current)} className="rounded bg-[#12477f] px-3 py-1 text-[9px] font-bold text-white">{showAllFacilities ? 'Show less' : 'View All'}</button></div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(showAllFacilities ? facilityItems : facilityItems.slice(0, 6)).map((facility, index) => {
                const item = typeof facility === 'string' ? { name: facility } : facility;
                return <div key={`${item.name || 'facility'}-${index}`} className="flex min-h-14 items-center gap-2 rounded border border-[#dce8f2] bg-[#f9fbff] p-2">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded text-white ${['bg-[#1b70cf]', 'bg-[#6756d9]', 'bg-[#08a6bd]', 'bg-[#875ee5]', 'bg-[#11a99c]', 'bg-[#f0a323]'][index]}`}>{['◆', '♙', '▣', '▤', '⚽', '✓'][index]}</span>
                  <span><strong className="block text-[8px] leading-tight text-[#204b78]">{item.name || 'Learning space'}</strong><small className="mt-1 block text-[7px] leading-tight text-[#77889b]">{item.description || ['Holistic & value based learning', 'Passionate & qualified faculty', 'Hands-on practical learning', 'Interactive digital learning', 'Physical and mental well-being', 'Comfortable & secure travel'][index]}</small></span>
                </div>;
              })}
            </div>
          </article>
        </div>
      </section>

      <section id="gallery" className="school-band bg-[#f1f6fb] px-4 py-2 sm:px-6">
        <div className="school-inner mx-auto max-w-[1280px] bg-white px-4 py-3 shadow-sm sm:px-5">
          <h2 className="mb-3 font-display text-base font-bold text-[#12477f]">Our Enclaves</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {(gallery.length ? gallery : [{ image: cover, caption: 'Our Campus' }]).slice(0, 7).map((item, index) => {
              const image = item.image || item.photo || item.url || cover;
              const caption = item.caption || item.title || ['Main Entrance', 'Academic Block', 'Computer Lab', 'Library', 'Sports Ground', 'Art Room', 'Campus'][index];
              return <button type="button" key={`${image}-${index}`} onClick={() => openImageViewer(image)} className="group relative min-h-16 overflow-hidden rounded border border-[#dce8f2] bg-[#e9f1f8] text-left sm:min-h-20"><img src={image} alt={caption} className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 bg-white/90 px-1 py-1 text-center text-[8px] font-semibold text-[#234d77]">{caption}</span></button>;
            })}
          </div>
        </div>
      </section>

      <section className="school-band bg-[#f1f6fb] px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3">
          <article id="faculty" className="rounded-md border border-[#dce8f2] bg-white p-3"><h2 className="font-display text-sm font-bold text-[#12477f]">Meet Our Faculty</h2><p className="text-[9px] text-[#71879a]">Our dedicated team of educators</p><div className="mt-3 grid grid-cols-2 gap-2">{(faculty.length ? faculty : ['Mathematics', 'Physics', 'English', 'Chemistry']).slice(0, 4).map((person, index) => { const member = typeof person === 'string' ? { name: person } : person; const photo = member.photo || member.image || facultyImages[index]; return <div key={`${member.name}-${index}`} className="flex items-center gap-2 rounded border border-[#e3ebf3] p-1.5">{photo ? <img src={photo} alt={member.name} className="h-8 w-8 rounded-full object-cover" /> : <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e4eff9] text-xs font-bold text-[#2366a9]">{member.name?.charAt(0) || 'S'}</span>}<span><strong className="block text-[8px] text-[#254b73]">{member.name || 'Educator'}</strong><small className="text-[7px] text-[#7a8d9f]">{member.designation || member.qualification || ['Mathematics', 'Physics', 'English', 'Chemistry'][index]}</small></span></div>; })}</div></article>
          <article id="activities" className="rounded-md border border-[#dce8f2] bg-white p-3"><h2 className="font-display text-sm font-bold text-[#12477f]">Student Activities</h2><p className="text-[9px] text-[#71879a]">Beyond Academics</p><div className="mt-3 grid grid-cols-4 gap-2">{displayedActivities.map((label, index) => { const icon = activityTypes.find(([, activityLabel]) => activityLabel.toLowerCase() === label.toLowerCase())?.[0] || '✦'; return <div key={`${label}-${index}`} className="flex min-h-12 flex-col items-center justify-center gap-1 rounded border border-[#e3ebf3] bg-[#fbfdff] text-center"><span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${['bg-[#ddf5df]', 'bg-[#fff1cf]', 'bg-[#e2edff]', 'bg-[#ffebeb]', 'bg-[#def3f2]', 'bg-[#ffe7de]', 'bg-[#e4efff]', 'bg-[#edf6e2]'][index % 8]}`}>{icon}</span><span className="text-[8px] font-semibold text-[#42607d]">{label}</span></div>; })}</div></article>
          <article id="achievements" className="rounded-md border border-[#dce8f2] bg-white p-3"><h2 className="font-display text-sm font-bold text-[#12477f]">Our Achievements</h2><p className="text-[9px] text-[#71879a]">Proud Moments</p><div className="mt-3 space-y-2">{(achievements.length ? achievements : ['25+ Awards', '150+ Competition Winners', '95% Academic Achievement']).slice(0, 3).map((item, index) => <div key={`${textOf(item)}-${index}`} className="flex items-center justify-between border-b border-[#e6edf3] pb-2"><strong className="text-[11px] font-bold text-[#174f93]">{textOf(item)}</strong><span className="text-[#e4a321]">{index === 0 ? '🏆' : '✦'}</span></div>)}</div></article>
        </div>
      </section>

      <section id="events" className="school-band bg-[#f1f6fb] px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3">
          <article className="rounded-md border border-[#dce8f2] bg-white p-3">
            <div className="flex items-center justify-between"><h2 className="font-display text-xs font-bold text-[#12477f]">Latest Events</h2><button type="button" onClick={() => setShowAllEvents((current) => !current)} className="text-[8px] text-[#2672b9]">{showAllEvents ? 'Show less' : 'View All'}</button></div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{(showAllEvents ? eventItems : eventItems.slice(0, 3)).map((item, index) => { const eventImage = imageSource(eventImages[index]) || (typeof item === 'object' ? imageSource(item) : '') || imageSource(gallery[index]) || cover; return <div key={`${textOf(item)}-${index}`} className="min-w-0"><button type="button" onClick={() => openImageViewer(eventImage)} className="block w-full overflow-hidden rounded text-left"><img src={eventImage} alt={`${textOf(item) || 'School event'} photo`} className="h-28 w-full rounded object-cover sm:h-36" /></button><p className="mt-2 truncate text-xs font-semibold text-[#31516e]">{textOf(item)}</p></div>; })}</div>
          </article>
          <article className="rounded-md border border-[#dce8f2] bg-white p-3">
            <div className="flex items-center justify-between"><h2 className="font-display text-xs font-bold text-[#12477f]">News &amp; Notices</h2><button type="button" onClick={() => setShowAllNotices((current) => !current)} className="text-[8px] text-[#2672b9]">{showAllNotices ? 'Show less' : 'View All'}</button></div>
            <ul className="mt-3 space-y-2">{(showAllNotices ? noticeItems : noticeItems.slice(0, 4)).map((item, index) => <li key={`${textOf(item)}-${index}`} className="flex justify-between gap-2 border-b border-[#edf1f5] pb-2 text-xs text-[#455f79]"><span className="truncate">• {textOf(item)}</span><time className="shrink-0 text-[#8293a3]">{typeof item === 'object' ? item.date : ''}</time></li>)}</ul>
          </article>
          <article className="rounded-md border border-[#dce8f2] bg-white p-3">
            <div className="flex items-center justify-between"><h2 className="font-display text-xs font-bold text-[#12477f]">Gallery</h2><button type="button" onClick={() => setShowAllGallery((current) => !current)} className="text-[8px] text-[#2672b9]">{showAllGallery ? 'Show less' : 'View All'}</button></div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{(showAllGallery ? galleryItems : galleryItems.slice(0, 6)).map((item, index) => { const image = imageSource(item) || cover; return <button type="button" key={`${image}-${index}`} onClick={() => openImageViewer(image, galleryViewerItems.length ? galleryViewerItems : imageViewerItems)} className="overflow-hidden rounded text-left"><img src={image} alt={item.caption || item.title || 'School gallery'} className="h-24 w-full rounded object-cover sm:h-32" /></button>; })}</div>
          </article>
          <article className="rounded-md border border-[#dce8f2] bg-white p-3">
            <div className="flex items-center justify-between"><h2 className="font-display text-xs font-bold text-[#12477f]">Video Gallery</h2><button type="button" onClick={openVideoViewer} className="text-[8px] text-[#2672b9]">View All</button></div>
            <button type="button" data-video-trigger="true" onClick={openVideoViewer} className="relative mx-auto mt-3 block aspect-video w-full max-w-3xl overflow-hidden rounded bg-[#133f67]"><img src={cover} alt={`${schoolName} video preview`} className="h-full w-full object-cover opacity-80" /><span className="absolute inset-0 grid place-items-center text-4xl text-white">▶</span></button>
          </article>
        </div>
      </section>

      <section id="admissions" className="school-band scroll-mt-20 bg-[#f1f6fb] px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 rounded-md bg-[#12477f] p-5 text-white shadow-sm sm:p-7">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b9dcff]">Admissions {academics.admissionYear || '2026 - 27'}</p>
            <h2 className="mt-1 font-display text-2xl font-bold">Begin your child’s next chapter.</h2>
            <p className="mt-2 text-xs leading-relaxed text-white/75">{academics.admissionProcess || 'Contact our admissions team to learn about available classes, eligibility and the application process.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#admissions-form" onClick={scrollToAdmissionsForm} className="rounded bg-[#ffc84a] px-4 py-2 text-xs font-bold text-[#092d4b]">Enquire now ↓</a>
            {place.phone && <a href={`tel:${place.phone}`} className="rounded border border-white/50 px-4 py-2 text-xs font-bold text-white">Call admissions</a>}
          </div>
        </div>
      </section>

      <section id="contact" className="school-band bg-[#f1f6fb] px-4 py-2 sm:px-6">
        <div className="mx-auto grid max-w-[1280px] gap-3 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-md border border-[#dce8f2] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2672b9]">Visit the campus</p>
            <h2 className="mt-1 font-display text-xl font-bold text-[#12477f]">Location &amp; Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#526b83]">{place.address || 'Contact the school for its campus address.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {place.phone && <a href={`tel:${place.phone}`} className="inline-flex items-center gap-2 rounded bg-[#1768bc] px-3 py-2 text-xs font-bold text-white">☎ Call {place.phone}</a>}
              {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded bg-[#168b57] px-3 py-2 text-xs font-bold text-white">◉ WhatsApp</a>}
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded bg-[#2867b2] px-3 py-2 text-xs font-bold text-white">f {socialLinks.facebook ? 'Facebook' : 'Share on Facebook'}</a>
            </div>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#1768bc]">⌖ Open in Google Maps ↗</a>
          </div>
          <div className="overflow-hidden rounded-md border border-[#dce8f2] bg-white shadow-sm">
            <iframe title={`Google map to ${schoolName}`} src={mapEmbedUrl} className="h-56 w-full border-0 sm:h-64" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      <section id="reviews" className="school-band bg-[#f1f6fb] px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-[1280px] rounded-md border border-[#dce8f2] bg-white p-4 shadow-sm sm:p-5">
          <ReviewsSection placeId={place._id} />
        </div>
      </section>
    </main>

    <footer id="school-footer" className="school-footer text-white">
      <div className="mx-auto grid max-w-[1280px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1.2fr_.8fr_.8fr_.9fr_.9fr_1.3fr]">
        <div>
          <div className="flex items-center gap-3"><div className="school-brand-mark flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#f2cc60] bg-[#0d2d45] text-xl">📖</div><div><div className="font-display text-xl font-bold">{schoolName}</div><div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Learning for life</div></div></div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">We are committed to quality education and values-based development.</p>
          <div className="mt-4 flex gap-3 text-sm">
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label={socialLinks.facebook ? 'Facebook' : 'Share on Facebook'} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5">f</a>
            {socialLinks.instagram && <a href={socialLinks.instagram} aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5">◎</a>}
            {whatsapp && <a href={whatsapp} aria-label="WhatsApp" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5">◉</a>}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffe08f]">Quick Links</h3>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <a href="#about" className="block">About Us</a>
            <a href="#about" className="block">Vision &amp; Mission</a>
            <a href="#history" className="block">School History</a>
            <a href="#achievements" className="block">Achievements</a>
            <a href="#gallery" className="block">Campus Gallery</a>
            <a href="#reviews" className="block">Reviews</a>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffe08f]">Academics</h3>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <a href="#academics" className="block">Curriculum</a>
            <a href="#academics" className="block">Classes</a>
            <a href="#faculty" className="block">Faculty</a>
            <a href="#facilities" className="block">Facilities</a>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffe08f]">Admissions</h3>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <a href="#admissions" onClick={scrollToAdmissions} className="block">Admission Process</a>
            <a href="#admissions-form" onClick={scrollToAdmissionsForm} className="block">Apply Now</a>
            <a href="#admissions" onClick={scrollToAdmissions} className="block">Fee Structure</a>
            <a href="#admissions" onClick={scrollToAdmissions} className="block">Downloads</a>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffe08f]">Contact</h3>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            <p>{place.address || 'Campus address'}</p>
            {place.phone && <a href={`tel:${place.phone}`} className="block">{place.phone}</a>}
            {place.email && <a href={`mailto:${place.email}`} className="block">{place.email}</a>}
          </div>
        </div>

        <form id="admissions-form" onSubmit={submitEnquiry} className="school-enquiry-form scroll-mt-20">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffe08f]">We’d love to hear from you</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input required aria-label="Parent name" placeholder="Parent Name" value={enquiry.name} onChange={(event) => setEnquiry({ ...enquiry, name: event.target.value })} />
            <input required type="tel" aria-label="Mobile number" placeholder="Mobile Number" value={enquiry.phone} onChange={(event) => setEnquiry({ ...enquiry, phone: event.target.value })} />
            <select aria-label="Class interested in" value={enquiry.class} onChange={(event) => setEnquiry({ ...enquiry, class: event.target.value })}><option value="">Class</option>{classes.map((value) => <option key={value} value={value}>{value}</option>)}</select>
            <input required type="email" aria-label="Email address" placeholder="Email Address" value={enquiry.email} onChange={(event) => setEnquiry({ ...enquiry, email: event.target.value })} />
            <textarea required aria-label="Enquiry message" placeholder="Message" rows={2} value={enquiry.message} onChange={(event) => setEnquiry({ ...enquiry, message: event.target.value })} className="col-span-2" />
          </div>
          {enquiryStatus === 'sent' && <p className="mt-2 text-[10px] text-emerald-200">Enquiry sent. Thank you!</p>}
          {enquiryStatus === 'error' && <p className="mt-2 text-[10px] text-red-200">{enquiryError}</p>}
          <button type="submit" disabled={enquiryStatus === 'sending'} className="school-form-submit mt-2 w-full px-3 py-2 text-[10px] font-bold">{enquiryStatus === 'sending' ? 'Sending...' : 'Send Enquiry'}</button>
        </form>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-[9px] text-white/55 sm:px-6"><span>© {new Date().getFullYear()} {schoolName}. All Rights Reserved.</span><span>Powered by G-PAGES</span></div>
    </footer>

    {selectedImage && <div role="dialog" aria-modal="true" aria-label="School photo viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-[#061c2b]/95 p-4 sm:p-8" onClick={() => { setSelectedImage(null); setSelectedImageCollection(null); }}>
      <button type="button" onClick={() => { setSelectedImage(null); setSelectedImageCollection(null); }} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-3xl text-white hover:bg-white/20" aria-label="Close image viewer">×</button>
      {activeImageItems.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); moveImage(-1); }} className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25 sm:left-6" aria-label="Previous image">‹</button>}
      <div className="flex max-h-full max-w-full flex-col items-center" onClick={(event) => event.stopPropagation()}>
        <img src={selectedImage} alt={activeImageItems[activeImageIndex]?.alt || `${schoolName} enlarged`} className="max-h-[78vh] max-w-[calc(100vw-7rem)] object-contain sm:max-h-[82vh]" />
        {activeImageItems.length > 1 && <p className="mt-3 text-xs font-medium text-white/75">{Math.max(activeImageIndex + 1, 1)} / {activeImageItems.length}</p>}
      </div>
      {activeImageItems.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); moveImage(1); }} className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25 sm:right-6" aria-label="Next image">›</button>}
    </div>}

    {selectedVideo && <div role="dialog" aria-modal="true" aria-label="School video player" className="fixed inset-0 z-50 flex items-center justify-center bg-[#061c2b]/95 p-4 sm:p-8" onClick={() => setSelectedVideo(null)}>
      <button type="button" onClick={() => setSelectedVideo(null)} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-3xl text-white hover:bg-white/20" aria-label="Close video player">×</button>
      <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-black" onClick={(event) => event.stopPropagation()}>
        {/\.(mp4|webm|ogg)(\?.*)?$/i.test(selectedVideo)
          ? <video src={selectedVideo} controls autoPlay className="max-h-[85vh] w-full" />
          : <iframe src={videoEmbedUrl(selectedVideo)} title={`${schoolName} video`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="aspect-video w-full border-0" />}
      </div>
    </div>}
  </div>;
}

export default SchoolExperience;

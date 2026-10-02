import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReviewsSection from '../../../components/ReviewsSection';
import mediaUrl from '../../../utils/mediaUrl';

const getYoutubeEmbed = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes('youtube.com')) {
      const vid = parsed.searchParams.get('v');
      return vid ? `https://www.youtube.com/embed/${vid}` : null;
    }
  } catch {
    return null;
  }
  return null;
};

const defaultHeroImage = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80';
const navItems = ['Home', 'About', 'Services', 'Gallery', 'Reviews', 'Contact'];

const fallbackServices = [
  { icon: '📈', title: 'Business Strategy', description: 'Plan for growth with expert strategic analysis and market-aligned decisions.' },
  { icon: '💰', title: 'Financial Advisory', description: 'Improve financial health with robust guidance, support, and performance tracking.' },
  { icon: '🔎', title: 'Market Research', description: 'Get in-depth insights for better decision making and market positioning.' },
  { icon: '⚙️', title: 'Operational Consulting', description: 'Streamline operations and improve team efficiency with measurable clarity.' },
];

const fallbackWhyChooseUs = [
  { icon: '🏅', title: 'Expert Guidance', text: 'Experienced & certified consultants' },
  { icon: '🧩', title: 'Tailored Solutions', text: 'Custom strategies built around your goals' },
  { icon: '📊', title: 'Proven Results', text: 'Track record of measurable business growth' },
  { icon: '🤝', title: 'Client Focused', text: 'We work with your priorities and challenges' },
];

const fallbackGallery = [
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
];

const fallbackReviews = [
  { name: 'Ravi Kumar', quote: 'Excellent service and professional team. Truly helpful in growing our business.', time: '2 weeks ago' },
  { name: 'Sneha Reddy', quote: 'Very knowledgeable and supportive throughout the process. Highly recommended.', time: '1 month ago' },
  { name: 'Suresh Babu', quote: 'Great experience with the team. They delivered practical and effective solutions.', time: '1 month ago' },
];

function SocialIcon({ network }) {
  const common = { viewBox: '0 0 24 24', className: 'h-5 w-5', 'aria-hidden': true };

  if (network === 'whatsapp') return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.4 11.7a8.4 8.4 0 0 1-12.5 7.3L4 20l1.1-3.7a8.4 8.4 0 1 1 15.3-4.6Z" /><path d="M8.2 7.8c.2 3.8 4.1 7.7 7.9 8l1.1-1.1-2.1-1.2-1.2 1c-1.5-.6-2.7-1.8-3.4-3.3l1-1.2-1.2-2.1-1.1 1Z" /></svg>;
  if (network === 'instagram') return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.8" r=".8" fill="currentColor" stroke="none" /></svg>;
  if (network === 'facebook') return <svg {...common} viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.5v1.8H7V13h2.9v8h3.6Z" /></svg>;
  if (network === 'youtube') return <svg {...common} viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>;
  if (network === 'linkedin') return <svg {...common} viewBox="0 0 24 24" fill="currentColor"><path d="M5.2 7.8a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3.5 9.3h3.4V21H3.5zM9 9.3h3.3v1.6h.1a3.7 3.7 0 0 1 3.3-1.8c3.5 0 4.2 2.3 4.2 5.2V21h-3.4v-6c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9V9.3Z" /></svg>;
  return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>;
}

export default function ConsultancyBrandPage({ place }) {
  const business = place || {};
  const categoryData = business.categoryData || business.attributes?.categoryData || {};
  const categoryContext = [business.businessGroup, business.categoryGroup, business.category?.name, business.subcategory, business.attributes?.subCategory]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const isLogistics = /logistics|moving|packers?|movers?/.test(categoryContext);
  const businessName = business.name || 'Veritas Business Consultants';
  const businessCategory = business.category?.name || (isLogistics ? 'Logistics & Moving' : 'Consultancy');
  const businessLogo = business.logo || business.brandLogo || business.logoUrl || '';
  const heroImage = business.coverImage || business.images?.[0] || (isLogistics
    ? 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80'
    : defaultHeroImage);
  const gallery = business.images?.length ? business.images : fallbackGallery;
  const description = business.description || (isLogistics
    ? 'Move homes, offices, and goods with a clear plan from pickup to delivery. Share your requirements and get the right support for your route.'
    : 'Our consultancy team delivers strategic guidance, operational support, and measurable growth solutions for businesses and entrepreneurs.');
  const address = business.address || 'Hyderabad, Telangana';
  const phone = business.phone || '+91 98765 43210';
  const email = business.email || 'info@veritasconsultants.com';
  const website = business.website || 'https://www.veritasconsultants.com';
  const whatsapp = business.socialLinks?.whatsapp || 'https://wa.me/919876543210';
  const instagram = business.socialLinks?.instagram || 'https://instagram.com';
  const footerSocialLinks = [
    { network: 'whatsapp', label: 'WhatsApp', href: whatsapp, className: 'bg-[#25D366] shadow-[#25D366]/20' },
    { network: 'instagram', label: 'Instagram', href: instagram, className: 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] shadow-pink-500/20' },
    { network: 'facebook', label: 'Facebook', href: business.socialLinks?.facebook, className: 'bg-[#1877F2] shadow-blue-700/20' },
    { network: 'youtube', label: 'YouTube', href: business.socialLinks?.youtube, className: 'bg-[#FF0000] shadow-red-700/20' },
    { network: 'linkedin', label: 'LinkedIn', href: business.socialLinks?.linkedin, className: 'bg-[#0A66C2] shadow-blue-700/20' },
    { network: 'website', label: 'Website', href: website, className: isLogistics ? 'bg-[#4b6554] shadow-[#142c2a]/30' : 'bg-slate-600 shadow-slate-900/20' },
  ].filter((item) => item.href);
  const ratingText = business.rating?.average ? `${business.rating.average.toFixed(1)} (${business.rating.count || 0} Reviews)` : '4.8 (124 Reviews)';
  const parseCategoryList = (value) => Array.isArray(value)
    ? value.filter(Boolean)
    : String(value || '').split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  const logisticsServices = parseCategoryList(categoryData.movingServices);
  const services = business.services?.length
    ? business.services.map((title, index) => ({ icon: isLogistics ? ['📦', '🚚', '🧭', '🏬'][index % 4] : ['📈', '💰', '🔎', '⚙️'][index % 4], title, description: title }))
    : isLogistics && logisticsServices.length
      ? logisticsServices.map((title, index) => ({ icon: ['📦', '🚚', '🧭', '🏬'][index % 4], title, description: title }))
      : isLogistics
        ? [
            { icon: '📦', title: 'Home & Office Moves', description: 'Plan a move around your inventory, access needs, and preferred schedule.' },
            { icon: '🚚', title: 'Packing & Transport', description: 'Coordinate packing and transport for your origin, destination, and timeline.' },
            { icon: '🧭', title: 'Local & Long-Distance Routes', description: 'Arrange moving support for the distance and locations that suit your needs.' },
            { icon: '🏬', title: 'Storage & Warehousing', description: 'Ask about storage options when your move needs extra time or flexibility.' },
          ]
        : fallbackServices;
  const highlightList = parseCategoryList(categoryData.highlights || business.attributes?.highlights);
  const whyChooseUs = highlightList.length
    ? highlightList.map((text, index) => ({ icon: ['🏅', '🧩', '📊', '🤝'][index % 4], title: ['Expert Guidance', 'Tailored Solutions', 'Proven Results', 'Client Focused'][index % 4], text }))
    : isLogistics
      ? [
          { icon: '🗺️', title: 'Clear Route Planning', text: 'Share your pickup, destination, and schedule to plan the move.' },
          { icon: '📋', title: 'A Defined Process', text: 'Know what to expect at each step of your relocation.' },
          { icon: '📦', title: 'Careful Handling', text: 'Discuss packing and special handling needs before moving day.' },
          { icon: '☎️', title: 'Direct Coordination', text: 'Reach the team to coordinate details and request a quote.' },
        ]
      : fallbackWhyChooseUs;
  const logisticsStats = [
    { label: 'Years in business', value: categoryData.yearsExperience },
    { label: 'Moves completed', value: categoryData.movesCompleted },
    { label: 'Fleet size', value: categoryData.fleetCount },
    { label: 'Team size', value: categoryData.teamSize },
  ].filter((item) => item.value);
  const logisticsDetails = [
    { label: 'Service areas', value: categoryData.serviceAreas },
    { label: 'Fleet', value: categoryData.fleet },
    { label: 'Transit coverage', value: categoryData.insuranceCoverage },
  ].filter((item) => item.value);
  const placeId = business._id || business.id || business.slug || null;
  const categoryDetails = Object.entries(categoryData)
    .filter(([key, value]) => value && !['gallery', 'videoGallery', 'videos'].includes(key) && (!Array.isArray(value) || value.length > 0))
    .map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase()),
      value: (Array.isArray(value) ? value : [value])
        .map((item) => {
          if (typeof item === 'string' || typeof item === 'number') return String(item);
          if (!item || typeof item !== 'object') return '';
          return item.title || item.name || item.label || item.caption || item.value || item.text || '';
        })
        .filter(Boolean),
    }))
    .filter((detail) => detail.value.length > 0);
  const backLink = '/';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const slideTimerRef = useRef(null);

  // Collect all videos — server saves to place.video (array or string)
  // or place.videos[]. Also fall back to place.videoUrls (legacy).
  const allVideoUrls = (() => {
    const collected = [];
    const addUrl = (v) => {
      const raw = typeof v === 'string' ? v.trim() : v?.url?.trim?.() || '';
      const url = mediaUrl(raw);
      if (url) collected.push(url);
    };
    // place.video — array or single string
    if (Array.isArray(business.video)) {
      business.video.forEach(addUrl);
    } else if (business.video) {
      addUrl(business.video);
    }
    // place.videos — additional array field
    if (Array.isArray(business.videos)) {
      business.videos.forEach(addUrl);
    }
    // legacy videoUrls text field
    if (business.videoUrls) {
      String(business.videoUrls).split(/[\n,]/).forEach(addUrl);
    }
    // deduplicate
    return [...new Set(collected)];
  })();

  // Separate images and videos
  const allImages = (business.images?.length ? business.images : fallbackGallery).map((img) => mediaUrl(img) || img);
  const GRID_COUNT = 6;
  const gridImages = allImages.slice(0, GRID_COUNT);
  const slideshowImages = allImages.slice(GRID_COUNT);
  const hasSlideshow = slideshowImages.length > 0;

  // Auto-play slideshow
  useEffect(() => {
    if (!hasSlideshow) return;
    slideTimerRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 3000);
    return () => clearInterval(slideTimerRef.current);
  }, [hasSlideshow, slideshowImages.length]);

  const goSlide = (dir) => {
    clearInterval(slideTimerRef.current);
    setSlideIndex((prev) => (prev + dir + slideshowImages.length) % slideshowImages.length);
    slideTimerRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 3000);
  };

  // Video gallery items
  const videoItems = allVideoUrls.map((url) => ({ type: 'video', url, embed: getYoutubeEmbed(url) }));

  return (
    <div id="home" className={`min-h-screen text-slate-800 ${isLogistics ? 'bg-[#f1f5ef]' : 'bg-[#f4f7fb]'}`}>
      <header className={`${isLogistics ? 'bg-[#142c2a]' : 'bg-[#061f35]'} text-white shadow-md shadow-slate-900/10`}>
        <div className="mx-auto grid max-w-[1700px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 lg:grid-cols-[1fr_auto_auto] lg:px-7">
          <div className="flex min-w-0 items-center gap-3 lg:justify-self-start">
            {businessLogo ? (
              <img src={businessLogo} alt={`${businessName} logo`} className="h-12 w-12 shrink-0 rounded-2xl bg-white object-contain p-1 shadow-sm sm:h-14 sm:w-14" />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-[#0a2a45] shadow-sm sm:h-14 sm:w-14 sm:text-3xl">
                {businessName.charAt(0).toUpperCase() || 'V'}
              </div>
            )}
            <div className="min-w-0 leading-none">
              <div className="font-display text-[1.7rem] font-bold tracking-tight text-white sm:text-[2rem] lg:text-[2.2rem]">{businessName}</div>
              <div className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px] ${isLogistics ? 'text-amber-200' : 'text-sky-200/90'}`}>
                {businessCategory.toUpperCase()}
              </div>
            </div>
          </div>

          <nav className="hidden items-center justify-center gap-7 text-[0.95rem] font-medium tracking-[0.02em] text-white/80 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition duration-200 hover:text-white hover:opacity-100">
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden flex-wrap items-center justify-end gap-3 lg:flex lg:justify-self-end">
            <a href={`tel:${phone}`} className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition sm:px-6 sm:py-3 sm:text-base ${isLogistics ? 'bg-[#d66d32] shadow-[#d66d32]/20 hover:bg-[#bf5925]' : 'bg-sky-500 shadow-sky-500/20 hover:bg-sky-400'}`}>
              Call Now
            </a>
            <a href={`mailto:${email}`} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0a243d] shadow-sm transition hover:bg-slate-100 sm:px-6 sm:py-3 sm:text-base">
              Send Enquiry
            </a>
            <Link
              to={backLink}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90 transition hover:bg-white/10 sm:px-5 sm:py-3 sm:text-sm"
            >
              Back to Home
            </Link>
          </div>
          <button type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle business navigation" aria-expanded={mobileNavOpen} className="grid h-10 w-10 place-items-center rounded-lg border border-white/30 text-white lg:hidden">
            <span className="sr-only">{mobileNavOpen ? 'Close navigation' : 'Open navigation'}</span>
            {mobileNavOpen ? <span aria-hidden="true" className="relative h-4 w-4"><span className="absolute left-0 top-1/2 h-0.5 w-4 -rotate-45 bg-current" /><span className="absolute left-0 top-1/2 h-0.5 w-4 rotate-45 bg-current" /></span> : <span aria-hidden="true" className="flex w-4 flex-col gap-[3px]"><span className="h-0.5 w-full bg-current" /><span className="h-0.5 w-full bg-current" /><span className="h-0.5 w-full bg-current" /></span>}
          </button>
        </div>
        {mobileNavOpen && <nav className="border-t border-white/15 px-4 py-2 lg:hidden" aria-label="Business sections">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileNavOpen(false)} className="block border-b border-white/10 py-3 text-sm font-semibold text-white/90 last:border-0">{item}</a>)}<a href={backLink} onClick={() => setMobileNavOpen(false)} className="block py-3 text-sm font-bold text-white">Back to G-Pages</a></nav>}
      </header>

      <main className={`${isLogistics ? 'bg-[linear-gradient(180deg,#f3f6ef_0%,#e7eee7_100%)]' : 'bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.12),_transparent_38%),linear-gradient(180deg,#f8fbff_0%,#eef5fb_100%)]'} py-8 sm:py-10`}>
        <section className={`relative overflow-hidden border bg-white ${isLogistics ? 'border-[#d6e2d8] shadow-[0_25px_60px_rgba(20,60,48,.15)]' : 'border-sky-100 shadow-[0_25px_60px_rgba(8,127,140,.12)]'}`}>
          <div className="absolute inset-0">
            <img src={heroImage} alt={isLogistics ? `${businessName} fleet and moving services` : 'Business consultants meeting'} className="h-full w-full object-cover" />
          </div>
          <div className={`absolute inset-0 ${isLogistics ? 'bg-[linear-gradient(90deg,rgba(12,35,32,.9),rgba(20,58,48,.55),rgba(33,59,45,.24))]' : 'bg-[linear-gradient(90deg,rgba(7,33,52,.82),rgba(10,42,69,.38),rgba(7,33,52,.28))]'}`} />

          <div className="relative flex min-h-[520px] flex-col justify-end p-6 sm:p-9">
            <div className={`text-xs font-bold uppercase tracking-[0.22em] ${isLogistics ? 'text-amber-200' : 'text-sky-200'}`}>
              {isLogistics ? 'MOVING • STORAGE • DELIVERY' : 'Strategy • Growth • Success'}
            </div>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {businessName}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-200">
              {isLogistics ? (categoryData.tagline || 'A smoother move, from pickup to delivery.') : 'Strategic Consulting for a Smarter Tomorrow'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <span className="text-amber-300">★</span> {ratingText}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Verified Business
              </span>
              <span className="inline-flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${isLogistics ? 'bg-amber-300' : 'bg-sky-300'}`} /> {address}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={`tel:${phone}`} className={`rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition ${isLogistics ? 'bg-[#d66d32] shadow-[#d66d32]/25 hover:bg-[#bf5925]' : 'bg-emerald-500 shadow-emerald-500/25 hover:bg-emerald-400'}`}>
                Call Now
              </a>
              <a href={website} target="_blank" rel="noreferrer" className="rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15">
                Website
              </a>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M20.52 3.48A11.88 11.88 0 0 0 12.1 1.5C6.68 1.5 2.27 5.91 2.27 11.34c0 1.99.58 3.94 1.68 5.63L2 22.5l5.72-1.5A10.8 10.8 0 0 0 12.1 21.2c5.42 0 9.83-4.41 9.83-9.84 0-2.62-.99-5.1-2.41-6.88ZM12.1 19.3c-1.66 0-3.29-.45-4.72-1.3l-.34-.2-3.39.89 0.9-3.3-.22-.34A8.64 8.64 0 0 1 3.9 11.34c0-4.78 3.89-8.68 8.68-8.68 2.32 0 4.5.9 6.13 2.53A8.63 8.63 0 0 1 20.78 11.3c0 4.77-3.9 8.68-8.68 8.68Zm4.77-6.5c-.26-.13-1.53-.75-1.77-.84-.24-.09-.42-.14-.6.13-.17.26-.67.84-.82 1.01-.15.17-.3.19-.56.07-.26-.13-1.1-.41-2.09-1.31-.77-.69-1.29-1.55-1.44-1.81-.15-.26-.02-.4.12-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.6-1.45-.82-1.98-.22-.52-.44-.45-.6-.46h-.52c-.18 0-.47.07-.72.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.84.13.18 1.94 2.97 4.7 4.16.66.28 1.17.45 1.57.57.66.21 1.27.18 1.75.11.54-.08 1.53-.63 1.74-1.24.22-.61.22-1.14.15-1.25-.07-.1-.24-.17-.5-.3Z"/>
                </svg>
              </a>
              <a href={instagram} target="_blank" rel="noreferrer" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg shadow-pink-500/25 transition hover:brightness-110" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-3.2a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25Z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className={`absolute right-6 top-6 hidden w-[260px] rounded-2xl border border-white/20 p-5 text-white shadow-lg backdrop-blur-sm md:block ${isLogistics ? 'bg-[#183b35]/85' : 'bg-[#0d3b5e]/75'}`}>
            <div className={`flex items-center gap-2 text-sm font-semibold ${isLogistics ? 'text-amber-200' : 'text-sky-200'}`}>
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-lg ${isLogistics ? 'bg-amber-400/20' : 'bg-sky-500/20'}`}>{isLogistics ? '↗' : '◉'}</span>
              {isLogistics ? 'On the move' : 'Your Growth'}
            </div>
            <div className="mt-3 text-2xl font-semibold leading-tight">{isLogistics ? 'Your move, organized' : 'Our Expertise'}</div>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              {isLogistics ? (categoryData.serviceAreas || 'Moving support tailored to your route and schedule.') : 'Helping businesses achieve their goals with expert guidance and strategic solutions.'}
            </p>
          </div>
        </section>

        <section id="about" className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className={`rounded-[28px] border p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-7 ${isLogistics ? 'border-[#d7e3d8] bg-gradient-to-br from-white via-[#edf4ed] to-[#f7f5ed]' : 'border-sky-100 bg-gradient-to-br from-white via-sky-50/60 to-slate-50'}`}>
            <div className="mb-5 flex items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl text-white shadow-lg ${isLogistics ? 'bg-gradient-to-br from-[#e99542] to-[#b9502b] shadow-[#c76832]/30' : 'bg-gradient-to-br from-sky-500 to-blue-700 shadow-sky-500/30'}`}>{isLogistics ? '↗' : 'ℹ'}</span>
              <h2 className="font-display text-3xl font-semibold text-slate-800">{isLogistics ? 'Moving made straightforward' : 'About Us'}</h2>
            </div>

            <p className="text-[15px] leading-8 text-slate-600">
              {description}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {(isLogistics ? logisticsStats : [
                { label: 'Years Experience', value: '10+' },
                { label: 'Happy Clients', value: '500+' },
                { label: 'Success Rate', value: '95%' },
                { label: 'Client Rating', value: '4.8/5' },
              ]).map((item) => (
                <div key={item.label} className={`rounded-2xl border bg-gradient-to-br to-white p-4 text-center shadow-sm ${isLogistics ? 'border-[#d7e3d8] from-[#edf4ed] shadow-[#dfe9df]' : 'border-sky-100 from-sky-50 shadow-sky-100/80'}`}>
                  <div className="text-2xl font-bold text-slate-800">{item.value}</div>
                  <div className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${isLogistics ? 'text-[#a35a2b]' : 'text-slate-500'}`}>{item.label}</div>
                </div>
              ))}
            </div>

          </div>

          <aside className={`rounded-[28px] border p-6 text-slate-100 shadow-[0_18px_50px_rgba(10,37,66,0.18)] sm:p-7 ${isLogistics ? 'border-[#244c42] bg-gradient-to-br from-[#193a35] via-[#142f2d] to-[#263c31]' : 'border-sky-100 bg-gradient-to-br from-sky-950 via-[#0a2542] to-[#123d63]'}`}>
            <div className="mb-5 flex items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl ring-1 ring-white/20 ${isLogistics ? 'text-amber-200' : 'text-sky-200'}`}>✦</span>
              <h2 className="font-display text-3xl font-semibold text-white">{isLogistics ? 'Plan your move' : 'Contact Information'}</h2>
            </div>

            <div className="space-y-4 text-slate-200">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className={`mt-1 text-lg ${isLogistics ? 'text-amber-300' : 'text-sky-300'}`}>☎</span>
                <div>
                  <div className="font-semibold text-white">{phone}</div>
                  <div className="text-sm text-sky-100/80">{isLogistics ? 'Request a moving quote' : 'Call anytime'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className={`mt-1 text-lg ${isLogistics ? 'text-amber-300' : 'text-sky-300'}`}>✉</span>
                <div>
                  <div className="font-semibold text-white">{email}</div>
                  <div className="text-sm text-sky-100/80">Send us an email</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className={`mt-1 text-lg ${isLogistics ? 'text-amber-300' : 'text-sky-300'}`}>📍</span>
                <div>
                  <div className="font-semibold text-white">{address}</div>
                  <div className="text-sm text-sky-100/80">Business Location</div>
                </div>
              </div>
            </div>

            <a href={`mailto:${email}`} className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 ${isLogistics ? 'bg-gradient-to-r from-[#e99542] to-[#c65e32] shadow-[#c76832]/20' : 'bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-900 shadow-sky-500/20'}`}>
              {isLogistics ? 'Request a Quote' : 'Send Enquiry'}
            </a>

            {isLogistics ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-2 font-semibold text-white"><span className="text-lg text-amber-300">▰</span> Moving details</div>
                {logisticsDetails.length ? <div className="space-y-3 text-sm text-slate-200">{logisticsDetails.map((item) => <div key={item.label}><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200/80">{item.label}</div><div className="mt-1 leading-6">{Array.isArray(item.value) ? item.value.join(', ') : item.value}</div></div>)}</div> : <p className="text-sm leading-6 text-slate-200">Contact the team with your pickup and destination details to discuss your move.</p>}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 font-semibold text-white"><span className="text-lg text-sky-300">🕒</span> Business Hours</div>
                <div className="space-y-2 text-sm text-slate-200"><div className="flex justify-between"><span>Monday - Friday</span><span>9:00 AM - 7:00 PM</span></div><div className="flex justify-between"><span>Saturday</span><span>9:00 AM - 5:00 PM</span></div><div className="flex justify-between"><span>Sunday</span><span>Closed</span></div></div>
              </div>
            )}
          </aside>
        </section>

        {categoryDetails.length > 0 && (
          <section className={`mt-10 rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7 ${isLogistics ? 'border-[#d7e3d8] from-white via-[#edf4ed] to-[#f7f5ed]' : 'border-sky-100 from-white via-sky-50/50 to-slate-50'}`}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className={`text-xs font-bold uppercase tracking-[0.18em] ${isLogistics ? 'text-[#a35a2b]' : 'text-sky-600'}`}>{businessCategory}</div>
                <h2 className="mt-2 font-display text-3xl font-semibold text-slate-800">Category Information</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categoryDetails.map((detail) => (
                <div key={detail.label} className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/80">
                  <div className={`text-[10px] font-bold uppercase tracking-[0.18em] ${isLogistics ? 'text-[#a35a2b]' : 'text-sky-600'}`}>{detail.label}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {detail.value.map((item, index) => (
                      <span key={`${detail.label}-${index}`} className={`rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ${isLogistics ? 'bg-[#edf4ed] ring-[#d7e3d8]' : 'bg-sky-50 ring-sky-100'}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="services" className={`mt-10 rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7 ${isLogistics ? 'border-[#d7e3d8] from-white via-[#edf4ed] to-[#f7f5ed]' : 'border-sky-100 from-white via-sky-50/50 to-slate-50'}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className={`text-xs font-bold uppercase tracking-[0.18em] ${isLogistics ? 'text-[#a35a2b]' : 'text-sky-600'}`}>{businessCategory}</div>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-800">{isLogistics ? 'Moving & Logistics Services' : 'Business Growth Services'}</h2>
            </div>
            <a href="#contact" className={`hidden text-sm font-semibold sm:inline-flex ${isLogistics ? 'text-[#a35a2b] hover:text-[#81431f]' : 'text-sky-700 hover:text-sky-800'}`}>
              {isLogistics ? 'Plan a Move →' : 'View All Services →'}
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div key={service.title} className={`rounded-[24px] border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${isLogistics ? 'border-[#d7e3d8] shadow-[#dfe9df] hover:border-[#d49a69]' : 'border-sky-100 shadow-sky-100/80 hover:border-sky-200'}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl text-white shadow-lg ${isLogistics ? 'bg-gradient-to-br from-[#e99542] to-[#c65e32] shadow-[#c76832]/20' : 'bg-gradient-to-br from-sky-500 to-cyan-500 shadow-sky-500/20'}`}>{service.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-slate-800">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="why-us" className={`mt-10 rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7 ${isLogistics ? 'border-[#d7e3d8] from-[#eef4ed] to-white' : 'border-sky-100 from-slate-50 to-white'}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className={`text-xs font-bold uppercase tracking-[0.18em] ${isLogistics ? 'text-[#a35a2b]' : 'text-sky-600'}`}>{isLogistics ? 'A better moving experience' : 'Why Choose Us?'}</div>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-800">{isLogistics ? 'Thoughtful planning at every step' : 'We turn strategy into measurable action'}</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div key={item.title} className={`rounded-[24px] border bg-white p-5 shadow-sm ${isLogistics ? 'border-[#d7e3d8] shadow-[#dfe9df]' : 'border-slate-200 shadow-slate-100/80'}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-3xl shadow-sm ${isLogistics ? 'bg-gradient-to-br from-amber-100 to-[#dcebe0]' : 'bg-gradient-to-br from-amber-100 to-sky-100'}`}>{item.icon}</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-800">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="gallery" className={`mt-10 rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7 ${isLogistics ? 'border-[#d7e3d8] from-white via-[#edf4ed] to-[#f7f5ed]' : 'border-sky-100 from-white via-sky-50/40 to-slate-50'}`}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-3xl font-semibold text-slate-800">{isLogistics ? 'Fleet & Moving Gallery' : 'Our Gallery'}</h2>
            <span className="text-sm text-slate-400">{allImages.length} Photos{allVideoUrls.length > 0 ? ` · ${allVideoUrls.length} Videos` : ''}</span>
          </div>

          {/* ── Grid: first 6 images + all videos ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gridImages.map((url, index) => (
              <button
                key={`img-${index}`}
                type="button"
                onClick={() => setSelectedImage(url)}
                className={`group overflow-hidden rounded-[24px] border bg-slate-100 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${isLogistics ? 'border-[#d7e3d8] shadow-[#dfe9df]' : 'border-sky-100 shadow-slate-200/60'}`}
              >
                <img src={url} alt={`Gallery photo ${index + 1}`} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
              </button>
            ))}

            {videoItems.map((item, index) => {
              if (item.embed) {
                return (
                  <button
                    key={`vid-${index}`}
                    type="button"
                    onClick={() => setSelectedVideo(item.embed)}
                    className={`group relative overflow-hidden rounded-[24px] border bg-slate-900 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${isLogistics ? 'border-[#d7e3d8] shadow-[#dfe9df]' : 'border-sky-100 shadow-slate-200/60'}`}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${item.embed.split('/embed/')[1]}/hqdefault.jpg`}
                      alt={`Video ${index + 1}`}
                      className="h-56 w-full object-cover opacity-80 transition duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xl transition duration-300 group-hover:scale-110 group-hover:bg-red-500">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 pl-1"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                      <span className="text-xs font-semibold text-white">▶ Play Video</span>
                    </div>
                  </button>
                );
              }
              return (
                <div key={`vid-${index}`} className={`overflow-hidden rounded-[24px] border bg-slate-900 shadow-sm ${isLogistics ? 'border-[#d7e3d8] shadow-[#dfe9df]' : 'border-sky-100 shadow-slate-200/60'}`}>
                  <video src={item.url} controls className="h-56 w-full object-cover" preload="metadata" />
                </div>
              );
            })}
          </div>

          {/* ── Slideshow: remaining images ── */}
          {hasSlideshow && (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-sky-100" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">More Photos · Slideshow</span>
                <span className="h-px flex-1 bg-sky-100" />
              </div>

              <div className="relative overflow-hidden rounded-[24px] bg-slate-900 shadow-lg">
                {/* Slides */}
                <div className="relative h-72 sm:h-96">
                  {slideshowImages.map((url, i) => (
                    <div
                      key={`slide-${i}`}
                      className="absolute inset-0 transition-opacity duration-700"
                      style={{ opacity: i === slideIndex ? 1 : 0, zIndex: i === slideIndex ? 1 : 0 }}
                    >
                      <img
                        src={url}
                        alt={`Slideshow photo ${i + 1}`}
                        className="h-full w-full object-cover cursor-pointer"
                        onClick={() => setSelectedImage(url)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-5 z-10">
                        <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                          {i + 1 + GRID_COUNT} / {allImages.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prev / Next arrows */}
                {slideshowImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => goSlide(-1)}
                      className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/35"
                      aria-label="Previous slide"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => goSlide(1)}
                      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/35"
                      aria-label="Next slide"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </>
                )}

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex gap-1.5">
                  {slideshowImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { clearInterval(slideTimerRef.current); setSlideIndex(i); }}
                      className={`h-2 rounded-full transition-all duration-300 ${i === slideIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[24px] border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/40"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
                aria-label="Close image"
              >
                ×
              </button>
              <img src={selectedImage} alt="Expanded consultancy gallery view" className="max-h-[90vh] w-full object-contain" />
            </div>
          </div>
        )}

        {selectedVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="relative w-full max-w-4xl overflow-hidden rounded-[24px] border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/40"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
                aria-label="Close video"
              >
                ×
              </button>
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src={`${selectedVideo}?autoplay=1`}
                  title="Business video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </div>
        )}

        <section id="reviews" className={`mt-10 rounded-[28px] border bg-gradient-to-br p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10 ${isLogistics ? 'border-[#d7e3d8] from-[#edf4ed] via-white to-[#f7f5ed]' : 'border-sky-100 from-sky-50 via-white to-slate-50'}`}>
          <div className="mb-7 flex items-center justify-between">
            <h2 className="font-display text-3xl font-semibold text-slate-800 sm:text-4xl">Customer Reviews</h2>
            <a href="#contact" className={`hidden text-sm font-semibold sm:inline-flex ${isLogistics ? 'text-[#a35a2b] hover:text-[#81431f]' : 'text-sky-700 hover:text-sky-800'}`}>{isLogistics ? 'Request a quote →' : 'Share Your Experience →'}</a>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_1.35fr] xl:items-start">
            <div className={`rounded-[26px] border bg-white p-5 shadow-sm sm:p-6 ${isLogistics ? 'border-[#d7e3d8] shadow-[#dfe9df]' : 'border-sky-100 shadow-sky-100/80'}`}>
              <div className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${isLogistics ? 'text-[#a35a2b]' : 'text-sky-600'}`}>{isLogistics ? 'Moving with confidence' : 'Why people choose us'}</div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                {isLogistics ? <><p>“The team kept our move organized and explained each step clearly.”</p><p>“Careful coordination made moving day much easier for our family.”</p><p>“We got clear communication from the first enquiry through delivery.”</p></> : <><p>“Extremely professional, responsive, and result-focused. The team helped us make clearer business decisions with confidence.”</p><p>“Very knowledgeable consultants who listen carefully and provide practical solutions.”</p><p>“Our experience was smooth from the first call to project completion. Highly recommended.”</p></>}
              </div>
            </div>

            <div className={`rounded-[26px] border bg-white p-5 shadow-sm sm:p-6 ${isLogistics ? 'border-[#d7e3d8] shadow-[#dfe9df]' : 'border-sky-100 shadow-sky-100/80'}`}>
              {placeId ? (
                <ReviewsSection placeId={placeId} />
              ) : (
                <div className="rounded-2xl border border-dashed border-sky-200 bg-white/60 p-5 text-sm text-slate-600">
                  Reviews will appear here once this listing is connected to the live review system.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className={`mt-12 border-t text-slate-200 ${isLogistics ? 'border-[#244c42] bg-[#142c2a]' : 'border-sky-900/60 bg-[#0d2943]'}`} data-mobile-footer-layout="columns">
        <div className="consultancy-footer-grid mx-auto grid max-w-[1700px] gap-5 px-4 py-6 sm:gap-8 sm:py-8 lg:grid-cols-[1.3fr_0.7fr_1fr_auto] lg:px-7">
          <div className="consultancy-footer-brand flex items-start gap-3">
            {businessLogo ? (
              <img src={businessLogo} alt={`${businessName} logo`} className="h-12 w-12 shrink-0 rounded-2xl bg-white object-contain p-1 shadow-sm" />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-[#0d2943] shadow-sm">
                {businessName.charAt(0).toUpperCase() || 'V'}
              </div>
            )}
            <div className="min-w-0">
              <div className="break-words font-display text-xl font-bold leading-tight tracking-tight text-white sm:text-[1.8rem]">{businessName}</div>
              <div className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${isLogistics ? 'text-amber-200' : 'text-sky-200/90'}`}>{businessCategory}</div>
              <div className="mt-2 break-words text-[11px] text-slate-300 sm:mt-3 sm:text-sm">{address}</div>
            </div>
          </div>

          <div className="consultancy-footer-links">
            <h3 className="text-sm font-semibold text-white sm:text-lg">Quick Links</h3>
            <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-300 sm:mt-4 sm:gap-2 sm:text-sm">
              <li><a href="#about" className="transition hover:text-white">Home</a></li>
              <li><a href="#gallery" className="transition hover:text-white">Gallery</a></li>
              <li><a href="#about" className="transition hover:text-white">About</a></li>
              <li><a href="#reviews" className="transition hover:text-white">Reviews</a></li>
              <li><a href="#services" className="transition hover:text-white">Services</a></li>
              <li><a href="#contact" className="transition hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div className="consultancy-footer-contact">
            <h3 className="text-sm font-semibold text-white sm:text-lg">Get in Touch</h3>
            <ul className="mt-2 space-y-1.5 text-[11px] text-slate-300 sm:mt-4 sm:space-y-3 sm:text-sm">
              <li className="flex items-center gap-2"><span>☎</span> <span>{phone}</span></li>
              <li className="flex items-center gap-2"><span>✉</span> <span>{email}</span></li>
              <li className="flex items-center gap-2"><span>📍</span> <span>{address}</span></li>
            </ul>
          </div>

          <div className="consultancy-footer-actions flex flex-col items-start gap-3 lg:items-end">
            <Link
              to={backLink}
              className={`inline-flex items-center gap-2 rounded-full border bg-transparent px-4 py-2.5 text-sm font-semibold transition hover:bg-white/5 ${isLogistics ? 'border-amber-200/50 text-amber-100' : 'border-sky-200/70 text-sky-100'}`}
            >
              <span>←</span> Back to G-Pages
            </Link>

            <div className="flex flex-nowrap items-center gap-2 sm:gap-3">
              {footerSocialLinks.map((item) => (
                <a
                  key={item.network}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.label}
                  aria-label={item.label}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 sm:h-10 sm:w-10 ${item.className}`}
                >
                  <SocialIcon network={item.network} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1700px] flex-col gap-3 px-4 py-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between lg:px-7">
            <span>© 2025 {businessName}. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms & Conditions</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

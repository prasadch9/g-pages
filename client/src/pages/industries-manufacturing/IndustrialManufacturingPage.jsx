import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const defaultImages = {
  hero: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  about: 'https://images.unsplash.com/photo-1464226184884-fa52ac9fc7b5?auto=format&fit=crop&w=1200&q=80',
  product1: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  product2: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80',
  product3: 'https://images.unsplash.com/photo-1464226184884-fa52ac9fc7b5?auto=format&fit=crop&w=900&q=80',
  product4: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
  product5: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=900&q=80',
  product6: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80',
  process1: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=600&q=80',
  process2: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80',
  process3: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  process4: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
  process5: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
};

const manufacturingProcessImages = [
  'https://cdn.prod.website-files.com/6448c4b633a1f47d13630756/694a5111f2535ebcc86fcdaf_Rectangle%20218.png',
  'https://static.wixstatic.com/media/665b9c_a72df82123ec42d289e1ae307893d837~mv2.jpeg/v1/fill/w_900%2Ch_600%2Cal_c%2Cq_80/665b9c_a72df82123ec42d289e1ae307893d837~mv2.jpeg',
  'https://media.licdn.com/dms/image/v2/D5622AQGM-FnXFSHayA/feedshare-shrink_800/B56Zzg4o3CI0Ag-/0/1773299470164?e=2147483647&t=VvNHtawvdTOfevBffU2u2EJiku5O3m6F0Z9o8Cuv8z0&v=beta',
  'https://cdn.prod.website-files.com/680e89b82d3efcec91d45bdb/681433b40347a3ec7b6f3d46_Gemini_Generated_Image_lkhlf8lkhlf8lkhl.jpeg',
  'https://www.paramountglobal.com/_next/image/?q=75&url=%2Fimages%2Fabout%2Fpallets-on-a-warehouse-dock.jpg&w=1200',
];

const toTextList = (value) => Array.isArray(value) ? value : String(value || '').split(/[\n,]/).map((item) => item.trim()).filter(Boolean);

function buildInitials(name) {
  return (name || 'AgriFresh Foods').split(' ').slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
}

function normalizeSocialUrl(value, baseUrl) {
  const url = String(value || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (/^(?:www\.)?(?:facebook|instagram)\.com\//i.test(url)) return `https://${url.replace(/^www\./i, '')}`;
  return `${baseUrl}/${url.replace(/^@/, '').replace(/^\/+/, '')}`;
}

function EmptyState({ children }) {
  return <p className="rounded-xl border border-dashed border-[#c9dccf] bg-[#f8fbf9] p-4 text-sm text-[#63776c]">{children}</p>;
}

function getYoutubeEmbedUrl(url) {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

function getYoutubeThumbnailUrl(url) {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
}

function seekPastVideoLeadIn(event) {
  const video = event.currentTarget;
  if (Number.isFinite(video.duration) && video.duration > 0.5) {
    video.currentTime = Math.min(0.5, video.duration / 2);
  }
}

const socialPlatforms = [
  ['instagram', 'Instagram', FaInstagram, '#E4405F'],
  ['facebook', 'Facebook', FaFacebookF, '#1877F2'],
  ['youtube', 'YouTube', FaYoutube, '#FF0000'],
  ['linkedin', 'LinkedIn', FaLinkedinIn, '#0A66C2'],
  ['twitter', 'X / Twitter', FaXTwitter, '#111827'],
  ['whatsapp', 'WhatsApp', FaWhatsapp, '#25D366'],
];

export default function IndustrialManufacturingPage({ place, mapsUrl, onShare, onReport }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(null);
  const [enquiryStatus, setEnquiryStatus] = useState('idle');
  const [enquiryError, setEnquiryError] = useState('');
  const categoryText = [
    typeof place?.subcategory === 'string' ? place.subcategory : '',
    place?.subcategory?.name,
    place?.subcategory?.slug,
    place?.category?.name,
    place?.category?.slug,
    place?.businessGroup,
    place?.categoryGroup,
  ].filter(Boolean).join(' ').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const isFoodProcessing = categoryText.includes('food processing');
  const isSmallScaleIndustries = categoryText.includes('small scale');
  const smallScale = place?.attributes?.smallScaleIndustries || {};
  const foodProcessing = place?.attributes?.foodProcessing || {};
  const pageData = isFoodProcessing ? foodProcessing : smallScale;
  const businessName = place?.name || (isFoodProcessing ? 'AgriFresh Foods' : 'Apex Precision Works');
  const businessDescription = place?.description || (isFoodProcessing
    ? 'We transform nature’s finest ingredients into safe, high-quality and nutritious food products for everyday life.'
    : 'Precision manufacturing, industrial components and dependable engineering solutions for your business.');
  const aboutDescription = pageData.aboutUs || businessDescription;
  const aboutImage = pageData.aboutImageUrl || place?.attributes?.aboutImage || defaultImages.about;
  const logoImage = place?.logo || (isFoodProcessing ? foodProcessing.logoUrl : smallScale.logoUrl) || '';
  const address = place?.address || 'Vijayawada, Andhra Pradesh';
  const phone = place?.phone || '+91 98765 43210';
  const email = place?.email || 'info@agrifreshfoods.in';
  const commonSocialLinks = place?.attributes?.businessProfile?.common?.socialMedia || {};
  const categorySocialLinks = place?.attributes?.businessProfile?.categorySpecific?.socialMedia || {};
  const socialLinks = Object.fromEntries(['facebook', 'instagram', 'youtube', 'linkedin', 'twitter', 'whatsapp'].map((key) => [
    key,
    place?.socialLinks?.[key] || commonSocialLinks[key] || categorySocialLinks[key] || place?.attributes?.[key] || '',
  ]));
  const facebookUrl = normalizeSocialUrl(socialLinks.facebook, 'https://facebook.com');
  const instagramUrl = normalizeSocialUrl(socialLinks.instagram, 'https://instagram.com');
  const whatsappValue = socialLinks.whatsapp || pageData.whatsapp || phone;
  const whatsappUrl = /^https?:\/\//i.test(String(whatsappValue || ''))
    ? whatsappValue
    : `https://wa.me/${String(whatsappValue || '').replace(/\D/g, '')}`;
  const mapQuery = place?.coordinates?.lat && place?.coordinates?.lng
    ? `${place.coordinates.lat},${place.coordinates.lng}`
    : address;
  const directionsUrl = pageData.googleMapsUrl || mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const coverImage = place?.coverImage || defaultImages.hero;
  const galleryImageUrls = (pageData.galleryImages || []).map((item) => typeof item === 'string' ? item : item.url).filter(Boolean);
  const facilityGallery = (foodProcessing.facilityImages || []).map((item) => typeof item === 'string' ? { url: item } : item).filter((item) => item.url);
  const gallery = [...new Set([...(Array.isArray(place?.images) ? place.images : []), ...galleryImageUrls])].slice(0, 6);
  const galleryImages = gallery.length ? gallery : isFoodProcessing ? [] : [
    defaultImages.product1,
    defaultImages.product2,
    defaultImages.product3,
    defaultImages.product4,
    defaultImages.product5,
    defaultImages.product6,
  ];

  const products = pageData.products?.length ? pageData.products : place?.attributes?.products || (isFoodProcessing ? [] : [
    { name: 'CNC Machined Components', description: 'Precision-made components to match your specification.', image: galleryImages[0] },
    { name: 'Fabrication Services', description: 'Custom metal fabrication and industrial assembly.', image: galleryImages[1] },
    { name: 'Precision Shafts & Gears', description: 'Durable components for machinery and equipment.', image: galleryImages[2] },
    { name: 'Sheet Metal Components', description: 'Accurate components with a consistent finish.', image: galleryImages[3] },
  ]);

  const galleryVideos = pageData.galleryVideos || [];
  const mediaViewerItems = [
    ...galleryImages.map((src, index) => ({ type: 'image', src, title: `${businessName} image ${index + 1}` })),
    ...facilityGallery.map((item, index) => ({ type: 'image', src: item.url, title: item.title || `${businessName} facility ${index + 1}` })),
    ...galleryVideos.map((video, index) => ({ type: 'video', src: typeof video === 'string' ? video : video.url, title: typeof video === 'string' ? `${businessName} video ${index + 1}` : video.title || `${businessName} video ${index + 1}` })).filter((item) => item.src),
  ];
  const activeMedia = activeMediaIndex === null ? null : mediaViewerItems[activeMediaIndex];
  const showPreviousMedia = () => setActiveMediaIndex((index) => (index - 1 + mediaViewerItems.length) % mediaViewerItems.length);
  const showNextMedia = () => setActiveMediaIndex((index) => (index + 1) % mediaViewerItems.length);
  const submitEnquiry = async (event) => {
    event.preventDefault();
    const enquiryForm = event.currentTarget;
    const formData = new FormData(enquiryForm);
    setEnquiryStatus('sending');
    setEnquiryError('');

    try {
      await api.post('/enquiries', {
        place: place._id,
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        message: formData.get('message'),
      });
      enquiryForm.reset();
      setEnquiryStatus('sent');
    } catch (error) {
      setEnquiryStatus('error');
      setEnquiryError(error.message || 'We could not send your enquiry. Please try again.');
    }
  };

  useEffect(() => {
    if (activeMediaIndex === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveMediaIndex(null);
      if (event.key === 'ArrowLeft' && mediaViewerItems.length > 1) showPreviousMedia();
      if (event.key === 'ArrowRight' && mediaViewerItems.length > 1) showNextMedia();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMediaIndex, mediaViewerItems.length]);
  const industriesServed = toTextList(pageData.industriesServed || smallScale.industriesServed);
  const certifications = typeof pageData.certifications === 'string'
    ? pageData.certifications.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
    : pageData.certifications || (isFoodProcessing ? [] : ['FSSAI', 'ISO', 'HACCP', '100% GMP', 'Organic', 'Traceability']);
  const facilities = toTextList(pageData.facilities || place?.facilities);
  const qualityStandards = toTextList(pageData.qualityStandards);
  const manufacturingCapabilities = smallScale.manufacturingCapabilities || [];
  const whyChooseUs = (Array.isArray(pageData.whyChooseUs) ? pageData.whyChooseUs : pageData.whyChooseUs ? [pageData.whyChooseUs] : []).map((item) => typeof item === 'string' ? item : item.title).filter(Boolean);
  const heroHighlights = isFoodProcessing
    ? [foodProcessing.businessType, foodProcessing.productionCapacity, ...certifications.slice(0, 2)].filter(Boolean)
    : ['Fresh & Natural Ingredients', 'Hygienic Processing', 'ISO Certified', 'Sustainable Practices'];

  const highlights = isFoodProcessing ? (foodProcessing.stats || []) : [
    { value: products.length || 'Custom', label: products.length ? 'Products & Services' : 'Manufacturing' },
    { value: industriesServed.length || 'Multiple', label: 'Industries Served' },
    { value: certifications.length || 'Quality', label: 'Certifications' },
    { value: 'B2B', label: 'Business Supply' },
  ];

  const processSteps = isFoodProcessing && foodProcessing.processSteps?.length ? foodProcessing.processSteps.map((step, index) => ({
    ...step,
    title: step.title || `Step ${index + 1}`,
    image: step.image || step.imageUrl || defaultImages[`process${(index % 5) + 1}`],
  })) : isFoodProcessing ? [] : [
    { title: '01. Planning', description: 'Confirm product requirements and specifications.', image: manufacturingProcessImages[0] },
    { title: '02. Materials', description: 'Select suitable materials and prepare production.', image: manufacturingProcessImages[1] },
    { title: '03. Manufacturing', description: 'Produce components using the right processes.', image: manufacturingProcessImages[2] },
    { title: '04. Quality Check', description: 'Inspect products for consistency and performance.', image: manufacturingProcessImages[3] },
    { title: '05. Dispatch', description: 'Pack and deliver orders to the customer.', image: manufacturingProcessImages[4] },
  ];

  const advantages = isFoodProcessing
    ? whyChooseUs.map((item) => ({ title: typeof item === 'string' ? item : item.title, icon: '✓' })).filter((item) => item.title)
    : manufacturingCapabilities.length
      ? manufacturingCapabilities.map((item) => ({ title: item.title, icon: '✓' }))
      : [
        { title: 'Precision Manufacturing', icon: '✓' },
        { title: 'Quality Inspection', icon: '⚙' },
        { title: 'Custom Production', icon: '▣' },
        { title: 'Reliable Delivery', icon: '↗' },
      ];

  const stats = isFoodProcessing ? foodProcessing.stats || [] : [
    { value: products.length || 'Custom', label: 'Products & Services' },
    { value: manufacturingCapabilities.length || 'Flexible', label: 'Manufacturing Capabilities' },
    { value: industriesServed.length || 'Multiple', label: 'Industries Served' },
    { value: certifications.length || 'Quality', label: 'Certifications' },
  ];

  const testimonials = isFoodProcessing ? foodProcessing.testimonials || [] : [
    { name: 'Priya Sharma', quote: 'AgriFresh produces an always fresh, tasty and quality product. We trust them for their consistency and hygiene.', role: 'Retail Buyer' },
    { name: 'Ramesh Patel', quote: 'Their commitment to quality and on-time delivery is exceptional. The product range is reliable for our distribution network.', role: 'Distributor' },
  ];
  const companyFacts = [
    ['Established', foodProcessing.establishedYear],
    ['Founder / Owner', foodProcessing.founder],
    ['Production Capacity', foodProcessing.productionCapacity],
    ['Team Size', foodProcessing.employeeCount],
    ['Business Type', foodProcessing.businessType],
    ['Markets Served', foodProcessing.marketsServed],
  ].filter(([, value]) => value);
  const hasCertificationContent = isFoodProcessing
    || certifications.length > 0
    || qualityStandards.length > 0
    || facilities.length > 0
    || foodProcessing.certificationRecords?.some((record) => record.name);
  const hasQualityContent = !isFoodProcessing || advantages.length > 0 || hasCertificationContent;

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    ...(isFoodProcessing || products.length ? [{ label: 'Products', href: '#products' }] : []),
    ...(isFoodProcessing || processSteps.length ? [{ label: 'Our Process', href: '#process' }] : []),
    ...(isFoodProcessing ? [{ label: 'Facility', href: '#facility' }] : []),
    ...(!isFoodProcessing || hasQualityContent ? [{ label: 'Quality & Certifications', href: '#quality' }] : []),
    ...(isFoodProcessing || galleryImages.length || galleryVideos.length ? [{ label: 'Gallery', href: '#gallery' }] : []),
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="bg-[#eff7f2] text-[#1d2d25]">
      <header className="bg-[#052d1d] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            {logoImage
              ? <img src={logoImage} alt={`${businessName} logo`} className="h-10 w-10 rounded-full bg-white object-contain p-1" />
              : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5b942] text-sm font-black text-[#0a311e]">{buildInitials(businessName)}</div>}
            <div>
              <div className="text-[15px] font-black tracking-tight">{businessName}</div>
              <div className="text-[9px] uppercase tracking-[0.22em] text-[#d8f4d7]">From Farm to Your Table</div>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-[12px] font-medium text-[#dfeee2] md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="/" className="whitespace-nowrap rounded-full bg-[#f5b942] px-4 py-2 text-[11px] font-bold text-[#0a311e] shadow-lg shadow-[#f5b942]/25 transition hover:brightness-105">
              Back to Home
            </a>
            {!isSmallScaleIndustries && <div className="hidden items-center gap-3 md:flex">
              <button type="button" className="rounded-full border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-semibold text-white hover:bg-white/10">
                Search
              </button>
              <a href="#contact" className="rounded-full bg-[#f5b942] px-4 py-2 text-[11px] font-bold text-[#0a311e] shadow-lg shadow-[#f5b942]/25 transition hover:brightness-105">
                Get a Quote
              </a>
            </div>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6">
        <section id="home" className="overflow-hidden rounded-[20px] bg-[#072e1d] text-white shadow-[0_25px_60px_rgba(4,22,17,0.18)]">
          <div className="grid items-center px-5 py-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-8">
            <div className="pr-0 lg:pr-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a5e46d]">{isFoodProcessing ? 'Food processing' : 'Industrial & Manufacturing'}</p>
              <h1 className="mt-3 max-w-md font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
                {isFoodProcessing ? 'Good Food Creates a Healthier Tomorrow' : 'Building Better Through Precision Manufacturing'}
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#dfeee2]">
                {businessDescription}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {(isFoodProcessing || products.length > 0) && <a href="#products" className="rounded-full bg-[#6ac968] px-5 py-3 text-sm font-bold text-[#0a311e] shadow-lg shadow-[#6ac968]/20 transition hover:brightness-105">Explore Our Products →</a>}
                {(isFoodProcessing || processSteps.length > 0) && <a href="#process" className="rounded-full border border-white/40 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Our Process →</a>}
              </div>

              {heroHighlights.length > 0 && <div className="mt-7 flex flex-wrap gap-3 text-sm text-[#dfeee2]">
                {heroHighlights.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[12px] font-medium">
                    {item}
                  </span>
                ))}
              </div>}
            </div>

            <div className="relative mt-6 lg:mt-0">
              <div className="overflow-hidden rounded-[18px] border border-white/15 shadow-2xl">
                <img src={coverImage} alt={businessName} className="h-[420px] w-full object-cover" />
              </div>

              <div className="absolute -bottom-5 right-3 w-52 rounded-[18px] border border-[#93db7d] bg-[#0d3f2d] p-4 text-center shadow-xl">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#6ac968] text-2xl text-[#0a311e]">🌿</div>
                <div className="mt-3 text-[15px] font-bold leading-tight text-white">{isFoodProcessing ? foodProcessing.businessType || 'Food Processing' : <>Pure<br />Fresh<br />Healthy</>}</div>
              </div>
            </div>
          </div>
        </section>

        {isFoodProcessing && <section aria-label="Company statistics" className="mt-5"><h2 className="mb-3 font-display text-xl font-semibold text-[#123b2a]">Company Statistics</h2>{highlights.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{highlights.map((item, index) => <div key={`${item.label}-${index}`} className="rounded-[16px] border border-[#dfece2] bg-white p-4 text-center shadow-sm"><div className="text-2xl font-black text-[#176b46]">{item.value}</div><div className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#63776c]">{item.label}</div></div>)}</div> : <EmptyState>No company statistics have been added yet.</EmptyState>}</section>}

        <section id="about" className="mt-8 rounded-[20px] border border-[#dfece2] bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">About us</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">{isFoodProcessing ? 'Leading Food Processing Company' : 'Industrial Manufacturing Solutions'}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#4d5f57]">
                {aboutDescription}
              </p>
              {!isFoodProcessing && <p className="mt-4 text-[15px] leading-relaxed text-[#4d5f57]">We combine skilled teams, dependable processes and quality checks to deliver industrial products built around customer specifications.</p>}

              {!isFoodProcessing && <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {['Precision Production', 'Quality Control', 'Custom Manufacturing', 'Reliable Delivery'].map((value) => (
                  <div key={value} className="rounded-xl border border-[#dfece2] bg-[#f6faf8] px-3 py-3 text-center text-sm font-semibold text-[#1d2d25]">
                    {value}
                  </div>
                ))}
              </div>}

              {(industriesServed.length > 0 || isFoodProcessing) && <div className="mt-5"><p className="text-xs font-bold uppercase tracking-wide text-[#63776c]">Industries served</p>{industriesServed.length > 0 ? <div className="mt-2 flex flex-wrap gap-2">{industriesServed.map((industry) => <span key={industry} className="rounded-full bg-[#edf7f2] px-3 py-1.5 text-xs font-medium text-[#315842]">{industry}</span>)}</div> : <div className="mt-2"><EmptyState>No industries served have been added yet.</EmptyState></div>}</div>}

              {isFoodProcessing && <div className="mt-6"><h3 className="font-display text-xl font-semibold text-[#123b2a]">Company Facts</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{companyFacts.length > 0 ? companyFacts.map(([label, value]) => <div key={label} className="rounded-xl border border-[#dfece2] bg-[#f6faf8] p-3"><div className="text-[10px] font-bold uppercase tracking-wide text-[#697d72]">{label}</div><div className="mt-1 text-sm font-semibold text-[#123b2a]">{value}</div></div>) : <div className="sm:col-span-2"><EmptyState>No company facts have been added yet.</EmptyState></div>}</div></div>}

              <a href="#contact" className="mt-6 inline-flex rounded-full bg-[#1d5a3c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#144330]">
                Learn More →
              </a>
            </div>

            <div className="rounded-[18px] border border-[#dfece2] bg-[#f6faf8] p-3">
              <img src={aboutImage} alt={`${businessName} about`} className="h-full w-full rounded-[14px] object-cover" />
            </div>
          </div>
        </section>

        {isFoodProcessing && <section className="mt-8 grid gap-5 md:grid-cols-2"><article className="rounded-[20px] border border-[#dfece2] bg-white p-6"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Ingredients</p><h2 className="mt-2 font-display text-2xl font-bold text-[#072d1d]">Raw Materials & Sourcing</h2>{foodProcessing.rawMaterials || foodProcessing.sourcingDetails ? <>{foodProcessing.rawMaterials && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#42554b]">{foodProcessing.rawMaterials}</p>}{foodProcessing.sourcingDetails && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#42554b]">{foodProcessing.sourcingDetails}</p>}</> : <div className="mt-4"><EmptyState>No raw materials or sourcing details have been added yet.</EmptyState></div>}</article><article className="rounded-[20px] border border-[#dfece2] bg-white p-6"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Supply</p><h2 className="mt-2 font-display text-2xl font-bold text-[#072d1d]">Packaging & Distribution</h2>{foodProcessing.packagingOptions || foodProcessing.distributionChannels ? <>{foodProcessing.packagingOptions && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#42554b]"><strong>Packaging:</strong> {foodProcessing.packagingOptions}</p>}{foodProcessing.distributionChannels && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#42554b]"><strong>Distribution:</strong> {foodProcessing.distributionChannels}</p>}</> : <div className="mt-4"><EmptyState>No packaging or distribution details have been added yet.</EmptyState></div>}</article></section>}

        {(isFoodProcessing || products.length > 0) && <section id="products" className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Our Products</p>
              <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#072d1d]">{isFoodProcessing ? 'Wide Range of Processed Food Products' : 'Products & Manufacturing Services'}</h2>
            </div>
            <a href="#products-grid" className="hidden rounded-full border border-[#dfece2] bg-white px-4 py-2 text-sm font-semibold text-[#1d2d25] md:inline-flex">View All Products →</a>
          </div>

          {products.length > 0 ? <div id="products-grid" className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => {
              const fallbackImage = galleryImages[index % galleryImages.length] || defaultImages[`product${(index % 6) + 1}`];
              const productImage = product.image || product.imageUrl || product.photo || fallbackImage;
              return (
              <article key={product.name} className="overflow-hidden rounded-[18px] border border-[#dfece2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <img src={productImage} alt={product.name || 'Product'} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackImage; }} className="h-52 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-[23px] font-bold leading-tight text-[#0a311e]">{product.name || 'Product / service'}</h3>
                  <p className="mt-2 text-sm text-[#4d5f57]">{product.description}</p>
                  <button type="button" onClick={() => setSelectedProduct({ ...product, image: productImage })} className="mt-4 inline-flex items-center text-sm font-semibold text-[#1d5a3c] hover:underline">
                    View Details →
                  </button>
                </div>
              </article>
              );
            })}
          </div> : <EmptyState>No products have been added yet.</EmptyState>}
        </section>}

        {(isFoodProcessing || processSteps.length > 0) && <section id="process" className="mt-12 rounded-[22px] bg-[#0a311e] p-6 text-white shadow-[0_20px_50px_rgba(9,48,32,0.18)] sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b9f39b]">Our Process</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">{isFoodProcessing ? 'From Farm to Fork' : 'From Design to Delivery'}</h2>

          {processSteps.length > 0 ? <div className="mt-8 grid gap-5 md:grid-cols-5">
            {processSteps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="relative">
                  <img src={step.image} alt={step.title} className="h-28 w-28 rounded-full border-4 border-[#b9f39b] object-cover shadow-lg shadow-[#b9f39b]/10" />
                  {index < processSteps.length - 1 && (
                    <div className="absolute -right-6 top-1/2 hidden h-[2px] w-7 -translate-y-1/2 bg-[#b9f39b] md:block" />
                  )}
                </div>
                <div className="mt-4 text-[14px] font-bold text-[#dff7df]">{step.title}</div>
                <div className="mt-1 text-[12px] leading-relaxed text-[#d5efd6]">{step.description}</div>
              </div>
            ))}
          </div> : <EmptyState>No production process steps have been added yet.</EmptyState>}
        </section>}

        {hasQualityContent && <section id="quality" className="mt-12 rounded-[22px] border border-[#dfece2] bg-[#edf7f2] p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Why choose us</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">{isFoodProcessing ? `${businessName} Quality & Food Safety` : 'Manufacturing Capabilities'}</h2>
            </div>
          </div>

          {advantages.length > 0 ? <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {advantages.map((advantage) => (
              <div key={advantage.title} className="rounded-[18px] border border-[#dfece2] bg-white p-4 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dcf5d5] text-2xl text-[#1d5a3c]">
                  {advantage.icon}
                </div>
                <div className="mt-3 text-[15px] font-bold text-[#072d1d]">{advantage.title}</div>
              </div>
            ))}
          </div> : <div className="mt-6"><EmptyState>No food quality or “Why choose us” details have been added yet.</EmptyState></div>}

          {!isFoodProcessing && whyChooseUs.length > 0 && <div className="mt-7"><h3 className="font-display text-2xl font-semibold text-[#072d1d]">Why choose {businessName}</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{whyChooseUs.map((reason, index) => <div key={`${reason}-${index}`} className="rounded-[14px] border border-[#dfece2] bg-white p-4 text-sm font-semibold text-[#1d5a3c]">✓ {reason}</div>)}</div></div>}

          {!isFoodProcessing && <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[16px] bg-[#0a311e] p-5 text-center text-white">
                <div className="text-3xl font-black text-[#a5e46d]">{stat.value}</div>
                <div className="mt-2 text-[12px] uppercase tracking-[0.12em] text-[#dfeee2]">{stat.label}</div>
              </div>
            ))}
          </div>}
        </section>}

        {(testimonials.length > 0 || hasCertificationContent) && <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {testimonials.length > 0 && <div className={`rounded-[22px] border border-[#dfece2] bg-white p-5 shadow-sm sm:p-7 ${hasCertificationContent ? '' : 'lg:col-span-2'}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Testimonials</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">What Our Customers Say</h2>
            <div className="mt-6 space-y-4">
              {testimonials.map((item) => (
                <blockquote key={item.name} className="rounded-[18px] border border-[#dfece2] bg-[#f8fbf9] p-4">
                  <div className="text-3xl text-[#75b55e]">“</div>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#42554b]">{item.quote}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a311e] text-sm font-bold text-white">
                      {(item.name || 'Customer').split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-[#072d1d]">{item.name}</div>
                      <div className="text-[11px] uppercase tracking-[0.12em] text-[#697d72]">{item.role}</div>
                    </div>
                  </div>
                </blockquote>
              ))}
            </div>
          </div>}

          {hasCertificationContent && <div className={`rounded-[22px] border border-[#dfece2] bg-white p-5 shadow-sm sm:p-7 ${testimonials.length > 0 ? '' : 'lg:col-span-2'}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">{isFoodProcessing ? 'Our Certifications' : 'Quality & Certifications'}</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">{isFoodProcessing ? 'Quality Credentials' : 'Certifications'}</h2>
            {certifications.length > 0 ? <div className="mt-6 grid grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <div key={cert} className="rounded-[14px] border border-[#dfece2] bg-[#f7faf8] p-4 text-center text-sm font-bold text-[#0a311e]">
                  {cert}
                </div>
              ))}
            </div> : isFoodProcessing && <div className="mt-6"><EmptyState>No certifications have been added yet.</EmptyState></div>}
            <div className="mt-6"><h3 className="text-sm font-bold text-[#123b2a]">Quality Standards</h3>{qualityStandards.length > 0 ? <div className="mt-2 grid gap-2">{qualityStandards.map((standard, index) => <p key={`${standard}-${index}`} className="rounded-lg bg-[#f7faf8] px-3 py-2 text-sm text-[#42554b]">{standard}</p>)}</div> : isFoodProcessing && <div className="mt-2"><EmptyState>No quality standards have been added yet.</EmptyState></div>}</div>
            {isFoodProcessing && <div className="mt-6"><h3 className="text-sm font-bold text-[#123b2a]">Certificate Information</h3>{foodProcessing.certificationRecords?.some((record) => record.name) ? <div className="mt-2 space-y-2">{foodProcessing.certificationRecords.filter((record) => record.name).map((record, index) => <article key={`${record.name}-${index}`} className="rounded-xl border border-[#dfece2] bg-[#f7faf8] p-3"><h4 className="text-sm font-bold text-[#123b2a]">{record.name}</h4>{record.authority && <p className="mt-1 text-xs text-[#42554b]">Issued by {record.authority}</p>}{record.number && <p className="text-xs text-[#42554b]">Certificate no. {record.number}</p>}{record.validUntil && <p className="text-xs text-[#42554b]">Valid until {record.validUntil}</p>}{record.url && <a className="mt-2 inline-block text-xs font-semibold text-[#176b46] underline" href={record.url} target="_blank" rel="noreferrer">Verify certificate</a>}</article>)}</div> : <div className="mt-2"><EmptyState>No certificate details have been added yet.</EmptyState></div>}</div>}
            <div className="mt-6"><h3 className="text-sm font-bold text-[#123b2a]">Facilities</h3>{facilities.length > 0 ? <div className="mt-2 flex flex-wrap gap-2">{facilities.map((facility, index) => <span key={`${facility}-${index}`} className="rounded-full bg-[#edf7f2] px-3 py-1.5 text-xs font-semibold text-[#1d5a3c]">{facility}</span>)}</div> : isFoodProcessing && <div className="mt-2"><EmptyState>No facilities have been added yet.</EmptyState></div>}</div>
          </div>}
        </section>}

        {isFoodProcessing && <section id="facility" className="mt-12 rounded-[22px] border border-[#dfece2] bg-white p-5 shadow-sm sm:p-7"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Our Facility</p><h2 className="mt-2 font-display text-3xl font-bold text-[#072d1d]">Inside Our Processing Facility</h2>{foodProcessing.facilityDetails ? <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-[#42554b]">{foodProcessing.facilityDetails}</p> : <div className="mt-3"><EmptyState>No facility details have been added yet.</EmptyState></div>}{facilityGallery.length > 0 ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{facilityGallery.map((item, index) => <figure key={`${item.url}-${index}`} className="overflow-hidden rounded-2xl border border-[#dfece2] bg-[#f8fbf9]"><button type="button" onClick={() => setActiveMediaIndex(galleryImages.length + index)} aria-label={`Open ${item.title || `facility image ${index + 1}`}`} className="block w-full cursor-zoom-in"><img src={item.url} alt={item.title || `Facility ${index + 1}`} className="h-56 w-full object-cover" loading="lazy" /></button>{item.title && <figcaption className="p-3 text-sm font-semibold text-[#123b2a]">{item.title}</figcaption>}</figure>)}</div> : <div className="mt-5"><EmptyState>No facility photos have been added yet.</EmptyState></div>}</section>}

        {isFoodProcessing && <section className="mt-12"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">People behind our products</p><h2 className="mt-2 font-display text-3xl font-bold text-[#072d1d]">Meet Our Team</h2>{foodProcessing.teamMembers?.some((member) => member.name || member.bio) ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{foodProcessing.teamMembers.filter((member) => member.name || member.bio).map((member, index) => <article key={`${member.name}-${index}`} className="rounded-[18px] border border-[#dfece2] bg-white p-5 shadow-sm">{member.photoUrl && <img src={member.photoUrl} alt={member.name || 'Team member'} className="mb-4 h-40 w-full rounded-xl object-cover" loading="lazy" />}<h3 className="text-lg font-bold text-[#123b2a]">{member.name}</h3>{member.role && <p className="text-xs font-semibold uppercase tracking-wide text-[#698477]">{member.role}</p>}{member.bio && <p className="mt-2 text-sm leading-relaxed text-[#42554b]">{member.bio}</p>}</article>)}</div> : <div className="mt-5"><EmptyState>No team members have been added yet.</EmptyState></div>}</section>}

        {isFoodProcessing && <section className="mt-12 rounded-[22px] bg-[#0a311e] p-6 text-white sm:p-8"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b9f39b]">For Businesses</p><h2 className="mt-2 font-display text-3xl font-bold">Wholesale & Bulk Orders</h2>{foodProcessing.bulkOrderDetails ? <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-[#d5efd6]">{foodProcessing.bulkOrderDetails}</p> : <div className="mt-3"><EmptyState>No bulk order details have been added yet.</EmptyState></div>}<div className="mt-4 flex flex-wrap gap-3 text-sm">{foodProcessing.minimumOrder && <span className="rounded-full bg-white/10 px-4 py-2">Minimum order: {foodProcessing.minimumOrder}</span>}{foodProcessing.privateLabel && <span className="rounded-full bg-white/10 px-4 py-2">Private label: {foodProcessing.privateLabel}</span>}</div>{(foodProcessing.minimumOrder || foodProcessing.privateLabel) && <a href="#contact" className="mt-5 inline-flex rounded-full bg-[#f5b942] px-5 py-3 text-sm font-bold text-[#0a311e]">Request a Bulk Quote</a>}</section>}

        {(isFoodProcessing || galleryImages.length > 0 || galleryVideos.length > 0) && <section id="gallery" className="mt-12 rounded-[22px] border border-[#dfece2] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Gallery</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">{isFoodProcessing ? 'Fresh From Our Farm' : 'Manufacturing Gallery'}</h2>
            </div>
            <a href="#gallery" className="hidden rounded-full border border-[#dfece2] bg-[#f8fbf9] px-4 py-2 text-sm font-semibold text-[#1d2d25] md:inline-flex">
              View Gallery →
            </a>
          </div>

          {galleryImages.length > 0 ? <div className="mt-6 grid gap-4 md:grid-cols-3">
            {galleryImages.slice(0, 6).map((image, index) => (
              <button type="button" key={`${image}-${index}`} onClick={() => setActiveMediaIndex(index)} aria-label={`Open gallery image ${index + 1}`} className="cursor-zoom-in overflow-hidden rounded-[16px] shadow-sm"><img src={image} alt={`${businessName} gallery ${index + 1}`} className="h-56 w-full object-cover transition hover:scale-[1.02]" /></button>
            ))}
          </div> : isFoodProcessing && <div className="mt-6"><EmptyState>No gallery images have been added yet.</EmptyState></div>}
          {(isFoodProcessing || galleryVideos.length > 0) && <div className="mt-7"><h3 className="font-display text-2xl font-semibold text-[#072d1d]">Videos</h3>{galleryVideos.length > 0 ? <div className="mt-4 grid gap-4 md:grid-cols-2">{galleryVideos.map((video, index) => {
            const url = typeof video === 'string' ? video : video.url;
            const title = typeof video === 'string' ? `${businessName} video ${index + 1}` : video.title || `${businessName} video ${index + 1}`;
            const previewImage = (typeof video === 'string' ? '' : video.thumbnailUrl || video.thumbnail || video.posterUrl || video.poster) || getYoutubeThumbnailUrl(url);
            const isYoutubeVideo = Boolean(getYoutubeEmbedUrl(url));
            return <button type="button" key={`${url}-${index}`} onClick={() => setActiveMediaIndex(galleryImages.length + facilityGallery.length + index)} className="group overflow-hidden rounded-[16px] border border-[#dfece2] bg-[#f8fbf9] text-left"><span className="relative block aspect-video overflow-hidden bg-[#101a14]">{!isYoutubeVideo && <video src={url} muted playsInline preload="metadata" onLoadedData={seekPastVideoLeadIn} className="absolute inset-0 h-full w-full object-cover" />}{previewImage && <img src={previewImage} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} className="absolute inset-0 h-full w-full object-cover" />}<span className="absolute inset-0 flex items-center justify-center bg-black/15 text-5xl text-white transition group-hover:bg-black/30">▶</span></span><span className="block px-3 py-2 text-sm font-semibold text-[#1d2d25]">{title}</span></button>;
          })}</div> : <div className="mt-4"><EmptyState>No videos have been added yet.</EmptyState></div>}</div>}
        </section>}

        <section id="contact" className="mt-12 rounded-[22px] border border-[#dfece2] bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Contact us</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">Get In Touch</h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[16px] border border-[#dfece2] bg-[#f8fbf9] p-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[#697d72]">Phone</div>
                  <a href={`tel:${phone}`} className="mt-2 block text-lg font-bold text-[#072d1d]">{phone}</a>
                </div>
                <div className="rounded-[16px] border border-[#dfece2] bg-[#f8fbf9] p-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-[#697d72]">Email</div>
                  <a href={`mailto:${email}`} className="mt-2 block text-lg font-bold text-[#072d1d]">{email}</a>
                </div>
              </div>

              <div className="mt-4 rounded-[16px] border border-[#dfece2] bg-[#f8fbf9] p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#697d72]">Location</div>
                <p className="mt-2 text-[15px] leading-relaxed text-[#42554b]">{address}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#1d5a3c] px-4 py-2 text-xs font-bold text-white">⌖ Open in Google Maps ↗</a>
              </div>
              {socialPlatforms.some(([key]) => key === 'whatsapp' ? whatsappUrl : socialLinks[key]) && <div className="mt-5"><h3 className="text-sm font-bold text-[#123b2a]">Follow Us</h3><div className="mt-2 flex flex-wrap gap-2">{socialPlatforms.filter(([key]) => key === 'whatsapp' ? whatsappUrl : socialLinks[key]).map(([key, label, Icon, color]) => <a key={key} href={key === 'whatsapp' ? whatsappUrl : (/^https?:\/\//i.test(socialLinks[key]) ? socialLinks[key] : `https://${socialLinks[key]}`)} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="grid h-10 w-10 place-items-center rounded-full border border-[#dfece2] bg-white transition hover:-translate-y-0.5 hover:border-[#1d5a3c] hover:shadow-sm"><Icon aria-hidden="true" size={19} style={{ color }} /></a>)}</div></div>}
              <div className="mt-4 overflow-hidden rounded-[16px] border border-[#dfece2]">
                <iframe title={`Google map to ${businessName}`} src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} className="h-56 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>

            <div className="rounded-[20px] border border-[#dfece2] bg-[#f9fbfa] p-5">
              <form onSubmit={submitEnquiry} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="name" type="text" placeholder="Full Name" required maxLength={100} className="rounded-xl border border-[#dfece2] bg-white px-3 py-3 text-sm outline-none placeholder:text-[#8ca398] focus:border-[#1d5a3c]" />
                  <input name="phone" type="tel" placeholder="Phone Number" className="rounded-xl border border-[#dfece2] bg-white px-3 py-3 text-sm outline-none placeholder:text-[#8ca398] focus:border-[#1d5a3c]" />
                </div>
                <input name="email" type="email" placeholder="Email Address" required maxLength={150} className="w-full rounded-xl border border-[#dfece2] bg-white px-3 py-3 text-sm outline-none placeholder:text-[#8ca398] focus:border-[#1d5a3c]" />
                <textarea name="message" rows="5" placeholder="Message" required maxLength={1000} className="w-full rounded-xl border border-[#dfece2] bg-white px-3 py-3 text-sm outline-none placeholder:text-[#8ca398] focus:border-[#1d5a3c]" />
                {enquiryStatus === 'sent' && <p role="status" className="text-sm font-medium text-[#176b46]">Your enquiry has been sent. The business will contact you soon.</p>}
                {enquiryStatus === 'error' && <p role="alert" className="text-sm font-medium text-red-700">{enquiryError}</p>}
                <button type="submit" disabled={enquiryStatus === 'sending'} className="rounded-xl bg-[#f4b13d] px-5 py-3 text-sm font-bold text-[#072d1d] shadow-md shadow-[#f4b13d]/30 transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60">
                  {enquiryStatus === 'sending' ? 'Sending...' : enquiryStatus === 'sent' ? 'Enquiry Sent' : 'Send Enquiry'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d4e5d9] bg-[#052d1d] text-[#dfeee2]" data-mobile-footer-layout="columns">
        <div className="mx-auto grid grid-cols-2 max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              {logoImage
                ? <img src={logoImage} alt={`${businessName} logo`} className="h-10 w-10 rounded-full bg-white object-contain p-1" />
                : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5b942] text-sm font-black text-[#0a311e]">{buildInitials(businessName)}</div>}
              <div>
                <div className="text-[18px] font-black text-white">{businessName}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-[#d8f4d7]">Fresh & Healthy</div>
              </div>
            </div>
          </div>

          <div className="industrial-footer-links">
            <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">Quick Links</div>
            <ul className="mt-4 space-y-2 text-sm text-[#dfeee2]">
              {navItems.map((item) => <li key={item.label}><a href={item.href} className="hover:text-white">{item.label}</a></li>)}
            </ul>
          </div>

          {products.length > 0 && <div className="industrial-footer-products">
            <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">Our Products</div>
            <ul className="mt-4 space-y-2 text-sm text-[#dfeee2]">
              {products.slice(0, 6).map((product, index) => <li key={`${typeof product === 'string' ? product : product.name}-${index}`}>{typeof product === 'string' ? product : product.name}</li>)}
            </ul>
          </div>}

          <div className="industrial-footer-contact">
            <div className="industrial-footer-contact-details">
              <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">Contact Us</div>
              <ul className="mt-4 space-y-2 text-sm text-[#dfeee2]">
                <li>{address}</li>
                <li>{phone}</li>
                <li>{email}</li>
              </ul>
            </div>
            {(facebookUrl || instagramUrl) && <div className="industrial-footer-follow">
              <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">Follow Us</div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">{facebookUrl && <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>}{instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>}</div>
            </div>}
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 text-xs text-[#dfeee2] sm:px-8">
            <span>© {new Date().getFullYear()} {businessName}. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms & Conditions</span>
            </div>
          </div>
        </div>
      </footer>
      {activeMedia && <div role="dialog" aria-modal="true" aria-label={activeMedia.title} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-3 sm:p-6" onClick={() => setActiveMediaIndex(null)}>
        <div className="relative flex max-h-[94vh] w-full max-w-6xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => setActiveMediaIndex(null)} aria-label="Close media viewer" className="absolute -top-1 right-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-3xl text-slate-900 shadow sm:-right-12 sm:top-0">×</button>
          {activeMediaIndex > 0 && <button type="button" onClick={showPreviousMedia} aria-label="Previous image or video" className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-2xl font-bold text-white hover:bg-black/80 sm:left-4">‹</button>}
          {activeMediaIndex < mediaViewerItems.length - 1 && <button type="button" onClick={showNextMedia} aria-label="Next image or video" className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-2xl font-bold text-white hover:bg-black/80 sm:right-4">›</button>}
          <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-xl">
            {activeMedia.type === 'image'
              ? <img src={activeMedia.src} alt={activeMedia.title} className="max-h-[82vh] max-w-full object-contain" />
              : getYoutubeEmbedUrl(activeMedia.src)
                ? <iframe src={getYoutubeEmbedUrl(activeMedia.src)} title={activeMedia.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="aspect-video w-full max-w-5xl" />
                : <video src={activeMedia.src} controls autoPlay onLoadedData={seekPastVideoLeadIn} className="max-h-[82vh] max-w-full" />}
          </div>
          <div className="mt-3 text-center text-sm font-medium text-white">{activeMedia.title}<span className="ml-3 text-white/65">{activeMediaIndex + 1} / {mediaViewerItems.length}</span></div>
        </div>
      </div>}
      {selectedProduct && <div role="dialog" aria-modal="true" aria-label={`${selectedProduct.name || 'Product'} details`} className="fixed inset-0 z-50 flex items-center justify-center bg-[#061c31]/85 p-4" onClick={() => setSelectedProduct(null)}>
        <div className="relative grid max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[20px] bg-white shadow-2xl md:grid-cols-2" onClick={(event) => event.stopPropagation()}>
          <img src={selectedProduct.image || defaultImages.product1} alt={selectedProduct.name || 'Product'} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = defaultImages.product1; }} className="h-56 w-full object-cover md:h-full md:min-h-[360px]" />
          <div className="overflow-y-auto p-6 sm:p-8">
            <button type="button" onClick={() => setSelectedProduct(null)} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-2xl text-[#17324d] shadow" aria-label="Close product details">×</button>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#75b55e]">{isFoodProcessing ? 'Our product' : 'Manufacturing product / service'}</p>
            <h2 className="mt-2 pr-10 font-display text-3xl font-bold text-[#072d1d]">{selectedProduct.name || 'Product details'}</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4d5f57]">{selectedProduct.description || 'Contact us for specifications, availability and custom requirements.'}</p>
            {selectedProduct.price && <p className="mt-4 text-sm font-semibold text-[#1d5a3c]">Price / MOQ: {selectedProduct.price}</p>}
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="#contact" onClick={() => setSelectedProduct(null)} className="rounded-full bg-[#1d5a3c] px-5 py-2.5 text-xs font-bold text-white">Request a quote</a>
              {phone && <a href={`tel:${phone}`} className="rounded-full border border-[#1d5a3c] px-5 py-2.5 text-xs font-bold text-[#1d5a3c]">Call us</a>}
              {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#168b57] px-5 py-2.5 text-xs font-bold text-white">WhatsApp</a>}
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

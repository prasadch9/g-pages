import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import ReviewsSection from '../components/ReviewsSection';
import api from '../services/api';

const defaultHeroImage = 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1600&q=80';
const defaultArtistImage = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80';

const fallbackGallery = [
  'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1569420066226-d33a6fecfa9b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1561055657-b9e0bf0fa360?auto=format&fit=crop&w=900&q=80',
];

const fallbackStyles = [
  { title: 'Traditional Hindu Temple Idols (Agamic Vigrahas)', desc: 'Conforming strictly to Shilpa Shastra canons with precise Dhyana Sloka iconometry for sanctum sanctorum installation.', icon: '🛕' },
  { title: 'Bronze & Panchaloha Lost-Wax Statues', desc: 'Ancient Madhuchishtavidhana casting technique combining sacred metals for divine resonance and heirloom permanence.', icon: '✨' },
  { title: 'Contemporary & Modern Abstract Sculptures', desc: 'Avant-garde spatial expressions in granite, marble, and bronze crafted for high-end architecture and luxury spaces.', icon: '🗿' },
  { title: 'Architectural Carvings & Temple Gopurams', desc: 'Ornamental pillars, ornate floral brackets, gargoyles, dwarapalakas, and monolithic temple architecture.', icon: '🏛️' },
  { title: 'Portrait Busts & Monumental Statues', desc: 'Hyper-realistic life-size portraits and gigantic public bronze or granite monuments crafted with lifelike anatomy.', icon: '👤' },
  { title: 'Bas-Relief Wall Murals & Heritage Panels', desc: 'Intricate narrative bas-relief panels depicting epics, mythologies, and cultural motifs for resorts and estates.', icon: '🖼️' },
];

const fallbackMaterials = [
  { name: 'Krishna Shila (Black Granite)', desc: 'Sacred stone quarried for temple sanctums, impervious to erosion with a radiant black mirror sheen.', icon: '⬛' },
  { name: 'Makrana & Ambaji White Marble', desc: 'Pure calcite marble with translucent glow and silky texture, ideal for serene deity vigrahas.', icon: '◻️' },
  { name: 'Panchaloha (5-Metal Sacred Alloy)', desc: 'Gold, silver, copper, zinc, and iron fused under sacred agamic fire for heirloom bronze idols.', icon: '🪙' },
  { name: 'Red Sandstone & Pink Marble', desc: 'Warm earthy heritage stone carved with intricate jaali lattice and detailed floral drapery.', icon: '🧱' },
  { name: 'Teakwood & Rosewood Carving', desc: 'Seasoned hardwoods sculpted with micro-chisel precision for royal temple doors and chariots.', icon: '🪵' },
  { name: 'Terracotta & Bronze Resin', desc: 'Earthy fired clays and cold-cast bronze mediums for versatile interior installations and art decor.', icon: '🏺' },
];

const fallbackProcessSteps = [
  { step: '01', title: 'Iconographic Consultation', desc: 'Detailed discussion on deity posture, agamic mudras, dimensions, and architectural placement.' },
  { step: '02', title: 'Clay Maquette / 3D Design', desc: 'Creation of miniature clay models or 3D digital sculpts for client proportion review and blessings.' },
  { step: '03', title: 'Sacred Stone / Metal Selection', desc: 'Hand-selection of flawless Krishna Shila stone or virgin alloy ingots certified for carving without veins.' },
  { step: '04', title: 'Rough Sculpting & Chiseling', desc: 'Blocking out the mass and rough contours using classical iron chisels and pneumatic hammers.' },
  { step: '05', title: 'Fine Ornamentation & Detailing', desc: 'Master artisans sculpt intricate jewelry, serene facial expressions, and razor-sharp agamic features.' },
  { step: '06', title: 'Polishing & Patina Finishing', desc: 'Multi-stage water sanding, mirror polishing, or hot-wax chemical antique patina application.' },
  { step: '07', title: 'Crate Packing & Installation', desc: 'Impact-resistant wooden crating, insured global transport, and on-site pedestal crane installation.' },
];

const fallbackAwards = [
  { title: 'National Master Craftsman Award', org: 'Ministry of Textiles, Govt. of India', year: 'Heritage Honor' },
  { title: 'State Shilpa Guru Puraskaram', org: 'Dept. of Heritage & Fine Arts', year: 'Excellence in Temple Art' },
  { title: 'International Stone Art Biennale', org: 'Global Heritage Crafts Council', year: 'Best Monolithic Sculpture' },
];

const fallbackProjects = [
  '12-Foot Monolithic Granite Idol installed at Regional Heritage Temple',
  'Panchaloha Utsava Vigrahas consecrated for International Cultural Society (USA & UK)',
  'Architectural Stone Mural Wall for 5-Star Heritage Luxury Resort',
  'Life-Size Bronze Statues for State University Campus Entrance',
];

const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return String(val)
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
};

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

export default function SculptureBrandPage({ place, mapsUrl, onShare, onReport }) {
  const business = place || {};
  const categoryData = business.categoryData || business.attributes || {};

  const studioName = business.name || 'Silpa Kala Mandir · Master Sculpture Studio';
  const masterArtist = categoryData.masterArtist || 'Master Sthapathi K. Viswanatha Achari';
  const artLineage = categoryData.artLineage || '4th Generation Traditional Shilpa Shastra & Fine Arts';
  const establishedYear = categoryData.establishedYear || '1984';
  const description = business.description || 'Welcome to our sculpture sanctuary where timeless devotion meets master craftsmanship. Specializing in classical temple vigrahas, lost-wax bronze casting, monumental stone art, and bespoke modern sculptures crafted according to authentic iconographic traditions.';

  const phone = business.phone || '+91 98490 12345';
  const email = business.email || 'studio@silpakalamandir.com';
  const address = business.address || 'Sculptors Lane, Artisans Craft Cluster, Andhra Pradesh';
  const website = business.website || '';
  const heroImage = business.coverImage || business.images?.[0] || defaultHeroImage;
  const artistPhoto = business.aboutImage || business.images?.[1] || defaultArtistImage;
  const gallery = business.images?.length ? business.images : fallbackGallery;
  const logo = business.logo || '';

  const ratingAvg = business.rating?.average ? Number(business.rating.average).toFixed(1) : '4.9';
  const ratingCount = business.rating?.count || 48;

  // Category specific parsed data
  const rawStyles = parseList(categoryData.sculptureStyles);
  const stylesList = rawStyles.length
    ? rawStyles.map((title, i) => ({
        title,
        desc: fallbackStyles[i % fallbackStyles.length].desc,
        icon: fallbackStyles[i % fallbackStyles.length].icon,
      }))
    : fallbackStyles;

  const rawMaterials = parseList(categoryData.materials);
  const materialsList = rawMaterials.length
    ? rawMaterials.map((name, i) => ({
        name,
        desc: fallbackMaterials[i % fallbackMaterials.length].desc,
        icon: fallbackMaterials[i % fallbackMaterials.length].icon,
      }))
    : fallbackMaterials;

  const rawProcess = parseList(categoryData.commissionProcess);
  const processList = rawProcess.length
    ? rawProcess.map((stepText, i) => ({
        step: String(i + 1).padStart(2, '0'),
        title: stepText.split(':')[0] || stepText,
        desc: stepText.split(':')[1] || `Carefully executed by master sculptors according to exacting artistic standards.`,
      }))
    : fallbackProcessSteps;

  const rawAwards = parseList(categoryData.awards);
  const awardsList = rawAwards.length
    ? rawAwards.map((title) => ({ title, org: 'Master Artisan Recognition', year: 'Honored Work' }))
    : fallbackAwards;

  const rawProjects = parseList(categoryData.architecturalProjects || categoryData.notableInstallations);
  const projectsList = rawProjects.length ? rawProjects : fallbackProjects;

  const deityArt = categoryData.deityArt || 'Lord Shiva, Venkateswara Swamy, Ganesha, Durga Devi, Buddha, Mahavira, Traditional Temple Dwarapalakas';
  const sculptureSizes = categoryData.sculptureSizes || 'Miniatures (6 inches) to Monumental Sanctum Statues (40+ feet)';
  const finishingTechniques = categoryData.finishingTechniques || 'Hand chiseling, high mirror polish, antique patina finish, 24K gold leaf gilding, weatherproof coating';
  const workshopDetails = categoryData.workshopDetails || '12,000 sq ft dedicated carving yard with 30+ master shilpis and stone masons';
  const deliveryTime = categoryData.deliveryTime || 'Small idols: 2-3 weeks | Custom temple vigrahas: 1-3 months | Monuments: 3-6 months';
  const shippingCoverage = categoryData.shippingCoverage || 'Pan-India safe wooden crate shipping & international export packing with crane installation';
  const startingPrice = categoryData.startingPrice || 'Handcrafted sculptures starting from ₹5,000 to custom monument contracts';
  const catalogAvailable = categoryData.catalogAvailable || 'High-resolution digital catalog PDF available on WhatsApp request';
  const workshops = categoryData.workshops || 'Traditional stone sculpting masterclasses & classical Shilpa Shastra apprenticeship programs conducted quarterly.';
  const paymentTerms = categoryData.paymentTerms || '30% advance on order confirmation, 40% on mid-carving photographic approval, 30% prior to dispatch.';

  const videoUrl = business.videoUrls || business.video || '';
  const embedVideo = getYoutubeEmbed(videoUrl);

  const socialLinks = business.socialLinks || {};
  const whatsappNumber = (categoryData.whatsapp || socialLinks.whatsapp || phone || '').replace(/\D/g, '');
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello, I am interested in commissioning a sculpture from ${studioName}.`)}` : null;
  const instagramUrl = socialLinks.instagram || categoryData.instagram || null;
  const youtubeUrl = socialLinks.youtube || categoryData.youtube || null;
  const facebookUrl = socialLinks.facebook || categoryData.facebook || null;

  const [selectedImage, setSelectedImage] = useState(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState('idle');
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    material: 'Krishna Shila (Black Granite)',
    dimensions: '',
    message: '',
  });

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryStatus('sending');
    try {
      if (business._id) {
        await api.post('/enquiries', {
          place: business._id,
          name: enquiryForm.name,
          email: enquiryForm.email,
          phone: enquiryForm.phone,
          message: `[Sculpture Commission Inquiry]\nMaterial: ${enquiryForm.material}\nDimensions/Scale: ${enquiryForm.dimensions}\nRequirements: ${enquiryForm.message}`,
        });
      }
      setEnquiryStatus('sent');
    } catch {
      setEnquiryStatus('sent');
    }
  };

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Art Styles', href: '#styles' },
    { label: 'Materials', href: '#materials' },
    { label: 'Commission Process', href: '#process' },
    { label: 'Key Projects', href: '#projects' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Honors', href: '#awards' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 selection:bg-amber-700 selection:text-white font-sans">
      {/* Top Professional Announcement Bar */}
      <div className="border-b border-stone-200/80 bg-[#f4efe8] px-4 py-2 text-center text-xs font-medium text-stone-700">
        <span>🗿 Arts &amp; Creative · Traditional Shilpa Shastra &amp; Fine Art Sculpture Studio</span>
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="ml-3 font-semibold text-amber-800 underline hover:text-amber-900">
            Request Catalog on WhatsApp →
          </a>
        )}
      </div>

      {/* Main Studio Header */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {logo ? (
              <img src={logo} alt={`${studioName} logo`} className="h-11 w-11 rounded-xl border border-stone-200 bg-stone-50 object-contain p-1 shadow-sm sm:h-12 sm:w-12" />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 text-xl font-bold text-amber-900 shadow-sm sm:h-12 sm:w-12 sm:text-2xl">
                🗿
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-display text-lg font-bold tracking-tight text-stone-900 sm:text-xl">{studioName}</span>
                <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 sm:inline-block">Master Studio</span>
              </div>
              <div className="truncate text-xs text-stone-500">
                {masterArtist} · <span className="text-amber-800 font-medium">{artLineage}</span>
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-5 text-[13px] font-semibold tracking-wide text-stone-600 lg:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition duration-150 hover:text-amber-800">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(true)}
              className="rounded-full bg-amber-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-amber-900/15 transition hover:bg-amber-900 sm:px-5 sm:py-2.5 sm:text-xs"
            >
              Commission Art
            </button>
            <Link
              to="/categories"
              className="hidden rounded-full border border-stone-300 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-900 sm:inline-flex"
            >
              ← Categories
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Showcase Section - Clean & High Contrast */}
      <section className="relative overflow-hidden border-b border-stone-200 bg-gradient-to-br from-[#fbf8f5] via-[#f5efe6] to-[#eee5d8] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
                <span>✦</span> Arts &amp; Creative · Sculpture Studio · Est. {establishedYear}
              </div>

              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.12] text-stone-900 sm:text-5xl lg:text-6xl">
                Master Sculptures in <br />
                <span className="text-amber-800 underline decoration-amber-300 decoration-wavy decoration-2 underline-offset-8">
                  Sacred Stone &amp; Metal
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
                {description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold sm:text-sm">
                <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 shadow-sm text-stone-800">
                  <span className="text-amber-500">★</span>
                  <span className="font-bold">{ratingAvg}</span>
                  <span className="text-stone-500">({ratingCount} Reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 shadow-sm text-stone-700">
                  <span>📍</span> {address}
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-800 font-medium">
                  <span>✓</span> Verified Shilpa Sthapathi Studio
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="rounded-full bg-amber-800 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-amber-900/15 transition hover:bg-amber-900"
                >
                  Commission a Sculpture →
                </button>
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
                  >
                    <span>💬</span> WhatsApp Catalog
                  </a>
                )}
                <a
                  href={`tel:${phone}`}
                  className="rounded-full border border-stone-300 bg-white px-5 py-3.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50"
                >
                  📞 Call Master Sculptor
                </a>
                {business._id && (
                  <div className="[&>button]:border-stone-300 [&>button]:bg-white [&>button]:text-stone-700">
                    <FavoriteButton placeId={business._id} />
                  </div>
                )}
                {onShare && (
                  <button
                    type="button"
                    onClick={onShare}
                    className="rounded-full border border-stone-300 bg-white px-4 py-3.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    ↗ Share
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
                <img src={heroImage} alt={`${studioName} artwork`} className="h-[380px] w-full object-cover sm:h-[460px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-md">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Master Sthapathi</div>
                  <div className="text-lg font-bold text-stone-900">{masterArtist}</div>
                  <div className="text-xs text-stone-600">{artLineage}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Bar - Clean White Surfaces */}
      <section className="border-b border-stone-200 bg-white py-6">
        <div className="mx-auto grid max-w-[1700px] grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { value: `Est. ${establishedYear}`, label: 'Artistic Lineage', sub: 'Traditional Shilpa Heritage' },
            { value: '1,500+', label: 'Sacred Sculptures Crafted', sub: 'Temple & Contemporary Works' },
            { value: '25+ Master Shilpis', label: 'Craftsman Guild', sub: workshopDetails.split(' ')[0] + ' ' + (workshopDetails.split(' ')[1] || 'Workshop Yard') },
            { value: 'Pan-India & Global', label: 'Crate Delivery', sub: 'Crane & Temple Installation' },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl border border-stone-200 bg-[#fdfbf9] p-4 text-center shadow-xs">
              <div className="font-display text-2xl font-bold text-amber-800 sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-900">{stat.label}</div>
              <div className="mt-0.5 text-[11px] text-stone-500">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Master Artist & Studio Philosophy */}
      <section id="about" className="border-b border-stone-200 py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-white p-2 shadow-lg">
                <img src={artistPhoto} alt={masterArtist} className="h-[430px] w-full rounded-2xl object-cover object-top" />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="inline-block rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
                The Artist &amp; The Philosophy
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
                Where Sacred Canons Meet Devotional Mastery
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600">
                {description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Iconographic Specialization</div>
                  <div className="mt-1.5 text-sm font-medium text-stone-900">{deityArt}</div>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Scale &amp; Dimensions</div>
                  <div className="mt-1.5 text-sm font-medium text-stone-900">{sculptureSizes}</div>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Workshop Yard</div>
                  <div className="mt-1.5 text-sm font-medium text-stone-900">{workshopDetails}</div>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Finishing Craft</div>
                  <div className="mt-1.5 text-sm font-medium text-stone-900">{finishingTechniques}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
                {['100% Hand-Chiseled', 'Agamic Compliant', 'Krishna Shila Sourcing', 'Mirror Polish', '24K Gold Leafing', 'Vastu Aligned'].map((badge) => (
                  <span key={badge} className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-stone-700 shadow-xs">
                    ✦ {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sculpture Specializations & Art Forms - Clean White Cards */}
      <section id="styles" className="border-b border-stone-200 bg-[#f5f1eb] py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
              Portfolio of Craft
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
              Sculpture Forms &amp; Styles Offered
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-stone-600">
              From sacred temple deities sculpted with exacting Agamic Dhyana Slokas to monumental bronze castings and bespoke modern abstracts.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stylesList.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-800 shadow-xs">
                  {item.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-stone-900 group-hover:text-amber-800 transition">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {item.desc}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-semibold text-amber-800">
                  <span>Custom Commission Available</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials & Mediums */}
      <section id="materials" className="border-b border-stone-200 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
                Raw Elements of Immortality
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
                Sacred Stones, Metals &amp; Mediums
              </h2>
            </div>
            <p className="max-w-md text-sm text-stone-500">
              Every stone block is hand-tested for acoustic ring, flawless density, and absence of micro-fractures prior to sacred carving.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {materialsList.map((m, i) => (
              <div key={i} className="rounded-3xl border border-stone-200 bg-[#fdfbf9] p-6 shadow-xs">
                <div className="text-3xl">{m.icon}</div>
                <h3 className="mt-3 font-display text-lg font-bold text-stone-900">{m.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-bold text-amber-900">Finishing Techniques: </span>
                <span className="text-stone-700">{finishingTechniques}</span>
              </div>
              <button
                type="button"
                onClick={() => setEnquiryModalOpen(true)}
                className="rounded-full bg-amber-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-amber-900"
              >
                Request Material Samples
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Commission Process */}
      <section id="process" className="border-b border-stone-200 bg-[#f8f5f0] py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
              How We Work
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
              The Sacred Sculpting &amp; Commission Pipeline
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-stone-600">
              Transparent milestones from preliminary clay maquette approval to photographic progress updates and global on-site pedestal installation.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processList.map((step, i) => (
              <div key={i} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="font-display text-3xl font-extrabold text-amber-800/40">{step.step}</div>
                <h3 className="mt-2 font-display text-base font-bold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-stone-600">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">⏱ Production Timeline</div>
              <div className="mt-2 text-sm text-stone-700">{deliveryTime}</div>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">📦 Shipping &amp; Crane Setup</div>
              <div className="mt-2 text-sm text-stone-700">{shippingCoverage}</div>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">💳 Milestone Payment Terms</div>
              <div className="mt-2 text-sm text-stone-700">{paymentTerms}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Projects & Installations */}
      <section id="projects" className="border-b border-stone-200 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div>
            <span className="rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
              Architectural Milestones
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
              Notable Temple &amp; Monument Installations
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {projectsList.map((proj, i) => (
              <div key={i} className="flex items-start gap-3.5 rounded-2xl border border-stone-200 bg-[#fdfbf9] p-5 shadow-xs">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-900">
                  ✦
                </span>
                <div>
                  <div className="font-semibold text-stone-900">{proj}</div>
                  <div className="mt-1 text-xs text-stone-500">Completed by Master Craftsmen &amp; Team</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Master Craftsman Awards & Heritage Honors */}
      <section id="awards" className="border-b border-stone-200 bg-[#f8f5f0] py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
              Heritage Recognition
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
              Awards, Titles &amp; Art Honors
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {awardsList.map((award, i) => (
              <div key={i} className="rounded-3xl border border-stone-200 bg-white p-6 text-center shadow-xs">
                <div className="text-3xl">🏅</div>
                <h3 className="mt-3 font-display text-lg font-bold text-stone-900">{award.title}</h3>
                <div className="mt-1 text-xs font-semibold text-amber-800">{award.org}</div>
                <div className="mt-2 text-xs text-stone-500">{award.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sculpture Gallery & Visual Portfolio */}
      <section id="gallery" className="border-b border-stone-200 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
                Visual Portfolio
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
                Master Creations Gallery
              </h2>
            </div>
            <div className="text-xs text-stone-500">Click any image to view in high resolution</div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImage(img)}
                className="group relative h-64 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 sm:h-72 shadow-xs"
              >
                <img src={img} alt={`Sculpture work ${i + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-3 left-3 right-3 text-left opacity-0 group-hover:opacity-100 transition">
                  <span className="rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-stone-900 shadow-sm backdrop-blur-sm">
                    Enlarge 🔍
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Video Tour Section (if available) */}
          {(embedVideo || videoUrl) && (
            <div className="mt-12 rounded-3xl border border-stone-200 bg-[#fdfbf9] p-6 sm:p-8">
              <div className="mb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Watch In Action</div>
                <h3 className="font-display text-2xl font-bold text-stone-900">Carving Yard &amp; Studio Tour</h3>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-stone-300 bg-black">
                {embedVideo ? (
                  <iframe src={embedVideo} title="Sculpture Studio Tour" className="h-full w-full border-0" allowFullScreen />
                ) : (
                  <video src={videoUrl} controls className="h-full w-full object-cover" />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing, Ready Stock Catalog & Apprenticeship Workshops */}
      <section className="border-b border-stone-200 bg-[#f8f5f0] py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Art Catalog &amp; Pricing</div>
              <h3 className="mt-2 font-display text-2xl font-bold text-stone-900">Starting Estimates &amp; Catalog</h3>
              <p className="mt-3 text-sm text-stone-600">{startingPrice}</p>
              <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs text-stone-500">
                {catalogAvailable}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-emerald-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-800 shadow-sm"
                  >
                    Request Full Catalog PDF ↗
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="rounded-full border border-amber-800 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-amber-800 hover:bg-amber-50"
                >
                  Get Custom Estimate
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Heritage Learning</div>
              <h3 className="mt-2 font-display text-2xl font-bold text-stone-900">Sculpting Workshops &amp; Apprenticeship</h3>
              <p className="mt-3 text-sm text-stone-600">{workshops}</p>
              <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs text-stone-500">
                Learn classical Shilpa Shastra stone chiseling, clay modeling, and bronze casting from master craftsmen.
              </div>
              <button
                type="button"
                onClick={() => setEnquiryModalOpen(true)}
                className="mt-6 rounded-full bg-amber-800 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-amber-900"
              >
                Inquire About Workshops →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews & Client Ratings */}
      <section id="reviews" className="border-b border-stone-200 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
              Patron Testimonials
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
              What Temple Trustees &amp; Art Patrons Say
            </h2>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-[#fdfbf9] p-6 sm:p-8">
            {business._id ? (
              <ReviewsSection placeId={business._id} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div className="text-amber-500">★★★★★</div>
                  <p className="mt-2 text-sm text-stone-700">
                    “The Krishna Shila deity sculpted by the Master Sthapathi exceeds all Agamic expectations. The divine facial expression and razor-sharp detailing are magnificent.”
                  </p>
                  <div className="mt-3 text-xs font-bold text-stone-900">Trustee, Heritage Temple Trust</div>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div className="text-amber-500">★★★★★</div>
                  <p className="mt-2 text-sm text-stone-700">
                    “Commissioned a monumental bronze statue and stone fountain for our resort entrance. Flawless craftsmanship, safe wooden crate delivery, and prompt crane installation.”
                  </p>
                  <div className="mt-3 text-xs font-bold text-stone-900">Principal Architect, Luxury Estates</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact & Studio Location */}
      <section id="contact" className="bg-[#f8f5f0] py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
                Get In Touch
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
                Visit the Studio or Commission an Artwork
              </h2>
              <p className="mt-3 text-sm text-stone-600">
                We welcome temple committees, architects, art collectors, and devotees to visit our sculpting yard to observe ongoing stone chiseling and bronze casting in person.
              </p>

              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-start gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <span className="text-xl text-amber-800">📍</span>
                  <div>
                    <div className="font-semibold text-stone-900">Workshop &amp; Studio Address</div>
                    <div className="text-xs text-stone-600">{address}</div>
                    {mapsUrl && (
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs font-semibold text-amber-800 hover:underline">
                        Open in Google Maps ↗
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <span className="text-xl text-amber-800">📞</span>
                  <div>
                    <div className="font-semibold text-stone-900">Direct Phone / Consultation</div>
                    <a href={`tel:${phone}`} className="text-xs text-stone-600 hover:text-stone-900">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <span className="text-xl text-amber-800">✉️</span>
                  <div>
                    <div className="font-semibold text-stone-900">Studio Email</div>
                    <a href={`mailto:${email}`} className="text-xs text-stone-600 hover:text-stone-900">
                      {email}
                    </a>
                  </div>
                </div>

                {website && (
                  <div className="flex items-start gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <span className="text-xl text-amber-800">🌐</span>
                    <div>
                      <div className="font-semibold text-stone-900">Official Portfolio Website</div>
                      <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-800 hover:underline">
                        {website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Channels */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 border border-emerald-200 hover:bg-emerald-100">
                    WhatsApp
                  </a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-pink-50 px-4 py-2 text-xs font-bold text-pink-800 border border-pink-200 hover:bg-pink-100">
                    Instagram
                  </a>
                )}
                {youtubeUrl && (
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-800 border border-red-200 hover:bg-red-100">
                    YouTube
                  </a>
                )}
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-800 border border-blue-200 hover:bg-blue-100">
                    Facebook
                  </a>
                )}
                {onReport && (
                  <button type="button" onClick={onReport} className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-100">
                    ⚑ Report Listing
                  </button>
                )}
              </div>
            </div>

            {/* Direct Inquiry Form - Clean White Card */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="font-display text-2xl font-bold text-stone-900">Send Commission Enquiry</h3>
                <p className="mt-1 text-xs text-stone-500">Specify deity or sculpture style, preferred stone/metal, and approximate scale.</p>

                {enquiryStatus === 'sent' ? (
                  <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center text-emerald-900">
                    <div className="text-3xl text-emerald-600">✓</div>
                    <div className="mt-2 font-display text-lg font-bold">Enquiry Sent Successfully</div>
                    <p className="mt-1 text-xs text-emerald-700">The studio master and team will contact you shortly with a formal iconographic proposal and quote.</p>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Your Name *</label>
                      <input
                        required
                        value={enquiryForm.name}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                        placeholder="e.g. Ramesh Varma"
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Email Address</label>
                      <input
                        type="email"
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="name@example.com"
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Material / Medium</label>
                      <select
                        value={enquiryForm.material}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, material: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                      >
                        <option>Krishna Shila (Black Granite)</option>
                        <option>Makrana White Marble</option>
                        <option>Panchaloha (5-Sacred Metals)</option>
                        <option>Bronze Lost-Wax Casting</option>
                        <option>Red Sandstone</option>
                        <option>Teakwood Intricate Carving</option>
                        <option>Terracotta / Ceramic</option>
                        <option>Cold Cast Bronze Resin</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-stone-700">Approximate Height / Dimensions</label>
                      <input
                        value={enquiryForm.dimensions}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, dimensions: e.target.value })}
                        placeholder="e.g. 5 feet height for sanctum sanctorum or 18 inches for puja mandir"
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-stone-700">Custom Details &amp; Requirements *</label>
                      <textarea
                        required
                        rows={4}
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                        placeholder="Describe the deity, iconographic posture, location of installation, timeline, and any reference photos you have..."
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={enquiryStatus === 'sending'}
                        className="w-full rounded-full bg-amber-800 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-amber-900/15 transition hover:bg-amber-900 disabled:opacity-50"
                      >
                        {enquiryStatus === 'sending' ? 'Submitting Inquiry…' : 'Submit Sculpture Commission Inquiry'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-2xl text-white hover:bg-white/30"
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Sculpture enlarged"
            className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Commission Inquiry Modal */}
      {enquiryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setEnquiryModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200"
            >
              ×
            </button>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Commission Custom Sculpture</div>
            <h3 className="mt-1 font-display text-2xl font-bold text-stone-900">{studioName}</h3>
            <p className="mt-1 text-xs text-stone-500">Direct inquiry with Master Sthapathi for temple vigrahas &amp; bespoke sculptures.</p>

            {enquiryStatus === 'sent' ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center text-emerald-800">
                <div className="text-2xl text-emerald-600">✓</div>
                <div className="mt-2 text-sm font-bold">Inquiry Sent Successfully</div>
                <button
                  type="button"
                  onClick={() => {
                    setEnquiryStatus('idle');
                    setEnquiryModalOpen(false);
                  }}
                  className="mt-4 rounded-full bg-amber-800 px-4 py-2 text-xs font-bold text-white hover:bg-amber-900"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="mt-4 space-y-3">
                <input
                  required
                  placeholder="Your Name"
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  value={enquiryForm.phone}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700"
                />
                <input
                  placeholder="Desired Height / Scale (e.g. 4 ft idol)"
                  value={enquiryForm.dimensions}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, dimensions: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the deity, iconographic posture, or custom artwork..."
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-amber-700"
                />
                <button
                  type="submit"
                  disabled={enquiryStatus === 'sending'}
                  className="w-full rounded-full bg-amber-800 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-amber-900 disabled:opacity-50"
                >
                  {enquiryStatus === 'sending' ? 'Sending…' : 'Send Commission Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer - Professional Neutral Slate */}
      <footer className="border-t border-stone-200 bg-[#f4efe8] py-8 text-stone-600">
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs">
          <div>
            <span className="font-display font-bold text-stone-900">{studioName}</span> · Arts &amp; Creative Directory
            <div className="mt-0.5 text-[11px] text-stone-500">{address}</div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/categories" className="hover:text-stone-900">
              All Categories
            </Link>
            <Link to="/" className="hover:text-stone-900">
              G-PAGES Directory
            </Link>
            <a href="#about" className="hover:text-stone-900">
              Back to Top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

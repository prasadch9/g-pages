import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import ReviewsSection from '../components/ReviewsSection';
import api from '../services/api';

const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return String(val)
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
};

export default function ReligiousSocialBrandPage({ place, mapsUrl, onShare, onReport }) {
  const business = place || {};
  const categoryData = business.categoryData || business.attributes || {};
  const subcategory = (business.subcategory || business.category?.name || 'Temples').trim();
  const subcatLower = subcategory.toLowerCase();

  const isChurch = subcatLower.includes('church');
  const isTrust = subcatLower.includes('trust');
  const isNgo = subcatLower.includes('ngo');
  const isAssociation = subcatLower.includes('association');
  const isTemple = !isChurch && !isTrust && !isNgo && !isAssociation;

  const name = business.name || 'Sri Venkateswara Swamy Devasthanam';
  const description = business.description || 'Welcome to our sacred sanctuary of devotion, peace, and spiritual heritage. Serving devotees and community through daily worship, sevas, annadanam, and cultural traditions.';
  const address = business.address || 'Temple Street, Andhra Pradesh';
  const phone = business.phone || '+91 98765 43210';
  const email = business.email || 'info@devasthanam.org';
  const website = business.website || '';
  const coverImage = business.coverImage || business.images?.[0] || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80';
  const gallery = business.images?.length ? business.images : [
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',
  ];
  const logo = business.logo || '';
  const ratingAvg = business.rating?.average ? Number(business.rating.average).toFixed(1) : '4.9';
  const ratingCount = business.rating?.count || 64;

  const socialLinks = business.socialLinks || {};
  const whatsappNumber = (categoryData.whatsapp || socialLinks.whatsapp || phone || '').replace(/\D/g, '');
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Namaste, I would like to inquire about ${name}.`)}` : null;

  // Modals & form state
  const [selectedImage, setSelectedImage] = useState(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState('idle');
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '', sevaOrProgram: '', message: '' });

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryStatus('sending');
    try {
      if (business._id) {
        await api.post('/enquiries', {
          place: business._id,
          name: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          message: `[${subcategory} Inquiry]\nService/Program: ${inquiryForm.sevaOrProgram}\nMessage: ${inquiryForm.message}`,
        });
      }
      setInquiryStatus('sent');
    } catch {
      setInquiryStatus('sent');
    }
  };

  // -------------------------------------------------------------
  // TEMPLE SPECIFIC DATA
  // -------------------------------------------------------------
  const deityName = categoryData.deityName || 'Lord Venkateswara Swamy (Moolavar)';
  const tradition = categoryData.tradition || 'Vaishnava / Sri Pancharatra Agama';
  const architecturalStyle = categoryData.architecturalStyle || 'Dravidian Architecture (7-tier Rajagopuram)';
  const rawSubDeities = parseList(categoryData.subDeities);
  const subDeities = rawSubDeities.length ? rawSubDeities : ['Lord Ganesha', 'Goddess Lakshmi Devi', 'Lord Subrahmanya', 'Lord Anjaneya Swamy', 'Navagrahas'];
  const pushkarini = categoryData.pushkarini || 'Swami Pushkarini Holy Teertham';

  const rawTimings = parseList(categoryData.timings);
  const timingsList = rawTimings.length ? rawTimings : [
    'Morning Darshan: 6:00 AM - 12:30 PM',
    'Evening Darshan: 4:30 PM - 8:30 PM',
    'Suprabhata Seva: 5:00 AM',
    'Maha Mangala Harathi: 12:00 PM & 8:00 PM',
    'Ekanta Seva / Pavalimpu: 9:00 PM',
  ];

  const rawPoojas = parseList(categoryData.poojaServices);
  const poojasList = rawPoojas.length ? rawPoojas : [
    'Suprabhata Seva - ₹50',
    'Nitya Archana - ₹100',
    'Rudra / Abhishekam - ₹250',
    'Sahasranama Pooja - ₹150',
    'Kalyanotsavam (Daily) - ₹1,000',
    'Vehicle Pooja (Two/Four Wheeler) - ₹100 / ₹250',
  ];

  const rawFestivals = parseList(categoryData.festivals);
  const festivalsList = rawFestivals.length ? rawFestivals : [
    'Annual Brahmotsavam (Navaratri)',
    'Sri Rama Navami Kalyanotsavam',
    'Maha Shivaratri Jagaran & Abhishekam',
    'Vaikunta Ekadasi Uttara Dwara Darshanam',
    'Hanuman Jayanti Procession',
  ];

  const annadanam = categoryData.annadanam || 'Nitya Annadanam served daily to 1,000+ devotees from 12:00 PM to 2:30 PM. Prepared in hygienic steam kitchens.';
  const accommodation = categoryData.accommodation || 'Devasthanam Choultry & AC/Non-AC guest rooms available near Temple complex. Advance counters open daily.';
  const amenities = categoryData.amenities || 'Free footwear stand, RO purified drinking water, 200+ vehicle parking, cloakroom, and marriage hall.';
  const dressCode = categoryData.dressCode || 'Traditional Indian attire requested (Dhoti/Kurta for Men; Saree/Chudidar for Women).';
  const headPriest = categoryData.headPriest || 'Chief Sthanacharya / Dharmakartha Board';
  const donationDetails = categoryData.donationDetails || 'E-Hundi: UPI / QR Code available. Nitya Annadanam Trust & Temple Renovation Fund eligible for 80G Tax Exemption.';

  // -------------------------------------------------------------
  // CHURCH SPECIFIC DATA
  // -------------------------------------------------------------
  const churchWorshipTimings = rawTimings.length ? rawTimings : [
    'Sunday 1st Service (Telugu): 6:30 AM - 8:30 AM',
    'Sunday 2nd Service (English): 9:00 AM - 11:00 AM',
    'Sunday School (Kids): 9:00 AM - 10:30 AM',
    'Wednesday Midweek Prayer: 6:30 PM - 8:00 PM',
    'Friday Fasting Prayer: 10:30 AM - 1:00 PM',
    'Youth Fellowship (Saturday): 6:00 PM',
  ];
  const churchMinistries = rawPoojas.length ? rawPoojas : [
    'Sunday School & Child Evangelism',
    'Youth Fellowship & Campus Outreach',
    'Worship & Choir Ministry',
    'Women’s Fellowship & Prayer Chain',
    'Hospital & Community Care Mission',
  ];
  const churchEvents = rawFestivals.length ? rawFestivals : [
    'Annual Gospel Convention & Revival Meetings',
    'Christmas Carol Service & Watch Night Service',
    'Easter Sunrise Celebration & Resurrection Service',
    'Vacation Bible School (VBS)',
  ];

  // -------------------------------------------------------------
  // TRUST / NGO SPECIFIC DATA
  // -------------------------------------------------------------
  const ngoMission = categoryData.mission || description;
  const ngoCauses = rawPoojas.length ? rawPoojas : [
    'Free Child Education & School Kits',
    'Rural Healthcare Camps & Free Medicines',
    'Elderly Care & Destitute Support',
    'Women Skill Development & Livelihood',
    'Environmental Greenery & Plantation',
  ];
  const ngoImpactStats = [
    { label: 'Beneficiaries Supported', value: '15,000+' },
    { label: 'Students Sponsored', value: '1,200+' },
    { label: 'Free Medical Camps', value: '85+' },
    { label: 'Communities Served', value: '40+ Villages' },
  ];

  // -------------------------------------------------------------
  // ASSOCIATION SPECIFIC DATA
  // -------------------------------------------------------------
  const assocLeadership = headPriest !== 'Chief Sthanacharya / Dharmakartha Board' ? headPriest : 'Elected President & Executive Committee';
  const assocBenefits = rawPoojas.length ? rawPoojas : [
    'Industry Networking & Member Directory',
    'Legal & Advisory Support for Members',
    'Annual Conventions & Knowledge Summits',
    'Welfare & Mutual Benefit Fund',
    'Government Representation & Advocacy',
  ];
  const assocTiers = [
    { tier: 'Life Member', fee: '₹10,000 (One-time)', desc: 'Permanent voting rights, directory listing, and delegate pass for annual summits.' },
    { tier: 'Annual Member', fee: '₹1,500 / year', desc: 'Full access to seminars, welfare benefits, and monthly trade newsletters.' },
    { tier: 'Associate / Student', fee: '₹500 / year', desc: 'Networking events, skill sessions, and digital resource library access.' },
  ];

  // Visual Theme configuration
  const theme = isTemple ? {
    tagBg: 'bg-amber-100 text-amber-900 border-amber-300',
    primaryBtn: 'bg-amber-800 hover:bg-amber-900 text-white',
    accentText: 'text-amber-800',
    heroBg: 'from-[#fbf8f3] via-[#f7f0e4] to-[#ede3d1]',
    badge: '🛕 Ancient Sacred Temple',
    subText: 'Deity Darshan, Sevas & Community Annadanam',
    cta: 'Book Seva / Archana',
  } : isChurch ? {
    tagBg: 'bg-blue-100 text-blue-900 border-blue-300',
    primaryBtn: 'bg-blue-800 hover:bg-blue-900 text-white',
    accentText: 'text-blue-800',
    heroBg: 'from-[#f5f8fc] via-[#edf3fa] to-[#e2ebf5]',
    badge: '⛪ Christian Church & Parish',
    subText: 'Worship Services, Fellowship & Community Outreach',
    cta: 'Send Prayer Request',
  } : (isTrust || isNgo) ? {
    tagBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    primaryBtn: 'bg-emerald-800 hover:bg-emerald-900 text-white',
    accentText: 'text-emerald-800',
    heroBg: 'from-[#f4f9f6] via-[#edf6f0] to-[#e1efe6]',
    badge: isNgo ? '🌍 Registered NGO' : '🤝 Charitable Trust',
    subText: 'Community Welfare, Education & Healthcare Mission',
    cta: 'Support & Donate',
  } : {
    tagBg: 'bg-teal-100 text-teal-900 border-teal-300',
    primaryBtn: 'bg-teal-800 hover:bg-teal-900 text-white',
    accentText: 'text-teal-800',
    heroBg: 'from-[#f4f9f9] via-[#ecf5f5] to-[#e0efef]',
    badge: '👥 Registered Association',
    subText: 'Member Advocacy, Networking & Community Advancement',
    cta: 'Apply for Membership',
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans selection:bg-amber-700 selection:text-white">
      {/* Top Notification Bar */}
      <div className="border-b border-stone-200/90 bg-[#f4efe8] px-4 py-2 text-center text-xs font-medium text-stone-700">
        <span>{theme.badge} · {theme.subText}</span>
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="ml-3 font-semibold text-stone-900 underline hover:text-amber-800">
            Contact on WhatsApp →
          </a>
        )}
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {logo ? (
              <img src={logo} alt={`${name} logo`} className="h-11 w-11 rounded-xl border border-stone-200 bg-stone-50 object-contain p-1 shadow-sm sm:h-12 sm:w-12" />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-[#f3ede4] text-xl font-bold text-stone-800 shadow-sm sm:h-12 sm:w-12 sm:text-2xl">
                {isTemple ? '🛕' : isChurch ? '⛪' : isNgo ? '🌍' : isTrust ? '🤝' : '👥'}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-display text-lg font-bold tracking-tight text-stone-900 sm:text-xl">{name}</span>
                <span className={`hidden rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:inline-block ${theme.tagBg}`}>
                  {subcategory}
                </span>
              </div>
              <div className="truncate text-xs text-stone-500">
                {isTemple ? `${deityName} · ${tradition}` : isChurch ? 'Worship & Fellowship' : (isTrust || isNgo) ? 'Social Welfare & Community Impact' : 'Member Council & Association'}
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-5 text-[13px] font-semibold tracking-wide text-stone-600 lg:flex">
            <Link to="/" className="font-bold text-stone-800 transition hover:text-amber-800">Home</Link>
            <a href="#about" className="hover:text-stone-900">About</a>
            <a href="#timings" className="hover:text-stone-900">{isTemple ? 'Darshan & Sevas' : isChurch ? 'Worship Services' : (isTrust || isNgo) ? 'Causes' : 'Benefits'}</a>
            <a href="#festivals" className="hover:text-stone-900">{isTemple ? 'Festivals' : isChurch ? 'Conventions' : (isTrust || isNgo) ? 'Impact' : 'Events'}</a>
            <a href="#facilities" className="hover:text-stone-900">{isTemple ? 'Annadanam' : isChurch ? 'Ministries' : (isTrust || isNgo) ? 'Donations' : 'Membership'}</a>
            <a href="#gallery" className="hover:text-stone-900">Gallery</a>
            <a href="#reviews" className="hover:text-stone-900">Reviews</a>
            <a href="#contact" className="hover:text-stone-900">Contact</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setInquiryModalOpen(true)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-md transition sm:px-5 sm:py-2.5 ${theme.primaryBtn}`}
            >
              {theme.cta}
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
              title="Back to G-Pages Home"
            >
              <span aria-hidden="true">←</span> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`border-b border-stone-200 bg-gradient-to-br ${theme.heroBg} py-12 sm:py-16 lg:py-20`}>
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-widest ${theme.tagBg}`}>
                <span>✦</span> Religious &amp; Social · {subcategory}
              </div>

              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.12] text-stone-900 sm:text-5xl lg:text-6xl">
                {name}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
                {description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold sm:text-sm">
                <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 shadow-xs text-stone-800">
                  <span className="text-amber-500">★</span>
                  <span className="font-bold">{ratingAvg}</span>
                  <span className="text-stone-500">({ratingCount} Reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 shadow-xs text-stone-700">
                  <span>📍</span> {address}
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-800 font-medium">
                  <span>✓</span> Verified Listing
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(true)}
                  className={`rounded-full px-6 py-3.5 text-sm font-bold uppercase tracking-wider shadow-lg transition hover:brightness-110 ${theme.primaryBtn}`}
                >
                  {theme.cta} →
                </button>
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
                  >
                    <span>💬</span> WhatsApp Inquiry
                  </a>
                )}
                <a
                  href={`tel:${phone}`}
                  className="rounded-full border border-stone-300 bg-white px-5 py-3.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50"
                >
                  📞 Contact Office
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
                <img src={coverImage} alt={name} className="h-[360px] w-full object-cover sm:h-[440px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-md">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-600">{subcategory}</div>
                  <div className="text-lg font-bold text-stone-900">{name}</div>
                  <div className="text-xs text-stone-600">{address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary Highlights Bar */}
      <section className="border-b border-stone-200 bg-white py-6">
        <div className="mx-auto grid max-w-[1700px] grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { value: isTemple ? deityName.split(' ')[0] + ' ' + (deityName.split(' ')[1] || '') : isChurch ? 'Christian Fellowship' : (isTrust || isNgo) ? 'Social Welfare' : 'Member Body', label: isTemple ? 'Primary Deity' : 'Tradition', sub: isTemple ? tradition : 'Community Faith' },
            { value: isTemple ? 'Daily Darshan' : isChurch ? 'Sunday Mass' : (isTrust || isNgo) ? '15,000+ Served' : 'Regular Sessions', label: 'Worship & Activities', sub: 'Open to All Devotees' },
            { value: isTemple ? 'Nitya Annadanam' : isChurch ? 'Community Outreach' : (isTrust || isNgo) ? '80G Tax Exemption' : 'Welfare Assistance', label: 'Services & Welfare', sub: 'Social Support' },
            { value: 'Verified', label: 'Administration', sub: headPriest.split('/')[0].trim() },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl border border-stone-200 bg-[#fdfbf9] p-4 text-center shadow-xs">
              <div className="font-display text-xl font-bold text-stone-900 sm:text-2xl">{stat.value}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-700">{stat.label}</div>
              <div className="mt-0.5 text-[11px] text-stone-500">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-b border-stone-200 py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className={`inline-block rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-widest ${theme.tagBg}`}>
                About this {subcategory}
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
                {isTemple ? 'Sacred History & Sthala Puranam' : isChurch ? 'Our Faith, Mission & Parish Life' : (isTrust || isNgo) ? 'Mission, Vision & Core Values' : 'Objectives & Association Leadership'}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600">
                {description}
              </p>

              {/* Subcategory Specific Details Grid */}
              {isTemple && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Primary Deity (Moolavar)</div>
                    <div className="mt-1 text-sm font-semibold text-stone-900">{deityName}</div>
                    <div className="text-xs text-stone-500">{tradition}</div>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Architecture &amp; Tower</div>
                    <div className="mt-1 text-sm font-semibold text-stone-900">{architecturalStyle}</div>
                    <div className="text-xs text-stone-500">{pushkarini}</div>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs sm:col-span-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-800">Parivara Devatas (Sub-Deities)</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
                      {subDeities.map((d) => (
                        <span key={d} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-stone-700">
                          🛕 {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {isChurch && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-800">Parish Leadership</div>
                    <div className="mt-1 text-sm font-semibold text-stone-900">{headPriest}</div>
                    <div className="text-xs text-stone-500">Pastoral Care &amp; Counseling Available</div>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-800">Scriptural Mission</div>
                    <div className="mt-1 text-sm font-semibold text-stone-900">Spreading Gospel &amp; Christian Love</div>
                    <div className="text-xs text-stone-500">Multi-lingual Worship Services</div>
                  </div>
                </div>
              )}

              {(isTrust || isNgo) && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Statutory Transparency</div>
                    <div className="mt-1 text-sm font-semibold text-stone-900">80G &amp; 12A Certified</div>
                    <div className="text-xs text-stone-500">Donations Tax Deductible under Income Tax Act</div>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Leadership &amp; Trustees</div>
                    <div className="mt-1 text-sm font-semibold text-stone-900">{headPriest}</div>
                    <div className="text-xs text-stone-500">Audited Annually &amp; Public Transparency</div>
                  </div>
                </div>
              )}

              {isAssociation && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-800">Executive Committee</div>
                    <div className="mt-1 text-sm font-semibold text-stone-900">{assocLeadership}</div>
                    <div className="text-xs text-stone-500">Elected Democratic Governing Body</div>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-800">Council Recognition</div>
                    <div className="mt-1 text-sm font-semibold text-stone-900">Registered Societies Act</div>
                    <div className="text-xs text-stone-500">Serving Community &amp; Trade Members</div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Quick Guidelines &amp; Info</div>
                <div className="mt-4 space-y-4 text-sm">
                  {isTemple && (
                    <>
                      <div className="border-b border-stone-100 pb-3">
                        <div className="font-semibold text-stone-900">Dress Code Guidelines</div>
                        <div className="text-xs text-stone-600">{dressCode}</div>
                      </div>
                      <div className="border-b border-stone-100 pb-3">
                        <div className="font-semibold text-stone-900">Sacred Prasadam</div>
                        <div className="text-xs text-stone-600">Laddu, Pulihora, Daddojanam, Panchamrutham available at counter.</div>
                      </div>
                    </>
                  )}
                  <div className="border-b border-stone-100 pb-3">
                    <div className="font-semibold text-stone-900">Devotee &amp; Visitor Amenities</div>
                    <div className="text-xs text-stone-600">{amenities}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Elderly &amp; Special Assistance</div>
                    <div className="text-xs text-stone-600">Wheelchair ramp at main entrance; Special queue for senior citizens.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Timings, Sevas, Services or Causes */}
      <section id="timings" className="border-b border-stone-200 bg-[#f6f2ec] py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className={`rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-widest ${theme.tagBg}`}>
              {isTemple ? 'Worship & Seva Schedule' : isChurch ? 'Sunday Mass & Midweek Prayers' : (isTrust || isNgo) ? 'Welfare Initiatives' : 'Member Benefits'}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
              {isTemple ? 'Daily Darshan & Pooja Sevas' : isChurch ? 'Worship Services & Fellowship' : (isTrust || isNgo) ? 'Social Welfare Causes Supported' : 'Member Services & Benefits'}
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Left Box: Timings or Pillars */}
            <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
              <h3 className="font-display text-xl font-bold text-stone-900">
                {isTemple ? '⏰ Daily Darshan Timings' : isChurch ? '⏰ Weekly Worship Schedule' : (isTrust || isNgo) ? '🌱 Core Welfare Causes' : '🤝 Membership Benefits'}
              </h3>
              <div className="mt-5 space-y-3">
                {(isTemple ? timingsList : isChurch ? churchWorshipTimings : (isTrust || isNgo) ? ngoCauses : assocBenefits).map((t, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-stone-100 bg-[#fdfbf9] px-4 py-3 text-sm">
                    <span className="font-semibold text-stone-900">{t}</span>
                    <span className="text-xs font-bold text-stone-400">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Box: Seva Booking or Programs */}
            <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
              <h3 className="font-display text-xl font-bold text-stone-900">
                {isTemple ? '🙏 Poojas, Sevas & Nominal Fees' : isChurch ? '✝️ Active Ministries' : (isTrust || isNgo) ? '📈 Verified Impact Metrics' : '📜 Membership Tiers'}
              </h3>
              <div className="mt-5 space-y-3">
                {isTemple && poojasList.map((p, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-stone-100 bg-[#fdfbf9] px-4 py-3 text-sm">
                    <span className="font-medium text-stone-800">{p}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setInquiryForm({ ...inquiryForm, sevaOrProgram: p });
                        setInquiryModalOpen(true);
                      }}
                      className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 hover:bg-amber-100"
                    >
                      Book →
                    </button>
                  </div>
                ))}

                {isChurch && churchMinistries.map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-stone-100 bg-[#fdfbf9] px-4 py-3 text-sm">
                    <span className="font-medium text-stone-800">{m}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setInquiryForm({ ...inquiryForm, sevaOrProgram: m });
                        setInquiryModalOpen(true);
                      }}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 hover:bg-blue-100"
                    >
                      Join →
                    </button>
                  </div>
                ))}

                {(isTrust || isNgo) && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {ngoImpactStats.map((stat, i) => (
                      <div key={i} className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
                        <div className="font-display text-2xl font-bold text-emerald-900">{stat.value}</div>
                        <div className="mt-1 text-xs font-semibold text-emerald-800">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {isAssociation && assocTiers.map((tier, i) => (
                  <div key={i} className="rounded-2xl border border-stone-200 bg-[#fdfbf9] p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{tier.tier}</span>
                      <span className="text-xs font-bold text-teal-800">{tier.fee}</span>
                    </div>
                    <div className="mt-1 text-xs text-stone-500">{tier.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Annadanam / Welfare / Ministries */}
      <section id="facilities" className="border-b border-stone-200 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-stone-200 bg-[#fdfbf9] p-7 shadow-xs">
              <span className={`rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-widest ${theme.tagBg}`}>
                {isTemple ? 'Devotee Welfare' : isChurch ? 'Fellowship' : (isTrust || isNgo) ? 'Community Drive' : 'Member Services'}
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold text-stone-900">
                {isTemple ? 'Nitya Annadanam & Pilgrim Care' : isChurch ? 'Community Outreach & Care' : (isTrust || isNgo) ? 'Donations & 80G Tax Deductions' : 'Conferences & Legal Advocacy'}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {isTemple ? annadanam : isChurch ? 'We actively visit hospitals, support underprivileged families with monthly rations, and run free educational tuition for village kids.' : donationDetails}
              </p>
              <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4 text-xs text-stone-600">
                {isTemple ? accommodation : (isTrust || isNgo) ? 'Contributions to our Trust account are exempt under Sec 80G of the IT Act. Receipts with 80G certificate provided instantly.' : 'Regular member general meetings, state representation, and trade disputes mediation.'}
              </div>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                className={`mt-6 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider ${theme.primaryBtn}`}
              >
                {isTemple ? 'Donate to Annadanam' : (isTrust || isNgo) ? 'Make a Donation' : 'Inquire for Details'} →
              </button>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-[#fdfbf9] p-7 shadow-xs">
              <span className={`rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-widest ${theme.tagBg}`}>
                {isTemple ? 'Annual Celebrations' : isChurch ? 'Annual Conventions' : (isTrust || isNgo) ? 'Active Campaigns' : 'Conventions'}
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold text-stone-900">
                {isTemple ? 'Major Festivals & Utsavams' : isChurch ? 'Conventions & Gospel Meetings' : (isTrust || isNgo) ? 'Ongoing Welfare Projects' : 'Annual Meetings & Summits'}
              </h3>
              <div className="mt-4 space-y-2.5">
                {(isTemple ? festivalsList : isChurch ? churchEvents : (isTrust || isNgo) ? ngoCauses : assocBenefits).map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-stone-700">
                    <span className="text-amber-600">✦</span>
                    <span className="font-medium text-stone-900">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-stone-200 pt-4 text-xs text-stone-500">
                Special arrangements, crowd management, and live telecast provided during annual major celebrations.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="border-b border-stone-200 bg-[#f6f2ec] py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className={`rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-widest ${theme.tagBg}`}>
                Visual Showcase
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
                Photo Gallery &amp; Sacred Moments
              </h2>
            </div>
            <div className="text-xs text-stone-500">Click any image to view in high resolution</div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImage(img)}
                className="group relative h-56 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-xs sm:h-64"
              >
                <img src={img} alt={`${name} photo ${i + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition">
                  <span className="rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-stone-900 shadow-sm">
                    View 🔍
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Devotee / Member Reviews */}
      <section id="reviews" className="border-b border-stone-200 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className={`rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-widest ${theme.tagBg}`}>
              Community Testimonials
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
              Devotee &amp; Member Experiences
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
                    “Extremely peaceful and spiritually uplifting. Darshan was smooth, premises are kept very clean, and the Annadanam prasadam was divine.”
                  </p>
                  <div className="mt-3 text-xs font-bold text-stone-900">Devotee from Rajahmundry</div>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div className="text-amber-500">★★★★★</div>
                  <p className="mt-2 text-sm text-stone-700">
                    “Wonderful community service and spiritual guidance. The management is transparent and very helpful to senior citizens.”
                  </p>
                  <div className="mt-3 text-xs font-bold text-stone-900">Community Member</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section id="contact" className="bg-[#f8f5f0] py-14 sm:py-20">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className={`rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-widest ${theme.tagBg}`}>
                Office &amp; Inquiries
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 sm:text-4xl">
                Location &amp; Administration
              </h2>
              <p className="mt-3 text-sm text-stone-600">
                Devasthanam office counters, sevas booking, and trust administration are open daily to assist devotees and visitors.
              </p>

              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-start gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <span className="text-xl text-stone-700">📍</span>
                  <div>
                    <div className="font-semibold text-stone-900">Address</div>
                    <div className="text-xs text-stone-600">{address}</div>
                    {mapsUrl && (
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs font-semibold text-amber-800 hover:underline">
                        Open in Google Maps ↗
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <span className="text-xl text-stone-700">📞</span>
                  <div>
                    <div className="font-semibold text-stone-900">Phone / Office Desk</div>
                    <a href={`tel:${phone}`} className="text-xs text-stone-600 hover:text-stone-900">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                  <span className="text-xl text-stone-700">✉️</span>
                  <div>
                    <div className="font-semibold text-stone-900">Email Address</div>
                    <a href={`mailto:${email}`} className="text-xs text-stone-600 hover:text-stone-900">
                      {email}
                    </a>
                  </div>
                </div>

                {website && (
                  <div className="flex items-start gap-3.5 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
                    <span className="text-xl text-stone-700">🌐</span>
                    <div>
                      <div className="font-semibold text-stone-900">Official Website</div>
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
                {onReport && (
                  <button type="button" onClick={onReport} className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-100">
                    ⚑ Report Listing
                  </button>
                )}
              </div>
            </div>

            {/* Direct Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="font-display text-2xl font-bold text-stone-900">Send an Inquiry or Seva Booking</h3>
                <p className="mt-1 text-xs text-stone-500">Enter your contact details and message for temple sevas, prayer requests, donations, or membership.</p>

                {inquiryStatus === 'sent' ? (
                  <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center text-emerald-900">
                    <div className="text-3xl text-emerald-600">✓</div>
                    <div className="mt-2 font-display text-lg font-bold">Inquiry Sent Successfully</div>
                    <p className="mt-1 text-xs text-emerald-700">The administration office will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Your Name *</label>
                      <input
                        required
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        placeholder="e.g. Sridhar Sharma"
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Email Address</label>
                      <input
                        type="email"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        placeholder="name@example.com"
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700">Service / Seva / Program</label>
                      <input
                        value={inquiryForm.sevaOrProgram}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, sevaOrProgram: e.target.value })}
                        placeholder={isTemple ? 'e.g. Kalyanotsavam / Nitya Annadanam' : isChurch ? 'e.g. Prayer Request / Sunday School' : 'e.g. Donation / Membership'}
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-stone-700">Message / Gotram / Special Request *</label>
                      <textarea
                        required
                        rows={4}
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        placeholder={isTemple ? 'Mention your Gotram, Nakshatram, preferred date of seva or pooja...' : 'Enter your prayer request or inquiry details...'}
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={inquiryStatus === 'sending'}
                        className={`w-full rounded-full py-3 text-sm font-bold uppercase tracking-wider shadow-md transition disabled:opacity-50 ${theme.primaryBtn}`}
                      >
                        {inquiryStatus === 'sending' ? 'Submitting…' : 'Submit Inquiry'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
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
          >
            ×
          </button>
          <img src={selectedImage} alt={name} className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Quick Action Modal */}
      {inquiryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setInquiryModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInquiryModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200"
            >
              ×
            </button>
            <div className={`text-xs font-bold uppercase tracking-wider ${theme.accentText}`}>{subcategory} Inquiry</div>
            <h3 className="mt-1 font-display text-2xl font-bold text-stone-900">{name}</h3>
            <p className="mt-1 text-xs text-stone-500">{theme.subText}</p>

            {inquiryStatus === 'sent' ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center text-emerald-800">
                <div className="text-2xl text-emerald-600">✓</div>
                <div className="mt-2 text-sm font-bold">Inquiry Sent Successfully</div>
                <button
                  type="button"
                  onClick={() => {
                    setInquiryStatus('idle');
                    setInquiryModalOpen(false);
                  }}
                  className={`mt-4 rounded-full px-4 py-2 text-xs font-bold ${theme.primaryBtn}`}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="mt-4 space-y-3">
                <input
                  required
                  placeholder="Your Name"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-600"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-600"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-600"
                />
                <input
                  placeholder={isTemple ? 'Desired Seva / Gotram' : isChurch ? 'Prayer Topic / Ministry' : 'Program / Membership'}
                  value={inquiryForm.sevaOrProgram}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, sevaOrProgram: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-600"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Details of your request..."
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-600"
                />
                <button
                  type="submit"
                  disabled={inquiryStatus === 'sending'}
                  className={`w-full rounded-full py-2.5 text-xs font-bold uppercase tracking-wider shadow-md transition disabled:opacity-50 ${theme.primaryBtn}`}
                >
                  {inquiryStatus === 'sending' ? 'Submitting…' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-[#f4efe8] py-8 text-stone-600">
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs">
          <div>
            <span className="font-display font-bold text-stone-900">{name}</span> · Religious &amp; Social Directory
            <div className="mt-0.5 text-[11px] text-stone-500">{address}</div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="font-semibold text-stone-800 hover:text-stone-950">
              ← Back to Home
            </Link>
            <Link to="/categories" className="hover:text-stone-900">
              All Categories
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

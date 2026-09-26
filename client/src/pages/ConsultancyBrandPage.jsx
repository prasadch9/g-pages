import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReviewsSection from '../components/ReviewsSection';

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

export default function ConsultancyBrandPage({ place }) {
  const business = place || {};
  const businessName = business.name || 'Veritas Business Consultants';
  const businessCategory = business.category?.name || 'Consultancy';
  const businessLogo = business.logo || business.brandLogo || business.logoUrl || '';
  const heroImage = business.coverImage || business.images?.[0] || defaultHeroImage;
  const gallery = business.images?.length ? business.images : fallbackGallery;
  const description = business.description || 'Our consultancy team delivers strategic guidance, operational support, and measurable growth solutions for businesses and entrepreneurs.';
  const address = business.address || 'Hyderabad, Telangana';
  const phone = business.phone || '+91 98765 43210';
  const email = business.email || 'info@veritasconsultants.com';
  const website = business.website || 'https://www.veritasconsultants.com';
  const whatsapp = business.socialLinks?.whatsapp || 'https://wa.me/919876543210';
  const instagram = business.socialLinks?.instagram || 'https://instagram.com';
  const ratingText = business.rating?.average ? `${business.rating.average.toFixed(1)} (${business.rating.count || 0} Reviews)` : '4.8 (124 Reviews)';
  const categoryData = business.categoryData || {};
  const services = business.services?.length ? business.services.map((title, index) => ({ icon: ['📈', '💰', '🔎', '⚙️'][index % 4], title, description: title })) : fallbackServices;
  const whyChooseUs = business.attributes?.highlights?.length ? business.attributes.highlights.map((text, index) => ({ icon: ['🏅', '🧩', '📊', '🤝'][index % 4], title: ['Expert Guidance', 'Tailored Solutions', 'Proven Results', 'Client Focused'][index % 4], text })) : fallbackWhyChooseUs;
  const placeId = business._id || business.id || business.slug || null;
  const categoryDetails = Object.entries(categoryData)
    .filter(([_, value]) => value && (!Array.isArray(value) || value.length > 0))
    .map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase()),
      value: Array.isArray(value) ? value : [String(value)],
    }));
  const backLink = '/categories';
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div id="home" className="min-h-screen bg-[#f4f7fb] text-slate-800">
      <header className="bg-[#061f35] text-white shadow-md shadow-slate-900/10">
        <div className="mx-auto grid max-w-[1700px] items-center gap-4 px-4 py-4 lg:grid-cols-[1fr_auto_auto] lg:px-7">
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
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-200/90 sm:text-[11px]">
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

          <div className="flex flex-wrap items-center justify-end gap-3 lg:justify-self-end">
            <a href={`tel:${phone}`} className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 sm:px-6 sm:py-3 sm:text-base">
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
        </div>
      </header>

      <main className="bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.12),_transparent_38%),linear-gradient(180deg,#f8fbff_0%,#eef5fb_100%)] py-8 sm:py-10">
        <section className="relative overflow-hidden border border-sky-100 bg-white shadow-[0_25px_60px_rgba(8,127,140,.12)]">
          <div className="absolute inset-0">
            <img src={heroImage} alt="Business consultants meeting" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,33,52,.82),rgba(10,42,69,.38),rgba(7,33,52,.28))]" />

          <div className="relative flex min-h-[520px] flex-col justify-end p-6 sm:p-9">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-sky-200">
              Strategy • Growth • Success
            </div>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {businessName}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-200">
              Strategic Consulting for a Smarter Tomorrow
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <span className="text-amber-300">★</span> {ratingText}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Verified Business
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-300" /> Hyderabad, Telangana
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={`tel:${phone}`} className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400">
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

          <div className="absolute right-6 top-6 hidden w-[260px] rounded-2xl border border-white/20 bg-[#0d3b5e]/75 p-5 text-white shadow-lg backdrop-blur-sm md:block">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-200">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-lg">◉</span>
              Your Growth
            </div>
            <div className="mt-3 text-2xl font-semibold leading-tight">Our Expertise</div>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Helping businesses achieve their goals with expert guidance and strategic solutions.
            </p>
          </div>
        </section>

        <section id="about" className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-sky-50/60 to-slate-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-xl text-white shadow-lg shadow-sky-500/30">ℹ</span>
              <h2 className="font-display text-3xl font-semibold text-slate-800">About Us</h2>
            </div>

            <p className="text-[15px] leading-8 text-slate-600">
              {businessName} is a trusted consultancy firm dedicated to helping businesses and individuals achieve sustainable growth. We provide expert guidance, strategic planning and innovative solutions tailored to your unique needs. With a team of experienced professionals, we deliver beyond expectations and support business success with clear strategy and measurable outcomes.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Years Experience', value: '10+' },
                { label: 'Happy Clients', value: '500+' },
                { label: 'Success Rate', value: '95%' },
                { label: 'Client Rating', value: '4.8/5' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 text-center shadow-sm shadow-sky-100/80">
                  <div className="text-2xl font-bold text-slate-800">{item.value}</div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>

          </div>

          <aside className="rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-950 via-[#0a2542] to-[#123d63] p-6 text-slate-100 shadow-[0_18px_50px_rgba(10,37,66,0.18)] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl text-sky-200 ring-1 ring-white/20">✦</span>
              <h2 className="font-display text-3xl font-semibold text-white">Contact Information</h2>
            </div>

            <div className="space-y-4 text-slate-200">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="mt-1 text-lg text-sky-300">☎</span>
                <div>
                  <div className="font-semibold text-white">{phone}</div>
                  <div className="text-sm text-sky-100/80">Call anytime</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="mt-1 text-lg text-sky-300">✉</span>
                <div>
                  <div className="font-semibold text-white">{email}</div>
                  <div className="text-sm text-sky-100/80">Send us an email</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="mt-1 text-lg text-sky-300">📍</span>
                <div>
                  <div className="font-semibold text-white">{address}</div>
                  <div className="text-sm text-sky-100/80">Business Location</div>
                </div>
              </div>
            </div>

            <a href={`mailto:${email}`} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/20 transition hover:brightness-110">
              Send Enquiry
            </a>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 font-semibold text-white">
                <span className="text-lg text-sky-300">🕒</span> Business Hours
              </div>
              <div className="space-y-2 text-sm text-slate-200">
                <div className="flex justify-between"><span>Monday - Friday</span><span>9:00 AM - 7:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>9:00 AM - 5:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
              </div>
            </div>
          </aside>
        </section>

        {categoryDetails.length > 0 && (
          <section className="mt-10 rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-sky-50/50 to-slate-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">{businessCategory}</div>
                <h2 className="mt-2 font-display text-3xl font-semibold text-slate-800">Category Information</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categoryDetails.map((detail) => (
                <div key={detail.label} className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/80">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-600">{detail.label}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {detail.value.map((item) => (
                      <span key={item} className="rounded-full bg-sky-50 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-sky-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="services" className="mt-10 rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-sky-50/50 to-slate-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">{businessCategory}</div>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-800">Business Growth Services</h2>
            </div>
            <a href="#contact" className="hidden text-sm font-semibold text-sky-700 hover:text-sky-800 sm:inline-flex">
              View All Services →
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div key={service.title} className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/80 transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-2xl text-white shadow-lg shadow-sky-500/20">{service.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-slate-800">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="why-us" className="mt-10 rounded-[28px] border border-sky-100 bg-gradient-to-br from-slate-50 to-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">Why Choose Us?</div>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-800">We turn strategy into measurable action</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/80">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-sky-100 text-3xl shadow-sm">{item.icon}</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-800">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="gallery" className="mt-10 rounded-[28px] border border-sky-100 bg-gradient-to-br from-white via-sky-50/40 to-slate-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-3xl font-semibold text-slate-800">Our Gallery</h2>
            <a href="#contact" className="text-sm font-semibold text-sky-700 hover:text-sky-800">View All Photos →</a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className="group overflow-hidden rounded-[24px] border border-sky-100 bg-slate-100 text-left shadow-sm shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <img src={image} alt="Consultancy workplace" className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
              </button>
            ))}
          </div>
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

        <section id="reviews" className="mt-10 rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-slate-50 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="mb-7 flex items-center justify-between">
            <h2 className="font-display text-3xl font-semibold text-slate-800 sm:text-4xl">Customer Reviews</h2>
            <a href="#contact" className="hidden text-sm font-semibold text-sky-700 hover:text-sky-800 sm:inline-flex">Share Your Experience →</a>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_1.35fr] xl:items-start">
            <div className="rounded-[26px] border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/80 sm:p-6">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Why people choose us</div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>“Extremely professional, responsive, and result-focused. The team helped us make clearer business decisions with confidence.”</p>
                <p>“Very knowledgeable consultants who listen carefully and provide practical solutions.”</p>
                <p>“Our experience was smooth from the first call to project completion. Highly recommended.”</p>
              </div>
            </div>

            <div className="rounded-[26px] border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/80 sm:p-6">
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

      <footer id="contact" className="mt-12 border-t border-sky-900/60 bg-[#0d2943] text-slate-200">
        <div className="mx-auto grid max-w-[1700px] gap-8 px-4 py-8 lg:grid-cols-[1.3fr_0.7fr_1fr_auto] lg:px-7">
          <div className="flex items-start gap-3">
            {businessLogo ? (
              <img src={businessLogo} alt={`${businessName} logo`} className="h-12 w-12 shrink-0 rounded-2xl bg-white object-contain p-1 shadow-sm" />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-[#0d2943] shadow-sm">
                {businessName.charAt(0).toUpperCase() || 'V'}
              </div>
            )}
            <div>
              <div className="font-display text-[1.8rem] font-bold tracking-tight text-white">{businessName}</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-200/90">{businessCategory}</div>
              <div className="mt-3 text-sm text-slate-300">{address}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-300">
              <li><a href="#about" className="transition hover:text-white">Home</a></li>
              <li><a href="#gallery" className="transition hover:text-white">Gallery</a></li>
              <li><a href="#about" className="transition hover:text-white">About</a></li>
              <li><a href="#reviews" className="transition hover:text-white">Reviews</a></li>
              <li><a href="#services" className="transition hover:text-white">Services</a></li>
              <li><a href="#contact" className="transition hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2"><span>☎</span> <span>{phone}</span></li>
              <li className="flex items-center gap-2"><span>✉</span> <span>{email}</span></li>
              <li className="flex items-center gap-2"><span>📍</span> <span>{address}</span></li>
            </ul>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 lg:items-end">
            <Link
              to={backLink}
              className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-transparent px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-white/5"
            >
              <span>←</span> Back to G-Pages
            </Link>

            <div className="flex items-center gap-3">
              <a href={whatsapp} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-lg text-white shadow-lg shadow-[#25D366]/20 transition hover:scale-105" aria-label="WhatsApp">
                f
              </a>
              <a href={instagram} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-lg font-bold text-white shadow-lg shadow-pink-500/20 transition hover:scale-105" aria-label="Instagram">
                ◎
              </a>
              <a href={website} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-lg font-bold text-white shadow-lg shadow-blue-700/20 transition hover:scale-105" aria-label="Website">
                in
              </a>
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

import React, { useMemo, useState } from 'react';
import ReviewsSection from '../../components/ReviewsSection';
import { getProfileData, ImageFrame, PublicVideoCard } from '../../components/public/PublicProfileShared';
import { getWhatsAppUrl } from '../healthcare-medical/healthcareUtils';

const DEFAULT_BOUTIQUE_SERVICES = [
  'Custom Stitching',
  'Bridal Wear',
  'Ethnic Wear',
  'Western Wear',
  'Party Wear',
  'Alterations',
  'Designer Consultation',
  'Blouse Designing',
];

const SERVICE_ICONS = {
  'Custom Stitching': '✂️',
  'Bridal Wear': '👑',
  'Ethnic Wear': '✨',
  'Western Wear': '👗',
  'Party Wear': '🌟',
  'Alterations': '🪡',
  'Designer Consultation': '💬',
  'Blouse Designing': '🌸',
  'Kids Collection': '🎀',
  'Accessories': '💎',
};

const toUrl = (value) => (value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : '');

export default function BoutiquePublicPage({ place }) {
  const profile = getProfileData(place);
  const specific = place.attributes?.businessProfile?.categorySpecific || place.attributes?.categorySpecific || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [lightbox, setLightbox] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const businessName = place.name || profile.businessName || 'Boutique';
  const tagline = profile.tagline || place.tagline || 'Exquisite Fashion & Custom Designs';
  const about = place.description || profile.about || '';
  const logo = profile.logo || place.logo;
  const coverImage = profile.coverImage || place.coverImage || place.images?.[0] || '';
  const aboutImage = profile.aboutImage || specific.aboutImage || place.images?.[1] || coverImage;

  // Extract raw lists safely
  const rawGallery = profile.gallery?.length ? profile.gallery : place.images || [];
  const gallery = useMemo(() => {
    return rawGallery.map((item, index) => ({
      src: typeof item === 'string' ? item : item?.url || item?.src || '',
      category: typeof item === 'object' ? item.category || item.type || 'All' : 'All',
      caption: typeof item === 'object' ? item.caption || item.title || '' : '',
      index,
    })).filter((item) => item.src).slice(0, 10);
  }, [rawGallery]);

  const rawVideos = profile.videos?.length
    ? profile.videos
    : place.videos?.length
      ? place.videos
      : Array.isArray(place.video)
        ? place.video
        : place.video
          ? [place.video]
          : [];
  const videos = useMemo(() => {
    return rawVideos
      .map((item) => (typeof item === 'string' ? { url: item } : item))
      .filter((item) => item?.url);
  }, [rawVideos]);

  // Dynamic Collections
  const collections = useMemo(() => {
    const raw = specific.collections || specific.productCategories || [];
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item) => {
        if (typeof item === 'string') return { name: item, description: '' };
        return {
          name: item.name || item.title || 'Collection',
          description: item.description || '',
          image: item.image || item.photo || '',
          price: item.price || item.range || '',
        };
      });
    }
    return [];
  }, [specific.collections, specific.productCategories]);

  // Dynamic Products / Featured Designs
  const products = useMemo(() => {
    const raw = specific.products || specific.featuredDesigns || specific.catalogue || [];
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item) => {
        if (typeof item === 'string') return { name: item, description: '' };
        return {
          name: item.name || item.title || 'Design',
          category: item.category || item.type || '',
          description: item.description || '',
          image: item.image || item.photo || item.url || '',
          price: item.price || item.priceRange || '',
        };
      });
    }
    return [];
  }, [specific.products, specific.featuredDesigns, specific.catalogue]);

  // Dynamic Services
  const services = useMemo(() => {
    const raw = specific.services || specific.specialtyServices || place.services || [];
    const list = Array.isArray(raw) ? raw.filter(Boolean) : String(raw).split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    const result = list.map((item) => (typeof item === 'object' ? item.name || item.title : item));
    return result.length > 0 ? result : DEFAULT_BOUTIQUE_SERVICES;
  }, [specific.services, specific.specialtyServices, place.services]);

  // Dynamic Brands
  const brands = useMemo(() => {
    const raw = specific.featuredBrands || specific.brands || [];
    return Array.isArray(raw) ? raw.filter(Boolean) : String(raw).split(/[\n,]/).map((b) => b.trim()).filter(Boolean);
  }, [specific.featuredBrands, specific.brands]);

  // Contact links
  const phone = place.phone || profile.phone || '';
  const whatsappNumber = place.socialLinks?.whatsapp || profile.socialMedia?.whatsapp || profile.whatsapp || phone;
  const whatsappUrl = getWhatsAppUrl(whatsappNumber);
  const callUrl = phone ? `tel:${String(phone).replace(/\s+/g, '')}` : '';
  const email = place.email || profile.email || '';
  const website = toUrl(place.website || profile.website);
  const socialLinks = profile.socialMedia || place.socialLinks || {};
  const mapUrl = place.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}` : '';
  const years = specific.yearsExperience || specific.yearsInBusiness || profile.yearsExperience;

  const galleryCategories = ['All', ...new Set(gallery.map((g) => g.category).filter((c) => c && c !== 'All'))];
  const visibleGallery = galleryFilter === 'All' ? gallery : gallery.filter((item) => item.category === galleryFilter);

  const navItems = [
    ['Home', '#home'],
    ['About', '#about'],
    ...(collections.length > 0 ? [['Collections', '#collections']] : []),
    ...(products.length > 0 ? [['Designs', '#designs']] : []),
    ['Services', '#services'],
    ...(gallery.length > 0 ? [['Gallery', '#gallery']] : []),
    ...(videos.length > 0 ? [['Videos', '#videos']] : []),
    ['Reviews', '#reviews'],
    ['Contact', '#contact'],
  ];

  return (
    <div className="min-h-screen bg-[#fffbf9] text-[#2c1820] font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#f5e3e8] bg-white/95 shadow-xs backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-7">
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#f5c6d3] bg-[#fff5f8]">
              {logo ? (
                <ImageFrame src={logo} alt={`${businessName} logo`} />
              ) : (
                <span className="grid h-full place-items-center font-serif text-xl font-bold text-[#861638]">
                  {businessName.slice(0, 1)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg font-bold text-[#861638] sm:text-xl">{businessName}</p>
              <p className="truncate text-[11px] text-[#70525d]">{tagline}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-xs font-semibold lg:flex">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} className="transition-colors hover:text-[#861638]">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {phone && (
              <a href={callUrl} className="inline-flex items-center gap-1.5 rounded-full border border-[#f5c6d3] bg-[#fff5f8] px-4 py-2 text-xs font-bold text-[#861638]">
                📞 Call Now
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#12a85a] px-4 py-2 text-xs font-bold text-white">
                💬 WhatsApp
              </a>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded border border-[#f5c6d3] px-3 py-2 text-lg lg:hidden"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-[#f5e3e8] bg-white px-4 py-3 lg:hidden">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-[#fcf0f3] py-2.5 text-sm font-semibold last:border-0"
              >
                {label}
              </a>
            ))}
            <div className="flex gap-2 pt-3">
              {phone && (
                <a href={callUrl} className="flex-1 rounded-full bg-[#861638] py-2.5 text-center text-xs font-bold text-white">
                  Call Now
                </a>
              )}
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#12a85a] py-2.5 text-center text-xs font-bold text-white">
                  WhatsApp
                </a>
              )}
            </div>
          </nav>
        )}
      </header>

      <main>
        {/* HERO SECTION */}
        <section id="home" className="relative isolate min-h-[480px] overflow-hidden bg-[#240a14] text-white sm:min-h-[550px]">
          {coverImage && (
            <div className="absolute inset-0">
              <ImageFrame src={coverImage} alt={`${businessName} cover`} eager />
              <div className="absolute inset-0 bg-gradient-to-r from-[#240a14]/95 via-[#240a14]/70 to-[#240a14]/30" />
            </div>
          )}
          <div className="relative mx-auto grid min-h-[480px] max-w-[1500px] items-center px-5 py-12 sm:min-h-[550px] sm:px-8 lg:grid-cols-[1.1fr_.9fr]">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#e8b488]">High Fashion &amp; Boutique</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-white">
                {businessName}
              </h1>
              <p className="mt-3 font-serif text-lg italic text-[#fce8ef] sm:text-xl">{tagline}</p>
              {about && <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{about}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={collections.length > 0 ? '#collections' : '#services'}
                  className="rounded-full bg-[#861638] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#6c102c]"
                >
                  Explore Collection →
                </a>
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/60 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/20"
                  >
                    Book Appointment
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div className="overflow-hidden rounded-2xl bg-[#f7e6eb] shadow-md">
              <ImageFrame src={aboutImage} alt={`About ${businessName}`} className="max-h-[420px] w-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#861638]">Our Story</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[#3d0c1e] sm:text-4xl">About Our Boutique</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#5c3e49] sm:text-base">{about || `${businessName} offers custom-tailored outfits and designer wear crafted with care and elegance.`}</p>

              {years && (
                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[#f5c6d3] bg-[#fff5f8] px-5 py-3">
                  <span className="font-serif text-3xl font-bold text-[#861638]">{years}+</span>
                  <span className="text-xs font-semibold text-[#70525d]">Years of Fashion Excellence</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* COLLECTIONS SECTION (Only if entered/selected by business) */}
        {collections.length > 0 && (
          <section id="collections" className="bg-[#fff3f6] px-5 py-12 sm:px-8">
            <div className="mx-auto max-w-[1500px]">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#861638]">Curated Outfits</p>
                  <h2 className="mt-1 font-serif text-3xl font-bold text-[#3d0c1e]">Featured Collections</h2>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {collections.map((col, idx) => (
                  <div key={`${col.name}-${idx}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#f5d0dc]">
                    {col.image && (
                      <div className="aspect-[4/5] overflow-hidden bg-[#fce8ef]">
                        <ImageFrame src={col.image} alt={col.name} className="transition duration-300 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-bold text-[#3d0c1e]">{col.name}</h3>
                      {col.description && <p className="mt-1 text-xs text-[#70525d] line-clamp-2">{col.description}</p>}
                      {col.price && <p className="mt-2 text-xs font-bold text-[#861638]">{col.price}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURED DESIGNS / PRODUCTS */}
        {products.length > 0 && (
          <section id="designs" className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#861638]">Exclusive Showcase</p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-[#3d0c1e]">Featured Designs</h2>
            </div>

            <div className="mt-7 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#f5d0dc]">
                  {item.image && (
                    <button type="button" onClick={() => setSelectedProduct(item)} className="block w-full aspect-[3/4] overflow-hidden bg-[#fce8ef]">
                      <ImageFrame src={item.image} alt={item.name} className="transition duration-300 hover:scale-105" />
                    </button>
                  )}
                  <div className="p-4">
                    <h3 className="font-serif text-base font-bold text-[#3d0c1e]">{item.name}</h3>
                    {item.category && <p className="text-[11px] font-semibold text-[#861638] uppercase tracking-wider">{item.category}</p>}
                    {item.description && <p className="mt-1 text-xs text-[#70525d] line-clamp-2">{item.description}</p>}
                    {item.price && <p className="mt-2 text-xs font-bold text-[#861638]">{item.price}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SERVICES SECTION */}
        <section id="services" className="bg-[#fff8fa] px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-[1500px]">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#861638]">What We Offer</p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-[#3d0c1e]">Boutique Services</h2>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service, idx) => (
                <div key={`${service}-${idx}`} className="rounded-2xl border border-[#f5c6d3] bg-white p-5 shadow-xs transition hover:shadow-md">
                  <span className="text-2xl">{SERVICE_ICONS[service] || '✨'}</span>
                  <h3 className="mt-3 font-serif text-lg font-bold text-[#3d0c1e]">{service}</h3>
                  <p className="mt-1 text-xs text-[#70525d]">Tailored specifically to match your vision and personal taste.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BRANDS SECTION (Only if provided) */}
        {brands.length > 0 && (
          <section className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8">
            <h3 className="text-center font-serif text-xl font-bold text-[#3d0c1e]">Featured Brands</h3>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {brands.map((b) => (
                <span key={b} className="rounded-full border border-[#f5c6d3] bg-[#fff5f8] px-5 py-2 text-xs font-bold text-[#861638]">
                  {b}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* GALLERY SECTION */}
        {gallery.length > 0 && (
          <section id="gallery" className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#861638]">Lookbook</p>
                <h2 className="mt-1 font-serif text-3xl font-bold text-[#3d0c1e]">Boutique Gallery</h2>
              </div>
              {galleryCategories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {galleryCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGalleryFilter(cat)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                        galleryFilter === cat ? 'bg-[#861638] text-white' : 'border border-[#f5c6d3] bg-white text-[#5c3e49]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {visibleGallery.map((item) => (
                <button
                  key={`${item.src}-${item.index}`}
                  type="button"
                  onClick={() => setLightbox(item.src)}
                  className="aspect-[3/4] overflow-hidden rounded-2xl bg-[#f7e6eb] shadow-sm transition hover:opacity-95"
                >
                  <ImageFrame src={item.src} alt={`${businessName} gallery photo ${item.index + 1}`} />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* VIDEOS SECTION */}
        {videos.length > 0 && (
          <section id="videos" className="bg-[#fff3f6] px-5 py-12 sm:px-8">
            <div className="mx-auto max-w-[1500px]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#861638]">Video Showcase</p>
                <h2 className="mt-1 font-serif text-3xl font-bold text-[#3d0c1e]">Watch Our Creations</h2>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video, idx) => (
                  <PublicVideoCard key={`${video.url}-${idx}`} video={video} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* REVIEWS SECTION */}
        <section id="reviews" className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#861638]">Testimonials</p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-[#3d0c1e]">Customer Reviews</h2>
          </div>
          <div className="mt-6 rounded-2xl border border-[#f5c6d3] bg-white p-5 shadow-xs sm:p-7">
            <ReviewsSection placeId={place._id} />
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="bg-[#2a0815] px-5 py-12 text-white sm:px-8">
          <div className="mx-auto grid max-w-[1500px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Visit Our Boutique</h3>
              <p className="mt-3 text-xs leading-relaxed text-[#f7dbe4]">{place.address || 'Address not provided'}</p>
              {mapUrl && (
                <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-full border border-[#f5c6d3] px-4 py-2 text-xs font-bold text-white">
                  ⌖ View on Google Maps
                </a>
              )}
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-white">Contact Info</h3>
              <div className="mt-3 space-y-2 text-xs text-[#f7dbe4]">
                {phone && <a href={callUrl} className="block hover:underline">📞 {phone}</a>}
                {email && <a href={`mailto:${email}`} className="block hover:underline">✉️ {email}</a>}
                {website && <a href={website} target="_blank" rel="noreferrer" className="block hover:underline">🌐 Visit Official Website</a>}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-white">Social Media</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(socialLinks).filter(([, val]) => val).map(([net, val]) => (
                  <a
                    key={net}
                    href={net === 'whatsapp' ? whatsappUrl : toUrl(val)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold capitalize text-white hover:bg-white/20"
                  >
                    {net}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-white">G-Pages Platform</h3>
              <p className="mt-3 text-xs text-[#f7dbe4]">Powered by G-Pages</p>
              <div className="mt-4 flex gap-2">
                <a href="/" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#2a0815]">
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#3d0f20] bg-[#1a040d] px-5 py-6 text-center text-xs text-[#d6b2bf]">
        <div className="mx-auto max-w-[1500px]">
          <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
        </div>
      </footer>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4"
          onClick={() => setLightbox('')}
        >
          <button
            type="button"
            onClick={() => setLightbox('')}
            className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-bold text-black"
          >
            Close ✕
          </button>
          <img src={lightbox} alt="Gallery view" className="max-h-[90vh] max-w-[94vw] rounded-xl object-contain" />
        </div>
      )}

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 text-xl font-bold text-gray-500 hover:text-black"
            >
              ✕
            </button>
            {selectedProduct.image && (
              <img src={selectedProduct.image} alt={selectedProduct.name} className="h-64 w-full rounded-xl object-cover" />
            )}
            <h3 className="mt-4 font-serif text-2xl font-bold text-[#3d0c1e]">{selectedProduct.name}</h3>
            {selectedProduct.category && <p className="text-xs font-bold text-[#861638] uppercase mt-1">{selectedProduct.category}</p>}
            {selectedProduct.description && <p className="mt-2 text-sm text-[#70525d]">{selectedProduct.description}</p>}
            {selectedProduct.price && <p className="mt-3 text-base font-bold text-[#861638]">{selectedProduct.price}</p>}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block w-full rounded-full bg-[#12a85a] py-3 text-center text-sm font-bold text-white"
              >
                Enquire via WhatsApp 💬
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import ReviewsSection from '../ReviewsSection';

export function ChandhuuRetailGenericLayout({ place, mapsUrl, socialLinks = {}, onShare, onReport }) {
  const gallery = place.images || [];
  const categoryMatches = (value) => String(value || '').toLowerCase();
  const retailName = categoryMatches(place.subcategory?.name || place.attributes?.subCategory || place.category?.name);
  const isHomeAppliancesCategory = /home appliances|appliance|refrigerator|washing machine|air conditioner|led tv|microwave/.test(retailName);
  const isFurnitureShopCategory = /furniture|wardrobe|sofa|bedroom|dining room|office furniture/.test(retailName);
  const isMattressShopCategory = /mattress|sleep|bed/.test(retailName);
  const categoryFacilityDefaults = isHomeAppliancesCategory
    ? ['Product demonstration area', 'Installation service', 'Repair and maintenance support', 'Home delivery', 'Warranty assistance', 'EMI and digital payments']
    : isFurnitureShopCategory
      ? ['Furniture display showroom', 'Custom design and measurements', 'Home delivery', 'Assembly and installation', 'Interior consultation', 'EMI and digital payments']
      : isMattressShopCategory
        ? ['Mattress trial area', 'Sleep comfort consultation', 'Custom size options', 'Home delivery', 'Old mattress exchange', 'Warranty support']
        : null;
  const handleShare = onShare;
  const isShoppingCategory = /shopping|mall|retail|boutique|appliance|furniture|mattress|nursery|store|electronics|fashion/.test(categoryMatches(place.subcategory?.name || place.category?.name));

  const shoppingMallServices = [
    'Multi-brand shopping',
    'Fashion & lifestyle',
    'Electronics & gadgets',
    'Home & decor',
    'Food court access',
    'Family-friendly zones',
    'Easy parking',
    'Gift & seasonal offers',
  ];

  const shoppingMallFacilities = [
    'Free parking',
    'Elevators & escalators',
    'Food court',
    'Rest rooms',
    'Security & CCTV',
    'Kids play area',
    'Premium brands',
    'Easy accessibility',
  ];

  const defaultServices = isShoppingCategory
    ? shoppingMallServices
    : [
        'Walk-in service',
        'Online enquiries',
        'Verified information',
        'Customer support',
        'Easy access',
        'Digital payments',
      ];

  const defaultFacilities = categoryFacilityDefaults || (isShoppingCategory
    ? shoppingMallFacilities
    : [
        'Easy access',
        'Digital payments',
        'Customer support',
        'Free parking',
        'Family seating',
        '24/7 assistance',
      ]);

  const displayServices = place.services?.length ? place.services : defaultServices;
  const displayFacilities = place.facilities?.length ? place.facilities : defaultFacilities;
  const primaryPhoto = place.coverImage || gallery[0];
  const galleryPhotos = [...new Set([...(place.coverImage ? [place.coverImage] : []), ...gallery].filter(Boolean))].slice(0, 10);
  const whatsappNumber = socialLinks.whatsapp?.replace(/\D/g, '') || place.phone?.replace(/\D/g, '') || '919999999999';
  const whatsappUrl = socialLinks.whatsapp
    ? (socialLinks.whatsapp.startsWith('http') ? socialLinks.whatsapp : `https://wa.me/${whatsappNumber}`)
    : `https://wa.me/${whatsappNumber}`;
  const instagramUrl = socialLinks.instagram || 'https://instagram.com';
  const facebookUrl = socialLinks.facebook || 'https://facebook.com';
  const websiteUrl = place.website && (place.website.startsWith('http') ? place.website : `https://${place.website}`);
  const aboutSummary = place.description || 'Premium brands, family shopping, and daily essentials under one roof.';
  const heroVideoUrl = place.video || 'https://www.youtube.com/embed/7w3a7VjTEYQ';

  const shoppingCollections = [
    { name: 'Sarees', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80' },
    { name: 'Designer Wear', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80' },
    { name: 'Bridal Wear', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80' },
    { name: 'Party Wear', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Kurtis', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80' },
    { name: 'Lehengas', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80' },
    { name: 'Western Wear', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80' },
  ];

  const shoppingArrivals = [
    { name: 'Royal Blue Saree', price: '₹ 5,999', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80' },
    { name: 'Floral Midi Dress', price: '₹ 3,499', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80' },
    { name: 'Bridal Lehenga', price: '₹ 18,999', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80' },
    { name: 'Designer Kurta Set', price: '₹ 6,299', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80' },
  ];

  const shoppingBrandLogos = [
    { name: 'Fashion', icon: '✦', tint: 'from-pink-100 to-rose-200' },
    { name: 'Electronics', icon: '•', tint: 'from-cyan-100 to-sky-200' },
    { name: 'Home', icon: '•', tint: 'from-amber-100 to-yellow-200' },
    { name: 'Dining', icon: '✦', tint: 'from-orange-100 to-red-200' },
    { name: 'Lifestyle', icon: '◇', tint: 'from-violet-100 to-purple-200' },
  ];

  return (
    <div className="container-page py-8">
      <div className="space-y-6">
        {isShoppingCategory && (
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-sm">
            <Link to="#top" className="font-display text-xl font-semibold text-ink">{place.name}</Link>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-ink/65">
              <a href="#collections" className="hover:text-ink">Collections</a>
              <a href="#services" className="hover:text-ink">Services</a>
              <a href="#contact" className="hover:text-ink">Contact</a>
            </nav>
            {place.phone && <a href={`tel:${place.phone}`} className="rounded-lg bg-[#b77b4f] px-4 py-2 text-sm font-semibold text-white">Call shop</a>}
          </header>
        )}
        <section className="overflow-hidden rounded-[30px] border border-[#e9dcc7] bg-[#f5efe8] shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#b97d3d]">Tradition meets trend</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{place.name}</h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink/60">Discover timeless fashion and elegant styles for every occasion with curated boutique collections.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button onClick={handleShare} className="rounded-md bg-[#b77b4f] px-5 py-3 text-sm font-medium text-white shadow-sm">Explore Collection</button>
                <button onClick={() => onReport?.()} className="rounded-md border border-[#d7c5ad] bg-white px-5 py-3 text-sm font-medium text-ink/75">Book Appointment</button>
              </div>
            </div>

            <div className="relative min-h-[420px]">
              <img src={primaryPhoto} alt={`${place.name} hero`} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section id="collections" className="rounded-[24px] border border-line bg-[#f8f7f4] p-5 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold text-ink">Our Collections</h2>
            <span className="text-sm text-ink/50">Explore our range</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {shoppingCollections.map((item) => (
              <div key={item.name} className="overflow-hidden rounded-[18px] border border-line bg-white shadow-sm">
                <img src={item.image} alt={item.name} className="h-28 w-full object-cover" />
                <div className="p-3">
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="mt-1 text-[10px] text-ink/40">View collection</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[24px] border border-line bg-white shadow-sm">
            <img src={primaryPhoto} alt={`${place.name} interior`} className="h-[330px] w-full object-cover" />
          </div>

          <div className="rounded-[24px] border border-line bg-[#f8f7f4] p-6 sm:p-8">
            <h3 className="font-display text-3xl font-semibold text-ink">About {place.name}</h3>
            <p className="mt-4 text-base leading-relaxed text-ink/60">{aboutSummary}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {['10+ Years of Experience', 'Custom Tailoring', 'Personal Styling', 'Designer Collections'].map((feature) => (
                <div key={feature} className="rounded-xl border border-line bg-white p-3 text-sm font-medium text-ink/75">{feature}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="rounded-[24px] border border-line bg-[#f8f7f4] p-6 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="font-display text-3xl font-semibold text-ink">New Arrivals</h3>
            <button onClick={handleShare} className="text-sm text-ink/60 hover:text-ink">View all →</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shoppingArrivals.map((item) => (
              <div key={item.name} className="overflow-hidden rounded-[20px] border border-line bg-white shadow-sm">
                <img src={item.image} alt={item.name} className="h-72 w-full object-cover" />
                <div className="p-4">
                  <p className="text-lg font-semibold text-ink">{item.name}</p>
                  <p className="mt-2 text-sm text-ink/60">{item.price}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-md border border-[#d7c5ad] bg-white px-3 py-2 text-xs font-medium text-ink/75">View Details</button>
                    <button className="rounded-md bg-[#b77b4f] px-3 py-2 text-xs font-medium text-white">Buy</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-line bg-[#f8f7f4] p-6 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
          <h3 className="font-display text-3xl font-semibold text-ink">Our Services</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {['Custom Stitching', 'Alterations', 'Personal Styling', 'Bridal Consultation', 'Custom Designs'].map((service) => (
              <div key={service} className="rounded-[18px] border border-line bg-[#f4f7fb] p-4 text-center text-sm font-medium text-ink/70">{service}</div>
            ))}
          </div>
        </section>

        <section id="contact" className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[24px] border border-line bg-[#f8f7f4] p-6 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
            <h3 className="font-display text-3xl font-semibold text-ink">Directions</h3>
            <div className="mt-4 space-y-3 text-sm text-ink/75">
              {place.address && <p className="rounded-[12px] border border-line bg-white px-3 py-2">⌖ {place.address}</p>}
              {place.phone && <a href={`tel:${place.phone}`} className="block rounded-[12px] border border-line bg-white px-3 py-2 hover:text-ink">☎ {place.phone}</a>}
              {place.email && <a href={`mailto:${place.email}`} className="block rounded-[12px] border border-line bg-white px-3 py-2 hover:text-ink">✉ {place.email}</a>}
              {websiteUrl && <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="block rounded-[12px] border border-line bg-white px-3 py-2 text-vermilion hover:underline">↗ Visit official website</a>}
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block rounded-[12px] border border-line bg-white px-3 py-2 text-vermilion hover:underline">⌖ Get directions</a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block rounded-[12px] border border-line bg-white px-3 py-2 text-[#25d366] hover:underline">● WhatsApp</a>
            </div>
          </div>

          <div className="rounded-[24px] border border-line bg-[#f8f7f4] p-6 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
            <h3 className="font-display text-3xl font-semibold text-ink">Contact us</h3>
            <div className="mt-4 flex flex-col gap-3">
              <input placeholder="Your name" className="rounded-[12px] border border-line bg-white px-3 py-3 text-sm text-ink placeholder:text-ink/45 outline-none focus:border-[#8bb8d9]" />
              <input placeholder="Email" className="rounded-[12px] border border-line bg-white px-3 py-3 text-sm text-ink placeholder:text-ink/45 outline-none focus:border-[#8bb8d9]" />
              <input placeholder="Phone (optional)" className="rounded-[12px] border border-line bg-white px-3 py-3 text-sm text-ink placeholder:text-ink/45 outline-none focus:border-[#8bb8d9]" />
              <textarea rows={5} placeholder="What would you like to ask?" className="rounded-[12px] border border-line bg-white px-3 py-3 text-sm text-ink placeholder:text-ink/45 outline-none focus:border-[#8bb8d9]" />
            </div>
            <button className="mt-4 w-full rounded-[14px] bg-[#0d2f4d] px-4 py-3 text-base font-semibold text-white shadow-lg shadow-[#0d2f4d]/10 transition hover:bg-[#123b5d]">
              Send enquiry
            </button>
          </div>
        </section>

        <section id="reviews" className="rounded-[24px] border border-line bg-[#f8f7f4] p-6 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
          <ReviewsSection placeId={place._id} />
        </section>

        {isShoppingCategory && (
          <footer className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#241b17] px-5 py-5 text-sm text-white/75">
            <span className="font-semibold text-white">{place.name}</span>
            <span>{place.address}</span>
            <span>© {new Date().getFullYear()} {place.name}</span>
          </footer>
        )}
      </div>

      
    </div>
  );
}



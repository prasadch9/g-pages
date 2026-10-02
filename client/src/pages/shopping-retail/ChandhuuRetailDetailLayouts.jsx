import React from 'react';

export function HomeAppliancesDetailLayout({ place, mapsUrl, socialLinks, onShare, onReport }) {
  const heroImage = place.coverImage || place.images?.[0] || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80';
  const categoryCards = [
    { name: 'Refrigerators', image: 'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?auto=format&fit=crop&w=900&q=80' },
    { name: 'Washing Machines', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaa1b2?auto=format&fit=crop&w=900&q=80' },
    { name: 'Air Conditioners', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80' },
    { name: 'LED TVs', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80' },
    { name: 'Microwave Ovens', image: 'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?auto=format&fit=crop&w=900&q=80' },
    { name: 'Kitchen Appliances', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80' },
    { name: 'Small Appliances', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80' },
    { name: 'Home Audio', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80' },
  ];

  const featuredProducts = [
    { name: 'Refrigerator', price: '₹ 28,990', image: 'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?auto=format&fit=crop&w=900&q=80' },
    { name: 'Washing Machine', price: '₹ 32,490', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaa1b2?auto=format&fit=crop&w=900&q=80' },
    { name: 'LED TV', price: '₹ 49,990', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80' },
    { name: 'Microwave Oven', price: '₹ 9,990', image: 'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?auto=format&fit=crop&w=900&q=80' },
    { name: 'Air Conditioner', price: '₹ 38,990', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80' },
  ];

  const brandLogos = ['SAMSUNG', 'LG', 'Whirlpool', 'Haier', 'IFB', 'BOSCH', 'Panasonic', 'HITACHI'];
  const facilityCards = [
    { title: 'Wide Range', icon: '•' },
    { title: 'Expert Guidance', icon: '•' },
    { title: 'Easy EMI', icon: '•' },
    { title: 'Installation', icon: '✦' },
    { title: 'Warranty Support', icon: '✦' },
    { title: 'Special Offers', icon: '•' },
  ];

  const websiteUrl = place.website && (place.website.startsWith('http') ? place.website : `https://${place.website}`);
  const phoneHref = place.phone ? `tel:${place.phone}` : '#';
  const whatsappUrl = socialLinks.whatsapp
    ? (socialLinks.whatsapp.startsWith('http') ? socialLinks.whatsapp : `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`)
    : `https://wa.me/${place.phone?.replace(/\D/g, '') || '919999999999'}`;

  return (
    <div className="container-page py-5">
      <header className="rounded-t-[18px] border border-line bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-[#1d4ed8] to-[#0ea5e9] text-sm font-bold text-white">{place.name.charAt(0).toUpperCase()}</div>
            <div className="font-display text-xl font-semibold text-ink">{place.name}</div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-ink/70 md:flex">
            {['Home', 'About Us', 'Gallery', 'Products', 'Services', 'Videos', 'Contact Us'].map((item) => (
              <a key={item} href="#" className="hover:text-ink">{item}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <div className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink/60">
              <span>⌕</span>
              <span>Search for Home Appliances...</span>
            </div>
            <button className="ml-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white">Call Now</button>
          </div>
        </div>
      </header>

      <main className="rounded-b-[18px] border-x border-b border-line bg-[#f3f5f7] p-4 sm:p-6">
        <section className="grid gap-5 overflow-hidden rounded-[20px] bg-[#eff7fb] p-4 shadow-sm md:grid-cols-[0.95fr_1.05fr] md:p-6">
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2b6cb0]">Home appliances</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">Modern Living Starts at Home</h1>
            <p className="mt-4 text-base text-ink/60">Top brands • Best prices • Trusted quality</p>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/55">
              Upgrade your home with the latest home appliances for a smarter, easier, and more comfortable lifestyle.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={onShare} className="rounded-md bg-[#1d4ed8] px-5 py-2.5 text-sm font-medium text-white">Explore Products</button>
              <a href={phoneHref} className="rounded-md border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink/70">Book Appointment</a>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ['Free Delivery', 'On Select Products'],
                ['Brand Warranty', '100% Genuine Products'],
                ['Expert Support', 'Before & After Purchase'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-line bg-white p-3 shadow-sm">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-[11px] text-ink/55">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-[20px] bg-white">
            <img src={heroImage} alt={place.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute right-4 top-4 rounded-full bg-[#0ea5e9] px-3 py-2 text-xs font-semibold text-white shadow-lg">Smart Homes • Happy Lives</div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold text-ink">Shop by Category</h2>
            <a href="#" className="text-sm text-ink/60 hover:text-ink">View All Categories →</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((item, index) => (
              <div key={item.name} className="overflow-hidden rounded-[18px] border border-line bg-white shadow-sm">
                <img src={item.image} alt={item.name} className="h-32 w-full object-cover" />
                <div className="p-4 text-center">
                  <p className="text-lg font-semibold text-ink">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold text-ink">Featured Products</h2>
            <a href="#" className="text-sm text-ink/60 hover:text-ink">View All Products →</a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {featuredProducts.map((product) => (
              <div key={product.name} className="overflow-hidden rounded-[18px] border border-line bg-white p-3 shadow-sm">
                <img src={product.image} alt={product.name} className="h-32 w-full rounded-lg object-cover" />
                <div className="mt-3">
                  <p className="text-base font-semibold text-ink">{product.name}</p>
                  <p className="mt-1 text-sm text-ink/50">{product.price}</p>
                  <button className="mt-3 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[20px] border border-line bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-3xl font-semibold text-ink">Watch Our Video</h2>
            </div>
            <div className="overflow-hidden rounded-[16px] border border-line bg-[#edf6fb]">
              <iframe
                src="https://www.youtube.com/embed/7w3a7VjTEYQ"
                title={`${place.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-[280px] w-full"
              />
            </div>
          </div>

          <div className="rounded-[20px] border border-line bg-white p-5 shadow-sm">
            <h2 className="font-display text-3xl font-semibold text-ink">Our Facilities</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {facilityCards.map((item) => (
                <div key={item.title} className="rounded-[14px] border border-line bg-[#f4f8fc] p-4 text-center">
                  <div className="text-2xl">{item.icon}</div>
                  <p className="mt-2 text-sm font-semibold text-ink">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[20px] border border-line bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold text-ink">Top Brands We Deal With</h2>
            <a href="#" className="text-sm text-ink/60 hover:text-ink">View All Reviews →</a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {brandLogos.map((brand) => (
              <div key={brand} className="flex h-16 items-center justify-center rounded-lg border border-line bg-[#f7fbff] text-sm font-bold text-ink/70">{brand}</div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[20px] border border-line bg-white p-5 shadow-sm">
            <h2 className="font-display text-3xl font-semibold text-ink">About Us</h2>
            <p className="mt-4 text-base leading-relaxed text-ink/60">
              G-PAGES brings you the best home appliances from top brands at competitive prices. We are committed to providing quality products, expert guidance, and seamless shopping experiences for every home.
            </p>
            <button className="mt-5 rounded-md bg-[#1d4ed8] px-5 py-2.5 text-sm font-medium text-white">Learn More About Us</button>
          </div>

          <div className="rounded-[20px] border border-line bg-white p-5 shadow-sm">
            <h2 className="font-display text-3xl font-semibold text-ink">What Our Customers Say</h2>
            <div className="mt-4 space-y-3">
              {[
                '“Excellent service and genuine products. Highly recommended.”',
                '“Reliable service and prompt delivery. Very happy with the purchase.”',
              ].map((quote) => (
                <div key={quote} className="rounded-[14px] border border-line bg-[#f7fbff] p-4 text-sm leading-relaxed text-ink/65">{quote}</div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-10 rounded-[18px] bg-[#071d33] px-5 py-6 text-paper/80" data-mobile-footer-layout="columns">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <div className="font-display text-2xl font-semibold text-paper">{place.name}</div>
              <p className="mt-3 text-sm leading-relaxed text-paper/70">Your trusted destination for home appliances, smart living, and quality essentials.</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-paper/55">Quick Links</p>
              <ul className="mt-3 space-y-2 text-sm text-paper/75">
                <li>Home</li>
                <li>About Us</li>
                <li>Gallery</li>
                <li>Products</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-paper/55">Contact Us</p>
              <ul className="mt-3 space-y-2 text-sm text-paper/75">
                <li>{place.phone || '+91 98765 43210'}</li>
                <li>{place.email || 'support@gpages.com'}</li>
                <li>{place.address || 'Shop No. 12, Main Road, Rajahmundry'}</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-paper/55">Subscribe</p>
              <div className="mt-3 flex">
                <input placeholder="Enter your email address" className="w-full rounded-l-md border border-r-0 border-paper/20 bg-white/5 px-3 py-2 text-sm text-paper placeholder:text-paper/35 outline-none" />
                <button className="rounded-r-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-paper/10 pt-4 text-xs text-paper/40">© {new Date().getFullYear()} {place.name}. All rights reserved.</div>
        </footer>
      </main>
    </div>
  );
}

export function MattressDetailLayout({ place, mapsUrl, socialLinks, onShare, onReport }) {
  const heroImage = place.coverImage || place.images?.[0] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80';
  const mattressTypes = [
    { name: 'Spring Mattresses', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Memory Foam Mattresses', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Latex Mattresses', image: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&q=80' },
    { name: 'Orthopedic Mattresses', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Hybrid Mattresses', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80' },
    { name: 'Kids Mattresses', image: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&q=80' },
  ];

  const featuredProducts = [
    { name: 'Spring Comfort Mattress', price: '₹ 18,999', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Memory Foam Mattress', price: '₹ 22,499', image: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&q=80' },
    { name: 'Latex Mattress', price: '₹ 27,999', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Orthopedic Mattress', price: '₹ 21,999', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80' },
    { name: 'Hybrid Mattress', price: '₹ 24,999', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Kids Mattress', price: '₹ 12,999', image: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&q=80' },
  ];

  const galleryImages = [
    heroImage,
    'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  ];

  const rating = 4.9;
  const websiteUrl = place.website && (place.website.startsWith('http') ? place.website : `https://${place.website}`);
  const whatsappUrl = socialLinks.whatsapp
    ? (socialLinks.whatsapp.startsWith('http') ? socialLinks.whatsapp : `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`)
    : `https://wa.me/${place.phone?.replace(/\D/g, '') || '919999999999'}`;

  return (
    <div className="container-page py-5">
      <header className="border-b border-line bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1d4ed8] text-base font-bold text-white shadow-sm">D</div>
            <div>
              <div className="font-display text-2xl font-semibold text-ink">DreamRest</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/50">Better Sleep</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-ink/70 md:flex">
            {['Home', 'About Us', 'Mattresses', 'Collections', 'Reviews', 'Contact'].map((item) => (
              <a key={item} href="#" className="hover:text-ink">{item}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button className="rounded-full border border-line px-3 py-2 text-sm text-ink/70">Search</button>
            <button className="rounded-full bg-[#1d4ed8] px-4 py-2 text-sm font-medium text-white">Call Now</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] bg-[#f5f7fb] px-3 pb-6 pt-5 sm:px-5 lg:px-6">
        <section className="overflow-hidden rounded-[20px] bg-white shadow-sm">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center bg-[linear-gradient(135deg,#0d1b2a,#1e3a5f_50%,#3d5674)] p-6 text-white sm:p-8 lg:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#cfe8ff]">Better sleep | healthier life</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">Premium Mattresses for a Dreamy Tomorrow</h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
                Experience unmatched comfort, support, and durability with our range of premium mattresses designed for every sleeper.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={onShare} className="rounded-md bg-[#2563eb] px-5 py-2.5 text-sm font-medium text-white">Explore Collection</button>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white">Contact Us</a>
              </div>
            </div>

            <div className="relative min-h-[310px] bg-[#edf4ff] md:min-h-[420px]">
              <img src={heroImage} alt={`${place.name} mattress hero`} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute bottom-5 right-5 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-ink shadow-lg">★★★★★ {rating}</div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
          <div className="overflow-hidden rounded-[18px] border border-line bg-white shadow-sm">
            <img src={galleryImages[1]} alt={`${place.name} showroom`} className="h-full w-full object-cover" />
          </div>

          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">About us</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Your Comfort, Our Priority</h2>
            <p className="mt-3 text-base leading-relaxed text-ink/60">
              At DreamRest, we believe that a good night’s sleep is the foundation of a healthier lifestyle. Our premium mattresses are designed to deliver the right balance of softness, support, and durability for every body type and sleeping style.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Premium Quality', 'Mattresses'],
                ['10+ Years', 'Experience'],
                ['Trusted', 'Brands'],
                ['Expert', 'Consultation'],
              ].map(([heading, value]) => (
                <div key={heading} className="rounded-xl border border-line bg-[#f4f8ff] p-3">
                  <p className="font-display text-2xl font-semibold text-[#1d4ed8]">{heading}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-ink/55">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a href={websiteUrl || whatsappUrl} target="_blank" rel="noreferrer" className="rounded-md bg-[#2563eb] px-5 py-2.5 text-sm font-medium text-white">Read More</a>
              <button onClick={onReport} className="rounded-md border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink/70">Get Quote</button>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">Mattress types</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Shop by Mattress Type</h2>
            </div>
            <button className="text-sm text-ink/60 hover:text-ink">View All Collections →</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mattressTypes.map((item) => (
              <div key={item.name} className="overflow-hidden rounded-[18px] border border-line bg-[#f5f8ff] shadow-sm">
                <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <p className="text-base font-semibold text-ink">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">Featured products</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Featured Mattresses</h2>
            </div>
            <button className="text-sm text-ink/60 hover:text-ink">View All Products →</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <div key={product.name} className="overflow-hidden rounded-[18px] border border-line bg-[#f9fbff] shadow-sm">
                <img src={product.image} alt={product.name} className="h-52 w-full object-cover" />
                <div className="p-4">
                  <p className="text-lg font-semibold text-ink">{product.name}</p>
                  <p className="mt-1 text-sm text-[#1d4ed8]">{product.price}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-md border border-[#b9d0ff] bg-white px-3 py-2 text-xs font-medium text-ink/75">View Details</button>
                    <button className="rounded-md bg-[#2563eb] px-3 py-2 text-xs font-medium text-white">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">Why choose us</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Why Choose DreamRest?</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Premium Quality', 'Durable materials and expert craftsmanship'],
              ['Affordable Pricing', 'Comfortable sleep without overspending'],
              ['Free Delivery', 'Fast delivery across your city'],
              ['10 Years Warranty', 'Reliable support when you need it'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[14px] border border-line bg-[#f4f8ff] p-4 text-center">
                <p className="text-base font-semibold text-ink">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">Special offers</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Up to 40% Off</h2>
            <p className="mt-3 text-base text-ink/60">Upgrade your sleep with seasonal discounts and special bundles on premium mattresses.</p>
            <button className="mt-5 rounded-md bg-[#2563eb] px-5 py-2.5 text-sm font-medium text-white">Shop Now</button>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-line bg-white shadow-sm">
            <img src={galleryImages[3]} alt={`${place.name} offer`} className="h-full w-full object-cover" />
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">Gallery</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Our Gallery</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {galleryImages.map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt={`${place.name} gallery ${index + 1}`} className="h-32 w-full rounded-[12px] object-cover" />
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">Customer reviews</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">What Our Customers Say</h2>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-ink/65">
              <div className="rounded-[12px] border border-line bg-[#f4f8ff] p-4">“Excellent service and very comfortable mattresses. Highly recommended.”</div>
              <div className="rounded-[12px] border border-line bg-[#f4f8ff] p-4">“Great quality, prompt delivery, and very helpful staff. We are happy with our purchase.”</div>
            </div>
          </div>
        </section>

        <footer className="mt-8 rounded-[18px] bg-[#071d33] px-5 py-6 text-paper/80" data-mobile-footer-layout="columns">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <div className="font-display text-2xl font-semibold text-paper">DreamRest</div>
              <p className="mt-3 text-sm leading-relaxed text-paper/70">Better Sleep, Healthier Life.</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-paper/55">Quick Links</p>
              <ul className="mt-3 space-y-2 text-sm text-paper/75">
                <li>Home</li>
                <li>About Us</li>
                <li>Mattresses</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-paper/55">Contact</p>
              <ul className="mt-3 space-y-2 text-sm text-paper/75">
                <li>{place.phone || '+91 98765 43210'}</li>
                <li>{place.email || 'support@dreamrest.com'}</li>
                <li>{place.address || 'Main Road, Rajahmundry'}</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-paper/55">Subscribe</p>
              <div className="mt-3 flex">
                <input placeholder="Your email" className="w-full rounded-l-md border border-r-0 border-paper/20 bg-white/5 px-3 py-2 text-sm text-paper placeholder:text-paper/35 outline-none" />
                <button className="rounded-r-md bg-[#2563eb] px-4 py-2 text-sm font-medium text-white">Join</button>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-paper/10 pt-4 text-xs text-paper/40">© {new Date().getFullYear()} DreamRest. All rights reserved.</div>
        </footer>
      </main>
    </div>
  );
}

export function NurseryDetailLayout({ place, mapsUrl, socialLinks, onShare, onReport }) {
  const heroImage = place.coverImage || place.images?.[0] || 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1400&q=80';
  const categoryCards = [
    { name: 'Indoor Plants', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Outdoor Plants', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Flowering Plants', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Fruit Plants', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Herbs & Medicinal Plants', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Succulents & Cactus', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80' },
    { name: 'Garden Accessories', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Seeds & Soil', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
  ];

  const featuredPlants = [
    { name: 'Peace Lily', price: '₹ 399', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Money Plant', price: '₹ 249', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Rose Plant', price: '₹ 349', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Tulsi Plant', price: '₹ 199', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
    { name: 'Areca Palm', price: '₹ 599', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80' },
    { name: 'Cactus Mix', price: '₹ 299', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80' },
  ];

  const galleryImages = [
    heroImage,
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
  ];

  const services = [
    'Plant Sale',
    'Landscaping',
    'Garden Design',
    'Plant Care',
    'Bulk Orders',
    'Home Delivery',
  ];

  const websiteUrl = place.website && (place.website.startsWith('http') ? place.website : `https://${place.website}`);
  const whatsappUrl = socialLinks.whatsapp
    ? (socialLinks.whatsapp.startsWith('http') ? socialLinks.whatsapp : `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`)
    : `https://wa.me/${place.phone?.replace(/\D/g, '') || '919999999999'}`;

  return (
    <div className="container-page py-5">
      <header className="border-b border-line bg-white/95 shadow-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f8f4a] text-lg font-bold text-white">✿</div>
            <div>
              <div className="font-display text-2xl font-semibold text-ink">GreenSprout</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/50">Nursery & Garden Center</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-ink/70 md:flex">
            {['Home', 'About Us', 'Plants', 'Indoor Plants', 'Outdoor Plants', 'Gallery', 'Services', 'Contact'].map((item) => (
              <a key={item} href="#" className="hover:text-ink">{item}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button className="rounded-full border border-line px-3 py-2 text-sm text-ink/70">Search</button>
            <button className="rounded-full bg-[#2f8f4a] px-4 py-2 text-sm font-medium text-white">Call Now</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] bg-[#f5f8f2] px-3 pb-6 pt-5 sm:px-5 lg:px-6">
        <section className="overflow-hidden rounded-[20px] bg-[#edf5ec] shadow-sm">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center bg-[linear-gradient(135deg,#edf7eb,#dfeee1)] p-6 text-ink sm:p-8 lg:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2f8f4a]">Healthy Plants | Greener Tomorrow</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">Bring Nature Home with Our Premium Plants</h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink/60">
                Wide range of indoor & outdoor plants, garden essentials, and sustainable greenery for your home and workspace.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={onShare} className="rounded-md bg-[#2f8f4a] px-5 py-2.5 text-sm font-medium text-white">Explore Our Collection</button>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-md border border-[#2f8f4a]/30 bg-white px-5 py-2.5 text-sm font-medium text-ink">Contact Us</a>
              </div>
            </div>

            <div className="relative min-h-[300px] bg-[#ecf7ee] md:min-h-[420px]">
              <img src={heroImage} alt={`${place.name} nursery hero`} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute bottom-5 right-5 rounded-[14px] border border-white/40 bg-white/80 px-4 py-3 text-center shadow-lg backdrop-blur-sm">
                <div className="font-display text-2xl font-semibold text-[#2f8f4a]">Plants</div>
                <div className="mt-1 text-sm font-medium text-ink">Make Life Better</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
          <div className="overflow-hidden rounded-[18px] border border-line bg-white shadow-sm">
            <img src={galleryImages[1]} alt={`${place.name} nursery shop`} className="h-full w-full object-cover" />
          </div>

          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f8f4a]">About us</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Welcome to GreenSprout Nursery</h2>
            <p className="mt-3 text-base leading-relaxed text-ink/60">
              We bring you nature’s beauty with a wide variety of healthy plants, flowers, vegetables, and gardening essentials. Whether you are a home gardener, landscaper, or plant enthusiast, we have something for every green space.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Premium Quality', 'Plants'],
                ['Expert Guidance', 'Advice'],
                ['Wide Variety', 'Selection'],
                ['Affordable', 'Prices'],
              ].map(([heading, value]) => (
                <div key={heading} className="rounded-xl border border-line bg-[#f4fbf4] p-3">
                  <p className="font-display text-xl font-semibold text-[#2f8f4a]">{heading}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-ink/55">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a href={websiteUrl || whatsappUrl} target="_blank" rel="noreferrer" className="rounded-md bg-[#2f8f4a] px-5 py-2.5 text-sm font-medium text-white">Read More</a>
              <button onClick={onReport} className="rounded-md border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink/70">Get Quote</button>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f8f4a]">Categories</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Shop by Plant Category</h2>
            </div>
            <button className="text-sm text-ink/60 hover:text-ink">View All Categories →</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((item) => (
              <div key={item.name} className="overflow-hidden rounded-[18px] border border-line bg-[#f7faf7] shadow-sm">
                <img src={item.image} alt={item.name} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <p className="text-base font-semibold text-ink">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f8f4a]">Featured products</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Featured Products</h2>
            </div>
            <button className="text-sm text-ink/60 hover:text-ink">View All Products →</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featuredPlants.map((product) => (
              <div key={product.name} className="overflow-hidden rounded-[18px] border border-line bg-[#f7faf7] shadow-sm">
                <img src={product.image} alt={product.name} className="h-52 w-full object-cover" />
                <div className="p-4">
                  <p className="text-lg font-semibold text-ink">{product.name}</p>
                  <p className="mt-1 text-sm text-[#2f8f4a]">{product.price}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-md border border-[#bfe3c5] bg-white px-3 py-2 text-xs font-medium text-ink/75">Add to Cart</button>
                    <button className="rounded-md bg-[#2f8f4a] px-3 py-2 text-xs font-medium text-white">Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f8f4a]">Why choose us</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Why Choose Us?</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Healthy & Fresh Plants', 'Expert guidance and healthy plant care'],
              ['Expert Guidance & Support', 'Personalized recommendations for every space'],
              ['Safe & Secure Packaging', 'Plants delivered in excellent condition'],
              ['Home Delivery', 'Available across the city'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[14px] border border-line bg-[#f4fbf4] p-4 text-center">
                <p className="text-base font-semibold text-ink">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f8f4a]">Our gallery</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Our Gallery</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {galleryImages.map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt={`${place.name} gallery ${index + 1}`} className="h-32 w-full rounded-[12px] object-cover" />
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-line bg-white shadow-sm">
            <img src={galleryImages[2]} alt={`${place.name} garden`} className="h-full w-full object-cover" />
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f8f4a]">Our services</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Our Services</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <div key={service} className="rounded-[12px] border border-line bg-[#f4fbf4] px-3 py-4 text-sm font-medium text-ink/75">{service}</div>
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f8f4a]">Customer reviews</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">What Our Customers Say</h2>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-ink/65">
              <div className="rounded-[12px] border border-line bg-[#f4fbf4] p-4">“Excellent quality plants and very helpful guidance. I got the perfect plants for my home.”</div>
              <div className="rounded-[12px] border border-line bg-[#f4fbf4] p-4">“Beautiful, healthy plants and timely delivery. Great service and friendly support.”</div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f8f4a]">Get in touch</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Visit Our Nursery</h2>
            <div className="mt-4 space-y-3 text-sm text-ink/75">
              {place.address && <p className="rounded-[12px] border border-line bg-[#f4fbf4] px-3 py-3">⌖ {place.address}</p>}
              {place.phone && <a href={`tel:${place.phone}`} className="block rounded-[12px] border border-line bg-[#f4fbf4] px-3 py-3 hover:text-ink">☎ {place.phone}</a>}
              {websiteUrl && <a href={websiteUrl} target="_blank" rel="noreferrer" className="block rounded-[12px] border border-line bg-[#f4fbf4] px-3 py-3 text-[#2f8f4a] hover:underline">↗ Visit website</a>}
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="block rounded-[12px] border border-line bg-[#f4fbf4] px-3 py-3 text-[#2f8f4a] hover:underline">⌖ Get directions</a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-line bg-white shadow-sm">
            <iframe
              title={`${place.name} map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(place.address || place.name)}&output=embed`}
              className="h-full min-h-[270px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export function FurnitureDetailLayout({ place, mapsUrl, socialLinks, onShare, onReport }) {
  const heroImage = place.coverImage || place.images?.[0] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80';
  const furnitureCollections = [
    { name: 'Living Room', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Bedroom', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Dining Room', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80' },
    { name: 'Office Furniture', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80' },
    { name: 'Wardrobes', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Study Tables', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80' },
    { name: 'TV Units', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Custom Furniture', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80' },
  ];

  const featuredProducts = [
    { name: 'Modern L-Shape Sofa', price: '₹ 45,999', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80' },
    { name: 'King Size Bed', price: '₹ 32,999', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
    { name: 'Dining Table Set', price: '₹ 29,999', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80' },
    { name: 'Office Work Desk', price: '₹ 18,999', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80' },
  ];

  const galleryImages = [
    heroImage,
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
  ];

  const websiteUrl = place.website && (place.website.startsWith('http') ? place.website : `https://${place.website}`);
  const whatsappUrl = socialLinks.whatsapp
    ? (socialLinks.whatsapp.startsWith('http') ? socialLinks.whatsapp : `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`)
    : `https://wa.me/${place.phone?.replace(/\D/g, '') || '919999999999'}`;

  return (
    <div className="container-page py-5">
      <header className="border-b border-line bg-white/95 shadow-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#a86d2f] text-sm font-bold text-white shadow-sm">{place.name.charAt(0).toUpperCase()}</div>
            <div>
              <div className="font-display text-xl font-semibold text-ink sm:text-2xl">{place.name}</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-ink/70 md:flex">
            {['Home', 'About us', 'Furniture', 'Collections', 'Gallery', 'Contact'].map((item) => (
              <a key={item} href="#" className="hover:text-ink">{item}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button className="rounded-full border border-line px-4 py-2 text-sm text-ink/70">Search</button>
            <button className="rounded-full bg-[#a86d2f] px-4 py-2 text-sm font-medium text-white">Call Now</button>
          </div>
        </div>
      </header>

      <main className="bg-[#f5efe8] px-3 pb-6 pt-5 sm:px-5 lg:px-6">
        <section className="overflow-hidden rounded-[24px] bg-[#1a180f] shadow-[0_12px_35px_rgba(20,16,8,0.12)]">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center bg-[linear-gradient(135deg,rgba(22,18,12,0.88),rgba(61,38,20,0.72))] p-6 text-white sm:p-8 lg:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e6c9a2]">Premium furniture store</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-6xl">Transform Your Space</h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
                Modern furniture for modern living. Quality, comfort, and elegance crafted for your home and office.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={onShare} className="rounded-md bg-[#c38b4d] px-5 py-3 text-sm font-medium text-white">Explore Collection</button>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-medium text-white">Contact Us</a>
              </div>
            </div>

            <div className="relative min-h-[300px] md:min-h-[420px]">
              <img src={heroImage} alt={`${place.name} hero`} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
          <div className="overflow-hidden rounded-[18px] border border-line bg-white shadow-sm">
            <img src={galleryImages[1]} alt={place.name} className="h-full w-full object-cover" />
          </div>

          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9f6d2f]">About us</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Your Trusted Furniture Partner</h2>
            <p className="mt-3 text-base leading-relaxed text-ink/60">
              We create comfortable and stylish spaces with premium furniture that balances beauty, comfort, and lasting quality.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['15+', 'Years Experience'],
                ['Premium', 'Materials'],
                ['Custom', 'Furniture'],
                ['Warranty', 'Support'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-line bg-[#f8f4ef] p-3">
                  <p className="font-display text-2xl font-semibold text-[#a86d2f]">{value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-ink/55">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a href={websiteUrl || whatsappUrl} target="_blank" rel="noreferrer" className="rounded-md bg-[#a86d2f] px-5 py-2.5 text-sm font-medium text-white">Read More</a>
              <button onClick={() => onReport()} className="rounded-md border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink/70">Get Quote</button>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9f6d2f]">Collections</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Our Furniture Collections</h2>
            </div>
            <button className="text-sm text-ink/60 hover:text-ink">View All Collections →</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {furnitureCollections.map((item) => (
              <div key={item.name} className="overflow-hidden rounded-[18px] border border-line bg-[#f7f2ea] shadow-sm">
                <img src={item.image} alt={item.name} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <p className="text-base font-semibold text-ink">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9f6d2f]">Featured products</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Featured Products</h2>
            </div>
            <button className="text-sm text-ink/60 hover:text-ink">View All Products →</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <div key={product.name} className="overflow-hidden rounded-[18px] border border-line bg-[#faf5f0] shadow-sm">
                <img src={product.image} alt={product.name} className="h-52 w-full object-cover" />
                <div className="p-4">
                  <p className="text-lg font-semibold text-ink">{product.name}</p>
                  <p className="mt-1 text-sm text-[#a86d2f]">{product.price}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-md border border-[#d7b48b] bg-white px-3 py-2 text-xs font-medium text-ink/75">View Details</button>
                    <button className="rounded-md bg-[#a86d2f] px-3 py-2 text-xs font-medium text-white">Enquire Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9f6d2f]">Gallery</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Our Gallery</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {galleryImages.map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt={`${place.name} gallery ${index + 1}`} className="h-36 w-full rounded-[14px] object-cover" />
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9f6d2f]">Why choose us</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Why Choose Us</h2>
            <div className="mt-5 space-y-3">
              {[
                'Premium quality materials',
                'Custom design solutions',
                'Affordable pricing',
                'Expert craftsmanship',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-line bg-[#f8f4ef] px-3 py-3 text-sm font-medium text-ink/75">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9f6d2f]">Directions</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Visit Our Store</h2>
            <div className="mt-4 space-y-3 text-sm text-ink/75">
              {place.address && <p className="rounded-[12px] border border-line bg-[#faf5f0] px-3 py-3">⌖ {place.address}</p>}
              {place.phone && <a href={`tel:${place.phone}`} className="block rounded-[12px] border border-line bg-[#faf5f0] px-3 py-3 hover:text-ink">☎ {place.phone}</a>}
              {websiteUrl && <a href={websiteUrl} target="_blank" rel="noreferrer" className="block rounded-[12px] border border-line bg-[#faf5f0] px-3 py-3 text-[#a86d2f] hover:underline">↗ Visit website</a>}
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="block rounded-[12px] border border-line bg-[#faf5f0] px-3 py-3 text-[#a86d2f] hover:underline">⌖ Get directions</a>
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9f6d2f]">Contact</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ink">Get In Touch</h2>
            <div className="mt-4 flex flex-col gap-3">
              <input placeholder="Your name" className="rounded-[12px] border border-line bg-[#faf5f0] px-3 py-3 text-sm outline-none focus:border-[#d1a06d]" />
              <input placeholder="Email" className="rounded-[12px] border border-line bg-[#faf5f0] px-3 py-3 text-sm outline-none focus:border-[#d1a06d]" />
              <textarea rows={4} placeholder="Your requirements" className="rounded-[12px] border border-line bg-[#faf5f0] px-3 py-3 text-sm outline-none focus:border-[#d1a06d]" />
            </div>
            <button className="mt-4 w-full rounded-[12px] bg-[#a86d2f] px-4 py-3 text-base font-semibold text-white">Send enquiry</button>
          </div>
        </section>
      </main>
    </div>
  );
}

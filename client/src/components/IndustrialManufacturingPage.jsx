import React from 'react';

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

function buildInitials(name) {
  return (name || 'AgriFresh Foods').split(' ').slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
}

function getYoutubeEmbedUrl(url) {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

export default function IndustrialManufacturingPage({ place, mapsUrl, onShare, onReport }) {
  const categoryText = `${place?.subcategory || ''} ${place?.category?.name || ''}`.toLowerCase();
  const isFoodProcessing = categoryText.includes('food');
  const smallScale = place?.attributes?.smallScaleIndustries || {};
  const foodProcessing = place?.attributes?.foodProcessing || {};
  const pageData = isFoodProcessing ? foodProcessing : smallScale;
  const businessName = place?.name || (isFoodProcessing ? 'AgriFresh Foods' : 'Apex Precision Works');
  const businessDescription = place?.description || (isFoodProcessing
    ? 'We transform nature’s finest ingredients into safe, high-quality and nutritious food products for everyday life.'
    : 'Precision manufacturing, industrial components and dependable engineering solutions for your business.');
  const aboutDescription = pageData.aboutUs || businessDescription;
  const aboutImage = pageData.aboutImageUrl || place?.attributes?.aboutImage || defaultImages.about;
  const address = place?.address || 'Vijayawada, Andhra Pradesh';
  const phone = place?.phone || '+91 98765 43210';
  const email = place?.email || 'info@agrifreshfoods.in';
  const coverImage = place?.coverImage || defaultImages.hero;
  const galleryImageUrls = (pageData.galleryImages || []).map((item) => typeof item === 'string' ? item : item.url).filter(Boolean);
  const gallery = [...new Set([...(Array.isArray(place?.images) ? place.images : []), ...galleryImageUrls])].slice(0, 6);
  const galleryImages = gallery.length ? gallery : [
    defaultImages.product1,
    defaultImages.product2,
    defaultImages.product3,
    defaultImages.product4,
    defaultImages.product5,
    defaultImages.product6,
  ];

  const products = pageData.products?.length ? pageData.products : place?.attributes?.products || (isFoodProcessing ? [
    { name: 'Frozen Vegetables', description: 'Freshly packed in every pack.', image: galleryImages[0] },
    { name: 'Fruit Juices & Beverages', description: 'Pure taste, natural goodness.', image: galleryImages[1] },
    { name: 'Ready-to-Eat Meals', description: 'Healthy meals for every lifestyle.', image: galleryImages[2] },
    { name: 'Pickles & Condiments', description: 'Traditional taste, modern hygiene.', image: galleryImages[3] },
    { name: 'Dehydrated Products', description: 'Longer shelf life and nutrition.', image: galleryImages[4] },
    { name: 'Organic Produce', description: 'Farm fresh and naturally packed.', image: galleryImages[5] },
  ] : [
    { name: 'CNC Machined Components', description: 'Precision-made components to match your specification.', image: galleryImages[0] },
    { name: 'Fabrication Services', description: 'Custom metal fabrication and industrial assembly.', image: galleryImages[1] },
    { name: 'Precision Shafts & Gears', description: 'Durable components for machinery and equipment.', image: galleryImages[2] },
    { name: 'Sheet Metal Components', description: 'Accurate components with a consistent finish.', image: galleryImages[3] },
  ]);

  const galleryVideos = pageData.galleryVideos || [];
  const industriesServed = typeof smallScale.industriesServed === 'string'
    ? smallScale.industriesServed.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
    : smallScale.industriesServed || [];
  const certifications = typeof pageData.certifications === 'string'
    ? pageData.certifications.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
    : pageData.certifications || ['FSSAI', 'ISO', 'HACCP', '100% GMP', 'Organic', 'Traceability'];
  const manufacturingCapabilities = smallScale.manufacturingCapabilities || [];
  const whyChooseUs = (Array.isArray(pageData.whyChooseUs) ? pageData.whyChooseUs : pageData.whyChooseUs ? [pageData.whyChooseUs] : []).map((item) => typeof item === 'string' ? item : item.title).filter(Boolean);

  const highlights = isFoodProcessing ? (foodProcessing.stats || []).slice(0, 4) : [
    { value: products.length || 'Custom', label: products.length ? 'Products & Services' : 'Manufacturing' },
    { value: industriesServed.length || 'Multiple', label: 'Industries Served' },
    { value: certifications.length || 'Quality', label: 'Certifications' },
    { value: 'B2B', label: 'Business Supply' },
  ];

  const processSteps = isFoodProcessing && foodProcessing.processSteps?.length ? foodProcessing.processSteps.map((step, index) => ({
    ...step,
    title: step.title || `Step ${index + 1}`,
    image: step.image || step.imageUrl || defaultImages[`process${(index % 5) + 1}`],
  })) : isFoodProcessing ? [
    { title: '01. Sourcing', description: 'Fresh raw produce from trusted farms and growers.', image: defaultImages.process1 },
    { title: '02. Cleaning & Sorting', description: 'Removing impurities and selecting only the best produce.', image: defaultImages.process2 },
    { title: '03. Processing', description: 'Advanced technology and hygienic preparation methods.', image: defaultImages.process3 },
    { title: '04. Packaging', description: 'Smart packaging for freshness, safety and shelf life.', image: defaultImages.process4 },
    { title: '05. Distribution', description: 'Fast delivery to homes, stores and institutional buyers.', image: defaultImages.process5 },
  ] : [
    { title: '01. Planning', description: 'Confirm product requirements and specifications.', image: defaultImages.process1 },
    { title: '02. Materials', description: 'Select suitable materials and prepare production.', image: defaultImages.process2 },
    { title: '03. Manufacturing', description: 'Produce components using the right processes.', image: defaultImages.process3 },
    { title: '04. Quality Check', description: 'Inspect products for consistency and performance.', image: defaultImages.process4 },
    { title: '05. Dispatch', description: 'Pack and deliver orders to the customer.', image: defaultImages.process5 },
  ];

  const advantages = [
    ...(manufacturingCapabilities.length ? manufacturingCapabilities.map((item) => ({ title: item.title, icon: '✓' })) : isFoodProcessing
      ? [
        { title: 'Premium Quality Ingredients', icon: '✓' },
        { title: 'Advanced Processing Technology', icon: '⚙' },
        { title: 'Food Safety Standards', icon: '🛡' },
        { title: 'Sustainable Practices', icon: '♻' },
      ]
      : [
        { title: 'Precision Manufacturing', icon: '✓' },
        { title: 'Quality Inspection', icon: '⚙' },
        { title: 'Custom Production', icon: '▣' },
        { title: 'Reliable Delivery', icon: '↗' },
      ]),
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

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Products', href: '#products' },
    { label: 'Our Process', href: '#process' },
    { label: 'Quality & Certifications', href: '#quality' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="bg-[#eff7f2] text-[#1d2d25]">
      <header className="bg-[#052d1d] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            {place?.logo
              ? <img src={place.logo} alt={`${businessName} logo`} className="h-10 w-10 rounded-full bg-white object-contain p-1" />
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

          <div className="hidden items-center gap-3 md:flex">
            <button type="button" className="rounded-full border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-semibold text-white hover:bg-white/10">
              Search
            </button>
            <a href="#contact" className="rounded-full bg-[#f5b942] px-4 py-2 text-[11px] font-bold text-[#0a311e] shadow-lg shadow-[#f5b942]/25 transition hover:brightness-105">
              Get a Quote
            </a>
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
                <a href="#products" className="rounded-full bg-[#6ac968] px-5 py-3 text-sm font-bold text-[#0a311e] shadow-lg shadow-[#6ac968]/20 transition hover:brightness-105">
                  Explore Our Products →
                </a>
                <a href="#process" className="rounded-full border border-white/40 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                  Our Process →
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-3 text-sm text-[#dfeee2]">
                {[
                  'Fresh & Natural Ingredients',
                  'Hygienic Processing',
                  'ISO Certified',
                  'Sustainable Practices',
                ].map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[12px] font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mt-6 lg:mt-0">
              <div className="overflow-hidden rounded-[18px] border border-white/15 shadow-2xl">
                <img src={coverImage} alt={businessName} className="h-[420px] w-full object-cover" />
              </div>

              <div className="absolute -bottom-5 right-3 w-52 rounded-[18px] border border-[#93db7d] bg-[#0d3f2d] p-4 text-center shadow-xl">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#6ac968] text-2xl text-[#0a311e]">🌿</div>
                <div className="mt-3 text-[15px] font-bold leading-tight text-white">Pure<br />Fresh<br />Healthy</div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mt-8 rounded-[20px] border border-[#dfece2] bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">About us</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">{isFoodProcessing ? 'Leading Food Processing Company' : 'Industrial Manufacturing Solutions'}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#4d5f57]">
                {aboutDescription}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#4d5f57]">
                {isFoodProcessing ? 'We work closely with farmers, use advanced technology and follow strict hygiene standards to create products that are consistent, nutritious and safe for every household.' : 'We combine skilled teams, dependable processes and quality checks to deliver industrial products built around customer specifications.'}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(isFoodProcessing ? ['Quality First', 'Farmer Support', 'Innovation', 'Customer Satisfaction'] : ['Precision Production', 'Quality Control', 'Custom Manufacturing', 'Reliable Delivery']).map((value) => (
                  <div key={value} className="rounded-xl border border-[#dfece2] bg-[#f6faf8] px-3 py-3 text-center text-sm font-semibold text-[#1d2d25]">
                    {value}
                  </div>
                ))}
              </div>

              {industriesServed.length > 0 && <div className="mt-5"><p className="text-xs font-bold uppercase tracking-wide text-[#63776c]">Industries served</p><div className="mt-2 flex flex-wrap gap-2">{industriesServed.map((industry) => <span key={industry} className="rounded-full bg-[#edf7f2] px-3 py-1.5 text-xs font-medium text-[#315842]">{industry}</span>)}</div></div>}

              <a href="#contact" className="mt-6 inline-flex rounded-full bg-[#1d5a3c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#144330]">
                Learn More →
              </a>
            </div>

            <div className="rounded-[18px] border border-[#dfece2] bg-[#f6faf8] p-3">
              <img src={aboutImage} alt={`${businessName} about`} className="h-full w-full rounded-[14px] object-cover" />
            </div>
          </div>
        </section>

        <section id="products" className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Our Products</p>
              <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#072d1d]">{isFoodProcessing ? 'Wide Range of Processed Food Products' : 'Products & Manufacturing Services'}</h2>
            </div>
            <button type="button" onClick={onReport} className="hidden rounded-full border border-[#dfece2] bg-white px-4 py-2 text-sm font-semibold text-[#1d2d25] md:inline-flex">
              View All Products →
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <article key={product.name} className="overflow-hidden rounded-[18px] border border-[#dfece2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <img src={product.image} alt={product.name} className="h-52 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-[23px] font-bold leading-tight text-[#0a311e]">{product.name}</h3>
                  <p className="mt-2 text-sm text-[#4d5f57]">{product.description}</p>
                  <button type="button" onClick={onReport} className="mt-4 inline-flex items-center text-sm font-semibold text-[#1d5a3c] hover:underline">
                    View Details →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="mt-12 rounded-[22px] bg-[#0a311e] p-6 text-white shadow-[0_20px_50px_rgba(9,48,32,0.18)] sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b9f39b]">Our Process</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">{isFoodProcessing ? 'From Farm to Fork' : 'From Design to Delivery'}</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-5">
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
          </div>
        </section>

        <section id="quality" className="mt-12 rounded-[22px] border border-[#dfece2] bg-[#edf7f2] p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Why choose us</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">{isFoodProcessing ? 'The FreshHarvest Advantage' : 'Manufacturing Capabilities'}</h2>
            </div>
            <a href="#contact" className="inline-flex rounded-full bg-[#1d5a3c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#144330]">
              Why Choose Us →
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {advantages.map((advantage) => (
              <div key={advantage.title} className="rounded-[18px] border border-[#dfece2] bg-white p-4 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dcf5d5] text-2xl text-[#1d5a3c]">
                  {advantage.icon}
                </div>
                <div className="mt-3 text-[15px] font-bold text-[#072d1d]">{advantage.title}</div>
              </div>
            ))}
          </div>

          {whyChooseUs.length > 0 && <div className="mt-7"><h3 className="font-display text-2xl font-semibold text-[#072d1d]">Why choose {businessName}</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{whyChooseUs.map((reason, index) => <div key={`${reason}-${index}`} className="rounded-[14px] border border-[#dfece2] bg-white p-4 text-sm font-semibold text-[#1d5a3c]">✓ {reason}</div>)}</div></div>}

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[16px] bg-[#0a311e] p-5 text-center text-white">
                <div className="text-3xl font-black text-[#a5e46d]">{stat.value}</div>
                <div className="mt-2 text-[12px] uppercase tracking-[0.12em] text-[#dfeee2]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[22px] border border-[#dfece2] bg-white p-5 shadow-sm sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Testimonials</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">What Our Customers Say</h2>
            <div className="mt-6 space-y-4">
              {testimonials.map((item) => (
                <blockquote key={item.name} className="rounded-[18px] border border-[#dfece2] bg-[#f8fbf9] p-4">
                  <div className="text-3xl text-[#75b55e]">“</div>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#42554b]">{item.quote}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a311e] text-sm font-bold text-white">
                      {item.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-[#072d1d]">{item.name}</div>
                      <div className="text-[11px] uppercase tracking-[0.12em] text-[#697d72]">{item.role}</div>
                    </div>
                  </div>
                </blockquote>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-[#dfece2] bg-white p-5 shadow-sm sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">{isFoodProcessing ? 'Our Certifications' : 'Quality & Certifications'}</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">Certifications</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <div key={cert} className="rounded-[14px] border border-[#dfece2] bg-[#f7faf8] p-4 text-center text-sm font-bold text-[#0a311e]">
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="mt-12 rounded-[22px] border border-[#dfece2] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#75b55e]">Gallery</p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-[#072d1d]">{isFoodProcessing ? 'Fresh From Our Farm' : 'Manufacturing Gallery'}</h2>
            </div>
            <a href="#contact" className="hidden rounded-full border border-[#dfece2] bg-[#f8fbf9] px-4 py-2 text-sm font-semibold text-[#1d2d25] md:inline-flex">
              View Gallery →
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {galleryImages.slice(0, 6).map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt={`${businessName} gallery ${index + 1}`} className="h-56 w-full rounded-[16px] object-cover shadow-sm" />
            ))}
          </div>
          {galleryVideos.length > 0 && <div className="mt-7"><h3 className="font-display text-2xl font-semibold text-[#072d1d]">Videos</h3><div className="mt-4 grid gap-4 md:grid-cols-2">{galleryVideos.map((video, index) => {
            const url = typeof video === 'string' ? video : video.url;
            const title = typeof video === 'string' ? `${businessName} video ${index + 1}` : video.title || `${businessName} video ${index + 1}`;
            const embedUrl = getYoutubeEmbedUrl(url);
            return <div key={`${url}-${index}`} className="overflow-hidden rounded-[16px] border border-[#dfece2] bg-[#f8fbf9]">{embedUrl ? <iframe src={embedUrl} title={title} allowFullScreen className="aspect-video w-full" /> : <video src={url} controls preload="metadata" className="aspect-video w-full bg-black" />}<p className="px-3 py-2 text-sm font-semibold text-[#1d2d25]">{title}</p></div>;
          })}</div></div>}
        </section>

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
            </div>

            <div className="rounded-[20px] border border-[#dfece2] bg-[#f9fbfa] p-5">
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" placeholder="Full Name" className="rounded-xl border border-[#dfece2] bg-white px-3 py-3 text-sm outline-none placeholder:text-[#8ca398] focus:border-[#1d5a3c]" />
                  <input type="tel" placeholder="Phone Number" className="rounded-xl border border-[#dfece2] bg-white px-3 py-3 text-sm outline-none placeholder:text-[#8ca398] focus:border-[#1d5a3c]" />
                </div>
                <input type="email" placeholder="Email Address" className="w-full rounded-xl border border-[#dfece2] bg-white px-3 py-3 text-sm outline-none placeholder:text-[#8ca398] focus:border-[#1d5a3c]" />
                <textarea rows="5" placeholder="Message" className="w-full rounded-xl border border-[#dfece2] bg-white px-3 py-3 text-sm outline-none placeholder:text-[#8ca398] focus:border-[#1d5a3c]" />
                <button type="button" className="rounded-xl bg-[#f4b13d] px-5 py-3 text-sm font-bold text-[#072d1d] shadow-md shadow-[#f4b13d]/30 transition hover:brightness-105">
                  Send Enquiry
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d4e5d9] bg-[#052d1d] text-[#dfeee2]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              {place?.logo
                ? <img src={place.logo} alt={`${businessName} logo`} className="h-10 w-10 rounded-full bg-white object-contain p-1" />
                : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5b942] text-sm font-black text-[#0a311e]">{buildInitials(businessName)}</div>}
              <div>
                <div className="text-[18px] font-black text-white">{businessName}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-[#d8f4d7]">Fresh & Healthy</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#d8f4d7]">
              {isFoodProcessing ? 'We are dedicated to providing safe, nutritious and high-quality food products to homes, retailers and institutions.' : 'We provide dependable industrial products and manufacturing services for businesses and production teams.'}
            </p>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">Quick Links</div>
            <ul className="mt-4 space-y-2 text-sm text-[#dfeee2]">
              <li>Home</li>
              <li>About Us</li>
              <li>Our Process</li>
              <li>Gallery</li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">Our Products</div>
            <ul className="mt-4 space-y-2 text-sm text-[#dfeee2]">
              <li>Frozen Vegetables</li>
              <li>Fruit Juices & Beverages</li>
              <li>Ready-to-Eat Meals</li>
              <li>Pickles & Condiments</li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-[0.16em] text-white">Contact Us</div>
            <ul className="mt-4 space-y-2 text-sm text-[#dfeee2]">
              <li>{address}</li>
              <li>{phone}</li>
              <li>{email}</li>
            </ul>
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
    </div>
  );
}

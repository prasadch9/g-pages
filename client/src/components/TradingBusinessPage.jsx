import React, { useState } from 'react';
import FavoriteButton from './FavoriteButton';
import ReviewsSection from './ReviewsSection';

const fallbackImages = [
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
];

function asList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return typeof value === 'string' ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];
}

function itemName(item, fallback) {
  if (typeof item === 'string') return item;
  return item?.name || item?.title || item?.category || fallback;
}

function externalUrl(value) {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function youtubeEmbedUrl(url) {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

function ContactRow({ href, label, action, external = false }) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="flex min-w-0 items-center gap-2 rounded-md border border-[#e2ebf5] px-2.5 py-2 text-xs hover:border-[#94c6f4]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eaf3fd] text-[#0879ee]">●</span>
      <span className="min-w-0 flex-1 truncate text-[#304966]">{label}</span>
      <span className="rounded border border-[#b8d8f7] px-2 py-1 font-semibold text-[#0879ee]">{action}</span>
    </a>
  );
}

export default function TradingBusinessPage({ place, mapsUrl, onShare, onReport }) {
  const [search, setSearch] = useState('');
  const attributes = place.attributes || {};
  const trading = attributes.tradingBusinesses || {};
  const galleryVideos = asList(trading.galleryVideos || attributes.galleryVideos);
  const galleryImages = asList(trading.galleryImages || attributes.galleryImages).map((item) => typeof item === 'string' ? item : item.url).filter(Boolean);
  const images = [...new Set([...asList(place.images), ...galleryImages])];
  const products = asList(trading.catalogue || attributes.catalogue || attributes.featuredProducts || attributes.products);
  const categories = asList(trading.productCategories || attributes.productCategories);
  const brands = asList(trading.brands || attributes.brands);
  const supplyCapabilities = asList(trading.supplyCapabilities || attributes.supplyCapabilities);
  const marketsServed = asList(trading.marketsServed || attributes.marketsServed);
  const phone = place.phone || '';
  const whatsapp = place.socialLinks?.whatsapp;
  const website = place.website ? externalUrl(place.website) : '';
  const rating = Number(place.rating?.average || 0);
  const reviewCount = Number(place.rating?.count || 0);
  const query = search.trim().toLowerCase();
  const filteredProducts = query
    ? products.filter((product) => {
      const text = typeof product === 'string' ? product : `${product?.name || ''} ${product?.title || ''} ${product?.description || ''} ${product?.category || ''}`;
      return text.toLowerCase().includes(query);
    })
    : products;
  const coverImage = place.coverImage || images[0];
  const aboutText = trading.aboutUs || place.description || 'Business information will be added soon.';
  const aboutImage = trading.aboutImageUrl || attributes.aboutImage || '';
  const promoBackground = trading.promoBackgroundImage || trading.promoBackgroundUrl || images[1];
  const navItems = [
    ['Home', '#home'], ['Products', '#products'], ['About Us', '#about'],
    ['Categories', '#categories'], ['Gallery', '#gallery'], ['Reviews', '#reviews'], ['Contact', '#contact'],
  ];

  return (
    <div className="min-h-screen bg-[#f1f6fb] text-[#13243a]">
      <header className="bg-[#061a35] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-4 px-5 py-3">
          <a href="#home" className="flex min-w-[190px] items-center gap-3">
            {place.logo
              ? <img src={place.logo} alt="" className="h-10 w-10 rounded-md bg-white object-contain p-1" />
              : <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0879ee] text-lg font-black">{(place.name || 'B').slice(0, 1).toUpperCase()}</span>}
            <span className="leading-tight"><span className="block text-[17px] font-extrabold">{place.name}</span><span className="block text-[10px] text-blue-200">Connect · Explore · Grow</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-xs font-semibold lg:flex">
            <a href="#home" className="hover:text-sky-300">Home</a><a href="#products" className="hover:text-sky-300">Business</a><a href="#products" className="hover:text-sky-300">Products</a><a href="#categories" className="hover:text-sky-300">Categories</a><a href="#about" className="hover:text-sky-300">About Us</a><a href="#contact" className="hover:text-sky-300">Contact</a>
          </nav>
          <label className="ml-auto flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-500 lg:ml-0 lg:max-w-[300px]">
            <span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products or categories..." className="min-w-0 flex-1 bg-transparent text-slate-800 outline-none placeholder:text-slate-400" aria-label="Search products" />
          </label>
          <a href="/login" className="rounded-md bg-[#0879ee] px-4 py-2 text-xs font-bold text-white hover:bg-[#0069d8]">Log In / Sign Up</a>
        </div>
      </header>

      <section id="home" className="relative isolate min-h-[340px] overflow-hidden bg-[#102d4b] text-white sm:min-h-[380px]">
        {coverImage && <img src={coverImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061a35] via-[#071c37]/85 to-[#071c37]/20" />
        <div className="mx-auto flex min-h-[340px] max-w-[1440px] items-center px-5 py-8 sm:min-h-[380px]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded bg-[#08a45a] px-3 py-1 text-[11px] font-bold">{place.verified ? '✓ Verified Business' : 'Trading Business'}</div>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{place.name}</h1>
            <p className="mt-1 text-xl text-slate-100">{place.tagline || trading.tagline || attributes.tagline || 'Your Trusted Trading Partner'}</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200">{place.description || 'Quality products, dependable supply and service you can trust.'}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-100">
              {categories.slice(0, 3).map((category, index) => <span key={`${itemName(category, 'Category')}-${index}`}>▣ {itemName(category, 'Category')}</span>)}
              {(place.established || trading.establishedYear || attributes.establishedYear) && <span>Since {place.established || trading.establishedYear || attributes.establishedYear}</span>}{place.verified && <span>✓ Verified</span>}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {phone && <a href={`tel:${phone}`} className="rounded-md bg-[#0879ee] px-5 py-3 text-sm font-bold shadow-lg hover:bg-blue-600">☎ Contact Us</a>}
              {whatsapp && <a href={externalUrl(whatsapp)} target="_blank" rel="noopener noreferrer" className="rounded-md bg-[#0aa35b] px-5 py-3 text-sm font-bold shadow-lg hover:bg-green-700">◉ WhatsApp</a>}
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-md border border-white/60 bg-white/10 px-5 py-3 text-sm font-bold hover:bg-white/20">⌖ Get Directions</a>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-100"><span className="font-bold text-amber-300">★ {rating.toFixed(1)}</span><span>({reviewCount} Reviews)</span>{brands.slice(0, 2).map((brand, index) => <span key={`${itemName(brand, 'Brand')}-${index}`}>▣ {itemName(brand, 'Brand')}</span>)}</div>
          </div>
        </div>
      </section>

      <nav aria-label="Business sections" className="sticky top-0 z-20 border-b border-[#dce7f2] bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-5 py-2">
          {navItems.map(([label, href]) => <a key={label} href={href} className="flex shrink-0 items-center gap-2 rounded-md px-4 py-3 text-xs font-semibold text-[#233a57] hover:bg-[#eaf3fd]">{label}</a>)}
        </div>
      </nav>

      <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <article id="about" className="rounded-lg border border-[#dce7f2] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-extrabold">About {place.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#52647a]">{aboutText}</p>
              {aboutImage && <img src={aboutImage} alt={`${place.name} About Us`} className="mt-4 h-40 w-full rounded-md object-cover" />}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">{['Quality Products', 'Competitive Prices', 'On-Time Delivery', 'Customer Support'].map((value) => <div key={value} className="flex items-center gap-2 rounded-md bg-[#f2f7fc] p-2.5 text-[#304966]"><span className="text-[#0879ee]">✓</span>{value}</div>)}</div>
              <a href="#contact" className="mt-4 inline-flex rounded-md border border-[#0879ee] px-4 py-2 text-xs font-bold text-[#0879ee] hover:bg-[#eff7ff]">Learn More →</a>
            </article>
            <article className="relative flex min-h-[220px] items-center overflow-hidden rounded-lg bg-gradient-to-r from-[#081c38] via-[#0754a6] to-[#0782d6] p-6 text-white shadow-sm">
              {promoBackground && <img src={promoBackground} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />}
              <div className="relative max-w-md"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-200">Product range</p><h2 className="mt-2 text-3xl font-black leading-tight">Top Brands.<br />Best Deals.</h2><p className="mt-2 text-sm text-blue-100">Explore quality products and reliable wholesale supply.</p><a href="#products" className="mt-4 inline-flex rounded-md bg-[#0879ee] px-4 py-2.5 text-xs font-bold hover:bg-blue-500">Explore Products →</a></div>
            </article>
          </section>

          {supplyCapabilities.length > 0 && <section className="mt-4 rounded-lg border border-[#dce7f2] bg-white p-4 shadow-sm sm:p-5"><h2 className="text-lg font-extrabold">Supply Capabilities</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{supplyCapabilities.map((item, index) => <article key={`capability-${index}`} className="rounded-md bg-[#f2f7fc] p-3"><h3 className="text-sm font-bold text-[#172d48]">{itemName(item, `Capability ${index + 1}`)}</h3>{typeof item === 'object' && item.description && <p className="mt-1 text-xs leading-relaxed text-[#52647a]">{item.description}</p>}</article>)}</div></section>}

          {marketsServed.length > 0 && <section className="mt-4 rounded-lg border border-[#dce7f2] bg-white p-4 shadow-sm sm:p-5"><h2 className="text-lg font-extrabold">Markets Served</h2><div className="mt-3 flex flex-wrap gap-2">{marketsServed.map((item, index) => <span key={`market-${index}`} className="rounded border border-[#e1eaf4] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-[#304966]">{itemName(item, `Market ${index + 1}`)}</span>)}</div></section>}

          <section id="categories" className="mt-4 rounded-lg border border-[#dce7f2] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-extrabold">Our Product Categories</h2><a href="#products" className="text-[11px] font-bold text-[#0879ee] hover:underline">View All Categories →</a></div>
            {categories.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{categories.slice(0, 8).map((category, index) => {
              const title = itemName(category, `Category ${index + 1}`);
              const image = typeof category === 'object' && category.image ? category.image : images[index % Math.max(images.length, 1)];
              return <a href="#products" key={`${title}-${index}`} className="overflow-hidden rounded-md border border-[#e1eaf4] bg-[#f7faff] text-center transition hover:border-[#95c4f4] hover:shadow-sm">{image ? <img src={image} alt="" className="h-24 w-full object-cover" /> : <div className="flex h-24 items-center justify-center bg-[#eaf3fd] text-3xl text-[#0879ee]">▦</div>}<span className="block truncate px-2 pt-2 text-xs font-bold">{title}</span><span className="block pb-2 pt-1 text-[10px] text-[#0879ee]">View Products →</span></a>;
            })}</div> : <p className="mt-3 text-sm text-slate-500">Product categories will be added soon.</p>}
          </section>

          <section id="products" className="mt-4 rounded-lg border border-[#dce7f2] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-extrabold">Featured Products</h2><span className="text-[11px] text-slate-500">{filteredProducts.length} items</span></div>
            {filteredProducts.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{filteredProducts.slice(0, 8).map((product, index) => {
              const title = itemName(product, `Product ${index + 1}`);
              const image = typeof product === 'object' && (product.image || product.photo) ? product.image || product.photo : images[index % Math.max(images.length, 1)] || fallbackImages[index % fallbackImages.length];
              const description = typeof product === 'object' ? product.description : '';
              const price = typeof product === 'object' ? product.price : '';
              return <article key={`${title}-${index}`} className="overflow-hidden rounded-md border border-[#e1eaf4] bg-white transition hover:shadow-md"><img src={image} alt={title} loading="lazy" className="h-36 w-full object-cover" /><div className="p-3"><h3 className="truncate text-xs font-bold text-[#172d48]">{title}</h3>{description && <p className="mt-1 min-h-8 text-[10px] leading-relaxed text-slate-500">{description}</p>}{price && <p className="mt-2 text-xs font-bold text-[#0879ee]">{price}</p>}<a href={phone ? `tel:${phone}` : '#contact'} className="mt-2 block rounded border border-[#a9cff5] py-1.5 text-center text-[10px] font-semibold text-[#0879ee] hover:bg-[#eff7ff]">Enquire</a></div></article>;
            })}</div> : <p className="mt-3 text-sm text-slate-500">{search ? 'No products match your search.' : 'Products will be added soon.'}</p>}
          </section>

          {brands.length > 0 && <section className="mt-4 rounded-lg border border-[#dce7f2] bg-white p-4 shadow-sm sm:p-5"><h2 className="text-lg font-extrabold">Brands We Deal In</h2><div className="mt-3 flex flex-wrap gap-2">{brands.map((brand, index) => <span key={`${itemName(brand, 'Brand')}-${index}`} className="rounded border border-[#e1eaf4] bg-[#f7faff] px-4 py-2 text-xs font-semibold text-[#304966]">{itemName(brand, 'Brand')}</span>)}</div></section>}

          <section id="gallery" className="mt-4 rounded-lg border border-[#dce7f2] bg-white p-4 shadow-sm sm:p-5"><h2 className="text-lg font-extrabold">Gallery</h2>{images.length ? <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{images.slice(0, 6).map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${place.name} photo ${index + 1}`} loading="lazy" className="h-32 w-full rounded-md object-cover sm:h-40" />)}</div> : <p className="mt-3 text-sm text-slate-500">Business photos will be added soon.</p>}{galleryVideos.length > 0 && <div className="mt-5 grid gap-3 sm:grid-cols-2">{galleryVideos.map((item, index) => { const url = typeof item === 'string' ? item : item.url; const title = typeof item === 'string' ? `Business video ${index + 1}` : item.title || `Business video ${index + 1}`; const embed = youtubeEmbedUrl(url); return <div key={`video-${index}`} className="overflow-hidden rounded-md border border-[#e1eaf4]">{embed ? <iframe src={embed} title={title} allowFullScreen className="aspect-video w-full" /> : <video src={url} controls preload="metadata" className="aspect-video w-full bg-black" />}<p className="px-3 py-2 text-xs font-semibold">{title}</p></div>; })}</div>}</section>

          <section id="reviews" className="mt-4 rounded-lg border border-[#dce7f2] bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-extrabold">Customer Reviews</h2><div className="mt-3 flex items-center gap-3"><span className="text-3xl font-black text-[#183b68]">{rating.toFixed(1)}</span><div><div className="text-sm text-amber-400">{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</div><div className="text-xs text-slate-500">Based on {reviewCount} reviews</div></div></div>
            <div className="mt-4 border-t border-[#e1eaf4] pt-4"><ReviewsSection placeId={place._id} /></div>
          </section>
        </main>

        <aside className="flex flex-col gap-4">
          <section id="contact" className="rounded-lg border border-[#dce7f2] bg-white p-4 shadow-sm"><h2 className="text-base font-extrabold">☎ Get in Touch</h2><div className="mt-3 space-y-2">{phone && <ContactRow href={`tel:${phone}`} label={phone} action="Call" />}{whatsapp && <ContactRow href={externalUrl(whatsapp)} label="WhatsApp" action="Chat" external />}{place.email && <ContactRow href={`mailto:${place.email}`} label={place.email} action="Email" />}{website && <ContactRow href={website} label={place.website} action="Website" external />}</div>{!phone && !whatsapp && !place.email && !website && <p className="mt-3 text-sm text-slate-500">Contact details will be added soon.</p>}</section>
          <section className="rounded-lg border border-[#dce7f2] bg-white p-4 shadow-sm"><h2 className="text-base font-extrabold">⌖ Business Location</h2><div className="mt-3 flex h-36 items-center justify-center rounded-md border border-[#d8e8da] bg-[#edf6e9] text-center"><div className="rounded-md bg-white/90 px-4 py-2 text-xs font-semibold shadow-sm">📍 {place.name}</div></div><p className="mt-3 text-xs leading-relaxed text-[#52647a]">{place.address || 'Location details will be added soon.'}</p><a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block rounded-md border border-[#0879ee] py-2 text-center text-xs font-bold text-[#0879ee] hover:bg-[#eff7ff]">Get Directions</a></section>
          {place.socialLinks && (place.socialLinks.facebook || place.socialLinks.instagram) && <section className="rounded-lg border border-[#dce7f2] bg-white p-4 shadow-sm"><h2 className="text-base font-extrabold">Follow Us</h2><div className="mt-3 flex gap-2">{place.socialLinks.facebook && <SocialLink href={externalUrl(place.socialLinks.facebook)} label="f" title="Facebook" />}{place.socialLinks.instagram && <SocialLink href={externalUrl(place.socialLinks.instagram)} label="◎" title="Instagram" />}</div></section>}
          <section className="rounded-lg bg-[#073a78] p-4 text-white shadow-sm"><h2 className="text-sm font-extrabold">Bulk Orders &amp; Business Enquiries</h2><p className="mt-2 text-xs leading-relaxed text-blue-100">Contact the business for bulk pricing, product details and supply enquiries.</p><a href={phone ? `tel:${phone}` : '#contact'} className="mt-3 inline-flex rounded-md bg-white px-4 py-2 text-xs font-bold text-[#0755a8] hover:bg-blue-50">Contact Us</a></section>
          <div className="flex gap-2"><FavoriteButton placeId={place._id} /><button type="button" onClick={onShare} className="flex-1 rounded-md border border-[#dce7f2] bg-white px-3 py-2 text-xs font-semibold text-[#304966] hover:bg-slate-50">Share</button><button type="button" onClick={onReport} className="flex-1 rounded-md border border-[#dce7f2] bg-white px-3 py-2 text-xs font-semibold text-[#304966] hover:bg-slate-50">Report</button></div>
        </aside>
      </div>

      <footer className="mt-5 bg-[#061a35] text-slate-300"><div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs"><span className="font-bold text-white">{place.name}</span><div className="flex flex-wrap gap-5">{navItems.slice(0, 6).map(([label, href]) => <a key={label} href={href} className="hover:text-white">{label}</a>)}</div><span>© {new Date().getFullYear()} {place.name}. All rights reserved.</span></div></footer>
    </div>
  );
}

function SocialLink({ href, label, title }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" title={title} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0879ee] font-bold text-white hover:bg-blue-700">{label}</a>;
}

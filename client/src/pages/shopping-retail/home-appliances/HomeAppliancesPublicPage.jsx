import React, { useMemo, useState } from 'react';
import ReviewsSection from '../../../components/ReviewsSection';
import { getProfileData, ImageFrame } from '../../../components/public/PublicProfileShared';
import { getWhatsAppUrl } from '../../healthcare-medical/healthcareUtils';

const applianceCategories = [
  { name: 'Refrigerators', icon: '▣', detail: 'Single Door, Double Door, Side by Side & more' },
  { name: 'Washing Machines', icon: '◉', detail: 'Front Load, Top Load, Fully Automatic' },
  { name: 'Air Conditioners', icon: '❄', detail: 'Split AC, Window AC, Inverter AC' },
  { name: 'LED TVs', icon: '▤', detail: 'Smart TVs, 4K TVs, all sizes' },
  { name: 'Kitchen Appliances', icon: '⌂', detail: 'Chimneys, Hobs, Microwaves, OTGs' },
  { name: 'Small Appliances', icon: '♨', detail: 'Mixers, Grinders, Juicers, Irons & more' },
];
const infrastructureDefaults = [
  ['▦', 'Spacious Showroom', 'Wide display area with latest models'],
  ['⌖', 'Parking Facility', 'Ample parking space for customers'],
  ['⚒', 'Expert Installation', 'Professional setup and installation support'],
  ['⚙', 'Service Center', 'Quick service and maintenance support'],
  ['➜', 'Home Delivery', 'Safe and fast delivery to your doorstep'],
  ['♙', 'Customer Lounge', 'Comfortable waiting area for customers'],
];
const videoTitles = ['Our Showroom Tour', 'Latest Home Appliances', 'Customer Reviews'];

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(/[\n,]/).map((entry) => entry.trim()).filter(Boolean);
  return value ? [value] : [];
};
const firstList = (...values) => values.map(toList).find((items) => items.length) || [];
const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
const mediaSource = (item) => typeof item === 'string' ? item : item?.image || item?.url || item?.src || '';
const asUrl = (value) => value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : '';
const retailAddress = (place) => [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name].filter(Boolean).join(', ');

function HomeApplianceVideoModal({ video, onClose }) {
  const url = video?.url || video?.src || '';
  let source = url;
  let embed = false;
  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1).split('/')[0] : parsed.searchParams.get('v') || parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];
    if (id) { source = `https://www.youtube.com/embed/${id}?autoplay=1`; embed = true; }
    else if (parsed.hostname.includes('vimeo.com')) { const videoId = parsed.pathname.match(/\/(?:video\/)?(\d+)/)?.[1]; if (videoId) { source = `https://player.vimeo.com/video/${videoId}?autoplay=1`; embed = true; } }
    else if (parsed.hostname.includes('drive.google.com')) { const fileId = parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1]; if (fileId) { source = `https://drive.google.com/file/d/${fileId}/preview`; embed = true; } }
  } catch { /* Direct video source. */ }
  if (!source) return null;
  return <div role="presentation" className="fixed inset-0 z-[70] grid place-items-center bg-[#071526]/90 p-4" onClick={onClose}><section role="dialog" aria-modal="true" aria-label={video.title || 'Home appliances video'} className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}><button type="button" aria-label="Close video" onClick={onClose} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-xl text-white">×</button><div className="aspect-video">{embed ? <iframe src={source} title={video.title || 'Home appliances video'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full border-0" /> : <video src={source} controls autoPlay playsInline className="h-full w-full" />}</div><p className="px-4 py-3 text-sm font-semibold text-white">{video.title || video.caption || 'Home appliances video'}</p></section></div>;
}

export default function HomeAppliancesPublicPage({ place }) {
  const profile = getProfileData(place);
  const attributes = place.attributes || {};
  const profileData = attributes.businessProfile || {};
  const specific = profileData.categorySpecific || {};
  const common = profileData.common || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const gallery = useMemo(() => {
    const saved = profile.gallery?.length ? profile.gallery : place.images || [];
    return saved.map((image, index) => ({ src: mediaSource(image), index })).filter((image) => image.src).slice(0, 10);
  }, [place.images, profile.gallery]);
  const products = firstList(specific.products, specific.productItems, attributes.products, attributes.featuredProducts, attributes.productList);
  const savedCategories = firstList(specific.productCategories, specific.products, attributes.productCategories, attributes.products);
  const services = firstList(specific.services, specific.specialtyServices, place.services, profile.services);
  const videosSource = profile.videos?.length ? profile.videos : firstList(common.videos, place.videos, place.video, attributes.videos);
  const videos = videosSource.map((video) => typeof video === 'string' ? { url: video } : video).filter((video) => video?.url || video?.src);
  const facilities = firstList(place.facilities, specific.features, specific.infrastructure, attributes.facilities);
  const savedOffer = firstList(specific.offer, specific.offers, attributes.offer, attributes.offers);

  const name = place.name || common.businessName || 'Home Appliances';
  const tagline = profile.tagline || place.tagline || '';
  const description = place.description || profile.about || `${name} is a trusted destination for quality home appliances, expert guidance and dependable customer service.`;
  const phone = place.phone || common.phone || profile.phone || '';
  const whatsappValue = place.socialLinks?.whatsapp || profile.socialMedia?.whatsapp || profile.whatsapp || phone;
  const whatsapp = getWhatsAppUrl(whatsappValue);
  const email = place.email || common.email || profile.email || '';
  const website = asUrl(place.website || common.website || profile.website);
  const location = retailAddress(place);
  const mapUrl = location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : '';
  const callUrl = phone ? `tel:${String(phone).replace(/\s+/g, '')}` : '';
  const logo = profile.logo || place.logo || '';
  const heroImage = profile.coverImage || place.coverImage || gallery[0]?.src || '';
  const aboutImage = profile.aboutImage || specific.aboutImage || place.aboutImage || gallery[1]?.src || gallery[0]?.src || heroImage;
  const socialLinks = profile.socialMedia || place.socialLinks || {};
  const hours = firstList(profile.openingHours, place.workingHours).filter((hour) => hour?.day && (hour.open || hour.close || hour.closed));
  const rating = Number(place.rating?.average || 0);
  const ratingCount = Number(place.rating?.count || 0);
  const statistics = [
    [specific.happyCustomers || specific.customersServed, 'Happy Customers', '♟'],
    [specific.featuredBrands || specific.brandCount || specific.brands?.length, 'Top Brands', '▦'],
    [specific.yearsExperience || specific.yearsInBusiness, 'Years of Experience', '★'],
    [ratingCount ? `${rating.toFixed(1)} / 5` : specific.customerSatisfaction, 'Customer Satisfaction', '◇'],
  ].filter(([value]) => value);
  const navItems = [['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Gallery', '#gallery'], ['Contact', '#contact']];
  const visitStoreUrl = mapUrl || '#contact';

  return (
    <div className="min-h-screen bg-white text-[#17283d]">
      <header className="sticky top-0 z-40 border-b border-[#e5e9ee] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-[68px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-7">
          <a href="#home" className="flex min-w-0 items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-[#e1e6ec] bg-white">{logo ? <ImageFrame src={logo} alt={`${name} logo`} /> : <span className="font-display text-lg font-bold text-[#17375e]">{name.slice(0, 1)}</span>}</div><span className="min-w-0"><span className="block truncate font-display text-sm font-extrabold uppercase text-[#183454] sm:text-base">{name}</span><span className="block truncate text-[10px] text-[#6a7683]">{tagline || 'Home Appliances'}</span></span></a>
          <nav className="hidden items-center gap-6 text-xs font-semibold lg:flex">{navItems.map(([label, target], index) => <a key={target} href={target} className={`border-b-2 px-1 py-2 ${index === 0 ? 'rounded bg-[#17375e] px-4 py-2 text-white' : 'border-transparent text-[#273b52] hover:border-[#ef7417] hover:text-[#17375e]'}`}>{label}</a>)}</nav>
          <div className="hidden items-center gap-2 md:flex">{phone && <a href={callUrl} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold text-[#183454]"><span className="text-[#f06b10]">☎</span>{phone}</a>}<a href={visitStoreUrl} target={mapUrl ? '_blank' : undefined} rel="noreferrer" className="rounded-md bg-[#f36e12] px-4 py-2.5 text-xs font-bold text-white">Visit Store</a></div>
          <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="rounded border border-[#cfd6de] px-3 py-2 text-lg lg:hidden">☰</button>
        </div>
        {menuOpen && <nav className="border-t border-[#e5e9ee] bg-white px-4 py-2 lg:hidden">{navItems.map(([label, target]) => <a key={target} href={target} onClick={() => setMenuOpen(false)} className="block border-b border-[#edf0f3] py-3 text-sm font-semibold last:border-0">{label}</a>)}<div className="flex gap-2 py-3">{phone && <a href={callUrl} className="flex-1 rounded bg-[#17375e] px-3 py-2.5 text-center text-xs font-bold text-white">Call Now</a>}<a href={visitStoreUrl} target={mapUrl ? '_blank' : undefined} rel="noreferrer" className="flex-1 rounded bg-[#f36e12] px-3 py-2.5 text-center text-xs font-bold text-white">Visit Store</a></div></nav>}
      </header>

      <main>
        <section id="home" className="relative isolate overflow-hidden bg-[#122b49] text-white">
          {heroImage && <div className="absolute inset-0"><ImageFrame src={heroImage} alt={`${name} showroom`} eager /><div className="absolute inset-0 bg-gradient-to-r from-[#102744]/95 via-[#102744]/80 to-[#102744]/10" /></div>}
          <div className="relative mx-auto grid min-h-[430px] max-w-[1500px] items-center gap-6 px-5 py-10 sm:min-h-[500px] sm:px-8 lg:grid-cols-[.95fr_1.05fr_.3fr]">
            <div className="max-w-[560px]"><div className="mb-4 h-1 w-12 bg-[#f47718]"/><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#ff9a45]">{tagline || 'YOUR HOME, MADE SMARTER'}</p><h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-[58px]">Best <span className="text-[#ff7b17]">Home Appliances</span><br />for a Better Living</h1><p className="mt-4 max-w-md text-sm leading-6 text-white/85">Wide range of branded home appliances with the latest technology for your modern lifestyle.</p><div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold text-white/90">{[['◇', '100% Products'], ['▣', 'Fast Delivery'], ['⚙', 'Expert Installation'], ['✦', 'After Sales Support']].map(([icon, label]) => <span key={label} className="inline-flex items-center gap-1.5"><span className="text-sm text-[#ff8b24]">{icon}</span>{label}</span>)}</div><div className="mt-6 flex flex-wrap gap-3"><a href="#products" className="rounded-md bg-[#f36e12] px-5 py-3 text-sm font-bold text-white">Explore Products →</a><a href={visitStoreUrl} target={mapUrl ? '_blank' : undefined} rel="noreferrer" className="rounded-md bg-white px-5 py-3 text-sm font-bold text-[#183454]">⌖ Visit Our Store</a></div></div>
            <div className="relative hidden min-h-[330px] lg:block"><div className="absolute inset-0 overflow-hidden rounded-md border border-white/65 shadow-2xl">{heroImage && <ImageFrame src={heroImage} alt={`${name} appliance showroom`} />}</div>{gallery.slice(0, 2).map((image, index) => <div key={image.src} className={`absolute z-10 w-[38%] overflow-hidden rounded-md border-2 border-white shadow-xl ${index === 0 ? '-right-3 top-3 rotate-2' : '-bottom-3 -left-3 -rotate-2'}`}><ImageFrame src={image.src} alt={`${name} showroom display ${index + 1}`} className="h-24 w-full object-cover" /></div>)}</div>
            <aside className="hidden border-l-2 border-[#f37a18] py-2 pl-4 lg:block"><h2 className="font-display text-2xl font-extrabold leading-tight text-white">Smart<br /><span className="text-[#ff821c]">Appliances</span><br />Smart Living</h2><ul className="mt-5 space-y-2 text-xs text-white/85"><li>Top Brands</li><li>Best Prices</li><li>Expert Support</li></ul></aside>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-[1500px] items-center gap-6 px-4 py-7 sm:px-7 lg:grid-cols-[.95fr_1.05fr]">
          <div className="min-h-[230px] overflow-hidden rounded-lg bg-[#eef1f4] shadow-sm sm:min-h-[300px]">{aboutImage && <ImageFrame src={aboutImage} alt={`${name} showroom interior`} />}</div>
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#f06e12]">ABOUT OUR STORE</p><h2 className="mt-2 font-display text-3xl font-extrabold text-[#17375e]">About Us <span className="text-sm text-[#f06e12]">━━</span></h2><p className="mt-3 text-sm leading-6 text-[#5e6a78]">{description}</p><a href="#contact" className="mt-4 inline-flex rounded-md bg-[#f36e12] px-4 py-2.5 text-xs font-bold text-white">Read More</a><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{statistics.map(([value, label, icon]) => <div key={label} className="rounded-md border border-[#e6eaf0] bg-[#fff7f3] px-2 py-3 text-center"><span className="text-lg text-[#f06e12]">{icon}</span><p className="mt-1 text-sm font-extrabold text-[#17375e]">{value}</p><p className="text-[9px] leading-4 text-[#697482]">{label}</p></div>)}</div></div>
        </section>

        <section id="services" className="bg-[#f7f8fa] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-extrabold text-[#17375e]">Our Services <span className="text-sm text-[#f06e12]">━━</span></h2><p className="mt-1 text-xs text-[#697482]">Explore the latest appliances and helpful store services.</p></div><a href="#products" className="text-xs font-bold text-[#ec6b12]">View All Services →</a></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{applianceCategories.map((category, index) => { const savedCategory = savedCategories.find((item) => normalize(typeof item === 'string' ? item : item.name || item.title).includes(normalize(category.name)) || normalize(category.name).includes(normalize(typeof item === 'string' ? item : item.name || item.title))); const label = typeof savedCategory === 'string' ? savedCategory : savedCategory?.name || savedCategory?.title || category.name; const image = typeof savedCategory === 'object' ? savedCategory.image || savedCategory.photo : ''; const photo = image || gallery[index % Math.max(gallery.length, 1)]?.src; return <button key={category.name} type="button" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="group grid grid-cols-[40%_1fr] overflow-hidden rounded-md border border-[#e2e7ed] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="relative min-h-24 overflow-hidden bg-[#edf2f8]">{photo && <ImageFrame src={mediaSource(photo)} alt={label} className="transition duration-300 group-hover:scale-105" />}<span className="absolute bottom-2 left-2 grid h-8 w-8 place-items-center rounded bg-white text-lg text-[#1264bd] shadow">{category.icon}</span></div><div className="p-3"><h3 className="text-xs font-extrabold text-[#17375e]">{label}</h3><p className="mt-1 text-[10px] leading-4 text-[#657180]">{category.detail}</p></div></button>; })}</div></div></section>

        {products.length > 0 && <section id="products" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-extrabold text-[#17375e]">Featured Products</h2><p className="mt-1 text-xs text-[#697482]">Products and details provided by the store</p></div></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{products.slice(0, 8).map((item, index) => { const image = item.image || item.photo || item.url || gallery[index % Math.max(gallery.length, 1)]?.src; return <article key={`${item.name || item.title}-${index}`} className="overflow-hidden rounded-md border border-[#e2e7ed] bg-white shadow-sm"><div className="aspect-[4/3] bg-[#eff2f5]">{image && <ImageFrame src={image} alt={item.name || item.title || 'Appliance product'} />}</div><div className="p-3"><h3 className="text-sm font-bold text-[#17375e]">{item.name || item.title}</h3>{(item.brand || item.category) && <p className="mt-1 text-[10px] text-[#77818b]">{[item.brand, item.category].filter(Boolean).join(' · ')}</p>}{item.description && <p className="mt-2 line-clamp-2 text-xs text-[#66717e]">{item.description}</p>}{(item.price || item.offerPrice) && <p className="mt-2 font-bold text-[#ed6d12]">{item.offerPrice || item.price}</p>}<div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => setSelectedProduct(item)} className="rounded border border-[#17375e] px-3 py-2 text-[10px] font-bold text-[#17375e]">View Details</button><a href={callUrl || '#contact'} className="rounded bg-[#17375e] px-3 py-2 text-[10px] font-bold text-white">Enquire</a></div></div></article>; })}</div></section>}

        {savedOffer.length > 0 && <section className="bg-[#fff7f2] px-4 py-6 sm:px-7"><div className="mx-auto max-w-[1500px]"><h2 className="font-display text-2xl font-extrabold text-[#17375e]">Store Offers</h2><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{toList(savedOffer).map((offer, index) => <article key={`${offer}-${index}`} className="rounded-md border border-[#f2d6c3] bg-white p-4"><p className="text-sm font-bold text-[#17375e]">{typeof offer === 'string' ? offer : offer.title || offer.name || 'Current offer'}</p>{typeof offer === 'object' && offer.description && <p className="mt-2 text-xs text-[#697482]">{offer.description}</p>}</article>)}</div></div></section>}

        <section id="gallery" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-extrabold text-[#17375e]">Our Gallery <span className="text-sm text-[#f06e12]">━━</span></h2><p className="mt-1 text-xs text-[#697482]">A look inside our showroom and product displays</p></div><button type="button" onClick={() => gallery[0] && setLightboxImage(gallery[0].src)} className="text-xs font-bold text-[#ed6d12]">View All Photos →</button></div>{gallery.length ? <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">{gallery.map((image) => <button key={`${image.src}-${image.index}`} type="button" onClick={() => setLightboxImage(image.src)} className="aspect-[4/3] overflow-hidden rounded-md border border-[#e2e7ed] bg-[#eff2f5]"><ImageFrame src={image.src} alt={`${name} showroom image ${image.index + 1}`} className="transition duration-300 hover:scale-105" /></button>)}</div> : <p className="mt-4 rounded-md bg-[#f4f6f8] p-5 text-sm text-[#697482]">Showroom photos have not been added yet.</p>}</section>

        {videos.length > 0 && <section className="bg-[#f7f8fa] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-extrabold text-[#17375e]">Our Videos</h2><p className="mt-1 text-xs text-[#697482]">Showroom tours, products and customer experiences</p></div><a href="#videos" className="text-xs font-bold text-[#ed6d12]">View All Videos →</a></div><div id="videos" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{videos.slice(0, 6).map((video, index) => { const image = video.thumbnail || video.image || gallery[index % Math.max(gallery.length, 1)]?.src; return <button key={`${video.url || video.src}-${index}`} type="button" onClick={() => setActiveVideo(video)} className="overflow-hidden rounded-md border border-[#e2e7ed] bg-white text-left shadow-sm"><div className="relative aspect-video bg-[#17283d]">{image && <ImageFrame src={image} alt={video.title || video.caption || videoTitles[index % videoTitles.length]} />}<span className="absolute inset-0 grid place-items-center bg-black/15"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#f36e12] text-lg text-white">▶</span></span>{video.duration && <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-1 text-[10px] font-bold text-white">{video.duration}</span>}</div><span className="block truncate px-3 py-2.5 text-xs font-bold text-[#17375e]">{video.title || video.caption || videoTitles[index % videoTitles.length]}</span></button>; })}</div></div></section>}

        <section className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><h2 className="font-display text-3xl font-extrabold text-[#17375e]">Our Infrastructure</h2><p className="mt-1 text-xs text-[#697482]">Support for a smooth showroom experience</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{infrastructureDefaults.map(([icon, title, text], index) => { const saved = facilities.find((entry) => normalize(typeof entry === 'string' ? entry : entry.name || entry.title).includes(normalize(title))); const label = saved ? (typeof saved === 'string' ? saved : saved.name || saved.title) : title; return <article key={title} className="rounded-md border border-[#e2e7ed] bg-white p-3 text-center shadow-sm"><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#edf4fb] text-xl text-[#1467bd]">{icon}</span><h3 className="mt-2 text-xs font-bold text-[#17375e]">{label}</h3><p className="mt-1 text-[10px] leading-4 text-[#697482]">{saved ? 'Available at this store' : text}</p></article>; })}</div></section>

        <section id="reviews" className="bg-[#f7f8fa] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><h2 className="font-display text-3xl font-extrabold text-[#17375e]">Customer Reviews</h2><div className="mt-4 rounded-md border border-[#e2e7ed] bg-white p-4 sm:p-6"><ReviewsSection placeId={place._id} /></div></div></section>
      </main>

      <footer id="contact" className="bg-[#102744] px-4 py-8 text-white sm:px-7"><div className="mx-auto grid max-w-[1500px] gap-6 sm:grid-cols-2 lg:grid-cols-4"><div><h3 className="font-display text-lg font-bold">Our Location</h3><p className="mt-3 text-xs leading-5 text-white/75">{name}<br />{location || 'Address not provided'}</p>{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded bg-[#f36e12] px-3 py-2 text-[10px] font-bold text-white">Get Directions</a>}</div><div><h3 className="font-display text-lg font-bold">Contact Details</h3><div className="mt-3 space-y-2 text-xs text-white/75">{phone && <a className="block" href={callUrl}>☎ {phone}</a>}{whatsapp && <a className="block" href={whatsapp} target="_blank" rel="noreferrer">◉ WhatsApp</a>}{email && <a className="block" href={`mailto:${email}`}>✉ {email}</a>}{website && <a className="block" href={website} target="_blank" rel="noreferrer">Visit website</a>}</div></div><div><h3 className="font-display text-lg font-bold">Follow Us</h3><div className="mt-3 flex flex-wrap gap-2">{Object.entries(socialLinks).filter(([, value]) => value).map(([network, value]) => <a key={network} href={network === 'whatsapp' ? whatsapp : asUrl(value)} target="_blank" rel="noreferrer" aria-label={network} className="grid h-9 min-w-9 place-items-center rounded bg-white/10 px-2 text-xs font-bold">{network.slice(0, 1)}</a>)}</div></div><div><h3 className="font-display text-lg font-bold">G-Pages</h3><p className="mt-3 text-xs text-white/70">Powered by G-Pages</p><p className="text-xs text-white/60">Create your business website</p><a href="/" className="mt-3 inline-flex rounded bg-[#f36e12] px-3 py-2 text-xs font-bold text-white">Back to Home</a></div></div></footer>

      <div className="fixed bottom-3 left-1/2 z-40 w-[92%] max-w-sm -translate-x-1/2 rounded-full border border-[#d8e0e9] bg-white/95 p-2 shadow-lg backdrop-blur md:hidden"><div className="flex gap-2">{phone && <a href={callUrl} className="flex-1 rounded-full bg-[#17375e] px-3 py-2.5 text-center text-xs font-bold text-white">Call</a>}<a href={visitStoreUrl} target={mapUrl ? '_blank' : undefined} rel="noreferrer" className="flex-1 rounded-full bg-[#f36e12] px-3 py-2.5 text-center text-xs font-bold text-white">Visit Store</a>{whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#12a85a] px-3 py-2.5 text-center text-xs font-bold text-white">WhatsApp</a>}</div></div>
      {lightboxImage && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-[#071526]/90 p-4" onClick={() => setLightboxImage('')}><button type="button" aria-label="Close image" onClick={() => setLightboxImage('')} className="absolute right-4 top-4 rounded bg-white px-4 py-2 text-sm font-bold text-[#17283d]">Close</button><img src={lightboxImage} alt={`${name} gallery image enlarged`} className="max-h-[90vh] max-w-[94vw] rounded-md object-contain" onClick={(event) => event.stopPropagation()} /></div>}
      {activeVideo && <HomeApplianceVideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
      {selectedProduct && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-[#071526]/70 p-4" onClick={() => setSelectedProduct(null)}><section role="dialog" aria-modal="true" aria-label={selectedProduct.name || selectedProduct.title || 'Product details'} className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><button type="button" aria-label="Close product details" onClick={() => setSelectedProduct(null)} className="float-right text-xl">×</button><h2 className="font-display text-2xl font-bold text-[#17375e]">{selectedProduct.name || selectedProduct.title}</h2><p className="mt-3 text-sm leading-6 text-[#697482]">{selectedProduct.description || 'Contact the store for product details and availability.'}</p>{phone && <a href={callUrl} className="mt-5 inline-flex rounded bg-[#f36e12] px-4 py-2.5 text-sm font-bold text-white">Call to Enquire</a>}</section></div>}
    </div>
  );
}

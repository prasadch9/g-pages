import React, { useMemo, useState } from 'react';
import ReviewsSection from '../../../components/ReviewsSection';
import { getProfileData, ImageFrame } from '../../../components/public/PublicProfileShared';
import { getWhatsAppUrl } from '../../healthcare-medical/healthcareUtils';

const furnitureIcons = ['▣', '▰', '⌑', '▤', '▥', '⌂', '⚒'];
const galleryFilters = ['All', 'Living Room', 'Bedroom', 'Dining', 'Office', 'Sofas', 'Wardrobes', 'Custom'];
const galleryAliases = {
  'Living Room': ['living', 'lounge', 'tv unit'],
  Bedroom: ['bed', 'bedroom', 'wardrobe'],
  Dining: ['dining', 'table'],
  Office: ['office', 'desk', 'workspace'],
  Sofas: ['sofa', 'couch', 'recliner'],
  Wardrobes: ['wardrobe', 'storage'],
  Custom: ['custom', 'made to measure'],
};
const infrastructureIcons = ['▦', '⌖', '⚒', '➜', '⚙', '♙'];

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(/[\n,]/).map((entry) => entry.trim()).filter(Boolean);
  return value ? [value] : [];
};
const firstList = (...values) => values.map(toList).find((items) => items.length) || [];
const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
const mediaUrl = (item) => typeof item === 'string' ? item : item?.image || item?.url || item?.src || '';
const mediaTag = (item) => typeof item === 'object' ? normalize(item.category || item.type || item.room || item.name || item.title) : '';
const externalUrl = (value) => value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : '';
const addressOf = (place) => [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name].filter(Boolean).join(', ');

function FurnitureVideoModal({ video, onClose }) {
  const url = video?.url || video?.src || '';
  let source = url;
  let embed = false;
  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1).split('/')[0] : parsed.searchParams.get('v') || parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];
    if (id) { source = `https://www.youtube.com/embed/${id}?autoplay=1`; embed = true; }
    else if (parsed.hostname.includes('vimeo.com')) { const videoId = parsed.pathname.match(/\/(?:video\/)?(\d+)/)?.[1]; if (videoId) { source = `https://player.vimeo.com/video/${videoId}?autoplay=1`; embed = true; } }
  } catch { /* Direct video source. */ }
  if (!source) return null;
  return <div role="presentation" className="fixed inset-0 z-[70] grid place-items-center bg-[#17100c]/90 p-4" onClick={onClose}><section role="dialog" aria-modal="true" aria-label={video.title || video.caption || 'Furniture video'} className="relative w-full max-w-4xl overflow-hidden rounded-lg bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}><button type="button" aria-label="Close video" onClick={onClose} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-xl text-white">×</button><div className="aspect-video">{embed ? <iframe src={source} title={video.title || video.caption || 'Furniture video'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full border-0" /> : <video src={source} controls autoPlay playsInline className="h-full w-full" />}</div><p className="px-4 py-3 text-sm font-semibold text-white">{video.title || video.caption || 'Furniture video'}</p></section></div>;
}

export default function FurnitureShopPublicPage({ place }) {
  const profile = getProfileData(place);
  const specific = place.attributes?.businessProfile?.categorySpecific || {};
  const common = place.attributes?.businessProfile?.common || {};
  const attributes = place.attributes || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [lightboxImage, setLightboxImage] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const gallery = useMemo(() => {
    const source = profile.gallery?.length ? profile.gallery : place.images || [];
    return source.map((image, index) => ({ src: mediaUrl(image), tag: mediaTag(image), index })).filter((image) => image.src).slice(0, 10);
  }, [place.images, profile.gallery]);
  const productItems = firstList(specific.products, specific.productItems, specific.featuredProducts, attributes.products, attributes.productItems, attributes.featuredProducts);
  const collections = firstList(specific.collections, specific.productCategories, attributes.collections, attributes.productCategories);
  const services = firstList(specific.services, specific.specialtyServices, place.services, profile.services);
  const savedFeatures = firstList(place.facilities, specific.infrastructure, specific.features, attributes.facilities);
  const furnitureCategories = firstList(collections, specific.products, attributes.products).map((item, index) => {
    const record = typeof item === 'string' ? { name: item } : item;
    return [record?.name || record?.title || '', record?.description || '', furnitureIcons[index % furnitureIcons.length]];
  }).filter(([title]) => title);
  const infrastructureDefaults = savedFeatures.map((feature, index) => {
    const record = typeof feature === 'string' ? { name: feature } : feature;
    return [infrastructureIcons[index % infrastructureIcons.length], record?.name || record?.title || '', record?.description || ''];
  }).filter(([, title]) => title);
  const whyChooseItems = firstList(specific.whyChooseUs, specific.reasonsToChoose, attributes.whyChooseUs);
  const videoItems = (profile.videos?.length ? profile.videos : firstList(common.videos, place.videos, place.video, attributes.videos)).map((video) => typeof video === 'string' ? { url: video } : video).filter((video) => video?.url || video?.src);
  const videoTitleDefaults = videoItems.map((video, index) => video.title || video.caption || `Video ${index + 1}`);
  const offerItems = firstList(specific.offers, specific.offer, attributes.offers, attributes.offer);

  const name = place.name || common.businessName || 'Furniture Showroom';
  const tagline = profile.tagline || place.tagline || '';
  const description = place.description || profile.about || '';
  const phone = place.phone || common.phone || profile.phone || '';
  const whatsappNumber = place.socialLinks?.whatsapp || profile.socialMedia?.whatsapp || profile.whatsapp || phone;
  const whatsapp = getWhatsAppUrl(whatsappNumber);
  const email = place.email || common.email || profile.email || '';
  const website = externalUrl(place.website || common.website || profile.website);
  const location = addressOf(place);
  const directions = location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : '';
  const callUrl = phone ? `tel:${String(phone).replace(/\s+/g, '')}` : '';
  const logo = profile.logo || place.logo || '';
  const heroImage = profile.coverImage || place.coverImage || gallery[0]?.src || '';
  const aboutImage = profile.aboutImage || specific.aboutImage || place.aboutImage || gallery[1]?.src || gallery[0]?.src || heroImage;
  const socials = profile.socialMedia || place.socialLinks || {};
  const rating = Number(place.rating?.average || 0);
  const ratingCount = Number(place.rating?.count || 0);
  const years = specific.yearsExperience || specific.yearsInBusiness;
  const customers = specific.happyCustomers || specific.customersServed;
  const designs = specific.furnitureDesigns || specific.designCount || collections.length;
  const stats = [
    [customers, 'Happy Customers', '♟'],
    [designs || undefined, 'Furniture Designs', '▦'],
    [years, 'Years of Experience', '★'],
    [ratingCount ? `${rating.toFixed(1)} / 5` : specific.customerSatisfaction, 'Customer Satisfaction', '👍'],
  ].filter(([value]) => value);
  const visibleGallery = galleryFilter === 'All' ? gallery : gallery.filter((item) => {
    if (!item.tag) return true;
    return (galleryAliases[galleryFilter] || [normalize(galleryFilter)]).some((alias) => item.tag.includes(normalize(alias)));
  });
  const serviceList = services;
  const heroHighlights = [...new Set([...services, ...collections, ...firstList(specific.materials, specific.featuredBrands)]
    .map((item) => typeof item === 'string' ? item : item?.name || item?.title || '')
    .filter(Boolean))].slice(0, 5);
  const products = productItems.filter((item) => typeof item === 'object' && (item.name || item.title)).slice(0, 8);
  const nav = [['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Gallery', '#gallery'], ['Contact', '#contact']];

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#3b2b21]">
      <header className="sticky top-0 z-40 border-b border-[#eee4d8] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-[68px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-7">
          <a href="#home" className="flex min-w-0 items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md border border-[#e8ddcf] bg-white">{logo ? <ImageFrame src={logo} alt={`${name} logo`} /> : <span className="font-display text-lg font-bold text-[#91401f]">{name.slice(0, 1)}</span>}</div><span className="min-w-0"><span className="block truncate font-display text-lg font-extrabold text-[#4a2c1d] sm:text-xl">{name}</span><span className="block truncate text-[10px] text-[#75675b]">{tagline || 'Style Your Home'}</span></span></a>
          <nav className="hidden items-center gap-6 text-xs font-semibold lg:flex">{nav.map(([label, target], index) => <a key={target} href={target} className={`border-b-2 px-1 py-2 ${index === 0 ? 'rounded bg-[#963d18] px-4 py-2 text-white' : 'border-transparent text-[#49382e] hover:border-[#be6d31] hover:text-[#8d391c]'}`}>{label}</a>)}</nav>
          <div className="hidden items-center gap-2 md:flex">{phone && <a href={callUrl} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold text-[#49382e]"><span className="text-[#a34e21]">☎</span>{phone}</a>}<a href={directions || '#contact'} target={directions ? '_blank' : undefined} rel="noreferrer" className="rounded-md bg-[#963d18] px-4 py-2.5 text-xs font-bold text-white">Visit Our Showroom</a></div>
          <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="rounded border border-[#e6dbcf] px-3 py-2 text-lg lg:hidden">☰</button>
        </div>
        {menuOpen && <nav className="border-t border-[#eee4d8] bg-white px-4 py-2 lg:hidden">{nav.map(([label, target]) => <a key={target} href={target} onClick={() => setMenuOpen(false)} className="block border-b border-[#f3eee7] py-3 text-sm font-semibold last:border-0">{label}</a>)}<div className="flex gap-2 py-3">{phone && <a href={callUrl} className="flex-1 rounded bg-[#963d18] px-3 py-2.5 text-center text-xs font-bold text-white">Call Now</a>}<a href={directions || '#contact'} target={directions ? '_blank' : undefined} rel="noreferrer" className="flex-1 rounded bg-[#c76c2d] px-3 py-2.5 text-center text-xs font-bold text-white">Visit Showroom</a></div></nav>}
      </header>

      <main>
        <section id="home" className="relative isolate overflow-hidden bg-[#25160f] text-white">
          {heroImage && <div className="absolute inset-0"><ImageFrame src={heroImage} alt={`${name} furniture showroom`} eager /><div className="absolute inset-0 bg-gradient-to-r from-[#21150f]/95 via-[#2c1d14]/75 to-[#2c1d14]/15" /></div>}
          <div className="relative mx-auto grid min-h-[440px] max-w-[1500px] items-center gap-6 px-5 py-10 sm:min-h-[510px] sm:px-8 lg:grid-cols-[1fr_.34fr]">
            <div className="max-w-[680px]"><div className="mb-4 h-1 w-12 bg-[#de8d31]"/><p className="text-[10px] font-extrabold uppercase tracking-[.23em] text-[#f0bd6c]">{tagline || 'FURNITURE SHOWROOM'}</p><h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-[60px]">{name}</h1>{description && <p className="mt-4 text-sm leading-6 text-white/90">{description}</p>}{heroHighlights.length > 0 && <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold text-white/90">{heroHighlights.map((label, index) => <span key={label} className="inline-flex items-center gap-1.5"><span className="text-sm text-[#edab50]">{['▦', '✂', '◇', '➜', '✦'][index % 5]}</span>{label}</span>)}</div>}<div className="mt-6 flex flex-wrap gap-3"><a href="#collections" className="rounded-md bg-[#a8491e] px-5 py-3 text-sm font-bold text-white shadow-lg">Explore Collection →</a><a href={directions || '#contact'} target={directions ? '_blank' : undefined} rel="noreferrer" className="rounded-md bg-white px-5 py-3 text-sm font-bold text-[#4a2c1d]">⌖ Visit Our Showroom</a></div></div>
            <aside className="hidden min-h-[260px] flex-col justify-center border-l-2 border-[#d78c39] bg-[#fffaf1]/95 px-5 py-6 text-[#33251d] shadow-xl lg:flex"><h2 className="font-display text-3xl font-bold leading-tight">Make<br />Your Home<br /><span className="text-[#9c481f]">More Beautiful</span></h2><p className="mt-4 text-sm leading-6">Stylish Furniture<br />for Every Space</p><span className="mt-4 h-1 w-10 bg-[#c36e30]" /></aside>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-[1500px] items-center gap-6 px-4 py-7 sm:px-7 lg:grid-cols-[.95fr_1.05fr]">
          <div className="min-h-[230px] overflow-hidden rounded-lg bg-[#eee8df] shadow-sm sm:min-h-[300px]">{aboutImage && <ImageFrame src={aboutImage} alt={`${name} furniture showroom interior`} />}</div>
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#b95d25]">ABOUT OUR SHOWROOM</p><h2 className="mt-2 font-display text-3xl font-extrabold text-[#3c2b20]">About Us <span className="text-sm text-[#bf6932]">━━</span></h2><p className="mt-3 text-sm leading-6 text-[#625950]">{description}</p><a href="#contact" className="mt-4 inline-flex rounded-md bg-[#98431d] px-4 py-2.5 text-xs font-bold text-white">Read More</a><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{stats.map(([value, label, icon]) => <div key={label} className="rounded-md border border-[#eee5da] bg-[#fff8f1] px-2 py-3 text-center"><span className="text-lg text-[#a34b1f]">{icon}</span><p className="mt-1 text-sm font-extrabold text-[#3d3027]">{value}</p><p className="text-[9px] leading-4 text-[#73685f]">{label}</p></div>)}</div></div>
        </section>

        {furnitureCategories.length > 0 && <section id="services" className="bg-[#fbf8f3] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-extrabold text-[#3e2c21]">Furniture Categories <span className="text-sm text-[#bd6934]">━━</span></h2></div><a href="#collections" className="text-xs font-bold text-[#a14920]">View Collections →</a></div><div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">{furnitureCategories.map(([title, descriptionText, icon], index) => { const saved = serviceList.find((entry) => normalize(typeof entry === 'string' ? entry : entry.name || entry.title).includes(normalize(title)) || normalize(title).includes(normalize(typeof entry === 'string' ? entry : entry.name || entry.title))); const label = saved ? (typeof saved === 'string' ? saved : saved.name || saved.title) : title; const image = typeof saved === 'object' ? saved.image || saved.photo : ''; const photo = image || gallery[index % Math.max(gallery.length, 1)]?.src; return <article key={title} className="overflow-hidden rounded-md border border-[#e9e1d7] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="relative aspect-[4/3] overflow-hidden bg-[#eee7de]">{photo && <ImageFrame src={mediaUrl(photo)} alt={label} className="transition duration-300 hover:scale-105" />}<span className="absolute bottom-2 left-2 grid h-8 w-8 place-items-center rounded bg-white/95 text-lg text-[#93431e]">{icon}</span></div><div className="p-2.5"><h3 className="text-[10px] font-extrabold leading-4 text-[#3d2b20]">{label}</h3>{descriptionText && <p className="mt-1 text-[9px] leading-4 text-[#74685d]">{descriptionText}</p>}</div></article>; })}</div></div></section>}

        {(collections.length > 0 || products.length > 0) && <section id="collections" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-extrabold text-[#3e2c21]">Furniture Collections</h2><p className="mt-1 text-xs text-[#75695f]">Featured furniture and designs from the showroom</p></div><a href="#contact" className="text-xs font-bold text-[#a14920]">Ask About a Design →</a></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{[...products, ...collections.map((item) => typeof item === 'string' ? { name: item } : item)].slice(0, 10).map((item, index) => { const image = item.image || item.photo || item.url || gallery[index % Math.max(gallery.length, 1)]?.src; return <article key={`${item.name || item.title || 'furniture'}-${index}`} className="overflow-hidden rounded-md border border-[#e9e1d7] bg-white shadow-sm"><div className="aspect-[4/3] bg-[#eee7de]">{image && <ImageFrame src={mediaUrl(image)} alt={item.name || item.title || 'Furniture collection'} />}</div><div className="p-3"><h3 className="text-sm font-bold text-[#3d2b20]">{item.name || item.title || `Collection ${index + 1}`}</h3>{(item.category || item.material) && <p className="mt-1 text-[10px] text-[#74685d]">{[item.category, item.material].filter(Boolean).join(' · ')}</p>}{item.description && <p className="mt-2 line-clamp-2 text-xs text-[#74685d]">{item.description}</p>}{(item.price || item.offerPrice) && <p className="mt-2 text-sm font-bold text-[#a14920]">{item.offerPrice || item.price}</p>}<div className="mt-3 flex gap-2"><button type="button" onClick={() => setSelectedProduct(item)} className="flex-1 rounded border border-[#98431d] px-2 py-2 text-[10px] font-bold text-[#843918]">View Details</button><a href={callUrl || '#contact'} className="rounded bg-[#98431d] px-3 py-2 text-[10px] font-bold text-white">Enquire</a></div></div></article>; })}</div></section>}

        <section id="gallery" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-extrabold text-[#3e2c21]">Our Gallery <span className="text-sm text-[#bd6934]">━━</span></h2><p className="mt-1 text-xs text-[#75695f]">Furniture, interiors and showroom details</p></div><button type="button" onClick={() => gallery[0] && setLightboxImage(gallery[0].src)} className="text-xs font-bold text-[#a14920]">View All Photos →</button></div>{gallery.length ? <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">{gallery.map((image) => <button key={`${image.src}-${image.index}`} type="button" onClick={() => setLightboxImage(image.src)} className="aspect-[4/3] overflow-hidden rounded-md border border-[#e9e1d7] bg-[#eee7de]"><ImageFrame src={image.src} alt={`${name} showroom photo ${image.index + 1}`} className="transition duration-300 hover:scale-105" /></button>)}</div> : <p className="mt-4 rounded-md bg-[#f7f3ed] p-5 text-sm text-[#75695f]">Showroom photos have not been added yet.</p>}</section>

        {videoItems.length > 0 && <section className="bg-[#fbf8f3] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-extrabold text-[#3e2c21]">Our Videos</h2><p className="mt-1 text-xs text-[#75695f]">Showroom tours, furniture collections and customer stories</p></div><a href="#videos" className="text-xs font-bold text-[#a14920]">View All Videos →</a></div><div id="videos" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{videoItems.slice(0, 6).map((video, index) => { const image = video.thumbnail || video.image || gallery[index % Math.max(gallery.length, 1)]?.src; return <button key={`${video.url || video.src}-${index}`} type="button" onClick={() => setActiveVideo(video)} className="overflow-hidden rounded-md border border-[#e8dfd5] bg-white text-left shadow-sm"><div className="relative aspect-video bg-[#281b13]">{image && <ImageFrame src={mediaUrl(image)} alt={video.title || video.caption || videoTitleDefaults[index % videoTitleDefaults.length]} />}<span className="absolute inset-0 grid place-items-center bg-black/20"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#c74d1b] text-lg text-white">▶</span></span>{video.duration && <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-1 text-[10px] font-bold text-white">{video.duration}</span>}</div><span className="block truncate px-3 py-2.5 text-xs font-bold text-[#3d2b20]">{video.title || video.caption || videoTitleDefaults[index % videoTitleDefaults.length]}</span></button>; })}</div></div></section>}

        {(infrastructureDefaults.length > 0 || whyChooseItems.length > 0) && <section className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7">{infrastructureDefaults.length > 0 && <><h2 className="font-display text-3xl font-extrabold text-[#3e2c21]">Showroom Services & Features</h2><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{infrastructureDefaults.map(([icon, title, text]) => <article key={title} className="rounded-md border border-[#e9e1d7] bg-white p-3 text-center shadow-sm"><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#f8eee4] text-xl text-[#a34a1d]">{icon}</span><h3 className="mt-2 text-[10px] font-bold text-[#3d3027]">{title}</h3>{text && <p className="mt-1 text-[9px] leading-4 text-[#75695f]">{text}</p>}</article>)}</div></>}{whyChooseItems.length > 0 && <div className="mt-5 rounded-md bg-[#fff8f0] p-4"><h3 className="font-bold text-[#493426]">Why Choose Us</h3><div className="mt-3 flex flex-wrap gap-2">{whyChooseItems.map((item) => <span key={item} className="rounded-full border border-[#e8d9c9] bg-white px-3 py-2 text-[10px] font-semibold text-[#655244]">✓ {item}</span>)}</div></div>}</section>}

        {offerItems.length > 0 && <section className="bg-[#fbf6ef] px-4 py-7 sm:px-7"><div className="mx-auto max-w-[1500px]"><h2 className="font-display text-3xl font-extrabold text-[#3e2c21]">Showroom Offers</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{offerItems.map((offer, index) => <article key={`${offer}-${index}`} className="rounded-md border border-[#e9dccb] bg-white p-4"><h3 className="text-sm font-bold text-[#493426]">{typeof offer === 'string' ? offer : offer.name || offer.title || 'Furniture offer'}</h3>{typeof offer === 'object' && offer.description && <p className="mt-2 text-xs text-[#75695f]">{offer.description}</p>}</article>)}</div></div></section>}

        <section id="reviews" className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7"><h2 className="font-display text-3xl font-extrabold text-[#3e2c21]">Customer Reviews</h2><div className="mt-4 rounded-md border border-[#e9e1d7] bg-white p-4 sm:p-6"><ReviewsSection placeId={place._id} /></div></section>
      </main>

      <footer id="contact" className="bg-[#24170f] px-4 py-8 text-white sm:px-7"><div className="mx-auto grid max-w-[1500px] gap-6 sm:grid-cols-2 lg:grid-cols-4"><div><h3 className="font-display text-lg font-bold text-[#edaa4d]">Our Location</h3><p className="mt-3 text-xs leading-5 text-white/75">{name}<br />{location || 'Address not provided'}</p>{directions && <a href={directions} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded bg-[#98431d] px-3 py-2 text-[10px] font-bold">Get Directions</a>}</div><div><h3 className="font-display text-lg font-bold text-[#edaa4d]">Contact Details</h3><div className="mt-3 space-y-2 text-xs text-white/75">{phone && <a href={callUrl} className="block">☎ {phone}</a>}{whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="block">◉ WhatsApp</a>}{email && <a href={`mailto:${email}`} className="block">✉ {email}</a>}{website && <a href={website} target="_blank" rel="noreferrer" className="block">Visit website</a>}</div></div><div><h3 className="font-display text-lg font-bold text-[#edaa4d]">Follow Us</h3><div className="mt-3 flex flex-wrap gap-2">{Object.entries(socials).filter(([, value]) => value).map(([network, value]) => <a key={network} href={network === 'whatsapp' ? whatsapp : externalUrl(value)} target="_blank" rel="noreferrer" aria-label={network} className="grid h-9 min-w-9 place-items-center rounded bg-white/10 px-2 text-xs font-bold">{network.slice(0, 1)}</a>)}</div></div><div><h3 className="font-display text-lg font-bold text-[#edaa4d]">G-Pages</h3><p className="mt-3 text-xs text-white/70">Powered by G-Pages</p><p className="text-xs text-white/60">Create your business website</p><a href="/" className="mt-3 inline-flex rounded bg-[#98431d] px-3 py-2 text-xs font-bold text-white">← Back to Home</a></div></div></footer>

      <div className="fixed bottom-3 left-1/2 z-40 w-[94%] max-w-md -translate-x-1/2 rounded-full border border-[#e9dfd4] bg-white/95 p-2 shadow-lg backdrop-blur md:hidden"><div className="flex gap-2">{phone && <a href={callUrl} className="flex-1 rounded-full bg-[#783b20] px-2 py-2.5 text-center text-xs font-bold text-white">Call</a>}<a href={directions || '#contact'} target={directions ? '_blank' : undefined} rel="noreferrer" className="flex-1 rounded-full bg-[#a8491e] px-2 py-2.5 text-center text-xs font-bold text-white">Showroom</a>{whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#169455] px-2 py-2.5 text-center text-xs font-bold text-white">WhatsApp</a>}</div></div>
      {lightboxImage && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={() => setLightboxImage('')}><button type="button" aria-label="Close image" onClick={() => setLightboxImage('')} className="absolute right-4 top-4 rounded bg-white px-4 py-2 text-sm font-bold text-[#34251c]">Close</button><img src={lightboxImage} alt={`${name} showroom photo enlarged`} className="max-h-[90vh] max-w-[94vw] rounded-md object-contain" onClick={(event) => event.stopPropagation()} /></div>}
      {activeVideo && <FurnitureVideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
      {selectedProduct && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-black/65 p-4" onClick={() => setSelectedProduct(null)}><section role="dialog" aria-modal="true" aria-label={selectedProduct.name || selectedProduct.title || 'Furniture details'} className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><button type="button" aria-label="Close details" onClick={() => setSelectedProduct(null)} className="float-right text-xl">×</button><h2 className="font-display text-2xl font-bold text-[#3d2b20]">{selectedProduct.name || selectedProduct.title}</h2><p className="mt-3 text-sm leading-6 text-[#75695f]">{selectedProduct.description || 'Contact the showroom for dimensions, materials and availability.'}</p>{phone && <a href={callUrl} className="mt-5 inline-flex rounded bg-[#98431d] px-4 py-2.5 text-sm font-bold text-white">Call to Enquire</a>}</section></div>}
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import ReviewsSection from '../ReviewsSection';
import { getProfileData, ImageFrame } from './PublicProfileShared';
import { getWhatsAppUrl } from '../../utils/healthcare';
import NurseryPublicPage from './NurseryPublicPage';

const DEFAULTS = {
  boutique: {
    key: 'boutique', title: 'Trendy Styles\nfor Every You', subtitle: 'Exclusive collections of ethnic wear, western wear, party wear and customized outfits.', eyebrow: 'CURATED STYLE, MADE PERSONAL', accent: '#d52f75', ink: '#172a43', pale: '#fff8f4', heroText: 'text-white', overlay: 'bg-gradient-to-r from-[#101722]/90 via-[#18243a]/60 to-transparent', categoryTitle: 'Our Services', serviceHeading: 'Our Services', serviceDescription: 'Thoughtfully selected styles and personal services for every occasion.', collectionHeading: 'Featured Collections', collectionDescription: 'Explore ethnic, western, party and custom boutique styles.', galleryHeading: 'Our Gallery', galleryDescription: 'A closer look at the latest boutique styles.', featureHeading: 'Our Infrastructure', offerHeading: 'Boutique Offers', cardNames: ['Ethnic Wear', 'Western Wear', 'Party Wear', 'Kids Collection', 'Custom Stitching', 'Accessories'], categories: ['Ethnic Wear', 'Western Wear', 'Party Wear', 'Kids', 'Custom Designs', 'Accessories'], features: ['Spacious Showroom', 'Trial Rooms', 'Wide Collection', 'Customized Stitching', 'Parking Facility', 'AC Environment'], nav: ['Home', 'About', 'Services', 'Gallery', 'Contact'], icon: '♧', action: 'Shop Now', aboutTitle: 'About the Boutique',
  },
  mall: {
    title: 'Everything You Love,\nAll Under One Roof', subtitle: 'Shopping, dining, entertainment and memorable moments for everyone.', eyebrow: 'SHOP · DINE · DISCOVER', accent: '#c89a42', ink: '#142033', pale: '#f5f5f4', heroText: 'text-white', overlay: 'bg-gradient-to-r from-[#101d2d]/90 via-[#101d2d]/65 to-transparent', categoryTitle: 'Explore the Mall', serviceHeading: 'Mall Experiences', serviceDescription: 'A day out with shopping, dining and entertainment.', collectionHeading: 'Featured Stores', collectionDescription: 'Explore stores and destinations around the mall.', galleryHeading: 'Mall Gallery', galleryDescription: 'Explore the spaces and experiences at the mall.', featureHeading: 'Mall Facilities', offerHeading: 'Current Offers & Events', cardNames: ['Shopping', 'Food Court', 'Cinema', 'Entertainment', 'Parking', 'Kids Zone'], categories: ['Fashion', 'Electronics', 'Dining', 'Lifestyle', 'Entertainment', 'Family'], features: ['Parking', 'Food Court', 'Cinema', 'Kids Play Area', 'Security', 'Accessibility'], nav: ['Home', 'About', 'Stores', 'Offers', 'Events', 'Gallery', 'Contact'], icon: '▦', action: 'Explore Stores', aboutTitle: 'About the Mall',
  },
  appliances: {
    title: 'Smart Appliances\nfor a Smarter Home', subtitle: 'Explore dependable home technology, expert advice and convenient services.', eyebrow: 'COMFORT, CONNECTED', accent: '#286acb', ink: '#18304d', pale: '#f4f8fc', heroText: 'text-white', overlay: 'bg-gradient-to-r from-[#0e2946]/92 via-[#18385e]/60 to-transparent', categoryTitle: 'Shop Appliances', serviceHeading: 'Appliance Services', serviceDescription: 'Products, guidance and support for your home.', collectionHeading: 'Featured Products', collectionDescription: 'Explore appliance categories and available products.', galleryHeading: 'Store Gallery', galleryDescription: 'Take a look inside and explore featured products.', featureHeading: 'Store Services & Facilities', offerHeading: 'Offers & Deals', cardNames: ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'TVs', 'Kitchen Appliances', 'Water Purifiers'], categories: ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'TVs', 'Microwaves', 'Kitchen Appliances', 'Water Purifiers', 'Vacuum Cleaners'], features: ['Product Demonstration', 'Installation Service', 'Repair Support', 'Home Delivery', 'Warranty Assistance', 'Flexible Payments'], nav: ['Home', 'About', 'Products', 'Categories', 'Offers', 'Gallery', 'Contact'], icon: '▤', action: 'Explore Products', aboutTitle: 'About the Store',
  },
  furniture: {
    title: 'Beautiful Furniture\nfor Beautiful Spaces', subtitle: 'Thoughtfully selected furniture, custom details and expert craftsmanship for every room.', eyebrow: 'DESIGN YOUR SPACE', accent: '#9a6745', ink: '#3a2b24', pale: '#fbf7f1', heroText: 'text-white', overlay: 'bg-gradient-to-r from-[#20150f]/90 via-[#38261c]/55 to-transparent', categoryTitle: 'Explore Furniture', serviceHeading: 'Furniture Services', serviceDescription: 'From inspiration to delivery, find the right pieces for your home.', collectionHeading: 'Furniture Collections', collectionDescription: 'Explore designs for living, dining, work and rest.', galleryHeading: 'Showroom Gallery', galleryDescription: 'See materials, details and furniture in real spaces.', featureHeading: 'Showroom Services', offerHeading: 'Furniture Offers', cardNames: ['Sofas', 'Beds', 'Dining Sets', 'Wardrobes', 'Office Furniture', 'Custom Furniture'], categories: ['Sofas', 'Beds', 'Dining Sets', 'Wardrobes', 'Office Furniture', 'Living Room', 'Bedroom', 'Custom Furniture'], features: ['Custom Design', 'Quality Materials', 'Expert Craftsmanship', 'Delivery', 'Installation', 'Warranty'], nav: ['Home', 'About', 'Collections', 'Services', 'Gallery', 'Contact'], icon: '⌂', action: 'View Collections', aboutTitle: 'About the Showroom',
  },
  mattress: {
    title: 'Sleep Better.\nWake Better.', subtitle: 'Find supportive sleep essentials selected for comfort, quality and everyday wellbeing.', eyebrow: 'REST WELL, LIVE WELL', accent: '#456c9e', ink: '#22364e', pale: '#f5f8fb', heroText: 'text-white', overlay: 'bg-gradient-to-r from-[#172638]/90 via-[#254362]/55 to-transparent', categoryTitle: 'Find Your Mattress', serviceHeading: 'Sleep Solutions', serviceDescription: 'Comfort, support and guidance for more restful nights.', collectionHeading: 'Mattress Collections', collectionDescription: 'Explore sleep products for different needs and preferences.', galleryHeading: 'Sleep Store Gallery', galleryDescription: 'See products, store spaces and sleep essentials.', featureHeading: 'Comfort & Store Features', offerHeading: 'Sleep Offers', cardNames: ['Memory Foam', 'Orthopedic', 'Spring Mattress', 'Latex Mattress', 'Pillows', 'Custom Sizes'], categories: ['Memory Foam', 'Orthopedic', 'Spring Mattress', 'Latex Mattress', 'Kids Mattress', 'Pillows', 'Mattress Protectors', 'Custom Sizes'], features: ['Orthopedic Support', 'Premium Materials', 'Breathable Fabric', 'Long-lasting Comfort', 'Custom Sizes', 'Home Delivery'], nav: ['Home', 'About', 'Collections', 'Sleep Solutions', 'Offers', 'Gallery', 'Contact'], icon: '☾', action: 'Find Your Comfort', aboutTitle: 'About the Sleep Store',
  },
  nursery: {
    title: 'Bring Nature\nInto Your Space', subtitle: 'Beautiful plants and helpful growing advice for homes, offices and gardens.', eyebrow: 'GROW SOMETHING GOOD', accent: '#38804b', ink: '#233b2a', pale: '#f3f8f1', heroText: 'text-white', overlay: 'bg-gradient-to-r from-[#112719]/90 via-[#1b4126]/55 to-transparent', categoryTitle: 'Explore Plant Collections', serviceHeading: 'Plant & Garden Services', serviceDescription: 'Helpful growing services for your home, office and garden.', collectionHeading: 'Plant Collections', collectionDescription: 'Find plants and supplies for every kind of green space.', galleryHeading: 'Nursery Gallery', galleryDescription: 'A look around the nursery and its growing collections.', featureHeading: 'Nursery Services', offerHeading: 'Seasonal Offers', cardNames: ['Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Fruit Plants', 'Medicinal Plants', 'Pots & Planters'], categories: ['Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Fruit Plants', 'Medicinal Plants', 'Garden Plants', 'Pots & Planters', 'Gardening Supplies'], features: ['Plant Consultation', 'Garden Setup', 'Landscaping', 'Plant Delivery', 'Maintenance', 'Potting Services'], nav: ['Home', 'About', 'Plants', 'Services', 'Gallery', 'Tips', 'Contact'], icon: '❧', action: 'Explore Plants', aboutTitle: 'About the Nursery',
  },
};

const SERVICE_COPY = {
  'Ethnic Wear': 'Sarees, lehengas and salwar suits for every celebration.',
  'Western Wear': 'Tops, dresses, denim and everyday favourites.',
  'Party Wear': 'Gowns, Indo-western looks and designer outfits.',
  'Kids Collection': 'Comfortable, playful styles for little ones.',
  'Custom Stitching': 'Personalized tailoring and a fit made for you.',
  Accessories: 'Jewellery, bags, dupattas and finishing touches.',
  Shopping: 'Discover fashion, lifestyle and everyday essentials.',
  'Food Court': 'Take a break with dining options for every taste.',
  Cinema: 'Enjoy the latest releases and special screenings.',
  Entertainment: 'Experiences and activities for friends and family.',
  Parking: 'Convenient access for a relaxed visit.',
  'Kids Zone': 'Family-friendly activities for younger visitors.',
  Refrigerators: 'Explore efficient cooling for every home.',
  'Washing Machines': 'Laundry solutions with useful modern features.',
  'Air Conditioners': 'Comfortable climate control for your space.',
  TVs: 'Bring films, sport and entertainment into focus.',
  'Kitchen Appliances': 'Practical tools for everyday cooking.',
  'Water Purifiers': 'Water care options for your household.',
  Sofas: 'Comfortable seating in styles for every living room.',
  Beds: 'Create a restful bedroom with considered design.',
  'Dining Sets': 'Gather around pieces made for shared meals.',
  Wardrobes: 'Storage designed to keep your space organized.',
  'Office Furniture': 'Functional furniture for focused work.',
  'Custom Furniture': 'Made-to-order pieces shaped around your needs.',
  'Memory Foam': 'Responsive comfort that adapts to your sleep.',
  Orthopedic: 'Supportive options for restful nights.',
  'Spring Mattress': 'Balanced comfort with responsive spring support.',
  'Latex Mattress': 'Durable comfort with naturally resilient feel.',
  'Pillows': 'Finishing support for a more comfortable sleep.',
  'Custom Sizes': 'Find sizing to suit your bed and room.',
  'Indoor Plants': 'Green companions for homes and workspaces.',
  'Outdoor Plants': 'Plants selected for gardens and open spaces.',
  'Flowering Plants': 'Seasonal colour for your garden and home.',
  'Fruit Plants': 'Grow fresh favourites in your own space.',
  'Medicinal Plants': 'Useful plants and growing guidance.',
  'Pots & Planters': 'Planters to complement your plants and decor.',
};

const RETAIL_FILTERS = {
  boutique: ['All', 'Ethnic Wear', 'Western Wear', 'Party Wear', 'Kids', 'Custom Designs', 'Accessories'],
  mall: ['All', 'Fashion', 'Electronics', 'Dining', 'Lifestyle', 'Entertainment'],
  appliances: ['All', 'Refrigerators', 'Washing Machines', 'Air Conditioners', 'TVs', 'Kitchen Appliances'],
  furniture: ['All', 'Sofas', 'Beds', 'Dining Sets', 'Wardrobes', 'Office Furniture'],
  mattress: ['All', 'Memory Foam', 'Orthopedic', 'Spring Mattress', 'Latex Mattress', 'Kids Mattress'],
  nursery: ['All', 'Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Fruit Plants', 'Medicinal Plants'],
};
const FILTER_ALIASES = {
  'Ethnic Wear': ['ethnic', 'saree', 'lehenga', 'salwar'],
  'Western Wear': ['western', 'dress', 'top', 'denim'],
  'Party Wear': ['party', 'gown', 'evening'],
  Kids: ['kids', 'children'],
  'Custom Designs': ['custom', 'stitching', 'tailor'],
  Accessories: ['accessor', 'jewellery', 'jewelry', 'bag'],
  Fashion: ['fashion', 'clothing', 'boutique'],
  Electronics: ['electronic', 'appliance', 'gadget'],
  Dining: ['dining', 'food', 'restaurant'],
  Lifestyle: ['lifestyle', 'home', 'living'],
  Entertainment: ['entertainment', 'cinema', 'kids zone'],
  Refrigerators: ['refrigerator', 'fridge'],
  'Washing Machines': ['washing machine', 'washer'],
  'Air Conditioners': ['air conditioner', 'ac'],
  TVs: ['tv', 'television'],
  'Kitchen Appliances': ['kitchen', 'microwave'],
  Sofas: ['sofa', 'couch'],
  Beds: ['bed', 'bedroom'],
  'Dining Sets': ['dining', 'table'],
  Wardrobes: ['wardrobe', 'storage'],
  'Office Furniture': ['office', 'desk', 'chair'],
  'Memory Foam': ['memory foam'],
  Orthopedic: ['orthopedic', 'support'],
  'Spring Mattress': ['spring'],
  'Latex Mattress': ['latex'],
  'Kids Mattress': ['kids', 'children'],
  'Indoor Plants': ['indoor', 'houseplant'],
  'Outdoor Plants': ['outdoor', 'garden'],
  'Flowering Plants': ['flower', 'blossom'],
  'Fruit Plants': ['fruit', 'citrus'],
  'Medicinal Plants': ['medicinal', 'herbal'],
};

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  return value ? [value] : [];
};
const firstList = (...values) => values.map(toList).find((items) => items.length) || [];
const normalize = (value) => String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
const mediaUrl = (item) => typeof item === 'string' ? item : item?.image || item?.url || item?.src || '';
const mediaTag = (item) => typeof item === 'object' ? normalize(item.category || item.type || item.name || item.title) : '';
const urlFor = (value) => value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : '';
const addressFor = (place) => [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name].filter(Boolean).join(', ');

function RetailVideoModal({ video, onClose }) {
  const url = video?.url || video?.src || '';
  let source = url;
  let embed = false;
  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1).split('/')[0] : parsed.searchParams.get('v') || parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];
    if (id) { source = `https://www.youtube.com/embed/${id}?autoplay=1`; embed = true; }
    else if (parsed.hostname.includes('vimeo.com')) { const videoId = parsed.pathname.match(/\/(?:video\/)?(\d+)/)?.[1]; if (videoId) { source = `https://player.vimeo.com/video/${videoId}?autoplay=1`; embed = true; } }
    else if (parsed.hostname.includes('drive.google.com')) { const fileId = parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1]; if (fileId) { source = `https://drive.google.com/file/d/${fileId}/preview`; embed = true; } }
  } catch { /* Direct media URL. */ }
  if (!source) return null;
  return <div role="presentation" className="fixed inset-0 z-[70] grid place-items-center bg-black/90 p-4" onClick={onClose}><section role="dialog" aria-modal="true" aria-label={video.title || 'Retail video'} className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}><button type="button" aria-label="Close video" onClick={onClose} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-xl text-white">×</button><div className="aspect-video">{embed ? <iframe src={source} title={video.title || 'Retail video'} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full border-0" /> : <video src={source} controls autoPlay playsInline className="h-full w-full" />}</div><p className="px-4 py-3 text-sm font-semibold text-white">{video.title || video.caption || 'Retail video'}</p></section></div>;
}

function RetailHeader({ place, profile, design, links, phone, whatsapp }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logo = profile.logo || place.logo;
  return <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 shadow-sm backdrop-blur"><div className="mx-auto flex min-h-[68px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-7"><a href="#home" className="flex min-w-0 items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-black/10 bg-white">{logo ? <ImageFrame src={logo} alt={`${place.name} logo`} /> : <span className="font-display text-lg font-bold" style={{ color: design.accent }}>{place.name?.slice(0, 1) || 'S'}</span>}</div><span className="min-w-0"><span className="block truncate font-display text-lg font-bold" style={{ color: design.ink }}>{place.name}</span><span className="block truncate text-[10px] text-black/55">{profile.tagline || design.label}</span></span></a><nav className="hidden items-center gap-6 text-xs font-semibold lg:flex">{links.map(([name, target], index) => <a key={target} href={target} className={`relative py-3 after:absolute after:bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-transform ${index === 0 ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}`} style={{ color: index === 0 ? design.accent : design.ink, '--tw-bg-opacity': '1', backgroundColor: 'transparent', '--retail-accent': design.accent }}><span>{name}</span><style>{`a[href="${target}"]::after { background-color: ${design.accent}; }`}</style></a>)}</nav><div className="hidden items-center gap-2 md:flex">{phone && <a href={`tel:${String(phone).replace(/\s+/g, '')}`} className="rounded-full border px-3 py-2 text-xs font-bold" style={{ borderColor: `${design.accent}66`, color: design.ink }}>☎ Call Now</a>}{design.key === 'boutique' ? <a href={place.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}` : '#contact'} target={place.address ? '_blank' : undefined} rel="noreferrer" className="rounded-full px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: design.accent }}>Visit Store</a> : whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="rounded-full bg-[#14a85a] px-4 py-2 text-xs font-bold text-white">WhatsApp</a>}</div><button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="rounded border border-black/15 px-3 py-2 text-lg lg:hidden">☰</button></div>{menuOpen && <nav className="border-t border-black/10 bg-white px-4 py-2 lg:hidden">{links.map(([name, target]) => <a key={target} href={target} onClick={() => setMenuOpen(false)} className="block border-b border-black/5 py-3 text-sm font-semibold last:border-0">{name}</a>)}<div className="flex gap-2 py-3">{phone && <a href={`tel:${String(phone).replace(/\s+/g, '')}`} className="flex-1 rounded px-3 py-2 text-center text-xs font-bold text-white" style={{ backgroundColor: design.accent }}>Call Now</a>}{whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="flex-1 rounded bg-[#14a85a] px-3 py-2 text-center text-xs font-bold text-white">WhatsApp</a>}</div></nav>}</header>;
}

function RetailPublicPage({ place, kind }) {
  const design = DEFAULTS[kind];
  const profile = getProfileData(place);
  const specific = place.attributes?.businessProfile?.categorySpecific || {};
  const common = place.attributes?.businessProfile?.common || {};
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [serviceDialog, setServiceDialog] = useState('');

  const gallery = useMemo(() => {
    const saved = profile.gallery?.length ? profile.gallery : place.images || [];
    const mallImages = place.attributes?.mallCollections || [];
    const source = saved.length ? saved : mallImages.map((item) => item.image || item.url).filter(Boolean);
    return source.map((item, index) => ({ src: mediaUrl(item), tag: mediaTag(item), index })).filter((item) => item.src).slice(0, 10);
  }, [place.attributes?.mallCollections, place.images, profile.gallery]);
  const subcategorySpecific = kind === 'mall'
    ? place.attributes || {}
    : specific;
  const savedServices = firstList(specific.services, specific.specialtyServices, place.services);
  const categorySource = kind === 'mall'
    ? firstList(place.attributes?.mallCollections?.map((item) => item.caption || item.name).filter(Boolean), place.attributes?.featuredBrands)
    : kind === 'boutique'
      ? firstList(specific.collections, specific.products)
      : firstList(specific.products, specific.collections, specific.productCategories, specific.gardenProducts);
  const categoryNames = categorySource.length ? categorySource : design.categories;
  const itemRecords = kind === 'mall' ? firstList(place.attributes?.mallCollections) : kind === 'boutique' ? firstList(specific.collections) : firstList(specific.productItems, specific.productsList, specific.products);
  const products = itemRecords.filter((item) => typeof item === 'object' && (item.name || item.title));
  const services = savedServices.length ? savedServices : design.cardNames;
  const videoRecords = kind === 'mall'
    ? firstList(place.attributes?.mallVideos, common.videos, place.videos, place.video)
    : firstList(common.videos, profile.videos, place.videos, place.video);
  const videos = videoRecords.map((video) => typeof video === 'string' ? { url: video } : video).filter((video) => video?.url || video?.src);
  const profileOffers = kind === 'mall' ? firstList(place.attributes?.mallOffers, place.attributes?.offers) : firstList(specific.offers, specific.offer, profile.offers, specific.features?.filter?.((item) => /%|off|offer/i.test(String(item))));
  const offers = profileOffers;
  const savedFeatures = firstList(place.facilities, specific.infrastructure, specific.features);

  const name = place.name || 'Local Retail Store';
  const phone = place.phone || profile.phone || common.phone || '';
  const whatsappValue = place.socialLinks?.whatsapp || profile.socialMedia?.whatsapp || profile.whatsapp || phone;
  const whatsapp = getWhatsAppUrl(whatsappValue);
  const email = place.email || profile.email || common.email || '';
  const website = urlFor(place.website || profile.website);
  const location = [place.address, place.location?.area?.name, place.location?.city?.name, place.location?.district?.name, place.location?.state?.name].filter(Boolean).join(', ');
  const mapUrl = location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : '';
  const hero = profile.coverImage || place.coverImage || gallery[0]?.src || '';
  const aboutImage = profile.aboutImage || specific.aboutImage || gallery[1]?.src || gallery[0]?.src || hero;
  const about = place.description || profile.about || `${name} brings together thoughtful products, friendly service and a welcoming shopping experience.`;
  const rating = Number(place.rating?.average || 0);
  const reviewCount = Number(place.rating?.count || 0);
  const years = specific.yearsExperience || specific.yearsInBusiness || profile.yearsExperience;
  const stats = [specific.uniqueDesigns && [specific.uniqueDesigns, 'Unique Designs'], specific.happyCustomers && [specific.happyCustomers, 'Happy Customers'], years && [years, 'Years of Experience'], reviewCount && [`${rating.toFixed(1)} / 5`, 'Customer Rating']].filter(Boolean);
  const links = [['Home', '#home'], ['About', '#about'], [kind === 'boutique' ? 'Services' : 'Collections', kind === 'boutique' ? '#services' : '#collections'], ['Gallery', '#gallery'], ['Contact', '#contact']];
  const visibleGallery = filter === 'All' ? gallery : gallery.filter((item) => {
    const itemCategory = normalize(item.tag);
    const aliases = FILTER_ALIASES[filter] || [normalize(filter)];
    return !itemCategory || aliases.some((alias) => itemCategory.includes(normalize(alias)));
  });
  const galleryFilters = RETAIL_FILTERS[kind];
  const accentButton = `inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105`;
  const styleMode = kind === 'boutique' ? 'boutique' : kind;
  const heroTextClass = design.heroText;
  const featuredItems = products.length ? products.slice(0, 8) : categoryNames.map((item) => typeof item === 'string' ? { name: item } : item).slice(0, 8);

  return (
    <div className={`min-h-screen ${design.pale}`} style={{ '--retail-accent': design.accent }}>
      <RetailHeader place={place} profile={profile} design={design} links={links} phone={phone} whatsapp={whatsapp} />
      <main>
        <section id="home" className={`relative isolate overflow-hidden ${kind === 'boutique' ? 'bg-[#f7ede8]' : 'bg-[#131b22]'} ${heroTextClass}`}>
          {hero && <div className="absolute inset-0">{kind === 'boutique' && <ImageFrame src={hero} alt={`${name} boutique`} eager />}<div className={`absolute inset-0 ${kind === 'boutique' ? 'bg-gradient-to-r from-[#172235]/90 via-[#172235]/55 to-transparent' : design.overlay}`} />{kind !== 'boutique' && <ImageFrame src={hero} alt={`${name} store`} eager className="absolute inset-0 -z-10" />}</div>}
          <div className="relative mx-auto grid min-h-[490px] max-w-[1500px] items-center gap-8 px-5 py-10 sm:min-h-[540px] sm:px-8 lg:grid-cols-[1fr_.95fr]">
            <div className="max-w-[650px]"><p className={`text-[10px] font-extrabold uppercase tracking-[.25em] ${kind === 'boutique' ? 'text-[#f5c4d1]' : 'text-[#f0d38f]'}`}>{design.eyebrow}</p><h1 className="mt-4 whitespace-pre-line font-display text-5xl font-bold leading-[.98] sm:text-6xl lg:text-[66px]">{design.title}</h1><p className="mt-4 max-w-lg text-sm leading-6 text-current/90 sm:text-base">{design.subtitle}</p><div className="mt-5 flex flex-wrap gap-2 text-[10px] font-semibold">{design.categories.slice(0, 6).map((item) => <span key={item} className={`rounded-full px-3 py-1.5 ${kind === 'boutique' ? 'bg-white/15' : 'bg-white/15'}`}>{item}</span>)}</div><div className="mt-6 flex flex-wrap gap-3"><a href={kind === 'boutique' ? '#collections' : '#collections'} className={accentButton} style={{ backgroundColor: design.accent }}>{design.action} →</a>{kind === 'boutique' ? <a href={mapUrl || '#contact'} target={mapUrl ? '_blank' : undefined} rel="noreferrer" className="rounded-md border border-white/80 bg-white/90 px-5 py-3 text-sm font-bold text-[#172a43]">Visit Our Store</a> : <a href="#about" className="rounded-md border border-white/65 bg-white/10 px-5 py-3 text-sm font-bold text-white">Discover More</a>}</div></div>
            <div className="relative hidden min-h-[350px] lg:block">{hero && <div className="absolute inset-3 overflow-hidden rounded-xl border-2 border-white/85 shadow-2xl"><ImageFrame src={hero} alt={`${name} featured ${kind === 'nursery' ? 'plants' : 'collection'}`} /></div>}{gallery.slice(0, 3).map((image, index) => <button key={image.src} type="button" onClick={() => setLightbox(image.src)} className={`absolute z-10 w-[43%] overflow-hidden rounded-lg border-2 border-white shadow-xl ${index === 0 ? 'right-0 top-2 rotate-2' : index === 1 ? 'bottom-7 right-1 -rotate-1' : 'bottom-0 left-0 rotate-1'}`}><ImageFrame src={image.src} alt={`${name} preview ${index + 1}`} className="h-28 w-full object-cover xl:h-32" /></button>)}{kind === 'boutique' && <aside className="absolute right-[45%] top-1/2 z-10 -translate-y-1/2 rounded-md bg-[#fffaf2]/90 px-3 py-3 font-serif text-sm italic leading-6 text-[#172a43]">Ethnic<br />Western<br />Party Wear<br />Custom Outfits</aside>}</div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-[1500px] gap-6 px-4 py-8 sm:px-7 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div className="min-h-[240px] overflow-hidden rounded-xl bg-white shadow-md sm:min-h-[320px]">{aboutImage && <ImageFrame src={aboutImage} alt={`${name} interior`} />}</div><div><p className="text-[10px] font-bold uppercase tracking-[.22em]" style={{ color: design.accent }}>About Us</p><h2 className="mt-2 font-display text-3xl font-bold" style={{ color: design.ink }}>{design.aboutTitle}</h2><p className="mt-4 text-sm leading-7 text-[#645b57]">{about}</p><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{stats.map(([value, label]) => <div key={label} className="rounded-lg border border-black/5 bg-white/80 px-3 py-3 text-center shadow-sm"><p className="font-display text-lg font-bold" style={{ color: design.accent }}>{value}</p><p className="mt-1 text-[10px] text-[#716a66]">{label}</p></div>)}</div></div></section>

        <section id="services" className="px-4 py-8 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.2em]" style={{ color: design.accent }}>{design.serviceEyebrow}</p><h2 className="mt-2 font-display text-3xl font-bold" style={{ color: design.ink }}>{design.serviceHeading}</h2><p className="mt-1 text-xs text-[#726862]">{design.serviceDescription}</p></div><a href="#collections" className="text-xs font-bold" style={{ color: design.accent }}>View All Services →</a></div><div className={`mt-5 grid gap-3 ${kind === 'mall' || kind === 'appliances' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'}`}>{services.slice(0, 8).map((item, index) => { const title = typeof item === 'string' ? item : item.name || item.title || design.cardNames[index % design.cardNames.length]; const description = typeof item === 'object' && item.description ? item.description : SERVICE_COPY[title] || `Explore ${title.toLowerCase()} at ${name}.`; const image = typeof item === 'object' ? item.image || item.photo : ''; const photo = image || gallery[index % Math.max(gallery.length, 1)]?.src; return <button key={`${title}-${index}`} type="button" onClick={() => setServiceDialog(title)} className="group overflow-hidden rounded-lg border border-black/10 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: `${design.accent}16` }}>{photo && <ImageFrame src={photo} alt={title} className="transition duration-300 group-hover:scale-105" />}<span className="absolute bottom-2 left-2 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-lg shadow" style={{ color: design.accent }}>{design.icon}</span></div><div className="p-3"><h3 className="text-xs font-bold" style={{ color: design.ink }}>{title}</h3><p className="mt-1 text-[10px] leading-4 text-[#736b65]">{description}</p></div></button>; })}</div></div></section>

        <section id="collections" className="bg-white/70 px-4 py-8 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold" style={{ color: design.ink }}>{design.collectionHeading}</h2><p className="mt-1 text-xs text-[#726862]">{design.collectionDescription}</p></div><a href="#contact" className="text-xs font-bold" style={{ color: design.accent }}>{kind === 'boutique' ? 'View All Collections' : 'Enquire About Products'} →</a></div>{featuredItems.length > 0 ? <div className={`mt-5 grid gap-3 ${kind === 'mall' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'}`}>{featuredItems.slice(0, 10).map((item, index) => { const itemName = typeof item === 'string' ? item : item.name || item.title || `Collection ${index + 1}`; const image = typeof item === 'object' && (item.image || item.photo || item.url) ? item.image || item.photo || item.url : gallery[index % Math.max(gallery.length, 1)]?.src; return <article key={`${itemName}-${index}`} className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm"><button type="button" className="block w-full text-left" onClick={() => image && setLightbox(mediaUrl(image))}><div className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: `${design.accent}12` }}>{image ? <ImageFrame src={mediaUrl(image)} alt={itemName} className="transition duration-300 hover:scale-105" /> : <div className="grid h-full place-items-center font-display text-lg" style={{ color: design.accent }}>{itemName}</div>}</div><div className="p-3"><h3 className="truncate text-xs font-bold" style={{ color: design.ink }}>{itemName}</h3>{typeof item === 'object' && item.description && <p className="mt-1 line-clamp-2 text-[10px] text-[#756d66]">{item.description}</p>}{typeof item === 'object' && item.price && <p className="mt-2 text-xs font-bold" style={{ color: design.accent }}>{item.price}</p>}</div></button></article>; })}</div> : <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{design.categories.map((category) => <div key={category} className="rounded-lg border border-black/10 bg-white p-4 text-sm font-semibold" style={{ color: design.ink }}>{category}</div>)}</div>}</div></section>

        <section id="gallery" className="mx-auto max-w-[1500px] px-4 py-8 sm:px-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold" style={{ color: design.ink }}>{design.galleryHeading}</h2><p className="mt-1 text-xs text-[#726862]">{design.galleryDescription}</p></div><div className="flex flex-wrap gap-1.5">{galleryFilters.map((category) => <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)} className={`rounded-md px-3 py-2 text-[10px] font-semibold ${filter === category ? 'text-white' : 'border border-black/10 bg-white'}`} style={filter === category ? { backgroundColor: design.accent } : { color: design.ink }}>{category}</button>)}<span className="rounded-md border border-black/10 bg-white px-3 py-2 text-[10px] font-bold" style={{ color: design.accent }}>View All Photos ({gallery.length})</span></div></div>{gallery.length ? <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">{visibleGallery.map((image) => <button key={`${image.src}-${image.index}`} type="button" onClick={() => setLightbox(image.src)} className="aspect-[4/3] overflow-hidden rounded-lg bg-white shadow-sm"><ImageFrame src={image.src} alt={`${name} photo ${image.index + 1}`} className="transition duration-300 hover:scale-105" /></button>)}</div> : <p className="mt-5 rounded-lg bg-white p-5 text-sm text-[#756d66]">Photos have not been added yet.</p>}{gallery.length > 0 && visibleGallery.length === 0 && <p className="mt-3 text-xs text-[#756d66]">No photos are tagged for {filter}.</p>}</section>

        {videos.length > 0 && <section className="bg-white/70 px-4 py-8 sm:px-7"><div className="mx-auto max-w-[1500px]"><div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-3xl font-bold" style={{ color: design.ink }}>Videos</h2><p className="mt-1 text-xs text-[#726862]">Store tours, products and experiences</p></div><a href="#videos" className="text-xs font-bold" style={{ color: design.accent }}>View All Videos →</a></div><div id="videos" className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{videos.slice(0, 8).map((video, index) => { const image = video.thumbnail || video.image || gallery[index % Math.max(gallery.length, 1)]?.src; return <button key={`${video.url || video.src}-${index}`} type="button" onClick={() => setActiveVideo(video)} className="overflow-hidden rounded-lg border border-black/10 bg-white text-left shadow-sm"><div className="relative aspect-video bg-black">{image && <ImageFrame src={mediaUrl(image)} alt={video.title || video.caption || `Video ${index + 1}`} />}<span className="absolute inset-0 grid place-items-center bg-black/15"><span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-lg" style={{ color: design.accent }}>▶</span></span>{video.duration && <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-1 text-[10px] font-bold text-white">{video.duration}</span>}</div><span className="block truncate px-3 py-2 text-xs font-bold" style={{ color: design.ink }}>{video.title || video.caption || `Store video ${index + 1}`}</span></button>; })}</div></div></section>}

        <section className="mx-auto max-w-[1500px] px-4 py-8 sm:px-7"><h2 className="font-display text-3xl font-bold" style={{ color: design.ink }}>{design.featureHeading}</h2><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{(savedFeatures.length ? savedFeatures.slice(0, 8) : design.features).map((feature, index) => { const label = typeof feature === 'string' ? feature : feature.name || feature.title || `Feature ${index + 1}`; return <article key={`${label}-${index}`} className="rounded-lg border border-black/10 bg-white p-4 text-center shadow-sm"><span className="mx-auto grid h-10 w-10 place-items-center rounded-full" style={{ color: design.accent, backgroundColor: `${design.accent}16` }}>{design.icon}</span><h3 className="mt-2 text-xs font-bold" style={{ color: design.ink }}>{label}</h3></article>; })}</div></section>

        {(offers.length > 0 || kind === 'mall' || kind === 'appliances' || kind === 'mattress') && <section id="offers" className="px-4 py-8 sm:px-7" style={{ backgroundColor: `${design.accent}0d` }}><div className="mx-auto max-w-[1500px]"><h2 className="font-display text-3xl font-bold" style={{ color: design.ink }}>{design.offerHeading}</h2>{offers.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{offers.slice(0, 6).map((offer, index) => <article key={`${typeof offer === 'string' ? offer : offer.name || offer.title}-${index}`} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm"><p className="text-sm font-bold" style={{ color: design.ink }}>{typeof offer === 'string' ? offer : offer.name || offer.title || 'Current offer'}</p>{typeof offer === 'object' && offer.description && <p className="mt-2 text-xs leading-5 text-[#716963]">{offer.description}</p>}{typeof offer === 'object' && offer.price && <p className="mt-3 font-bold" style={{ color: design.accent }}>{offer.price}</p>}<a href="#contact" className="mt-4 inline-block text-xs font-bold" style={{ color: design.accent }}>Enquire →</a></article>)}</div> : <p className="mt-3 text-sm text-[#716963]">Ask us about current offers and seasonal events.</p>}</div></section>}

        <section id="reviews" className="mx-auto max-w-[1500px] px-4 py-8 sm:px-7"><h2 className="font-display text-3xl font-bold" style={{ color: design.ink }}>Customer Reviews</h2><div className="mt-4 rounded-xl border border-black/10 bg-white p-4 sm:p-6"><ReviewsSection placeId={place._id} /></div></section>
      </main>

      <footer id="contact" className={`${styleMode === 'mall' ? 'bg-[#101d2d]' : kind === 'nursery' ? 'bg-[#183322]' : 'bg-[#171a1f]'} px-4 py-8 text-white sm:px-7`}><div className="mx-auto grid max-w-[1500px] gap-6 sm:grid-cols-2 lg:grid-cols-4"><div><h3 className="font-display text-lg font-bold">Our Location</h3><p className="mt-3 text-xs leading-5 text-white/70">{location || 'Address not provided'}</p>{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded border border-white/35 px-3 py-2 text-xs font-bold">View on Map</a>}</div><div><h3 className="font-display text-lg font-bold">Contact Details</h3><div className="mt-3 space-y-2 text-xs text-white/70">{phone && <a href={`tel:${String(phone).replace(/\s+/g, '')}`} className="block">{phone}</a>}{place.email && <a href={`mailto:${place.email}`} className="block">{place.email}</a>}{website && <a href={website} target="_blank" rel="noreferrer" className="block">Visit website</a>}{place.workingHours?.filter((hour) => hour.open || hour.close || hour.closed).map((hour) => <p key={hour.day} className="capitalize">{hour.day}: {hour.closed ? 'Closed' : `${hour.open || ''}${hour.open && hour.close ? ' - ' : ''}${hour.close || ''}`}</p>)}</div></div><div><h3 className="font-display text-lg font-bold">Follow Us</h3><div className="mt-3 flex flex-wrap gap-2">{Object.entries(profile.socialMedia || {}).filter(([key, value]) => value && (key !== 'whatsapp' || whatsapp)).map(([key, value]) => <a key={key} href={key === 'whatsapp' ? whatsapp : urlFor(value)} target="_blank" rel="noreferrer" aria-label={key} className="grid h-9 min-w-9 place-items-center rounded bg-white/10 px-2 text-xs font-bold capitalize">{key.slice(0, 1)}</a>)}</div></div><div><h3 className="font-display text-lg font-bold">G-Pages</h3><p className="mt-3 text-xs text-white/70">Powered by G-Pages</p><p className="text-xs text-white/60">Create your business website</p><div className="mt-3 flex gap-2"><a href="/contact" className="rounded px-3 py-2 text-xs font-bold text-white" style={{ backgroundColor: design.accent }}>Contact Us</a><a href="/" className="rounded bg-white px-3 py-2 text-xs font-bold text-black">Back to Home</a></div></div></div></footer>

      <div className="fixed bottom-3 left-1/2 z-40 w-[92%] max-w-sm -translate-x-1/2 rounded-full border border-black/10 bg-white/95 p-2 shadow-lg backdrop-blur md:hidden"><div className="flex gap-2">{phone && <a href={`tel:${String(phone).replace(/\s+/g, '')}`} className="flex-1 rounded-full px-3 py-2.5 text-center text-xs font-bold text-white" style={{ backgroundColor: design.accent }}>Call</a>}{whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#14a85a] px-3 py-2.5 text-center text-xs font-bold text-white">WhatsApp</a>}</div></div>
      {lightbox && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={() => setLightbox('')}><button type="button" aria-label="Close image" onClick={() => setLightbox('')} className="absolute right-4 top-4 rounded bg-white px-4 py-2 text-sm font-bold text-black">Close</button><img src={lightbox} alt={`${name} gallery enlarged`} className="max-h-[90vh] max-w-[94vw] rounded-lg object-contain" onClick={(event) => event.stopPropagation()} /></div>}
      {activeVideo && <RetailVideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
      {serviceDialog && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4" onClick={() => setServiceDialog('')}><section role="dialog" aria-modal="true" aria-label={serviceDialog} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-3"><h2 className="font-display text-2xl font-bold" style={{ color: design.ink }}>{serviceDialog}</h2><button type="button" aria-label="Close details" onClick={() => setServiceDialog('')} className="text-xl">×</button></div><p className="mt-3 text-sm leading-6 text-[#716963]">{SERVICE_COPY[serviceDialog] || `Learn more about ${serviceDialog} at ${name}.`}</p><a href={phone ? `tel:${String(phone).replace(/\s+/g, '')}` : '#contact'} className="mt-5 inline-flex rounded-md px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: design.accent }}>Enquire</a></section></div>}
    </div>
  );
}

export function BoutiquePublicPage({ place }) { return <RetailPublicPage place={place} kind="boutique" />; }
export function ShoppingMallPublicPage({ place }) { return <RetailPublicPage place={place} kind="mall" />; }
export function HomeAppliancesPublicPage({ place }) { return <RetailPublicPage place={place} kind="appliances" />; }
export function FurnitureShopPublicPage({ place }) { return <RetailPublicPage place={place} kind="furniture" />; }
export function MattressShopPublicPage({ place }) { return <RetailPublicPage place={place} kind="mattress" />; }
export { NurseryPublicPage };

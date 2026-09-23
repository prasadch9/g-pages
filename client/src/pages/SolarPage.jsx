import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReviewsSection from '../components/ReviewsSection';

const services = [
  ['Residential Solar', 'For your home', '⌂'],
  ['Commercial Solar', 'For your business', '▥'],
  ['Industrial Solar', 'For large scale needs', '▤'],
  ['Solar Pump Systems', 'For agriculture & irrigation', '✣'],
  ['Solar Water Heating', 'Hot water, naturally', '◉'],
  ['AMC & Maintenance', 'Long-term support', '⚒'],
];

const projects = [
  ['https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85', 'Residential Project', '5 kW · Home installation'],
  ['https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=900&q=85', 'Commercial Project', '50 kW · Office building'],
  ['https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=900&q=85', 'Industrial Project', '1 MW · Factory'],
  ['https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=85', 'Solar Pump Project', 'Agriculture'],
];

const videos = [
  ['https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85', 'Residential Installation', '03:45'],
  ['https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=900&q=85', 'Commercial Installation', '04:20'],
  ['https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=900&q=85', 'Solar Pump System', '02:58'],
  ['https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=85', 'Maintenance Process', '03:12'],
];

const youtubeEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch { return null; }
};

function Button({ children, secondary = false, href = '#contact' }) {
  return <a href={href} className={`solar-button ${secondary ? 'solar-button-secondary' : ''}`}>{children} <span>→</span></a>;
}

function ChatPanel({ place, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !place?._id) return undefined;
    let active = true;
    const load = () => api.get(`/chat/${place._id}`).then(({ data }) => { if (active) setMessages(data.data); }).catch((err) => { if (active) setError(err.message); });
    load();
    const timer = window.setInterval(load, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [place?._id, user]);

  const send = async (event) => {
    event.preventDefault();
    if (!body.trim()) return;
    try {
      const { data } = await api.post(`/chat/${place._id}`, { body });
      setMessages((current) => [...current, data.data]);
      setBody('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return <div className="solar-chat-panel"><button type="button" className="solar-chat-close" onClick={onClose}>×</button><h3>Login to chat</h3><p>Please log in to message this business directly.</p><Link to="/login" className="solar-button">Log in <span>→</span></Link></div>;
  }

  return <div className="solar-chat-panel"><button type="button" className="solar-chat-close" onClick={onClose}>×</button><h3>Chat with {place.name}</h3><div className="solar-chat-messages">{messages.length ? messages.map((message) => <p key={message._id} className={message.sender?._id === user._id ? 'solar-chat-mine' : ''}>{message.body}<small>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></p>) : <span>Start a conversation with this business.</span>}</div>{error && <small className="solar-chat-error">{error}</small>}<form onSubmit={send} className="solar-chat-form"><input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Type your message…" maxLength={2000} /><button type="submit">Send</button></form></div>;
}

export default function SolarPage({ place }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const businessName = place?.name || '';
  const businessDescription = place?.description || '';
  const phone = place?.phone || '';
  const email = place?.email || '';
  const address = place?.address || '';
  const solarDetails = place?.attributes?.solar || {};
  const uploadedImages = [...new Set((place?.images || []).filter(Boolean))];
  const uploadedProjects = uploadedImages.map((image, index) => [image, `Photo ${index + 1}`, '']);
  const uploadedVideos = [...new Set([...(Array.isArray(place?.video) ? place.video : place?.video ? [place.video] : []), ...(solarDetails.videos || []).map((item) => item?.url).filter(Boolean)])];
  const testimonials = (solarDetails.reviews || []).filter((item) => item?.name || item?.review).map((item) => [item.name || 'Customer', '', item.review || '']);
  const heroStyle = place?.coverImage ? { backgroundImage: `linear-gradient(90deg, rgba(0, 31, 66, .78), rgba(0, 31, 66, .08)), url("${place.coverImage}")` } : undefined;
  const displayServices = solarDetails.services?.length
    ? solarDetails.services.map((item, index) => [item.name || item, item.description || 'Solar solution for your needs', services[index % services.length][2]])
    : [];
  const displayFeatures = solarDetails.features?.filter(Boolean).map((feature, index) => [['☼', '✦', '₹', '◎', '🍃'][index % 5], feature, '']) || [];
  const userSelectedFeatures = displayFeatures;
  const phoneDigits = phone.replace(/\D/g, '');
  const whatsapp = place?.socialLinks?.whatsapp;
  const whatsappUrl = whatsapp
    ? (whatsapp.startsWith('http') ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g, '')}`)
    : `https://wa.me/${phoneDigits}`;
  const sectionIds = { Home: 'home', 'About Us': 'about', Services: 'services', Gallery: 'gallery', Videos: 'videos', Comments: 'comments', Location: 'location', Contact: 'contact' };
  const mapsUrl = place?.coordinates?.lat ? `https://www.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}` : `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
  const submitSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="solar-page">
      <header className="solar-header">
        <Link to="/categories" className="solar-brand" aria-label="Back to categories">
          {place?.logo ? <img className="solar-brand-logo" src={place.logo} alt={`${businessName} logo`} /> : null}
          <span><b>{businessName}</b>{solarDetails.tagline && <small>{solarDetails.tagline}</small>}</span>
        </Link>
        <nav className="solar-nav">
          {Object.keys(sectionIds).map((item, index) => (
            <a key={item} href={`#${sectionIds[item]}`} className={index === 0 ? 'active' : ''}>{item}</a>
          ))}
        </nav>
        <div className="solar-header-actions">{phone && <a className="solar-icon-action" href={`tel:${phone}`} aria-label="Call business">Call</a>}{whatsapp && <a className="solar-icon-action" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp business">WhatsApp</a>}<form className="solar-search-form" onSubmit={submitSearch}><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} aria-label="Search businesses" placeholder="Search" /><button type="submit">Search</button></form><Button href="#contact">Get a Free Quote</Button><span className="solar-menu">Menu</span></div>
      </header>

      <main>
        <section id="home" className="solar-hero" style={heroStyle}>
          <div className="solar-hero-copy">
            <p className="solar-eyebrow">Harness the power of the sun</p>
            <h1>Solar Energy Solutions<br /><span>for a Brighter Tomorrow</span></h1>
            <p>{businessDescription}</p>
            <div className="solar-actions"><Button>Get a Free Quote</Button><Button secondary>Explore Our Services</Button></div>
          </div>
          <aside className="solar-contact-card"><b>Quick Contact</b>{phone && <a href={`tel:${phone}`}>{phone}<br /><em>Call Us</em></a>}{whatsapp && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp<br /><em>Message Us</em></a>}{email && <a href={`mailto:${email}`}>{email}<br /><em>Email Us</em></a>}</aside>
          <div className="solar-actions"><Button href="#contact">Get a Free Quote</Button><Button href="#services" secondary>Explore Our Services</Button></div>
        </section>

        {userSelectedFeatures.length > 0 && <div className="solar-promise">{userSelectedFeatures.map(([icon, title]) => <span key={title}>{icon} <b>{title}</b></span>)}</div>}

        <section id="about" className="solar-section solar-about">
          <div className="solar-copy"><p className="solar-eyebrow">About us</p><h2>Powering a Greener Tomorrow</h2><p>{businessDescription}</p><Button href="#contact">Learn More</Button></div>
          {uploadedImages[0] && <div className="solar-about-image"><img src={uploadedImages[0]} alt={`${businessName} business`} /></div>}
          <div id="services" className="solar-services"><p className="solar-eyebrow">Our services</p><h2>Complete Solar Solutions</h2><div className="solar-service-grid">{displayServices.map(([title, description, icon]) => <a href="#contact" key={title}><i>{icon}</i><span><b>{title}</b><small>{description}</small></span><strong>›</strong></a>)}</div><a className="solar-view-all" href="#contact">View All Services →</a></div>
        </section>

          {userSelectedFeatures.length > 0 && <section className="solar-feature-band"><div className="solar-section"><div className="solar-copy"><p className="solar-eyebrow">Why choose us</p><h2>Our Key Features</h2></div><div className="solar-feature-grid">{userSelectedFeatures.map(([icon, title]) => <article key={title}><i>{icon}</i><b>{title}</b></article>)}</div></div></section>}

          {uploadedProjects.length > 0 && <section id="gallery" className="solar-section solar-gallery"><div className="solar-copy"><p className="solar-eyebrow">Our gallery</p><h2>Photos from {businessName}</h2><Button href="#gallery-grid">View Gallery</Button></div><div id="gallery-grid" className="solar-project-grid">{uploadedProjects.map(([image, title], index) => <article key={image}><button type="button" className="solar-gallery-image-button" onClick={() => { setSelectedImageIndex(index); setImageZoom(1); }} aria-label={`Open ${title}`}><img src={image} alt={`${businessName} ${title}`} /></button><b>{title}</b></article>)}</div></section>}

        {uploadedVideos.length > 0 && <section id="videos" className="solar-video-band"><div className="solar-section"><div className="solar-copy"><p className="solar-eyebrow">Our videos</p><h2>Videos from {businessName}</h2></div><div className="solar-video-grid">{uploadedVideos.map((video, index) => { const embedUrl = youtubeEmbedUrl(video); return <article key={video}>{embedUrl ? <iframe src={embedUrl} title={`${businessName} video ${index + 1}`} allowFullScreen /> : <video controls preload="metadata"><source src={video} /></video>}<b>Video {index + 1}</b></article>; })}</div></div></section>}

        {testimonials.length > 0 && <section id="testimonials" className="solar-section solar-bottom"><div className="solar-copy"><p className="solar-eyebrow">Testimonials</p><h2>What Our Customers Say</h2></div><div className="solar-testimonials">{testimonials.map(([name, role, quote]) => <article key={`${name}-${quote}`}><p>{quote}</p><b>{name}</b><small>{role}</small></article>)}</div></section>}
        <section id="comments" className="solar-section solar-comments-section"><div><p className="solar-eyebrow">Customer comments</p><ReviewsSection placeId={place._id} /></div><div id="location" className="solar-location"><p className="solar-eyebrow">Location</p><h2>Find us here</h2>{address && <p>{address}</p>}<a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="solar-directions">Get directions</a>{address && <iframe title={`Map showing ${businessName}`} src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}</div></section>
        <section id="contact" className="solar-section solar-bottom"><div className="solar-copy"><p className="solar-eyebrow">Contact us</p><h2>Get In Touch</h2></div><div className="solar-touch">{phone && <a href={`tel:${phone}`}>{phone}</a>}{whatsapp && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>}{email && <a href={`mailto:${email}`}>{email}</a>}{address && <span>{address}</span>}</div></section>
      </main>

      <footer className="solar-footer"><div className="solar-brand">{place?.logo && <img className="solar-brand-logo" src={place.logo} alt={`${businessName} logo`} />}<span><b>{businessName}</b>{solarDetails.tagline && <small>{solarDetails.tagline}</small>}</span></div><div className="solar-footer-links">Home　 About Us　 Services　 Gallery　 Videos　 Contact</div><small>© {new Date().getFullYear()} {businessName}. All rights reserved.</small></footer>
      {selectedImageIndex !== null && <div className="solar-image-lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={() => setSelectedImageIndex(null)}><button type="button" className="solar-lightbox-close" onClick={() => setSelectedImageIndex(null)} aria-label="Close image viewer">Close</button><div className="solar-lightbox-zoom" onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => setImageZoom((zoom) => Math.max(1, +(zoom - 0.25).toFixed(2)))} disabled={imageZoom <= 1}>-</button><span>{Math.round(imageZoom * 100)}%</span><button type="button" onClick={() => setImageZoom((zoom) => Math.min(3, +(zoom + 0.25).toFixed(2)))}>+</button></div>{uploadedImages.length > 1 && <button type="button" className="solar-lightbox-prev" onClick={(event) => { event.stopPropagation(); setSelectedImageIndex((current) => (current - 1 + uploadedImages.length) % uploadedImages.length); setImageZoom(1); }}>Previous</button>}<img src={uploadedImages[selectedImageIndex]} alt={`${businessName} gallery image ${selectedImageIndex + 1}`} style={{ transform: `scale(${imageZoom})` }} onClick={(event) => event.stopPropagation()} />{uploadedImages.length > 1 && <button type="button" className="solar-lightbox-next" onClick={(event) => { event.stopPropagation(); setSelectedImageIndex((current) => (current + 1) % uploadedImages.length); setImageZoom(1); }}>Next</button>}</div>}
    </div>
  );
}

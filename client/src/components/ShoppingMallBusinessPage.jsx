import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FavoriteButton from './FavoriteButton';
import TodayOffer from './TodayOffer';

const FALLBACK = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85';
const icons = {
  hanger: '♧', pencil: '✎', shield: '♢', truck: '▣', star: '☆', crown: '♔', heart: '♡', tag: '◇', gift: '♧', diamond: '♢', pin: '⌖', phone: '◔', whatsapp: '◉', instagram: '◎', facebook: 'f', youtube: '▶', left: '‹', right: '›', close: '×', arrow: '→', check: '✓'
};
const split = (value) => String(value || '').split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
const href = (value) => value && (value.startsWith('http') ? value : `https://${value}`);
const whatsappHref = (value) => value && (value.startsWith('http') ? value : `https://wa.me/${value.replace(/\D/g, '')}`);
const titleCase = (value) => String(value || '').replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const COLLECTION_TAG_COLORS = {
  New: 'bg-[#ef3f6a]',
  Trending: 'bg-[#f3a308]',
  Bestseller: 'bg-[#149a68]',
  Sale: 'bg-[#dc2626]',
  'Limited Edition': 'bg-[#7c3aed]',
  'Back in Stock': 'bg-[#0891b2]',
  'Popular Pick': 'bg-[#2563eb]',
};
const videoSource = (value) => {
  try {
    const url = new URL(value);
    if (url.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : value;
    }
    return value;
  } catch { return value; }
};
const isDirectVideo = (value) => /\.(mp4|webm|ogg)(?:$|\?)/i.test(value);

function FeatureIcon({ type }) {
  const paths = {
    hanger: <><path d="M12 4a2.5 2.5 0 1 1-2 4l-7 5.5h18L13 8"/><path d="M3 13.5c-1.3 1-2 2.1-2 3.5h22c0-1.4-.7-2.5-2-3.5"/></>,
    pencil: <><path d="m4 20 4-1 11-11-3-3L5 16l-1 4Z"/><path d="m14.5 6.5 3 3"/></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></>,
    truck: <><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    star: <path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.3-4.2 6-.9L12 3Z"/>,
    crown: <path d="m3 8 4 4 5-7 5 7 4-4-2 11H5L3 8ZM5 22h14"/>,
    heart: <path d="M20.8 4.8a5.6 5.6 0 0 0-7.9 0L12 5.7l-.9-.9a5.6 5.6 0 0 0-7.9 7.9L12 21l8.8-8.3a5.6 5.6 0 0 0 0-7.9Z"/>,
    tag: <><path d="M3 12 12 3h7l2 2v7l-9 9L3 12Z"/><circle cx="16.5" cy="7.5" r="1"/></>,
    gift: <><path d="M20 12v9H4v-9M2 7h20v5H2zM12 7v14"/><path d="M12 7H7.5a2.5 2.5 0 1 1 2.5-2.5V7Zm0 0h4.5A2.5 2.5 0 1 0 14 4.5V7Z"/></>,
    diamond: <path d="m6 3-4 6 10 12L22 9l-4-6H6Zm-4 6h20M6 3l6 18 6-18"/>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-7 w-7" aria-hidden="true">{paths[type]}</svg>;
}

function FooterIcon({ type }) {
  const paths = {
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1Z"/>,
    whatsapp: <><path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.3-4.9a8.4 8.4 0 1 1 16.2-3.8Z"/><path d="M8.2 8.2c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4 0 .6.5.9 1.3 1.6 2.2 2.1.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .3-.2 1.2-.8 1.6-.5.4-1.1.6-1.8.4-1-.2-2.2-.8-3.5-1.9-1.1-1-1.9-2.2-2.2-3.2-.3-1 .1-2.2.5-2.8Z"/></>,
    email: <><path d="M4 7.5h16v9H4z"/><path d="m5 8 7 5 7-5"/><path d="M5 16.5 9.5 13"/><path d="M19 16.5 14.5 13"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/></>,
    facebook: <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9a1 1 0 0 1 1-1Z"/>,
    youtube: <><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 5 3-5 3V9Z"/></>,
    website: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true">{paths[type]}</svg>;
}

function MallReviews({ placeId, onReviewPosted }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const load = () => api.get(`/reviews/${placeId}`).then(({ data }) => setReviews(data.data || [])).catch(() => setReviews([]));
  useEffect(() => { load(); }, [placeId]);
  const submit = async (event) => {
    event.preventDefault();
    if (!user) { navigate('/login', { state: { from: location.pathname } }); return; }
    if (!rating) { setStatus('Please choose a star rating.'); return; }
    setStatus(editingReview ? 'Saving...' : 'Posting...');
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, { rating, comment });
        onReviewPosted?.({ type: 'edit', oldRating: editingReview.rating, newRating: rating });
        setEditingReview(null);
        setStatus('Your review was updated.');
      } else {
        await api.post('/reviews', { place: placeId, rating, comment });
        onReviewPosted?.({ type: 'create', rating });
        setStatus('Thanks for your review!');
      }
      setRating(0); setComment(''); load();
    }
    catch (error) { setStatus(error.message || 'Could not post the review.'); }
  };
  const startEditing = (review) => {
    setEditingReview(review); setRating(review.rating); setComment(review.comment); setStatus(''); setShowAllReviews(false);
    window.setTimeout(() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
  };
  const deleteReview = async (review) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    try {
      await api.delete(`/reviews/${review._id}`);
      setReviews((current) => current.filter((item) => item._id !== review._id));
      if (editingReview?._id === review._id) { setEditingReview(null); setRating(0); setComment(''); }
      onReviewPosted?.({ type: 'delete', oldRating: review.rating });
    } catch (error) { setStatus(error.message || 'Could not delete the review.'); }
  };
  return <section id="reviews" className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
    <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b1164c]">Your experience matters</p><h2 className="mt-1 font-serif text-3xl font-bold text-[#142033]">What Our Customers Say</h2><p className="mt-1 text-sm text-slate-500">Real people. Real style. Real stories.</p></div><button type="button" onClick={() => setShowAllReviews(true)} className="shrink-0 text-xs font-bold text-[#b1164c]">View all reviews {icons.arrow}</button></div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
      <form id="review-form" onSubmit={submit} className="rounded-2xl bg-[#fff5f5] p-5 shadow-sm ring-1 ring-[#f0d7d7]"><h3 className="font-serif text-2xl font-bold text-[#142033]">{editingReview ? 'Edit your review' : 'Share a review'}</h3><p className="mt-1 text-sm text-slate-500">Tell shoppers about your visit.</p><div className="mt-4 flex gap-1">{[1,2,3,4,5].map((star) => <button key={star} type="button" onClick={() => setRating(star)} aria-label={`${star} stars`} className={`text-2xl ${star <= rating ? 'text-[#f5a623]' : 'text-slate-300'}`}>★</button>)}</div><textarea required value={comment} onChange={(event) => setComment(event.target.value)} rows="4" placeholder="Share your experience..." className="mt-4 w-full rounded-xl border border-[#ecd7d7] bg-white px-3 py-3 text-sm outline-none focus:border-[#b1164c]"/><button disabled={status === 'Posting...' || status === 'Saving...'} className="mt-3 rounded-full bg-[#b1164c] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#8f0d3c] disabled:opacity-60">{status === 'Posting...' ? 'Posting...' : status === 'Saving...' ? 'Saving...' : editingReview ? 'Save changes' : 'Post review'}</button>{editingReview && <button type="button" onClick={() => { setEditingReview(null); setRating(0); setComment(''); setStatus(''); }} className="ml-2 mt-3 rounded-full border border-[#b1164c]/30 px-4 py-2.5 text-sm font-bold text-[#b1164c]">Cancel</button>}{status && status !== 'Posting...' && status !== 'Saving...' && <p className="mt-3 text-xs text-slate-600">{status}</p>}</form>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{reviews.slice(0, 3).map((review) => <article key={review._id} className="rounded-2xl border border-[#f0e4e4] bg-white p-5 shadow-sm"><div className="text-[#f5a623]">{'★'.repeat(review.rating)}<span className="text-slate-200">{'★'.repeat(5 - review.rating)}</span></div><p className="mt-3 text-sm leading-6 text-slate-600">“{review.comment}”</p><p className="mt-4 text-sm font-bold text-[#142033]">{review.user?.name || 'Guest shopper'}</p></article>)}{reviews.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-[#e5cbcb] p-6 text-sm text-slate-500">No reviews yet — be the first to share your visit.</div>}</div>
    </div>
    {showAllReviews && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#101d2d]/90 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="All customer reviews" onClick={() => setShowAllReviews(false)}><div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-[#fffaf8] shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between gap-4 border-b border-[#f0e4e4] px-5 py-4 sm:px-7"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#b1164c]">Shopper gallery</p><h3 className="mt-1 font-serif text-2xl font-bold text-[#142033]">All reviews <span className="text-base font-medium text-slate-500">({reviews.length})</span></h3></div><button type="button" onClick={() => setShowAllReviews(false)} className="rounded-full border border-[#b1164c]/30 px-4 py-2 text-sm font-bold text-[#b1164c] transition hover:bg-[#b1164c] hover:text-white" aria-label="Close all reviews">Close ×</button></div><div className="overflow-y-auto p-5 sm:p-7">{reviews.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{reviews.map((review) => <article key={review._id} className="flex min-h-48 flex-col rounded-2xl border border-[#f0e4e4] bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-xl tracking-wider text-[#f5a623]">{'★'.repeat(review.rating)}<span className="text-slate-200">{'★'.repeat(5 - review.rating)}</span></span><span className="rounded-full bg-[#fff0f1] px-2.5 py-1 text-[10px] font-bold text-[#9d1748]">{review.createdAt ? new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date unavailable'}</span></div><p className="mt-4 flex-1 text-sm leading-6 text-slate-600">“{review.comment}”</p><div className="mt-5 border-t border-[#f0e4e4] pt-3"><p className="text-sm font-bold text-[#142033]">{review.user?.name || 'Guest shopper'}</p><p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">Posted a review</p></div>{user?._id === review.user?._id && <div className="mt-4 flex gap-4 text-xs font-bold"><button type="button" onClick={() => startEditing(review)} className="text-[#9d1748] hover:underline">Edit review</button><button type="button" onClick={() => deleteReview(review)} className="text-red-600 hover:underline">Delete review</button></div>}</article>)}</div> : <p className="rounded-xl border border-dashed border-[#e5cbcb] p-8 text-center text-sm text-slate-500">No reviews to show yet.</p>}</div></div></div>}  </section>;
}

export default function ShoppingMallBusinessPage({ place: sourcePlace, mapsUrl: sourceMapsUrl, socialLinks: sourceSocialLinks = {}, onShare, onReport, onReviewPosted }) {
  const place = sourcePlace;
  const socialLinks = sourceSocialLinks;
  const mapsUrl = sourceMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;
  const gallery = place.images?.length ? place.images : (place.coverImage ? [place.coverImage] : [FALLBACK]);
  const existingVideos = place.attributes?.mallVideos?.length ? place.attributes.mallVideos : (Array.isArray(place.video) ? place.video : place.video ? [place.video] : (place.videos || [])).map((url) => typeof url === 'string' ? { url, caption: '' } : url);
  const tourVideos = existingVideos.filter((video) => typeof video.url === 'string' && video.url.trim());
  const [slide, setSlide] = useState(0); const [lightbox, setLightbox] = useState(null); const [menuOpen, setMenuOpen] = useState(false);
  const advance = (direction) => setSlide((current) => (current + direction + gallery.length) % gallery.length);
  const visible = Array.from({ length: Math.min(5, gallery.length) }, (_, index) => gallery[(slide + index) % gallery.length]);
  const collectionItems = place.attributes?.mallCollections?.length ? place.attributes.mallCollections : gallery.map((image) => ({ image, tag: 'New', caption: '', features: [] }));
  const shop = () => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  const aboutImage = place.aboutImage || gallery[1] || place.coverImage || FALLBACK;
  const hours = place.workingHours?.filter((entry) => entry.open || entry.close || entry.closed) || [];
  const dayLabel = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
  return <div className="min-h-screen overflow-x-hidden bg-[#fffaf8] text-[#142033]">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#101d2d]/95 text-white shadow-lg backdrop-blur"><div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8"><Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Back to G-Pages home">{place.logo && <img src={place.logo} alt={`${place.name} logo`} className="h-10 w-10 rounded-full bg-white object-contain p-1"/>}<span className="truncate font-serif text-lg font-bold sm:text-xl">{place.name}</span></Link><nav className="hidden items-center gap-6 lg:flex" aria-label="Mall sections">{[['#home', 'Home'], ['#about', 'About Us'], ['#collection', 'New Arrivals'], ['#reviews', 'Reviews'], ['#contact', 'Contact']].map(([target, label]) => <a key={target} href={target} className="border-b-2 border-transparent px-1 py-6 text-[13px] font-medium text-white/75 transition hover:border-[#ffc14d] hover:text-white">{label}</a>)}</nav><div className="flex shrink-0 items-center gap-2"><Link to="/" className="hidden rounded-full border border-white/50 px-4 py-2 text-xs font-semibold text-white transition hover:border-[#ffc14d] hover:bg-[#ffc14d] hover:text-[#101d2d] sm:block">← Back to G-Pages</Link><button type="button" onClick={() => setMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded border border-white/50 transition hover:border-[#ffc14d] lg:hidden" aria-label="Toggle mall menu" aria-expanded={menuOpen}><span className="relative block h-4 w-5"><span className={`absolute left-0 top-0 h-0.5 w-5 bg-white transition ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}/><span className={`absolute left-0 top-2 h-0.5 w-5 bg-white transition ${menuOpen ? 'opacity-0' : ''}`}/><span className={`absolute left-0 top-4 h-0.5 w-5 bg-white transition ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}/></span></button></div></div>{menuOpen && <nav className="border-t border-white/10 bg-[#101d2d] px-5 py-3 lg:hidden" aria-label="Mall sections mobile">{[['#home', 'Home'], ['#about', 'About Us'], ['#collection', 'New Arrivals'], ['#reviews', 'Reviews'], ['#contact', 'Contact']].map(([target, label]) => <a key={target} href={target} onClick={() => setMenuOpen(false)} className="block border-b border-white/10 py-3 text-sm text-white/80 transition last:border-0 hover:text-[#ffc14d]">{label}</a>)}<Link to="/" onClick={() => setMenuOpen(false)} className="block py-3 text-sm font-semibold text-[#ffc14d]">← Back to G-Pages</Link></nav>}</header>
    <section id="home" className="relative isolate overflow-hidden bg-[#fce9df]"><img src={place.coverImage || FALLBACK} alt={`${place.name} cover`} className="absolute right-0 top-0 -z-20 h-[500px] w-[59%] object-contain object-center sm:h-[520px]"/><div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#fff7f3_0%,#fff7f3_31%,rgba(255,247,243,.9)_45%,rgba(255,247,243,.08)_74%)]"/><div className="relative mx-auto min-h-[500px] max-w-7xl px-5 py-10 sm:min-h-[520px] sm:px-8 sm:py-14"><div className="max-w-[510px]"><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#c02b59]">Trending Now</p><h1 className="mt-2 font-display text-[43px] font-semibold leading-[.94] tracking-[-.035em] text-[#142033] sm:text-[64px]">Trendy Styles<br/>for Every <em className="font-serif font-normal text-[#e63c72]">You ♡</em></h1><p className="mt-4 max-w-sm text-[15px] leading-[1.35] text-[#172233]">Discover the latest fashion, from everyday wear to<br className="hidden sm:block"/> special occasions – all in one place.</p><span className="mt-5 inline-flex rounded-full bg-[#b1164c] px-5 py-2.5 font-display text-xs font-semibold tracking-wide text-white shadow-lg shadow-[#b1164c]/20">{place.name}</span><div className="mt-2 flex items-center gap-2"><FavoriteButton placeId={place._id} iconOnly/><button type="button" onClick={onShare} aria-label="Share this mall" title="Share" className="grid h-10 w-10 place-items-center rounded-full border border-[#b1164c]/30 bg-white/80 text-[#b1164c] transition hover:bg-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.4"/></svg></button><button type="button" onClick={onReport} aria-label="Report this mall" title="Report" className="grid h-10 w-10 place-items-center rounded-full border border-[#b1164c]/30 bg-white/80 text-[#b1164c] transition hover:bg-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M4 21V5m0 0c5-4 10 4 16 0v11c-6 4-11-4-16 0"/></svg></button></div><div className="mt-5 grid w-full max-w-[510px] grid-cols-2 rounded-2xl bg-white/90 px-3 py-4 shadow-xl backdrop-blur sm:grid-cols-4">{[['hanger','Premium','Quality Fabrics'], ['pencil','Custom','Stitching Available'], ['shield','Trendy &','Unique Designs'], ['truck','Easy Returns','& Exchange']].map(([type, firstLine, secondLine]) => <div key={type} className="border-r border-[#e9d9d7] px-2 text-center last:border-0"><span className="text-[#111827]"><FeatureIcon type={type}/></span><p className="mt-1 text-[11px] font-bold leading-[1.25] text-[#182233]">{firstLine}<br/>{secondLine}</p></div>)}</div></div><div className="absolute right-[5%] top-[15%] hidden rotate-[-8deg] text-center text-white drop-shadow-[0_3px_3px_rgba(0,0,0,.3)] lg:block"><p className="font-['Caveat'] text-[39px] font-semibold leading-[.78]">Look Good<br/>Feel Good<br/>Shop More ♡</p><svg viewBox="0 0 180 36" className="mx-auto mt-1 h-8 w-40" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 19c34 10 90 12 145-3"/><path d="m145 16 11-8m-11 8 11 7"/></svg></div></div>
    </section>
    <section className="mt-8 bg-[linear-gradient(90deg,#fff0f1,#fdf4ef)]"><div className="mx-auto grid max-w-7xl items-center px-5 py-7 sm:px-8 md:grid-cols-[190px_1fr]"><div className="font-['Caveat'] text-[44px] font-semibold leading-[.74] text-[#b1164c]">Why Shop<br/>With Us?</div><div className="grid grid-cols-2 sm:grid-cols-4">{[['star','Latest Trends','Fresh arrivals for every season'], ['crown','Exclusive Designs','Stand out with unique styles'], ['heart','Custom Tailoring','Perfect fit, just for you'], ['tag','Affordable Luxury','Style you love, prices you’ll smile at']].map(([type, heading, text]) => <div key={heading} className="border-l border-[#e8cfd2] px-4 text-center sm:min-h-[100px]"><span className="text-[#b1164c]"><FeatureIcon type={type}/></span><p className="mt-2 text-xs font-bold text-[#182233]">{heading}</p><p className="mx-auto mt-1 max-w-[125px] text-[11px] leading-[1.25] text-[#374151]">{text}</p></div>)}</div></div></section>
    <main><section id="about" className="mx-auto grid max-w-7xl items-center gap-9 px-5 py-14 sm:px-8 md:grid-cols-2"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c02b59]">About {place.name}</p><h2 className="mt-2 font-serif text-3xl font-bold">Your destination for shopping, style &amp; more.</h2><p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">{place.description || `${place.name} brings together fashion, beauty, lifestyle, entertainment and everyday essentials under one roof. Explore favourite brands, discover new collections and enjoy a relaxed shopping day with family and friends.`}</p><div className="mt-6 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">{['Fashion & lifestyle', 'Brands you love', 'Family-friendly spaces'].map((item) => <span key={item} className="rounded-lg bg-[#fff0f1] px-3 py-2 text-xs font-bold text-[#9d1748]">{icons.check} {item}</span>)}</div></div><div className="relative"><img src={aboutImage} alt={`Shopping at ${place.name}`} className="h-64 w-full rounded bg-white object-contain shadow-lg md:h-80"/><div className="absolute bottom-4 left-4 rounded-lg bg-white/95 px-4 py-3 shadow-lg"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#b1164c]">One place</p><p className="mt-1 text-sm font-bold">Shop · Discover · Enjoy</p></div></div></section>
    <section id="collection" className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><div className="flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c02b59]">Our Featured</p><h2 className="mt-1 font-serif text-4xl font-bold">Latest Collection</h2></div><button type="button" onClick={() => setLightbox(0)} className="hidden text-xs font-bold text-[#b1164c] transition hover:text-[#8f0d3c] sm:block">View All Collection&nbsp; {icons.arrow}</button></div><div className="relative mt-6"><button onClick={() => advance(-1)} aria-label="Previous collection" className="absolute -left-4 top-[42%] z-10 grid h-9 w-9 place-items-center rounded-full border border-[#e4cbcb] bg-white text-2xl shadow-md transition hover:border-[#b1164c] hover:text-[#b1164c] sm:-left-7">{icons.left}</button><div className="flex gap-4 overflow-hidden">{visible.map((image, index) => { const activeIndex = (slide + index) % gallery.length; const item = collectionItems[activeIndex] || {}; const features = Array.isArray(item.features) ? item.features : split(item.features); const collectionNames = split(place.attributes?.collections); return <button key={`${image}-${index}`} onClick={() => setLightbox(activeIndex)} className="group w-fit max-w-[min(78vw,320px)] flex-none overflow-hidden rounded-lg bg-white text-left shadow-md"><div className="relative"><img src={image} alt={`${place.name} collection ${activeIndex + 1}`} className="mx-auto block h-auto max-h-[320px] w-auto max-w-full bg-white object-contain transition duration-300"/><span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold text-white ${COLLECTION_TAG_COLORS[item.tag] || COLLECTION_TAG_COLORS.New}`}>{item.tag || 'New'}</span></div><div className="p-3"><p className="break-words text-sm font-bold">{titleCase(item.caption || collectionNames[activeIndex] || `Featured Style ${activeIndex + 1}`)}</p>{features.length > 0 && <p className="mt-1 break-words text-[10px] text-slate-500">{features.join(' | ')}</p>}</div></button>; })}</div><button onClick={() => advance(1)} aria-label="Next collection" className="absolute -right-4 top-[42%] z-10 grid h-9 w-9 place-items-center rounded-full border border-[#e4cbcb] bg-white text-2xl shadow-md transition hover:border-[#b1164c] hover:text-[#b1164c] sm:-right-7">{icons.right}</button></div><button type="button" onClick={() => setLightbox(0)} className="mt-5 text-xs font-bold text-[#b1164c] sm:hidden">View All Collection&nbsp; {icons.arrow}</button></section>
    {tourVideos.length > 0 && <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c02b59]">Take a look around</p><h2 className="mt-1 font-serif text-3xl font-bold text-[#142033]">Video Tour</h2><div className="mt-5 grid gap-5 md:grid-cols-2">{tourVideos.map(({ url, caption }, index) => { const title = caption?.trim() || `Mall tour ${index + 1}`; return <article key={url} className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-[#f0e4e4]"><div className="aspect-video bg-slate-950">{isDirectVideo(url) ? <video className="h-full w-full" controls preload="metadata" src={url}>{title}</video> : <iframe className="h-full w-full border-0" src={videoSource(url)} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy"/>}</div>{caption && <h3 className="px-4 py-3 text-sm font-bold text-[#142033]">{caption}</h3>}</article>; })}</div></section>}

    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8"><h2 className="mb-4 font-serif text-2xl font-bold text-[#142033]">Features</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['hanger','Try before you buy'], ['gift','Exclusive offers'], ['diamond','Premium brands'], ['heart','A community of style']].map(([type, heading]) => <div key={heading} className="rounded-xl bg-[#fff4ef] p-5 text-center transition hover:-translate-y-1 hover:bg-[#ffe8e8] hover:shadow-md"><div className="text-[#b1164c]"><FeatureIcon type={type}/></div><h3 className="mt-2 text-sm font-bold">{heading}</h3><p className="mt-1 text-xs text-slate-500">A better experience for every shopper.</p></div>)}</div></section>
</main>
    {hours.length > 0 && <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-[#f0e4e4]">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b1164c]">Opening hours</p>
        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
          {hours.map((entry) => (
            <div key={entry.day} className="flex justify-between gap-3 border-b border-[#f0e4e4] pb-2">
              <span className="font-semibold">{dayLabel[entry.day] || entry.day}</span>
              <span>{entry.closed ? 'Closed' : `${entry.open || '--:--'} - ${entry.close || '--:--'}`}</span>
            </div>
          ))}
        </div>
      </div>
    </section>}
    <footer id="contact" className="bg-[#101d2d] text-white"><div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 px-3 py-8 sm:gap-8 sm:px-8 lg:grid-cols-4"><div className="col-span-3 flex items-center gap-3 lg:col-span-1">{place.logo && <img src={place.logo} alt="" className="h-12 w-12 rounded-full bg-white object-contain p-1"/>}<span className="font-serif text-xl font-bold">{place.name}</span></div>{(place.phone || socialLinks.whatsapp || place.email) && (<div><h3 className="text-sm font-bold">Quick Links</h3><div className="mt-3 grid gap-3 text-xs text-slate-300">{place.phone && <a href={`tel:${place.phone}`} className="flex items-center gap-2 transition hover:text-[#ffc14d]"><FooterIcon type="phone"/>Call</a>}{socialLinks.whatsapp && <a href={whatsappHref(socialLinks.whatsapp)} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-[#ffc14d]"><FooterIcon type="whatsapp"/>WhatsApp</a>}{place.email && <a href={`mailto:${place.email}`} className="flex items-center gap-2 transition hover:text-[#ffc14d]"><FooterIcon type="email"/>Email</a>}</div></div>)}{(socialLinks.instagram || socialLinks.facebook || socialLinks.youtube || place.website) && (<div><h3 className="text-sm font-bold">Follow us</h3><div className="mt-3 grid gap-3 text-xs text-slate-300">{socialLinks.instagram && <a href={href(socialLinks.instagram)} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-[#ffc14d]"><FooterIcon type="instagram"/>Instagram</a>}{socialLinks.facebook && <a href={href(socialLinks.facebook)} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-[#ffc14d]"><FooterIcon type="facebook"/>Facebook</a>}{socialLinks.youtube && <a href={href(socialLinks.youtube)} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-[#ffc14d]"><FooterIcon type="youtube"/>YouTube</a>}{place.website && <a href={href(place.website)} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-[#ffc14d]"><FooterIcon type="website"/>Website</a>}</div></div>)}{(place.address || place.coordinates?.lat) && (<div><h3 className="text-sm font-bold">Find us</h3>{place.address && <div className="mt-3 flex items-center gap-2 text-xs text-slate-300"><FooterIcon type="pin"/><span>{place.address}</span></div>}<iframe title={`Map for ${place.name}`} src={`https://www.google.com/maps?q=${place.coordinates?.lat ? `${place.coordinates.lat},${place.coordinates.lng}` : encodeURIComponent(place.address || place.name)}&output=embed`} className="mt-3 h-24 w-full rounded-lg border-0 sm:h-40" loading="lazy"/></div>)}</div><div className="border-t border-white/10 py-4 text-center text-[11px] text-slate-400">© {new Date().getFullYear()} {place.name}. All rights reserved.</div></footer><TodayOffer offer={place.attributes?.offer}/>
    {lightbox !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101d2d]/95 p-5" role="dialog" aria-modal="true" aria-label={`${place.name} collection gallery`}><div className="w-full max-w-6xl"><div className="flex items-center justify-between text-white"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#ffc14d]">Latest Collection</p><p className="mt-1 text-sm text-white/70">{lightbox + 1} of {gallery.length}</p></div><button onClick={() => setLightbox(null)} className="rounded-full border border-white/60 px-4 py-2 text-sm font-semibold transition hover:border-[#ffc14d] hover:text-[#ffc14d]">Close {icons.close}</button></div><div className="relative mt-5 flex items-center justify-center"><button onClick={() => setLightbox((lightbox - 1 + gallery.length) % gallery.length)} aria-label="Previous image" className="absolute left-0 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-[#101d2d]/80 text-3xl text-white transition hover:border-[#ffc14d] hover:text-[#ffc14d]">{icons.left}</button><img src={gallery[lightbox]} alt={`${place.name} collection ${lightbox + 1}`} className="max-h-[72vh] w-full rounded-lg object-contain"/><button onClick={() => setLightbox((lightbox + 1) % gallery.length)} aria-label="Next image" className="absolute right-0 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-[#101d2d]/80 text-3xl text-white transition hover:border-[#ffc14d] hover:text-[#ffc14d]">{icons.right}</button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{gallery.map((image, index) => <button key={`${image}-thumbnail-${index}`} onClick={() => setLightbox(index)} className={`shrink-0 overflow-hidden border-2 ${index === lightbox ? 'border-[#ffc14d]' : 'border-transparent opacity-60 hover:opacity-100'}`}><img src={image} alt={`${place.name} thumbnail ${index + 1}`} className="h-14 w-20 object-contain"/></button>)}</div></div></div>}
  </div>;
}

import React, { useState } from 'react';
import LocationCascadeFields from '../../../components/LocationCascadeFields';
import api from '../../../services/api';
import mediaUrl from '../../../utils/mediaUrl';

const propertyTypes = ['Hotel', 'Residency', 'Boutique Hotel', 'Business Hotel', 'Budget Hotel', 'Luxury Hotel', 'Guest House', 'Lodge', 'Homestay'];
const roomTypes = ['Standard Room', 'Deluxe Room', 'Executive Room', 'Premium Room', 'Family Room', 'Suite', 'Couple Room', 'Presidential Suite', 'Custom'];
const roomAmenities = ['AC', 'TV', 'Wi-Fi', 'Breakfast', 'Room Service', 'Balcony', 'Attached Bathroom', 'Mini Bar', 'Refrigerator', 'Work Desk'];
const facilities = ['Restaurant', 'Swimming Pool', 'Free Wi-Fi', 'Parking', 'Room Service', 'Housekeeping', 'Conference Hall', 'Banquet Hall', 'Gym', 'Spa', 'Laundry', 'Airport Pickup', '24/7 Reception', 'Security', 'Lift', 'Generator Backup'];
const galleryCategories = ['Rooms', 'Exterior', 'Lobby', 'Restaurant', 'Facilities', 'Events'];
const socials = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['linkedin', 'LinkedIn'], ['pinterest', 'Pinterest']];
const inputClass = 'mt-1 w-full rounded-md border border-[#e4d8c6] bg-white px-3 py-2.5 text-sm text-[#273748] outline-none focus:border-[#b47c2f] focus:ring-2 focus:ring-[#b47c2f]/15';
const Section = ({ number, title, children }) => <section className="col-span-2 rounded-xl border border-[#e9dfd1] bg-white p-5 shadow-sm sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#a16b22]">{number}</p><h2 className="mt-1 font-display text-xl font-bold text-[#182b40]">{title}</h2><div className="mt-5 grid grid-cols-2 gap-4">{children}</div></section>;
const Field = ({ label, children, className = '' }) => <label className={`col-span-2 block text-sm font-medium text-[#5e625f] sm:col-span-1 ${className}`}>{label}{children}</label>;
const array = (value) => Array.isArray(value) ? value : [];

export default function HotelsResidenciesListingFields({ form, setForm, location, setLocation, details, setDetails, uploadedFiles, setUploadedFiles, onSaveDraft, submitting, isEditing, error, success }) {
  const [roomDraft, setRoomDraft] = useState({ name: '', type: '', images: [], description: '', guests: '', beds: '', bedType: '', size: '', price: '', offerPrice: '', availability: 'Available', amenities: [] });
  const [serviceDraft, setServiceDraft] = useState({ name: '', description: '', image: '', price: '' });
  const [videoDraft, setVideoDraft] = useState({ title: '', thumbnail: '', url: '' });
  const [mediaError, setMediaError] = useState('');
  const [formError, setFormError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const setDetail = (key, value) => setDetails((current) => ({ ...current, [key]: value }));
  const setNested = (key, field, value) => setDetail(key, { ...(details[key] || {}), [field]: value });
  const updateForm = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const upload = async (file, kind = 'images') => {
    const body = new FormData();
    body.append(kind, file);
    const endpoint = kind === 'videos' ? '/uploads/videos' : '/uploads/images';
    const { data } = await api.post(endpoint, body, { headers: { 'Content-Type': 'multipart/form-data' } });
    return mediaUrl(data.data?.[0]?.url || '');
  };
  const uploadOne = async (event, done, kind = 'images') => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      setMediaError('');
      done(await upload(file, kind));
    } catch (uploadError) {
      setMediaError(uploadError.response?.data?.message || 'Upload failed. Please try again.');
    }
  };
  const uploadMany = async (event, done, max = 5) => {
    const files = Array.from(event.target.files || []).slice(0, max);
    event.target.value = '';
    if (!files.length) return;
    try {
      setMediaError('');
      done(await Promise.all(files.map((file) => upload(file))));
    } catch (uploadError) {
      setMediaError(uploadError.response?.data?.message || 'Image upload failed. Please try again.');
    }
  };
  const imageInput = (label, value, onChange) => <Field label={`${label} URL or upload`}><div className="flex gap-2"><input type="url" value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="https://" className={inputClass} /><label className="mt-1 shrink-0 cursor-pointer rounded-md border border-[#e4d8c6] px-3 py-2.5 text-xs font-semibold text-[#a16b22]">Upload<input type="file" accept="image/*" className="hidden" onChange={(event) => uploadOne(event, onChange)} /></label></div>{value && <img src={value} alt={`${label} preview`} className="mt-2 h-28 w-full rounded-md object-cover" />}</Field>;
  const toggleList = (key, value) => {
    const current = array(details[key]);
    setDetail(key, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };
  const addRoom = () => {
    if (!roomDraft.name.trim()) {
      setFormError('Enter a room name before adding the room.');
      return;
    }
    setDetail('Rooms', [...array(details.Rooms), roomDraft]);
    setFormError('');
    setRoomDraft({ name: '', type: '', images: [], description: '', guests: '', beds: '', bedType: '', size: '', price: '', offerPrice: '', availability: 'Available', amenities: [] });
  };
  const addService = () => {
    if (!serviceDraft.name.trim()) return;
    setDetail('Hotel Services', [...array(details['Hotel Services']), serviceDraft]);
    setServiceDraft({ name: '', description: '', image: '', price: '' });
  };
  const addVideo = () => {
    if (!videoDraft.title.trim() || !videoDraft.url.trim() || array(details.videos).length >= 10) return;
    setDetail('videos', [...array(details.videos), videoDraft]);
    setVideoDraft({ title: '', thumbnail: '', url: '' });
  };
  const addGallery = async (event) => {
    const room = uploadedFiles.galleryImages || [];
    const files = Array.from(event.target.files || []).slice(0, Math.max(0, 10 - room.length));
    event.target.value = '';
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map((file) => upload(file)));
      setUploadedFiles((current) => ({ ...current, galleryImages: [...(current.galleryImages || []), ...urls] }));
    } catch (uploadError) {
      setMediaError(uploadError.response?.data?.message || 'Gallery upload failed. Please try again.');
    }
  };
  const moveGallery = (index, delta) => {
    const images = [...(uploadedFiles.galleryImages || [])];
    const target = index + delta;
    if (target < 0 || target >= images.length) return;
    [images[index], images[target]] = [images[target], images[index]];
    const categories = [...(details.galleryCategories || [])];
    [categories[index], categories[target]] = [categories[target], categories[index]];
    setUploadedFiles((current) => ({ ...current, galleryImages: images }));
    setDetail('galleryCategories', categories);
  };

  return <div className="col-span-2 space-y-4">
    <div className="rounded-xl bg-[#25364a] px-5 py-6 text-white sm:px-7"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#e6b866]">G-Pages hospitality studio</p><h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Create Hotel / Residency Profile</h1><p className="mt-2 text-sm text-white/75">Add your property details, rooms, facilities, gallery and booking information.</p></div>

    <Section number="01 · Property profile" title="Property information">
      <Field label="Property Name *"><input required value={form.name} onChange={updateForm('name')} className={inputClass} /></Field>
      <Field label="Property Type"><select value={details.propertyType || ''} onChange={(event) => setDetail('propertyType', event.target.value)} className={inputClass}><option value="">Choose property type</option>{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Star Rating"><select value={details.starRating || ''} onChange={(event) => setDetail('starRating', event.target.value)} className={inputClass}><option value="">Not rated</option>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} Star{value > 1 ? 's' : ''}</option>)}</select></Field>
      <Field label="Tagline"><input value={form.tagline || ''} onChange={updateForm('tagline')} className={inputClass} /></Field>
      <Field label="Established Year"><input type="number" min="1800" max="2100" value={form.establishedYear || ''} onChange={updateForm('establishedYear')} className={inputClass} /></Field>
      <Field label="Property Description *" className="sm:col-span-2"><textarea required rows={4} value={form.description} onChange={updateForm('description')} className={inputClass} /></Field>
      {imageInput('Property logo', uploadedFiles.logo, (value) => setUploadedFiles((current) => ({ ...current, logo: value })))}
    </Section>

    <Section number="02 · Contact" title="Contact details">
      <Field label="Phone *"><input required type="tel" value={form.phone} onChange={updateForm('phone')} className={inputClass} /></Field>
      <Field label="WhatsApp"><input type="tel" value={form.whatsapp || ''} onChange={updateForm('whatsapp')} className={inputClass} /></Field>
      <Field label="Email *"><input required type="email" value={form.email} onChange={updateForm('email')} className={inputClass} /></Field>
      <Field label="Website"><input type="url" value={form.website || ''} onChange={updateForm('website')} placeholder="https://" className={inputClass} /></Field>
      <Field label="Booking Contact"><input value={details.booking?.contact || ''} onChange={(event) => setNested('booking', 'contact', event.target.value)} className={inputClass} /></Field>
      <Field label="Reception Phone"><input type="tel" value={details.receptionPhone || ''} onChange={(event) => setDetail('receptionPhone', event.target.value)} className={inputClass} /></Field>
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Contact actions</legend><div className="mt-2 flex flex-wrap gap-4">{[['callNow', 'Call Now'], ['whatsAppAction', 'WhatsApp'], ['bookNow', 'Book Now']].map(([key, label]) => <label key={key} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={details.actions?.[key] !== false} onChange={(event) => setNested('actions', key, event.target.checked)} className="accent-[#b47c2f]" />{label}</label>)}</div></fieldset>
    </Section>

    <Section number="03 · Find the property" title="Property location">
      <LocationCascadeFields value={location} onChange={setLocation} />
      <Field label="Address *" className="sm:col-span-2"><input required value={form.address} onChange={updateForm('address')} placeholder="Full property address" className={inputClass} /></Field>
      <Field label="Country"><input value={details.country || 'India'} onChange={(event) => setDetail('country', event.target.value)} className={inputClass} /></Field>
      <Field label="Pincode"><input inputMode="numeric" value={form.pincode || ''} onChange={updateForm('pincode')} className={inputClass} /></Field>
      <Field label="Map latitude"><input type="number" step="any" value={details.coordinates?.lat || ''} onChange={(event) => setNested('coordinates', 'lat', event.target.value)} className={inputClass} /></Field>
      <Field label="Map longitude"><input type="number" step="any" value={details.coordinates?.lng || ''} onChange={(event) => setNested('coordinates', 'lng', event.target.value)} className={inputClass} /></Field>
      <div className="col-span-2 flex flex-wrap items-center gap-2"><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.address || `${location.city || ''} ${location.state || ''}`)}`} className="rounded-md border border-[#e4d8c6] px-3 py-2 text-xs font-semibold text-[#754f23]">Select on map</a><span className="text-xs text-[#77746f]">You can also enter the address manually above.</span></div>
    </Section>

    <Section number="04 · Reception" title="Working and reception hours">
      <label className="col-span-2 flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={Boolean(details.reception247)} onChange={(event) => setDetail('reception247', event.target.checked)} className="accent-[#b47c2f]" />24/7 Reception</label>
      {!details.reception247 && <><Field label="Opening Time"><input type="time" value={details.openingTime || ''} onChange={(event) => setDetail('openingTime', event.target.value)} className={inputClass} /></Field><Field label="Closing Time"><input type="time" value={details.closingTime || ''} onChange={(event) => setDetail('closingTime', event.target.value)} className={inputClass} /></Field></>}
      <Field label="Customer Check-in Time"><input type="time" value={details.checkInTime || ''} onChange={(event) => setDetail('checkInTime', event.target.value)} className={inputClass} /></Field>
      <Field label="Customer Check-out Time"><input type="time" value={details.checkOutTime || ''} onChange={(event) => setDetail('checkOutTime', event.target.value)} className={inputClass} /></Field>
    </Section>

    <Section number="05 · Stay" title="Rooms">
      <Field label="Room Name *"><input value={roomDraft.name} onChange={(event) => setRoomDraft({ ...roomDraft, name: event.target.value })} className={inputClass} /></Field>
      <Field label="Room Type"><select value={roomDraft.type} onChange={(event) => setRoomDraft({ ...roomDraft, type: event.target.value })} className={inputClass}><option value="">Choose room type</option>{roomTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Room Description" className="sm:col-span-2"><textarea rows={3} value={roomDraft.description} onChange={(event) => setRoomDraft({ ...roomDraft, description: event.target.value })} className={inputClass} /></Field>
      <Field label={`Room Images (${roomDraft.images.length}/5)`} className="sm:col-span-2"><input type="file" accept="image/*" multiple onChange={(event) => uploadMany(event, (images) => setRoomDraft((current) => ({ ...current, images: [...current.images, ...images].slice(0, 5) })), 5 - roomDraft.images.length)} className={inputClass} />{roomDraft.images.length > 0 && <div className="mt-2 flex gap-2 overflow-x-auto">{roomDraft.images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`Room preview ${index + 1}`} className="h-16 w-20 shrink-0 rounded object-cover" />)}</div>}</Field>
      <Field label="Number of Guests"><input type="number" min="1" value={roomDraft.guests} onChange={(event) => setRoomDraft({ ...roomDraft, guests: event.target.value })} className={inputClass} /></Field>
      <Field label="Number of Beds"><input type="number" min="1" value={roomDraft.beds} onChange={(event) => setRoomDraft({ ...roomDraft, beds: event.target.value })} className={inputClass} /></Field>
      <Field label="Bed Type"><input value={roomDraft.bedType} onChange={(event) => setRoomDraft({ ...roomDraft, bedType: event.target.value })} className={inputClass} /></Field>
      <Field label="Room Size"><input value={roomDraft.size} onChange={(event) => setRoomDraft({ ...roomDraft, size: event.target.value })} placeholder="m² or sq ft" className={inputClass} /></Field>
      <Field label="Price Per Night"><input type="number" min="0" value={roomDraft.price} onChange={(event) => setRoomDraft({ ...roomDraft, price: event.target.value })} className={inputClass} /></Field>
      <Field label="Offer Price"><input type="number" min="0" value={roomDraft.offerPrice} onChange={(event) => setRoomDraft({ ...roomDraft, offerPrice: event.target.value })} className={inputClass} /></Field>
      <Field label="Availability"><select value={roomDraft.availability} onChange={(event) => setRoomDraft({ ...roomDraft, availability: event.target.value })} className={inputClass}><option>Available</option><option>Limited</option><option>On request</option><option>Unavailable</option></select></Field>
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Room Amenities</legend><div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{roomAmenities.map((item) => <label key={item} className="flex items-center gap-2 rounded border border-[#eee5d9] px-2.5 py-2 text-xs"><input type="checkbox" checked={roomDraft.amenities.includes(item)} onChange={() => setRoomDraft((current) => ({ ...current, amenities: current.amenities.includes(item) ? current.amenities.filter((value) => value !== item) : [...current.amenities, item] }))} className="accent-[#b47c2f]" />{item}</label>)}</div></fieldset>
      <div className="col-span-2"><button type="button" onClick={addRoom} className="rounded-md border border-[#a16b22] px-4 py-2 text-xs font-bold text-[#8a5e28]">Add Another Room</button>{array(details.Rooms).map((room, index) => <div key={`${room.name}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#faf6ef] px-3 py-2 text-sm"><span>{room.name} · {room.type || 'Room'}</span><button type="button" onClick={() => setDetail('Rooms', details.Rooms.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700">Remove</button></div>)}</div>
    </Section>

    <Section number="06 · Property features" title="Hotel facilities"><fieldset className="col-span-2"><legend className="sr-only">Hotel facilities</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{facilities.map((item) => <label key={item} className="flex items-center gap-2 rounded border border-[#eee5d9] px-3 py-2 text-xs"><input type="checkbox" checked={array(details.Facilities).includes(item)} onChange={() => toggleList('Facilities', item)} className="accent-[#b47c2f]" />{item}</label>)}</div></fieldset></Section>

    <Section number="07 · Guest services" title="Services">
      <Field label="Service Name"><input value={serviceDraft.name} onChange={(event) => setServiceDraft({ ...serviceDraft, name: event.target.value })} className={inputClass} /></Field>
      <Field label="Price if applicable"><input value={serviceDraft.price} onChange={(event) => setServiceDraft({ ...serviceDraft, price: event.target.value })} className={inputClass} /></Field>
      <Field label="Service Description" className="sm:col-span-2"><textarea rows={2} value={serviceDraft.description} onChange={(event) => setServiceDraft({ ...serviceDraft, description: event.target.value })} className={inputClass} /></Field>
      {imageInput('Service image', serviceDraft.image, (value) => setServiceDraft((current) => ({ ...current, image: value })))}
      <div className="col-span-2"><button type="button" onClick={addService} className="rounded-md border border-[#a16b22] px-4 py-2 text-xs font-bold text-[#8a5e28]">Add Another Service</button>{array(details['Hotel Services']).map((item, index) => <div key={`${item.name}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#faf6ef] px-3 py-2 text-sm"><span>{item.name}</span><button type="button" onClick={() => setDetail('Hotel Services', details['Hotel Services'].filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700">Remove</button></div>)}</div>
    </Section>

    <Section number="08 · Property imagery" title="Hero images">
      {imageInput('Hero banner', uploadedFiles.coverImage, (value) => setUploadedFiles((current) => ({ ...current, coverImage: value })))}
      {imageInput('About image', uploadedFiles.aboutImage, (value) => setUploadedFiles((current) => ({ ...current, aboutImage: value })))}
      {imageInput('Property exterior', details.propertyExteriorImage, (value) => setDetail('propertyExteriorImage', value))}
    </Section>

    <Section number="09 · Property moments" title="Gallery · maximum 10 images">
      <div className="col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-4">{(uploadedFiles.galleryImages || []).map((image, index) => <div key={`${image}-${index}`} className="overflow-hidden rounded-md border border-[#e9dfd1]"><img src={image} alt={`Property gallery ${index + 1}`} className="aspect-square w-full object-cover" /><select aria-label={`Gallery category ${index + 1}`} value={details.galleryCategories?.[index] || 'Rooms'} onChange={(event) => setDetail('galleryCategories', (uploadedFiles.galleryImages || []).map((_, itemIndex) => itemIndex === index ? event.target.value : details.galleryCategories?.[itemIndex] || 'Rooms'))} className="w-full border-y border-[#e9dfd1] px-2 py-1.5 text-[10px]">{galleryCategories.map((item) => <option key={item}>{item}</option>)}</select><div className="flex justify-between px-2 py-2"><button type="button" onClick={() => moveGallery(index, -1)} aria-label="Move image earlier" className="text-xs">←</button><button type="button" onClick={() => { setUploadedFiles((current) => ({ ...current, galleryImages: current.galleryImages.filter((_, itemIndex) => itemIndex !== index) })); setDetail('galleryCategories', (details.galleryCategories || []).filter((_, itemIndex) => itemIndex !== index)); }} className="text-xs font-semibold text-red-700">Delete</button><button type="button" onClick={() => moveGallery(index, 1)} aria-label="Move image later" className="text-xs">→</button></div></div>)}{(uploadedFiles.galleryImages || []).length < 10 && <label className="grid aspect-square cursor-pointer place-items-center rounded-md border border-dashed border-[#cdbb9f] text-center text-xs text-[#716450]">Add photos<input type="file" accept="image/*" multiple className="hidden" onChange={addGallery} /></label>}</div>
      <Field label="Add an image URL"><input type="url" value={details.galleryImageUrl || ''} onChange={(event) => setDetail('galleryImageUrl', event.target.value)} placeholder="https://" className={inputClass} /></Field>
      <button type="button" onClick={() => { if (details.galleryImageUrl && (uploadedFiles.galleryImages || []).length < 10) { setUploadedFiles((current) => ({ ...current, galleryImages: [...(current.galleryImages || []), details.galleryImageUrl] })); setDetail('galleryCategories', [...(details.galleryCategories || []), details.galleryImageCategory || 'Rooms']); setDetail('galleryImageUrl', ''); } }} className="mt-1 self-start rounded-md border border-[#a16b22] px-3 py-2 text-xs font-bold text-[#8a5e28]">Add Image URL</button>
      <Field label="URL image category"><select value={details.galleryImageCategory || 'Rooms'} onChange={(event) => setDetail('galleryImageCategory', event.target.value)} className={inputClass}>{galleryCategories.map((item) => <option key={item}>{item}</option>)}</select></Field>
    </Section>

    <Section number="10 · Property tour" title="Videos · maximum 10">
      <Field label="Video Title"><input value={videoDraft.title} onChange={(event) => setVideoDraft({ ...videoDraft, title: event.target.value })} placeholder="Hotel Tour" className={inputClass} /></Field>
      {imageInput('Video thumbnail', videoDraft.thumbnail, (value) => setVideoDraft((current) => ({ ...current, thumbnail: value })))}
      <Field label="Video URL (YouTube, Vimeo or direct)"><input type="url" value={videoDraft.url} onChange={(event) => setVideoDraft({ ...videoDraft, url: event.target.value })} className={inputClass} /></Field>
      <Field label="Or upload video"><input type="file" accept="video/*" onChange={(event) => uploadOne(event, (url) => setVideoDraft((current) => ({ ...current, url })), 'videos')} className={inputClass} /></Field>
      <div className="col-span-2"><button type="button" disabled={array(details.videos).length >= 10} onClick={addVideo} className="rounded-md border border-[#a16b22] px-4 py-2 text-xs font-bold text-[#8a5e28] disabled:opacity-50">Add Video</button>{array(details.videos).map((item, index) => <div key={`${item.url}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#faf6ef] px-3 py-2 text-sm"><span>{item.title}</span><button type="button" onClick={() => setDetail('videos', details.videos.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700">Remove</button></div>)}</div>
    </Section>

    <Section number="11 · Reservations" title="Booking information">
      <Field label="Booking URL"><input type="url" value={details.booking?.url || ''} onChange={(event) => setNested('booking', 'url', event.target.value)} placeholder="https://" className={inputClass} /></Field>
      <Field label="Booking Email"><input type="email" value={details.booking?.email || ''} onChange={(event) => setNested('booking', 'email', event.target.value)} className={inputClass} /></Field>
      <Field label="Booking Phone"><input type="tel" value={details.booking?.phone || ''} onChange={(event) => setNested('booking', 'phone', event.target.value)} className={inputClass} /></Field>
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Booking methods</legend><div className="mt-2 flex flex-wrap gap-4">{['Direct Booking', 'Phone Booking', 'WhatsApp Booking', 'Website Booking', 'External Booking Link'].map((item) => <label key={item} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={array(details.bookingMethods).includes(item)} onChange={() => toggleList('bookingMethods', item)} className="accent-[#b47c2f]" />{item}</label>)}</div></fieldset>
    </Section>

    <Section number="12 · Social" title="Social media">{socials.map(([key, label]) => <Field key={key} label={label}><input type="url" value={details.socialLinks?.[key] || ''} onChange={(event) => setNested('socialLinks', key, event.target.value)} placeholder="https://" className={inputClass} /></Field>)}</Section>
    <Section number="13 · Guest feedback" title="Customer reviews"><label className="col-span-2 flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={details.enableReviews !== false} onChange={(event) => setDetail('enableReviews', event.target.checked)} className="h-4 w-4 accent-[#b47c2f]" />Enable Reviews</label></Section>
    <Section number="14 · Search visibility" title="SEO"><Field label="SEO Title"><input value={details.seoTitle || ''} onChange={(event) => setDetail('seoTitle', event.target.value)} className={inputClass} /></Field><Field label="SEO Keywords"><input value={details.seoKeywords || ''} onChange={(event) => setDetail('seoKeywords', event.target.value)} className={inputClass} /></Field><Field label="SEO Description" className="sm:col-span-2"><textarea rows={3} value={details.seoDescription || ''} onChange={(event) => setDetail('seoDescription', event.target.value)} className={inputClass} /></Field></Section>

    {(error || success || mediaError || formError) && <p role={error || mediaError || formError ? 'alert' : 'status'} className={`col-span-2 text-sm ${error || mediaError || formError ? 'text-red-700' : 'text-emerald-700'}`}>{error || mediaError || formError || success}</p>}
    <div className="col-span-2 flex flex-wrap justify-end gap-3 rounded-xl border border-[#e9dfd1] bg-white p-4"><button type="button" onClick={onSaveDraft} className="rounded-md border border-[#e4d8c6] px-4 py-2.5 text-sm font-semibold text-[#5e625f]">Save Draft</button><button type="button" onClick={() => setPreviewOpen(true)} className="rounded-md border border-[#a16b22] px-4 py-2.5 text-sm font-semibold text-[#8a5e28]">Preview Website</button><button type="submit" disabled={submitting} className="rounded-md bg-[#a16b22] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{submitting ? 'Submitting…' : isEditing ? 'Publish Changes' : 'Publish'}</button></div>
    {previewOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#182b40]/70 p-4" onClick={() => setPreviewOpen(false)}><div role="dialog" aria-modal="true" aria-label="Hotel website preview" className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-6" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#a16b22]">Property preview</p><h2 className="mt-2 font-display text-3xl font-bold text-[#182b40]">{form.name || 'Your hotel or residency'}</h2><p className="mt-1 text-sm text-[#756c60]">{form.tagline || 'Your comfort is our priority.'}</p></div><button type="button" onClick={() => setPreviewOpen(false)} aria-label="Close preview" className="grid h-9 w-9 place-items-center rounded-full border">×</button></div>{uploadedFiles.coverImage && <img src={uploadedFiles.coverImage} alt="Hotel hero preview" className="mt-5 h-56 w-full rounded-lg object-cover" />}<p className="mt-4 text-sm leading-6 text-[#756c60]">{form.description || 'Property description'}</p><h3 className="mt-5 font-bold">Rooms</h3><div className="mt-2 grid gap-2 sm:grid-cols-2">{details.Rooms?.map((room, index) => <div key={`${room.name}-${index}`} className="rounded-md bg-[#faf6ef] p-3 text-sm">{room.name} · {room.price ? `${room.price} per night` : 'Contact for rates'}</div>)}</div><button type="button" onClick={() => setPreviewOpen(false)} className="mt-6 rounded-md bg-[#a16b22] px-4 py-2 text-sm font-bold text-white">Close preview</button></div></div>}
  </div>;
}

import React, { useState } from 'react';
import LocationCascadeFields from '../../../components/LocationCascadeFields';
import api from '../../../services/api';
import mediaUrl from '../../../utils/mediaUrl';

const resortTypes = ['Beach Resort', 'Hill Resort', 'Nature Resort', 'Luxury Resort', 'Family Resort', 'Eco Resort', 'Adventure Resort', 'Wellness Resort', 'Couple Resort', 'Farm Resort', 'Other'];
const accommodationTypes = ['Deluxe Room', 'Premium Room', 'Villa', 'Cottage', 'Suite', 'Family Room', 'Pool View Room', 'Couple Room', 'Tent', 'Custom'];
const roomAmenities = ['AC', 'Wi-Fi', 'TV', 'Breakfast', 'Balcony', 'Pool View', 'Garden View', 'Room Service', 'Mini Bar', 'Private Pool'];
const facilities = ['Swimming Pool', 'Restaurant', 'Spa', 'Gym', 'Free Wi-Fi', 'Parking', 'Kids Area', 'Conference Hall', 'Event Space', 'Room Service', 'Housekeeping', 'Campfire Area', 'Indoor Games', 'Outdoor Games', 'Security', 'Power Backup'];
const activities = ['Nature Walk', 'Trekking', 'Swimming', 'Boating', 'Campfire', 'Cycling', 'Indoor Games', 'Outdoor Games', 'Adventure Activities', 'Spa & Wellness', 'Kids Activities', 'Photography', 'Local Sightseeing'];
const cuisines = ['Indian', 'South Indian', 'North Indian', 'Continental', 'Chinese', 'Multi Cuisine'];
const diningOptions = ['Breakfast', 'Lunch', 'Dinner', 'Room Dining', 'Buffet', 'Cafe', 'Bar'];
const galleryCategories = ['Resort', 'Rooms', 'Pool', 'Restaurant', 'Nature', 'Activities', 'Events'];
const bookingMethods = ['Direct Booking', 'Phone', 'WhatsApp', 'Website', 'External Booking URL'];
const socials = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['linkedin', 'LinkedIn'], ['pinterest', 'Pinterest']];
const inputClass = 'mt-1 w-full rounded-md border border-[#d8e4da] bg-white px-3 py-2.5 text-sm text-[#214540] outline-none focus:border-[#16806f] focus:ring-2 focus:ring-[#16806f]/15';
const array = (value) => Array.isArray(value) ? value : [];
const Section = ({ number, title, children }) => <section className="col-span-2 rounded-xl border border-[#dbe8df] bg-white p-5 shadow-sm sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#16806f]">{number}</p><h2 className="mt-1 font-display text-xl font-bold text-[#173c3a]">{title}</h2><div className="mt-5 grid grid-cols-2 gap-4">{children}</div></section>;
const Field = ({ label, children, className = '' }) => <label className={`col-span-2 block text-sm font-medium text-[#52716a] sm:col-span-1 ${className}`}>{label}{children}</label>;

export default function ResortsListingFields({ form, setForm, location, setLocation, details, setDetails, uploadedFiles, setUploadedFiles, onSaveDraft, submitting, isEditing, error, success }) {
  const [stayDraft, setStayDraft] = useState({ name: '', type: '', description: '', guests: '', beds: '', size: '', price: '', offerPrice: '', images: [], amenities: [] });
  const [activityDraft, setActivityDraft] = useState({ name: '', description: '', image: '', price: '' });
  const [packageDraft, setPackageDraft] = useState({ name: '', duration: '', price: '', offerPrice: '', description: '', includes: [], image: '' });
  const [videoDraft, setVideoDraft] = useState({ title: '', thumbnail: '', url: '' });
  const [galleryUrl, setGalleryUrl] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [formError, setFormError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const setDetail = (key, value) => setDetails((current) => ({ ...current, [key]: value }));
  const setNested = (key, field, value) => setDetail(key, { ...(details[key] || {}), [field]: value });
  const updateForm = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const upload = async (file, kind = 'images') => {
    const body = new FormData();
    body.append(kind, file);
    const { data } = await api.post(kind === 'videos' ? '/uploads/videos' : '/uploads/images', body, { headers: { 'Content-Type': 'multipart/form-data' } });
    return mediaUrl(data.data?.[0]?.url || '');
  };
  const uploadOne = async (event, onComplete, kind = 'images') => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      setMediaError('');
      onComplete(await upload(file, kind));
    } catch (uploadError) {
      setMediaError(uploadError.response?.data?.message || 'Upload failed. Please try again.');
    }
  };
  const uploadMany = async (event, files, onComplete, max) => {
    const selected = Array.from(files || []).slice(0, Math.max(0, max));
    event.target.value = '';
    if (!selected.length) return;
    try {
      setMediaError('');
      onComplete(await Promise.all(selected.map((file) => upload(file))));
    } catch (uploadError) {
      setMediaError(uploadError.response?.data?.message || 'Image upload failed. Please try again.');
    }
  };
  const imageInput = (label, value, onChange) => <Field label={`${label} URL or upload`}><div className="flex gap-2"><input type="url" value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="https://" className={inputClass} /><label className="mt-1 shrink-0 cursor-pointer rounded-md border border-[#d8e4da] px-3 py-2.5 text-xs font-semibold text-[#16806f]">Upload<input type="file" accept="image/*" className="hidden" onChange={(event) => uploadOne(event, onChange)} /></label></div>{value && <img src={value} alt={`${label} preview`} className="mt-2 h-24 w-full rounded-md object-cover" />}</Field>;
  const toggle = (key, value) => {
    const current = array(details[key]);
    setDetail(key, current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]);
  };
  const addStay = () => {
    if (!stayDraft.name.trim()) {
      setFormError('Accommodation Name is required.');
      return;
    }
    setDetail('Rooms', [...array(details.Rooms), stayDraft]);
    setStayDraft({ name: '', type: '', description: '', guests: '', beds: '', size: '', price: '', offerPrice: '', images: [], amenities: [] });
    setFormError('');
  };
  const addActivity = () => {
    if (!activityDraft.name.trim()) {
      setFormError('Enter an activity name before adding it.');
      return;
    }
    setDetail('Activities', [...array(details.Activities), activityDraft]);
    setActivityDraft({ name: '', description: '', image: '', price: '' });
    setFormError('');
  };
  const addPackage = () => {
    if (!packageDraft.name.trim()) {
      setFormError('Enter a package name before adding it.');
      return;
    }
    setDetail('packages', [...array(details.packages), packageDraft]);
    setPackageDraft({ name: '', duration: '', price: '', offerPrice: '', description: '', includes: [], image: '' });
    setFormError('');
  };
  const addVideo = () => {
    if (!videoDraft.title.trim() || !videoDraft.url.trim()) {
      setFormError('Add a video title and source before saving the video.');
      return;
    }
    if (array(details.videos).length >= 10) return;
    setDetail('videos', [...array(details.videos), videoDraft]);
    setVideoDraft({ title: '', thumbnail: '', url: '' });
    setFormError('');
  };
  const addGallery = async (event) => {
    const remaining = 10 - (uploadedFiles.galleryImages || []).length;
    await uploadMany(event, event.target.files, (urls) => {
      setUploadedFiles((current) => ({ ...current, galleryImages: [...(current.galleryImages || []), ...urls] }));
      setDetail('galleryCategories', [...(details.galleryCategories || []), ...urls.map(() => details.galleryUploadCategory || 'Resort')]);
    }, remaining);
  };
  const addGalleryUrl = () => {
    if (!galleryUrl.trim() || (uploadedFiles.galleryImages || []).length >= 10) return;
    setUploadedFiles((current) => ({ ...current, galleryImages: [...(current.galleryImages || []), galleryUrl.trim()] }));
    setDetail('galleryCategories', [...(details.galleryCategories || []), details.galleryUploadCategory || 'Resort']);
    setGalleryUrl('');
  };
  const reorderGallery = (index, offset) => {
    const images = [...(uploadedFiles.galleryImages || [])];
    const target = index + offset;
    if (target < 0 || target >= images.length) return;
    [images[index], images[target]] = [images[target], images[index]];
    const categories = [...(details.galleryCategories || [])];
    [categories[index], categories[target]] = [categories[target], categories[index]];
    setUploadedFiles((current) => ({ ...current, galleryImages: images }));
    setDetail('galleryCategories', categories);
  };

  return <div className="col-span-2 space-y-4">
    <div className="rounded-xl bg-[#173c3a] px-5 py-6 text-white sm:px-7"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#f3d28a]">G-Pages resort studio</p><h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Create Resort Business Profile</h1><p className="mt-2 text-sm text-white/75">Add your resort details, accommodation, facilities, activities and guest experiences.</p></div>

    <Section number="01 · Resort profile" title="Resort information">
      <Field label="Resort Name *"><input required value={form.name} onChange={updateForm('name')} className={inputClass} /></Field>
      <Field label="Resort Type"><select value={details.resortType || ''} onChange={(event) => setDetail('resortType', event.target.value)} className={inputClass}><option value="">Choose resort type</option>{resortTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Star Rating"><select value={details.starRating || ''} onChange={(event) => setDetail('starRating', event.target.value)} className={inputClass}><option value="">Not rated</option>{[1, 2, 3, 4, 5].map((star) => <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>)}</select></Field>
      <Field label="Tagline"><input value={form.tagline || ''} onChange={updateForm('tagline')} className={inputClass} /></Field>
      <Field label="Established Year"><input type="number" min="1800" max="2100" value={form.establishedYear || ''} onChange={updateForm('establishedYear')} className={inputClass} /></Field>
      <Field label="Description *" className="sm:col-span-2"><textarea required rows={4} value={form.description} onChange={updateForm('description')} className={inputClass} /></Field>
      {imageInput('Resort logo', uploadedFiles.logo, (value) => setUploadedFiles((current) => ({ ...current, logo: value })))}
    </Section>

    <Section number="02 · Contact" title="Contact details">
      <Field label="Phone *"><input required type="tel" value={form.phone} onChange={updateForm('phone')} className={inputClass} /></Field>
      <Field label="WhatsApp"><input type="tel" value={form.whatsapp || ''} onChange={updateForm('whatsapp')} className={inputClass} /></Field>
      <Field label="Email *"><input required type="email" value={form.email} onChange={updateForm('email')} className={inputClass} /></Field>
      <Field label="Website"><input type="url" value={form.website || ''} onChange={updateForm('website')} placeholder="https://" className={inputClass} /></Field>
      <Field label="Booking Phone"><input type="tel" value={details.booking?.phone || ''} onChange={(event) => setNested('booking', 'phone', event.target.value)} className={inputClass} /></Field>
      <Field label="Booking Email"><input type="email" value={details.booking?.email || ''} onChange={(event) => setNested('booking', 'email', event.target.value)} className={inputClass} /></Field>
    </Section>

    <Section number="03 · Find us" title="Location">
      <LocationCascadeFields value={location} onChange={setLocation} />
      <Field label="Address *" className="sm:col-span-2"><input required value={form.address} onChange={updateForm('address')} placeholder="Property address" className={inputClass} /></Field>
      <Field label="Country"><input value={details.country || 'India'} onChange={(event) => setDetail('country', event.target.value)} className={inputClass} /></Field>
      <Field label="Pincode"><input inputMode="numeric" value={form.pincode || ''} onChange={updateForm('pincode')} className={inputClass} /></Field>
      <Field label="Map latitude"><input type="number" step="any" value={details.coordinates?.lat || ''} onChange={(event) => setNested('coordinates', 'lat', event.target.value)} className={inputClass} /></Field>
      <Field label="Map longitude"><input type="number" step="any" value={details.coordinates?.lng || ''} onChange={(event) => setNested('coordinates', 'lng', event.target.value)} className={inputClass} /></Field>
      <div className="col-span-2 flex flex-wrap items-center gap-2"><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.address || `${location.city || ''} ${location.state || ''}`)}`} className="rounded-md border border-[#cbded2] px-3 py-2 text-xs font-semibold text-[#17685d]">Select on map</a><span className="text-xs text-[#668079]">You can enter the address manually above.</span></div>
    </Section>

    <Section number="04 · Resort timings" title="Reception and dining">
      <label className="col-span-2 flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={Boolean(details.reception247)} onChange={(event) => setDetail('reception247', event.target.checked)} className="accent-[#16806f]" />24/7 Reception</label>
      <Field label="Check-in Time"><input type="time" value={details.checkInTime || ''} onChange={(event) => setDetail('checkInTime', event.target.value)} className={inputClass} /></Field>
      <Field label="Check-out Time"><input type="time" value={details.checkOutTime || ''} onChange={(event) => setDetail('checkOutTime', event.target.value)} className={inputClass} /></Field>
      <Field label="Restaurant Opening Time"><input type="time" value={details.restaurantOpen || ''} onChange={(event) => setDetail('restaurantOpen', event.target.value)} className={inputClass} /></Field>
      <Field label="Restaurant Closing Time"><input type="time" value={details.restaurantClose || ''} onChange={(event) => setDetail('restaurantClose', event.target.value)} className={inputClass} /></Field>
    </Section>

    <Section number="05 · Stay" title="Accommodation">
      <Field label="Accommodation Name *"><input value={stayDraft.name} onChange={(event) => setStayDraft({ ...stayDraft, name: event.target.value })} className={inputClass} /></Field>
      <Field label="Type"><select value={stayDraft.type} onChange={(event) => setStayDraft({ ...stayDraft, type: event.target.value })} className={inputClass}><option value="">Choose type</option>{accommodationTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Description" className="sm:col-span-2"><textarea rows={3} value={stayDraft.description} onChange={(event) => setStayDraft({ ...stayDraft, description: event.target.value })} className={inputClass} /></Field>
      <Field label={`Images (${stayDraft.images.length}/5)`} className="sm:col-span-2"><input type="file" accept="image/*" multiple onChange={(event) => uploadMany(event, event.target.files, (urls) => setStayDraft((current) => ({ ...current, images: [...current.images, ...urls].slice(0, 5) })), 5 - stayDraft.images.length)} className={inputClass} />{stayDraft.images.length > 0 && <div className="mt-2 flex gap-2 overflow-x-auto">{stayDraft.images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`Accommodation preview ${index + 1}`} className="h-16 w-20 shrink-0 rounded object-cover" />)}</div>}</Field>
      <Field label="Maximum Guests"><input type="number" min="1" value={stayDraft.guests} onChange={(event) => setStayDraft({ ...stayDraft, guests: event.target.value })} className={inputClass} /></Field>
      <Field label="Beds"><input type="number" min="1" value={stayDraft.beds} onChange={(event) => setStayDraft({ ...stayDraft, beds: event.target.value })} className={inputClass} /></Field>
      <Field label="Room Size"><input value={stayDraft.size} onChange={(event) => setStayDraft({ ...stayDraft, size: event.target.value })} placeholder="m² or sq ft" className={inputClass} /></Field>
      <Field label="Price Per Night"><input type="number" min="0" value={stayDraft.price} onChange={(event) => setStayDraft({ ...stayDraft, price: event.target.value })} className={inputClass} /></Field>
      <Field label="Offer Price"><input type="number" min="0" value={stayDraft.offerPrice} onChange={(event) => setStayDraft({ ...stayDraft, offerPrice: event.target.value })} className={inputClass} /></Field>
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Amenities</legend><div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{roomAmenities.map((item) => <label key={item} className="flex items-center gap-2 rounded border border-[#dbe8df] px-2 py-2 text-xs"><input type="checkbox" checked={stayDraft.amenities.includes(item)} onChange={() => setStayDraft((current) => ({ ...current, amenities: current.amenities.includes(item) ? current.amenities.filter((value) => value !== item) : [...current.amenities, item] }))} className="accent-[#16806f]" />{item}</label>)}</div></fieldset>
      <div className="col-span-2"><button type="button" onClick={addStay} className="rounded-md border border-[#16806f] px-4 py-2 text-xs font-bold text-[#17685d]">Add Another Accommodation</button>{array(details.Rooms).map((stay, index) => <div key={`${stay.name}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#eff6f0] px-3 py-2 text-sm"><span>{stay.name} · {stay.type || 'Stay'}</span><button type="button" onClick={() => setDetail('Rooms', details.Rooms.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700">Remove</button></div>)}</div>
    </Section>

    <Section number="06 · Resort features" title="Resort facilities"><fieldset className="col-span-2"><legend className="sr-only">Resort facilities</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{facilities.map((item) => <label key={item} className="flex items-center gap-2 rounded border border-[#dbe8df] px-3 py-2 text-xs"><input type="checkbox" checked={array(details.Facilities).includes(item)} onChange={() => toggle('Facilities', item)} className="accent-[#16806f]" />{item}</label>)}</div></fieldset></Section>

    <Section number="07 · Make memories" title="Experiences and activities">
      <Field label="Activity Name"><input value={activityDraft.name} onChange={(event) => setActivityDraft({ ...activityDraft, name: event.target.value })} className={inputClass} /></Field>
      <Field label="Price if applicable"><input value={activityDraft.price} onChange={(event) => setActivityDraft({ ...activityDraft, price: event.target.value })} className={inputClass} /></Field>
      <Field label="Description" className="sm:col-span-2"><textarea rows={2} value={activityDraft.description} onChange={(event) => setActivityDraft({ ...activityDraft, description: event.target.value })} className={inputClass} /></Field>
      {imageInput('Activity image', activityDraft.image, (value) => setActivityDraft((current) => ({ ...current, image: value })))}
      <div className="col-span-2 flex flex-wrap gap-2">{activities.map((item) => <button type="button" key={item} onClick={() => setActivityDraft((current) => ({ ...current, name: item }))} className="rounded-full border border-[#dbe8df] px-3 py-1.5 text-[10px] font-semibold text-[#52716a]">{item}</button>)}<button type="button" onClick={addActivity} className="rounded-md bg-[#16806f] px-4 py-2 text-xs font-bold text-white">Add Activity</button></div>
      <div className="col-span-2">{array(details.Activities).map((item, index) => <div key={`${item.name}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#eff6f0] px-3 py-2 text-sm"><span>{item.name}</span><button type="button" onClick={() => setDetail('Activities', details.Activities.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700">Remove</button></div>)}</div>
    </Section>

    <Section number="08 · Dining" title="Restaurant and dining">
      <Field label="Restaurant Available"><select value={details.restaurantAvailable || ''} onChange={(event) => setDetail('restaurantAvailable', event.target.value)} className={inputClass}><option value="">Choose</option><option>Yes</option><option>No</option></select></Field>
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Cuisine Types</legend><div className="mt-2 flex flex-wrap gap-3">{cuisines.map((item) => <label key={item} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={array(details.cuisineTypes).includes(item)} onChange={() => toggle('cuisineTypes', item)} className="accent-[#16806f]" />{item}</label>)}</div></fieldset>
      <Field label="Custom Cuisine"><input value={details.customCuisine || ''} onChange={(event) => setDetail('customCuisine', event.target.value)} className={inputClass} /></Field>
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Dining Options</legend><div className="mt-2 flex flex-wrap gap-3">{diningOptions.map((item) => <label key={item} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={array(details.diningOptions).includes(item)} onChange={() => toggle('diningOptions', item)} className="accent-[#16806f]" />{item}</label>)}</div></fieldset>
    </Section>

    <Section number="09 · Scenic arrival" title="Hero images">
      {imageInput('Hero banner', uploadedFiles.coverImage, (value) => setUploadedFiles((current) => ({ ...current, coverImage: value })))}
      {imageInput('About image', uploadedFiles.aboutImage, (value) => setUploadedFiles((current) => ({ ...current, aboutImage: value })))}
      {imageInput('Resort exterior', details.resortExteriorImage, (value) => setDetail('resortExteriorImage', value))}
    </Section>

    <Section number="10 · Resort memories" title="Gallery · maximum 10 photos">
      <div className="col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-4">{(uploadedFiles.galleryImages || []).map((image, index) => <div key={`${image}-${index}`} className="overflow-hidden rounded-md border border-[#dbe8df]"><img src={image} alt={`Resort gallery ${index + 1}`} className="aspect-square w-full object-cover" /><select aria-label={`Gallery category ${index + 1}`} value={details.galleryCategories?.[index] || 'Resort'} onChange={(event) => setDetail('galleryCategories', (uploadedFiles.galleryImages || []).map((_, itemIndex) => itemIndex === index ? event.target.value : details.galleryCategories?.[itemIndex] || 'Resort'))} className="w-full border-y border-[#dbe8df] px-2 py-1.5 text-[10px]">{galleryCategories.map((item) => <option key={item}>{item}</option>)}</select><div className="flex justify-between px-2 py-2"><button type="button" onClick={() => reorderGallery(index, -1)} aria-label="Move photo earlier" className="text-xs">←</button><button type="button" onClick={() => { setUploadedFiles((current) => ({ ...current, galleryImages: current.galleryImages.filter((_, itemIndex) => itemIndex !== index) })); setDetail('galleryCategories', (details.galleryCategories || []).filter((_, itemIndex) => itemIndex !== index)); }} className="text-xs font-semibold text-red-700">Delete</button><button type="button" onClick={() => reorderGallery(index, 1)} aria-label="Move photo later" className="text-xs">→</button></div></div>)}{(uploadedFiles.galleryImages || []).length < 10 && <label className="grid aspect-square cursor-pointer place-items-center rounded-md border border-dashed border-[#a9c0af] text-center text-xs text-[#52716a]">Upload photos<input type="file" accept="image/*" multiple className="hidden" onChange={(event) => addGallery(event)} /></label>}</div>
      <Field label="Image URL"><input type="url" value={galleryUrl} onChange={(event) => setGalleryUrl(event.target.value)} placeholder="https://" className={inputClass} /></Field>
      <Field label="URL Image Category"><select value={details.galleryUploadCategory || 'Resort'} onChange={(event) => setDetail('galleryUploadCategory', event.target.value)} className={inputClass}>{galleryCategories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></Field>
      <button type="button" onClick={addGalleryUrl} className="mt-1 self-start rounded-md border border-[#16806f] px-3 py-2 text-xs font-bold text-[#17685d]">Add Image URL</button>
    </Section>

    <Section number="11 · Resort films" title="Videos · maximum 10">
      <Field label="Video Title"><input value={videoDraft.title} onChange={(event) => setVideoDraft({ ...videoDraft, title: event.target.value })} placeholder="Resort Tour" className={inputClass} /></Field>
      {imageInput('Video thumbnail', videoDraft.thumbnail, (value) => setVideoDraft((current) => ({ ...current, thumbnail: value })))}
      <Field label="Video URL (YouTube, Vimeo or direct)"><input type="url" value={videoDraft.url} onChange={(event) => setVideoDraft({ ...videoDraft, url: event.target.value })} className={inputClass} /></Field>
      <Field label="Or upload video"><input type="file" accept="video/*" onChange={(event) => uploadOne(event, (url) => setVideoDraft((current) => ({ ...current, url })), 'videos')} className={inputClass} /></Field>
      <div className="col-span-2"><button type="button" disabled={array(details.videos).length >= 10} onClick={addVideo} className="rounded-md border border-[#16806f] px-4 py-2 text-xs font-bold text-[#17685d] disabled:opacity-50">Add Video</button>{array(details.videos).map((item, index) => <div key={`${item.url}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#eff6f0] px-3 py-2 text-sm"><span>{item.title}</span><button type="button" onClick={() => setDetail('videos', details.videos.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700">Remove</button></div>)}</div>
    </Section>

    <Section number="12 · Curated stays" title="Resort packages">
      <Field label="Package Name"><input value={packageDraft.name} onChange={(event) => setPackageDraft({ ...packageDraft, name: event.target.value })} className={inputClass} /></Field>
      <Field label="Duration"><input value={packageDraft.duration} onChange={(event) => setPackageDraft({ ...packageDraft, duration: event.target.value })} placeholder="3 nights / 4 days" className={inputClass} /></Field>
      <Field label="Price"><input type="number" min="0" value={packageDraft.price} onChange={(event) => setPackageDraft({ ...packageDraft, price: event.target.value })} className={inputClass} /></Field>
      <Field label="Offer Price"><input type="number" min="0" value={packageDraft.offerPrice} onChange={(event) => setPackageDraft({ ...packageDraft, offerPrice: event.target.value })} className={inputClass} /></Field>
      <Field label="Description" className="sm:col-span-2"><textarea rows={2} value={packageDraft.description} onChange={(event) => setPackageDraft({ ...packageDraft, description: event.target.value })} className={inputClass} /></Field>
      {imageInput('Package image', packageDraft.image, (value) => setPackageDraft((current) => ({ ...current, image: value })))}
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Package Includes</legend><div className="mt-2 flex flex-wrap gap-3">{['Accommodation', 'Breakfast', 'Lunch', 'Dinner', 'Activities', 'Pool', 'Spa', 'Transport', 'Sightseeing'].map((item) => <label key={item} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={packageDraft.includes.includes(item)} onChange={() => setPackageDraft((current) => ({ ...current, includes: current.includes.includes(item) ? current.includes.filter((value) => value !== item) : [...current.includes, item] }))} className="accent-[#16806f]" />{item}</label>)}</div></fieldset>
      <div className="col-span-2"><button type="button" onClick={addPackage} className="rounded-md border border-[#16806f] px-4 py-2 text-xs font-bold text-[#17685d]">Add Another Package</button>{array(details.packages).map((item, index) => <div key={`${item.name}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#eff6f0] px-3 py-2 text-sm"><span>{item.name}</span><button type="button" onClick={() => setDetail('packages', details.packages.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700">Remove</button></div>)}</div>
    </Section>

    <Section number="13 · Booking" title="Booking options">
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Booking methods</legend><div className="mt-2 flex flex-wrap gap-3">{bookingMethods.map((item) => <label key={item} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={array(details.bookingMethods).includes(item)} onChange={() => toggle('bookingMethods', item)} className="accent-[#16806f]" />{item}</label>)}</div></fieldset>
      <Field label="Booking URL"><input type="url" value={details.booking?.url || ''} onChange={(event) => setNested('booking', 'url', event.target.value)} placeholder="https://" className={inputClass} /></Field>
      <Field label="Booking Phone"><input type="tel" value={details.booking?.phone || ''} onChange={(event) => setNested('booking', 'phone', event.target.value)} className={inputClass} /></Field>
      <Field label="Booking Email"><input type="email" value={details.booking?.email || ''} onChange={(event) => setNested('booking', 'email', event.target.value)} className={inputClass} /></Field>
    </Section>

    <Section number="14 · Social" title="Social media">{socials.map(([key, label]) => <Field key={key} label={label}><input type="url" value={details.socialLinks?.[key] || ''} onChange={(event) => setNested('socialLinks', key, event.target.value)} placeholder="https://" className={inputClass} /></Field>)}</Section>
    <Section number="15 · Guest feedback" title="Customer reviews"><label className="col-span-2 flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={details.enableReviews !== false} onChange={(event) => setDetail('enableReviews', event.target.checked)} className="h-4 w-4 accent-[#16806f]" />Enable Customer Reviews</label></Section>
    <Section number="16 · Search visibility" title="SEO"><Field label="SEO Title"><input value={details.seoTitle || ''} onChange={(event) => setDetail('seoTitle', event.target.value)} className={inputClass} /></Field><Field label="SEO Keywords"><input value={details.seoKeywords || ''} onChange={(event) => setDetail('seoKeywords', event.target.value)} className={inputClass} /></Field><Field label="SEO Description" className="sm:col-span-2"><textarea rows={3} value={details.seoDescription || ''} onChange={(event) => setDetail('seoDescription', event.target.value)} className={inputClass} /></Field></Section>

    {(error || success || mediaError || formError) && <p role={error || mediaError || formError ? 'alert' : 'status'} className={`col-span-2 text-sm ${error || mediaError || formError ? 'text-red-700' : 'text-emerald-700'}`}>{error || mediaError || formError || success}</p>}
    <div className="col-span-2 flex flex-wrap justify-end gap-3 rounded-xl border border-[#dbe8df] bg-white p-4"><button type="button" onClick={onSaveDraft} className="rounded-md border border-[#cbded2] px-4 py-2.5 text-sm font-semibold text-[#52716a]">Save Draft</button><button type="button" onClick={() => setPreviewOpen(true)} className="rounded-md border border-[#16806f] px-4 py-2.5 text-sm font-semibold text-[#17685d]">Preview Website</button><button type="submit" disabled={submitting} className="rounded-md bg-[#16806f] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{submitting ? 'Submitting…' : isEditing ? 'Publish Changes' : 'Publish'}</button></div>
    {previewOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#173c3a]/75 p-4" onClick={() => setPreviewOpen(false)}><div role="dialog" aria-modal="true" aria-label="Resort website preview" className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-6" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#16806f]">Resort preview</p><h2 className="mt-2 font-display text-3xl font-bold text-[#173c3a]">{form.name || 'Your resort'}</h2><p className="mt-1 text-sm text-[#668079]">{form.tagline || 'Relax. Refresh. Reconnect.'}</p></div><button type="button" aria-label="Close preview" onClick={() => setPreviewOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border">×</button></div>{uploadedFiles.coverImage && <img src={uploadedFiles.coverImage} alt="Resort banner preview" className="mt-5 h-56 w-full rounded-lg object-cover" />}<p className="mt-4 text-sm leading-6 text-[#52716a]">{form.description || 'Resort description'}</p><h3 className="mt-5 font-bold">Accommodation</h3><div className="mt-2 grid gap-2 sm:grid-cols-2">{details.Rooms?.map((stay, index) => <div key={`${stay.name}-${index}`} className="rounded-md bg-[#eff6f0] p-3 text-sm">{stay.name} · {stay.price ? `${stay.price} per night` : 'Contact for rates'}</div>)}</div><button type="button" onClick={() => setPreviewOpen(false)} className="mt-6 rounded-md bg-[#16806f] px-4 py-2 text-sm font-bold text-white">Close preview</button></div></div>}
  </div>;
}

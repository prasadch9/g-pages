import React, { useState } from 'react';
import api from '../../../services/api';
import LocationCascadeFields from '../../../components/LocationCascadeFields';
import mediaUrl from '../../../utils/mediaUrl';

const businessTypes = ['Party Zone', 'Entertainment Venue', 'Birthday Party Venue', 'Event Venue', 'Kids Party Zone', 'Indoor Entertainment Center', 'Gaming Zone', 'Celebration Venue', 'Other'];
const partyServices = ['Birthday Parties', 'DJ Nights', 'Private Parties', 'Corporate Events', 'Kids Parties', 'Anniversary Celebrations', 'Theme Parties', 'Engagement Events', 'Baby Showers', 'Family Events', 'Special Events', 'Custom Events'];
const inclusions = ['Venue', 'Decoration', 'DJ', 'Music System', 'Lighting', 'Dance Floor', 'Catering', 'Birthday Cake', 'Photography', 'Videography', 'Games', 'Host / Anchor', 'Parking', 'Security'];
const venueFacilities = ['Dance Floor', 'DJ & Sound System', 'Stage', 'LED Screen', 'Party Lighting', 'Seating Area', 'AC', 'Catering Area', 'Parking', 'Security', 'Kids Play Area', 'Gaming Area', 'Restrooms', 'Power Backup'];
const venueTypes = ['Main Hall', 'Party Hall', 'Outdoor Area', 'Rooftop', 'VIP Area', 'Kids Zone', 'Gaming Zone', 'Custom'];
const galleryCategories = ['Venue', 'Parties', 'Birthdays', 'DJ Nights', 'Decorations', 'Events', 'Corporate', 'Kids Events'];
const packageTypes = ['Basic', 'Standard', 'Premium', 'VIP', 'Birthday', 'Corporate', 'Kids', 'Custom'];
const bookingMethods = ['Phone', 'WhatsApp', 'Website', 'Direct Booking', 'External Booking URL'];
const cateringOptions = ['Vegetarian', 'Non-Vegetarian', 'Snacks', 'Buffet', 'Beverages', 'Birthday Cake', 'Custom Menu'];
const decorations = ['Birthday Decoration', 'Balloon Decoration', 'Theme Decoration', 'Stage Decoration', 'Table Decoration', 'Floral Decoration', 'Custom Decoration'];
const socialFields = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['linkedin', 'LinkedIn'], ['pinterest', 'Pinterest'], ['whatsapp', 'WhatsApp']];
const weekDays = [['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'], ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday']];
const inputClass = 'mt-1 w-full rounded-md border border-[#e8dce9] bg-white px-3 py-2.5 text-sm text-[#30213a] outline-none focus:border-[#d72683] focus:ring-2 focus:ring-[#d72683]/15';
const array = (value) => Array.isArray(value) ? value : [];
const Section = ({ number, title, children }) => <section className="col-span-2 rounded-xl border border-[#eadfea] bg-white p-5 shadow-sm sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#d72683]">{number}</p><h2 className="mt-1 font-display text-xl font-bold text-[#281833]">{title}</h2><div className="mt-5 grid grid-cols-2 gap-4">{children}</div></section>;
const Field = ({ label, children, className = '' }) => <label className={`col-span-2 block text-sm font-medium text-[#695b70] sm:col-span-1 ${className}`}>{label}{children}</label>;

export default function PartyZonesListingFields({ form, setForm, location, setLocation, details, setDetails, workingHours, setWorkingHours, uploadedFiles, setUploadedFiles, onSaveDraft, submitting, isEditing, error, success }) {
  const [packageDraft, setPackageDraft] = useState({ name: '', type: '', description: '', guests: '', duration: '', price: '', offerPrice: '', image: '', includes: [] });
  const [spaceDraft, setSpaceDraft] = useState({ name: '', type: '', capacity: '', area: '', description: '', image: '' });
  const [galleryUrl, setGalleryUrl] = useState('');
  const [customService, setCustomService] = useState('');
  const [customInclusion, setCustomInclusion] = useState('');
  const [customDecoration, setCustomDecoration] = useState('');
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
    const { data } = await api.post(kind === 'videos' ? '/uploads/videos' : '/uploads/images', body, { headers: { 'Content-Type': 'multipart/form-data' } });
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
  const uploadMany = async (event, max, done) => {
    const files = Array.from(event.target.files || []).slice(0, Math.max(0, max));
    event.target.value = '';
    if (!files.length) return;
    try {
      setMediaError('');
      done(await Promise.all(files.map((file) => upload(file))));
    } catch (uploadError) {
      setMediaError(uploadError.response?.data?.message || 'Image upload failed. Please try again.');
    }
  };
  const imageInput = (label, value, onChange) => <Field label={`${label} URL or upload`}><div className="flex gap-2"><input type="url" value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="https://" className={inputClass} /><label className="mt-1 shrink-0 cursor-pointer rounded-md border border-[#eadfea] px-3 py-2.5 text-xs font-semibold text-[#d72683]">Upload<input type="file" accept="image/*" className="hidden" onChange={(event) => uploadOne(event, onChange)} /></label></div>{value && <img src={value} alt={`${label} preview`} className="mt-2 h-24 w-full rounded-md object-cover" />}</Field>;
  const toggle = (key, value) => {
    const current = array(details[key]);
    setDetail(key, current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]);
  };
  const toggleCurrent = (setter, field, value) => setter((current) => ({ ...current, [field]: current[field].includes(value) ? current[field].filter((entry) => entry !== value) : [...current[field], value] }));
  const addPackage = () => {
    if (!packageDraft.name.trim()) {
      setFormError('Package Name is required.');
      return;
    }
    setDetail('Packages', [...array(details.Packages), packageDraft]);
    setPackageDraft({ name: '', type: '', description: '', guests: '', duration: '', price: '', offerPrice: '', image: '', includes: [] });
    setFormError('');
  };
  const addSpace = () => {
    if (!spaceDraft.name.trim()) {
      setFormError('Enter a venue name before adding a space.');
      return;
    }
    setDetail('Spaces', [...array(details.Spaces), spaceDraft]);
    setSpaceDraft({ name: '', type: '', capacity: '', area: '', description: '', image: '' });
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
  const addGalleryFiles = async (event) => {
    const remaining = 10 - (uploadedFiles.galleryImages || []).length;
    await uploadMany(event, remaining, (urls) => {
      setUploadedFiles((current) => ({ ...current, galleryImages: [...(current.galleryImages || []), ...urls] }));
      setDetail('galleryCategories', [...(details.galleryCategories || []), ...urls.map(() => details.galleryUploadCategory || 'Venue')]);
    });
  };
  const addGalleryUrl = () => {
    if (!galleryUrl.trim() || (uploadedFiles.galleryImages || []).length >= 10) return;
    setUploadedFiles((current) => ({ ...current, galleryImages: [...(current.galleryImages || []), galleryUrl.trim()] }));
    setDetail('galleryCategories', [...(details.galleryCategories || []), details.galleryUploadCategory || 'Venue']);
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
  const setHours = (day, changes) => {
    const current = workingHours.find((entry) => entry.day === day) || { day, open: '', close: '', closed: false };
    setWorkingHours((items) => [...items.filter((entry) => entry.day !== day), { ...current, ...changes }]);
  };

  return <div className="col-span-2 space-y-4">
    <div className="rounded-xl bg-[#25152f] px-5 py-6 text-white sm:px-7"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#f2c758]">G-Pages celebration studio</p><h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Create Party Zone Business Profile</h1><p className="mt-2 text-sm text-white/75">Add your venue details, party packages, facilities, events and booking information.</p></div>

    <Section number="01 · Venue profile" title="Business information">
      <Field label="Business Name *"><input required value={form.name} onChange={updateForm('name')} className={inputClass} /></Field>
      <Field label="Business Type"><select value={details.businessType || ''} onChange={(event) => setDetail('businessType', event.target.value)} className={inputClass}><option value="">Choose business type</option>{businessTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Tagline"><input value={form.tagline || ''} onChange={updateForm('tagline')} className={inputClass} /></Field>
      <Field label="Established Year"><input type="number" min="1800" max="2100" value={form.establishedYear || ''} onChange={updateForm('establishedYear')} className={inputClass} /></Field>
      <Field label="Description *" className="sm:col-span-2"><textarea required rows={4} value={form.description} onChange={updateForm('description')} className={inputClass} /></Field>
      {imageInput('Business logo', uploadedFiles.logo, (value) => setUploadedFiles((current) => ({ ...current, logo: value })))}
    </Section>

    <Section number="02 · Contact" title="Contact details">
      <Field label="Phone *"><input required type="tel" value={form.phone} onChange={updateForm('phone')} className={inputClass} /></Field>
      <Field label="WhatsApp"><input type="tel" value={form.whatsapp || ''} onChange={updateForm('whatsapp')} className={inputClass} /></Field>
      <Field label="Email *"><input required type="email" value={form.email} onChange={updateForm('email')} className={inputClass} /></Field>
      <Field label="Website"><input type="url" value={form.website || ''} onChange={updateForm('website')} placeholder="https://" className={inputClass} /></Field>
      <Field label="Booking Phone"><input type="tel" value={details.booking?.phone || ''} onChange={(event) => setNested('booking', 'phone', event.target.value)} className={inputClass} /></Field>
      <Field label="Booking Email"><input type="email" value={details.booking?.email || ''} onChange={(event) => setNested('booking', 'email', event.target.value)} className={inputClass} /></Field>
    </Section>

    <Section number="03 · Find the venue" title="Location">
      <LocationCascadeFields value={location} onChange={setLocation} />
      <Field label="Address *" className="sm:col-span-2"><input required value={form.address} onChange={updateForm('address')} placeholder="Venue address" className={inputClass} /></Field>
      <Field label="Country"><input value={details.country || 'India'} onChange={(event) => setDetail('country', event.target.value)} className={inputClass} /></Field>
      <Field label="Pincode"><input inputMode="numeric" value={form.pincode || ''} onChange={updateForm('pincode')} className={inputClass} /></Field>
      <Field label="Map latitude"><input type="number" step="any" value={details.coordinates?.lat || ''} onChange={(event) => setNested('coordinates', 'lat', event.target.value)} className={inputClass} /></Field>
      <Field label="Map longitude"><input type="number" step="any" value={details.coordinates?.lng || ''} onChange={(event) => setNested('coordinates', 'lng', event.target.value)} className={inputClass} /></Field>
      <div className="col-span-2 flex flex-wrap items-center gap-2"><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.address || `${location.city || ''} ${location.state || ''}`)}`} className="rounded-md border border-[#eadfea] px-3 py-2 text-xs font-semibold text-[#94356f]">Select location on map</a><span className="text-xs text-[#75677b]">You can enter the address manually above.</span></div>
    </Section>

    <Section number="04 · Opening times" title="Working hours">
      <label className="col-span-2 flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={Boolean(details.open247)} onChange={(event) => setDetail('open247', event.target.checked)} className="accent-[#d72683]" />Open 24/7</label>
      {!details.open247 && weekDays.map(([day, label]) => { const entry = workingHours.find((item) => item.day === day) || { day, open: '', close: '', closed: false }; return <div key={day} className="col-span-2 grid grid-cols-[78px_1fr_1fr_auto] items-center gap-2 sm:col-span-1"><span className="text-xs font-semibold">{label}</span><input type="time" aria-label={`${label} opening time`} value={entry.open || ''} disabled={entry.closed} onChange={(event) => setHours(day, { open: event.target.value })} className="min-w-0 rounded border border-[#e8dce9] px-2 py-2 text-xs disabled:bg-slate-100" /><input type="time" aria-label={`${label} closing time`} value={entry.close || ''} disabled={entry.closed} onChange={(event) => setHours(day, { close: event.target.value })} className="min-w-0 rounded border border-[#e8dce9] px-2 py-2 text-xs disabled:bg-slate-100" /><label className="flex items-center gap-1 text-[10px]"><input type="checkbox" checked={Boolean(entry.closed)} onChange={(event) => setHours(day, { closed: event.target.checked })} />Closed</label></div>; })}
    </Section>

    <Section number="05 · Party offerings" title="Party services">
      <fieldset className="col-span-2"><legend className="sr-only">Party services</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{partyServices.map((item) => <label key={item} className="flex items-center gap-2 rounded border border-[#eadfea] px-3 py-2 text-xs"><input type="checkbox" checked={array(details['Party Services']).includes(item)} onChange={() => toggle('Party Services', item)} className="accent-[#d72683]" />{item}</label>)}</div></fieldset>
      <Field label="Custom Service"><input value={customService} onChange={(event) => setCustomService(event.target.value)} className={inputClass} /></Field>
      <button type="button" onClick={() => { if (customService.trim()) { setDetail('Party Services', [...array(details['Party Services']), customService.trim()]); setCustomService(''); } }} className="mt-1 self-start rounded-md bg-[#d72683] px-3 py-2 text-xs font-bold text-white">Add Custom Service</button>
    </Section>

    <Section number="06 · Packages" title="Party packages">
      <Field label="Package Name *"><input value={packageDraft.name} onChange={(event) => setPackageDraft({ ...packageDraft, name: event.target.value })} className={inputClass} /></Field>
      <Field label="Package Type"><select value={packageDraft.type} onChange={(event) => setPackageDraft({ ...packageDraft, type: event.target.value })} className={inputClass}><option value="">Choose type</option>{packageTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Package Description" className="sm:col-span-2"><textarea rows={2} value={packageDraft.description} onChange={(event) => setPackageDraft({ ...packageDraft, description: event.target.value })} className={inputClass} /></Field>
      <Field label="Number of Guests"><input type="number" min="1" value={packageDraft.guests} onChange={(event) => setPackageDraft({ ...packageDraft, guests: event.target.value })} className={inputClass} /></Field>
      <Field label="Duration"><input value={packageDraft.duration} onChange={(event) => setPackageDraft({ ...packageDraft, duration: event.target.value })} placeholder="4 hours" className={inputClass} /></Field>
      <Field label="Price"><input type="number" min="0" value={packageDraft.price} onChange={(event) => setPackageDraft({ ...packageDraft, price: event.target.value })} className={inputClass} /></Field>
      <Field label="Offer Price"><input type="number" min="0" value={packageDraft.offerPrice} onChange={(event) => setPackageDraft({ ...packageDraft, offerPrice: event.target.value })} className={inputClass} /></Field>
      {imageInput('Package image', packageDraft.image, (value) => setPackageDraft((current) => ({ ...current, image: value })))}
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Package inclusions</legend><div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{inclusions.map((item) => <label key={item} className="flex items-center gap-2 rounded border border-[#eadfea] px-2 py-2 text-xs"><input type="checkbox" checked={packageDraft.includes.includes(item)} onChange={() => toggleCurrent(setPackageDraft, 'includes', item)} className="accent-[#d72683]" />{item}</label>)}</div></fieldset>
      <Field label="Custom inclusion"><input value={customInclusion} onChange={(event) => setCustomInclusion(event.target.value)} className={inputClass} /></Field>
      <button type="button" onClick={() => { if (customInclusion.trim()) { setPackageDraft((current) => ({ ...current, includes: [...current.includes, customInclusion.trim()] })); setCustomInclusion(''); } }} className="mt-1 self-start rounded-md border border-[#d72683] px-3 py-2 text-xs font-bold text-[#b6236c]">Add Custom Inclusion</button>
      <div className="col-span-2"><button type="button" onClick={addPackage} className="rounded-md border border-[#d72683] px-4 py-2 text-xs font-bold text-[#b6236c]">Add Another Package</button>{array(details.Packages).map((item, index) => <div key={`${item.name}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#fbf1f8] px-3 py-2 text-sm"><span>{item.name} · {item.type || 'Package'}</span><button type="button" onClick={() => setDetail('Packages', details.Packages.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700">Remove</button></div>)}</div>
    </Section>

    <Section number="07 · Venue features" title="Venue facilities"><fieldset className="col-span-2"><legend className="sr-only">Venue facilities</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{venueFacilities.map((item) => <label key={item} className="flex items-center gap-2 rounded border border-[#eadfea] px-3 py-2 text-xs"><input type="checkbox" checked={array(details.Facilities).includes(item)} onChange={() => toggle('Facilities', item)} className="accent-[#d72683]" />{item}</label>)}</div></fieldset></Section>

    <Section number="08 · Spaces" title="Venue and event spaces">
      <Field label="Venue Name"><input value={spaceDraft.name} onChange={(event) => setSpaceDraft({ ...spaceDraft, name: event.target.value })} className={inputClass} /></Field>
      <Field label="Venue Type"><select value={spaceDraft.type} onChange={(event) => setSpaceDraft({ ...spaceDraft, type: event.target.value })} className={inputClass}><option value="">Choose type</option>{venueTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Capacity"><input type="number" min="1" value={spaceDraft.capacity} onChange={(event) => setSpaceDraft({ ...spaceDraft, capacity: event.target.value })} className={inputClass} /></Field>
      <Field label="Area / Size"><input value={spaceDraft.area} onChange={(event) => setSpaceDraft({ ...spaceDraft, area: event.target.value })} className={inputClass} /></Field>
      <Field label="Description" className="sm:col-span-2"><textarea rows={2} value={spaceDraft.description} onChange={(event) => setSpaceDraft({ ...spaceDraft, description: event.target.value })} className={inputClass} /></Field>
      {imageInput('Venue image', spaceDraft.image, (value) => setSpaceDraft((current) => ({ ...current, image: value })))}
      <div className="col-span-2"><button type="button" onClick={addSpace} className="rounded-md border border-[#d72683] px-4 py-2 text-xs font-bold text-[#b6236c]">Add Venue Space</button>{array(details.Spaces).map((item, index) => <div key={`${item.name}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#fbf1f8] px-3 py-2 text-sm"><span>{item.name} · {item.type || 'Space'}</span><button type="button" onClick={() => setDetail('Spaces', details.Spaces.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700">Remove</button></div>)}</div>
    </Section>

    <Section number="09 · First impression" title="Hero images">
      {imageInput('Hero banner', uploadedFiles.coverImage, (value) => setUploadedFiles((current) => ({ ...current, coverImage: value })))}
      {imageInput('About image', uploadedFiles.aboutImage, (value) => setUploadedFiles((current) => ({ ...current, aboutImage: value })))}
      {imageInput('Venue image', details.venueImage, (value) => setDetail('venueImage', value))}
    </Section>

    <Section number="10 · Event gallery" title="Gallery · maximum 10 images">
      <div className="col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-4">{(uploadedFiles.galleryImages || []).map((image, index) => <div key={`${image}-${index}`} className="overflow-hidden rounded-md border border-[#eadfea]"><img src={image} alt={`Event gallery ${index + 1}`} className="aspect-square w-full object-cover" /><select aria-label={`Gallery category ${index + 1}`} value={details.galleryCategories?.[index] || 'Venue'} onChange={(event) => setDetail('galleryCategories', (uploadedFiles.galleryImages || []).map((_, itemIndex) => itemIndex === index ? event.target.value : details.galleryCategories?.[itemIndex] || 'Venue'))} className="w-full border-y border-[#eadfea] px-2 py-1.5 text-[10px]">{galleryCategories.map((item) => <option key={item}>{item}</option>)}</select><div className="flex justify-between px-2 py-2"><button type="button" onClick={() => reorderGallery(index, -1)} aria-label="Move photo earlier" className="text-xs">←</button><button type="button" onClick={() => { setUploadedFiles((current) => ({ ...current, galleryImages: current.galleryImages.filter((_, itemIndex) => itemIndex !== index) })); setDetail('galleryCategories', (details.galleryCategories || []).filter((_, itemIndex) => itemIndex !== index)); }} className="text-xs font-semibold text-red-700">Delete</button><button type="button" onClick={() => reorderGallery(index, 1)} aria-label="Move photo later" className="text-xs">→</button></div></div>)}{(uploadedFiles.galleryImages || []).length < 10 && <label className="grid aspect-square cursor-pointer place-items-center rounded-md border border-dashed border-[#cbb4d0] text-center text-xs text-[#75677b]">Upload photos<input type="file" accept="image/*" multiple className="hidden" onChange={addGalleryFiles} /></label>}</div>
      <Field label="Image URL"><input type="url" value={galleryUrl} onChange={(event) => setGalleryUrl(event.target.value)} placeholder="https://" className={inputClass} /></Field>
      <Field label="URL Image Category"><select value={details.galleryUploadCategory || 'Venue'} onChange={(event) => setDetail('galleryUploadCategory', event.target.value)} className={inputClass}>{galleryCategories.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <button type="button" onClick={addGalleryUrl} className="mt-1 self-start rounded-md border border-[#d72683] px-3 py-2 text-xs font-bold text-[#b6236c]">Add Image URL</button>
    </Section>

    <Section number="11 · Event films" title="Videos · maximum 10">
      <Field label="Video Title"><input value={videoDraft.title} onChange={(event) => setVideoDraft({ ...videoDraft, title: event.target.value })} placeholder="Party Highlights" className={inputClass} /></Field>
      {imageInput('Video thumbnail', videoDraft.thumbnail, (value) => setVideoDraft((current) => ({ ...current, thumbnail: value })))}
      <Field label="Video URL (YouTube, Vimeo or direct)"><input type="url" value={videoDraft.url} onChange={(event) => setVideoDraft({ ...videoDraft, url: event.target.value })} className={inputClass} /></Field>
      <Field label="Or upload video"><input type="file" accept="video/*" onChange={(event) => uploadOne(event, (url) => setVideoDraft((current) => ({ ...current, url })), 'videos')} className={inputClass} /></Field>
      <div className="col-span-2"><button type="button" disabled={array(details.videos).length >= 10} onClick={addVideo} className="rounded-md border border-[#d72683] px-4 py-2 text-xs font-bold text-[#b6236c] disabled:opacity-50">Add Video</button>{array(details.videos).map((item, index) => <div key={`${item.url}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#fbf1f8] px-3 py-2 text-sm"><span>{item.title}</span><button type="button" onClick={() => setDetail('videos', details.videos.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-700">Remove</button></div>)}</div>
    </Section>

    <Section number="12 · Event reservations" title="Booking options">
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Booking methods</legend><div className="mt-2 flex flex-wrap gap-3">{bookingMethods.map((item) => <label key={item} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={array(details.bookingMethods).includes(item)} onChange={() => toggle('bookingMethods', item)} className="accent-[#d72683]" />{item}</label>)}</div></fieldset>
      <Field label="Booking URL"><input type="url" value={details.booking?.url || ''} onChange={(event) => setNested('booking', 'url', event.target.value)} placeholder="https://" className={inputClass} /></Field>
      <Field label="Booking Phone"><input type="tel" value={details.booking?.phone || ''} onChange={(event) => setNested('booking', 'phone', event.target.value)} className={inputClass} /></Field>
      <Field label="Booking Email"><input type="email" value={details.booking?.email || ''} onChange={(event) => setNested('booking', 'email', event.target.value)} className={inputClass} /></Field>
    </Section>

    <Section number="13 · Catering" title="Catering options">
      <Field label="Catering Available"><select value={details.cateringAvailable || ''} onChange={(event) => setDetail('cateringAvailable', event.target.value)} className={inputClass}><option value="">Choose</option><option>Yes</option><option>No</option></select></Field>
      <Field label="Price Per Person"><input type="number" min="0" value={details.pricePerPerson || ''} onChange={(event) => setDetail('pricePerPerson', event.target.value)} className={inputClass} /></Field>
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Catering options</legend><div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{cateringOptions.map((item) => <label key={item} className="flex items-center gap-2 rounded border border-[#eadfea] px-2 py-2 text-xs"><input type="checkbox" checked={array(details.cateringOptions).includes(item)} onChange={() => toggle('cateringOptions', item)} className="accent-[#d72683]" />{item}</label>)}</div></fieldset>
      <Field label="Menu Description" className="sm:col-span-2"><textarea rows={2} value={details.menuDescription || ''} onChange={(event) => setDetail('menuDescription', event.target.value)} className={inputClass} /></Field>
      {imageInput('Menu image', details.menuImage, (value) => setDetail('menuImage', value))}
    </Section>

    <Section number="14 · Event styling" title="Decoration services">
      <fieldset className="col-span-2"><legend className="sr-only">Decoration services</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{decorations.map((item) => <label key={item} className="flex items-center gap-2 rounded border border-[#eadfea] px-3 py-2 text-xs"><input type="checkbox" checked={array(details.decorations).includes(item)} onChange={() => toggle('decorations', item)} className="accent-[#d72683]" />{item}</label>)}</div></fieldset>
      <Field label="Custom Decoration"><input value={customDecoration} onChange={(event) => setCustomDecoration(event.target.value)} className={inputClass} /></Field>
      <button type="button" onClick={() => { if (customDecoration.trim()) { setDetail('decorations', [...array(details.decorations), customDecoration.trim()]); setCustomDecoration(''); } }} className="mt-1 self-start rounded-md border border-[#d72683] px-3 py-2 text-xs font-bold text-[#b6236c]">Add Custom Decoration</button>
    </Section>

    <Section number="15 · Social" title="Social media">{socialFields.map(([key, label]) => <Field key={key} label={label}><input type="url" value={details.socialLinks?.[key] || (key === 'whatsapp' ? form.whatsapp || '' : '')} onChange={(event) => setNested('socialLinks', key, event.target.value)} placeholder="https://" className={inputClass} /></Field>)}</Section>
    <Section number="16 · Guest feedback" title="Customer reviews"><label className="col-span-2 flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={details.enableReviews !== false} onChange={(event) => setDetail('enableReviews', event.target.checked)} className="h-4 w-4 accent-[#d72683]" />Enable Reviews</label></Section>
    <Section number="17 · Search visibility" title="SEO"><Field label="SEO Title"><input value={details.seoTitle || ''} onChange={(event) => setDetail('seoTitle', event.target.value)} className={inputClass} /></Field><Field label="SEO Keywords"><input value={details.seoKeywords || ''} onChange={(event) => setDetail('seoKeywords', event.target.value)} className={inputClass} /></Field><Field label="SEO Description" className="sm:col-span-2"><textarea rows={3} value={details.seoDescription || ''} onChange={(event) => setDetail('seoDescription', event.target.value)} className={inputClass} /></Field></Section>

    {(error || success || mediaError || formError) && <p role={error || mediaError || formError ? 'alert' : 'status'} className={`col-span-2 text-sm ${error || mediaError || formError ? 'text-red-700' : 'text-emerald-700'}`}>{error || mediaError || formError || success}</p>}
    <div className="col-span-2 flex flex-wrap justify-end gap-3 rounded-xl border border-[#eadfea] bg-white p-4"><button type="button" onClick={onSaveDraft} className="rounded-md border border-[#eadfea] px-4 py-2.5 text-sm font-semibold text-[#695b70]">Save Draft</button><button type="button" onClick={() => setPreviewOpen(true)} className="rounded-md border border-[#d72683] px-4 py-2.5 text-sm font-semibold text-[#b6236c]">Preview Website</button><button type="submit" disabled={submitting} className="rounded-md bg-[#d72683] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{submitting ? 'Submitting…' : isEditing ? 'Publish Changes' : 'Publish'}</button></div>
    {previewOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#211629]/80 p-4" onClick={() => setPreviewOpen(false)}><div role="dialog" aria-modal="true" aria-label="Party venue website preview" className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-6" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#d72683]">Venue preview</p><h2 className="mt-2 font-display text-3xl font-bold text-[#281833]">{form.name || 'Your party venue'}</h2><p className="mt-1 text-sm text-[#75677b]">{form.tagline || 'Celebrate together.'}</p></div><button type="button" aria-label="Close preview" onClick={() => setPreviewOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border">×</button></div>{uploadedFiles.coverImage && <img src={uploadedFiles.coverImage} alt="Venue banner preview" className="mt-5 h-56 w-full rounded-lg object-cover" />}<p className="mt-4 text-sm leading-6 text-[#75677b]">{form.description || 'Venue description'}</p><h3 className="mt-5 font-bold">Packages</h3><div className="mt-2 grid gap-2 sm:grid-cols-2">{details.Packages?.map((item, index) => <div key={`${item.name}-${index}`} className="rounded-md bg-[#fbf1f8] p-3 text-sm">{item.name} · {item.price ? `₹${item.price}` : 'Enquire for price'}</div>)}</div><button type="button" onClick={() => setPreviewOpen(false)} className="mt-6 rounded-md bg-[#d72683] px-4 py-2 text-sm font-bold text-white">Close preview</button></div></div>}
  </div>;
}

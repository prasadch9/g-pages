import React, { useState } from 'react';
import LocationCascadeFields from '../../../components/LocationCascadeFields';
import api from '../../../services/api';
import mediaUrl from '../../../utils/mediaUrl';

const days = [['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'], ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday']];
const businessTypes = ['Travel Agency', 'Tour Operator', 'Travel Consultant', 'Tour & Travel Company', 'Holiday Planner', 'Adventure Travel Company'];
const services = ['Domestic Tours', 'International Tours', 'Honeymoon Packages', 'Family Tours', 'Adventure Tours', 'Pilgrimage Tours', 'Corporate Tours', 'Group Tours', 'Customized Tours', 'Weekend Trips', 'Cruise Packages', 'Flight Booking', 'Hotel Booking', 'Transport Booking', 'Visa Assistance', 'Travel Insurance'];
const transportServices = ['Airport Pickup', 'Airport Drop', 'Car Rental', 'Bus Rental', 'Tempo Traveller', 'Cab Service', 'Driver Service'];
const amenities = ['Hotel Booking', 'Airport Transfers', 'Tour Guide', '24/7 Support', 'Travel Insurance', 'Visa Assistance', 'Currency Assistance', 'Local Transport', 'Customized Itinerary'];
const packageIncludes = ['Accommodation', 'Transport', 'Meals', 'Sightseeing', 'Guide', 'Airport Pickup', 'Activities'];
const socialFields = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['linkedin', 'LinkedIn'], ['pinterest', 'Pinterest'], ['twitter', 'Twitter / X']];

const Section = ({ number, title, children }) => <section className="col-span-2 rounded-xl border border-[#dce8eb] bg-white p-5 shadow-sm sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#087f8c]">{number}</p><h2 className="mt-1 font-display text-xl font-bold text-[#102f46]">{title}</h2><div className="mt-5 grid grid-cols-2 gap-4">{children}</div></section>;
const Field = ({ label, children, className = '' }) => <label className={`col-span-2 block text-sm font-medium text-[#385568] sm:col-span-1 ${className}`}>{label}{children}</label>;
const inputClass = 'mt-1 w-full rounded-md border border-[#d7e2e6] bg-white px-3 py-2.5 text-sm text-[#16364d] outline-none focus:border-[#078391] focus:ring-2 focus:ring-[#078391]/15';
const listValue = (value) => Array.isArray(value) ? value : [];

export default function ToursTravelsListingFields({ form, setForm, location, setLocation, details, setDetails, workingHours, setWorkingHours, uploadedFiles, setUploadedFiles, onSaveDraft, onPublish, submitting, isEditing, error, success }) {
  const [customService, setCustomService] = useState('');
  const [destinationDraft, setDestinationDraft] = useState({ name: '', country: '', image: '', description: '', bestTime: '' });
  const [packageDraft, setPackageDraft] = useState({ name: '', destination: '', image: '', duration: '', days: '', nights: '', startingPrice: '', offerPrice: '', description: '', highlights: [], includes: [], excludes: '', terms: '', bookingAction: 'Book Now' });
  const [vehicleDraft, setVehicleDraft] = useState({ name: '', type: '', capacity: '', image: '', price: '' });
  const [videoDraft, setVideoDraft] = useState({ title: '', thumbnail: '', url: '', duration: '' });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mediaError, setMediaError] = useState('');

  const setDetail = (key, value) => setDetails((current) => ({ ...current, [key]: value }));
  const setNested = (key, field, value) => setDetail(key, { ...(details[key] || {}), [field]: value });
  const toggle = (key, value) => {
    const current = listValue(details[key]);
    setDetail(key, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };
  const upload = async (file, kind = 'images') => {
    if (!file) return '';
    const body = new FormData();
    body.append(kind, file);
    const endpoint = kind === 'videos' ? '/uploads/videos' : '/uploads/images';
    const { data } = await api.post(endpoint, body, { headers: { 'Content-Type': 'multipart/form-data' } });
    return mediaUrl(data.data?.[0]?.url || '');
  };
  const handleUpload = async (event, onComplete, kind = 'images') => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      setMediaError('');
      onComplete(await upload(file, kind));
    } catch (uploadError) {
      setMediaError(uploadError.response?.data?.message || 'Media upload failed. Please try again.');
    }
  };
  const updateHours = (day, changes) => {
    const current = workingHours.find((item) => item.day === day) || { day, open: '', close: '', closed: false };
    setWorkingHours((items) => [...items.filter((item) => item.day !== day), { ...current, ...changes }]);
  };
  const addDestination = () => {
    if (!destinationDraft.name.trim()) return;
    setDetail('destinations', [...listValue(details.destinations), destinationDraft]);
    setDestinationDraft({ name: '', country: '', image: '', description: '', bestTime: '' });
  };
  const addPackage = () => {
    if (!packageDraft.name.trim() || !packageDraft.destination.trim()) return;
    setDetail('packages', [...listValue(details.packages), packageDraft]);
    setPackageDraft({ name: '', destination: '', image: '', duration: '', days: '', nights: '', startingPrice: '', offerPrice: '', description: '', highlights: [], includes: [], excludes: '', terms: '', bookingAction: 'Book Now' });
  };
  const addVehicle = () => {
    if (!vehicleDraft.name.trim()) return;
    setDetail('vehicles', [...listValue(details.vehicles), vehicleDraft]);
    setVehicleDraft({ name: '', type: '', capacity: '', image: '', price: '' });
  };
  const addVideo = () => {
    if (!videoDraft.title.trim() || !videoDraft.url.trim()) return;
    setDetail('videos', [...listValue(details.videos), videoDraft]);
    setVideoDraft({ title: '', thumbnail: '', url: '', duration: '' });
  };
  const addGallery = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, Math.max(0, 10 - (uploadedFiles.galleryImages || []).length));
    event.target.value = '';
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map((file) => upload(file)));
      setUploadedFiles((current) => ({ ...current, galleryImages: [...(current.galleryImages || []), ...urls] }));
    } catch (uploadError) {
      setMediaError(uploadError.response?.data?.message || 'Gallery upload failed. Please try again.');
    }
  };
  const moveGallery = (index, offset) => setUploadedFiles((current) => {
    const images = [...(current.galleryImages || [])];
    const target = index + offset;
    if (target < 0 || target >= images.length) return current;
    [images[index], images[target]] = [images[target], images[index]];
    return { ...current, galleryImages: images };
  });
  const updateForm = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const draftImageField = (title, draft, setDraft, key) => <Field label={`${title} URL or upload`}><div className="flex gap-2"><input type="url" value={draft[key] || ''} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} placeholder="https://" className={inputClass} /><label className="mt-1 shrink-0 cursor-pointer rounded-md border border-[#cbdde1] px-3 py-2.5 text-xs font-semibold text-[#087f8c]">Upload<input type="file" accept="image/*" className="hidden" onChange={(event) => handleUpload(event, (url) => setDraft((current) => ({ ...current, [key]: url })))} /></label></div>{draft[key] && <img src={draft[key]} alt={`${title} preview`} className="mt-2 h-24 w-full rounded-md object-cover" />}</Field>;
  const imageField = (title, field, value, onChange) => <Field label={`${title} image URL or upload`}><div className="flex gap-2"><input type="url" value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="https://" className={inputClass} /><label className="mt-1 shrink-0 cursor-pointer rounded-md border border-[#cbdde1] px-3 py-2.5 text-xs font-semibold text-[#087f8c]">Upload<input type="file" accept="image/*" className="hidden" onChange={(event) => handleUpload(event, onChange)} /></label></div>{value && <img src={value} alt={`${title} preview`} className="mt-2 h-28 w-full rounded-md object-cover" />}</Field>;

  return <div className="col-span-2 space-y-4">
    <div className="rounded-xl bg-[#123c58] px-5 py-6 text-white sm:px-7"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffbd59]">Tours &amp; Travels business studio</p><h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Create Tours &amp; Travels Business Profile</h1><p className="mt-2 text-sm text-white/75">Add your travel agency details, destinations, tour packages and travel services.</p></div>

    <Section number="01 · Business profile" title="Business basic information">
      <Field label="Business Name *"><input required value={form.name} onChange={updateForm('name')} className={inputClass} /></Field>
      <Field label="Business Type"><select value={details.businessType || ''} onChange={(event) => setDetail('businessType', event.target.value)} className={inputClass}><option value="">Choose type</option>{businessTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="Tagline"><input value={form.tagline || ''} onChange={updateForm('tagline')} className={inputClass} /></Field>
      <Field label="Established Year"><input type="number" min="1900" max="2100" value={form.establishedYear || ''} onChange={updateForm('establishedYear')} className={inputClass} /></Field>
      <Field label="Business Description *" className="sm:col-span-2"><textarea required rows={4} value={form.description} onChange={updateForm('description')} className={inputClass} /></Field>
      {imageField('Business logo', 'logo', uploadedFiles.logo, (value) => setUploadedFiles((current) => ({ ...current, logo: value })))}
    </Section>

    <Section number="02 · Reach your guests" title="Contact details">
      <Field label="Phone Number *"><input required type="tel" value={form.phone} onChange={updateForm('phone')} className={inputClass} /></Field>
      <Field label="WhatsApp Number"><input type="tel" value={form.whatsapp || ''} onChange={updateForm('whatsapp')} className={inputClass} /></Field>
      <Field label="Email *"><input required type="email" value={form.email} onChange={updateForm('email')} className={inputClass} /></Field>
      <Field label="Website"><input type="url" value={form.website || ''} onChange={updateForm('website')} placeholder="https://" className={inputClass} /></Field>
      <fieldset className="col-span-2"><legend className="text-sm font-semibold text-[#385568]">Show contact actions</legend><div className="mt-2 flex flex-wrap gap-4">{[['callNow', 'Call Now'], ['whatsAppAction', 'WhatsApp'], ['bookNow', 'Book Now']].map(([key, title]) => <label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={details.actions?.[key] !== false} onChange={(event) => setNested('actions', key, event.target.checked)} className="accent-[#078391]" />{title}</label>)}</div></fieldset>
    </Section>

    <Section number="03 · Find us" title="Location">
      <LocationCascadeFields value={location} onChange={setLocation} />
      <Field label="Address *" className="sm:col-span-2"><input required value={form.address} onChange={updateForm('address')} placeholder="Street address or place name" className={inputClass} /></Field>
      <Field label="Country"><input value={details.country || 'India'} onChange={(event) => setDetail('country', event.target.value)} className={inputClass} /></Field>
      <Field label="Pincode"><input inputMode="numeric" value={form.pincode || ''} onChange={updateForm('pincode')} className={inputClass} /></Field>
      <Field label="Latitude"><input type="number" step="any" value={details.coordinates?.lat || ''} onChange={(event) => setNested('coordinates', 'lat', event.target.value)} className={inputClass} /></Field>
      <Field label="Longitude"><input type="number" step="any" value={details.coordinates?.lng || ''} onChange={(event) => setNested('coordinates', 'lng', event.target.value)} className={inputClass} /></Field>
      <div className="col-span-2 flex flex-wrap gap-2"><button type="button" onClick={() => navigator.geolocation?.getCurrentPosition(({ coords }) => setDetail('coordinates', { lat: coords.latitude, lng: coords.longitude }), () => setMediaError('Location permission was not available.'))} className="rounded-md border border-[#cbdde1] px-3 py-2 text-xs font-semibold">Get coordinates</button><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.address || `${location.city || ''} ${location.state || ''}`)}`} className="rounded-md border border-[#cbdde1] px-3 py-2 text-xs font-semibold">Select location on map</a><span className="py-2 text-xs text-[#6b8290]">Enter the address manually or choose a point in Google Maps.</span></div>
    </Section>

    <Section number="04 · Opening hours" title="Working hours">
      {days.map(([day, label]) => { const entry = workingHours.find((item) => item.day === day) || { day, open: '', close: '', closed: false }; return <div key={day} className="col-span-2 grid grid-cols-[74px_1fr_1fr_auto] items-center gap-2 sm:col-span-1"><span className="text-xs font-semibold">{label}</span><input aria-label={`${label} opening time`} type="time" value={entry.open || ''} disabled={entry.closed} onChange={(event) => updateHours(day, { open: event.target.value })} className="min-w-0 rounded border border-[#d7e2e6] px-2 py-2 text-xs disabled:bg-slate-100" /><input aria-label={`${label} closing time`} type="time" value={entry.close || ''} disabled={entry.closed} onChange={(event) => updateHours(day, { close: event.target.value })} className="min-w-0 rounded border border-[#d7e2e6] px-2 py-2 text-xs disabled:bg-slate-100" /><label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={Boolean(entry.closed)} onChange={(event) => updateHours(day, { closed: event.target.checked })} />Closed</label></div>; })}
      <label className="col-span-2 flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={Boolean(details.support247)} onChange={(event) => setDetail('support247', event.target.checked)} className="accent-[#078391]" />24/7 Customer Support</label>
    </Section>

    <Section number="05 · What you arrange" title="Travel services">
      <fieldset className="col-span-2"><legend className="sr-only">Travel services</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{services.map((item) => <label key={item} className="flex items-center gap-2 rounded-md border border-[#e1eaed] px-3 py-2 text-xs"><input type="checkbox" checked={listValue(details.services).includes(item)} onChange={() => toggle('services', item)} className="accent-[#078391]" />{item}</label>)}</div></fieldset>
      <div className="col-span-2 flex gap-2"><input value={customService} onChange={(event) => setCustomService(event.target.value)} placeholder="Add a custom service" className={inputClass} /><button type="button" onClick={() => { if (customService.trim()) { setDetail('services', [...listValue(details.services), customService.trim()]); setCustomService(''); } }} className="mt-1 shrink-0 rounded-md bg-[#087f8c] px-4 text-xs font-bold text-white">Add</button></div>
    </Section>

    <Section number="06 · Destinations" title="Add destinations">
      <Field label="Destination Name"><input value={destinationDraft.name} onChange={(event) => setDestinationDraft({ ...destinationDraft, name: event.target.value })} className={inputClass} /></Field>
      <Field label="Country"><input value={destinationDraft.country} onChange={(event) => setDestinationDraft({ ...destinationDraft, country: event.target.value })} className={inputClass} /></Field>
      {draftImageField('Destination image', destinationDraft, setDestinationDraft, 'image')}
      <Field label="Best Time to Visit"><input value={destinationDraft.bestTime} onChange={(event) => setDestinationDraft({ ...destinationDraft, bestTime: event.target.value })} className={inputClass} /></Field>
      <Field label="Short Description" className="sm:col-span-2"><textarea rows={2} value={destinationDraft.description} onChange={(event) => setDestinationDraft({ ...destinationDraft, description: event.target.value })} className={inputClass} /></Field>
      <div className="col-span-2"><button type="button" onClick={addDestination} className="rounded-md border border-[#087f8c] px-4 py-2 text-xs font-bold text-[#087f8c]">Add Destination</button>{listValue(details.destinations).map((item, index) => <div key={`${item.name}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#f2f8f8] px-3 py-2 text-sm"><span>{item.name}{item.country ? `, ${item.country}` : ''}</span><button type="button" onClick={() => setDetail('destinations', details.destinations.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-600">Remove</button></div>)}</div>
    </Section>

    <Section number="07 · Packages" title="Tour packages">
      <Field label="Package Name *"><input value={packageDraft.name} onChange={(event) => setPackageDraft({ ...packageDraft, name: event.target.value })} className={inputClass} /></Field>
      <Field label="Destination *"><input value={packageDraft.destination} onChange={(event) => setPackageDraft({ ...packageDraft, destination: event.target.value })} className={inputClass} /></Field>
      {draftImageField('Package image', packageDraft, setPackageDraft, 'image')}
      <Field label="Duration"><input value={packageDraft.duration} onChange={(event) => setPackageDraft({ ...packageDraft, duration: event.target.value })} placeholder="5 days / 4 nights" className={inputClass} /></Field>
      <Field label="Number of Days"><input type="number" min="0" value={packageDraft.days} onChange={(event) => setPackageDraft({ ...packageDraft, days: event.target.value })} className={inputClass} /></Field>
      <Field label="Number of Nights"><input type="number" min="0" value={packageDraft.nights} onChange={(event) => setPackageDraft({ ...packageDraft, nights: event.target.value })} className={inputClass} /></Field>
      <Field label="Starting Price"><input type="number" min="0" value={packageDraft.startingPrice} onChange={(event) => setPackageDraft({ ...packageDraft, startingPrice: event.target.value })} className={inputClass} /></Field>
      <Field label="Offer Price"><input type="number" min="0" value={packageDraft.offerPrice} onChange={(event) => setPackageDraft({ ...packageDraft, offerPrice: event.target.value })} className={inputClass} /></Field>
      <Field label="Package Description" className="sm:col-span-2"><textarea rows={3} value={packageDraft.description} onChange={(event) => setPackageDraft({ ...packageDraft, description: event.target.value })} className={inputClass} /></Field>
      <fieldset className="col-span-2"><legend className="text-sm font-semibold">Package Highlights</legend><div className="mt-2 flex flex-wrap gap-3">{packageIncludes.map((item) => <label key={item} className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={packageDraft.highlights.includes(item)} onChange={() => setPackageDraft((current) => ({ ...current, highlights: current.highlights.includes(item) ? current.highlights.filter((entry) => entry !== item) : [...current.highlights, item] }))} className="accent-[#078391]" />{item}</label>)}</div></fieldset>
      <Field label="Package Includes"><input value={packageDraft.includes.join(', ')} onChange={(event) => setPackageDraft({ ...packageDraft, includes: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} className={inputClass} /></Field>
      <Field label="Package Excludes"><input value={packageDraft.excludes} onChange={(event) => setPackageDraft({ ...packageDraft, excludes: event.target.value })} className={inputClass} /></Field>
      <Field label="Terms & Conditions" className="sm:col-span-2"><textarea rows={2} value={packageDraft.terms} onChange={(event) => setPackageDraft({ ...packageDraft, terms: event.target.value })} className={inputClass} /></Field>
      <Field label="Booking action"><select value={packageDraft.bookingAction} onChange={(event) => setPackageDraft({ ...packageDraft, bookingAction: event.target.value })} className={inputClass}><option>Book Now</option><option>Enquire Now</option></select></Field>
      <div className="col-span-2"><button type="button" onClick={addPackage} className="rounded-md border border-[#087f8c] px-4 py-2 text-xs font-bold text-[#087f8c]">Add Another Package</button>{listValue(details.packages).map((item, index) => <div key={`${item.name}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#f2f8f8] px-3 py-2 text-sm"><span>{item.name} · {item.destination}</span><button type="button" onClick={() => setDetail('packages', details.packages.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-600">Remove</button></div>)}</div>
    </Section>

    <Section number="08 · Transport" title="Transport services">
      <fieldset className="col-span-2"><legend className="sr-only">Transport services</legend><div className="flex flex-wrap gap-3">{transportServices.map((item) => <label key={item} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={listValue(details.transportServices).includes(item)} onChange={() => toggle('transportServices', item)} className="accent-[#078391]" />{item}</label>)}</div></fieldset>
      <Field label="Vehicle Name"><input value={vehicleDraft.name} onChange={(event) => setVehicleDraft({ ...vehicleDraft, name: event.target.value })} className={inputClass} /></Field>
      <Field label="Vehicle Type"><input value={vehicleDraft.type} onChange={(event) => setVehicleDraft({ ...vehicleDraft, type: event.target.value })} className={inputClass} /></Field>
      <Field label="Seating Capacity"><input type="number" min="1" value={vehicleDraft.capacity} onChange={(event) => setVehicleDraft({ ...vehicleDraft, capacity: event.target.value })} className={inputClass} /></Field>
      {draftImageField('Vehicle image', vehicleDraft, setVehicleDraft, 'image')}
      <Field label="Price"><input value={vehicleDraft.price} onChange={(event) => setVehicleDraft({ ...vehicleDraft, price: event.target.value })} className={inputClass} /></Field>
      <div className="col-span-2"><button type="button" onClick={addVehicle} className="rounded-md border border-[#087f8c] px-4 py-2 text-xs font-bold text-[#087f8c]">Add Vehicle</button>{listValue(details.vehicles).map((item, index) => <div key={`${item.name}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#f2f8f8] px-3 py-2 text-sm"><span>{item.name} · {item.type}</span><button type="button" onClick={() => setDetail('vehicles', details.vehicles.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-600">Remove</button></div>)}</div>
    </Section>

    <Section number="09 · Added comfort" title="Travel amenities"><fieldset className="col-span-2"><legend className="sr-only">Travel amenities</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{amenities.map((item) => <label key={item} className="flex items-center gap-2 rounded-md border border-[#e1eaed] px-3 py-2 text-xs"><input type="checkbox" checked={listValue(details.amenities).includes(item)} onChange={() => toggle('amenities', item)} className="accent-[#078391]" />{item}</label>)}</div></fieldset></Section>

    <Section number="10 · First impression" title="Hero and about images">
      {imageField('Hero banner', 'coverImage', uploadedFiles.coverImage, (value) => setUploadedFiles((current) => ({ ...current, coverImage: value })))}
      {imageField('About', 'aboutImage', uploadedFiles.aboutImage, (value) => setUploadedFiles((current) => ({ ...current, aboutImage: value })))}
    </Section>

    <Section number="11 · Moments" title="Gallery · maximum 10 photos">
      <div className="col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-4">{(uploadedFiles.galleryImages || []).map((image, index) => <div key={`${image}-${index}`} className="overflow-hidden rounded-md border border-[#dce8eb]"><img src={image} alt={`Travel gallery ${index + 1}`} className="aspect-square w-full object-cover" /><div className="flex justify-between px-2 py-2"><button type="button" onClick={() => moveGallery(index, -1)} aria-label="Move photo earlier" className="text-xs">←</button><button type="button" onClick={() => setUploadedFiles((current) => ({ ...current, galleryImages: current.galleryImages.filter((_, itemIndex) => itemIndex !== index) }))} className="text-xs font-semibold text-red-600">Remove</button><button type="button" onClick={() => moveGallery(index, 1)} aria-label="Move photo later" className="text-xs">→</button></div></div>)}{(uploadedFiles.galleryImages || []).length < 10 && <label className="grid aspect-square cursor-pointer place-items-center rounded-md border border-dashed border-[#b9cbd2] text-center text-xs text-[#54717f]">Add photos<input type="file" accept="image/*" multiple className="hidden" onChange={addGallery} /></label>}</div>
      <Field label="Gallery category"><select value={details.galleryCategory || 'Destinations'} onChange={(event) => setDetail('galleryCategory', event.target.value)} className={inputClass}>{['Destinations', 'Tours', 'Adventure', 'Family Trips', 'Honeymoon', 'International'].map((item) => <option key={item}>{item}</option>)}</select></Field>
    </Section>

    <Section number="12 · Moving pictures" title="Travel videos · maximum 10">
      <Field label="Video Title"><input value={videoDraft.title} onChange={(event) => setVideoDraft({ ...videoDraft, title: event.target.value })} placeholder="Kerala Tour" className={inputClass} /></Field>
      <Field label="Duration"><input value={videoDraft.duration} onChange={(event) => setVideoDraft({ ...videoDraft, duration: event.target.value })} placeholder="02:35" className={inputClass} /></Field>
      {draftImageField('Video thumbnail', videoDraft, setVideoDraft, 'thumbnail')}
      <Field label="Video URL (YouTube, Vimeo or direct)"><input type="url" value={videoDraft.url} onChange={(event) => setVideoDraft({ ...videoDraft, url: event.target.value })} className={inputClass} /></Field>
      <Field label="Or upload video"><input type="file" accept="video/*" onChange={(event) => handleUpload(event, (url) => setVideoDraft((current) => ({ ...current, url })), 'videos')} className={inputClass} /></Field>
      <div className="col-span-2"><button type="button" disabled={listValue(details.videos).length >= 10} onClick={addVideo} className="rounded-md border border-[#087f8c] px-4 py-2 text-xs font-bold text-[#087f8c] disabled:opacity-50">Add Video</button>{listValue(details.videos).map((item, index) => <div key={`${item.url}-${index}`} className="mt-2 flex items-center justify-between rounded-md bg-[#f2f8f8] px-3 py-2 text-sm"><span>{item.title}</span><button type="button" onClick={() => setDetail('videos', details.videos.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-semibold text-red-600">Remove</button></div>)}</div>
    </Section>

    <Section number="13 · Social" title="Social media">{socialFields.map(([key, label]) => <Field key={key} label={label}><input type="url" value={details.socialLinks?.[key] || ''} onChange={(event) => setNested('socialLinks', key, event.target.value)} placeholder="https://" className={inputClass} /></Field>)}</Section>

    <Section number="14 · Reviews" title="Customer reviews"><label className="col-span-2 flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={details.enableReviews !== false} onChange={(event) => setDetail('enableReviews', event.target.checked)} className="h-4 w-4 accent-[#078391]" />Enable Customer Reviews</label></Section>

    <Section number="15 · Search visibility" title="SEO"><Field label="SEO Title"><input value={details.seoTitle || ''} onChange={(event) => setDetail('seoTitle', event.target.value)} className={inputClass} /></Field><Field label="SEO Keywords"><input value={details.seoKeywords || ''} onChange={(event) => setDetail('seoKeywords', event.target.value)} className={inputClass} /></Field><Field label="SEO Description" className="sm:col-span-2"><textarea rows={3} value={details.seoDescription || ''} onChange={(event) => setDetail('seoDescription', event.target.value)} className={inputClass} /></Field></Section>

    {(error || success || mediaError) && <p role={error || mediaError ? 'alert' : 'status'} className={`col-span-2 text-sm ${error || mediaError ? 'text-red-700' : 'text-emerald-700'}`}>{error || mediaError || success}</p>}
    <div className="col-span-2 flex flex-wrap justify-end gap-3 rounded-xl border border-[#dce8eb] bg-white p-4"><button type="button" onClick={onSaveDraft} className="rounded-md border border-[#cbdde1] px-4 py-2.5 text-sm font-semibold text-[#385568]">Save Draft</button><button type="button" onClick={() => setPreviewOpen(true)} className="rounded-md border border-[#087f8c] px-4 py-2.5 text-sm font-semibold text-[#087f8c]">Preview Website</button><button type="submit" disabled={submitting} onClick={onPublish} className="rounded-md bg-[#ef762e] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{submitting ? 'Submitting…' : isEditing ? 'Publish Changes' : 'Publish'}</button></div>
    {previewOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#102f46]/70 p-4" onClick={() => setPreviewOpen(false)}><div role="dialog" aria-modal="true" aria-label="Website preview" className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-6" onClick={(event) => event.stopPropagation()}><div className="flex justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#087f8c]">Website preview</p><h2 className="mt-2 font-display text-3xl font-bold text-[#102f46]">{form.name || 'Your travel business'}</h2><p className="mt-1 text-sm text-[#607887]">{form.tagline || 'Explore the world. Create beautiful memories.'}</p></div><button type="button" onClick={() => setPreviewOpen(false)} className="h-9 w-9 rounded-full border" aria-label="Close preview">×</button></div>{uploadedFiles.coverImage && <img src={uploadedFiles.coverImage} alt="Hero preview" className="mt-5 h-56 w-full rounded-lg object-cover" />}<p className="mt-4 text-sm leading-6 text-[#536d7a]">{form.description || 'Your business description will appear here.'}</p><h3 className="mt-5 font-bold">Packages</h3><div className="mt-2 grid gap-2 sm:grid-cols-2">{details.packages?.map((item, index) => <div key={`${item.name}-${index}`} className="rounded-md bg-[#f1f7f8] p-3 text-sm">{item.name} · {item.destination}</div>)}</div><button type="button" onClick={() => setPreviewOpen(false)} className="mt-6 rounded-md bg-[#087f8c] px-4 py-2 text-sm font-bold text-white">Close preview</button></div></div>}
  </div>;
}
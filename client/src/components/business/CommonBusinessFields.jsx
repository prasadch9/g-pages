import React from 'react';
import LocationCascadeFields from '../LocationCascadeFields';
import BusinessMediaUploader from './BusinessMediaUploader';
import BusinessVideoUploader from './BusinessVideoUploader';

const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';

const Field = ({ label, value, onChange, type = 'text', required = false }) => (
  <label className="text-sm text-ink/70">
    {label}
    <input required={required} type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} className={inputClass} />
  </label>
);

export default function CommonBusinessFields({ form, update, location, setLocation, placeId }) {
  return (
    <>
      <div className="col-span-2"><Field label="Business Name" value={form.name} onChange={update('name')} required /></div>
      <div className="col-span-2 sm:col-span-1"><Field label="Phone" value={form.phone} onChange={update('phone')} /></div>
      <div className="col-span-2 sm:col-span-1"><Field label="WhatsApp" value={form.whatsapp} onChange={update('whatsapp')} /></div>
      <div className="col-span-2 sm:col-span-1"><Field label="Email" value={form.email} onChange={update('email')} type="email" /></div>
      <div className="col-span-2 sm:col-span-1"><Field label="Website" value={form.website} onChange={update('website')} /></div>
      <div className="col-span-2 lg:col-span-1"><BusinessMediaUploader label="Business Logo" value={form.logo} onChange={updateValue('logo', update)} placeId={placeId} previewClassName="h-32" /></div>
      <div className="col-span-2 lg:col-span-1"><BusinessMediaUploader label="Cover Image" value={form.coverImage} onChange={updateValue('coverImage', update)} placeId={placeId} previewClassName="h-40" /></div>
      <div className="col-span-2 grid grid-cols-2 gap-4"><LocationCascadeFields value={location} onChange={setLocation} /></div>
      <div className="col-span-2"><label className="text-sm text-ink/70">Address<input required value={form.address || ''} onChange={(event) => update('address')(event)} className={inputClass} /></label></div>
      <div className="col-span-2"><label className="text-sm text-ink/70">Pincode<input value={form.pincode || ''} onChange={(event) => update('pincode')(event)} className={inputClass} /></label></div>
      <div className="col-span-2"><label className="text-sm text-ink/70">About / Description<textarea required rows={4} value={form.description || ''} onChange={(event) => update('description')(event)} className={inputClass} /></label></div>
      <div className="col-span-2"><BusinessMediaUploader label="Gallery" helpText="Add up to 10 images." value={form.gallery || []} onChange={updateValue('gallery', update)} placeId={placeId} multiple max={10} previewClassName="h-28" /></div>
      <div className="col-span-2"><BusinessVideoUploader label="Video Gallery" value={form.videos || []} onChange={updateValue('videos', update)} placeId={placeId} /></div>
      <div className="col-span-2"><label className="text-sm text-ink/70">Social Links<textarea rows={3} value={form.socialLinks || ''} onChange={(event) => update('socialLinks')(event)} placeholder="Facebook, Instagram, YouTube URLs" className={inputClass} /></label></div>
      <div className="col-span-2"><BusinessHours form={form} setForm={setFormFromUpdate(update)} /></div>
    </>
  );
}

function updateValue(field, update) {
  return (value) => update(field)({ target: { value } });
}

function setFormFromUpdate(update) {
  return (field, value) => update(field)({ target: { value } });
}

function BusinessHours({ form, setForm }) {
  const hours = form.hours || {};
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return <div><h3 className="text-sm font-medium text-ink/70">Business Hours</h3><div className="mt-2 grid gap-3 sm:grid-cols-2">{days.map((day) => <div key={day} className="rounded border border-line bg-white p-3"><div className="mb-2 flex items-center justify-between text-sm capitalize"><span>{day}</span><label className="text-xs"><input type="checkbox" checked={Boolean(hours[day]?.closed)} onChange={(event) => setForm('hours', { ...hours, [day]: { ...(hours[day] || {}), closed: event.target.checked } })} /> Closed</label></div><div className="grid grid-cols-2 gap-2"><input type="time" value={hours[day]?.open || ''} onChange={(event) => setForm('hours', { ...hours, [day]: { ...(hours[day] || {}), open: event.target.value } })} className={inputClass} /><input type="time" value={hours[day]?.close || ''} onChange={(event) => setForm('hours', { ...hours, [day]: { ...(hours[day] || {}), close: event.target.value } })} className={inputClass} /></div></div>)}</div></div>;
}

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BusinessMediaUploader from '../../components/business/BusinessMediaUploader';
import BusinessVideoUploader from '../../components/business/BusinessVideoUploader';
import LocationCascadeFields from '../../components/LocationCascadeFields';
import { getCategoryFieldNames } from '../../components/business/CategorySpecificFields';
import { CATEGORY_ICONS } from '../../data/categoryGroups';

const inputClass = 'mt-1 w-full rounded-xl border border-[#e2e8f0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition';
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const emptyHours = Object.fromEntries(days.map((d) => [d, { open: '', close: '', closed: false }]));
const split = (v) => Array.isArray(v) ? v : String(v || '').split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
const asText = (v) => Array.isArray(v)
  ? v.filter(Boolean).map((item) => (typeof item === 'object' ? JSON.stringify(item) : item)).join('\n')
  : v || '';
const structuredTravelFields = new Set(['Tour Packages', 'Destinations', 'Vehicles']);
const parseSpecificValue = (key, value) => {
  const values = split(value);
  if (!structuredTravelFields.has(key)) return values;
  return values.map((item) => {
    try {
      const parsed = JSON.parse(item);
      return parsed && typeof parsed === 'object' ? parsed : { name: item };
    } catch {
      return { name: item };
    }
  });
};

const GROUP_ACCENT = {
  'Education & Learning': { bg: '#f0f9ff', border: '#bae6fd', accent: '#0369a1', dark: '#0c4a6e' },
  'Religious & Social': { bg: '#fef9f0', border: '#fed7aa', accent: '#ea580c', dark: '#7c2d12' },
  'Travel & Hospitality': { bg: '#f0fdf4', border: '#bbf7d0', accent: '#16a34a', dark: '#14532d' },
  'Shopping & Retail': { bg: '#fdf4ff', border: '#e9d5ff', accent: '#9333ea', dark: '#581c87' },
  'Automotive': { bg: '#fffbeb', border: '#fde68a', accent: '#d97706', dark: '#78350f' },
  'Industries & Manufacturing': { bg: '#f0fdf4', border: '#a7f3d0', accent: '#059669', dark: '#064e3b' },
  'Business & Professional Services': { bg: '#eff6ff', border: '#bfdbfe', accent: '#2563eb', dark: '#1e3a8a' },
  'Logistics & Moving': { bg: '#fff7ed', border: '#fed7aa', accent: '#c2410c', dark: '#7c2d12' },
  'Arts & Creative': { bg: '#fdf2f8', border: '#f9a8d4', accent: '#db2777', dark: '#831843' },
};

function Field({ label, value, onChange, multiline = false, required = false, type = 'text' }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}{required && <span className="ml-1 text-red-500">*</span>}
      {multiline
        ? <textarea required={required} rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />
        : <input required={required} type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      }
    </label>
  );
}

export default function GenericBusinessEditor({ place = null, groupName, subcategoryName, categoryId, subcategoryIdProp, create = false, onBack }) {
  const navigate = useNavigate();
  const isEdit = Boolean(place?._id);
  const palette = GROUP_ACCENT[groupName] || { bg: '#f8fafc', border: '#e2e8f0', accent: '#334155', dark: '#0f172a' };
  const profile = place?.attributes?.businessProfile || {};
  const common = profile.common || {};
  const specific = profile.categorySpecific || {};
  const fieldNames = getCategoryFieldNames(groupName, subcategoryName);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState({
    state: place?.location?.state?._id || '',
    district: place?.location?.district?._id || '',
    city: place?.location?.city?._id || '',
    area: place?.location?.area?._id || '',
  });
  const [form, setForm] = useState(() => ({
    name: place?.name || '',
    tagline: common.tagline || '',
    description: place?.description || common.about || '',
    phone: place?.phone || common.phone || '',
    whatsapp: place?.socialLinks?.whatsapp || common.socialMedia?.whatsapp || '',
    email: place?.email || common.email || '',
    website: place?.website || common.website || '',
    address: place?.address || common.address || '',
    pincode: common.pincode || '',
    logo: place?.logo || common.logo || '',
    coverImage: place?.coverImage || common.coverImage || '',
    gallery: place?.images || common.gallery || [],
    videos: Array.isArray(common.videos) ? common.videos : [],
    social: { ...(place?.socialLinks || {}), ...(common.socialMedia || {}) },
    hours: Array.isArray(place?.workingHours)
      ? place.workingHours.reduce((acc, item) => ({ ...acc, [item.day]: item }), { ...emptyHours })
      : { ...emptyHours },
    specific: Object.fromEntries(fieldNames.map((f) => [f, asText(specific[f])])),
  }));

  const setField = (key, value) => setForm((c) => ({ ...c, [key]: value }));
  const setSpecificField = (key, value) => setForm((c) => ({ ...c, specific: { ...c.specific, [key]: value } }));

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !location.state || !location.city) {
      setError('Business name, phone, state and city are required.');
      return;
    }
    setSaving(true); setError(''); setMessage('');
    const categorySpecific = {
      ...specific,
      ...Object.fromEntries(Object.entries(form.specific).map(([k, v]) => [k, parseSpecificValue(k, v)])),
    };
    const businessType = `category-${(subcategoryName || groupName).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    const payload = {
      name: form.name,
      category: categoryId || place?.category?._id || place?.category,
      subcategory: subcategoryIdProp || place?.subcategory?._id || place?.subcategory || undefined,
      address: form.address,
      description: form.description,
      phone: form.phone,
      email: form.email || undefined,
      website: form.website || undefined,
      logo: form.logo || undefined,
      coverImage: form.coverImage || undefined,
      images: form.gallery.slice(0, 10),
      services: split(form.specific['Travel Services'] || form.specific['Services'] || form.specific['Professional Services'] || form.specific['Medical Services'] || ''),
      facilities: split(form.specific['Facilities'] || ''),
      socialLinks: { ...form.social, whatsapp: form.whatsapp || undefined },
      workingHours: days.map((d) => ({ day: d, ...(form.hours[d] || {}) })),
      location,
      attributes: {
        ...(place?.attributes || {}),
        businessProfile: {
          ...profile,
          businessType,
          common: {
            ...common,
            businessName: form.name,
            tagline: form.tagline,
            about: form.description,
            logo: form.logo,
            coverImage: form.coverImage,
            gallery: form.gallery.slice(0, 10),
            videos: form.videos,
            pincode: form.pincode,
            socialMedia: { ...form.social, whatsapp: form.whatsapp },
            openingHours: days.map((d) => ({ day: d, ...(form.hours[d] || {}) })),
          },
          categorySpecific,
        },
      },
    };
    try {
      if (isEdit) {
        await api.put(`/places/${place._id}`, payload);
        setMessage('Business updated successfully.');
      } else {
        await api.post('/places', payload);
        setMessage('Business submitted for approval.');
        setTimeout(() => navigate('/business/dashboard'), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to save this business.');
    } finally {
      setSaving(false);
    }
  };

  const icon = CATEGORY_ICONS[subcategoryName] || '🏢';

  return (
    <div className="min-h-screen px-5 py-10 sm:px-8" style={{ backgroundColor: palette.bg }}>
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={onBack || (() => navigate('/business/dashboard'))} className="text-sm font-semibold" style={{ color: palette.accent }}>
          ← Back
        </button>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-55">{groupName}</p>
            <h1 className="font-display text-3xl font-bold" style={{ color: palette.dark }}>
              {isEdit ? 'Edit' : 'Add'} {subcategoryName || groupName}
            </h1>
          </div>
        </div>
        {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {message && <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
        <form onSubmit={save} className="mt-6 space-y-6">
          {/* Business Info */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7" style={{ borderColor: palette.border }}>
            <h2 className="font-display text-xl font-semibold" style={{ color: palette.dark }}>Business Information</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Business Name" value={form.name} onChange={(v) => setField('name', v)} required />
              <Field label="Tagline / Slogan" value={form.tagline} onChange={(v) => setField('tagline', v)} />
              <div className="md:col-span-2">
                <Field label="About / Description" value={form.description} onChange={(v) => setField('description', v)} multiline />
              </div>
              <BusinessMediaUploader label="Business Logo" value={form.logo} onChange={(v) => setField('logo', v)} placeId={place?._id} previewClassName="h-32" />
              <BusinessMediaUploader label="Cover Image" value={form.coverImage} onChange={(v) => setField('coverImage', v)} placeId={place?._id} previewClassName="h-40" />
            </div>
          </section>

          {/* Contact & Location */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7" style={{ borderColor: palette.border }}>
            <h2 className="font-display text-xl font-semibold" style={{ color: palette.dark }}>Contact & Location</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Phone" value={form.phone} onChange={(v) => setField('phone', v)} required type="tel" />
              <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setField('whatsapp', v)} type="tel" />
              <Field label="Email" value={form.email} onChange={(v) => setField('email', v)} type="email" />
              <Field label="Website" value={form.website} onChange={(v) => setField('website', v)} />
              <div className="md:col-span-2">
                <Field label="Address" value={form.address} onChange={(v) => setField('address', v)} multiline required />
              </div>
              <Field label="Pincode" value={form.pincode} onChange={(v) => setField('pincode', v)} />
              <div className="md:col-span-2">
                <LocationCascadeFields value={location} onChange={setLocation} />
              </div>
            </div>
          </section>

          {/* Category-specific fields */}
          {fieldNames.length > 0 && (
            <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7" style={{ borderColor: palette.border }}>
              <h2 className="font-display text-xl font-semibold" style={{ color: palette.dark }}>{subcategoryName || groupName} Details</h2>
              <p className="mt-1 text-sm opacity-55">Fill in details specific to this business type. Use one item per line or comma-separated.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {fieldNames.map((fieldName) => (
                  <label key={fieldName} className="block text-sm font-medium text-slate-700">
                    {fieldName}
                    <textarea
                      rows={3}
                      value={form.specific[fieldName] || ''}
                      onChange={(e) => setSpecificField(fieldName, e.target.value)}
                      placeholder={structuredTravelFields.has(fieldName)
                        ? `One item per line. For details use JSON, e.g. {"name":"Goa Escape","days":4,"nights":3,"price":"₹24,000","description":"Beach and heritage stay"}`
                        : `Enter ${fieldName.toLowerCase()}...`}
                      className={inputClass}
                    />
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* Business Hours */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7" style={{ borderColor: palette.border }}>
            <h2 className="font-display text-xl font-semibold" style={{ color: palette.dark }}>Business Hours</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {days.map((day) => (
                <div key={day} className="rounded-xl border p-3" style={{ borderColor: palette.border }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold capitalize">{day}</span>
                    <label className="flex items-center gap-1.5 text-xs font-medium">
                      <input type="checkbox" checked={Boolean(form.hours[day]?.closed)} onChange={(e) => setField('hours', { ...form.hours, [day]: { ...(form.hours[day] || {}), closed: e.target.checked } })} />
                      Closed
                    </label>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input type="time" value={form.hours[day]?.open || ''} onChange={(e) => setField('hours', { ...form.hours, [day]: { ...(form.hours[day] || {}), open: e.target.value } })} disabled={form.hours[day]?.closed} className={inputClass} />
                    <input type="time" value={form.hours[day]?.close || ''} onChange={(e) => setField('hours', { ...form.hours, [day]: { ...(form.hours[day] || {}), close: e.target.value } })} disabled={form.hours[day]?.closed} className={inputClass} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Social Media */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7" style={{ borderColor: palette.border }}>
            <h2 className="font-display text-xl font-semibold" style={{ color: palette.dark }}>Social Media</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {['facebook', 'instagram', 'youtube', 'linkedin', 'twitter'].map((key) => (
                <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={form.social[key]} onChange={(v) => setField('social', { ...form.social, [key]: v })} />
              ))}
            </div>
          </section>

          {/* Gallery & Videos */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7" style={{ borderColor: palette.border }}>
            <h2 className="font-display text-xl font-semibold" style={{ color: palette.dark }}>Gallery & Videos</h2>
            <div className="mt-5 space-y-6">
              <BusinessMediaUploader label="Gallery Images" helpText="Add up to 10 images." value={form.gallery} onChange={(v) => setField('gallery', v)} placeId={place?._id} multiple max={10} previewClassName="h-28" />
              <BusinessVideoUploader label="Video Gallery" value={form.videos} onChange={(v) => setField('videos', v)} placeId={place?._id} />
            </div>
          </section>

          <div className="flex flex-wrap justify-between gap-3">
            <button type="button" onClick={onBack || (() => navigate('/business/dashboard'))} className="rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold" style={{ borderColor: palette.border }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60" style={{ backgroundColor: palette.accent }}>
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Submit listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

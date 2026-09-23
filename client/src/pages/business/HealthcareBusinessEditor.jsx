import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BusinessMediaUploader from '../../components/business/BusinessMediaUploader';

const inputClass = 'mt-1 w-full rounded-xl border border-[#e7dcd7] bg-white px-3 py-2.5 text-sm text-[#2d2323] outline-none transition focus:border-[#0f6cbf] focus:ring-2 focus:ring-[#0f6cbf]/10';
const splitList = (value = '') => String(value).split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
const asText = (value) => Array.isArray(value) ? value.filter(Boolean).join('\n') : value || '';

export default function HealthcareBusinessEditor({ place }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: place.name || '',
    category: place.category?._id || place.category || '',
    subcategory: place.subcategory?._id || place.subcategory || '',
    phone: place.phone || '',
    email: place.email || '',
    website: place.website || '',
    logo: place.logo || '',
    coverImage: place.coverImage || '',
    address: place.address || '',
    description: place.description || '',
    gallery: Array.isArray(place.images) ? place.images : [],
    services: asText(place.services || []),
    facilities: asText(place.facilities || []),
    departments: asText(place.attributes?.departments || []),
    emergencyAvailable: Boolean(place.attributes?.emergencyAvailable ?? place.emergencyAvailable),
    emergencyPhone: place.attributes?.emergencyPhone || place.emergencyPhone || '',
  });

  const gallery = Array.isArray(form.gallery) ? form.gallery.slice(0, 10) : [];
  const services = useMemo(() => splitList(form.services), [form.services]);
  const facilities = useMemo(() => splitList(form.facilities), [form.facilities]);
  const departments = useMemo(() => splitList(form.departments), [form.departments]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const nextGallery = gallery.slice(0, 10);
      const payload = {
        name: form.name,
        category: form.category || place.category?._id || place.category,
        subcategory: form.subcategory || place.subcategory?._id || place.subcategory || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        logo: form.logo || undefined,
        coverImage: form.coverImage || undefined,
        address: form.address,
        description: form.description,
        services: services,
        facilities: facilities,
        images: nextGallery,
        attributes: {
          ...(place.attributes || {}),
          departments,
          emergencyAvailable: form.emergencyAvailable,
          emergencyPhone: form.emergencyPhone || undefined,
          businessProfile: {
            ...(place.attributes?.businessProfile || {}),
            businessType: 'healthcare',
            common: {
              ...(place.attributes?.businessProfile?.common || {}),
              businessName: form.name,
              logo: form.logo,
              coverImage: form.coverImage,
              gallery: nextGallery,
              phone: form.phone,
              email: form.email,
              website: form.website,
              address: form.address,
              about: form.description,
            },
            categorySpecific: {
              ...(place.attributes?.businessProfile?.categorySpecific || {}),
              departments,
              emergencyAvailable: form.emergencyAvailable,
              emergencyPhone: form.emergencyPhone || undefined,
            },
          },
        },
      };

      await api.put(`/places/${place._id}`, payload);
      setMessage('Healthcare profile updated successfully.');
    } catch (saveError) {
      setError(saveError.response?.data?.message || saveError.message || 'Unable to save this healthcare profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4efed] px-5 py-10 text-[#2d2323] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={() => navigate('/business/dashboard')} className="text-sm font-semibold text-[#0f6cbf]">← Back to Dashboard</button>
        <h1 className="mt-4 font-display text-4xl font-semibold text-[#2d2323]">Healthcare Business Profile</h1>
        <p className="mt-2 text-sm text-[#70615f]">Update your hospital logo, cover image, and gallery directly from the existing business profile flow.</p>

        {error && <p className="mt-4 rounded-xl bg-[#fff1f0] p-3 text-sm text-[#a83f32]">{error}</p>}
        {message && <p className="mt-4 rounded-xl bg-[#edf9f1] p-3 text-sm text-[#2f5a3f]">{message}</p>}

        <form onSubmit={save} className="mt-8 space-y-6">
          <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7">
            <h2 className="font-display text-2xl font-semibold">Basic information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-[#4b3d3b]">
                Hospital Name
                <input value={form.name} onChange={update('name')} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-[#4b3d3b]">
                Phone
                <input value={form.phone} onChange={update('phone')} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-[#4b3d3b]">
                Email
                <input value={form.email} onChange={update('email')} className={inputClass} />
              </label>
              <label className="text-sm font-medium text-[#4b3d3b]">
                Website
                <input value={form.website} onChange={update('website')} className={inputClass} />
              </label>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div>
                <BusinessMediaUploader
                  label="Hospital Logo"
                  value={form.logo}
                  onChange={(value) => setForm((current) => ({ ...current, logo: value }))}
                  placeId={place._id}
                  previewClassName="h-40"
                  helpText="Upload, preview, replace, or remove the hospital logo."
                />
              </div>
              <div>
                <BusinessMediaUploader
                  label="Cover / Banner Image"
                  value={form.coverImage}
                  onChange={(value) => setForm((current) => ({ ...current, coverImage: value }))}
                  placeId={place._id}
                  previewClassName="h-40"
                  helpText="Upload or use an image URL for the healthcare cover image."
                />
              </div>
            </div>

            <label className="mt-6 block text-sm font-medium text-[#4b3d3b]">
              Address
              <textarea rows={3} value={form.address} onChange={update('address')} className={inputClass} />
            </label>

            <label className="mt-6 block text-sm font-medium text-[#4b3d3b]">
              Hospital Overview
              <textarea rows={5} value={form.description} onChange={update('description')} className={inputClass} />
            </label>
          </section>

          <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7">
            <h2 className="font-display text-2xl font-semibold">Hospital services & details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-[#4b3d3b]">
                Services
                <textarea rows={4} value={form.services} onChange={update('services')} className={inputClass} placeholder="Cardiology, ICU, Emergency, Diagnostics, Pharmacy" />
              </label>
              <label className="text-sm font-medium text-[#4b3d3b]">
                Facilities
                <textarea rows={4} value={form.facilities} onChange={update('facilities')} className={inputClass} placeholder="Parking, Ambulance, Wi-Fi, ICU, Pharmacy" />
              </label>
              <label className="text-sm font-medium text-[#4b3d3b]">
                Departments
                <textarea rows={4} value={form.departments} onChange={update('departments')} className={inputClass} placeholder="Neurology, Orthopaedics, Pediatrics, ENT" />
              </label>
              <div className="space-y-4">
                <label className="flex items-center gap-3 rounded-xl border border-[#ebded8] bg-[#faf7f6] p-3 text-sm font-medium text-[#4b3d3b]">
                  <input type="checkbox" checked={form.emergencyAvailable} onChange={(event) => setForm((current) => ({ ...current, emergencyAvailable: event.target.checked }))} className="h-4 w-4 rounded border-[#d6c6c2] text-[#0f6cbf] focus:ring-[#0f6cbf]" />
                  Emergency Care Available
                </label>
                <label className="text-sm font-medium text-[#4b3d3b]">
                  Emergency Phone
                  <input value={form.emergencyPhone} onChange={update('emergencyPhone')} className={inputClass} />
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#ebded8] bg-white p-5 sm:p-7">
            <BusinessMediaUploader
              label="Hospital Gallery"
              helpText="Add up to 10 images for the healthcare profile."
              value={gallery}
              onChange={(images) => setForm((current) => ({ ...current, gallery: images }))}
              placeId={place._id}
              multiple
              max={10}
              previewClassName="h-28"
            />
          </section>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/business/dashboard')} className="rounded-xl border border-[#e7dcd7] bg-white px-4 py-2.5 text-sm font-semibold text-[#4b3d3b]">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-[#0f6cbf] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

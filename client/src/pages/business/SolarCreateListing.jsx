import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import LocationCascadeFields from '../../components/LocationCascadeFields';
import SolarRegistrationFields, { createSolarDetails } from '../../components/SolarRegistrationFields';

const initialLocation = { state: '', district: '', city: '', area: '' };

const serialiseSolar = (solar) => ({
  ...solar,
  logoFile: undefined,
  coverFile: undefined,
  galleryItems: solar.galleryItems?.map(({ file, ...item }) => item),
  services: solar.services.map(({ files, video, ...item }) => item),
  projects: solar.projects.map(({ files, video, ...item }) => item),
  videos: solar.videos.map(({ thumbnail, ...item }) => item),
  brands: { ...solar.brands, file: undefined },
  certifications: solar.certifications.map(({ file, ...item }) => item),
  reviews: solar.reviews.map(({ photo, ...item }) => item),
});

export default function SolarCreateListing() {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = Boolean(editId);
  const [category, setCategory] = useState(null);
  const [solar, setSolar] = useState(createSolarDetails);
  const [location, setLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ error: '', success: '' });

  useEffect(() => {
    api.get('/categories/solar').then(({ data }) => setCategory(data.data)).catch((error) => setMessage({ error: error.message, success: '' }));
  }, [searchParams]);

  useEffect(() => {
    if (!editId) return;
    api.get('/places/mine').then(({ data }) => {
      const place = data.data.find((item) => item._id === editId);
      if (!place) throw new Error('Solar listing not found.');
      const savedSolar = place.attributes?.solar || {};
      setSolar({ ...createSolarDetails(), ...savedSolar, services: savedSolar.services || [], projects: savedSolar.projects || [], videos: savedSolar.videos || [], features: savedSolar.features || [], galleryFiles: [], logoFile: null });
      setLocation({ state: place.location?.state?._id || place.location?.state || '', district: place.location?.district?._id || place.location?.district || '', city: place.location?.city?._id || place.location?.city || '', area: place.location?.area?._id || place.location?.area || '' });
      setAddress(place.address || '');
    }).catch((error) => setMessage({ error: error.message, success: '' }));
  }, [editId]);

  const submit = async (event) => {
    event.preventDefault();
    if (!category?._id || !location.state || !location.district || !location.city || !solar.companyName || !address || !solar.about) {
      setMessage({ error: 'Please complete company name, description, address, category and location.', success: '' });
      return;
    }

    setSubmitting(true);
    setMessage({ error: '', success: '' });
    try {
      if (isEditing) {
        await api.put(`/places/${editId}`, {
          name: solar.companyName,
          address,
          description: solar.about,
          phone: solar.mobile,
          email: solar.email,
          website: solar.website,
          services: solar.services.map((item) => item.name).filter(Boolean),
          facilities: solar.features.filter(Boolean),
          socialLinks: { ...solar.social, whatsapp: solar.whatsapp },
          location: { ...location, area: location.area || null },
          attributes: { solar: serialiseSolar(solar) },
        });
        setMessage({ error: '', success: 'Solar listing updated successfully.' });
        window.setTimeout(() => navigate('/business/dashboard'), 1200);
        return;
      }
      const payload = new FormData();
      payload.append('name', solar.companyName);
      payload.append('category', category._id);
      payload.append('subcategory', 'Solar');
      payload.append('categoryGroup', category.group || 'Infrastructure');
      payload.append('pageType', 'dynamic');
      payload.append('address', address);
      payload.append('description', solar.about);
      payload.append('phone', solar.mobile);
      payload.append('email', solar.email);
      payload.append('website', solar.website);
      payload.append('services', JSON.stringify(solar.services.map((item) => item.name).filter(Boolean)));
      payload.append('facilities', JSON.stringify(solar.features.filter(Boolean)));
      payload.append('socialLinks', JSON.stringify({ ...solar.social, whatsapp: solar.whatsapp }));
      payload.append('attributes', JSON.stringify({ solar: serialiseSolar(solar) }));
      payload.append('location', JSON.stringify({ ...location, area: location.area || undefined }));
      if (solar.logoFile) payload.append('logo', solar.logoFile);
      if (coverFile) payload.append('coverImage', coverFile);
      solar.galleryItems?.forEach((item) => { if (item.file) payload.append('galleryImages', item.file); });
      solar.services.forEach((item) => { item.files?.forEach((file) => payload.append('galleryImages', file)); if (item.video) payload.append('videos', item.video); });
      solar.projects.forEach((item) => { item.files?.forEach((file) => payload.append('galleryImages', file)); if (item.video) payload.append('videos', item.video); });
      solar.videos.forEach((item) => { if (item.thumbnail) payload.append('galleryImages', item.thumbnail); });
      if (solar.brands.file) payload.append('galleryImages', solar.brands.file);
      solar.certifications.forEach((item) => item.file && payload.append('galleryImages', item.file));
      solar.reviews.forEach((item) => item.photo && payload.append('galleryImages', item.photo));
      await api.post('/places', payload);
      setMessage({ error: '', success: 'Solar listing submitted. It will appear publicly after admin approval.' });
      window.setTimeout(() => navigate('/business/dashboard'), 1600);
    } catch (error) {
      setMessage({ error: error.message, success: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 outline-none focus:border-ink/40';

  return <div className="min-h-screen bg-[linear-gradient(135deg,#effaf8_0%,#fff8ec_48%,#f3f0ff_100%)] py-8 sm:py-12"><div className="container-page"><div className="mx-auto max-w-4xl"><div className="rounded-[1.5rem] bg-[#063664] px-6 py-8 text-white shadow-[0_20px_55px_rgba(18,57,90,.22)] sm:px-10"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a4e64d]">Google Pages · Solar owner portal</p><h1 className="mt-3 font-display text-3xl font-semibold sm:text-5xl">Create your Solar business page</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">Fill the Solar-specific form below. Your approved page will use the Solar business design with services, projects, gallery, videos and contact actions.</p></div><form onSubmit={submit} className="mt-8 grid grid-cols-2 gap-4"><SolarRegistrationFields data={solar} setData={setSolar} inputClass={inputClass} /><div className="col-span-2"><LocationCascadeFields value={location} onChange={setLocation} /></div><div className="col-span-2"><label className="text-sm text-ink/70">Full address<input required value={address} onChange={(event) => setAddress(event.target.value)} className={inputClass} /></label></div><div className="col-span-2"><label className="text-sm text-ink/70">Hero / cover image<input type="file" accept="image/*" onChange={(event) => setCoverFile(event.target.files?.[0] || null)} className={inputClass} /></label></div>{message.error && <p className="col-span-2 text-sm text-vermilion">{message.error}</p>}{message.success && <p className="col-span-2 text-sm text-moss">{message.success}</p>}<button type="submit" disabled={submitting || !category} className="col-span-2 rounded bg-[#063664] py-3 text-sm font-semibold text-white disabled:opacity-60">{submitting ? 'Submitting Solar listing…' : 'Submit Solar business for approval'}</button></form></div></div></div>;
}

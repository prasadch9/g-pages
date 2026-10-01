import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import BusinessMediaUploader from '../../../components/business/BusinessMediaUploader';
import BusinessVideoUploader from '../../../components/business/BusinessVideoUploader';
import LocationCascadeFields from '../../../components/LocationCascadeFields';

const inputClass = 'mt-1 w-full rounded-xl border border-[#eadbd3] bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-400';
const emptyLocation = { state: '', district: '', city: '', area: '', areaText: '' };
const cleanItems = (items, keys) => (Array.isArray(items) ? items : []).map((item) => typeof item === 'string' ? { [keys[0]]: item } : item);

function Repeater({ title, buttonText, items, makeItem, onChange, children }) {
  return <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">Add as many items as your clinic needs.</p></div><button type="button" onClick={() => onChange([...items, makeItem()])} className="rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white">+ {buttonText}</button></div><div className="mt-5 space-y-4">{items.map((item, index) => <div key={`${title}-${index}`} className="grid gap-3 rounded-2xl border border-rose-100 bg-rose-50/40 p-4 sm:grid-cols-2">{children(item, index)}<button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="text-left text-xs font-bold text-red-700">Remove</button></div>)}</div></section>;
}

export default function SkinCareBusinessEditor({ place = {}, create = false, categoryId, subcategoryId, onBack, embedded = false }) {
  const navigate = useNavigate();
  const specific = place.attributes?.businessProfile?.categorySpecific || {};
  const common = place.attributes?.businessProfile?.common || {};
  const [form, setForm] = useState({
    name: place.name || '', phone: place.phone || '', whatsapp: place.socialLinks?.whatsapp || common.socialLinks?.whatsapp || '', email: place.email || '', website: place.website || '',
    logo: place.logo || common.logo || '', coverImage: place.coverImage || common.coverImage || '', address: place.address || '', heroDescription: common.heroDescription || 'Expert dermatology and personalized treatments for healthy, confident skin.', about: specific.aboutDescription || common.about || place.description || '',
    aboutImage: specific.aboutImage || '', tagline: place.attributes?.tagline || common.tagline || '',
    doctors: cleanItems(specific.doctors || [], ['name']),
    skinServices: cleanItems(specific.skinServices || [], ['caption']),
    keyFeatures: cleanItems(specific.keyFeatures || [], ['title']),
    gallery: Array.isArray(place.images) ? place.images : common.gallery || [],
    videos: Array.isArray(common.videos) ? common.videos : [],
    social: { facebook: '', instagram: '', youtube: '', ...(common.socialLinks || place.socialLinks || {}) },
  });
  const [location, setLocation] = useState({
    state: place.location?.state?._id || place.location?.state || '', district: place.location?.district?._id || place.location?.district || '',
    city: place.location?.city?._id || place.location?.city || '', area: place.location?.area?._id || place.location?.area || '', areaText: place.location?.areaText || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const editItem = (key, index, field, value) => update(key, form[key].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));

  const save = async (event) => {
    event?.preventDefault();
    setError(''); setMessage('');
    const missing = [!form.name.trim() && 'business name', !form.address.trim() && 'address', !location.state && 'state', !location.district && 'district', !location.city && 'city', !location.areaText.trim() && 'area / locality'].filter(Boolean);
    if (missing.length) { setError(`Please complete: ${missing.join(', ')}.`); return; }
    setSaving(true);
    const gallery = form.gallery.slice(0, 12);
    const categorySpecific = { ...specific, aboutDescription: form.about, aboutImage: form.aboutImage, doctors: form.doctors.filter((item) => item.name), skinServices: form.skinServices.filter((item) => item.caption), keyFeatures: form.keyFeatures.filter((item) => item.title) };
    const payload = {
      name: form.name, category: categoryId || place.category?._id || place.category, subcategory: subcategoryId || place.subcategory?._id || place.subcategory || undefined,
      phone: form.phone || undefined, email: form.email || undefined, website: form.website || undefined, logo: form.logo || undefined, coverImage: form.coverImage || undefined,
      address: form.address, description: form.heroDescription, services: categorySpecific.skinServices.map((item) => item.caption), images: gallery,
      socialLinks: { ...form.social, whatsapp: form.whatsapp || form.phone || undefined }, location: { ...location, area: location.area || null },
      attributes: { ...(place.attributes || {}), tagline: form.tagline, businessProfile: { ...(place.attributes?.businessProfile || {}), businessType: 'healthcare', common: { ...common, businessName: form.name, logo: form.logo, coverImage: form.coverImage, gallery, videos: form.videos, phone: form.phone, whatsapp: form.whatsapp, email: form.email, website: form.website, address: form.address, about: form.about, heroDescription: form.heroDescription, tagline: form.tagline, socialLinks: { ...form.social, whatsapp: form.whatsapp || form.phone } }, categorySpecific } },
    };
    try {
      if (create) { await api.post('/places', payload); setMessage('Skin care listing submitted for approval.'); setTimeout(() => navigate('/business/dashboard'), 1000); }
      else { await api.put(`/places/${place._id}`, payload); setMessage('Skin care profile updated successfully.'); }
    } catch (saveError) { setError(saveError.response?.data?.message || saveError.message || 'Unable to save this skin care profile.'); }
    finally { setSaving(false); }
  };

  const FormWrapper = embedded ? 'div' : 'form';
  return <div className={`${embedded ? '' : 'min-h-screen bg-rose-50/60 px-4 py-8 sm:px-8'} text-slate-900`}><div className="mx-auto max-w-5xl">{!embedded && <button type="button" onClick={onBack || (() => navigate('/business/dashboard'))} className="text-sm font-semibold text-rose-800">← {onBack ? 'Back' : 'Back to Dashboard'}</button>}<h1 className="mt-3 text-3xl font-extrabold">{create ? 'Add Skin Care Clinic' : 'Skin Care Clinic Profile'}</h1><p className="mt-2 text-sm text-slate-600">Add the clinic details and content that visitors will see on your page.</p>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
    <FormWrapper onSubmit={embedded ? undefined : save} className="mt-6 space-y-6">
      <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-xl font-bold">Clinic information</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{[['name','Clinic name'],['phone','Contact phone'],['whatsapp','WhatsApp number'],['email','Email'],['website','Website'],['tagline','Hero tagline']].map(([key,label])=><label key={key} className="text-sm font-medium">{label}<input value={form[key]} onChange={(event)=>update(key,event.target.value)} className={inputClass}/></label>)}</div><label className="mt-4 block text-sm font-medium">Hero description<textarea rows={3} value={form.heroDescription} onChange={(event)=>update('heroDescription',event.target.value)} className={inputClass} placeholder="A short introduction shown below the hero heading"/></label><div className="mt-4"><LocationCascadeFields value={location} onChange={setLocation}/></div><label className="mt-4 block text-sm font-medium">Address<textarea rows={2} value={form.address} onChange={(event)=>update('address',event.target.value)} className={inputClass}/></label><div className="mt-4 grid gap-4 sm:grid-cols-2"><BusinessMediaUploader label="Clinic logo" value={form.logo} onChange={(value)=>update('logo',value)} placeId={place._id}/><BusinessMediaUploader label="Hero image" value={form.coverImage} onChange={(value)=>update('coverImage',value)} placeId={place._id}/></div></section>
      <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-xl font-bold">About the clinic</h2><label className="mt-4 block text-sm font-medium">About description<textarea rows={5} value={form.about} onChange={(event)=>update('about',event.target.value)} className={inputClass}/></label><div className="mt-4"><BusinessMediaUploader label="About section image" value={form.aboutImage} onChange={(value)=>update('aboutImage',value)} placeId={place._id}/></div></section>
      <Repeater title="Meet our dermatologists" buttonText="Add dermatologist" items={form.doctors} makeItem={()=>({name:'',photo:'',qualification:'',speciality:'',description:'',consultationTimings:''})} onChange={(items)=>update('doctors',items)}>{(doctor,index)=><><label className="text-sm font-medium">Name<input value={doctor.name||''} onChange={(event)=>editItem('doctors',index,'name',event.target.value)} className={inputClass}/></label><label className="text-sm font-medium">Qualification<input value={doctor.qualification||''} onChange={(event)=>editItem('doctors',index,'qualification',event.target.value)} className={inputClass} placeholder="MBBS, MD Dermatology"/></label><label className="text-sm font-medium">Speciality<input value={doctor.speciality||''} onChange={(event)=>editItem('doctors',index,'speciality',event.target.value)} className={inputClass}/></label><label className="text-sm font-medium">Consultation timings<input value={doctor.consultationTimings||''} onChange={(event)=>editItem('doctors',index,'consultationTimings',event.target.value)} className={inputClass}/></label><label className="text-sm font-medium sm:col-span-2">About the dermatologist<textarea rows={3} value={doctor.description||''} onChange={(event)=>editItem('doctors',index,'description',event.target.value)} className={inputClass}/></label><div className="sm:col-span-2"><BusinessMediaUploader label="Dermatologist photo" value={doctor.photo||''} onChange={(value)=>editItem('doctors',index,'photo',value)} placeId={place._id}/></div></>}</Repeater>
      <Repeater title="Our skin care services" buttonText="Add service" items={form.skinServices} makeItem={()=>({caption:'',description:'',image:''})} onChange={(items)=>update('skinServices',items)}>{(item,index)=><><label className="text-sm font-medium">Service name / caption<input value={item.caption||''} onChange={(event)=>editItem('skinServices',index,'caption',event.target.value)} className={inputClass}/></label><label className="text-sm font-medium">Description<textarea rows={2} value={item.description||''} onChange={(event)=>editItem('skinServices',index,'description',event.target.value)} className={inputClass}/></label><div className="sm:col-span-2"><BusinessMediaUploader label="Service image" value={item.image||''} onChange={(value)=>editItem('skinServices',index,'image',value)} placeId={place._id}/></div></>}</Repeater>
      <Repeater title="Why choose our clinic?" buttonText="Add feature" items={form.keyFeatures} makeItem={()=>({title:'',description:'',icon:'✦'})} onChange={(items)=>update('keyFeatures',items)}>{(item,index)=><><label className="text-sm font-medium">Icon (emoji or symbol)<input value={item.icon||''} onChange={(event)=>editItem('keyFeatures',index,'icon',event.target.value)} className={inputClass}/></label><label className="text-sm font-medium">Caption<input value={item.title||''} onChange={(event)=>editItem('keyFeatures',index,'title',event.target.value)} className={inputClass}/></label><label className="text-sm font-medium sm:col-span-2">Description<textarea rows={2} value={item.description||''} onChange={(event)=>editItem('keyFeatures',index,'description',event.target.value)} className={inputClass}/></label></>}</Repeater>
      <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7"><BusinessMediaUploader label="Photo gallery" helpText="Upload multiple images or add image URLs. Up to 12 photos." value={form.gallery} onChange={(value)=>update('gallery',value)} placeId={place._id} multiple max={12}/></section>
      <BusinessVideoUploader label="Video gallery" value={form.videos} onChange={(value)=>update('videos',value)} placeId={place._id}/>
      <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-xl font-bold">Social links</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{[['instagram','Instagram'],['facebook','Facebook'],['youtube','YouTube']].map(([key,label])=><label key={key} className="text-sm font-medium">{label}<input value={form.social[key]||''} onChange={(event)=>update('social',{...form.social,[key]:event.target.value})} className={inputClass} placeholder="https://"/></label>)}</div></section>
      <div className="flex justify-end gap-3"><button type="button" onClick={onBack || (()=>navigate('/business/dashboard'))} className="rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold">Cancel</button><button type={embedded ? 'button' : 'submit'} onClick={embedded ? () => save() : undefined} disabled={saving} className="rounded-xl bg-rose-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving?'Saving...':create?'Submit listing':'Save changes'}</button></div>
    </FormWrapper>
  </div></div>;
}

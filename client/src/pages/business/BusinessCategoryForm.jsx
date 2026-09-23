import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CommonBusinessFields from '../../components/business/CommonBusinessFields';
import CategorySpecificFields from '../../components/business/CategorySpecificFields';
import FoodBusinessCreateForm from './FoodBusinessCreateForm';
import WeddingBusinessCreateForm from './WeddingBusinessCreateForm';
import PropertyBusinessCreateForm from './PropertyBusinessCreateForm';
import { BUSINESS_GROUPS, findCategoryByName, getBusinessForm, getBusinessType, getGroupForPlace, getSubcategoriesForGroup, getStoredCategoryValues } from '../../components/business/businessTaxonomy';

const emptyHours = Object.fromEntries(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => [day, { open: '', close: '', closed: false }]));
const emptyForm = { name: '', category: '', subcategory: '', phone: '', whatsapp: '', email: '', website: '', logo: '', coverImage: '', gallery: [], address: '', pincode: '', description: '', socialLinks: '', hours: emptyHours, specific: {} };
const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';

const asText = (value) => Array.isArray(value) ? value.join('\n') : value || '';
const asList = (value) => Array.isArray(value) ? value : String(value || '').split(/[\n,]/).map((item) => item.trim()).filter(Boolean);

export default function BusinessCategoryForm({ place = null }) {
  const navigate = useNavigate();
  const isEdit = Boolean(place?._id);
  const [categories, setCategories] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [location, setLocation] = useState({ state: '', district: '', city: '', area: '' });
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(Boolean(place));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(Array.isArray(data?.data) ? data.data : [])).catch(() => setError('Unable to load business categories.'));
  }, []);

  useEffect(() => {
    if (!place || !categories.length) return;
    const group = getGroupForPlace(place);
    const categoryName = place.subcategory?.name || place.category?.name || '';
    const categoryRecord = place.category?._id ? place.category : findCategoryByName(categories, place.category?.name || place.category?.slug);
    const subcategoryRecord = place.subcategory?._id ? place.subcategory : null;
    setSelectedGroup(group?.name || '');
    setSelectedSubcategory((subcategoryRecord || categoryRecord)?._id || '');
    setForm({
      ...emptyForm,
      name: place.name || '', category: categoryRecord?._id || '', subcategory: subcategoryRecord?._id || '',
      phone: place.phone || '', whatsapp: place.socialLinks?.whatsapp || '', email: place.email || '', website: place.website || '',
      logo: place.logo || '', coverImage: place.coverImage || '', gallery: Array.isArray(place.images) ? place.images : [],
      address: place.address || '', pincode: place.attributes?.businessProfile?.common?.pincode || '', description: place.description || '',
      socialLinks: [place.socialLinks?.facebook, place.socialLinks?.instagram, place.socialLinks?.youtube].filter(Boolean).join('\n'),
      hours: Array.isArray(place.workingHours) ? place.workingHours.reduce((all, item) => ({ ...all, [item.day]: item }), { ...emptyHours }) : emptyHours,
      specific: place.attributes?.businessProfile?.categorySpecific || {},
    });
    setLocation({ state: place.location?.state?._id || '', district: place.location?.district?._id || '', city: place.location?.city?._id || '', area: place.location?.area?._id || '' });
    setLoading(false);
  }, [place, categories]);

  const group = useMemo(() => BUSINESS_GROUPS.find((item) => item.name === selectedGroup), [selectedGroup]);
  const subcategories = useMemo(() => getSubcategoriesForGroup(categories, group), [categories, group]);
  const subcategoryRecord = subcategories.find((item) => item._id === selectedSubcategory);
  const selectedCategoryRecord = useMemo(() => {
    if (!group || !subcategoryRecord) return null;
    return getStoredCategoryValues(categories, group, subcategoryRecord.name).category;
  }, [categories, group, subcategoryRecord]);
  const isFoodParent = selectedCategoryRecord?.name === 'Food & Dining';

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const updateSpecific = (field, value) => setForm((current) => ({ ...current, specific: { ...current.specific, [field]: value } }));

  const chooseGroup = (event) => {
    const nextGroup = event.target.value;
    const next = BUSINESS_GROUPS.find((item) => item.name === nextGroup);
    const nextChildren = getSubcategoriesForGroup(categories, next);
    const first = nextChildren[0];
    const records = getStoredCategoryValues(categories, next, first?.name);
    setSelectedGroup(nextGroup);
    setSelectedSubcategory(first?._id || '');
    setForm((current) => ({ ...current, category: records.category?._id || '', subcategory: records.subcategory?._id || '', specific: {} }));
  };

  const chooseSubcategory = (event) => {
    const next = subcategories.find((item) => item._id === event.target.value);
    const records = getStoredCategoryValues(categories, group, next?.name);
    setSelectedSubcategory(next?._id || '');
    setForm((current) => ({ ...current, category: records.category?._id || '', subcategory: records.subcategory?._id || '', specific: {} }));
  };

  if (!isEdit && selectedGroup === 'Food & Dining') {
    return <FoodBusinessCreateForm categories={categories} onBack={() => setSelectedGroup('')} />;
  }
  if (!isEdit && selectedGroup === 'Marriage & Wedding') {
    return <WeddingBusinessCreateForm categories={categories} onBack={() => setSelectedGroup('')} />;
  }
  if (!isEdit && selectedGroup === 'Real Estate & Construction') {
    return <PropertyBusinessCreateForm categories={categories} onBack={() => setSelectedGroup('')} />;
  }

  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    const categoryName = selectedCategoryRecord?.name || subcategoryRecord?.name || '';
    const subcategoryName = isFoodParent ? subcategoryRecord?.name : '';
    const businessType = getBusinessType(categoryName, subcategoryName);
    const common = {
      businessName: form.name, logo: form.logo, coverImage: form.coverImage, gallery: form.gallery.slice(0, 10), phone: form.phone,
      whatsapp: form.whatsapp, email: form.email, website: form.website, address: form.address, pincode: form.pincode,
      about: form.description, socialLinks: form.socialLinks.split(/\n|,/).map((item) => item.trim()).filter(Boolean),
    };
    const payload = {
      name: form.name, category: form.category, subcategory: form.subcategory || undefined, address: form.address, description: form.description,
      phone: form.phone || undefined, email: form.email || undefined, website: form.website || undefined, logo: form.logo || undefined,
      coverImage: form.coverImage || undefined, images: form.gallery.slice(0, 10), services: asList(form.specific['Medical Services'] || form.specific.Services || form.specific['Professional Services']),
      facilities: asList(form.specific.Facilities), socialLinks: { whatsapp: form.whatsapp || undefined },
      workingHours: Object.entries(form.hours).map(([day, values]) => ({ day, ...values })), location,
      attributes: { ...(place?.attributes || {}), businessProfile: { ...(place?.attributes?.businessProfile || {}), businessType, common, categorySpecific: form.specific } },
    };
    try {
      if (isEdit) await api.put(`/places/${place._id}`, payload);
      else await api.post('/places', payload);
      setSuccess(isEdit ? 'Business updated successfully.' : 'Business submitted and sent for approval.');
      if (!isEdit) setTimeout(() => navigate('/business/dashboard'), 1000);
    } catch (saveError) {
      setError(saveError.response?.data?.message || saveError.message || 'Unable to save this business.');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="container-page py-20 text-center text-ink/50">Loading business form...</div>;

  return <div className="container-page py-12"><div className="mx-auto max-w-5xl">
    <button type="button" onClick={() => navigate('/business/dashboard')} className="text-sm font-semibold text-ink">← Back to Dashboard</button>
    <h1 className="mt-4 font-display text-3xl font-semibold text-ink">{isEdit ? 'Edit Business' : 'Add Business'}</h1>
    <p className="mt-1 text-sm text-ink/55">Choose a category first. The subcategory-specific form updates immediately.</p>
    {error && <div className="mt-4 rounded border border-vermilion/30 bg-vermilion/10 p-3 text-sm text-vermilion">{error}</div>}
    {success && <div className="mt-4 rounded border border-moss/30 bg-moss/10 p-3 text-sm text-moss">{success}</div>}
    <form onSubmit={save} className="mt-8 grid grid-cols-2 gap-4">
      <section className="col-span-2 rounded border border-line bg-white p-5"><h2 className="font-display text-xl font-semibold text-ink">Select Business Category</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm text-ink/70">Category<select required value={selectedGroup} onChange={chooseGroup} className={inputClass}><option value="">Select category</option>{BUSINESS_GROUPS.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label><label className="text-sm text-ink/70">Subcategory<select required value={selectedSubcategory} onChange={chooseSubcategory} disabled={!selectedGroup} className={inputClass}><option value="">Select subcategory</option>{subcategories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label></div></section>
      <section className="col-span-2 rounded border border-line bg-white p-5"><h2 className="font-display text-xl font-semibold text-ink">Common Business Information</h2><div className="mt-4 grid grid-cols-2 gap-4"><CommonBusinessFields form={form} update={update} location={location} setLocation={setLocation} placeId={place?._id} /></div></section>
      <section className="col-span-2 rounded border border-line bg-paper/70 p-5"><h2 className="font-display text-xl font-semibold text-ink">{subcategoryRecord?.name || getBusinessForm(selectedGroup) || 'Category'} Form</h2><div className="mt-4 grid grid-cols-2 gap-4"><CategorySpecificFields groupName={selectedGroup} subcategoryName={subcategoryRecord?.name} values={form.specific} onChange={updateSpecific} /></div></section>
      <div className="col-span-2 flex justify-end gap-3"><button type="button" onClick={() => navigate('/business/dashboard')} className="rounded border border-line bg-white px-4 py-2.5 text-sm text-ink">Cancel</button><button type="submit" disabled={saving || !form.category} className="rounded bg-ink px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-60">{saving ? 'Saving...' : isEdit ? 'Save changes' : 'Submit listing'}</button></div>
    </form>
  </div></div>;
}

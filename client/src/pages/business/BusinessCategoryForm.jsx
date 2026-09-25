import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CommonBusinessFields from '../../components/business/CommonBusinessFields';
import CategorySpecificFields from '../../components/business/CategorySpecificFields';
import FoodBusinessCreateForm from './FoodBusinessCreateForm';
import WeddingBusinessCreateForm from './WeddingBusinessCreateForm';
import PropertyBusinessCreateForm from './PropertyBusinessCreateForm';
import HealthcareBusinessCreateForm from './HealthcareBusinessCreateForm';
import GenericBusinessCreateForm from './GenericBusinessCreateForm';
import { BUSINESS_GROUPS, findCategoryByName, getBusinessForm, getBusinessType, getGroupForPlace, getSubcategoriesForGroup, getStoredCategoryValues } from '../../components/business/businessTaxonomy';
import { CATEGORY_ICONS } from '../../data/categoryGroups';

// Groups that have dedicated rich forms (handled separately)
const DEDICATED_GROUPS = new Set(['Food & Dining', 'Healthcare & Medical', 'Marriage & Wedding', 'Real Estate & Construction']);

// Groups that use the generic editor
const GENERIC_GROUPS = new Set([
  'Education & Learning',
  'Religious & Social',
  'Travel & Hospitality',
  'Shopping & Retail',
  'Automotive',
  'Industries & Manufacturing',
  'Business & Professional Services',
  'Logistics & Moving',
  'Arts & Creative',
]);

const emptyHours = Object.fromEntries(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => [day, { open: '', close: '', closed: false }]));
const emptyForm = { name: '', category: '', subcategory: '', phone: '', whatsapp: '', email: '', website: '', logo: '', coverImage: '', gallery: [], videos: [], address: '', pincode: '', description: '', socialLinks: '', hours: emptyHours, specific: {} };
const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';

const asText = (value) => Array.isArray(value) ? value.join('\n') : value || '';
const asList = (value) => Array.isArray(value) ? value : String(value || '').split(/[\n,]/).map((item) => item.trim()).filter(Boolean);

// Accent colors for category cards
const GROUP_CARD_STYLE = {
  'Education & Learning': { icon: '🎓', gradient: 'from-blue-50 to-sky-100', border: 'border-blue-200', accent: '#0369a1' },
  'Healthcare & Medical': { icon: '🏥', gradient: 'from-rose-50 to-red-100', border: 'border-red-200', accent: '#be123c' },
  'Religious & Social': { icon: '🛕', gradient: 'from-orange-50 to-amber-100', border: 'border-orange-200', accent: '#c2410c' },
  'Marriage & Wedding': { icon: '💍', gradient: 'from-pink-50 to-rose-100', border: 'border-pink-200', accent: '#be185d' },
  'Travel & Hospitality': { icon: '🧳', gradient: 'from-green-50 to-emerald-100', border: 'border-green-200', accent: '#15803d' },
  'Real Estate & Construction': { icon: '🏠', gradient: 'from-amber-50 to-yellow-100', border: 'border-amber-200', accent: '#92400e' },
  'Food & Dining': { icon: '🍴', gradient: 'from-red-50 to-orange-100', border: 'border-red-200', accent: '#a83f32' },
  'Shopping & Retail': { icon: '🏬', gradient: 'from-violet-50 to-purple-100', border: 'border-purple-200', accent: '#7e22ce' },
  'Automotive': { icon: '🚗', gradient: 'from-yellow-50 to-amber-100', border: 'border-yellow-200', accent: '#b45309' },
  'Industries & Manufacturing': { icon: '🏭', gradient: 'from-teal-50 to-green-100', border: 'border-teal-200', accent: '#0f766e' },
  'Business & Professional Services': { icon: '💼', gradient: 'from-indigo-50 to-blue-100', border: 'border-indigo-200', accent: '#3730a3' },
  'Logistics & Moving': { icon: '📦', gradient: 'from-orange-50 to-red-100', border: 'border-orange-200', accent: '#c2410c' },
  'Arts & Creative': { icon: '🎨', gradient: 'from-fuchsia-50 to-pink-100', border: 'border-fuchsia-200', accent: '#a21caf' },
};

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
    const categoryRecord = place.category?._id ? place.category : findCategoryByName(categories, place.category?.name || place.category?.slug);
    const subcategoryRecord = place.subcategory?._id ? place.subcategory : null;
    setSelectedGroup(group?.name || '');
    setSelectedSubcategory((subcategoryRecord || categoryRecord)?._id || '');
    setForm({
      ...emptyForm,
      name: place.name || '', category: categoryRecord?._id || '', subcategory: subcategoryRecord?._id || '',
      phone: place.phone || '', whatsapp: place.socialLinks?.whatsapp || '', email: place.email || '', website: place.website || '',
      logo: place.logo || '', coverImage: place.coverImage || '', gallery: Array.isArray(place.images) ? place.images : [],
      videos: Array.isArray(place.attributes?.businessProfile?.common?.videos) ? place.attributes.businessProfile.common.videos : [],
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

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const updateSpecific = (field, value) => setForm((current) => ({ ...current, specific: { ...current.specific, [field]: value } }));

  const chooseGroup = (groupName) => {
    const next = BUSINESS_GROUPS.find((item) => item.name === groupName);
    const nextChildren = getSubcategoriesForGroup(categories, next);
    const first = nextChildren[0];
    const records = getStoredCategoryValues(categories, next, first?.name);
    setSelectedGroup(groupName);
    setSelectedSubcategory(first?._id || '');
    setForm((current) => ({ ...current, category: records.category?._id || '', subcategory: records.subcategory?._id || '', specific: {} }));
  };

  const chooseSubcategory = (event) => {
    const next = subcategories.find((item) => item._id === event.target.value);
    const records = getStoredCategoryValues(categories, group, next?.name);
    setSelectedSubcategory(next?._id || '');
    setForm((current) => ({ ...current, category: records.category?._id || '', subcategory: records.subcategory?._id || '', specific: {} }));
  };

  // ── Create mode: route to dedicated forms ──────────────────────────────
  if (!isEdit && selectedGroup === 'Food & Dining') {
    return <FoodBusinessCreateForm categories={categories} onBack={() => setSelectedGroup('')} />;
  }
  if (!isEdit && selectedGroup === 'Marriage & Wedding') {
    return <WeddingBusinessCreateForm categories={categories} onBack={() => setSelectedGroup('')} />;
  }
  if (!isEdit && selectedGroup === 'Real Estate & Construction') {
    return <PropertyBusinessCreateForm categories={categories} onBack={() => setSelectedGroup('')} />;
  }
  if (!isEdit && selectedGroup === 'Healthcare & Medical') {
    return <HealthcareBusinessCreateForm categories={categories} onBack={() => setSelectedGroup('')} />;
  }
  // Generic create form for remaining 9 groups
  if (!isEdit && GENERIC_GROUPS.has(selectedGroup)) {
    return <GenericBusinessCreateForm groupName={selectedGroup} categories={categories} onBack={() => setSelectedGroup('')} />;
  }

  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    const categoryName = selectedCategoryRecord?.name || subcategoryRecord?.name || '';
    const subcategoryName = subcategoryRecord?.name || '';
    const businessType = getBusinessType(categoryName, subcategoryName);
    const common = {
      businessName: form.name, logo: form.logo, coverImage: form.coverImage, gallery: form.gallery.slice(0, 10),
      videos: form.videos || [], phone: form.phone,
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

  // ── Category selection UI (card grid) or full form ──────────────────────
  if (!isEdit && !selectedGroup) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-5xl">
          <button type="button" onClick={() => navigate('/business/dashboard')} className="text-sm font-semibold text-ink">← Back to Dashboard</button>
          <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Add Business</h1>
          <p className="mt-2 text-sm text-ink/55">Select your business category to get started.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BUSINESS_GROUPS.map((g) => {
              const style = GROUP_CARD_STYLE[g.name] || { icon: '🏢', gradient: 'from-slate-50 to-gray-100', border: 'border-gray-200', accent: '#334155' };
              return (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => chooseGroup(g.name)}
                  className={`group flex flex-col items-start gap-3 rounded-2xl border bg-gradient-to-br ${style.gradient} ${style.border} p-5 text-left shadow-sm transition hover:shadow-md hover:scale-[1.02]`}
                >
                  <span className="text-4xl">{style.icon}</span>
                  <div>
                    <p className="font-display text-base font-semibold text-ink">{g.name}</p>
                    <p className="mt-0.5 text-xs text-ink/55">{g.children.slice(0, 3).join(', ')}{g.children.length > 3 ? '...' : ''}</p>
                  </div>
                  <span className="mt-auto text-xs font-bold" style={{ color: style.accent }}>Select →</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={() => isEdit ? navigate('/business/dashboard') : setSelectedGroup('')} className="text-sm font-semibold text-ink">
          ← {isEdit ? 'Back to Dashboard' : 'Back to categories'}
        </button>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">{isEdit ? 'Edit Business' : `Add ${selectedGroup}`}</h1>
        <p className="mt-1 text-sm text-ink/55">Choose a subcategory. The form updates immediately.</p>
        {error && <div className="mt-4 rounded border border-vermilion/30 bg-vermilion/10 p-3 text-sm text-vermilion">{error}</div>}
        {success && <div className="mt-4 rounded border border-moss/30 bg-moss/10 p-3 text-sm text-moss">{success}</div>}
        <form onSubmit={save} className="mt-8 grid grid-cols-2 gap-4">
          <section className="col-span-2 rounded border border-line bg-white p-5">
            <h2 className="font-display text-xl font-semibold text-ink">Business Category</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Category (group) selector — show as read-only when only editing */}
              {isEdit ? (
                <label className="text-sm text-ink/70">
                  Category
                  <select value={selectedGroup} onChange={(e) => chooseGroup(e.target.value)} className={inputClass}>
                    <option value="">Select category</option>
                    {BUSINESS_GROUPS.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                  </select>
                </label>
              ) : (
                <label className="text-sm text-ink/70">
                  Category
                  <div className={`${inputClass} bg-slate-50 font-semibold`}>{selectedGroup}</div>
                </label>
              )}
              <label className="text-sm text-ink/70">
                Subcategory
                <select required value={selectedSubcategory} onChange={chooseSubcategory} disabled={!selectedGroup} className={inputClass}>
                  <option value="">Select subcategory</option>
                  {subcategories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
                </select>
              </label>
            </div>
          </section>
          <section className="col-span-2 rounded border border-line bg-white p-5">
            <h2 className="font-display text-xl font-semibold text-ink">Common Business Information</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <CommonBusinessFields form={form} update={update} location={location} setLocation={setLocation} placeId={place?._id} />
            </div>
          </section>
          <section className="col-span-2 rounded border border-line bg-paper/70 p-5">
            <h2 className="font-display text-xl font-semibold text-ink">{subcategoryRecord?.name || getBusinessForm(selectedGroup) || 'Category'} Form</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <CategorySpecificFields groupName={selectedGroup} subcategoryName={subcategoryRecord?.name} values={form.specific} onChange={updateSpecific} />
            </div>
          </section>
          <div className="col-span-2 flex justify-end gap-3">
            <button type="button" onClick={() => isEdit ? navigate('/business/dashboard') : setSelectedGroup('')} className="rounded border border-line bg-white px-4 py-2.5 text-sm text-ink">Cancel</button>
            <button type="submit" disabled={saving || !form.category} className="rounded bg-ink px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-60">{saving ? 'Saving...' : isEdit ? 'Save changes' : 'Submit listing'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

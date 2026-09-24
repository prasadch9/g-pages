import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LocationCascadeFields from '../../components/LocationCascadeFields';
import { BUSINESS_CATEGORY_GROUPS, getCategoryConfig } from '../../data/businessConfig';

const initialLocation = { state: '', district: '', city: '', area: '' };
const initialForm = {
  name: '',
  category: '',
  address: '',
  description: '',
  phone: '',
  email: '',
  website: '',
  services: '',
  coverImage: '',
  galleryImages: '',
  facilities: '',
  video: '',
  board: '',
  classes: '',
  facebook: '',
  instagram: '',
  whatsapp: '',
  categoryData: {},
};

const splitList = (value) => value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);

export default function CreateListing() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState(initialLocation);
  const [form, setForm] = useState(initialForm);
  const [businessGroup, setBusinessGroup] = useState('');
  const [photoFiles, setPhotoFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => {});
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const selectedGroup = BUSINESS_CATEGORY_GROUPS.find((group) => group.slug === businessGroup);
  const targetedCategories = categories.filter((category) => selectedGroup?.children.includes(category.name));
  const selectedCategory = categories.find((category) => category._id === form.category);
  const categoryConfig = getCategoryConfig(form.subcategory || selectedCategory?.name);
  const selectedCategoryName = form.subcategory || selectedCategory?.name || 'No category selected';

  const selectGroup = (value) => {
    setBusinessGroup(value);
    setForm({ ...form, category: '', subcategory: '' });
  };

  const updateCategoryData = (field, value) => setForm((current) => ({
    ...current,
    categoryData: { ...current.categoryData, [field]: value },
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!reviewing) {
      if (!form.category || (businessGroup && !form.subcategory)) {
        setError('Please select a category and subcategory.');
        return;
      }
      setReviewing(true);
      return;
    }

    if (!location.state || !location.district || !location.city) {
      setError('Please select state, district and city.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        subcategory: form.subcategory || undefined,
        address: form.address,
        description: form.description,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        services: splitList(form.services),
        facilities: splitList(form.facilities),
        images: splitList(form.galleryImages),
        coverImage: form.coverImage || undefined,
        video: form.video || undefined,
        socialLinks: {
          facebook: form.facebook || undefined,
          instagram: form.instagram || undefined,
          whatsapp: form.whatsapp || undefined,
        },
        categoryData: Object.fromEntries(Object.entries(form.categoryData).map(([key, value]) => [key, key === 'experience' || key.endsWith('Type') || key.endsWith('Title') || key.endsWith('Coverage') ? value : splitList(value)])),
        location: {
          state: location.state,
          district: location.district,
          city: location.city,
          area: location.area || undefined,
        },
      };

      const submission = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined) return;
        submission.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      });
      photoFiles.forEach((file) => submission.append('photos', file));
      videoFiles.forEach((file) => submission.append('videos', file));
      await api.post('/places', submission, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Listing submitted! It will appear publicly once an admin approves it.');
      setTimeout(() => navigate('/business/dashboard'), 1600);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-ink">List your business</h1>
        <p className="mt-1 text-sm text-ink/55">
          Submitted listings go live after a quick admin review — usually within 24 hours.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-vermilion">Step 1 · Business type</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {BUSINESS_CATEGORY_GROUPS.map((group) => {
                const isSelected = businessGroup === group.slug;
                return (
                  <button
                    key={group.slug}
                    type="button"
                    onClick={() => selectGroup(group.slug)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-vermilion bg-vermilion/5 shadow-sm ring-1 ring-vermilion/20'
                        : 'border-line bg-white hover:border-cyan-300 hover:bg-cyan-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-ink">{group.name}</span>
                      <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55">
                        {group.children.length}+
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-ink/55">{group.children.slice(0, 3).join(', ')}{group.children.length > 3 ? '…' : ''}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {businessGroup ? (
            <div className="col-span-2">
              <label className="text-sm text-ink/70">Choose subcategory</label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {targetedCategories.map((category) => {
                  const active = form.category === category._id;
                  return (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => setForm({ ...form, category: category._id, subcategory: category.name })}
                      className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                        active ? 'border-cyan-600 bg-cyan-50 text-cyan-900 ring-1 ring-cyan-200' : 'border-line bg-white text-ink hover:border-cyan-300 hover:bg-cyan-50/20'
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-ink/50">Selected: {selectedCategoryName}</p>
            </div>
          ) : (
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm text-ink/70">Category</label>
              <select required value={form.category} onChange={update('category')} className={inputClass}>
                <option value="">Select category</option>
                {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
              </select>
            </div>
          )}

          {reviewing && <div className="col-span-2 rounded-xl border border-moss/30 bg-moss/5 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">Final review · Not public yet</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink">{form.name || 'Unnamed business'}</h2>
            <p className="mt-1 text-sm text-ink/60">Premium business page · {selectedCategory?.name || form.subcategory || 'Category not selected'}</p>
            <p className="mt-3 text-sm text-ink/65">{form.address || 'Address not entered'} · {form.phone || 'Phone not entered'}</p>
            <div className="mt-4 flex gap-2"><button type="button" onClick={() => setReviewing(false)} className="rounded border border-line px-4 py-2 text-sm">Edit</button><span className="rounded bg-moss/10 px-3 py-2 text-xs font-medium text-moss">Admin approval required</span></div>
          </div>}

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Business name</label>
            <input required value={form.name} onChange={update('name')} className={inputClass} />
          </div>

          {!businessGroup && <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Category</label>
            <select required value={form.category} onChange={update('category')} className={inputClass}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>}
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Phone</label>
            <input value={form.phone} onChange={update('phone')} className={inputClass} />
          </div>

          <LocationCascadeFields value={location} onChange={setLocation} />

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Address</label>
            <input required value={form.address} onChange={update('address')} className={inputClass} />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Description</label>
            <textarea required rows={4} value={form.description} onChange={update('description')} className={inputClass} />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Email</label>
            <input type="email" value={form.email} onChange={update('email')} className={inputClass} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Website</label>
            <input value={form.website} onChange={update('website')} placeholder="https://" className={inputClass} />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Services (comma-separated)</label>
            <input value={form.services} onChange={update('services')} placeholder="Home delivery, Dine-in, Takeaway" className={inputClass} />
          </div>

          <div className="col-span-2">
            <h2 className="font-display text-lg font-medium text-ink">Photos and facilities</h2>
            <p className="mt-1 text-xs text-ink/50">All of these are optional. Separate multiple values with commas or new lines.</p>
          </div>

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Cover image URL</label>
            <input value={form.coverImage} onChange={update('coverImage')} placeholder="https://…" className={inputClass} />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Gallery image URLs</label>
            <textarea rows={3} value={form.galleryImages} onChange={update('galleryImages')} placeholder="https://…\nhttps://…" className={inputClass} />
          </div>

          <div className="col-span-2 rounded-xl border border-dashed border-cyan-300 bg-cyan-50/50 p-4">
            <label className="text-sm font-medium text-cyan-900">Upload photos</label>
            <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhotoFiles(Array.from(event.target.files || []))} className="mt-2 block w-full text-sm text-ink/60 file:mr-3 file:rounded file:border-0 file:bg-cyan-700 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white" />
            {photoFiles.length > 0 && <p className="mt-2 text-xs text-cyan-800">{photoFiles.length} photo(s) ready for review.</p>}
          </div>

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Facilities</label>
            <textarea rows={2} value={form.facilities} onChange={update('facilities')} placeholder="School bus, Library, Science lab, Playground" className={inputClass} />
          </div>

          {categoryConfig.fields.length > 0 && <div className="col-span-2">
            <h2 className="font-display text-lg font-medium text-ink">{form.subcategory} details</h2>
            <p className="mt-1 text-xs text-ink/50">Only details relevant to this subcategory are shown.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {categoryConfig.fields.map((field) => (
                <div key={field.key} className={field.type === 'list' ? 'sm:col-span-2' : ''}>
                  <label className="text-sm text-ink/70">{field.label}</label>
                  {field.type === 'list' ? <textarea rows={2} value={form.categoryData[field.key] || ''} onChange={(event) => updateCategoryData(field.key, event.target.value)} placeholder={field.placeholder} className={inputClass} /> : <input value={form.categoryData[field.key] || ''} onChange={(event) => updateCategoryData(field.key, event.target.value)} placeholder={field.placeholder} className={inputClass} />}
                </div>
              ))}
            </div>
          </div>}

          <div className="col-span-2">
            <h2 className="font-display text-lg font-medium text-ink">Video and social links</h2>
            <p className="mt-1 text-xs text-ink/50">Optional. Empty links stay hidden on the public page.</p>
          </div>

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Video URL</label>
            <input value={form.video} onChange={update('video')} placeholder="https://youtube.com/watch?v=…" className={inputClass} />
          </div>
          <div className="col-span-2 rounded-xl border border-dashed border-cyan-300 bg-cyan-50/50 p-4">
            <label className="text-sm font-medium text-cyan-900">Upload videos</label>
            <input type="file" multiple accept="video/mp4,video/webm,video/quicktime" onChange={(event) => setVideoFiles(Array.from(event.target.files || []))} className="mt-2 block w-full text-sm text-ink/60 file:mr-3 file:rounded file:border-0 file:bg-cyan-700 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white" />
            {videoFiles.length > 0 && <p className="mt-2 text-xs text-cyan-800">{videoFiles.length} video(s) ready for review.</p>}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Facebook URL</label>
            <input value={form.facebook} onChange={update('facebook')} placeholder="https://facebook.com/…" className={inputClass} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Instagram URL</label>
            <input value={form.instagram} onChange={update('instagram')} placeholder="https://instagram.com/…" className={inputClass} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">WhatsApp number or link</label>
            <input value={form.whatsapp} onChange={update('whatsapp')} placeholder="https://wa.me/91…" className={inputClass} />
          </div>

          {error && <p className="col-span-2 text-sm text-vermilion">{error}</p>}
          {success && <p className="col-span-2 text-sm text-moss">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="col-span-2 mt-2 rounded bg-ink py-2.5 text-[15px] font-medium text-paper transition hover:bg-ink-light disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : reviewing ? 'Submit for admin approval' : 'Review details'}
          </button>
        </form>
      </div>
    </div>
  );
}

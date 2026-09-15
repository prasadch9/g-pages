import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LocationCascadeFields from '../../components/LocationCascadeFields';

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
  imageUrl: '',
};

export default function CreateListing() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState(initialLocation);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => {});
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!location.state || !location.district || !location.city) {
      setError('Please select state, district and city.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        address: form.address,
        description: form.description,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        services: form.services
          ? form.services.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        images: form.imageUrl ? [form.imageUrl] : [],
        location: {
          state: location.state,
          district: location.district,
          city: location.city,
          area: location.area || undefined,
        },
      };

      await api.post('/places', payload);
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
            <label className="text-sm text-ink/70">Business name</label>
            <input required value={form.name} onChange={update('name')} className={inputClass} />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Category</label>
            <select required value={form.category} onChange={update('category')} className={inputClass}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
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
            <label className="text-sm text-ink/70">Cover image URL</label>
            <input value={form.imageUrl} onChange={update('imageUrl')} placeholder="https://…" className={inputClass} />
          </div>

          {error && <p className="col-span-2 text-sm text-vermilion">{error}</p>}
          {success && <p className="col-span-2 text-sm text-moss">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="col-span-2 mt-2 rounded bg-ink py-2.5 text-[15px] font-medium text-paper transition hover:bg-ink-light disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit for approval'}
          </button>
        </form>
      </div>
    </div>
  );
}

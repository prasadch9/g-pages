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
  coverImage: '',
  galleryImages: '',
  facilities: '',
  video: '',
  board: '',
  classes: '',
  facebook: '',
  instagram: '',
  whatsapp: '',
};

const splitList = (value) => value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);

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
        attributes: {
          board: form.board || undefined,
          classes: form.classes || undefined,
        },
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

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Facilities</label>
            <textarea rows={2} value={form.facilities} onChange={update('facilities')} placeholder="School bus, Library, Science lab, Playground" className={inputClass} />
          </div>

          <div className="col-span-2">
            <h2 className="font-display text-lg font-medium text-ink">School academics</h2>
            <p className="mt-1 text-xs text-ink/50">Optional. These details appear only when provided.</p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Curriculum / board</label>
            <input value={form.board} onChange={update('board')} placeholder="CBSE, State Board, ICSE" className={inputClass} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-ink/70">Classes offered</label>
            <input value={form.classes} onChange={update('classes')} placeholder="LKG to Class 10" className={inputClass} />
          </div>

          <div className="col-span-2">
            <h2 className="font-display text-lg font-medium text-ink">Video and social links</h2>
            <p className="mt-1 text-xs text-ink/50">Optional. Empty links stay hidden on the public page.</p>
          </div>

          <div className="col-span-2">
            <label className="text-sm text-ink/70">Video URL</label>
            <input value={form.video} onChange={update('video')} placeholder="https://youtube.com/watch?v=…" className={inputClass} />
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
            {submitting ? 'Submitting…' : 'Submit for approval'}
          </button>
        </form>
      </div>
    </div>
  );
}

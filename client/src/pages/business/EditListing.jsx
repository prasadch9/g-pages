import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const fields = [
  ['name', 'Business name'],
  ['address', 'Address'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['website', 'Website'],
];

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', website: '', description: '' });
  const [place, setPlace] = useState(null);
  const [status, setStatus] = useState({ loading: true, saving: false, error: '', success: '' });
  const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';

  useEffect(() => {
    api.get('/places/mine').then(({ data }) => {
      const found = data.data.find((item) => item._id === id);
      if (!found) throw new Error('Listing not found.');
      setPlace(found);
      setForm({ name: found.name || '', address: found.address || '', phone: found.phone || '', email: found.email || '', website: found.website || '', description: found.description || '' });
    }).catch((err) => setStatus({ loading: false, saving: false, error: err.message, success: '' })).finally(() => setStatus((current) => ({ ...current, loading: false })));
  }, [id]);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: false, saving: true, error: '', success: '' });
    try {
      await api.put(`/places/${id}`, form);
      setStatus({ loading: false, saving: false, error: '', success: 'Changes saved. Your listing is back in admin review.' });
      setTimeout(() => navigate('/business/dashboard'), 1200);
    } catch (err) {
      setStatus({ loading: false, saving: false, error: err.message, success: '' });
    }
  };

  if (status.loading) return <div className="container-page py-20 text-center text-ink/50">Loading listing…</div>;
  if (!place) return <div className="container-page py-20 text-center text-vermilion">{status.error}</div>;

  return <div className="container-page py-10 sm:py-14"><div className="mx-auto max-w-3xl"><Link to="/business/dashboard" className="text-sm font-semibold text-ink/60 hover:text-ink">← Back to dashboard</Link><div className="mt-5 rounded-[1.25rem] bg-[#12395a] p-6 text-white shadow-[0_20px_55px_rgba(18,57,90,.2)] sm:p-9"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5d98d]">Business listing editor</p><h1 className="mt-2 font-display text-3xl font-semibold">Edit {place.name}</h1><p className="mt-2 text-sm text-white/70">After saving, an admin will review the changes before the listing becomes public again.</p></div><form onSubmit={handleSubmit} className="mt-6 grid gap-5 rounded-xl border border-line bg-white p-5 shadow-sm sm:p-8">{fields.map(([field, label]) => <label key={field} className="text-sm font-medium text-ink/75">{label}<input required={field === 'name' || field === 'address'} type={field === 'email' ? 'email' : 'text'} value={form[field]} onChange={update(field)} className={inputClass} /></label>)}<label className="text-sm font-medium text-ink/75">Description<textarea required rows={6} value={form.description} onChange={update('description')} className={inputClass} /></label>{status.error && <p className="text-sm text-vermilion">{status.error}</p>}{status.success && <p className="text-sm text-moss">{status.success}</p>}<button type="submit" disabled={status.saving} className="rounded bg-ink px-5 py-3 text-sm font-semibold text-paper hover:bg-ink-light disabled:opacity-60">{status.saving ? 'Saving…' : 'Save changes for approval'}</button></form></div></div>;
}

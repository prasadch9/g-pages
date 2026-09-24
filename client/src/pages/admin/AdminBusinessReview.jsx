import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { CATEGORY_MODULES } from '../../data/businessConfig';

export default function AdminBusinessReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    api.get(`/admin/businesses/${id}`).then(({ data }) => setRecord(data.data)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const review = async (action) => {
    try {
      if (action === 'reject' && !reason.trim()) { setError('A rejection reason is required.'); return; }
      await api.put(`/admin/businesses/${id}/${action}`, action === 'reject' ? { reason } : undefined);
      navigate('/admin/businesses');
    } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="p-8 text-sm text-ink/50">Loading request…</div>;
  if (error && !record) return <div className="p-8 text-sm text-vermilion">{error}</div>;
  const { place, request } = record;
  const modules = CATEGORY_MODULES[place.subcategory] || [];

  return (
    <div className="max-w-4xl">
      <Link to="/admin/businesses" className="text-sm text-ink/50 hover:text-ink">← Business requests</Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-vermilion">Admin review</p><h2 className="mt-2 font-display text-2xl font-semibold text-ink">{place.name}</h2><p className="mt-1 text-sm text-ink/55">{place.category?.name} · {place.subcategory || 'Standard category'} · Premium business page</p></div><span className="rounded-full bg-marigold/20 px-3 py-1 text-xs font-semibold text-marigold-dark">{request?.status || place.applicationStatus || place.status}</span></div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">
        <main className="flex flex-col gap-4">
          <section className="rounded-xl border border-line bg-white p-5"><h3 className="font-display text-lg font-semibold text-ink">Business details</h3><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-ink/45">Owner</dt><dd className="font-medium text-ink">{place.owner?.name}</dd></div><div><dt className="text-ink/45">Contact</dt><dd className="font-medium text-ink">{place.phone || place.email || 'Not provided'}</dd></div><div className="sm:col-span-2"><dt className="text-ink/45">Address</dt><dd className="font-medium text-ink">{place.address}</dd></div></dl><p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/65">{place.description}</p></section>
          <section className="rounded-xl border border-line bg-white p-5"><h3 className="font-display text-lg font-semibold text-ink">Services and media</h3><div className="mt-3 flex flex-wrap gap-2">{(place.services || []).map((service) => <span key={service} className="rounded-full bg-cyan-50 px-3 py-1 text-xs text-cyan-800">{service}</span>)}</div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{(place.images || []).map((image, index) => <img key={`${image}-${index}`} src={image} alt="Submitted business" className="aspect-square w-full rounded object-cover" />)}</div>{place.videos?.length > 0 && <p className="mt-3 text-sm text-ink/55">{place.videos.length} video(s) submitted.</p>}</section>
          <section className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-5"><h3 className="font-display text-lg font-semibold text-ink">Premium modules</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{modules.map((module) => <div key={module} className="rounded border border-cyan-100 bg-white px-3 py-2 text-sm text-ink/70">{module}</div>)}</div></section>
        </main>
        <aside className="h-fit rounded-xl border border-line bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-ink/45">Decision</p><Link to={`/place/${place._id}`} target="_blank" className="mt-4 block rounded border border-cyan-600 px-3 py-2 text-center text-sm font-medium text-cyan-700">Preview as admin</Link><button type="button" onClick={() => review('approve')} className="mt-3 w-full rounded bg-moss px-3 py-2 text-sm font-medium text-white">Approve &amp; publish</button><textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} placeholder="Required rejection reason" className="mt-4 w-full rounded border border-line px-3 py-2 text-sm" /><button type="button" onClick={() => review('reject')} className="mt-2 w-full rounded border border-vermilion px-3 py-2 text-sm font-medium text-vermilion">Reject request</button>{error && <p className="mt-3 text-xs text-vermilion">{error}</p>}</aside>
      </div>
    </div>
  );
}

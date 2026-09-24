import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BusinessMediaManager from '../../components/BusinessMediaManager';
import BusinessChatInbox from '../../components/BusinessChatInbox';
import { getCategoryConfig } from '../../data/businessConfig';

const STATUS_STYLES = {
  pending: 'bg-marigold/20 text-marigold-dark',
  submitted: 'bg-marigold/20 text-marigold-dark',
  under_review: 'bg-marigold/20 text-marigold-dark',
  resubmitted: 'bg-marigold/20 text-marigold-dark',
  approved: 'bg-moss/15 text-moss',
  rejected: 'bg-vermilion/10 text-vermilion',
  suspended: 'bg-ink/10 text-ink/50',
};

export default function BusinessDashboard() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/places/mine')
      .then(({ data }) => setPlaces(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const counts = places.reduce(
    (acc, p) => ({ ...acc, [p.status]: (acc[p.status] || 0) + 1 }),
    {}
  );

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Business dashboard</h1>
          <p className="mt-1 text-sm text-ink/55">Manage your listings and track their performance.</p>
        </div>
        <Link
          to="/business/listings/new"
          className="rounded bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink-light"
        >
          + Create new listing
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total listings', value: places.length },
          { label: 'Approved', value: counts.approved || 0 },
          { label: 'Pending review', value: counts.pending || 0 },
          { label: 'Rejected', value: counts.rejected || 0 },
        ].map((stat) => (
          <div key={stat.label} className="rounded border border-line bg-white/50 p-4">
            <div className="font-display text-2xl font-semibold text-ink">{stat.value}</div>
            <div className="text-xs text-ink/50">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-medium text-ink">Your listings</h2>

        {loading && <p className="mt-4 text-sm text-ink/50">Loading…</p>}
        {error && <p className="mt-4 text-sm text-vermilion">{error}</p>}

        {!loading && places.length === 0 && (
          <div className="mt-4 rounded border border-dashed border-line p-10 text-center text-sm text-ink/45">
            You haven't listed a business yet.{' '}
            <Link to="/business/listings/new" className="text-ink underline underline-offset-2">
              Create your first listing
            </Link>
          </div>
        )}

        <div className="mt-4 flex flex-col divide-y divide-line rounded border border-line bg-white/40">
          {places.map((place) => (
            <div key={place._id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-display text-[15px] font-medium text-ink">{place.name}</div>
                <div className="text-xs text-ink/45">
                  {place.category?.name} {place.subcategory ? `· ${place.subcategory}` : ''} · Premium business page · {place.views} views · {place.favoritesCount} favorites
                </div>
                {place.status === 'rejected' && place.rejectionReason && (
                  <div className="mt-1 text-xs text-vermilion">Reason: {place.rejectionReason}</div>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {getCategoryConfig(place.subcategory).modules.map((module) => <span key={module} className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] capitalize text-cyan-800">{module.replace(/[A-Z]/g, (letter) => ` ${letter}`)}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/business/listings/${place._id}/edit`}
                  state={{ editPlace: place }}
                  className="rounded border border-line px-3 py-1.5 text-xs font-medium text-ink/70 hover:text-ink"
                >
                  Update
                </Link>
                <span
                  className={`rounded-sm px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[place.status]}`}
                >
                  {place.applicationStatus || place.status}
                </span>
              </div>
              </div>
              <BusinessMediaManager place={place} onUpdated={(updated) => setPlaces((current) => current.map((item) => item._id === updated._id ? updated : item))} />
            </div>
          ))}
        </div>
      </div>
      <BusinessChatInbox />
    </div>
  );
}

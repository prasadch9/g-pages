import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PlaceCard from '../components/PlaceCard';

export default function TrendingPlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    api
      .get('/places/trending', { params: { limit: 12 } })
      .then(({ data }) => {
        if (isCurrent) setPlaces(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => {
        if (isCurrent) setHasError(true);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="flex flex-col justify-between gap-5 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-vermilion">Across the directory</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">Popular places</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/55">Places people are visiting most, with highly rated listings featured first.</p>
        </div>
        <Link to="/explore" className="text-sm font-semibold text-vermilion hover:underline">Explore by city</Link>
      </header>

      {loading ? (
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-lg border border-line bg-white/70" />)}
        </div>
      ) : hasError ? (
        <p className="mt-8 rounded-md border border-line bg-white p-5 text-sm text-ink/60" role="status">
          Popular places could not be loaded. Please try again.
        </p>
      ) : places.length > 0 ? (
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {places.map((place) => <PlaceCard key={place._id} place={place} />)}
        </div>
      ) : (
        <div className="mt-8 border-y border-line py-10">
          <h2 className="font-display text-xl font-semibold text-ink">No popular places yet</h2>
          <p className="mt-2 text-sm text-ink/55">Check back as more places are published in the directory.</p>
        </div>
      )}
    </div>
  );
}
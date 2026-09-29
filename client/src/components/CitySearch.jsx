import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CitySearch({ className = '' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);

  useEffect(() => {
    const searchTerm = query.trim();
    if (searchTerm.length < 2) {
      setCities([]);
      setLoading(false);
      setSearchFailed(false);
      return undefined;
    }

    let isCurrent = true;
    setLoading(true);
    setSearchFailed(false);
    const timer = setTimeout(() => {
      api
        .get('/locations/cities/search', { params: { q: searchTerm } })
        .then((res) => {
          if (isCurrent) setCities(Array.isArray(res.data?.data) ? res.data.data : []);
        })
        .catch(() => {
          if (isCurrent) {
            setCities([]);
            setSearchFailed(true);
          }
        })
        .finally(() => {
          if (isCurrent) setLoading(false);
        });
    }, 250);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [query]);

  const openCity = (city) => {
    const district = city.parent;
    const state = district?.parent;
    if (!state?.slug || !district?.slug || !city.slug) return;
    setQuery('');
    setCities([]);
    navigate(`/${state.slug}/${district.slug}/${city.slug}`);
  };

  const showResults = cities.length > 0 || (query.trim().length >= 2 && !loading);

  return (
    <div className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (cities[0]) openCity(cities[0]);
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setCities([]);
          }}
          placeholder="Search for a city..."
          aria-label="Search cities"
          aria-autocomplete="list"
          aria-expanded={cities.length > 0}
          className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-ink/40 sm:text-[15px]"
        />
      </form>
      {showResults && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-md border border-line bg-white py-1 shadow-lg">
          {cities.length > 0 ? cities.map((city) => (
            <button
              key={city._id}
              type="button"
              onClick={() => openCity(city)}
              className="block w-full px-3 py-2 text-left transition hover:bg-ink/5 focus:bg-ink/5 focus:outline-none"
            >
              <span className="block text-sm font-medium text-ink">{city.name}</span>
              <span className="mt-0.5 block text-xs text-ink/50">
                {[city.parent?.name, city.parent?.parent?.name].filter(Boolean).join(', ')}
              </span>
            </button>
          )) : (
            <p className="px-3 py-2 text-sm text-ink/55">
              {searchFailed ? 'City search is unavailable. Please try again.' : 'No cities found.'}
            </p>
          )}
        </div>
      )}
      {loading && <p className="px-1 pt-1 text-xs text-ink/45" role="status">Searching cities...</p>}
    </div>
  );
}
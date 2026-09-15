import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ExplorePage() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');

  useEffect(() => { api.get('/locations/states').then(({ data }) => setStates(data.data)).catch(() => {}); }, []);
  useEffect(() => { setDistrict(''); setCities([]); if (state) api.get(`/locations/districts/${state}`).then(({ data }) => setDistricts(data.data)); else setDistricts([]); }, [state]);
  useEffect(() => { if (district) api.get(`/locations/cities/${district}`).then(({ data }) => setCities(data.data)); else setCities([]); }, [district]);

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="rounded-3xl bg-ink p-7 text-paper sm:p-12"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-marigold">Explore your next stop</p><h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">Start with a city, then discover everything around it.</h1><p className="mt-4 max-w-xl text-paper/65">Select a location from the live MongoDB directory to see approved places, categories, and local businesses.</p></div>
      <div className="mt-8 grid gap-4 rounded-2xl border border-line bg-white/70 p-5 md:grid-cols-3">
        <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-lg border border-line bg-white px-3 py-3 text-sm"><option value="">Select state</option>{states.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!state} className="rounded-lg border border-line bg-white px-3 py-3 text-sm disabled:opacity-50"><option value="">Select district</option>{districts.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select>
        <select value="" onChange={() => {}} disabled={!district} className="hidden" aria-hidden="true"><option /></select>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cities.map((city) => <Link key={city._id} to={`/${states.find((item) => item._id === state)?.slug}/${districts.find((item) => item._id === district)?.slug}/${city.slug}`} className="group rounded-2xl border border-line bg-white/70 p-6 hover:-translate-y-1 hover:shadow-lg"><p className="text-xs uppercase tracking-wide text-ink/40">{districts.find((item) => item._id === district)?.name}</p><h2 className="mt-2 font-display text-2xl font-semibold text-ink group-hover:text-vermilion">{city.name}</h2><span className="mt-5 inline-block text-sm text-ink/55">Explore listings →</span></Link>)}</div>
      {!cities.length && <p className="mt-10 text-center text-sm text-ink/45">Choose a state and district to see available cities.</p>}
    </div>
  );
}

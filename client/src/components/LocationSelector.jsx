import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const FIELD_ORDER = ['state', 'district', 'city', 'area'];

function Field({ label, value, onChange, options, disabled, placeholder }) {
  return (
    <div className="flex flex-1 flex-col gap-1 px-4 py-2.5 first:pl-0 sm:border-l sm:border-line sm:first:border-l-0">
      <label className="text-[11px] tracking-wide text-ink/45">{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent font-display text-[15px] font-medium text-ink outline-none disabled:text-ink/30"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id} data-slug={opt.slug} data-name={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function LocationSelector() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const [selected, setSelected] = useState({ state: '', district: '', city: '', area: '' });
  const [slugs, setSlugs] = useState({ state: '', district: '', city: '', area: '' });

  useEffect(() => {
    api
      .get('/locations/states')
      .then(({ data }) => setStates(data.data))
      .catch(() => setStates([]));
  }, []);

  useEffect(() => {
    if (!selected.state) {
      setDistricts([]);
      return;
    }
    api
      .get(`/locations/districts/${selected.state}`)
      .then(({ data }) => setDistricts(data.data))
      .catch(() => setDistricts([]));
  }, [selected.state]);

  useEffect(() => {
    if (!selected.district) {
      setCities([]);
      return;
    }
    api
      .get(`/locations/cities/${selected.district}`)
      .then(({ data }) => setCities(data.data))
      .catch(() => setCities([]));
  }, [selected.district]);

  useEffect(() => {
    if (!selected.city) {
      setAreas([]);
      return;
    }
    api
      .get(`/locations/areas/${selected.city}`)
      .then(({ data }) => setAreas(data.data))
      .catch(() => setAreas([]));
  }, [selected.city]);

  const handleChange = (level) => (id, list) => {
    const optionsList = { state: states, district: districts, city: cities, area: areas }[level];
    const match = optionsList.find((o) => o._id === id);

    const resetFrom = FIELD_ORDER.indexOf(level) + 1;
    setSelected((prev) => {
      const next = { ...prev, [level]: id };
      FIELD_ORDER.slice(resetFrom).forEach((f) => (next[f] = ''));
      return next;
    });
    setSlugs((prev) => {
      const next = { ...prev, [level]: match?.slug || '' };
      FIELD_ORDER.slice(resetFrom).forEach((f) => (next[f] = ''));
      return next;
    });
  };

  const canExplore = selected.state && selected.district && selected.city;

  const handleExplore = () => {
    if (!canExplore) return;
    const path = `/${slugs.state}/${slugs.district}/${slugs.city}`;
    // Area narrows results on the city page rather than adding a URL segment,
    // since /state/district/city/<category> already occupies that 4th slot.
    navigate(slugs.area ? `${path}?area=${slugs.area}` : path);
  };

  return (
    <div className="rounded-md border border-line bg-white/70 p-4 shadow-[0_1px_0_0_#D9D2C2] sm:p-2">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <Field
          label="State"
          value={selected.state}
          onChange={(id) => handleChange('state')(id)}
          options={states}
          placeholder="Select state"
        />
        <Field
          label="District"
          value={selected.district}
          onChange={(id) => handleChange('district')(id)}
          options={districts}
          disabled={!selected.state}
          placeholder="Select district"
        />
        <Field
          label="City"
          value={selected.city}
          onChange={(id) => handleChange('city')(id)}
          options={cities}
          disabled={!selected.district}
          placeholder="Select city"
        />
        <Field
          label="Area (optional)"
          value={selected.area}
          onChange={(id) => handleChange('area')(id)}
          options={areas}
          disabled={!selected.city}
          placeholder="Select area"
        />
        <div className="flex items-center px-2 pt-2 sm:pt-0">
          <button
            onClick={handleExplore}
            disabled={!canExplore}
            className="w-full whitespace-nowrap rounded bg-vermilion px-6 py-3 text-[15px] font-medium text-paper transition hover:bg-vermilion/90 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40 sm:w-auto"
          >
            Explore now
          </button>
        </div>
      </div>
    </div>
  );
}

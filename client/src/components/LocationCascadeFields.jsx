import React, { useEffect, useState } from 'react';
import api from '../services/api';

function extractList(res) {
  const body = res?.data;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(res)) return res;
  return [];
}

/**
 * A plain cascading State -> District -> City -> Area picker for forms
 * (e.g. registration, business listing creation). Unlike LocationSelector,
 * this has no "Explore" button and no navigation — it just reports the
 * chosen ids upward via onChange.
 */
export default function LocationCascadeFields({ value, onChange }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    api
      .get('/locations/states')
      .then((res) => setStates(extractList(res)))
      .catch((err) => {
        console.error('[LocationCascadeFields] Failed to fetch states:', err);
        setStates([]);
      });
  }, []);

  useEffect(() => {
    if (!value.state) return setDistricts([]);
    api
      .get(`/locations/districts/${value.state}`)
      .then((res) => setDistricts(extractList(res)))
      .catch((err) => {
        console.error('[LocationCascadeFields] Failed to fetch districts:', err);
        setDistricts([]);
      });
  }, [value.state]);

  useEffect(() => {
    if (!value.district) return setCities([]);
    api
      .get(`/locations/cities/${value.district}`)
      .then((res) => setCities(extractList(res)))
      .catch((err) => {
        console.error('[LocationCascadeFields] Failed to fetch cities:', err);
        setCities([]);
      });
  }, [value.district]);

  const set = (field) => (e) => {
    const next = { ...value, [field]: e.target.value };
    if (field === 'state') { next.district = ''; next.city = ''; next.areaText = ''; }
    if (field === 'district') { next.city = ''; next.areaText = ''; }
    if (field === 'city') { next.areaText = ''; }
    onChange(next);
  };

  const selectClass =
    'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40 disabled:text-ink/30';

  return (
    <>
      <div>
        <label className="text-sm text-ink/70">State</label>
        <select className={selectClass} value={value.state} onChange={set('state')} required>
          <option value="">Select state</option>
          {states.map((s) => (<option key={s._id} value={s._id}>{s.name}</option>))}
        </select>
      </div>
      <div>
        <label className="text-sm text-ink/70">District</label>
        <select className={selectClass} value={value.district} onChange={set('district')} disabled={!value.state} required>
          <option value="">Select district</option>
          {districts.map((d) => (<option key={d._id} value={d._id}>{d.name}</option>))}
        </select>
      </div>
      <div>
        <label className="text-sm text-ink/70">City</label>
        <select className={selectClass} value={value.city} onChange={set('city')} disabled={!value.district} required>
          <option value="">Select city</option>
          {cities.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
        </select>
      </div>
      <div>
        <label className="text-sm text-ink/70">Area</label>
        <input className={selectClass} value={value.areaText || ''} onChange={set('areaText')} disabled={!value.city} required placeholder="Enter area or locality" />
      </div>
    </>
  );
}

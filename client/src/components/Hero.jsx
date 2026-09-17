import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

/* ─── helpers ─────────────────────────────────────── */
const POPULAR_SEARCHES = [
  'Schools', 'Hospitals', 'Restaurants',
  'Hotels', 'Shopping', 'Real Estate',
];

function extractList(res) {
  const body = res?.data;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body))       return body;
  if (Array.isArray(res))        return res;
  return [];
}

/* ─── Inline SVG illustration ─────────────────────── */
function LocalBusinessIllustration() {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg"
      aria-hidden="true"
    >
      {/* Sky / canvas */}
      <rect width="480" height="360" fill="#F0F4FF" rx="20" />

      {/* Ground */}
      <rect y="276" width="480" height="84" fill="#E2E8F0" rx="0 0 20 20" />
      <rect y="274" width="480" height="6" fill="#CBD5E0" />
      {/* Sidewalk dashes */}
      <rect x="60"  y="292" width="36" height="5" fill="#F5F7FA" rx="2" opacity="0.8" />
      <rect x="140" y="292" width="36" height="5" fill="#F5F7FA" rx="2" opacity="0.8" />
      <rect x="240" y="292" width="36" height="5" fill="#F5F7FA" rx="2" opacity="0.8" />
      <rect x="340" y="292" width="36" height="5" fill="#F5F7FA" rx="2" opacity="0.8" />

      {/* ── Left office tower ── */}
      <rect x="14" y="80" width="82" height="196" fill="#DDE4F0" rx="4" />
      <rect x="14" y="80" width="82" height="14" fill="#B8C5D8" rx="4 4 0 0" />
      {[0,1,2,3,4].map((row) =>
        [0,1].map((col) => (
          <rect
            key={`lt-${row}-${col}`}
            x={26 + col * 36}
            y={104 + row * 28}
            width={24}
            height={18}
            fill="#1A56DB"
            rx="2"
            opacity={0.25 + (row % 2) * 0.1}
          />
        ))
      )}
      <rect x="34" y="248" width="30" height="28" fill="#B8C5D8" rx="2 2 0 0" />

      {/* ── Main centre storefront ── */}
      <rect x="120" y="118" width="168" height="158" fill="white" rx="5" />
      {/* Awning */}
      <rect x="110" y="100" width="188" height="28" fill="#F47224" rx="5 5 0 0" />
      {/* Awning chevron pattern */}
      {[0,1,2,3,4,5].map((i) => (
        <rect key={`aw-${i}`} x={122 + i*28} y="100" width="14" height="28" fill="#D9621A" opacity="0.35" rx="1" />
      ))}
      {/* Sign strip */}
      <rect x="142" y="106" width="124" height="10" fill="white" rx="2" opacity="0.45" />

      {/* Store windows */}
      <rect x="132" y="140" width="58" height="62" fill="#EBF0FF" rx="3" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="161" y="140" width="1"  height="62" fill="#D0D9F0" />
      <rect x="132" y="172" width="58" height="1"  fill="#D0D9F0" />

      <rect x="198" y="140" width="58" height="62" fill="#EBF0FF" rx="3" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="227" y="140" width="1"  height="62" fill="#D0D9F0" />
      <rect x="198" y="172" width="58" height="1"  fill="#D0D9F0" />

      {/* Door */}
      <rect x="183" y="228" width="42" height="48" fill="#1A56DB" rx="3 3 0 0" />
      <circle cx="220" cy="254" r="3.5" fill="white" opacity="0.9" />
      <rect x="189" y="234" width="14" height="16" fill="white" rx="1" opacity="0.3" />
      <rect x="207" y="234" width="14" height="16" fill="white" rx="1" opacity="0.3" />

      {/* ── Right building ── */}
      <rect x="308" y="148" width="120" height="128" fill="#DDE4F0" rx="4" />
      <rect x="308" y="148" width="120" height="14" fill="#1A56DB" rx="4 4 0 0" opacity="0.85" />
      {[0,1,2].map((row) =>
        [0,1].map((col) => (
          <rect
            key={`rb-${row}-${col}`}
            x={322 + col * 52}
            y={174 + row * 30}
            width={36}
            height={22}
            fill="#EBF0FF"
            rx="2"
            stroke="#C6D1E8"
            strokeWidth="0.5"
          />
        ))
      )}
      <rect x="342" y="242" width="36" height="34" fill="#1A56DB" rx="2 2 0 0" opacity="0.7" />

      {/* ── Far-right high-rise ── */}
      <rect x="442" y="54" width="36" height="222" fill="#C6D4E8" rx="3" />
      <rect x="442" y="54" width="36" height="12" fill="#A0B4CC" rx="3 3 0 0" />
      {[0,1,2,3,4,5,6].map((row) =>
        [0,1].map((col) => (
          <rect
            key={`hr-${row}-${col}`}
            x={449 + col * 16}
            y={76 + row * 26}
            width={10}
            height={14}
            fill="#1A56DB"
            rx="1"
            opacity={0.2 + (col * 0.1)}
          />
        ))
      )}

      {/* ── Location pin above main store ── */}
      <path
        d="M204 14 C191 14 180 25 180 38 C180 56 204 78 204 78 C204 78 228 56 228 38 C228 25 217 14 204 14Z"
        fill="#F47224"
      />
      <circle cx="204" cy="39" r="11" fill="white" />
      <circle cx="204" cy="39" r="5.5" fill="#F47224" />
      {/* Ripple rings */}
      <circle cx="204" cy="39" r="30" stroke="#F47224" strokeWidth="1.5" opacity="0.18" />
      <circle cx="204" cy="39" r="46" stroke="#F47224" strokeWidth="1"   opacity="0.09" />

      {/* ── Search icon chip (top-right) ── */}
      <rect x="374" y="28" width="82" height="34" fill="white" rx="17" stroke="#E2E8F0" strokeWidth="1" />
      <circle cx="397" cy="45" r="8" stroke="#1A56DB" strokeWidth="2" fill="none" />
      <path d="M403 51 L408 57" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" />
      <rect x="416" y="40" width="30" height="4" fill="#CBD5E0" rx="2" />
      <rect x="416" y="48" width="20" height="4" fill="#CBD5E0" rx="2" />

      {/* ── Category label chips ── */}
      <rect x="28"  y="52" width="72" height="22" fill="white" rx="11" stroke="#E2E8F0" strokeWidth="1" />
      <text x="64"  y="67" fontSize="10" fill="#0D1B3E" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">Hospital</text>

      <rect x="312" y="114" width="86" height="22" fill="white" rx="11" stroke="#E2E8F0" strokeWidth="1" />
      <text x="355" y="129" fontSize="10" fill="#0D1B3E" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">Restaurant</text>

      <rect x="150" y="82" width="72" height="22" fill="#EBF0FF" rx="11" stroke="#1A56DB" strokeWidth="1.5" />
      <text x="186" y="97" fontSize="10" fill="#1A56DB" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700">School</text>
    </svg>
  );
}

/* ─── Location finder (3-level: State / District / City) ── */
function HeroLocationFinder() {
  const navigate = useNavigate();

  const [states,    setStates]    = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities,    setCities]    = useState([]);

  const [selected, setSelected] = useState({ state: '', district: '', city: '' });
  const [slugs,    setSlugs]    = useState({ state: '', district: '', city: '' });
  const [loading,  setLoading]  = useState({ state: false, district: false, city: false });

  /* fetch states on mount */
  useEffect(() => {
    setLoading((p) => ({ ...p, state: true }));
    api.get('/locations/states')
      .then((res) => setStates(extractList(res)))
      .catch(() => setStates([]))
      .finally(() => setLoading((p) => ({ ...p, state: false })));
  }, []);

  /* fetch districts when state changes */
  useEffect(() => {
    if (!selected.state) { setDistricts([]); return; }
    setLoading((p) => ({ ...p, district: true }));
    api.get(`/locations/districts/${selected.state}`)
      .then((res) => setDistricts(extractList(res)))
      .catch(() => setDistricts([]))
      .finally(() => setLoading((p) => ({ ...p, district: false })));
  }, [selected.state]);

  /* fetch cities when district changes */
  useEffect(() => {
    if (!selected.district) { setCities([]); return; }
    setLoading((p) => ({ ...p, city: true }));
    api.get(`/locations/cities/${selected.district}`)
      .then((res) => setCities(extractList(res)))
      .catch(() => setCities([]))
      .finally(() => setLoading((p) => ({ ...p, city: false })));
  }, [selected.district]);

  const handleChange = (level, id) => {
    const lists = { state: states, district: districts, city: cities };
    const item  = lists[level].find((x) => x._id === id);
    const slug  = item?.slug ?? '';

    if (level === 'state') {
      setSelected({ state: id, district: '', city: '' });
      setSlugs({    state: slug, district: '', city: '' });
    } else if (level === 'district') {
      setSelected((p) => ({ ...p, district: id, city: '' }));
      setSlugs((p)    => ({ ...p, district: slug, city: '' }));
    } else {
      setSelected((p) => ({ ...p, city: id }));
      setSlugs((p)    => ({ ...p, city: slug }));
    }
  };

  const canExplore = Boolean(selected.state && selected.district && selected.city);

  const handleExplore = () => {
    if (!canExplore) return;
    navigate(`/${slugs.state}/${slugs.district}/${slugs.city}`);
  };

  const selectCls = (disabled) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm font-medium outline-none transition ${
      disabled
        ? 'cursor-not-allowed border-line text-ink/30'
        : 'cursor-pointer border-line text-ink hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20'
    }`;

  return (
    <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* State */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-ink/40">
            State
          </label>
          <select
            id="hero-state"
            value={selected.state}
            onChange={(e) => handleChange('state', e.target.value)}
            disabled={loading.state}
            className={selectCls(false)}
          >
            <option value="">{loading.state ? 'Loading…' : 'Select State'}</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-ink/40">
            District
          </label>
          <select
            id="hero-district"
            value={selected.district}
            onChange={(e) => handleChange('district', e.target.value)}
            disabled={!selected.state || loading.district}
            className={selectCls(!selected.state)}
          >
            <option value="">{loading.district ? 'Loading…' : 'Select District'}</option>
            {districts.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-ink/40">
            City
          </label>
          <select
            id="hero-city"
            value={selected.city}
            onChange={(e) => handleChange('city', e.target.value)}
            disabled={!selected.district || loading.city}
            className={selectCls(!selected.district)}
          >
            <option value="">{loading.city ? 'Loading…' : 'Select City'}</option>
            {cities.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        id="hero-explore-btn"
        onClick={handleExplore}
        disabled={!canExplore}
        className="mt-3 w-full rounded-lg bg-accent py-2.5 text-[15px] font-semibold text-white transition hover:bg-accent-light disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-ink/30"
      >
        Explore Listings →
      </button>
    </div>
  );
}

/* ─── Hero ─────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="border-b border-line bg-white">
      <div className="container-page py-14 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left: copy + finder */}
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-marigold">
              Local Businesses&nbsp;·&nbsp;Services&nbsp;·&nbsp;Places
            </p>

            <h1 className="font-display text-4xl font-extrabold leading-[1.15] text-ink sm:text-[2.75rem]">
              Discover everything{' '}
              <span className="text-accent">around you.</span>
            </h1>

            <p className="mt-5 text-[17px] leading-relaxed text-ink/55">
              Find trusted schools, hospitals, restaurants, shops, services and
              more in your city — all in one place.
            </p>

            <div className="mt-8">
              <HeroLocationFinder />
            </div>

            {/* Popular searches */}
            <div className="mt-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ink/35">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <Link
                    key={term}
                    to={`/categories?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-line bg-canvas px-4 py-1.5 text-[13px] font-medium text-ink/60 transition hover:border-accent/40 hover:bg-accent-pale hover:text-accent"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: illustration */}
          <div className="hidden items-center justify-center lg:flex">
            <LocalBusinessIllustration />
          </div>

        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

/* ─── Known Andhra Pradesh cities ─────────────────────
   Paths use the slug pattern: /state/district/city
   Update slugs if your DB uses different values.      */
const CITIES = [
  {
    name: 'Rajahmundry',
    state: 'Andhra Pradesh',
    to: '/andhra-pradesh/east-godavari/rajahmundry',
    initials: 'RJY',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Vijayawada',
    state: 'Andhra Pradesh',
    to: '/andhra-pradesh/ntr/vijayawada',
    initials: 'VJA',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    to: '/andhra-pradesh/visakhapatnam/visakhapatnam',
    initials: 'VSK',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    name: 'Kakinada',
    state: 'Andhra Pradesh',
    to: '/andhra-pradesh/kakinada/kakinada',
    initials: 'KKD',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Machilipatnam',
    state: 'Andhra Pradesh',
    to: '/andhra-pradesh/krishna/machilipatnam',
    initials: 'MCP',
    color: 'bg-pink-100 text-pink-700',
  },
];

export default function PopularCities() {
  return (
    <section className="border-b border-line bg-canvas section-pad">
      <div className="container-page">
        {/* Heading */}
        <div className="mb-10">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-marigold">
            Popular locations
          </p>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Explore cities near you
          </h2>
          <p className="mt-2 text-[15px] text-ink/50">
            Click a city to browse all local businesses and services.
          </p>
        </div>

        {/* City cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {CITIES.map((city) => (
            <Link
              key={city.name}
              id={`city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              to={city.to}
              className="group flex flex-col items-center gap-3 rounded-xl border border-line bg-white p-5 text-center transition hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Initials badge */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${city.color}`}
                aria-hidden="true"
              >
                {city.initials}
              </div>

              {/* City name */}
              <div>
                <p className="font-semibold text-ink text-[15px] group-hover:text-accent transition-colors">
                  {city.name}
                </p>
                <p className="text-[12px] text-ink/40">{city.state}</p>
              </div>

              {/* Arrow */}
              <span className="text-[12px] font-medium text-accent opacity-0 transition group-hover:opacity-100">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

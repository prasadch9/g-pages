import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

/* ─── 13 main category definitions ─────────────────── */
const CATEGORIES = [
  {
    key: 'education',
    label: 'Education',
    icon: '🎓',
    sub: ['Schools', 'Colleges', 'Coaching', 'Libraries'],
    slug: 'education',
  },
  {
    key: 'healthcare',
    label: 'Healthcare',
    icon: '🏥',
    sub: ['Hospitals', 'Clinics', 'Pharmacies', 'Labs'],
    slug: 'healthcare',
  },
  {
    key: 'restaurants',
    label: 'Restaurants',
    icon: '🍽️',
    sub: ['Dine-In', 'Tiffin', 'Bakeries', 'Cafes'],
    slug: 'restaurants',
  },
  {
    key: 'hotels',
    label: 'Hotels',
    icon: '🏨',
    sub: ['Budget Stay', 'Lodges', 'Resorts', 'Guest Houses'],
    slug: 'hotels',
  },
  {
    key: 'shopping',
    label: 'Shopping',
    icon: '🛒',
    sub: ['Grocery', 'Clothing', 'Electronics', 'Supermarkets'],
    slug: 'shopping',
  },
  {
    key: 'real-estate',
    label: 'Real Estate',
    icon: '🏡',
    sub: ['Flats', 'Plots', 'Villas', 'Rentals'],
    slug: 'real-estate',
  },
  {
    key: 'automobiles',
    label: 'Automobiles',
    icon: '🚗',
    sub: ['Car Showrooms', 'Bikes', 'Garages', 'Spare Parts'],
    slug: 'automobiles',
  },
  {
    key: 'beauty',
    label: 'Beauty & Spa',
    icon: '💅',
    sub: ['Salons', 'Beauty Parlours', 'Spa', 'Makeup'],
    slug: 'beauty',
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: '🏦',
    sub: ['Banks', 'ATMs', 'Insurance', 'Loans'],
    slug: 'finance',
  },
  {
    key: 'travel',
    label: 'Travel & Tours',
    icon: '✈️',
    sub: ['Travel Agents', 'Bus Booking', 'Tour Packages', 'Taxis'],
    slug: 'travel',
  },
  {
    key: 'events',
    label: 'Events & Venues',
    icon: '🎉',
    sub: ['Marriage Halls', 'Event Managers', 'Decorators', 'Catering'],
    slug: 'events',
  },
  {
    key: 'home-services',
    label: 'Home Services',
    icon: '🔧',
    sub: ['Plumbers', 'Electricians', 'Painters', 'Cleaners'],
    slug: 'home-services',
  },
  {
    key: 'professional',
    label: 'Professional',
    icon: '📋',
    sub: ['Lawyers', 'Architects', 'CAs', 'Consultants'],
    slug: 'professional',
  },
];

/* Build the best-match link using API slugs when available */
function buildLink(apiMap, category) {
  const match = apiMap[category.label.toLowerCase()];
  if (match) return `/categories/${match}`;
  return `/categories?group=${category.slug}`;
}

function extractList(res) {
  const body = res?.data;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body))       return body;
  if (Array.isArray(res))        return res;
  return [];
}

export default function CategoryGrid() {
  const [apiMap, setApiMap] = useState({});

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        const list = extractList(res);
        const map  = {};
        list.forEach((c) => {
          if (c?.name && c?.slug) map[c.name.toLowerCase()] = c.slug;
        });
        setApiMap(map);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="border-b border-line bg-white section-pad">
      <div className="container-page">
        {/* Heading */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-marigold">
              Browse by category
            </p>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              What are you looking for?
            </h2>
          </div>
          <Link
            to="/categories"
            className="hidden whitespace-nowrap text-[14px] font-medium text-accent underline-offset-2 hover:underline sm:block"
          >
            View all →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              id={`cat-${cat.key}`}
              to={buildLink(apiMap, cat)}
              className="group flex flex-col gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Icon */}
              <span
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-canvas text-2xl transition group-hover:bg-accent-pale"
                aria-hidden="true"
              >
                {cat.icon}
              </span>

              {/* Label */}
              <div>
                <p className="font-semibold text-ink text-[14px] leading-tight group-hover:text-accent transition-colors">
                  {cat.label}
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink/40">
                  {cat.sub.join(' · ')}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile: View all link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/categories"
            className="text-[14px] font-medium text-accent underline-offset-2 hover:underline"
          >
            View all categories →
          </Link>
        </div>
      </div>
    </section>
  );
}

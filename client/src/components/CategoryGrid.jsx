import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import GroupedCategoryGrid from './GroupedCategoryGrid';

const ICONS = {
  Schools: '🎓', Colleges: '🏢', Universities: '🏛️', 'Training Institutes': '📚', Academies: '🎯', 'Sports Academies': '🏅',
  Hospitals: '🏥', 'Multispeciality Hospitals': '🏨', Cardiology: '❤️', ENT: '👂', Dental: '🦷', 'Hearing Solutions': '🦻', 'Fitness Centres': '🏋️',
  Temples: '🛕', Churches: '⛪', Trusts: '🤝', NGOs: '🌍', Associations: '👥',
  'Marriage Bureaus': '💍', 'Function Halls': '🏛️', 'Event Organizers': '🎉', 'Catering Services': '🍽️', 'Flower Decoration': '💐', 'Fashion Designers': '👗', 'Beauty Parlours': '💄', 'Saloon & Spa': '💆',
  'Tours & Travels': '🧳', 'Hotels & Residencies': '🏨', Resorts: '🏝️', 'Party Zones': '🎊',
  'Real Estate': '🏠', Construction: '🏗️', Roofing: '🧱', 'Interiors & Decorations': '🛋️', 'Tiles Shops': '🔲', 'Furniture Shops': '🪑',
  Restaurants: '🍴', 'Coffee Shops': '☕', 'Sweet Shops & Bakery': '🧁', 'Food Processing': '🥫',
  'Shopping Malls': '🏬', Boutique: '🛍️', 'Home Appliances': '🔌', 'Mattress Shops': '🛏️', Nurseries: '🌱',
  'Car Showrooms': '🚗', 'Small Scale Industries': '🏭', 'Trading Businesses': '📦', Consultancies: '💼', Agencies: '📣', 'Manpower Agencies': '🧑‍💼', Professions: '🧑‍⚕️',
  'Packers & Movers': '📦', 'Sculptures (Arts)': '🗿',
  Clinics: '🩺', Pharmacies: '💊', Hotels: '🛏️', 'Fashion Stores': '🛍️', Banks: '🏦', Gyms: '🏋️', Salons: '✂️', Theatres: '🎬', 'Tourist Places': '📍', Parks: '🌳', 'IT Companies': '💻', 'Coaching Centers': '📖', Libraries: '📚', 'Automobile Dealers': '🚙', 'Government Offices': '🏛️',
};

/**
 * Categories are never hard-coded — they're fetched from MongoDB via
 * /api/categories so admins can add/edit/disable categories without a
 * frontend deploy.
 */
export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => setCategories(data.data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="border-b border-line bg-[#f7fbff] py-14 sm:py-16">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Explore smarter</p><h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">What are you looking for?</h2><p className="mt-1 text-sm text-ink/55">Find trusted places in a category that matters to you.</p></div>
          <Link to="/categories" className="hidden rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 sm:block">
            View all categories →
          </Link>
        </div>

        {loading && <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {loading &&
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl border border-line bg-white" />
            ))}
        </div>}

        {!loading && categories.length === 0 &&
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-ink/30"
              >
                <span className="text-xs">Add categories in admin</span>
              </div>
            ))}
          </div>}

        {!loading && categories.length > 0 && <GroupedCategoryGrid categories={categories} />}
      </div>
    </section>
  );
}

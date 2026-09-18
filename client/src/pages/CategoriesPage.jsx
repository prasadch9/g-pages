import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ICONS = {
  Schools: '🎓', Colleges: '🏢', Universities: '🏛️', 'Training Institutes': '📚', Academies: '🎯', 'Sports Academies': '🏅', Hospitals: '🏥', 'Multispeciality Hospitals': '🏨', Cardiology: '❤️', ENT: '👂', Dental: '🦷', 'Hearing Solutions': '🦻', 'Fitness Centres': '🏋️', Temples: '🛕', Churches: '⛪', Trusts: '🤝', NGOs: '🌍', Associations: '👥', 'Marriage Bureaus': '💍', 'Function Halls': '🏛️', 'Event Organizers': '🎉', 'Catering Services': '🍽️', 'Flower Decoration': '💐', 'Fashion Designers': '👗', 'Beauty Parlours': '💄', 'Saloon & Spa': '💆', 'Tours & Travels': '🧳', 'Hotels & Residencies': '🏨', Resorts: '🏝️', 'Party Zones': '🎊', 'Real Estate': '🏠', Construction: '🏗️', Roofing: '🧱', 'Interiors & Decorations': '🛋️', 'Tiles Shops': '🔲', 'Furniture Shops': '🪑', Restaurants: '🍴', 'Coffee Shops': '☕', 'Sweet Shops & Bakery': '🧁', 'Food Processing': '🥫', 'Shopping Malls': '🏬', Boutique: '🛍️', 'Home Appliances': '🔌', 'Mattress Shops': '🛏️', Nurseries: '🌱', 'Car Showrooms': '🚗', 'Small Scale Industries': '🏭', 'Trading Businesses': '📦', Consultancies: '💼', Agencies: '📣', 'Manpower Agencies': '🧑‍💼', Professions: '🧑‍⚕️', 'Packers & Movers': '📦', 'Sculptures (Arts)': '🗿',
  Clinics: '🩺', Pharmacies: '💊', Hotels: '🛏️', 'Fashion Stores': '🛍️', Banks: '🏦', Gyms: '🏋️', Salons: '✂️', Theatres: '🎬', 'Tourist Places': '📍', Parks: '🌳', 'IT Companies': '💻', 'Coaching Centers': '📖', Libraries: '📚', 'Automobile Dealers': '🚙', 'Government Offices': '🏛️',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => setCategories([]));
  }, []);

const visible = categories.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vermilion">Explore by intent</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Find the right place for what matters.</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink/60">Browse every category in the directory, then narrow down by city, rating, and category-specific details.</p>
      </div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search categories…" className="mt-8 w-full max-w-md rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-ink/40" />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {visible.map((category) => (
          <Link key={category._id} to={`/categories/${category.slug}`} className="group rounded-2xl border border-line bg-white/70 p-5 transition hover:-translate-y-1 hover:border-ink/30 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-2xl shadow-sm transition duration-300 group-hover:rotate-3 group-hover:scale-110 group-hover:from-cyan-100 group-hover:to-blue-100">
              {ICONS[category.name] || '📌'}
            </div>
            <h2 className="mt-5 font-display text-lg font-semibold text-ink group-hover:text-vermilion">{category.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-ink/50">{category.description || `Discover trusted ${category.name.toLowerCase()} near you.`}</p>
            <span className="mt-5 inline-block text-sm font-medium text-ink/60 group-hover:text-ink">View places →</span>
          </Link>
        ))}
      </div>
      {!visible.length && <p className="py-16 text-center text-ink/50">No categories match that search.</p>}
    </div>
  );
}

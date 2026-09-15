import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marigold/25 font-display text-lg text-ink">{category.name.charAt(0)}</div>
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

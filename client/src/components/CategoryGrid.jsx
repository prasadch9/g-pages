import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
    <section className="border-b border-line bg-paper py-16">
      <div className="container-page">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Browse by category
          </h2>
          <Link to="/categories" className="hidden text-sm text-ink/60 hover:text-ink sm:block">
            View all categories
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {loading &&
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded border border-line bg-ink/5" />
            ))}

          {!loading && categories.length === 0 &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-24 flex-col items-center justify-center gap-2 rounded border border-dashed border-line text-ink/30"
              >
                <span className="text-xs">Add categories in admin</span>
              </div>
            ))}

          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/categories/${cat.slug}`}
              className="group flex h-24 flex-col items-center justify-center gap-2 rounded border border-line bg-white/50 text-center transition hover:border-ink/25 hover:bg-white"
            >
              <span className="font-display text-[15px] text-ink group-hover:text-vermilion">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

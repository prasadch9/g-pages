import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BlogCard from '../components/blog/BlogCard';

const PAGE_SIZE = 9;

export default function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  useEffect(() => {
    api.get('/blogs/meta').then(({ data }) => {
      setCategories(data.data.categories || []);
      setCities(data.data.cities || []);
    }).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
    setLoading(true);
    const params = Object.fromEntries(searchParams.entries());
    api.get('/blogs', { params: { ...params, limit: PAGE_SIZE } })
      .then(({ data }) => { setBlogs(data.data || []); setPagination(data.pagination || { total: 0, pages: 1 }); setError(''); })
      .catch((err) => { setBlogs([]); setError(err.message); })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const updateParams = (updates) => {
    const next = Object.fromEntries(searchParams.entries());
    Object.entries(updates).forEach(([key, value]) => value ? next[key] = String(value) : delete next[key]);
    delete next.page;
    setSearchParams(next);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    updateParams({ search: searchInput.trim() });
  };

  const goToPage = (nextPage) => {
    const next = Object.fromEntries(searchParams.entries());
    if (nextPage > 1) next.page = String(nextPage);
    else delete next.page;
    setSearchParams(next);
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <section className="border-b border-line pb-8 sm:pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-vermilion">Google Pages Journal</p>
        <div className="mt-3 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div><h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">Local knowledge, useful stories.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">Explore guides on places, businesses, education, health, travel and community life.</p></div>
          <p className="text-sm text-ink/50">{loading ? 'Loading posts…' : `${pagination.total} published ${pagination.total === 1 ? 'story' : 'stories'}`}</p>
        </div>
        <form onSubmit={submitSearch} className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_150px_auto]">
          <label className="sr-only" htmlFor="blog-search">Search blogs</label>
          <input id="blog-search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search titles, topics, or tags" className="rounded border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink/50" />
          <label className="sr-only" htmlFor="blog-category">Category</label>
          <select id="blog-category" value={searchParams.get('category') || ''} onChange={(event) => updateParams({ category: event.target.value })} className="rounded border border-line bg-white px-3 py-2.5 text-sm"><option value="">All categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
          <label className="sr-only" htmlFor="blog-city">Location</label>
          <select id="blog-city" value={searchParams.get('city') || ''} onChange={(event) => updateParams({ city: event.target.value })} className="rounded border border-line bg-white px-3 py-2.5 text-sm"><option value="">All locations</option>{cities.map((city) => <option key={city._id} value={city._id}>{city.name}</option>)}</select>
          <label className="sr-only" htmlFor="blog-date">Publication date</label>
          <select id="blog-date" value={searchParams.get('date') || 'all'} onChange={(event) => updateParams({ date: event.target.value === 'all' ? '' : event.target.value })} className="rounded border border-line bg-white px-3 py-2.5 text-sm"><option value="all">Any date</option><option value="month">This month</option><option value="year">This year</option></select>
          <button type="submit" className="rounded bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-light">Search</button>
        </form>
      </section>

      {error && <p role="alert" className="mt-6 text-sm text-vermilion">{error}</p>}
      {loading ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="aspect-[4/5] animate-pulse rounded border border-line bg-ink/5" />)}</div>
        : blogs.length > 0 ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}</div>
          : <div className="mt-14 border-y border-line py-12 text-center"><h2 className="font-display text-xl font-semibold text-ink">No stories found</h2><p className="mt-2 text-sm text-ink/55">Try another search or clear the filters.</p><button type="button" onClick={() => { setSearchInput(''); setSearchParams({}); }} className="mt-4 text-sm font-semibold text-vermilion underline underline-offset-4">Clear filters</button></div>}

      {!loading && pagination.pages > 1 && <nav aria-label="Blog pages" className="mt-8 flex items-center justify-between border-t border-line pt-4"><button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)} className="rounded border border-line px-3 py-2 text-sm disabled:opacity-40">Previous</button><span className="text-sm text-ink/55">Page {page} of {pagination.pages}</span><button type="button" disabled={page >= pagination.pages} onClick={() => goToPage(page + 1)} className="rounded border border-line px-3 py-2 text-sm disabled:opacity-40">Next</button></nav>}
    </div>
  );
}

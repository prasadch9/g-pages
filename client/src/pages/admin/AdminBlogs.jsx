import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const PAGE_SIZE = 20;

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '', status: '', city: '', page: 1 });
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/blogs/meta').then(({ data }) => {
      setCategories(data.data.categories || []);
      setCities(data.data.cities || []);
    }).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get('/admin/blogs', { params: { ...filters, limit: PAGE_SIZE } })
      .then(({ data }) => {
        if (!active) return;
        setBlogs(data.data || []);
        setPagination(data.pagination || { total: 0, pages: 1, page: 1 });
        setError('');
      })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filters]);

  const updateFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value, page: 1 }));

  const removeBlog = async (blog) => {
    if (!window.confirm(`Delete “${blog.title}”? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/blogs/${blog._id}`);
      setFilters((current) => ({ ...current }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Blog management</h2>
          <p className="mt-1 text-sm text-ink/55">{pagination.total} posts</p>
        </div>
        <Link to="/admin/blogs/new" className="rounded bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink-light">+ Add new blog</Link>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); updateFilter('search', searchInput.trim()); }} className="mt-6 grid gap-3 rounded border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-semibold text-ink/60 sm:col-span-2">Search blogs<input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Title, description, or tag" className="mt-1 w-full rounded border border-line px-3 py-2.5 text-sm outline-none focus:border-ink/50" /></label>
        <label className="text-xs font-semibold text-ink/60">Category<select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)} className="mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-sm"><option value="">All categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
        <label className="text-xs font-semibold text-ink/60">Status<select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className="mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-sm"><option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        <label className="text-xs font-semibold text-ink/60">City<select value={filters.city} onChange={(event) => updateFilter('city', event.target.value)} className="mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-sm"><option value="">All cities</option>{cities.map((city) => <option key={city._id} value={city._id}>{city.name}</option>)}</select></label>
        <button className="self-end rounded bg-vermilion px-4 py-2.5 text-sm font-medium text-paper hover:bg-vermilion/90">Search</button>
      </form>

      {error && <p role="alert" className="mt-4 text-sm text-vermilion">{error}</p>}
      <div className="mt-5 overflow-x-auto rounded border border-line bg-white/70">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-white/60 text-xs text-ink/50"><tr><th className="px-4 py-3 font-semibold">Title</th><th className="px-4 py-3 font-semibold">Category / location</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Updated</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
          <tbody className="divide-y divide-line">
            {blogs.map((blog) => <tr key={blog._id}>
              <td className="max-w-sm px-4 py-3"><div className="font-semibold text-ink">{blog.title}</div><div className="mt-0.5 text-xs text-ink/45">/{blog.slug}</div></td>
              <td className="px-4 py-3 text-ink/65">{blog.category || 'Uncategorized'}<div className="mt-0.5 text-xs text-ink/45">{blog.location?.city?.name || 'No city'}</div></td>
              <td className="px-4 py-3"><span className={`rounded-sm px-2 py-1 text-xs capitalize ${blog.status === 'published' ? 'bg-moss/15 text-moss' : blog.status === 'archived' ? 'bg-ink/10 text-ink/55' : 'bg-marigold/15 text-marigold-dark'}`}>{blog.status}</span></td>
              <td className="px-4 py-3 text-xs text-ink/55">{new Date(blog.updatedAt).toLocaleDateString()}</td>
              <td className="px-4 py-3"><div className="flex justify-end gap-3">{blog.status === 'published' && <Link target="_blank" rel="noreferrer" to={`/blogs/${blog.slug}`} className="text-xs font-medium text-ink/65 underline underline-offset-2">View</Link>}<Link to={`/admin/blogs/${blog._id}/edit`} className="text-xs font-medium text-ink underline underline-offset-2">Edit</Link><button type="button" onClick={() => removeBlog(blog)} className="text-xs font-medium text-vermilion underline underline-offset-2">Delete</button></div></td>
            </tr>)}
            {!loading && blogs.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-ink/45">No blogs match these filters.</td></tr>}
          </tbody>
        </table>
        {loading && <p className="px-4 py-8 text-center text-sm text-ink/50">Loading blogs…</p>}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-ink/60"><span>Page {pagination.page || filters.page} of {Math.max(1, pagination.pages)}</span><div className="flex gap-2"><button type="button" disabled={filters.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))} className="rounded border border-line px-3 py-1.5 disabled:opacity-40">Previous</button><button type="button" disabled={filters.page >= pagination.pages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))} className="rounded border border-line px-3 py-1.5 disabled:opacity-40">Next</button></div></div>
    </section>
  );
}

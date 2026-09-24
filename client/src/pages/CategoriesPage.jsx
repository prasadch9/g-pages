import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CATEGORY_GROUPS, CATEGORY_ICONS, slugifyCategory } from '../data/categoryGroups';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data)).catch(() => setCategories([]));
  }, []);

  const categoriesByName = useMemo(
    () => new Map(categories.map((category) => [category.name.toLowerCase(), category])),
    [categories]
  );

  const visibleGroups = useMemo(() => {
    const search = query.trim().toLowerCase();
    return CATEGORY_GROUPS.map((group) => {
      const children = group.children.filter((name) => {
        const category = categoriesByName.get(name.toLowerCase());
        return !search || name.toLowerCase().includes(search) || group.name.toLowerCase().includes(search) || category?.description?.toLowerCase().includes(search);
      });
      return { ...group, children };
    }).filter((group) => group.children.length > 0);
  }, [categoriesByName, query]);

  const toggleGroup = (groupName) => {
    setOpenGroup((current) => (current === groupName ? null : groupName));
  };
  const selectedGroup = visibleGroups.find((group) => group.name === openGroup);

  const renderGroup = (group, index) => {
    const isOpen = openGroup === group.name;
    return (
      <div
        key={group.name}
        className={`${isOpen ? 'border-cyan-300 bg-white shadow-lg' : 'border-line bg-transparent'} group relative rounded-2xl border p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-300 hover:bg-white hover:shadow-lg`}
      >
        <button type="button" onClick={() => toggleGroup(group.name)} className="flex w-full items-center justify-between text-left">
          <span className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-2xl shadow-sm">{CATEGORY_ICONS[group.children[0]] || '📌'}</span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-vermilion">{String(index + 1).padStart(2, '0')}</span>
              <span className="mt-1 block font-display text-lg font-semibold text-ink">{group.name}</span>
            </span>
          </span>
          <span className="ml-3 text-xl text-ink/45" aria-hidden="true">{isOpen ? '−' : '+'}</span>
        </button>
        <div className={`${isOpen ? 'mt-5 max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300`}>
          <div className="border-t border-line pt-3">
            {group.children.map((child) => {
              const category = categoriesByName.get(child.toLowerCase());
              return (
                <Link key={child} to={`/categories/${category?.slug || slugifyCategory(child)}`} className="flex items-center justify-between border-b border-line/70 py-2.5 text-sm text-ink/70 last:border-0 hover:text-vermilion">
                  <span><span className="mr-2">{CATEGORY_ICONS[child] || '•'}</span>{child}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vermilion">Explore by intent</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Find the right place for what matters.</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink/60">Browse every category in the directory, then narrow down by city, rating, and category-specific details.</p>
      </div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search categories…" className="mt-8 w-full max-w-md rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-ink/40" />
      <div className={`mt-10 grid gap-4 ${selectedGroup ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {selectedGroup ? (
          <>
            <div className="md:row-span-full">{renderGroup(selectedGroup, visibleGroups.indexOf(selectedGroup))}</div>
            <div className="grid gap-4 sm:grid-cols-2">{visibleGroups.filter((group) => group.name !== selectedGroup.name).map((group) => renderGroup(group, visibleGroups.indexOf(group)))}</div>
          </>
        ) : visibleGroups.map(renderGroup)}
      </div>
      {!visibleGroups.length && <p className="py-16 text-center text-ink/50">No categories match that search.</p>}
    </div>
  );
}

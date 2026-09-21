import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_GROUPS, CATEGORY_ICONS, slugifyCategory } from '../data/categoryGroups';

export default function GroupedCategoryGrid({ categories, cityPath = '' }) {
  const [openGroup, setOpenGroup] = useState(null);
  const categoriesByName = useMemo(
    () => new Map(categories.map((category) => [category.name.toLowerCase(), category])),
    [categories]
  );

  const visibleGroups = CATEGORY_GROUPS.map((group) => ({
    ...group,
    children: group.children.filter((name) => categoriesByName.has(name.toLowerCase())),
  })).filter((group) => group.children.length > 0);

  const selectedGroup = visibleGroups.find((group) => group.name === openGroup);

  const renderGroup = (group, index) => {
    const isOpen = openGroup === group.name;
    return (
      <div key={group.name} className={`${isOpen ? 'border-cyan-300 bg-white shadow-lg' : 'border-slate-200/80 bg-white'} rounded-2xl border p-4 shadow-[0_8px_24px_rgba(15,64,104,.06)] transition duration-300 hover:border-cyan-300 hover:shadow-[0_16px_30px_rgba(15,64,104,.14)]`}>
        <button type="button" onClick={() => setOpenGroup((current) => (current === group.name ? null : group.name))} className="flex min-h-24 w-full items-center justify-between gap-3 text-left">
          <span className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-2xl">{CATEGORY_ICONS[group.children[0]] || '📌'}</span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-vermilion">{String(index + 1).padStart(2, '0')}</span>
              <span className="mt-1 block font-display text-lg font-semibold leading-tight text-ink">{group.name}</span>
            </span>
          </span>
          <span className="text-xl text-ink/45" aria-hidden="true">{isOpen ? '−' : '+'}</span>
        </button>
        <div className={`${isOpen ? 'mt-3 max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300`}>
          <div className="border-t border-line pt-2">
            {group.children.map((child) => {
              const category = categoriesByName.get(child.toLowerCase());
              const categoryPath = category?.slug || slugifyCategory(child);
              const targetPath = cityPath ? `${cityPath}/${categoryPath}` : `/categories/${categoryPath}`;
              return (
                <Link key={child} to={targetPath} className="flex items-center justify-between border-b border-line/70 py-2 text-sm text-ink/70 last:border-0 hover:text-vermilion">
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
    <div className={`mt-8 grid gap-4 ${selectedGroup ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
      {selectedGroup ? (
        <>
          <div className="md:row-span-full">{renderGroup(selectedGroup, visibleGroups.indexOf(selectedGroup))}</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleGroups.filter((group) => group.name !== selectedGroup.name).map((group) => renderGroup(group, visibleGroups.indexOf(group)))}
          </div>
        </>
      ) : visibleGroups.map(renderGroup)}
    </div>
  );
}

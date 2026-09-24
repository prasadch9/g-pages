import React, { useEffect, useMemo, useState } from 'react';
import GenericBusinessEditor from './GenericBusinessEditor';
import { BUSINESS_GROUPS, findCategoryByName, getSubcategoriesForGroup, getStoredCategoryValues } from '../../components/business/businessTaxonomy';

/**
 * Generic create-form wrapper for categories that do not have a dedicated form:
 * Education & Learning, Religious & Social, Travel & Hospitality, Shopping & Retail,
 * Automotive, Industries & Manufacturing, Business & Professional Services,
 * Logistics & Moving, Arts & Creative
 */
export default function GenericBusinessCreateForm({ groupName, categories, onBack }) {
  const realGroup = useMemo(() => BUSINESS_GROUPS.find((g) => g.name === groupName), [groupName]);
  const subcategories = useMemo(() => getSubcategoriesForGroup(categories, realGroup), [categories, realGroup]);

  const [subcategoryId, setSubcategoryId] = useState('');
  useEffect(() => {
    if (!subcategoryId && subcategories[0]) setSubcategoryId(subcategories[0]._id);
  }, [subcategoryId, subcategories]);

  const selected = subcategories.find((item) => item._id === subcategoryId);
  const records = selected
    ? getStoredCategoryValues(categories, realGroup, selected.name)
    : { category: findCategoryByName(categories, groupName), subcategory: null };

  if (!selected) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-5xl">
          <button type="button" onClick={onBack} className="text-sm font-semibold text-ink">← Back to categories</button>
          <h1 className="mt-5 font-display text-3xl font-semibold">{groupName}</h1>
          <p className="mt-3 text-sm text-ink/55">Loading subcategory options...</p>
        </div>
      </div>
    );
  }

  const draft = {
    category: records.category?._id || records.category,
    subcategory: records.subcategory?._id || records.subcategory || selected._id,
    location: {},
    attributes: { businessProfile: {} },
  };

  return (
    <div>
      {/* Subcategory selector bar */}
      {subcategories.length > 1 && (
        <div className="container-page mx-auto max-w-5xl px-5 pt-8 sm:px-8">
          <label className="block max-w-md text-sm font-semibold text-ink/70">
            {groupName} — Select type
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-white px-3 py-2.5"
            >
              {subcategories.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      <GenericBusinessEditor
        place={draft}
        groupName={groupName}
        subcategoryName={selected.name}
        categoryId={records.category?._id || records.category}
        subcategoryIdProp={records.subcategory?._id || records.subcategory || selected._id}
        create
        onBack={onBack}
      />
    </div>
  );
}

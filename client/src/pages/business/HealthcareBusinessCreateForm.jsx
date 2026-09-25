import React, { useEffect, useMemo, useState } from 'react';
import HealthcareBusinessEditor from './HealthcareBusinessEditor';
import { findCategoryByName, getSubcategoriesForGroup, getStoredCategoryValues } from '../../components/business/businessTaxonomy';

const healthcareGroup = {
  name: 'Healthcare & Medical',
  children: [
    'Hospitals',
    'Multispeciality Hospitals',
    'Cardiology',
    'ENT',
    'Dental',
    'Hearing Solutions',
    'Fitness Centres',
  ],
};

export default function HealthcareBusinessCreateForm({ categories, onBack }) {
  const [subcategoryId, setSubcategoryId] = useState('');
  const subcategories = useMemo(() => getSubcategoriesForGroup(categories, healthcareGroup), [categories]);

  useEffect(() => {
    if (!subcategoryId && subcategories[0]) {
      setSubcategoryId(subcategories[0]._id);
    }
  }, [subcategoryId, subcategories]);

  const selected = subcategories.find((item) => item._id === subcategoryId);
  const records = selected
    ? getStoredCategoryValues(categories, healthcareGroup, selected.name)
    : { category: findCategoryByName(categories, 'Healthcare & Medical') || findCategoryByName(categories, 'Hospitals'), subcategory: null };

  if (!selected) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-5xl">
          <button type="button" onClick={onBack} className="text-sm font-semibold text-[#0f6cbf]">
            ← Back to categories
          </button>
          <h1 className="mt-5 font-display text-3xl font-semibold text-[#2d2323]">Healthcare &amp; Medical</h1>
          <p className="mt-3 text-sm text-[#70615f]">Loading healthcare options...</p>
        </div>
      </div>
    );
  }

  const draft = {
    category: records.category?._id || records.category || selected._id,
    subcategory: records.subcategory?._id || records.subcategory || undefined,
    location: {},
    attributes: {
      businessProfile: {
        businessType: 'healthcare',
      },
    },
  };

  return (
    <div>
      <div className="container-page mx-auto max-w-5xl px-5 pt-8 sm:px-8">
        <label className="block max-w-md text-sm font-semibold text-[#4b3d3b]">
          Healthcare business type
          <select
            value={subcategoryId}
            onChange={(event) => setSubcategoryId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#ebded8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0f6cbf]"
          >
            {subcategories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <HealthcareBusinessEditor
        place={draft}
        create
        onBack={onBack}
        categoryId={draft.category}
        subcategoryId={draft.subcategory}
      />
    </div>
  );
}

import React from 'react';

const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';

export default function CategoryBusinessFields({ subcategoryName, values, onChange, fieldNames = [] }) {
  if (!subcategoryName) return <p className="col-span-2 text-sm text-ink/50">Select a subcategory to load its specific form.</p>;
  return <div className="col-span-2 grid gap-4 sm:grid-cols-2">{fieldNames.map((field) => <label key={field} className="text-sm text-ink/70">{field}<textarea rows={3} value={values[field] || ''} onChange={(event) => onChange(field, event.target.value)} className={inputClass} /></label>)}</div>;
}

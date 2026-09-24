import React, { useEffect, useMemo, useState } from 'react';
import PropertyBusinessForm from './PropertyBusinessForm';
import { findCategoryByName } from '../../components/business/businessTaxonomy';

const names = ['Real Estate', 'Construction', 'Roofing', 'Interiors & Decorations', 'Tiles Shops', 'Furniture Shops'];
const types = { 'Real Estate': 'real-estate', Construction: 'construction', Roofing: 'roofing', 'Interiors & Decorations': 'interiors', 'Tiles Shops': 'tiles', 'Furniture Shops': 'furniture' };
export default function PropertyBusinessCreateForm({ categories, onBack }) {
  const options = useMemo(() => names.map((name) => findCategoryByName(categories, name)).filter(Boolean), [categories]);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => { if (!selectedId && options[0]) setSelectedId(options[0]._id); }, [selectedId, options]);
  const selected = options.find((item) => item._id === selectedId);
  if (!selected) return <div className="container-page py-12"><button type="button" onClick={onBack} className="text-sm font-semibold text-[#9a6c1f]">← Back</button><h1 className="mt-5 font-display text-3xl font-bold text-[#10283f]">Real Estate & Construction</h1><p className="mt-3 text-sm">Property categories are loading...</p></div>;
  return <div><div className="mx-auto max-w-5xl px-5 pt-8 sm:px-8"><label className="block max-w-md text-sm font-semibold text-[#31465a]">Business type<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="mt-1 w-full rounded-xl border border-[#d9e0e6] bg-white px-3 py-2.5">{options.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label></div><PropertyBusinessForm categoryId={selected._id} propertyType={types[selected.name]} create onBack={onBack} /></div>;
}

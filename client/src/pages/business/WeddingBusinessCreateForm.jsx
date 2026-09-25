import React, { useEffect, useMemo, useState } from 'react';
import WeddingBusinessForm from './WeddingBusinessForm';
import { findCategoryByName } from '../../components/business/businessTaxonomy';

const names = ['Marriage Bureaus', 'Function Halls', 'Event Organizers', 'Catering Services', 'Flower Decoration', 'Fashion Designers', 'Beauty Parlours', 'Saloon & Spa'];
const types = { 'Marriage Bureaus': 'marriage-bureau', 'Function Halls': 'function-hall', 'Event Organizers': 'event-organizer', 'Catering Services': 'catering-service', 'Flower Decoration': 'flower-decoration', 'Fashion Designers': 'fashion-designer', 'Beauty Parlours': 'beauty-parlour', 'Saloon & Spa': 'saloon-spa' };
export default function WeddingBusinessCreateForm({ categories, onBack }) {
  const options = useMemo(() => names.map((name) => findCategoryByName(categories, name)).filter(Boolean), [categories]);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => { if (!selectedId && options[0]) setSelectedId(options[0]._id); }, [selectedId, options]);
  const selected = options.find((item) => item._id === selectedId);
  if (!selected) return <div className="container-page py-12"><button type="button" onClick={onBack} className="text-sm font-semibold text-[#941f43]">← Back</button><h1 className="mt-5 font-display text-3xl font-bold text-[#4b1227]">Marriage & Wedding</h1><p className="mt-3 text-sm">Wedding subcategories are loading...</p></div>;
  return <div><div className="mx-auto max-w-5xl px-5 pt-8 sm:px-8"><label className="block max-w-md text-sm font-semibold text-[#5a3742]">Wedding business type<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="mt-1 w-full rounded-xl border border-[#ead9df] bg-white px-3 py-2.5">{options.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label></div><WeddingBusinessForm categoryId={selected.parent?._id || selected._id} subcategoryId={selected.parent ? selected._id : undefined} businessType={types[selected.name]} create onBack={onBack} /></div>;
}

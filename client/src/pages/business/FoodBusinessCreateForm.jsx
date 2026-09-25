import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import FoodBusinessEditor from './FoodBusinessEditor';
import { findCategoryByName, getSubcategoriesForGroup, getStoredCategoryValues } from '../../components/business/businessTaxonomy';

const foodGroup = { name: 'Food & Dining', children: ['Restaurants', 'Coffee Shops', 'Sweet Shops & Bakery', 'Catering Services', 'Food Processing'] };
const typeFor = { Restaurant: 'restaurant', Restaurants: 'restaurant', 'Coffee Shop': 'coffee-shop', 'Coffee Shops': 'coffee-shop', 'Sweet Shop & Bakery': 'bakery', 'Sweet Shops & Bakery': 'bakery', 'Catering Service': 'catering', 'Catering Services': 'catering', 'Food Processing': 'food-processing' };

export default function FoodBusinessCreateForm({ categories, onBack }) {
  const [subcategoryId, setSubcategoryId] = useState('');
  const subcategories = useMemo(() => getSubcategoriesForGroup(categories, foodGroup), [categories]);
  useEffect(() => { if (!subcategoryId && subcategories[0]) setSubcategoryId(subcategories[0]._id); }, [subcategoryId, subcategories]);
  const selected = subcategories.find((item) => item._id === subcategoryId);
  const records = selected ? getStoredCategoryValues(categories, foodGroup, selected.name) : { category: findCategoryByName(categories, 'Food & Dining'), subcategory: null };
  if (!selected) return <div className="container-page py-12"><div className="mx-auto max-w-5xl"><button type="button" onClick={onBack} className="text-sm font-semibold text-ink">← Back to categories</button><h1 className="mt-5 font-display text-3xl font-semibold">Food & Dining</h1><label className="mt-6 block max-w-md text-sm text-ink/70">Choose subtype<select value={subcategoryId} onChange={(event) => setSubcategoryId(event.target.value)} className="mt-1 w-full rounded border border-line bg-white px-3 py-2.5"><option value="">Select subtype</option>{subcategories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label></div></div>;
  const draft = { category: records.category?._id || records.category, subcategory: records.subcategory?._id || records.subcategory || selected._id, location: {}, attributes: { businessProfile: {} } };
  return <div><div className="container-page mx-auto max-w-5xl px-5 pt-8 sm:px-8"><label className="block max-w-md text-sm font-semibold text-ink/70">Food & Dining subcategory<select value={subcategoryId} onChange={(event) => setSubcategoryId(event.target.value)} className="mt-1 w-full rounded border border-line bg-white px-3 py-2.5">{subcategories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label></div><FoodBusinessEditor place={draft} businessType={typeFor[selected.name] || 'restaurant'} create onBack={onBack} /></div>;
}

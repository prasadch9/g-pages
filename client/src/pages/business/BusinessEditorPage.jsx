import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import RestaurantEditor from './RestaurantEditor';
import CoffeeShopEditor from './CoffeeShopEditor';
import BakeryEditor from './BakeryEditor';
import CateringEditor from './CateringEditor';
import FoodProcessingEditor from './FoodProcessingEditor';
import HealthcareBusinessEditor from './HealthcareBusinessEditor';
import BusinessCategoryForm from './BusinessCategoryForm';
import WeddingBusinessForm from './WeddingBusinessForm';
import PropertyBusinessForm from './PropertyBusinessForm';
import GenericBusinessEditor from './GenericBusinessEditor';
import { isHealthcareBusiness } from '../../utils/healthcare';
import { resolveWeddingBusinessType, resolvePropertyBusinessType } from '../../components/public/PublicProfileShared';
import { BUSINESS_GROUPS } from '../../components/business/businessTaxonomy';

const foodTypeByName = {
  restaurants: 'restaurant',
  restaurant: 'restaurant',
  'coffee shops': 'coffee-shop',
  'coffee-shop': 'coffee-shop',
  'sweet shops & bakery': 'bakery',
  bakery: 'bakery',
  'catering services': 'catering',
  catering: 'catering',
  'food processing': 'food-processing',
  'food-processing': 'food-processing',
};

const normalize = (v) => String(v || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');

const resolveFoodType = (place) =>
  place.attributes?.businessProfile?.businessType ||
  place.attributes?.restaurantProfile?.businessType ||
  foodTypeByName[normalize(place.subcategory?.slug || place.subcategory?.name || place.category?.slug || place.category?.name)] ||
  null;

/** Resolve which group this place belongs to, based on category/subcategory names */
const resolveGenericGroup = (place) => {
  const candidates = [
    place.subcategory?.name,
    place.subcategory?.slug,
    place.category?.name,
    place.category?.slug,
  ].filter(Boolean).map(normalize);

  for (const group of BUSINESS_GROUPS) {
    const groupNorm = normalize(group.name);
    if (candidates.some((c) => c === groupNorm)) return group.name;
    // Check children
    for (const child of group.children) {
      if (candidates.some((c) => c === normalize(child))) return group.name;
    }
  }
  return null;
};

const DEDICATED_FOOD_TYPES = new Set(['restaurant', 'coffee-shop', 'bakery', 'catering', 'food-processing']);
const DEDICATED_GROUPS_IN_EDITOR = new Set(['Healthcare & Medical', 'Marriage & Wedding', 'Real Estate & Construction', 'Food & Dining']);

const GENERIC_GROUPS = new Set([
  'Education & Learning',
  'Religious & Social',
  'Travel & Hospitality',
  'Shopping & Retail',
  'Automotive',
  'Industries & Manufacturing',
  'Business & Professional Services',
  'Logistics & Moving',
  'Arts & Creative',
]);

export default function BusinessEditorPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/places/mine')
      .then(({ data }) => {
        const found = data.data.find((item) => item._id === id);
        if (!found) throw new Error('Listing not found or you do not own it.');
        setPlace(found);
      })
      .catch((loadError) => setError(loadError.response?.data?.message || loadError.message));
  }, [id]);

  if (error) return <div className="container-page py-20 text-center text-vermilion">{error}</div>;
  if (!place) return <div className="container-page py-20 text-center text-ink/50">Loading business editor...</div>;

  // ── Healthcare ────────────────────────────────────────────────────────────
  if (isHealthcareBusiness(place)) return <HealthcareBusinessEditor place={place} />;

  // ── Wedding ───────────────────────────────────────────────────────────────
  const weddingType = resolveWeddingBusinessType(place);
  if (weddingType) return <WeddingBusinessForm place={place} businessType={weddingType} />;

  // ── Real Estate & Construction ────────────────────────────────────────────
  const propertyType = resolvePropertyBusinessType(place);
  if (propertyType) return <PropertyBusinessForm place={place} propertyType={propertyType} />;

  // ── Food & Dining dedicated editors ──────────────────────────────────────
  const foodType = resolveFoodType(place);
  if (foodType === 'restaurant') return <RestaurantEditor place={place} />;
  if (foodType === 'coffee-shop') return <CoffeeShopEditor place={place} />;
  if (foodType === 'bakery') return <BakeryEditor place={place} />;
  if (foodType === 'catering') return <CateringEditor place={place} />;
  if (foodType === 'food-processing') return <FoodProcessingEditor place={place} />;

  // ── Generic groups (Education, Religious, Travel, Shopping, etc.) ─────────
  const genericGroup = resolveGenericGroup(place);
  if (genericGroup && GENERIC_GROUPS.has(genericGroup)) {
    const subcategoryName = place.subcategory?.name || '';
    return (
      <GenericBusinessEditor
        place={place}
        groupName={genericGroup}
        subcategoryName={subcategoryName}
        categoryId={place.category?._id || place.category}
        subcategoryIdProp={place.subcategory?._id || place.subcategory}
      />
    );
  }

  // ── Fallback: generic category form (covers edit for unknown types) ────────
  return <BusinessCategoryForm place={place} />;
}

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
import { isHealthcareBusiness } from '../../utils/healthcare';
import { resolveWeddingBusinessType } from '../../components/public/PublicProfileShared';
import { resolvePropertyBusinessType } from '../../components/public/PublicProfileShared';

const typeByName = {
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

const resolveType = (place) => place.attributes?.businessProfile?.businessType
  || place.attributes?.restaurantProfile?.businessType
  || typeByName[(place.subcategory?.slug || place.subcategory?.name || place.category?.slug || place.category?.name || '').toLowerCase()]
  || null;

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

  const type = resolveType(place);
  if (isHealthcareBusiness(place)) return <HealthcareBusinessEditor place={place} />;
  const weddingType = resolveWeddingBusinessType(place);
  if (weddingType) return <WeddingBusinessForm place={place} businessType={weddingType} />;
  const propertyType = resolvePropertyBusinessType(place);
  if (propertyType) return <PropertyBusinessForm place={place} propertyType={propertyType} />;
  if (type === 'restaurant') return <RestaurantEditor />;
  if (type === 'coffee-shop') return <CoffeeShopEditor place={place} />;
  if (type === 'bakery') return <BakeryEditor place={place} />;
  if (type === 'catering') return <CateringEditor place={place} />;
  if (type === 'food-processing') return <FoodProcessingEditor place={place} />;
  return <BusinessCategoryForm place={place} />;
}

import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import api from '../services/api';
import RestaurantProfilePage from './RestaurantProfilePage';
import CoffeeShopProfilePage from './CoffeeShopProfilePage';
import BakeryProfilePage from './BakeryProfilePage';
import CateringProfilePage from './CateringProfilePage';
import FoodProcessingProfilePage from './FoodProcessingProfilePage';
import FoodBusinessWebsite from '../components/public/FoodBusinessWebsite';
import WeddingBusinessWebsite from '../components/public/WeddingBusinessWebsite';
import PropertyBusinessWebsite from '../components/public/PropertyBusinessWebsite';
import HealthcareWebsite from '../components/public/HealthcareWebsite';
import { ProfileLoading, resolveFoodBusinessType, resolvePropertyBusinessType, resolveWeddingBusinessType } from '../components/public/PublicProfileShared';
import { isHealthcareBusiness } from '../utils/healthcare';

export default function PublicBusinessProfilePage() {
  const { businessId } = useParams();
  const [place, setPlace] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/places/${businessId}`)
      .then(({ data }) => setPlace(data.data))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Unable to load this profile.'))
      .finally(() => setLoading(false));
  }, [businessId]);

  const type = useMemo(() => resolveFoodBusinessType(place), [place]);
  const weddingType = useMemo(() => resolveWeddingBusinessType(place), [place]);
  const propertyType = useMemo(() => resolvePropertyBusinessType(place), [place]);
  if (loading) return <ProfileLoading />;
  if (error || !place) return <ProfileLoading error={error || 'The business could not be found.'} />;
  if (isHealthcareBusiness(place)) return <HealthcareWebsite place={place} />;
  if (weddingType) return <WeddingBusinessWebsite place={place} weddingType={weddingType} />;
  if (propertyType) return <PropertyBusinessWebsite place={place} propertyType={propertyType} />;
  if (type) return <FoodBusinessWebsite place={place} />;

  if (type === 'restaurant') return <RestaurantProfilePage place={place} />;
  if (type === 'coffee-shop') return <CoffeeShopProfilePage place={place} />;
  if (type === 'bakery') return <BakeryProfilePage place={place} />;
  if (type === 'catering') return <CateringProfilePage place={place} />;
  if (type === 'food-processing') return <FoodProcessingProfilePage place={place} />;

  return <div className="grid min-h-screen place-items-center bg-white p-6 text-center"><div><h1 className="font-display text-3xl font-semibold">{place.name}</h1><p className="mt-3 text-sm opacity-60">This business profile is being prepared.</p></div></div>;
}

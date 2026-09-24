import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import api from '../services/api';
import RestaurantProfilePage from './RestaurantProfilePage';
import CoffeeShopProfilePage from './CoffeeShopProfilePage';
import BakeryProfilePage from './BakeryProfilePage';
import CateringProfilePage from './CateringProfilePage';
import FoodProcessingProfilePage from './FoodProcessingProfilePage';
import { ProfileLoading, resolveFoodBusinessType } from '../components/public/PublicProfileShared';

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
  if (loading) return <ProfileLoading />;
  if (error || !place) return <ProfileLoading error={error || 'The business could not be found.'} />;

  if (type === 'restaurant') return <RestaurantProfilePage place={place} />;
  if (type === 'coffee-shop') return <CoffeeShopProfilePage place={place} />;
  if (type === 'bakery') return <BakeryProfilePage place={place} />;
  if (type === 'catering') return <CateringProfilePage place={place} />;
  if (type === 'food-processing') return <FoodProcessingProfilePage place={place} />;
  return <Navigate to={`/place/${businessId}`} replace />;
}

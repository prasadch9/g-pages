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
import ToursTravelWebsite from '../components/public/ToursTravelWebsite';
import HotelResidencyWebsite from '../components/public/HotelResidencyWebsite';
import ResortWebsite from '../components/public/ResortWebsite';
import PartyZoneWebsite from '../components/public/PartyZoneWebsite';
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
  const isToursTravel = useMemo(() => {
    const values = [place?.subcategory?.name, place?.subcategory?.slug, place?.category?.name, place?.category?.slug, place?.attributes?.businessProfile?.businessType];
    return values.some((value) => String(value || '').toLowerCase().replace(/[_\s]+/g, '-').includes('tours-and-travels'));
  }, [place]);
  const isHotelResidency = useMemo(() => {
    const values = [place?.subcategory?.name, place?.subcategory?.slug, place?.category?.name, place?.category?.slug, place?.attributes?.businessProfile?.businessType];
    return values.some((value) => String(value || '').toLowerCase().replace(/[_\s]+/g, '-').replace(/&/g, 'and').includes('hotels-and-residencies'));
  }, [place]);
  const isResort = useMemo(() => {
    const values = [place?.subcategory?.name, place?.subcategory?.slug, place?.category?.name, place?.category?.slug, place?.attributes?.businessProfile?.businessType];
    return values.some((value) => String(value || '').toLowerCase().replace(/[_\s]+/g, '-').includes('resort'));
  }, [place]);
  const isPartyZone = useMemo(() => {
    const values = [place?.subcategory?.name, place?.subcategory?.slug, place?.category?.name, place?.category?.slug, place?.attributes?.businessProfile?.businessType];
    return values.some((value) => String(value || '').toLowerCase().replace(/[_\s]+/g, '-').includes('party-zone'));
  }, [place]);
  if (loading) return <ProfileLoading />;
  if (error || !place) return <ProfileLoading error={error || 'The business could not be found.'} />;
  if (isHealthcareBusiness(place)) return <HealthcareWebsite place={place} />;
  if (weddingType) return <WeddingBusinessWebsite place={place} weddingType={weddingType} />;
  if (propertyType) return <PropertyBusinessWebsite place={place} propertyType={propertyType} />;
  if (isToursTravel) return <ToursTravelWebsite place={place} />;
  if (isHotelResidency) return <HotelResidencyWebsite place={place} />;
  if (isResort) return <ResortWebsite place={place} />;
  if (isPartyZone) return <PartyZoneWebsite place={place} />;
  if (type) return <FoodBusinessWebsite place={place} />;

  if (type === 'restaurant') return <RestaurantProfilePage place={place} />;
  if (type === 'coffee-shop') return <CoffeeShopProfilePage place={place} />;
  if (type === 'bakery') return <BakeryProfilePage place={place} />;
  if (type === 'catering') return <CateringProfilePage place={place} />;
  if (type === 'food-processing') return <FoodProcessingProfilePage place={place} />;
  return <Navigate to={`/place/${businessId}`} replace />;
}

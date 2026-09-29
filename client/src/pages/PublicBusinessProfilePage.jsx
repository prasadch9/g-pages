import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import api from '../services/api';
import RestaurantProfilePage from './food-dining/restaurants/RestaurantProfilePage';
import CoffeeShopProfilePage from './food-dining/coffee-shops/CoffeeShopProfilePage';
import BakeryProfilePage from './food-dining/bakery/BakeryProfilePage';
import CateringProfilePage from './food-dining/catering/CateringProfilePage';
import FoodProcessingProfilePage from './food-dining/food-processing/FoodProcessingProfilePage';
import FoodBusinessWebsite from './food-dining/FoodBusinessWebsite';
import WeddingBusinessWebsite from './marriage-wedding/WeddingBusinessWebsite';
import FunctionHallPublicPage from './marriage-wedding/function-halls/FunctionHallPublicPage';
import EventOrganizerPublicPage from './marriage-wedding/event-organizers/EventOrganizerPublicPage';
import CateringServicesPublicPage from './marriage-wedding/catering/CateringServicesPublicPage';
import FlowerDecorationPublicPage from './marriage-wedding/flower-decoration/FlowerDecorationPublicPage';
import FashionDesignerPublicPage from './marriage-wedding/fashion-designers/FashionDesignerPublicPage';
import BeautyParlourPublicPage from './marriage-wedding/beauty-parlours/BeautyParlourPublicPage';
import SaloonSpaPublicPage from './marriage-wedding/salon-spa/SaloonSpaPublicPage';
import HomeAppliancesPublicPage from './shopping-retail/home-appliances/HomeAppliancesPublicPage';
import FurnitureShopPublicPage from './shopping-retail/furniture-shops/FurnitureShopPublicPage';
import MattressShopPublicPage from './shopping-retail/mattress-shops/MattressShopPublicPage';
import {
  BoutiquePublicPage,
  ShoppingMallPublicPage,
  NurseryPublicPage,
} from './shopping-retail/ShoppingRetailPublicPages';
import PropertyBusinessWebsite from './real-estate-construction/PropertyBusinessWebsite';
import HealthcareWebsite from './healthcare-medical/hospitals/HealthcareWebsite';
import ToursTravelWebsite from './travel-hospitality/tours-travels/ToursTravelWebsite';
import HotelResidencyWebsite from './travel-hospitality/hotels/HotelResidencyWebsite';
import ResortWebsite from './travel-hospitality/resorts/ResortWebsite';
import PartyZoneWebsite from './travel-hospitality/party-zones/PartyZoneWebsite';
import { ProfileLoading, resolveFoodBusinessType, resolvePropertyBusinessType, resolveWeddingBusinessType } from '../components/public/PublicProfileShared';
import { isHealthcareBusiness } from './healthcare-medical/healthcareUtils';

const normalizeCategoryLabel = (value) => String(value?.name || value?.slug || value || '')
  .trim()
  .toLowerCase()
  .replace(/[_&-]+/g, ' ')
  .replace(/\s+/g, ' ');

const matchesWeddingSubcategory = (place, labels, businessType) => {
  const subcategory = normalizeCategoryLabel(place?.subcategory);
  if (labels.includes(subcategory)) return true;

  const subcategoryId = String(place?.subcategory?._id || place?.subcategory || '');
  const storedType = normalizeCategoryLabel(
    place?.attributes?.businessProfile?.businessType || place?.attributes?.restaurantProfile?.businessType,
  );
  return /^[a-f\d]{24}$/i.test(subcategoryId) && storedType === businessType;
};

const isMarriageWeddingListing = (place) => {
  const categoryLabels = [
    place?.categoryGroup,
    place?.businessGroup,
    place?.category?.group,
    place?.category?.parent?.name,
    place?.category?.parent?.slug,
    place?.category?.name,
    place?.category?.slug,
  ];
  return categoryLabels.some((label) => normalizeCategoryLabel(label) === 'marriage wedding');
};

const isFunctionHallListing = (place) => {
  return isMarriageWeddingListing(place)
    && matchesWeddingSubcategory(place, ['function hall', 'function halls'], 'function hall');
};

const isEventOrganizerListing = (place) => {
  return isMarriageWeddingListing(place)
    && matchesWeddingSubcategory(place, ['event organizer', 'event organizers'], 'event organizer');
};

const isWeddingCateringListing = (place) => {
  return isMarriageWeddingListing(place)
    && matchesWeddingSubcategory(place, ['catering service', 'catering services'], 'catering service');
};

const isFlowerDecorationListing = (place) => {
  return isMarriageWeddingListing(place)
    && matchesWeddingSubcategory(place, ['flower decoration'], 'flower decoration');
};

const isFashionDesignerListing = (place) => {
  return isMarriageWeddingListing(place)
    && matchesWeddingSubcategory(place, ['fashion designer', 'fashion designers'], 'fashion designer');
};

const isBeautyParlourListing = (place) => {
  return isMarriageWeddingListing(place)
    && matchesWeddingSubcategory(place, ['beauty parlour', 'beauty parlours'], 'beauty parlour');
};

const isSaloonSpaListing = (place) => {
  return isMarriageWeddingListing(place)
    && matchesWeddingSubcategory(place, ['saloon spa', 'salon spa'], 'saloon spa');
};

const isShoppingRetailListing = (place, subcategories) => {
  const parentLabels = [
    place?.categoryGroup,
    place?.businessGroup,
    place?.category?.group,
    place?.category?.parent?.name,
    place?.category?.parent?.slug,
    place?.category?.name,
    place?.category?.slug,
  ];
  const isShoppingRetail = parentLabels.some((label) => normalizeCategoryLabel(label) === 'shopping retail');
  if (!isShoppingRetail) return false;

  const candidates = [
    place?.subcategory?.name,
    place?.subcategory?.slug,
    place?.subcategory,
    place?.attributes?.subCategory,
    place?.category?.name,
    place?.category?.slug,
    place?.attributes?.businessProfile?.businessType,
  ].map(normalizeCategoryLabel);
  return candidates.some((candidate) => subcategories.includes(candidate));
};

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
  if (isFunctionHallListing(place)) return <FunctionHallPublicPage place={place} />;
  if (isEventOrganizerListing(place)) return <EventOrganizerPublicPage place={place} />;
  if (isWeddingCateringListing(place)) return <CateringServicesPublicPage place={place} />;
  if (isFlowerDecorationListing(place)) return <FlowerDecorationPublicPage place={place} />;
  if (isFashionDesignerListing(place)) return <FashionDesignerPublicPage place={place} />;
  if (isBeautyParlourListing(place)) return <BeautyParlourPublicPage place={place} />;
  if (isSaloonSpaListing(place)) return <SaloonSpaPublicPage place={place} />;
  if (isShoppingRetailListing(place, ['shopping mall', 'shopping malls'])) return <ShoppingMallPublicPage place={place} />;
  if (isShoppingRetailListing(place, ['boutique'])) return <BoutiquePublicPage place={place} />;
  if (isShoppingRetailListing(place, ['home appliance', 'home appliances'])) return <HomeAppliancesPublicPage place={place} />;
  if (isShoppingRetailListing(place, ['furniture shop', 'furniture shops'])) return <FurnitureShopPublicPage place={place} />;
  if (isShoppingRetailListing(place, ['mattress shop', 'mattress shops'])) return <MattressShopPublicPage place={place} />;
  if (isShoppingRetailListing(place, ['nursery', 'nurseries'])) return <NurseryPublicPage place={place} />;
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

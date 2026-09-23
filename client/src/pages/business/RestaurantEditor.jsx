import React from 'react';
import FoodBusinessEditor from './FoodBusinessEditor';

export default function RestaurantEditor({ place, create = false, onBack }) {
  return <FoodBusinessEditor place={place} businessType="restaurant" create={create} onBack={onBack} />;
}

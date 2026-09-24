import React from 'react';
import { getBusinessForm } from './businessTaxonomy';

const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';

const FIELD_SETS = {
  'Education & Learning': {
    Schools: ['Classes', 'Curriculum', 'Facilities', 'Admission Information', 'Activities', 'Transport'],
    Colleges: ['Courses', 'Departments', 'Facilities', 'Admissions'],
    Universities: ['Courses', 'Departments', 'Campus', 'Admissions'],
    'Training Institutes': ['Courses', 'Technologies', 'Duration', 'Certification', 'Training Modes'],
    Academies: ['Programs', 'Training', 'Facilities'],
    'Sports Academies': ['Sports', 'Training Programs', 'Coaches', 'Facilities', 'Timings'],
  },
  'Healthcare & Medical': {
    Hospitals: ['Medical Services', 'Departments', 'Facilities', 'Emergency', 'Emergency Phone', 'Working Hours'],
    'Multispeciality Hospitals': ['Medical Services', 'Departments', 'Specialities', 'Facilities', 'Emergency', 'Emergency Phone'],
    Cardiology: ['Cardiology Services', 'Treatments', 'Consultation', 'Facilities'],
    ENT: ['ENT Services', 'Treatments', 'Consultation', 'Facilities'],
    Dental: ['Dental Services', 'Treatments', 'Consultation', 'Facilities'],
    'Hearing Solutions': ['Hearing Services', 'Hearing Tests', 'Hearing Devices', 'Consultation', 'Facilities'],
    'Fitness Centres': ['Fitness Programs', 'Trainers', 'Equipment', 'Facilities', 'Membership Information'],
  },
  'Religious & Social': {
    Temples: ['Temple Information', 'Deity', 'Timings', 'Facilities', 'Events'],
    Churches: ['Church Information', 'Services', 'Timings', 'Events'],
    Trusts: ['Trust Information', 'Activities', 'Programs'],
    NGOs: ['Mission', 'Programs', 'Activities', 'Causes'],
    Associations: ['Association Information', 'Activities', 'Membership'],
  },
  'Marriage & Wedding': {
    'Marriage Bureaus': ['Services', 'Marriage Assistance', 'Contact'],
    'Function Halls': ['Hall Capacity', 'Facilities', 'AC/Non-AC', 'Parking', 'Event Types'],
    'Event Organizers': ['Event Services', 'Event Types', 'Packages'],
    'Catering Services': ['Cuisine', 'Catering Types', 'Menu', 'Capacity'],
    'Flower Decoration': ['Decoration Services', 'Event Types', 'Packages'],
    'Fashion Designers': ['Fashion Services', 'Collections', 'Customization'],
    'Beauty Parlours': ['Beauty Services', 'Packages', 'Facilities'],
    'Saloon & Spa': ['Hair Services', 'Spa Services', 'Beauty Services', 'Packages'],
  },
  'Travel & Hospitality': {
    'Tours & Travels': ['Tour Packages', 'Destinations', 'Travel Services', 'Vehicles', 'Experience', 'Travel Philosophy', 'Facilities'],
    'Hotels & Residencies': ['Rooms', 'Room Types', 'Amenities', 'Hotel Services', 'Infrastructure', 'Highlights', 'Check-in/Check-out'],
    Resorts: ['Rooms', 'Activities', 'Facilities', 'Infrastructure', 'Highlights', 'Packages', 'Resort Philosophy'],
    'Party Zones': ['Event Types', 'Party Services', 'Facilities', 'Infrastructure', 'Highlights', 'Packages', 'Venue Philosophy'],
  },
  'Real Estate & Construction': {
    'Real Estate': ['Property Types', 'Services', 'Property Areas'],
    Construction: ['Construction Services', 'Project Types', 'Materials'],
    Roofing: ['Roofing Services', 'Materials', 'Project Types'],
    'Interiors & Decorations': ['Interior Services', 'Design Types', 'Materials'],
    'Tiles Shops': ['Tile Types', 'Brands', 'Materials'],
    'Furniture Shops': ['Furniture Types', 'Brands', 'Customization'],
  },
  'Shopping & Retail': {
    'Shopping Malls': ['Stores', 'Facilities', 'Parking'],
    Boutique: ['Clothing', 'Collections', 'Customization'],
    'Home Appliances': ['Appliance Categories', 'Brands', 'Services'],
    'Furniture Shops': ['Furniture Categories', 'Brands', 'Customization'],
    'Mattress Shops': ['Mattress Types', 'Brands', 'Sizes'],
    Nurseries: ['Plants', 'Gardening Products', 'Services'],
  },
  Automotive: { 'Car Showrooms': ['Brands', 'Models', 'New/Used', 'Services', 'Test Drive', 'Contact'] },
  'Industries & Manufacturing': {
    'Small Scale Industries': ['Products', 'Manufacturing', 'Capacity', 'Manufacturing Process', 'Quality', 'Infrastructure', 'Certifications'],
    'Food Processing': ['Products', 'Processing', 'Production', 'Quality & Safety', 'Packaging', 'Distribution', 'Certifications'],
    'Trading Businesses': ['Products', 'Trading Categories', 'Services', 'Brands & Suppliers', 'Distribution', 'Supply Network', 'Industries Served'],
  },
  'Business & Professional Services': {
    Consultancies: ['Consultancy Services', 'Specializations'],
    Agencies: ['Agency Services', 'Industries Served'],
    'Manpower Agencies': ['Recruitment Services', 'Job Categories'],
    Professions: ['Professional Services', 'Specializations'],
  },
  'Logistics & Moving': { 'Packers & Movers': ['Moving Services', 'Vehicle Types', 'Service Areas', 'Packing Services'] },
  'Arts & Creative': { 'Sculptures (Arts)': ['Art Types', 'Materials', 'Custom Work', 'Gallery'] },
  'Food & Dining': {
    Restaurants: ['Cuisine', 'Menu', 'Popular Dishes', 'Dining Facilities'],
    'Coffee Shops': ['Coffee Types', 'Beverages', 'Snacks'],
    'Sweet Shops & Bakery': ['Sweets', 'Bakery Items', 'Cakes', 'Special Items'],
    'Catering Services': ['Catering Types', 'Menu', 'Events'],
    'Food Processing': ['Products', 'Processing Types', 'Production Information'],
  },
};

export function getCategoryFieldNames(groupName, subcategoryName) {
  return FIELD_SETS[groupName]?.[subcategoryName] || [];
}

export default function CategorySpecificFields({ groupName, subcategoryName, values, onChange }) {
  const fields = getCategoryFieldNames(groupName, subcategoryName);
  const formName = getBusinessForm(groupName);
  if (!formName || !subcategoryName) return <p className="col-span-2 text-sm text-ink/50">Select a subcategory to load its specific form.</p>;
  return <div className="col-span-2 grid gap-4 sm:grid-cols-2">{fields.map((field) => <label key={field} className="text-sm text-ink/70">{field}<textarea rows={3} value={values[field] || ''} onChange={(event) => onChange(field, event.target.value)} className={inputClass} /></label>)}</div>;
}

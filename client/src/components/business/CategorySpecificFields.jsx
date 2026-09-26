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
    Temples: ['Deity / Main Idol', 'Pooja / Seva Services', 'Festivals', 'Daily Timings', 'Announcements', 'History'],
    Churches: ['Pastor / Leader', 'Worship Services', 'Ministries', 'Events', 'Service Timings', 'Community Programs'],
    Trusts: ['Mission', 'Vision', 'Programs', 'Projects', 'Impact', 'Donation Purpose', 'Events'],
    NGOs: ['Mission', 'Causes', 'Projects', 'Impact', 'Volunteer Opportunities', 'Support Options', 'Events'],
    Associations: ['About the Association', 'Memberships', 'Activities', 'Programs', 'Events', 'Committee / Leadership'],
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
    'Tours & Travels': [
      'Header Menu Items', 'Header CTA Text', 'Header CTA Link',
      'Hero Small Heading', 'Hero Main Heading', 'Hero Description', 'Hero Primary Button Text', 'Hero Primary Button Link', 'Hero Secondary Button Text', 'Hero Secondary Button Link', 'Hero Media URL', 'Hero Media Type',
      'About Section Title', 'About Description', 'About Image URL', 'About Video URL', 'About Highlights',
      'Tour Packages', 'Destinations', 'Travel Services', 'Vehicles', 'Experience', 'Travel Philosophy', 'Facilities',
      'Gallery Captions', 'Videos', 'Reels',
      'Booking Enabled', 'Enquiry Enabled', 'Booking Button Text', 'Booking Phone', 'Booking WhatsApp', 'Booking Email',
      'Instagram URL', 'Facebook URL', 'YouTube URL', 'LinkedIn URL', 'X / Twitter URL',
      'Enable Reviews', 'Allow Customer Reviews', 'Require Admin Approval', 'Show Star Rating',
      'Enable Like', 'Enable Share', 'Enable Comment', 'Enable Report', 'SEO Title', 'SEO Description', 'SEO Keywords', 'OG Image URL',
    ],
    'Hotels & Residencies': ['Rooms', 'Room Types', 'Amenities', 'Hotel Services', 'Infrastructure', 'Highlights', 'Check-in/Check-out'],
    Resorts: [
      'Header Menu Items', 'Header CTA Text', 'Header CTA Link',
      'Hero Small Heading', 'Hero Main Heading', 'Hero Description', 'Hero Primary Button Text', 'Hero Primary Button Link', 'Hero Secondary Button Text', 'Hero Secondary Button Link', 'Hero Media URL', 'Hero Media Type',
      'About Section Title', 'About Description', 'About Image URL', 'About Video URL', 'About Highlights',
      'Rooms', 'Stay Options', 'Activities', 'Facilities', 'Infrastructure', 'Highlights', 'Packages', 'Resort Philosophy',
      'Gallery Captions', 'Videos', 'Reels',
      'Booking Enabled', 'Stay Enquiry Enabled', 'WhatsApp Booking Enabled', 'Phone Booking Enabled', 'Booking Button Text', 'Booking Phone', 'Booking WhatsApp', 'Booking Email',
      'Instagram URL', 'Facebook URL', 'YouTube URL', 'LinkedIn URL', 'X / Twitter URL',
      'Enable Reviews', 'Allow Customer Reviews', 'Require Admin Approval', 'Show Star Rating',
      'Enable Like', 'Enable Share', 'Enable Comment', 'Enable Report', 'SEO Title', 'SEO Description', 'SEO Keywords', 'OG Image URL',
    ],
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
    'Small Scale Industries': ['Products', 'Manufacturing', 'Capacity'],
    'Food Processing': ['Products', 'Processing', 'Production'],
    'Trading Businesses': ['Products', 'Trading Categories', 'Services'],
  },
  'Business & Professional Services': {
    Consultancies: ['Consultancy Type', 'Areas of Expertise', 'Industries Served', 'Consulting Services', 'Service Locations'],
    Agencies: ['Agency Type', 'Agency Services', 'Client Industries', 'Service Locations'],
    'Manpower Agencies': ['Recruitment Services', 'Employer Services', 'Candidate Services', 'Job Categories', 'Industries Served', 'Service Coverage'],
    Professions: ['Profession Type', 'Professional Title', 'Professional Services', 'Areas of Expertise', 'Qualifications', 'Experience', 'Service Locations'],
  },
  'Logistics & Moving': { 'Packers & Movers': ['Moving Services', 'Service Areas', 'Fleet', 'Storage / Warehousing', 'Moving Process', 'Insurance Coverage'] },
  'Arts & Creative': { 'Sculptures (Arts)': ['Art Types', 'Materials', 'Custom Work', 'Gallery'] },
  'Food & Dining': {
    Restaurant: ['Cuisine Type', 'Food Type (Veg / Non-Veg / Both)', 'Price Range', 'Dining Facilities', 'Services', 'Popular Dishes / Menu', 'Special Offers'],
    Restaurants: ['Cuisine Type', 'Food Type (Veg / Non-Veg / Both)', 'Price Range', 'Dining Facilities', 'Services', 'Popular Dishes / Menu', 'Special Offers'],
    'Coffee Shop': ['Coffee Types', 'Beverages', 'Snacks', 'Signature Drinks', 'Seating Options', 'Services'],
    'Coffee Shops': ['Coffee Types', 'Beverages', 'Snacks', 'Signature Drinks', 'Seating Options', 'Services'],
    'Sweet Shop & Bakery': ['Sweets', 'Bakery Items', 'Cakes', 'Pastries', 'Special Items', 'Custom Orders'],
    'Sweet Shops & Bakery': ['Sweets', 'Bakery Items', 'Cakes', 'Pastries', 'Special Items', 'Custom Orders'],
    'Catering Service': ['Catering Types', 'Cuisine Types', 'Menu / Packages', 'Event Types', 'Service Areas', 'Guest Capacity'],
    'Catering Services': ['Catering Types', 'Cuisine Types', 'Menu / Packages', 'Event Types', 'Service Areas', 'Guest Capacity'],
    'Food Processing': ['Products', 'Product Categories', 'Processing Types', 'Production Capacity', 'Certifications'],
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

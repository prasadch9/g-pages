const CATEGORY_GROUPS = {
  'Education & Learning': ['Schools', 'Colleges', 'Universities', 'Training Institutes', 'Academies', 'Sports Academies'],
  'Healthcare & Medical': ['Hospitals', 'Multispeciality Hospitals', 'Cardiology', 'ENT', 'Dental', 'Hearing Solutions', 'Fitness Centres'],
  'Religious & Social': ['Temples', 'Churches', 'Trusts', 'NGOs', 'Associations'],
  'Marriage & Wedding': ['Marriage Bureaus', 'Function Halls', 'Event Organizers', 'Catering Services', 'Flower Decoration', 'Fashion Designers', 'Beauty Parlours', 'Saloon & Spa'],
  'Travel & Hospitality': ['Tours & Travels', 'Hotels & Residencies', 'Resorts', 'Party Zones'],
  'Real Estate & Construction': ['Real Estate', 'Construction', 'Roofing', 'Interiors & Decorations', 'Tiles Shops', 'Furniture Shops'],
  'Food & Dining': ['Restaurants', 'Coffee Shops', 'Sweet Shops & Bakery', 'Catering Services', 'Food Processing'],
  'Shopping & Retail': ['Shopping Malls', 'Boutique', 'Home Appliances', 'Furniture Shops', 'Mattress Shops', 'Nurseries'],
  Automotive: ['Car Showrooms'],
  'Industries & Manufacturing': ['Small Scale Industries', 'Food Processing', 'Trading Businesses', 'Solar'],
  'Business & Professional Services': ['Consultancies', 'Agencies', 'Manpower Agencies', 'Professions'],
  'Logistics & Moving': ['Packers & Movers'],
  'Arts & Creative': ['Sculptures (Arts)'],
};

const MODULES = {
  Schools: ['admissions', 'academics', 'faculty', 'campus', 'facilities', 'sports', 'activities', 'achievements', 'gallery', 'videos', 'testimonials'],
  Colleges: ['courses', 'departments', 'faculty', 'campus', 'facilities', 'admissions', 'placements', 'clubs', 'events', 'gallery', 'videos'],
  Universities: ['programs', 'departments', 'faculty', 'research', 'campus', 'admissions', 'scholarships', 'placements', 'innovation', 'gallery', 'videos'],
  'Training Institutes': ['courses', 'trainers', 'certifications', 'trainingModes', 'schedules', 'projects', 'placements', 'facilities', 'gallery', 'videos'],
  Academies: ['programs', 'trainers', 'levels', 'schedules', 'facilities', 'activities', 'events', 'achievements', 'gallery', 'videos'],
  'Sports Academies': ['sports', 'coaches', 'trainingPrograms', 'ageGroups', 'schedule', 'facilities', 'tournaments', 'achievements', 'gallery', 'videos'],
  Hospitals: ['departments', 'doctors', 'specialities', 'facilities', 'diagnostics', 'services', 'appointment', 'emergency', 'visitingInformation', 'gallery', 'videos', 'testimonials'],
  'Multispeciality Hospitals': ['departments', 'specialists', 'doctors', 'diagnostics', 'facilities', 'procedures', 'appointment', 'emergency', 'gallery', 'videos', 'testimonials'],
  Cardiology: ['services', 'specialists', 'diagnostics', 'procedures', 'facilities', 'appointment', 'patientInformation', 'gallery', 'videos'],
  ENT: ['services', 'specialists', 'diagnostics', 'treatments', 'appointment', 'facilities', 'gallery', 'videos', 'testimonials'],
  Dental: ['services', 'dentists', 'treatments', 'facilities', 'appointment', 'gallery', 'videos', 'testimonials'],
  'Hearing Solutions': ['services', 'hearingTests', 'specialists', 'hearingProducts', 'appointment', 'facilities', 'gallery', 'videos'],
  'Fitness Centres': ['memberships', 'fitnessPrograms', 'trainers', 'classes', 'timetable', 'facilities', 'programs', 'gallery', 'videos', 'testimonials'],
};

const DEFAULT_MODULES = ['about', 'services', 'contact', 'hours', 'gallery', 'videos', 'reviews', 'location'];

function getCategoryGroup(subcategory) {
  return Object.entries(CATEGORY_GROUPS).find(([, names]) => names.includes(subcategory))?.[0] || null;
}

function getModules(subcategory, pageType = 'static') {
  const specific = MODULES[subcategory] || DEFAULT_MODULES;
  return pageType === 'dynamic' ? [...new Set([...specific, 'portfolio', 'albums', 'socialMedia', 'website', 'offers', 'events'])] : ['about', 'services', 'contact', 'hours', 'gallery', 'location'];
}

module.exports = { CATEGORY_GROUPS, MODULES, getCategoryGroup, getModules };

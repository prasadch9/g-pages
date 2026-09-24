const BUSINESS_CATEGORY_GROUPS = {
  'education-learning': ['Schools', 'Colleges', 'Universities', 'Training Institutes', 'Academies', 'Sports Academies'],
  'healthcare-medical': ['Hospitals', 'Multispeciality Hospitals', 'Cardiology', 'ENT', 'Dental', 'Hearing Solutions', 'Fitness Centres'],
  'religious-social': ['Temples', 'Churches', 'Trusts', 'NGOs', 'Associations'],
  'marriage-wedding': ['Marriage Bureaus', 'Function Halls', 'Event Organizers', 'Catering Services', 'Flower Decoration', 'Fashion Designers', 'Beauty Parlours', 'Saloon & Spa'],
  'travel-hospitality': ['Tours & Travels', 'Hotels & Residencies', 'Resorts', 'Party Zones'],
  'real-estate-construction': ['Real Estate', 'Construction', 'Roofing', 'Interiors & Decorations', 'Tiles Shops', 'Furniture Shops'],
  'food-dining': ['Restaurants', 'Coffee Shops', 'Sweet Shops & Bakery', 'Catering Services', 'Food Processing'],
  'shopping-retail': ['Shopping Malls', 'Boutique', 'Home Appliances', 'Furniture Shops', 'Mattress Shops', 'Nurseries'],
  automotive: ['Car Showrooms'],
  'industries-manufacturing': ['Small Scale Industries', 'Food Processing', 'Trading Businesses'],
  'business-professional-services': ['Consultancies', 'Agencies', 'Manpower Agencies', 'Professions'],
  'logistics-moving': ['Packers & Movers'],
  'arts-creative': ['Sculptures (Arts)'],
};

const SUBCATEGORY_TO_GROUP = Object.fromEntries(
  Object.entries(BUSINESS_CATEGORY_GROUPS).flatMap(([group, subcategories]) => subcategories.map((subcategory) => [subcategory, group]))
);

const CATEGORY_MODULES = {
  Schools: ['admissions', 'classes', 'academicPrograms', 'faculty', 'campus', 'facilities', 'sports', 'activities', 'events', 'achievements'],
  Hospitals: ['departments', 'doctors', 'specialities', 'diagnostics', 'facilities', 'appointment', 'emergency'],
  Restaurants: ['menu', 'foodItems', 'ambience', 'offers', 'events', 'reservation'],
  'Real Estate': ['properties', 'featuredListings', 'projects', 'amenities'],
  'Packers & Movers': ['movingServices', 'serviceAreas', 'fleet', 'packingProcess', 'quote'],
  Consultancies: ['expertise', 'consultingServices', 'team', 'caseStudies', 'certifications', 'industriesServed'],
  Agencies: ['services', 'portfolio', 'campaigns', 'projects', 'team', 'clients', 'caseStudies'],
  'Manpower Agencies': ['recruitmentServices', 'employerServices', 'candidateServices', 'industriesServed', 'serviceLocations', 'team'],
  Professions: ['professionalServices', 'expertise', 'qualifications', 'certifications', 'portfolio', 'appointment'],
  'Sculptures (Arts)': ['artistProfile', 'collections', 'artworks', 'exhibitions', 'projects'],
};

const getBusinessGroup = (subcategory) => SUBCATEGORY_TO_GROUP[subcategory] || null;
const getModules = (subcategory, pageType) => pageType === 'dynamic' ? (CATEGORY_MODULES[subcategory] || []) : [];

module.exports = { BUSINESS_CATEGORY_GROUPS, SUBCATEGORY_TO_GROUP, CATEGORY_MODULES, getBusinessGroup, getModules };

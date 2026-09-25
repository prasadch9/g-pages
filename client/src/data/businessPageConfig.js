export const BUSINESS_PAGE_TYPES = {
  static: {
    label: 'Static / Standard',
    description: 'A clean, lightweight profile for essential business information.',
    modules: ['about', 'services', 'contact', 'hours', 'gallery', 'location'],
  },
  dynamic: {
    label: 'Dynamic / Premium',
    description: 'A richer mini-website with media, social links, showcases, and category modules.',
    modules: ['hero', 'about', 'services', 'portfolio', 'gallery', 'albums', 'videos', 'testimonials', 'offers', 'events', 'socialMedia', 'website', 'hours', 'location'],
  },
};

export const CATEGORY_MODULES = {
  schools: ['admissions', 'academics', 'faculty', 'campus', 'facilities', 'sports', 'activities', 'achievements'],
  colleges: ['courses', 'departments', 'faculty', 'campus', 'facilities', 'admissions', 'placements', 'clubs', 'events'],
  universities: ['programs', 'departments', 'faculty', 'research', 'campus', 'admissions', 'scholarships', 'placements', 'innovation'],
  hospitals: ['departments', 'doctors', 'specialities', 'diagnostics', 'facilities', 'appointment', 'emergency'],
  restaurants: ['menu', 'categories', 'popularDishes', 'ambience', 'offers', 'events', 'reservation'],
  'car-showrooms': ['brands', 'carModels', 'featuredVehicles', 'testDrive', 'offers'],
  'packers-movers': ['movingServices', 'serviceAreas', 'fleet', 'packingProcess', 'testimonials', 'quote'],
  'sculptures-arts': ['artistProfile', 'collections', 'artworks', 'exhibitions', 'projects'],
  temples: ['history', 'deityInformation', 'timings', 'poojaServices', 'festivals', 'announcements'],
  churches: ['worshipServices', 'timings', 'ministries', 'announcements'],
  trusts: ['mission', 'vision', 'programs', 'projects', 'impact', 'events'],
  ngos: ['mission', 'causes', 'programs', 'projects', 'impact', 'volunteers', 'events'],
  associations: ['members', 'activities', 'programs', 'events', 'announcements'],
  'marriage-bureaus': ['process', 'programs', 'team', 'testimonials'],
  'function-halls': ['venue', 'capacity', 'facilities', 'packages', 'videoTour', 'events', 'booking'],
  'event-organizers': ['services', 'packages', 'portfolio', 'events', 'team', 'testimonials'],
  'catering-services': ['menus', 'packages', 'cuisine', 'eventsServed'],
  'flower-decoration': ['decorationServices', 'themes', 'portfolio', 'packages'],
  'fashion-designers': ['collections', 'services', 'portfolio', 'customDesigns', 'designerProfile'],
  'beauty-parlours': ['services', 'treatments', 'packages', 'team', 'offers', 'appointment'],
  'saloon-spa': ['hairServices', 'spaTreatments', 'packages', 'team', 'offers', 'appointment'],
  'tours-travels': ['tourPackages', 'destinations', 'itineraries', 'transport'],
  'hotels-residencies': ['rooms', 'amenities', 'dining', 'offers', 'policies', 'booking'],
  resorts: ['roomsVillas', 'amenities', 'activities', 'dining', 'events', 'videoTour', 'offers'],
  'party-zones': ['partySpaces', 'packages', 'amenities', 'themes', 'offers', 'booking'],
  'real-estate': ['properties', 'featuredListings', 'projects', 'amenities'],
  construction: ['services', 'projects', 'capabilities', 'materials', 'team', 'certifications'],
  roofing: ['roofingServices', 'materials', 'projects', 'serviceAreas', 'testimonials'],
  'interiors-decorations': ['services', 'designStyles', 'portfolio', 'projects', 'team', 'materials'],
  'tiles-shops': ['tileCategories', 'brands', 'collections', 'productShowcase', 'offers'],
  'furniture-shops': ['furnitureCategories', 'collections', 'brands', 'products', 'offers'],
  'coffee-shops': ['menu', 'signatureDrinks', 'ambience', 'offers', 'events'],
  'sweet-shops-bakery': ['products', 'collections', 'signatureItems', 'seasonalSpecials', 'offers'],
  'food-processing': ['products', 'processingCapabilities', 'facilities', 'certifications', 'packaging'],
  'shopping-malls': ['stores', 'facilities', 'events', 'offers', 'directions'],
  boutique: ['collections', 'designers', 'portfolio', 'categories', 'offers'],
  'home-appliances': ['productCategories', 'brands', 'featuredProducts', 'offers', 'services'],
  'mattress-shops': ['mattressCategories', 'brands', 'featuredProducts', 'offers', 'storeInformation'],
  nurseries: ['plants', 'categories', 'gardeningProducts', 'services', 'seasonalOffers'],
  'small-scale-industries': ['products', 'manufacturingCapabilities', 'machinery', 'infrastructure', 'certifications', 'industriesServed'],
  'trading-businesses': ['productCategories', 'brands', 'supplyCapabilities', 'marketsServed', 'catalogue'],
  consultancies: ['expertise', 'consultingServices', 'team', 'caseStudies', 'certifications', 'industriesServed'],
  agencies: ['services', 'portfolio', 'campaigns', 'projects', 'team', 'clients', 'caseStudies'],
  'manpower-agencies': ['recruitmentServices', 'employerServices', 'candidateServices', 'industriesServed', 'serviceLocations', 'team'],
  professions: ['professionalServices', 'expertise', 'qualifications', 'certifications', 'portfolio', 'appointment'],
};

export const getCategoryModules = (subcategory, pageType = 'static') => {
  const common = BUSINESS_PAGE_TYPES[pageType]?.modules || BUSINESS_PAGE_TYPES.static.modules;
  const specific = CATEGORY_MODULES[subcategory] || [];
  return [...new Set([...common, ...(pageType === 'dynamic' ? specific : [])])];
};

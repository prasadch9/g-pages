require('dotenv').config();

const mongoose = require('mongoose');
const slugify = require('slugify');
const Category = require('../models/Category');
const Location = require('../models/Location');
const Place = require('../models/Place');
const User = require('../models/User');
const connectDB = require('../config/db');
const { skinCareDemoAttributes } = require('./skinCareDemoData');

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1200&q=80',
];

async function syncSkinCareDemoPlaces() {
  await connectDB();

  const [category, demoOwner, cities] = await Promise.all([
    Category.findOne({ name: 'Skin Care', status: 'active' }),
    User.findOne({ email: 'demo.owner@googlepages.local' }),
    Location.find({ level: 'city', status: 'active' }).populate({ path: 'parent', populate: { path: 'parent' } }).sort('name'),
  ]);

  if (!category) throw new Error('Skin Care category is missing. Run npm run sync:skin-care-category first.');
  if (!demoOwner) throw new Error('Demo owner is missing. Create it through the normal demo seed setup first.');
  if (!cities.length) throw new Error('No active cities are available for the demo listing.');

  let created = 0;
  let updated = 0;
  let skipped = 0;

  const demoCities = cities.slice(0, 5);
  const keepCityIds = demoCities.map((city) => city._id);
  const allDemoSlugs = cities.map((city) => slugify(`${city.name} Skin Care Hub`, { lower: true, strict: true, trim: true }));
  await Place.deleteMany({
    owner: demoOwner._id,
    category: category._id,
    subcategory: 'Skin Care',
    slug: { $in: allDemoSlugs },
    'location.city': { $nin: keepCityIds },
  });

  for (const [index, city] of demoCities.entries()) {
    const district = city.parent;
    const state = district?.parent;
    if (!district || !state) { skipped += 1; continue; }

    const area = await Location.findOne({ level: 'area', status: 'active', parent: city._id }).sort('name');
    const name = `${city.name} Skin Care Hub`;
    const slug = slugify(name, { lower: true, strict: true, trim: true });
    const existing = await Place.findOne({ slug, 'location.city': city._id }).select('owner').lean();
    if (existing && String(existing.owner) !== String(demoOwner._id)) { skipped += 1; continue; }

    const coverImage = DEMO_IMAGES[index % DEMO_IMAGES.length];
    const galleryImages = [coverImage, DEMO_IMAGES[(index + 1) % DEMO_IMAGES.length], DEMO_IMAGES[(index + 2) % DEMO_IMAGES.length]];
    const categorySpecific = skinCareDemoAttributes(coverImage, galleryImages);
    const attributes = categorySpecific;
    const placeData = {
      name, slug, category: category._id, categoryGroup: 'Healthcare & Medical', businessGroup: 'Healthcare & Medical', subcategory: 'Skin Care',
      pageType: 'static', applicationStatus: 'approved', isPublished: true, status: 'approved', verified: true,
      location: { state: state._id, district: district._id, city: city._id, area: area?._id || null, areaText: area?.name || '' },
      address: `${area?.name || city.name} Main Road, ${city.name}, Andhra Pradesh`,
      description: categorySpecific.businessProfile.categorySpecific.aboutDescription,
      phone: '9876543210', email: 'hello@googlepages.local', website: 'https://www.google.com',
      socialLinks: { whatsapp: '9876543210' }, images: galleryImages, coverImage, videos: [],
      services: categorySpecific.businessProfile.categorySpecific.skinServices.map((service) => service.caption),
      facilities: ['Qualified dermatology team', 'Personalized consultations', 'Appointment assistance'],
      coordinates: { lat: 16.98 + (index % 5) * 0.006, lng: 81.78 + (index % 4) * 0.006 },
      attributes, rating: { average: 4.6, count: 24 }, owner: demoOwner._id,
    };

    await Place.findOneAndUpdate(
      { slug, 'location.city': city._id, owner: demoOwner._id },
      { $set: placeData, $setOnInsert: { views: 120, favoritesCount: 8 } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    if (existing) updated += 1;
    else created += 1;
  }

  console.log(`[skin-care-demo] Created ${created}, updated ${updated}, skipped ${skipped}; active sample listings now available.`);
}

syncSkinCareDemoPlaces()
  .catch((error) => {
    console.error(`[skin-care-demo] ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

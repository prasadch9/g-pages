require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Place = require('./models/Place');
const Category = require('./models/Category');
const Location = require('./models/Location');
const User = require('./models/User');

(async () => {
  await connectDB();
  await Place.deleteMany({});

  const category = await Category.findOne({ name: 'Restaurants' });
  const city = await Location.findOne({ name: 'Paderu', level: 'city' });
  const user = await User.findOne({ email: 'demo.owner@googlepages.local' });

  console.log('CATEGORY', category && category._id);
  console.log('CITY', city && city._id);
  console.log('USER', user && user._id);

  const doc = await Place.findOneAndUpdate(
    { name: 'Paderu Restaurant Hub', 'location.city': city._id, category: category._id },
    { $set: {
      name: 'Paderu Restaurant Hub',
      slug: 'paderu-restaurant-hub',
      category: category._id,
      subcategory: 'Restaurants',
      pageType: 'static',
      applicationStatus: 'approved',
      isPublished: true,
      location: { state: city.parent, district: city.parent.parent, city: city._id, area: null },
      address: 'Paderu Main Road, Paderu, Andhra Pradesh',
      description: 'A trusted, locally loved restaurant serving families and visitors across Paderu.',
      phone: '9876543210',
      email: 'hello@googlepages.local',
      website: 'https://www.google.com',
      images: [],
      coverImage: '',
      services: ['Walk-in service'],
      facilities: ['Easy access'],
      coordinates: { lat: 16.98, lng: 81.78 },
      rating: { average: 4.1, count: 18 },
      verified: true,
      status: 'approved',
      owner: user._id,
      views: 120,
      favoritesCount: 8,
    } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('CREATED', doc && doc._id);
  const count = await Place.countDocuments({ slug: 'paderu-restaurant-hub' });
  console.log('COUNT', count);
  await mongoose.connection.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Place = require('./models/Place');

(async () => {
  await connectDB();
  const categories = await Category.find({ name: { $in: ['Restaurants', 'Restaurant', 'Schools', 'Hospitals'] } }).lean();
  console.log('CATEGORIES', categories);
  const places = await Place.find({ name: /^Paderu .* Hub$/i }).lean();
  console.log('PLACE_COUNTS', places.length);
  console.log(JSON.stringify(places.slice(0, 10), null, 2));
  await mongoose.connection.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

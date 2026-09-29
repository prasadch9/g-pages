require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Location = require('./models/Location');
const Category = require('./models/Category');
const { getCategoryGroup } = require('./config/categoryModules');
const slugify = require('slugify');

const createSlug = (name) => slugify(name, { lower: true, strict: true, trim: true });

(async () => {
  await connectDB();
  const categories = await Category.find({ status: 'active' }).sort('order');
  const cities = await Location.find({ level: 'city', status: 'active' }).populate({ path: 'parent', populate: { path: 'parent' } });

  const seen = new Map();
  for (const city of cities) {
    const state = await Location.findOne({ level: 'state', _id: city.parent.parent });
    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex += 1) {
      const category = categories[categoryIndex];
      const name = `${city.name} ${category.name.replace(/s$/, '')} Hub`;
      const slug = createSlug(name);
      const key = `${city._id.toString()}|${slug}`;
      if (seen.has(key)) {
        console.log('DUPLICATE', { city: city.name, cityId: city._id.toString(), category: category.name, name, slug });
      }
      seen.set(key, true);
    }
  }

  console.log('CITIES', cities.length);
  console.log('CATEGORIES', categories.length);
  await mongoose.connection.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

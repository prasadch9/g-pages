require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');

(async () => {
  await connectDB();
  const categories = await Category.find({ status: 'active' }).sort('order').lean();
  const counts = new Map();
  for (const c of categories) {
    counts.set(c.name, (counts.get(c.name) || 0) + 1);
  }
  const duplicates = [...counts.entries()].filter(([, count]) => count > 1);
  console.log('TOTAL_ACTIVE_CATEGORIES', categories.length);
  console.log('DUPLICATE_CATEGORY_NAMES', JSON.stringify(duplicates.slice(0, 50), null, 2));
  const names = categories.map(c => c.name);
  console.log('HAS_RESTAURANTS_COUNT', names.filter(n => n === 'Restaurants').length);
  console.log('SAMPLE', names.slice(0, 80));
  await mongoose.connection.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

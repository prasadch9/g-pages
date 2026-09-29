require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Location = require('./models/Location');

(async () => {
  await connectDB();
  const cities = await Location.find({ level: 'city', status: 'active' }).lean();
  const counts = new Map();
  for (const city of cities) {
    const key = `${city.name}|${city.parent.toString()}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const duplicates = [...counts.entries()].filter(([, count]) => count > 1);
  console.log('TOTAL_ACTIVE_CITIES', cities.length);
  console.log('DUPLICATE_CITY_GROUPS', duplicates.length);
  console.log(JSON.stringify(duplicates.slice(0, 20), null, 2));
  console.log('FIRST_CITIES', cities.slice(0, 20).map(c => ({ name: c.name, id: c._id.toString(), parent: c.parent.toString() })));
  await mongoose.connection.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

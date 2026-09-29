require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Place = require('./models/Place');

(async () => {
  await connectDB();
  const docs = await Place.find({ slug: 'paderu-restaurant-hub' }).lean();
  console.log('COUNT', docs.length);
  console.log(JSON.stringify(docs, null, 2));
  await mongoose.connection.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

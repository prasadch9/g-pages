require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Place = require('./models/Place');

(async () => {
  await connectDB();
  const before = await Place.countDocuments({});
  console.log('BEFORE', before);
  await Place.deleteMany({});
  const after = await Place.countDocuments({});
  console.log('AFTER', after);
  await mongoose.connection.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

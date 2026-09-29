require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Place = require('./models/Place');

(async () => {
  await connectDB();
  const user = await User.findOne({ email: 'demo.owner@googlepages.local' }).lean();
  console.log('USER', user);
  const places = await Place.find({ owner: user?._id }).lean();
  console.log('PLACES_FOR_USER', places.length, JSON.stringify(places, null, 2));
  await mongoose.connection.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

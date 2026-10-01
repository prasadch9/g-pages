require('dotenv').config();

const slugify = require('slugify');
const Category = require('../models/Category');
const connectDB = require('../config/db');

async function syncSkinCareCategory() {
  await connectDB();

  await Category.findOneAndUpdate(
    { name: 'Skin Care' },
    {
      $set: {
        name: 'Skin Care',
        slug: slugify('Skin Care', { lower: true, strict: true, trim: true }),
        group: 'Healthcare & Medical',
        parent: null,
        status: 'active',
      },
      $setOnInsert: { order: 8 },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log('[category-sync] Skin Care is available under Healthcare & Medical');
  process.exitCode = 0;
  await require('mongoose').disconnect();
}

syncSkinCareCategory().catch(async (error) => {
  console.error(`[category-sync] ${error.message}`);
  await require('mongoose').disconnect();
  process.exitCode = 1;
});

const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'global' },
    instagramUrl: { type: String, trim: true, default: '' },
    facebookUrl: { type: String, trim: true, default: '' },
    whatsappNumber: { type: String, trim: true, default: '919876543210' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
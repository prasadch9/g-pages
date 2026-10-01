const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, trim: true, maxlength: 200, required: true },
  slug: { type: String, trim: true, lowercase: true, maxlength: 220, required: true, unique: true },
  category: { type: String, trim: true, maxlength: 100, default: '' },
  location: {
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null },
    district: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null },
  },
  shortDescription: { type: String, trim: true, maxlength: 500, default: '' },
  featuredImage: {
    url: { type: String, trim: true, default: '' },
    alt: { type: String, trim: true, maxlength: 250, default: '' },
  },
  content: { type: String, default: '' },
  gallery: [{ url: { type: String, trim: true }, alt: { type: String, trim: true, maxlength: 250, default: '' } }],
  videoUrl: { type: String, trim: true, maxlength: 2048, default: '' },
  tags: [{ type: String, trim: true, maxlength: 40 }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  seo: {
    title: { type: String, trim: true, maxlength: 160, default: '' },
    description: { type: String, trim: true, maxlength: 320, default: '' },
    keywords: [{ type: String, trim: true, maxlength: 60 }],
  },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
  publishedAt: { type: Date, default: null },
  views: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ 'location.city': 1, status: 1 });
blogSchema.index({ title: 'text', shortDescription: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);

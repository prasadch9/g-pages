const Blog = require('../models/Blog');
const Location = require('../models/Location');
const slugify = require('slugify');
const { AppError } = require('../middleware/errorHandler');

const BLOG_CATEGORIES = [
  'Education & Learning',
  'Healthcare & Medical',
  'Religious & Social',
  'Marriage & Wedding',
  'Travel & Hospitality',
  'Real Estate & Construction',
  'Industrial & Manufacturing',
  'Business & Services',
  'Technology',
  'Local Information',
  'Events & Festivals',
  'General',
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toList = (value) => (Array.isArray(value) ? value : String(value || '').split(/[\n,]/))
  .map((item) => String(item || '').trim())
  .filter(Boolean);
const populateBlog = (query) => query
  .populate('author', 'name')
  .populate('location.state location.district location.city', 'name slug');
const publicationWindow = (now) => ({ $or: [
  { publishedAt: { $lte: now } },
  { publishedAt: null, createdAt: { $lte: now } },
] });

const normalizeBlogRecord = (blog) => {
  if (!blog) return blog;
  const record = typeof blog.toObject === 'function' ? blog.toObject() : blog;
  const asLocation = (value) => typeof value === 'string' ? { name: value } : value || null;
  return {
    ...record,
    shortDescription: record.shortDescription || record.description || '',
    featuredImage: typeof record.featuredImage === 'string'
      ? { url: record.featuredImage, alt: record.altText || '' }
      : record.featuredImage || { url: '', alt: record.altText || '' },
    location: record.location || {
      state: asLocation(record.state),
      district: asLocation(record.district),
      city: asLocation(record.city),
    },
    gallery: (record.gallery || []).map((item) => typeof item === 'string' ? { url: item, alt: '' } : item),
    seo: record.seo || {
      title: record.seoTitle || '',
      description: record.metaDescription || '',
      keywords: toList(record.keywords),
    },
    publishedAt: record.publishedAt || (record.status === 'published' ? record.createdAt : null),
  };
};

const getDateStart = (period) => {
  const now = new Date();
  if (period === 'month') return new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === 'year') return new Date(now.getFullYear(), 0, 1);
  return null;
};

const makeUniqueSlug = async (value, excludeId) => {
  const base = slugify(value || 'blog', { lower: true, strict: true, trim: true }) || 'blog';
  let slug = base;
  let suffix = 2;
  while (await Blog.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
};

const normalizeBlogInput = (body) => ({
  title: String(body.title || '').trim(),
  slug: String(body.slug || body.title || '').trim(),
  category: String(body.category || '').trim(),
  location: {
    state: body.location?.state || null,
    district: body.location?.district || null,
    city: body.location?.city || null,
  },
  shortDescription: String(body.shortDescription || '').trim(),
  featuredImage: {
    url: String(body.featuredImage?.url || '').trim(),
    alt: String(body.featuredImage?.alt || '').trim(),
  },
  content: String(body.content || ''),
  gallery: (Array.isArray(body.gallery) ? body.gallery : []).map((item) => ({
    url: String(item.url || '').trim(),
    alt: String(item.alt || '').trim(),
  })).filter((item) => item.url).slice(0, 20),
  videoUrl: String(body.videoUrl || '').trim(),
  tags: [...new Set(toList(body.tags).map((tag) => tag.slice(0, 40)))],
  seo: {
    title: String(body.seo?.title || '').trim(),
    description: String(body.seo?.description || '').trim(),
    keywords: [...new Set(toList(body.seo?.keywords).map((keyword) => keyword.slice(0, 60)))],
  },
  status: ['draft', 'published', 'archived'].includes(body.status) ? body.status : 'draft',
  publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
});

const validateForPublish = (blog) => {
  if (!blog.title || !BLOG_CATEGORIES.includes(blog.category) || !blog.shortDescription || !blog.featuredImage.url || !blog.content.trim()) {
    throw new AppError('Published blogs need a title, category, short description, featured image, and content.', 400);
  }
  if (!blog.location.state || !blog.location.district || !blog.location.city) {
    throw new AppError('Select a state, district, and city before publishing.', 400);
  }
  if (blog.publishedAt && Number.isNaN(blog.publishedAt.getTime())) {
    throw new AppError('Enter a valid publish date.', 400);
  }
};

const listPublishedBlogs = async (req, res, next) => {
  try {
    const { search = '', category = '', city = '', date = '', page = 1, limit = 9 } = req.query;
    const now = new Date();
    const clauses = [{ status: 'published' }, publicationWindow(now)];
    if (category) clauses.push({ category });
    if (city) clauses.push({ 'location.city': city });
    const dateStart = getDateStart(date);
    if (dateStart) clauses.push({ $or: [
      { publishedAt: { $gte: dateStart, $lte: now } },
      { publishedAt: null, createdAt: { $gte: dateStart, $lte: now } },
    ] });
    if (search.trim()) {
      const matcher = new RegExp(escapeRegex(search.trim()), 'i');
      clauses.push({ $or: [{ title: matcher }, { shortDescription: matcher }, { description: matcher }, { content: matcher }, { tags: matcher }] });
    }
    const filter = { $and: clauses };
    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(30, Math.max(1, Number(limit) || 9));
    const [blogs, total] = await Promise.all([
      populateBlog(Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize)).lean(),
      Blog.countDocuments(filter),
    ]);
    res.status(200).json({ success: true, data: blogs.map(normalizeBlogRecord), pagination: { total, page: pageNumber, pages: Math.ceil(total / pageSize), limit: pageSize } });
  } catch (error) {
    next(error);
  }
};

const getBlogMeta = async (_req, res, next) => {
  try {
    const cityIds = await Blog.distinct('location.city', { status: 'published', ...publicationWindow(new Date()) });
    const cities = await Location.find({ _id: { $in: cityIds } }).select('name slug').sort('name').lean();
    res.status(200).json({ success: true, data: { categories: BLOG_CATEGORIES, cities } });
  } catch (error) {
    next(error);
  }
};

const getAdminBlogMeta = async (_req, res, next) => {
  try {
    const cityIds = await Blog.distinct('location.city');
    const cities = await Location.find({ _id: { $in: cityIds } }).select('name slug').sort('name').lean();
    res.status(200).json({ success: true, data: { categories: BLOG_CATEGORIES, cities } });
  } catch (error) {
    next(error);
  }
};

const getPublishedBlog = async (req, res, next) => {
  try {
    const now = new Date();
    const blog = await populateBlog(Blog.findOneAndUpdate(
      { slug: req.params.slug, status: 'published', ...publicationWindow(now) },
      { $inc: { views: 1 } },
      { new: true },
    )).lean();
    if (!blog) return next(new AppError('Blog not found.', 404));
    const relatedBlogs = await populateBlog(Blog.find({
      _id: { $ne: blog._id },
      status: 'published',
      ...publicationWindow(now),
      ...(blog.category ? { category: blog.category } : {}),
    }).sort({ publishedAt: -1 }).limit(3)).lean();
    res.status(200).json({ success: true, data: { ...normalizeBlogRecord(blog), relatedBlogs: relatedBlogs.map(normalizeBlogRecord) } });
  } catch (error) {
    next(error);
  }
};

const listAdminBlogs = async (req, res, next) => {
  try {
    const { search = '', category = '', status = '', city = '', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (city) filter['location.city'] = city;
    if (search.trim()) {
      const matcher = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [{ title: matcher }, { shortDescription: matcher }, { content: matcher }, { tags: matcher }];
    }
    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));
    const [blogs, total] = await Promise.all([
      populateBlog(Blog.find(filter).sort({ updatedAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize)).lean(),
      Blog.countDocuments(filter),
    ]);
    res.status(200).json({ success: true, data: blogs.map(normalizeBlogRecord), pagination: { total, page: pageNumber, pages: Math.ceil(total / pageSize), limit: pageSize } });
  } catch (error) {
    next(error);
  }
};

const getAdminBlog = async (req, res, next) => {
  try {
    const blog = await populateBlog(Blog.findById(req.params.id)).lean();
    if (!blog) return next(new AppError('Blog not found.', 404));
    res.status(200).json({ success: true, data: normalizeBlogRecord(blog) });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const data = normalizeBlogInput(req.body);
    data.slug = await makeUniqueSlug(data.slug || data.title);
    if (data.status === 'published') {
      validateForPublish(data);
      data.publishedAt ||= new Date();
    }
    const blog = await Blog.create({ ...data, author: req.user._id });
    const result = await populateBlog(Blog.findById(blog._id)).lean();
    res.status(201).json({ success: true, message: 'Blog created.', data: result });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new AppError('Blog not found.', 404));
    const data = normalizeBlogInput(req.body);
    data.slug = await makeUniqueSlug(data.slug || data.title || blog.title, blog._id);
    if (data.status === 'published') {
      validateForPublish(data);
      data.publishedAt ||= blog.publishedAt || new Date();
    } else if (blog.status === 'published') {
      data.publishedAt = null;
    }
    Object.assign(blog, data);
    await blog.save();
    const result = await populateBlog(Blog.findById(blog._id)).lean();
    res.status(200).json({ success: true, message: 'Blog updated.', data: result });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return next(new AppError('Blog not found.', 404));
    res.status(200).json({ success: true, message: 'Blog deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  BLOG_CATEGORIES,
  listPublishedBlogs,
  getBlogMeta,
  getAdminBlogMeta,
  getPublishedBlog,
  listAdminBlogs,
  getAdminBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};

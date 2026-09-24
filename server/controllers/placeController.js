const Place = require('../models/Place');
const Favorite = require('../models/Favorite');
const Category = require('../models/Category');
const BusinessRequest = require('../models/BusinessRequest');
const Notification = require('../models/Notification');
const { getBusinessGroup } = require('../config/businessConfig');
const { storeUpload } = require('../services/mediaStorage');
const { AppError } = require('../middleware/errorHandler');

const normalizeExternalUrl = (value) => {
  if (!value) return null;
  const normalized = String(value).startsWith('http') ? String(value) : `https://${value}`;
  try {
    const url = new URL(normalized);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
};

const validateLinks = (payload) => {
  const result = {};
  const links = { ...(payload.socialLinks || {}) };
  const website = payload.website ? normalizeExternalUrl(payload.website) : payload.website;
  if (payload.website && !website) throw new AppError('Please provide a valid website URL.', 400);
  if (Object.prototype.hasOwnProperty.call(payload, 'website')) result.website = website;
  if (Object.prototype.hasOwnProperty.call(payload, 'socialLinks')) {
    Object.entries(links).forEach(([key, value]) => {
      if (!value) return;
      const normalized = normalizeExternalUrl(value);
      if (!normalized) throw new AppError(`Please provide a valid ${key} URL.`, 400);
      links[key] = normalized;
    });
    result.socialLinks = links;
  }
  return result;
};

const parseField = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return value; }
};

/**
 * GET /api/places
 * Powers both the city+category listing page and global search.
 * Query params:
 *   city, category, area, q (text search), rating (min), verified,
 *   sort (rating|newest|popular), page, limit, plus arbitrary
 *   attribute filters as attr[<key>]=<value> (category-specific filters).
 */
const getPlaces = async (req, res, next) => {
  try {
    const {
      city,
      category,
      area,
      q,
      rating,
      verified,
      sort = 'rating',
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { status: 'approved', applicationStatus: 'approved', isPublished: true };
    if (city) filter['location.city'] = city;
    if (area) filter['location.area'] = area;
    if (category) filter.category = category;
    if (verified === 'true') filter.verified = true;
    if (rating) filter['rating.average'] = { $gte: Number(rating) };
    if (q) {
      filter.$or = [
        { $text: { $search: q } },
        { name: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { services: { $regex: q, $options: 'i' } },
      ];
    }

    // Category-specific attribute filters: attr[board]=CBSE&attr[emergency]=true
    if (req.query.attr && typeof req.query.attr === 'object') {
      Object.entries(req.query.attr).forEach(([key, value]) => {
        filter[`attributes.${key}`] = value;
      });
    }

    const sortMap = {
      rating: { 'rating.average': -1 },
      newest: { createdAt: -1 },
      popular: { views: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [places, total] = await Promise.all([
      Place.find(filter)
        .populate('category', 'name slug icon')
        .sort(sortMap[sort] || sortMap.rating)
        .skip(skip)
        .limit(Number(limit)),
      Place.countDocuments(filter),
    ]);

    // Track search appearances for "most searched" analytics when a text query was used
    if (q && places.length) {
      await Place.updateMany(
        { _id: { $in: places.map((p) => p._id) } },
        { $inc: { searchAppearances: 1 } }
      );
    }

    res.status(200).json({
      success: true,
      data: places,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/places/:id — detail page; increments view count and records recently-viewed. */
const getPlaceById = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate('category', 'name slug icon filters')
      .populate('location.state location.district location.city location.area', 'name slug')
      .populate('owner', 'name email');

    const isAdminPreview = req.user?.role === 'admin';
    if (!place || (!isAdminPreview && (place.status !== 'approved' || place.applicationStatus !== 'approved' || !place.isPublished))) {
      return next(new AppError('Listing not found.', 404));
    }

    place.views += 1;
    await place.save();

    if (req.user) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { recentlyViewed: { place: place._id } },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          recentlyViewed: { $each: [{ place: place._id }], $position: 0, $slice: 20 },
        },
      });
    }

    res.status(200).json({ success: true, data: place });
  } catch (error) {
    next(error);
  }
};

/** GET /api/places/trending?city=... */
const getTrending = async (req, res, next) => {
  try {
    const filter = { status: 'approved', applicationStatus: 'approved', isPublished: true };
    if (req.query.city) filter['location.city'] = req.query.city;

    const places = await Place.find(filter)
      .populate('category', 'name slug icon')
      .sort({ views: -1, 'rating.average': -1 })
      .limit(Number(req.query.limit) || 8);

    res.status(200).json({ success: true, data: places });
  } catch (error) {
    next(error);
  }
};

/** POST /api/places — business owner submits a new listing (starts as 'pending'). */
const createPlace = async (req, res, next) => {
  try {
    const body = req.body;
    const { subcategory } = body;
    const pageType = 'premium';

    const businessGroup = getBusinessGroup(subcategory);
    if (subcategory && !businessGroup) {
      return next(new AppError('Unsupported business subcategory.', 400));
    }

    if (businessGroup) {
      const category = await Category.findById(body.category).select('name');
      if (!category || category.name !== subcategory) {
        return next(new AppError('The selected subcategory does not match the category.', 400));
      }
    }

    const parsedBody = {
      ...body,
      services: parseField(body.services, []),
      facilities: parseField(body.facilities, []),
      images: parseField(body.images, []),
      location: parseField(body.location, {}),
      socialLinks: parseField(body.socialLinks, {}),
      attributes: parseField(body.attributes, {}),
      categoryData: parseField(body.categoryData, {}),
    };
    const links = validateLinks(parsedBody);
    const files = req.files || {};
    const photoFiles = files.photos || [];
    const videoFiles = files.videos || [];
    const invalidPhoto = photoFiles.find((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype));
    const invalidVideo = videoFiles.find((file) => !['video/mp4', 'video/webm', 'video/quicktime'].includes(file.mimetype));
    if (invalidPhoto || invalidVideo) return next(new AppError('Unsupported media file type.', 400));
    const uploadedPhotos = photoFiles.map(storeUpload);
    const uploadedVideos = videoFiles.map(storeUpload);

    const place = await Place.create({
      ...parsedBody,
      ...links,
      images: [...(Array.isArray(parsedBody.images) ? parsedBody.images : []), ...uploadedPhotos.map((file) => file.url)],
      videos: uploadedVideos.map((file) => ({ ...file, title: '', description: '', featured: false })),
      owner: req.user._id,
      pageType,
      subcategory: subcategory || null,
      businessGroup,
      status: 'pending',
      applicationStatus: 'submitted',
      isPublished: false,
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      approvedAt: null,
      publishedAt: null,
    });

    await BusinessRequest.create({
      owner: req.user._id,
      place: place._id,
      placeSnapshot: place.toObject(),
      pageType,
      businessGroup,
      subcategory: subcategory || null,
      status: 'submitted',
      submittedAt: place.submittedAt,
      reviewHistory: [{ action: 'application_created', actor: req.user._id, timestamp: place.submittedAt }],
    });

    await Notification.create({
      user: req.user._id,
      title: 'Business request submitted',
      message: 'Your business request has been submitted for review.',
      type: 'business_request_submitted',
      link: '/business/dashboard',
    });

    res.status(201).json({
      success: true,
      message: 'Listing submitted successfully. It will go live after admin approval.',
      data: place,
    });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/places/:id — owner edits their own listing; edits re-enter pending review. */
const updatePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return next(new AppError('Listing not found.', 404));

    const isOwner = place.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return next(new AppError('You do not have permission to edit this listing.', 403));
    }

    const { status, applicationStatus, isPublished, reviewedBy, reviewedAt, approvedAt, publishedAt, owner, ...editableFields } = req.body;
    Object.assign(editableFields, validateLinks(editableFields));
    Object.assign(place, editableFields);
    if (isOwner && req.user.role !== 'admin') {
      place.status = 'pending'; // owner edits require re-approval
      place.applicationStatus = place.applicationStatus === 'rejected' ? 'resubmitted' : 'submitted';
      place.isPublished = false;
      place.rejectionReason = null;
      place.submittedAt = new Date();
      await BusinessRequest.findOneAndUpdate(
        { place: place._id, owner: req.user._id },
        {
          $set: { status: place.applicationStatus, placeSnapshot: { ...place.toObject(), ...editableFields }, submittedAt: place.submittedAt, rejectionReason: null },
          $push: { reviewHistory: { action: 'resubmitted', actor: req.user._id, timestamp: place.submittedAt } },
        }
      );
    }
    await place.save();

    res.status(200).json({ success: true, message: 'Listing updated.', data: place });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/places/:id */
const deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return next(new AppError('Listing not found.', 404));

    const isOwner = place.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return next(new AppError('You do not have permission to delete this listing.', 403));
    }

    await place.deleteOne();
    res.status(200).json({ success: true, message: 'Listing deleted.' });
  } catch (error) {
    next(error);
  }
};

/** POST /api/favorites/:placeId — toggle favorite for the current user. */
const toggleFavorite = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const existing = await Favorite.findOne({ user: req.user._id, place: placeId });

    if (existing) {
      await existing.deleteOne();
      await Place.findByIdAndUpdate(placeId, { $inc: { favoritesCount: -1 } });
      return res.status(200).json({ success: true, favorited: false });
    }

    await Favorite.create({ user: req.user._id, place: placeId });
    await Place.findByIdAndUpdate(placeId, { $inc: { favoritesCount: 1 } });
    res.status(200).json({ success: true, favorited: true });
  } catch (error) {
    next(error);
  }
};

/** GET /api/favorites — the places the current user has favorited. */
const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'place',
        populate: { path: 'category', select: 'name slug' },
      })
      .sort('-createdAt');

    // Filter out favorites whose place was since deleted or unapproved
    const places = favorites.map((f) => f.place).filter(Boolean);
    res.status(200).json({ success: true, data: places });
  } catch (error) {
    next(error);
  }
};

/** GET /api/places/mine — all listings owned by the current business user, any status. */
const getMyPlaces = async (req, res, next) => {
  try {
    const places = await Place.find({ owner: req.user._id })
      .populate('category', 'name slug')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: places });
  } catch (error) {
    next(error);
  }
};

const getMyBusinessRequests = async (req, res, next) => {
  try {
    const requests = await BusinessRequest.find({ owner: req.user._id })
      .populate({ path: 'place', populate: [{ path: 'category', select: 'name slug' }, { path: 'location.city', select: 'name slug' }] })
      .sort('-createdAt');
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

const getBusinessRequest = async (req, res, next) => {
  try {
    const request = await BusinessRequest.findOne({ _id: req.params.id, owner: req.user._id }).populate('place');
    if (!request) return next(new AppError('Business request not found.', 404));
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

const resubmitBusinessRequest = async (req, res, next) => {
  try {
    const request = await BusinessRequest.findOne({ _id: req.params.id, owner: req.user._id });
    if (!request) return next(new AppError('Business request not found.', 404));
    if (request.status !== 'rejected') return next(new AppError('Only rejected requests can be resubmitted.', 409));

    const place = await Place.findOne({ _id: request.place, owner: req.user._id });
    if (!place) return next(new AppError('Business listing not found.', 404));
    const submittedAt = new Date();
    place.status = 'pending';
    place.applicationStatus = 'resubmitted';
    place.isPublished = false;
    place.submittedAt = submittedAt;
    place.rejectionReason = null;
    await place.save();

    request.status = 'resubmitted';
    request.submittedAt = submittedAt;
    request.rejectionReason = null;
    request.placeSnapshot = place.toObject();
    request.reviewHistory.push({ action: 'resubmitted', actor: req.user._id, timestamp: submittedAt });
    await request.save();

    await Notification.create({
      user: req.user._id,
      title: 'Business request resubmitted',
      message: 'Your corrected business request has been resubmitted for review.',
      type: 'business_request_resubmitted',
      link: '/business/dashboard',
    });
    res.status(200).json({ success: true, message: 'Business request resubmitted.', data: request });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlaces,
  getPlaceById,
  getTrending,
  getMyPlaces,
  getMyBusinessRequests,
  getBusinessRequest,
  resubmitBusinessRequest,
  getMyFavorites,
  createPlace,
  updatePlace,
  deletePlace,
  toggleFavorite,
};

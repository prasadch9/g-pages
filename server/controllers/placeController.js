const Place = require('../models/Place');
const Category = require('../models/Category');
const Favorite = require('../models/Favorite');
const BusinessRequest = require('../models/BusinessRequest');
const Notification = require('../models/Notification');
const { getBusinessGroup } = require('../config/businessConfig');
const { storeUpload } = require('../services/mediaStorage');
const slugify = require('slugify');
const { AppError } = require('../middleware/errorHandler');
const { getCategoryGroup } = require('../config/categoryModules');

const PUBLIC_PLACE_FILTER = { status: 'approved', applicationStatus: 'approved', isPublished: true };

const parseMultipartValue = (value, fallback) => {
  if (value === undefined || value === '') return fallback;
  try { return JSON.parse(value); } catch { return value; }
};

const publicUploadUrl = (req, file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

async function createUniqueSlug(name, city, excludeId = null) {
  const base = slugify(name || 'place', { lower: true, strict: true, trim: true }) || 'place';
  let slug = base;
  let suffix = 2;
  while (await Place.exists({ slug, 'location.city': city, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

async function geocodeAddress(address) {
  if (!address || typeof fetch !== 'function') return null;
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`, {
      headers: { 'User-Agent': 'GooglePages/1.0 contact@googlepages.local' },
    });
    const results = await response.json();
    return results[0] ? { lat: Number(results[0].lat), lng: Number(results[0].lon) } : null;
  } catch { return null; }
}

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

    const filter = { ...PUBLIC_PLACE_FILTER };
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

    const isOwner = place && req.user && place.owner?._id?.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === 'admin';
    const isPubliclyAvailable = place
      && place.status === 'approved'
      && place.applicationStatus === 'approved'
      && place.isPublished;
    if (!place || (!isPubliclyAvailable && !isOwner && !isAdmin)) {
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
    const filter = { ...PUBLIC_PLACE_FILTER };
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
    const body = { ...req.body };
    const category = await Category.findById(body.category).select('name group');
    if (!category) return next(new AppError('Select a valid category.', 400));
    const subcategory = body.subcategory || category.name;
    const businessGroup = body.businessGroup || getBusinessGroup(subcategory) || null;
    const pageType = body.pageType || 'static';
    body.location = parseMultipartValue(body.location, body.location);
    body.socialLinks = parseMultipartValue(body.socialLinks, {});
    body.attributes = parseMultipartValue(body.attributes, {});
    body.categoryData = parseMultipartValue(body.categoryData, {});
    body.video = parseMultipartValue(body.video, body.video);
    ['services', 'facilities', 'images'].forEach((field) => { body[field] = parseMultipartValue(body[field], []); });
    const files = (Array.isArray(req.files) ? req.files : Object.entries(req.files || {}).flatMap(([fieldname, entries]) => entries.map((file) => ({ ...file, fieldname }))));
    const filesFor = (fieldname) => files.filter((file) => file.fieldname === fieldname);
    const logo = filesFor('logo')[0] ? publicUploadUrl(req, filesFor('logo')[0]) : body.logo;
    const footerLogo = filesFor('footerLogo')[0] ? publicUploadUrl(req, filesFor('footerLogo')[0]) : body.attributes?.footerLogo;
    const aboutImage = filesFor('aboutImage')[0] ? publicUploadUrl(req, filesFor('aboutImage')[0]) : body.aboutImage;
    const coverImage = filesFor('coverImage')[0] ? publicUploadUrl(req, filesFor('coverImage')[0]) : body.coverImage;
    const images = [...filesFor('images'), ...filesFor('photos')].map((file) => publicUploadUrl(req, file));
    const uploadedVideos = [...filesFor('video'), ...filesFor('videos'), ...filesFor('schoolVideoFiles')].map((file) => publicUploadUrl(req, file));
    const linkedVideos = (body.attributes?.schoolVideos || []).filter((item) => item?.type !== 'upload' && item?.url).map((item) => item.url);
    const video = [...uploadedVideos, ...linkedVideos, ...(Array.isArray(body.video) ? body.video : body.video ? [body.video] : [])];
    const facilityImages = filesFor('facilityImages').map((file) => publicUploadUrl(req, file));
    const galleryImages = filesFor('galleryImages').map((file) => publicUploadUrl(req, file));
    const academyGalleryImages = filesFor('academyGalleryImages').map((file) => publicUploadUrl(req, file));
    const academyGalleryVideos = filesFor('academyGalleryVideos').map((file) => publicUploadUrl(req, file));
    const academyCourseImages = filesFor('academyCourseImages').map((file) => publicUploadUrl(req, file));
    const academyAboutImage = filesFor('academyAboutImage')[0] ? publicUploadUrl(req, filesFor('academyAboutImage')[0]) : undefined;
    const academyIntroVideo = filesFor('academyIntroVideo')[0] ? publicUploadUrl(req, filesFor('academyIntroVideo')[0]) : undefined;
    const academyVideoThumbnail = filesFor('academyVideoThumbnail')[0] ? publicUploadUrl(req, filesFor('academyVideoThumbnail')[0]) : undefined;
    const principalImage = filesFor('principalImage')[0] ? publicUploadUrl(req, filesFor('principalImage')[0]) : body.principalImage;
    const schoolMedia = {
      principalGallery: filesFor('principalGallery').map((file) => publicUploadUrl(req, file)),
      facultyImages: filesFor('facultyImages').map((file) => publicUploadUrl(req, file)),
      infrastructureImages: filesFor('infrastructureImages').map((file) => publicUploadUrl(req, file)),
      galleryImages,
      facilityImages: facilityImages.length ? facilityImages : body.attributes?.facilityImages,
      eventImages: filesFor('eventImages').map((file) => publicUploadUrl(req, file)),
      videoFiles: filesFor('schoolVideoFiles').map((file) => publicUploadUrl(req, file)),
    };
    body.attributes = {
      ...(body.attributes || {}),
      ...(body.attributes?.academy ? { academy: {
        ...body.attributes.academy,
        aboutImage: academyAboutImage || body.attributes.academy.aboutImage,
        videoUrl: academyIntroVideo || body.attributes.academy.videoUrl,
        videoThumbnail: academyVideoThumbnail || body.attributes.academy.videoThumbnail,
        galleryPhotos: (body.attributes.academy.galleryPhotos || []).map(({ uploadIndex, ...item }) => ({ ...item, url: uploadIndex !== undefined ? academyGalleryImages[uploadIndex] || item.url : item.url })),
        galleryVideos: (body.attributes.academy.galleryVideos || []).map(({ uploadIndex, ...item }) => ({ ...item, url: uploadIndex !== undefined ? academyGalleryVideos[uploadIndex] || item.url : item.url })),
        courses: (body.attributes.academy.courses || []).map(({ uploadIndex, ...item }) => ({ ...item, image: uploadIndex !== undefined ? academyCourseImages[uploadIndex] || item.image : item.image })),
      } } : {}),
      ...schoolMedia,
      principalImage,
      aboutImage,
      footerLogo,
    };
    body.slug = await createUniqueSlug(body.name, body.location?.city);
    const coordinates = body.address ? await (async () => {
      try {
        const { geocodeAddress } = require('../services/geocoding');
        return await geocodeAddress(body.address);
      } catch { return undefined; }
    })() : undefined;
    const place = await Place.create({
      ...body,
      categoryGroup: category.group || getCategoryGroup(category.name),
      subcategory,
      businessGroup,
      pageType,
      images: [...(Array.isArray(body.images) ? body.images : []), ...images, ...galleryImages],
      logo,
      coverImage,
      video,
      categoryData: body.categoryData || {},
      coordinates: coordinates || body.coordinates || undefined,
      owner: req.user._id,
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
      pageType: place.pageType,
      businessGroup: place.businessGroup,
      subcategory: place.subcategory,
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

/** PUT /api/places/:id — approved listings stay live when their owner edits them. */
const updatePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return next(new AppError('Listing not found.', 404));

    const isOwner = place.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return next(new AppError('You do not have permission to edit this listing.', 403));
    }

    const {
      status: ignoredStatus,
      applicationStatus: ignoredApplicationStatus,
      isPublished: ignoredPublished,
      reviewedBy: ignoredReviewedBy,
      reviewedAt: ignoredReviewedAt,
      approvedAt: ignoredApprovedAt,
      publishedAt: ignoredPublishedAt,
      owner: ignoredOwner,
      name: requestedName,
      ...ownerUpdates
    } = req.body;
    ownerUpdates.location = parseMultipartValue(ownerUpdates.location, ownerUpdates.location);
    ownerUpdates.services = parseMultipartValue(ownerUpdates.services, ownerUpdates.services);
    ownerUpdates.facilities = parseMultipartValue(ownerUpdates.facilities, ownerUpdates.facilities);
    ownerUpdates.socialLinks = parseMultipartValue(ownerUpdates.socialLinks, ownerUpdates.socialLinks);
    ownerUpdates.attributes = parseMultipartValue(ownerUpdates.attributes, ownerUpdates.attributes);
    ownerUpdates.categoryData = parseMultipartValue(ownerUpdates.categoryData, ownerUpdates.categoryData);
    const uploadedFiles = Array.isArray(req.files) ? req.files : [];
    const uploadedUrls = (field) => uploadedFiles.filter((file) => file.fieldname === field).map((file) => publicUploadUrl(req, file));
    if (uploadedUrls('logo')[0]) ownerUpdates.logo = uploadedUrls('logo')[0];
    if (ownerUpdates.attributes?.academy) {
      const academy = ownerUpdates.attributes.academy;
      const photos = uploadedUrls('academyGalleryImages');
      const videos = uploadedUrls('academyGalleryVideos');
      const courseImages = uploadedUrls('academyCourseImages');
      const aboutImage = uploadedUrls('academyAboutImage')[0];
      const introVideo = uploadedUrls('academyIntroVideo')[0];
      const videoThumbnail = uploadedUrls('academyVideoThumbnail')[0];
      ownerUpdates.attributes.academy = {
        ...academy,
        aboutImage: aboutImage || academy.aboutImage,
        videoUrl: introVideo || academy.videoUrl,
        videoThumbnail: videoThumbnail || academy.videoThumbnail,
        galleryPhotos: (academy.galleryPhotos || []).map(({ uploadIndex, ...item }) => ({ ...item, url: uploadIndex !== undefined ? photos[uploadIndex] || item.url : item.url })),
        galleryVideos: (academy.galleryVideos || []).map(({ uploadIndex, ...item }) => ({ ...item, url: uploadIndex !== undefined ? videos[uploadIndex] || item.url : item.url })),
        courses: (academy.courses || []).map(({ uploadIndex, ...item }) => ({ ...item, image: uploadIndex !== undefined ? courseImages[uploadIndex] || item.image : item.image })),
      };
    }
    if (requestedName && requestedName !== place.name) {
      ownerUpdates.name = requestedName;
    }
    if (ownerUpdates.location) {
      ownerUpdates.location = {
        ...ownerUpdates.location,
        // Area is optional; an empty string cannot be cast to its ObjectId.
        area: ownerUpdates.location.area || null,
      };
    }
    const updateFields = { ...ownerUpdates };
    const newImages = uploadedUrls('images');
    const newVideos = uploadedUrls('videos');
    if (uploadedUrls('coverImage')[0]) updateFields.coverImage = uploadedUrls('coverImage')[0];
    if (newImages.length) updateFields.images = [...(place.images || []), ...newImages];
    if (newVideos.length) {
      const currentVideos = Array.isArray(place.video) ? place.video : place.video ? [place.video] : [];
      updateFields.video = [...currentVideos, ...newVideos];
    }
    // Keep the listing's current publication and approval state when its owner
    // edits it. The existing document is excluded from the slug lookup so an
    // unchanged business name can never conflict with its own slug.
    const targetCity = ownerUpdates.location?.city || place.location.city;
    const nameChanged = requestedName && requestedName !== place.name;
    const cityChanged = targetCity.toString() !== place.location.city.toString();
    if (nameChanged || cityChanged) {
      updateFields.slug = await createUniqueSlug(requestedName || place.name, targetCity, place._id);
    }
    const updatedPlace = await Place.findByIdAndUpdate(
      place._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Listing updated.', data: updatedPlace });
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
      .populate('location.state location.district location.city location.area', 'name slug')
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

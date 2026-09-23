const Place = require('../models/Place');
const Favorite = require('../models/Favorite');
const { AppError } = require('../middleware/errorHandler');

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

    const filter = { status: 'approved' };
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
    if (!place || (place.status !== 'approved' && !isOwner)) {
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
    const filter = { status: 'approved' };
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
    const place = await Place.create({ ...req.body, owner: req.user._id, status: 'pending' });

    const BusinessRequest = require('../models/BusinessRequest');
    await BusinessRequest.create({
      owner: req.user._id,
      place: place._id,
      placeSnapshot: place.toObject(),
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

    const updates = { ...req.body };
    delete updates.owner;
    delete updates.status;
    delete updates.reviewedBy;
    delete updates.reviewedAt;
    Object.assign(place, updates);
    if (isOwner && req.user.role !== 'admin') {
      const wasPreviouslyApproved = place.status === 'pending' && place.reviewedAt && !place.rejectionReason;
      if (place.status === 'approved' || wasPreviouslyApproved) {
        place.status = 'approved';
        place.rejectionReason = null;
      } else {
        place.status = 'pending';
        place.rejectionReason = null;
      }
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
      .populate('location.state location.district location.city location.area', 'name slug')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: places });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlaces,
  getPlaceById,
  getTrending,
  getMyPlaces,
  getMyFavorites,
  createPlace,
  updatePlace,
  deletePlace,
  toggleFavorite,
};

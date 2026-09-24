const Place = require('../models/Place');
const { AppError } = require('../middleware/errorHandler');
const { storeUpload, removeUpload } = require('../services/mediaStorage');

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

const findOwnedPlace = async (req, res, next) => {
  const place = await Place.findOne({ _id: req.params.id, owner: req.user._id });
  if (!place) return next(new AppError('Business listing not found.', 404));
  req.place = place;
  return null;
};

const canManage = (place, mediaType) => {
  if (place.applicationStatus === 'approved' && place.isPublished) return true;
  return mediaType === 'image' && ['pending', 'submitted', 'under_review', 'rejected', 'resubmitted'].includes(place.applicationStatus);
};

const uploadMedia = async (req, res, next) => {
  try {
    const error = await findOwnedPlace(req, res, next);
    if (error) return;
    const mediaType = req.body.mediaType === 'video' ? 'video' : 'image';
    if (!canManage(req.place, mediaType)) return next(new AppError('Media management is available after approval.', 403));
    const files = req.files || [];
    if (!files.length) return next(new AppError('Select at least one media file.', 400));

    const accepted = mediaType === 'video' ? VIDEO_TYPES : IMAGE_TYPES;
    const invalid = files.find((file) => !accepted.has(file.mimetype));
    if (invalid) return next(new AppError(`Unsupported ${mediaType} file type.`, 400));

    const stored = files.map(storeUpload);
    if (mediaType === 'video') {
      req.place.videos.push(...stored.map((item) => ({ ...item, title: '', description: '', featured: false })));
    } else {
      req.place.images.push(...stored.map((item) => item.url));
      if (!req.place.coverImage) req.place.coverImage = stored[0].url;
    }
    await req.place.save();
    res.status(201).json({ success: true, data: req.place, uploaded: stored });
  } catch (error) {
    next(error);
  }
};

const deleteMedia = async (req, res, next) => {
  try {
    const error = await findOwnedPlace(req, res, next);
    if (error) return;
    const mediaType = req.body.mediaType === 'video' ? 'video' : 'image';
    if (!canManage(req.place, mediaType)) return next(new AppError('Media management is available after approval.', 403));
    const index = Number(req.body.index);
    const collection = mediaType === 'video' ? req.place.videos : req.place.images;
    if (!Number.isInteger(index) || !collection[index]) return next(new AppError('Media item not found.', 404));
    const item = collection[index];
    removeUpload(mediaType === 'video' ? item.url : item);
    collection.splice(index, 1);
    if (mediaType === 'image' && req.place.coverImage === item) req.place.coverImage = collection[0] || null;
    await req.place.save();
    res.status(200).json({ success: true, data: req.place });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadMedia, deleteMedia };

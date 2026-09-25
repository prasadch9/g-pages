const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const Place = require('../models/Place');
const { AppError } = require('../middleware/errorHandler');
const { storeUpload, removeUpload } = require('../services/mediaStorage');

// ---- Common Upload Config ----
const uploadDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const allowedVideoMimeTypes = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']);
const allowedVideoExtensions = new Set(['.mp4', '.webm', '.mov', '.avi', '.mkv']);
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, crypto.randomUUID() + extension);
  },
});

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
    return callback(new AppError('Only JPG, JPEG, PNG, and WebP images are allowed.', 400));
  }
  callback(null, true);
};

const imageUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

const ensureMediaOwner = async (req, res, next) => {
  try {
    const placeId = req.query.placeId;
    if (!placeId) return next();

    const place = await Place.findById(placeId).select('owner');
    if (!place) return next(new AppError('Listing not found.', 404));
    if (req.user.role !== 'admin' && String(place.owner) !== String(req.user._id)) {
      return next(new AppError('You do not have permission to upload media for this listing.', 403));
    }
    next();
  } catch (error) {
    next(error);
  }
};

const uploadImage = (req, res, next) => {
  if (!req.file) return next(new AppError('An image file is required.', 400));
  const baseUrl = process.env.PUBLIC_API_URL?.replace(/\/+$/, '') || (req.protocol + '://' + req.get('host'));
  res.status(201).json({
    success: true,
    data: {
      url: baseUrl + '/uploads/' + req.file.filename,
      filename: req.file.originalname,
      size: req.file.size,
    },
  });
};

const videoFileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (!allowedVideoMimeTypes.has(file.mimetype) || !allowedVideoExtensions.has(extension)) {
    return callback(new AppError('Only MP4, WebM, MOV, AVI, and MKV videos are allowed.', 400));
  }
  callback(null, true);
};

const videoUpload = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: { fileSize: MAX_VIDEO_SIZE, files: 1 },
});

const uploadVideo = (req, res, next) => {
  if (!req.file) return next(new AppError('A video file is required.', 400));
  const baseUrl = process.env.PUBLIC_API_URL?.replace(/\/+$/, '') || (req.protocol + '://' + req.get('host'));
  res.status(201).json({
    success: true,
    data: {
      url: baseUrl + '/uploads/' + req.file.filename,
      filename: req.file.originalname,
      size: req.file.size,
    },
  });
};

// ---- Place Direct Media Management (HEAD) ----

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

module.exports = {
  uploadMedia,
  deleteMedia,
  imageUpload,
  ensureMediaOwner,
  uploadImage,
  videoUpload,
  uploadVideo,
  uploadDirectory,
};

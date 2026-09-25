const express = require('express');
const {
  getPlaces,
  getPlaceById,
  getTrending,
  getMyPlaces,
  getMyBusinessRequests,
  getBusinessRequest,
  resubmitBusinessRequest,
  createPlace,
  updatePlace,
  deletePlace,
} = require('../controllers/placeController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const { uploadMedia, deleteMedia } = require('../controllers/mediaController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const uploadDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => callback(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { files: 300, fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeType = String(file.mimetype || '').toLowerCase();
    const imageExtensions = new Set(['.jpg', '.jpeg', '.jpe', '.jfif', '.png', '.gif', '.webp', '.avif', '.heic', '.heif', '.svg', '.bmp', '.tif', '.tiff']);
    const videoExtensions = new Set(['.mp4', '.webm', '.ogg', '.ogv', '.mov', '.m4v', '.avi', '.mkv', '.3gp', '.flv']);
    const imageFields = new Set(['logo', 'footerLogo', 'coverImage', 'aboutImage', 'images', 'facilityImages', 'principalImage', 'principalGallery', 'facultyImages', 'infrastructureImages', 'galleryImages', 'eventImages', 'academyGalleryImages', 'academyAboutImage', 'academyVideoThumbnail', 'academyCourseImages', 'photos', 'files']);
    const videoFields = new Set(['video', 'videos', 'schoolVideoFiles', 'academyGalleryVideos', 'academyIntroVideo', 'files']);
    const isImage = mimeType.startsWith('image/') || imageExtensions.has(extension);
    const isVideo = mimeType.startsWith('video/') || videoExtensions.has(extension);

    if (imageFields.has(file.fieldname) && isImage) return callback(null, true);
    if (videoFields.has(file.fieldname) && isVideo) return callback(null, true);
    if (!imageFields.has(file.fieldname) && !videoFields.has(file.fieldname) && (isImage || isVideo)) return callback(null, true);
    const expected = imageFields.has(file.fieldname) ? 'an image' : videoFields.has(file.fieldname) ? 'a video' : 'a supported media file';
    return callback(new Error(`Unsupported file for ${file.fieldname}. Choose ${expected}; received ${file.mimetype || 'unknown file type'} (${extension || 'no extension'}).`));
  },
});

router.get('/trending', getTrending);
router.get('/mine', protect, authorize('business', 'admin'), getMyPlaces);
router.get('/business-requests/my', protect, authorize('business'), getMyBusinessRequests);
router.get('/business-requests/:id', protect, authorize('business'), getBusinessRequest);
router.post('/business-requests/:id/resubmit', protect, authorize('business'), resubmitBusinessRequest);
router.get('/', getPlaces);
router.get('/:id', optionalAuth, getPlaceById);

router.post('/', protect, authorize('business', 'admin'), upload.any(), createPlace);
router.put('/:id', protect, upload.any(), updatePlace);
router.post('/:id/media', protect, authorize('business'), upload.array('files', 12), uploadMedia);
router.delete('/:id/media', protect, authorize('business'), deleteMedia);
router.delete('/:id', protect, deletePlace);

module.exports = router;

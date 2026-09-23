const express = require('express');
const {
  getPlaces,
  getPlaceById,
  getTrending,
  getMyPlaces,
  createPlace,
  updatePlace,
  deletePlace,
} = require('../controllers/placeController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
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
    const imageExtensions = new Set(['.jpg', '.jpeg', '.jpe', '.jfif', '.png', '.gif', '.webp', '.avif', '.heic', '.heif', '.svg', '.bmp', '.tif', '.tiff']);
    const videoExtensions = new Set(['.mp4', '.webm', '.ogg', '.ogv', '.mov', '.m4v', '.avi', '.mkv', '.3gp', '.flv']);
    const imageFields = new Set(['logo', 'footerLogo', 'coverImage', 'aboutImage', 'images', 'facilityImages', 'principalImage', 'principalGallery', 'facultyImages', 'infrastructureImages', 'galleryImages', 'eventImages']);
    const videoFields = new Set(['video', 'videos', 'schoolVideoFiles']);
    const isImage = file.mimetype.startsWith('image/') || imageExtensions.has(extension);
    const isVideo = file.mimetype.startsWith('video/') || videoExtensions.has(extension);

    if (imageFields.has(file.fieldname) && isImage) return callback(null, true);
    if (videoFields.has(file.fieldname) && isVideo) return callback(null, true);
    return callback(new Error(`Unsupported file for ${file.fieldname}. Upload an image for image fields or a video for video fields.`));
  },
});

router.get('/trending', getTrending);
router.get('/mine', protect, authorize('business', 'admin'), getMyPlaces);
router.get('/', getPlaces);
router.get('/:id', optionalAuth, getPlaceById);

router.post('/', protect, authorize('business', 'admin'), upload.any(), createPlace);
router.put('/:id', protect, updatePlace);
router.delete('/:id', protect, deletePlace);

module.exports = router;

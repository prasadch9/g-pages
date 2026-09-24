const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { imageUpload, ensureMediaOwner, uploadImage, videoUpload, uploadVideo } = require('../controllers/mediaController');

const router = express.Router();

router.post('/upload', protect, authorize('business', 'admin'), ensureMediaOwner, imageUpload.single('image'), uploadImage);
router.post('/upload-video', protect, authorize('business', 'admin'), ensureMediaOwner, videoUpload.single('video'), uploadVideo);

module.exports = router;

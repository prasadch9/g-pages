const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth');

const uploadDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeName = path.basename(file.originalname, extension).replace(/[^a-z0-9_-]/gi, '-').slice(0, 50) || 'image';
    callback(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeName}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith('image/')) return callback(null, true);
    return callback(new Error('Only image files are allowed.'));
  },
});

const videoUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, callback) => {
    if (['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'].includes(file.mimetype)) return callback(null, true);
    return callback(new Error('Video files must be MP4, WebM, OGG, or MOV.'));
  },
});

const router = express.Router();

router.post('/images', protect, authorize('business', 'admin'), upload.array('images', 20), (req, res) => {
  const files = req.files || [];
  const publicApiOrigin = (process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  const images = files.map((file) => ({
    url: `${publicApiOrigin}/uploads/${file.filename}`,
    name: file.originalname,
  }));
  res.status(201).json({ success: true, data: images });
});

router.post('/videos', protect, authorize('business', 'admin'), videoUpload.array('videos', 10), (req, res) => {
  const files = req.files || [];
  const publicApiOrigin = (process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  const videos = files.map((file) => ({
    url: `${publicApiOrigin}/uploads/${file.filename}`,
    name: file.originalname,
  }));
  res.status(201).json({ success: true, data: videos });
});

module.exports = router;

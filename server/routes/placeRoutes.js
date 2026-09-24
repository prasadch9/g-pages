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

const router = express.Router();
const mediaUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024, files: 12 } });

router.get('/trending', getTrending);
router.get('/mine', protect, authorize('business', 'admin'), getMyPlaces);
router.get('/business-requests/my', protect, authorize('business'), getMyBusinessRequests);
router.get('/business-requests/:id', protect, authorize('business'), getBusinessRequest);
router.post('/business-requests/:id/resubmit', protect, authorize('business'), resubmitBusinessRequest);
router.get('/', getPlaces);
router.get('/:id', optionalAuth, getPlaceById);

router.post('/', protect, authorize('business', 'admin'), mediaUpload.fields([{ name: 'photos', maxCount: 12 }, { name: 'videos', maxCount: 4 }]), createPlace);
router.post('/:id/media', protect, authorize('business'), mediaUpload.array('files', 12), uploadMedia);
router.delete('/:id/media', protect, authorize('business'), deleteMedia);
router.put('/:id', protect, updatePlace);
router.delete('/:id', protect, deletePlace);

module.exports = router;

const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getChat, sendUserMessage, getBusinessChats, sendBusinessMessage } = require('../controllers/chatController');

const router = express.Router();

router.get('/business', protect, authorize('business', 'admin'), getBusinessChats);
router.post('/business/:placeId', protect, authorize('business', 'admin'), sendBusinessMessage);
router.get('/:placeId', protect, getChat);
router.post('/:placeId', protect, sendUserMessage);

module.exports = router;
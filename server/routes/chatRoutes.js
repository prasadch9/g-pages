const express = require('express');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const {
  startConversation,
  getPublicConversation,
  sendVisitorMessage,
  ownerConversations,
  ownerReply,
  updateConversation,
} = require('../controllers/chatController');

const router = express.Router();
router.post('/:placeId/conversations', optionalAuth, startConversation);
router.get('/:placeId/conversations/:conversationId', getPublicConversation);
router.post('/:placeId/conversations/:conversationId/messages', optionalAuth, sendVisitorMessage);
router.get('/owner/conversations', protect, authorize('business'), ownerConversations);
router.post('/owner/:placeId/conversations/:conversationId/messages', protect, authorize('business'), ownerReply);
router.patch('/owner/:placeId/conversations/:conversationId', protect, authorize('business'), updateConversation);

module.exports = router;
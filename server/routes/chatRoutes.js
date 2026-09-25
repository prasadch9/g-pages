const express = require('express');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const {
  startConversation,
  getPublicConversation,
  sendVisitorMessage,
  ownerConversations,
  ownerReply,
  updateConversation,
  getChat,
  sendUserMessage,
  getBusinessChats,
  sendBusinessMessage,
} = require('../controllers/chatController');

const router = express.Router();

// Direct business chat routes (automotive)
router.get('/business', protect, authorize('business', 'admin'), getBusinessChats);
router.post('/business/:placeId', protect, authorize('business', 'admin'), sendBusinessMessage);

// Visitor / owner conversation routes (HEAD)
router.get('/owner/conversations', protect, authorize('business'), ownerConversations);
router.post('/owner/:placeId/conversations/:conversationId/messages', protect, authorize('business'), ownerReply);
router.patch('/owner/:placeId/conversations/:conversationId', protect, authorize('business'), updateConversation);
router.post('/:placeId/conversations', optionalAuth, startConversation);
router.get('/:placeId/conversations/:conversationId', getPublicConversation);
router.post('/:placeId/conversations/:conversationId/messages', optionalAuth, sendVisitorMessage);

// Direct single place chat (automotive)
router.get('/:placeId', protect, getChat);
router.post('/:placeId', protect, sendUserMessage);

module.exports = router;
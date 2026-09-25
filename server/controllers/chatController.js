const mongoose = require('mongoose');
const Place = require('../models/Place');
const Conversation = require('../models/Conversation');
const ChatMessage = require('../models/ChatMessage');
const { AppError } = require('../middleware/errorHandler');

// --- Visitor & Business Conversation System (HEAD) ---

const publicPlace = (placeId) => Place.findOne({
  _id: placeId,
  status: 'approved',
  applicationStatus: 'approved',
  isPublished: true,
}).select('_id owner name');

const getConversation = async (conversationId, placeId) => {
  if (!mongoose.isValidObjectId(conversationId) || !mongoose.isValidObjectId(placeId)) return null;
  return Conversation.findOne({ _id: conversationId, businessId: placeId });
};

const startConversation = async (req, res, next) => {
  try {
    const place = await publicPlace(req.params.placeId);
    if (!place) return next(new AppError('Business page not found.', 404));
    const { visitorKey, visitorName = '', visitorEmail = '', message = '' } = req.body;
    if (!visitorKey || typeof visitorKey !== 'string' || visitorKey.length > 160) return next(new AppError('A visitor session is required.', 400));

    let conversation = await Conversation.findOne({ businessId: place._id, visitorKey, status: 'active' });
    if (!conversation) {
      conversation = new Conversation({ businessId: place._id, visitorKey, visitorId: req.user?._id || null, visitorName, visitorEmail });
    }
    if (visitorName) conversation.visitorName = visitorName;
    if (visitorEmail) conversation.visitorEmail = visitorEmail;
    if (message.trim()) conversation.messages.push({ senderType: 'visitor', senderId: req.user?._id || null, text: message.trim() });
    await conversation.save();
    res.status(201).json({ success: true, data: conversation });
  } catch (error) { next(error); }
};

const getPublicConversation = async (req, res, next) => {
  try {
    const conversation = await getConversation(req.params.conversationId, req.params.placeId);
    if (!conversation || conversation.visitorKey !== req.query.visitorKey) return next(new AppError('Conversation not found.', 404));
    res.json({ success: true, data: conversation });
  } catch (error) { next(error); }
};

const sendVisitorMessage = async (req, res, next) => {
  try {
    const place = await publicPlace(req.params.placeId);
    const conversation = await getConversation(req.params.conversationId, req.params.placeId);
    if (!place || !conversation || conversation.visitorKey !== req.body.visitorKey) return next(new AppError('Conversation not found.', 404));
    if (conversation.status === 'closed') return next(new AppError('This conversation is closed.', 409));
    const text = String(req.body.text || '').trim();
    if (!text) return next(new AppError('Message cannot be empty.', 400));
    conversation.messages.push({ senderType: 'visitor', senderId: req.user?._id || null, text });
    conversation.unreadCount += 1;
    await conversation.save();
    res.status(201).json({ success: true, data: conversation });
  } catch (error) { next(error); }
};

const ownerConversations = async (req, res, next) => {
  try {
    const places = await Place.find({ owner: req.user._id }).select('_id');
    const conversations = await Conversation.find({ businessId: { $in: places.map((place) => place._id) } }).populate('businessId', 'name').sort('-updatedAt');
    res.json({ success: true, data: conversations });
  } catch (error) { next(error); }
};

const ownerReply = async (req, res, next) => {
  try {
    const place = await Place.findOne({ _id: req.params.placeId, owner: req.user._id }).select('_id');
    const conversation = await getConversation(req.params.conversationId, req.params.placeId);
    if (!place || !conversation) return next(new AppError('Conversation not found.', 404));
    const text = String(req.body.text || '').trim();
    if (!text) return next(new AppError('Message cannot be empty.', 400));
    conversation.messages.push({ senderType: 'business', senderId: req.user._id, text });
    conversation.unreadCount = 0;
    await conversation.save();
    res.status(201).json({ success: true, data: conversation });
  } catch (error) { next(error); }
};

const updateConversation = async (req, res, next) => {
  try {
    const place = await Place.findOne({ _id: req.params.placeId, owner: req.user._id }).select('_id');
    const conversation = await getConversation(req.params.conversationId, req.params.placeId);
    if (!place || !conversation) return next(new AppError('Conversation not found.', 404));
    if (req.body.status && ['active', 'closed'].includes(req.body.status)) conversation.status = req.body.status;
    if (req.body.read === true) conversation.unreadCount = 0;
    await conversation.save();
    res.json({ success: true, data: conversation });
  } catch (error) { next(error); }
};

// --- Direct Chat System (Automotive) ---

const getPlace = async (placeId) => {
  const place = await Place.findById(placeId).select('name owner status');
  if (!place || place.status !== 'approved') throw new AppError('This listing is not available for chat.', 404);
  return place;
};

const getChat = async (req, res, next) => {
  try {
    await getPlace(req.params.placeId);
    const messages = await ChatMessage.find({ place: req.params.placeId, user: req.user._id })
      .populate('sender', 'name role')
      .sort('createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

const sendUserMessage = async (req, res, next) => {
  try {
    const place = await getPlace(req.params.placeId);
    const body = String(req.body.body || '').trim();
    if (!body) return next(new AppError('Message cannot be empty.', 400));
    const message = await ChatMessage.create({ place: place._id, user: req.user._id, sender: req.user._id, body });
    res.status(201).json({ success: true, data: await message.populate('sender', 'name role') });
  } catch (error) {
    next(error);
  }
};

const getBusinessChats = async (req, res, next) => {
  try {
    const places = await Place.find({ owner: req.user._id }).select('_id name');
    const messages = await ChatMessage.find({ place: { $in: places.map((place) => place._id) } })
      .populate('place', 'name')
      .populate('user', 'name email')
      .populate('sender', 'name role')
      .sort('-createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

const sendBusinessMessage = async (req, res, next) => {
  try {
    const place = await Place.findOne({ _id: req.params.placeId, owner: req.user._id, status: 'approved' });
    if (!place) return next(new AppError('You do not own this approved listing.', 403));
    const body = String(req.body.body || '').trim();
    const user = String(req.body.user || '').trim();
    if (!body || !user) return next(new AppError('User and message are required.', 400));
    const message = await ChatMessage.create({ place: place._id, user, sender: req.user._id, body });
    res.status(201).json({ success: true, data: await message.populate('sender', 'name role') });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

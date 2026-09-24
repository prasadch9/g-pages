const ChatMessage = require('../models/ChatMessage');
const Place = require('../models/Place');
const { AppError } = require('../middleware/errorHandler');

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

module.exports = { getChat, sendUserMessage, getBusinessChats, sendBusinessMessage };
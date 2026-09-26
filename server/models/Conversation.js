const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderType: { type: String, enum: ['visitor', 'business'], required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  text: { type: String, required: true, trim: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date, default: null },
}, { _id: true });

const conversationSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  visitorKey: { type: String, required: true, trim: true },
  visitorName: { type: String, trim: true, maxlength: 120, default: '' },
  visitorEmail: { type: String, trim: true, lowercase: true, maxlength: 200, default: '' },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  unreadCount: { type: Number, default: 0, min: 0 },
  messages: { type: [messageSchema], default: [] },
}, { timestamps: true });

conversationSchema.index({ businessId: 1, updatedAt: -1 });
conversationSchema.index({ businessId: 1, visitorKey: 1, status: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
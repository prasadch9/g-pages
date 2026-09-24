const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

chatMessageSchema.index({ place: 1, user: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
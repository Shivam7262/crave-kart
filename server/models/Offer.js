
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['percentage', 'bogo', 'freeDelivery'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  minimumOrder: {
    type: Number,
    default: 0
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Offer', offerSchema);

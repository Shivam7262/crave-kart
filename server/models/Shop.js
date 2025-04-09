
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  categories: [{
    type: String
  }],
  certificate: {
    data: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure we have appropriate indexes
shopSchema.index({ name: 1 });
shopSchema.index({ categories: 1 });
shopSchema.index({ ownerId: 1 });

// Make sure we're using the right collection name
const Shop = mongoose.model('Shop', shopSchema);

// Log when the model is created to verify it's working
console.log('Shop model initialized with collection:', Shop.collection.name);

module.exports = Shop;

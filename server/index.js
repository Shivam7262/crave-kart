
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Routes
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const foodItemRoutes = require('./routes/foodItemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const offerRoutes = require('./routes/offerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Increase the payload limit to 10MB (adjust as needed)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Special raw body parsing for Stripe webhook
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Connect to MongoDB with improved error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery-app')
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery-app');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Please check your MongoDB connection and make sure MongoDB is running.');
  });

// Log database connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/food-items', foodItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/payments', paymentRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('CraveKart API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

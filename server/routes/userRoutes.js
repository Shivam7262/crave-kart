
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create user (signup) - restrict to customer and shopOwner only
router.post('/', async (req, res) => {
  const { email, password, name, userType } = req.body;
  
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Validate user type - restrict to customer and shopOwner only
    if (!['customer', 'shopOwner'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }
    
    const user = new User({
      email,
      password,
      name,
      userType
    });
    
    const newUser = await user.save();
    const userResponse = { ...newUser._doc };
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Use the comparePassword method we added to the User model
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const userResponse = { ...user._doc };
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update user
router.patch('/:id', async (req, res) => {
  // Don't allow changing userType to admin through the API
  if (req.body.userType === 'admin') {
    delete req.body.userType;
  }
  
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a secured endpoint for admin creation (would need proper authentication in production)
// For demonstration only - in a real app, you'd use middleware to check if the request comes from a trusted source
router.post('/create-admin', async (req, res) => {
  const { email, password, name, secretKey } = req.body;
  
  // Check for a secret key that only the application owner would know
  // In production, use a proper auth mechanism or only allow creation through database operations
  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({
      email,
      password,
      name,
      userType: 'admin'
    });
    
    const newUser = await user.save();
    const userResponse = { ...newUser._doc };
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

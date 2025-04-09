
/**
 * This script is for creating an admin user directly.
 * It should be run by the site owner or administrator through the server terminal.
 * DO NOT expose this script to the public web interface.
 * 
 * To use: 
 * 1. Navigate to server directory
 * 2. Run: node scripts/createAdmin.js admin@example.com securePassword "Admin Name"
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error('Usage: node createAdmin.js <email> <password> <name>');
  process.exit(1);
}

const [email, password, name] = args;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const createAdmin = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
      
      // If the user exists but is not an admin, update to admin
      if (existingUser.userType !== 'admin') {
        existingUser.userType = 'admin';
        await existingUser.save();
        console.log(`User ${email} role updated to admin.`);
      } else {
        console.log(`User ${email} is already an admin.`);
      }
    } else {
      // Create new admin user - password will be hashed by pre-save hook
      const admin = new User({
        email,
        password,
        name,
        userType: 'admin'
      });
      
      await admin.save();
      console.log(`Admin user ${email} created successfully.`);
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();

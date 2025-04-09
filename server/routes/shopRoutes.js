
const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const Offer = require('../models/Offer');

// Get all shops
router.get('/', async (req, res) => {
  try {
    console.log('GET /shops - Fetching shops with query params:', req.query);
    
    // Check if status filter is provided
    const { status, isAdmin } = req.query;
    
    // Build the filter object based on query parameters
    let filter = {};
    
    // If status is provided and user is admin, filter by status
    if (status && isAdmin === 'true') {
      filter.status = status;
    } 
    // If no status or user is not admin, only return approved shops
    else if (!isAdmin || isAdmin !== 'true') {
      filter.status = 'approved';
    }
    
    console.log('Using filter:', filter);
    const shops = await Shop.find(filter);
    console.log(`Found ${shops.length} shops`);
    res.json(shops);
  } catch (err) {
    console.error('Error fetching shops:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get pending shops (for admin only)
router.get('/pending', async (req, res) => {
  try {
    // In a real app, check if the user is admin using JWT
    // For this example, we're checking a query parameter
    if (req.query.isAdmin !== 'true') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const pendingShops = await Shop.find({ status: 'pending' });
    res.json(pendingShops);
  } catch (err) {
    console.error('Error fetching pending shops:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get single shop
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    
    // If shop is not approved and user is not admin or the shop owner, don't return it
    if (
      shop.status !== 'approved' && 
      req.query.isAdmin !== 'true' && 
      req.query.userId !== shop.ownerId.toString()
    ) {
      return res.status(403).json({ message: 'Shop is not available' });
    }
    
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a shop
router.post('/', async (req, res) => {
  try {
    const { name, description, logo, categories, ownerId, certificate, status } = req.body;
    
    console.log('POST /shops - Creating new shop');
    
    // Check if ownerId is provided
    if (!ownerId) {
      console.log('Owner ID is missing in the request');
      return res.status(400).json({ message: 'Owner ID is required' });
    }
    
    // Check if user exists and is a shop owner
    const owner = await User.findById(ownerId);
    if (!owner) {
      console.log('User not found with ID:', ownerId);
      return res.status(400).json({ message: 'User not found' });
    }
    
    console.log('Found owner:', owner.email, 'userType:', owner.userType);
    
    if (owner.userType !== 'shopOwner') {
      console.log('User is not a shop owner. userType:', owner.userType);
      return res.status(400).json({ message: 'Only shop owners can register shops' });
    }
    
    // Validate certificate structure
    if (!certificate || !certificate.data || !certificate.type || !certificate.name) {
      return res.status(400).json({ message: 'Certificate information is incomplete' });
    }
    
    // Create the shop with validated data
    const shop = new Shop({
      name,
      description,
      logo,
      categories,
      ownerId,
      certificate: {
        data: certificate.data,
        type: certificate.type,
        name: certificate.name
      },
      status: status || 'pending' // Default to pending if not provided
    });
    
    const newShop = await shop.save();
    console.log('Shop created successfully:', newShop._id);
    
    // Update user with shop ownership
    await User.findByIdAndUpdate(ownerId, { ownedShopId: newShop._id });
    console.log('User updated with shop ownership');
    
    res.status(201).json(newShop);
  } catch (err) {
    console.error('Error creating shop:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a shop
router.patch('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    
    // Check if user is admin when trying to update status
    // We use userType from request body which is sent from client
    const { userType, status } = req.body;
    
    console.log('PATCH /shops/:id - Update request from userType:', userType);
    
    // Status can only be updated by admin
    if (status && userType !== 'admin') {
      console.log('Non-admin attempted to update shop status:', userType);
      return res.status(403).json({ message: "Only admins can update shop status" });
    }
    
    // Allow owners or admins to update shop
    if (req.body.ownerId && 
        shop.ownerId.toString() !== req.body.ownerId && 
        userType !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to update this shop" });
    }
    
    // Handle status change notification (in a real app, you'd send emails here)
    if (req.body.status && req.body.status !== shop.status) {
      const owner = await User.findById(shop.ownerId);
      
      if (owner) {
        console.log(`Shop status changed for ${shop.name} from ${shop.status} to ${req.body.status}`);
        console.log(`Notification would be sent to shop owner: ${owner.email}`);
        
        // In a real app, you'd send an email here
        // For now, just log it
        if (req.body.status === 'approved') {
          console.log(`Notification: Your shop "${shop.name}" has been approved!`);
        } else if (req.body.status === 'rejected') {
          console.log(`Notification: Your shop "${shop.name}" has been rejected.`);
        }
      }
    }
    
    // Remove userType from the data we're using to update the shop
    // (we don't want to save userType as part of the shop document)
    const updateData = { ...req.body };
    delete updateData.userType;
    
    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    res.json(updatedShop);
  } catch (err) {
    console.error('Error updating shop:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a shop
router.delete('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    
    // Verify ownership - ideally you'd use auth middleware
    if (req.body.ownerId && 
        shop.ownerId.toString() !== req.body.ownerId && 
        req.body.userType !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to delete this shop" });
    }
    
    await shop.deleteOne();
    
    // Update user to remove shop ownership
    await User.findByIdAndUpdate(shop.ownerId, { $unset: { ownedShopId: 1 } });
    
    // Delete all related food items
    await FoodItem.deleteMany({ shopId: req.params.id });
    
    // Delete all related offers
    await Offer.deleteMany({ shopId: req.params.id });
    
    res.json({ message: 'Shop deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get shop food items
router.get('/:id/food-items', async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ shopId: req.params.id });
    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get shop offers
router.get('/:id/offers', async (req, res) => {
  try {
    const offers = await Offer.find({ shopId: req.params.id });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

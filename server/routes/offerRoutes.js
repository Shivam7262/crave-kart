
const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const Shop = require('../models/Shop');

// Get all offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find().populate('shopId', 'name logo');
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single offer
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('shopId', 'name logo');
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create offer
router.post('/', async (req, res) => {
  const { title, description, type, value, minimumOrder, code, expiryDate, shopId } = req.body;
  
  try {
    // Check if shop exists
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(400).json({ message: 'Shop not found' });
    }
    
    // Check if code is unique
    const existingOffer = await Offer.findOne({ code });
    if (existingOffer) {
      return res.status(400).json({ message: 'Offer code already exists' });
    }
    
    const offer = new Offer({
      title,
      description,
      type,
      value,
      minimumOrder: minimumOrder || 0,
      code,
      expiryDate,
      shopId
    });
    
    const newOffer = await offer.save();
    res.status(201).json(newOffer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update offer
router.patch('/:id', async (req, res) => {
  try {
    // If updating code, check if new code is unique
    if (req.body.code) {
      const existingOffer = await Offer.findOne({ 
        code: req.body.code,
        _id: { $ne: req.params.id }
      });
      
      if (existingOffer) {
        return res.status(400).json({ message: 'Offer code already exists' });
      }
    }
    
    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!updatedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    res.json(updatedOffer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete offer
router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    await offer.deleteOne();
    res.json({ message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

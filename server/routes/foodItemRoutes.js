
const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const Shop = require('../models/Shop');

// Get all food items
router.get('/', async (req, res) => {
  try {
    // If shopId is provided, filter by shop
    if (req.query.shopId) {
      const foodItems = await FoodItem.find({ shopId: req.query.shopId });
      return res.json(foodItems);
    }
    
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single food item
router.get('/:id', async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) return res.status(404).json({ message: 'Food item not found' });
    res.json(foodItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create food item
router.post('/', async (req, res) => {
  const { name, description, price, image, category, shopId } = req.body;
  
  try {
    // Check if shop exists
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(400).json({ message: 'Shop not found' });
    }
    
    const foodItem = new FoodItem({
      name,
      description,
      price,
      image,
      category,
      shopId
    });
    
    const newFoodItem = await foodItem.save();
    res.status(201).json(newFoodItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update food item
router.patch('/:id', async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    // If shopId is being changed, verify the new shop exists
    if (req.body.shopId && req.body.shopId !== foodItem.shopId.toString()) {
      const shop = await Shop.findById(req.body.shopId);
      if (!shop) {
        return res.status(400).json({ message: 'Shop not found' });
      }
    }
    
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedFoodItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete food item
router.delete('/:id', async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    
    await foodItem.deleteOne();
    res.json({ message: 'Food item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

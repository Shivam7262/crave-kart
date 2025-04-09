
import api from './api';
import axios from 'axios';

export const createFoodItem = async (foodItemData: {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  shopId: string;
}) => {
  try {
    const response = await api.post('/food-items', foodItemData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create food item');
    }
    throw new Error('Failed to create food item');
  }
};

export const updateFoodItem = async (foodItemId: string, foodItemData: any) => {
  try {
    const response = await api.patch(`/food-items/${foodItemId}`, foodItemData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update food item');
    }
    throw new Error('Failed to update food item');
  }
};

export const deleteFoodItem = async (foodItemId: string) => {
  try {
    const response = await api.delete(`/food-items/${foodItemId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete food item');
    }
    throw new Error('Failed to delete food item');
  }
};

export const getShopFoodItems = async (shopId: string) => {
  try {
    console.log('Fetching food items for shop:', shopId);
    const response = await api.get(`/shops/${shopId}/food-items`);
    console.log('Food items response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching food items:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch food items');
    }
    throw new Error('Failed to fetch food items');
  }
};

export const getFoodItemById = async (itemId: string) => {
  try {
    const response = await api.get(`/food-items/${itemId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch food item');
    }
    throw new Error('Failed to fetch food item');
  }
};

export const getFoodItemsByCategory = async (shopId: string, category: string) => {
  try {
    console.log(`Fetching items for shop: ${shopId} in category: ${category}`);
    const response = await api.get(`/shops/${shopId}/food-items?category=${encodeURIComponent(category)}`);
    console.log('Category filtered items:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch food items by category');
    }
    throw new Error('Failed to fetch food items by category');
  }
};

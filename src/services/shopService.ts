
import api from './api';
import axios from 'axios';

export interface ShopCertificate {
  data: string;
  type: string;
  name: string;
}

export interface ShopData {
  name: string;
  description: string;
  logo: string;
  categories: string[];
  certificate?: ShopCertificate;
  ownerId?: string;
  status?: string;
  createdAt?: Date;
}

export const getAllShops = async (isAdmin: boolean = false, status?: string) => {
  try {
    // Build query parameters
    const params: Record<string, string> = {};
    
    if (isAdmin) {
      params.isAdmin = 'true';
    }
    
    if (status) {
      params.status = status;
    }
    
    // Convert params object to query string
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/shops?${queryString}` : '/shops';
    
    console.log('Fetching shops with URL:', url);
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch shops');
    }
    throw new Error('Failed to fetch shops');
  }
};

export const getShopById = async (shopId: string, userId?: string) => {
  try {
    // Build query parameters if userId is provided (to check ownership)
    const params: Record<string, string> = {};
    if (userId) {
      params.userId = userId;
    }
    
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/shops/${shopId}?${queryString}` : `/shops/${shopId}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch shop');
    }
    throw new Error('Failed to fetch shop');
  }
};

export const getShopFoodItems = async (shopId: string) => {
  try {
    const response = await api.get(`/shops/${shopId}/food-items`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch food items');
    }
    throw new Error('Failed to fetch food items');
  }
};

export const registerShop = async (shopData: ShopData) => {
  try {
    console.log('Registering shop with data:', shopData);
    
    // Validate that ownerId exists before sending the request
    if (!shopData.ownerId) {
      console.error('Owner ID is missing from shop data');
      throw new Error('Owner ID is required to register a shop');
    }
    
    // Validate certificate data
    if (shopData.certificate) {
      if (!shopData.certificate.data) {
        console.error('Certificate data is missing');
        throw new Error('Certificate data is required');
      }
      
      if (!shopData.certificate.type) {
        console.error('Certificate type is missing');
        throw new Error('Certificate type is required');
      }
      
      if (!shopData.certificate.name) {
        console.error('Certificate name is missing');
        throw new Error('Certificate name is required');
      }
    }
    
    // Log the full request being sent, emphasizing the ownerId
    console.log('Sending shop registration with ownerId:', shopData.ownerId);
    
    const response = await api.post('/shops', shopData);
    console.log('Shop registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Shop registration error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to register shop');
    }
    throw new Error('Failed to register shop');
  }
};

export const updateShop = async (shopId: string, shopData: Partial<ShopData>, userType: string = '') => {
  try {
    // Include userType in the request body to validate admin status
    const dataWithUserType = {
      ...shopData,
      userType
    };
    
    const response = await api.patch(`/shops/${shopId}`, dataWithUserType);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update shop');
    }
    throw new Error('Failed to update shop');
  }
};

export const deleteShop = async (shopId: string, ownerId: string) => {
  try {
    const response = await api.delete(`/shops/${shopId}`, { data: { ownerId } });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete shop');
    }
    throw new Error('Failed to delete shop');
  }
};


import api from './api';
import axios from 'axios';

export const createOffer = async (offerData: {
  title: string;
  description: string;
  type: "percentage" | "bogo" | "freeDelivery";
  value: number;
  minimumOrder: number;
  code: string;
  expiryDate: string;
  shopId: string;
}) => {
  try {
    const response = await api.post('/offers', offerData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create offer');
    }
    throw new Error('Failed to create offer');
  }
};

export const getShopOffers = async (shopId: string) => {
  try {
    const response = await api.get(`/shops/${shopId}/offers`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch offers');
    }
    throw new Error('Failed to fetch offers');
  }
};

export const updateOffer = async (offerId: string, offerData: any) => {
  try {
    const response = await api.patch(`/offers/${offerId}`, offerData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update offer');
    }
    throw new Error('Failed to update offer');
  }
};

export const deleteOffer = async (offerId: string) => {
  try {
    const response = await api.delete(`/offers/${offerId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete offer');
    }
    throw new Error('Failed to delete offer');
  }
};

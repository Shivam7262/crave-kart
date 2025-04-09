
import api from './api';

export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
  userType: "customer" | "shopOwner";
}) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    // Still handle errors as before, but now with axios error structure
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Update failed');
    }
    throw new Error('Update failed');
  }
};

import axios from 'axios';

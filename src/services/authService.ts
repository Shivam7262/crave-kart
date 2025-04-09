
import api from './api';
import axios from 'axios';

export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  userType: "customer" | "shopOwner" | "admin";
}

export const register = async (userData: RegistrationData) => {
  try {
    const response = await api.post('/users', userData);
    
    // Store user data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};

export const login = async (credentials: Credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    
    // Store user data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  const storedUser = localStorage.getItem('currentUser');
  
  if (!storedUser) {
    return null;
  }
  
  try {
    return JSON.parse(storedUser);
  } catch (e) {
    localStorage.removeItem('currentUser');
    return null;
  }
};

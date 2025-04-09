
import axios from 'axios';

// Use environment variables if available or fall back to the deployed backend URL for production
// In production, change this to your actual deployed backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // Set a reasonable timeout
});

// Add a request interceptor to include auth token (for future JWT implementation)
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for better debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        console.error("Network Error: Unable to connect to the server. Please check if the backend is running.");
      } else if (error.response) {
        console.error("API Response Error:", error.response.status, error.response.data);
      } else {
        console.error("API Response Error:", error.message);
      }
    } else {
      console.error("API Response Error:", error);
    }
    
    return Promise.reject(error);
  }
);

export default api;

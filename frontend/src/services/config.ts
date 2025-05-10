// Configuration for API services
import axios from 'axios';

// Create base axios instance with common configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh or specific error codes
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Implement token refresh logic here if needed
    }
    
    return Promise.reject(error);
  }
);

// For backward compatibility
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    REFRESH: '/api/auth/refresh/',
    LOGOUT: '/api/auth/logout/',
    ME: '/api/auth/me/',
  },
  NETWORK: {
    DEVICES: '/api/network/devices/',
    SPEED_TEST: '/api/network/speedtest/',
    STATUS: '/api/network/status/',
  },
  NEWS: {
    RSS_FEED: '/api/news/feed/',
    SECURITY_NEWS: '/api/news/security/',
  },
  SUBSCRIBER: {
    SUBSCRIBE: '/api/subscriber/create/',
    UPDATE: '/api/subscriber/update/',
    DELETE: '/api/subscriber/delete/',
  },
};

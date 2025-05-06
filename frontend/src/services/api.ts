import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5252';

// Function to get CSRF token from cookies
const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include CSRF token
api.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Add request interceptor to include authentication tokens
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage when in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Implement token refresh logic here if needed
      
      // For now, redirect to login or clear tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // You might want to redirect to login
      }
    }
    
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    username: string;
    email: string;
    is_subscriber: boolean;
  };
  message?: string;
}

export interface SubscriberData {
  name: string;
  email: string;
  agreed_to_terms: boolean;
}

interface NetworkResponse<T> {
  data: T;
}

interface SpeedTestData {
  download: number;
  upload: number;
  ping: number;
  timestamp: string;
  server: {
    host: string;
    name: string;
    location: string;
  };
}

interface NetworkDevicesData {
  devices: Array<{
    ip: string;
    mac: string;
    hostname: string;
    last_seen: string;
    status: 'online' | 'offline';
    first_seen: string;
  }>;
  timestamp: string;
}

interface SpeedTestStatus {
  status: 'running' | 'completed' | 'error';
  progress?: number;
  phase?: 'download' | 'upload' | 'ping';
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/api/login/', credentials),
    
  register: (data: RegisterData) =>
    api.post<AuthResponse>('/api/register/', data),
    
  logout: () =>
    api.post('/api/logout/'),

  getCurrentUser: () =>
    api.get<AuthResponse>('/api/user/current/'),

  checkSuperUser: () =>
    api.get<AuthResponse>('/api/user/is-superuser/'),
};

export const subscriberApi = {
  subscribe: (data: SubscriberData) =>
    api.post<{ id: number; name: string; email: string; created_at: string }>('/api/subscribe/', data),
};

export const networkApi = {
  scanNetwork: () => api.get('/api/scan/'),
  getSpeedTest: () => api.get<SpeedTestData>('/api/speed/'),
  getNetworkDevices: () => api.get<NetworkResponse<NetworkDevicesData>>('/api/network/devices'),
  getNetworkStats: () => api.get('/api/stats/'),
  runSpeedTest: () => api.post('/api/network/speedtest'),
  getSpeedTestHistory: () => api.get('/api/network/speedtest/history'),
  // Add these new methods for the SpeedTest component
  startSpeedTest: () => api.post<void>('/api/network/speedtest/start'),
  getSpeedTestStatus: () => api.get<SpeedTestStatus>('/api/network/speedtest/status'),
  getLatestSpeedTest: () => api.get<NetworkResponse<SpeedTestData>>('/api/network/speedtest/latest'),
};

export const newsAPI = {
  getNews: async () => {
    const response = await fetch(`${API_BASE_URL}/api/news/`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    return response.json();
  },
};

export default api;
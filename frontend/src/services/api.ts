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
  timestamp: string;
  status: 'success' | 'error';
}

interface SpeedTestData {
  speed_test: {
    download: number;
    upload: number;
    ping: number;
  };
}

interface NetworkDevicesData {
  devices: Array<{
    ip: string;
    mac: string;
    hostname: string;
    last_seen: string;
  }>;
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
  getSpeedTest: () => api.get<NetworkResponse<SpeedTestData>>('/api/speed/'),
  getNetworkDevices: () => api.get<NetworkResponse<NetworkDevicesData>>('/api/devices/'),
  getNetworkStats: () => api.get('/api/stats/'),
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
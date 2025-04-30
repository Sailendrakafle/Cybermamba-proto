import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5252/api';

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

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/login/', credentials),
    
  register: (data: RegisterData) =>
    api.post<AuthResponse>('/register/', data),
    
  logout: () =>
    api.post('/logout/'),

  getCurrentUser: () =>
    api.get<AuthResponse>('/user/current/'),

  checkSuperUser: () =>
    api.get<AuthResponse>('/user/is-superuser/'),
};

export const networkApi = {
  scanNetwork: () => api.get('/scan/'),
  getSpeedTest: () => api.get('/speed/'),
  getNetworkStats: () => api.get('/stats/'),
};
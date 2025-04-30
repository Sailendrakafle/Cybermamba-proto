import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const networkApi = {
  scanNetwork: () => api.get('/scan/'),
  getSpeedTest: () => api.get('/speed/'),
  getNetworkStats: () => api.get('/stats/'),
};
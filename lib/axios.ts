import axios from 'axios';
import { ENV } from '@/constants/env';

// Create axios instance
if (typeof window !== 'undefined') {
  console.log('[Axios] Initializing with baseURL:', ENV.API_BASE_URL);
}
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // Handle auth errors
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('session_token');
      localStorage.removeItem('auth_user');
      
      // Dispatch session expired event
      window.dispatchEvent(new CustomEvent('session-expired'));
      
      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Authentication API client
 */
import { apiClient, API_BASE_URL, API_ROUTES } from '../config';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  password: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthResponse {
  token: string;
  refresh_token?: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export const authApi = {
  /**
   * Login user
   * @param credentials Login credentials
   */
  async login(credentials: LoginCredentials) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Invalid credentials');
    }

    return response.json();
  },

  /**
   * Register new user
   * @param credentials Registration credentials and info
   */
  async register(credentials: RegisterCredentials) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      const errorMessage = Object.values(errorData).flat().join(', ');
      throw new Error(errorMessage || 'Registration failed');
    }

    return response.json();
  },

  /**
   * Logout user
   */
  async logout() {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return true;
  },

  /**
   * Get current user info
   */
  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/api/auth/user/`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null; // Not authenticated
      }
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  }
}

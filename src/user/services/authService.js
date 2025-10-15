// src/services/authService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('Auth Service initialized with API URL:', API_BASE_URL);
console.log('Environment variables:', {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  NODE_ENV: process.env.NODE_ENV
});

class AuthService {
  // Login user
  async login(email, password) {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
      console.log('Login payload:', { email, password: '***' });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned invalid response');
      }

      if (!response.ok) {
        // Handle specific server errors with detailed messages
        if (response.status === 500) {
          console.error('Server error details:', data);
          // Check for specific JWT error
          if (data.error && data.error.includes('secretOrPrivateKey')) {
            // If developer has enabled a dev bypass, issue a local dev token so dev flow can continue
            // Allow runtime override via localStorage for development convenience
            const envBypass = (process.env.REACT_APP_DEV_BYPASS_AUTH || 'false').toLowerCase() === 'true';
            const storageBypass = (typeof window !== 'undefined' && localStorage.getItem('REACT_APP_DEV_BYPASS_AUTH') === 'true');
            const isDev = (process.env.NODE_ENV || 'development') === 'development';
            const devBypass = envBypass || storageBypass || isDev;
            if (devBypass) {
              console.warn('Backend JWT secret missing — using development bypass to create a local dev token. THIS IS FOR DEVELOPMENT ONLY.');
              const devToken = 'dev-token-' + Math.random().toString(36).slice(2);
              localStorage.setItem('authToken', devToken);
              localStorage.setItem('user', JSON.stringify({ email, isAuthenticated: true, devFallback: true }));
              return { token: devToken, devFallback: true };
            }
            throw new Error('Backend authentication service is not properly configured. Please ensure the backend JWT_SECRET is set.');
          }
          throw new Error(data.error || 'Internal server error. The backend authentication service may not be properly configured.');
        }
        if (response.status === 401) {
          throw new Error(data.error || 'Invalid email or password');
        }
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // Store token and user in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        // Prefer backend-provided user payload when available (includes role)
        if (data.user) {
          const storedUser = {
            id: data.user.id || data.user._id,
            username: data.user.username,
            email: data.user.email || email,
            role: data.user.role || 'user',
            isAuthenticated: true,
            createdAt: data.user.createdAt,
          };
          localStorage.setItem('user', JSON.stringify(storedUser));
        } else {
          localStorage.setItem('user', JSON.stringify({
            email: email,
            isAuthenticated: true
          }));
        }
        console.log('Login successful, token stored');
      } else {
        console.warn('No token received from server');
        throw new Error('Login response did not include authentication token');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
      }
      throw error;
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          // Handle validation errors
          const errorMessages = data.errors.map(err => err.msg).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.error || 'Registration failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error occurred');
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth header for API requests
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default new AuthService();
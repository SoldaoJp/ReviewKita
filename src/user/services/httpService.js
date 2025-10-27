import authService from './authService.js';

class HttpService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
        throw new Error('Authentication failed. Please login again.');
      }

      const data = await response.json();

      if (!response.ok) {
        // Create error object with response data
        const error = new Error(data.error || data.message || 'Request failed');
        error.response = { data, status: response.status };
        throw error;
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  // Handle file uploads
  async uploadFile(endpoint, formData, options = {}) {
    const config = {
      headers: {
        ...authService.getAuthHeader(),
        // Don't set Content-Type for FormData, browser will set it automatically
      },
      method: 'POST',
      body: formData,
      ...options,
    };

    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Upload failed');
    }

    return data;
  }
}

export default new HttpService();

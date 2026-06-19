import axios from 'axios';

// Create API instance with a base URL
// Using an environment variable or falling back to the Spring Boot default port
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (e.g., 401 unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if unauthorized and not already trying to log in
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes('/auth/login')
    ) {
      // Clear token and user details on session expiry
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;

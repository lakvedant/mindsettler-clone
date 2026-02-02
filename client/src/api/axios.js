import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // Your backend entry point
  withCredentials: true,               // Essential for JWT Cookies
});

// Request interceptor - Add token from localStorage as fallback for Safari
API.interceptors.request.use(
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

// Response interceptor - Store token in localStorage when received (for Safari)
API.interceptors.response.use(
  (response) => {
    // If the response contains a token, store it in localStorage
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    // If we get a 401, clear the stored token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;
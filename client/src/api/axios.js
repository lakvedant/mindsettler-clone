import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Authentication is stored in an HTTP-only cookie, so there is no
      // client-readable token to clear here.
    }
    return Promise.reject(error);
  }
);

export default API;

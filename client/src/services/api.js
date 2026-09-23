import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // send the httpOnly auth cookie
});

// Attach the bearer token (kept as a fallback alongside the cookie) if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so components can just read err.message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message
      || (error.response?.status === 404 ? 'API endpoint was not found. Check the backend URL.' : null)
      || (error.response?.status === 401 ? 'Your session expired. Please log in again.' : null)
      || (!error.response ? 'Cannot connect to the API. Start the backend or check VITE_API_URL.' : null)
      || 'The request failed. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;

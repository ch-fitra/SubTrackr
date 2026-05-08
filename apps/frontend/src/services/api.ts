import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001',
  withCredentials: true, // Support cookies if backend uses them
});

export default api;

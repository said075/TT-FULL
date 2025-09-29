import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Lines API
export const linesAPI = {
  getAll: () => api.get('/lines'),
  getById: (id) => api.get(`/lines/${id}`),
  getStops: (id, dayType = 'weekday') => api.get(`/lines/${id}/stops?day_type=${dayType}`),
  getTimetable: (id, dayType = 'weekday') => api.get(`/lines/${id}/timetable?day_type=${dayType}`),
  search: (query) => api.get(`/lines/search?q=${encodeURIComponent(query)}`),
};

// Stops API
export const stopsAPI = {
  getAll: () => api.get('/stops'),
  getById: (id) => api.get(`/stops/${id}`),
  getTimetable: (id, dayType = 'weekday') => api.get(`/stops/${id}/timetable?day_type=${dayType}`),
  getLines: (id) => api.get(`/stops/${id}/lines`),
  search: (query) => api.get(`/stops/search?q=${encodeURIComponent(query)}`),
  getNearby: (lat, lng, radius = 1000) => 
    api.get(`/stops/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Journey API
export const journeyAPI = {
  plan: (from, to, dayType = 'weekday') => 
    api.get(`/journey/plan?from=${from}&to=${to}&day_type=${dayType}`),
  getNearby: (lat, lng, radius = 500, limit = 10) => 
    api.get(`/journey/nearby?lat=${lat}&lng=${lng}&radius=${radius}&limit=${limit}`),
};

// System API
export const systemAPI = {
  getHealth: () => api.get('/health'),
  getDocs: () => api.get('/'),
};

export default api;

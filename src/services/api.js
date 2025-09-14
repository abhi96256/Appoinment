import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Availability API
export const availabilityAPI = {
  getSlots: (serviceId, date) => api.get(`/avail?service_id=${serviceId}&date=${date}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post('/book', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  getByEmail: (email) => api.get(`/bookings/customer/${email}`),
  cancel: (id) => api.post(`/bookings/${id}/cancel`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
};

// Reviews API
export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getByService: (serviceId, params) => api.get(`/reviews/service/${serviceId}`, { params }),
  getAll: (params) => api.get('/reviews', { params }),
  approve: (id, isApproved) => api.put(`/reviews/${id}/approve`, { isApproved }),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;

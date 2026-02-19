import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && 
    !error.config.url.includes('/auth/login')) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Brand APIs
export const brandAPI = {
  getAll: () => api.get('/brands'),
  getById: (id) => api.get(`/brands/${id}`),
  create: (data) => api.post('/brands', data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`),
};

// Shoe APIs
export const shoeAPI = {
  getAll: (params) => api.get('/shoes', { params }),
  getById: (id) => api.get(`/shoes/${id}`),
  create: (formData) => api.post('/shoes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/shoes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateQuantity: (id, data) => api.patch(`/shoes/${id}/quantity`, data),
  delete: (id) => api.delete(`/shoes/${id}`),
  getLowStock: () => api.get('/shoes/low-stock'),
  
  // Shoe Types
  getTypes: (params) => api.get('/shoes/types/all', { params }),
  createType: (data) => api.post('/shoes/types', data),
  
  // New Arrivals
  getArrivals: () => api.get('/shoes/arrivals/all'),
  createArrival: (formData) => api.post('/shoes/arrivals', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  convertArrival: (id) => api.post(`/shoes/arrivals/${id}/convert`),
};

// Customer APIs
export const customerAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Sale APIs
export const saleAPI = {
  create: (data) => api.post('/sales', data),
  getAll: (params) => api.get('/sales', { params }),
  getById: (id) => api.get(`/sales/${id}`),
  getStats: () => api.get('/sales/stats/dashboard'),
};

// Report APIs
export const reportAPI = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getInventoryReport: () => api.get('/reports/inventory'),
  getCustomerReport: () => api.get('/reports/customers'),
  getPerformanceReport: (params) => api.get('/reports/performance', { params }),
};

export default api;

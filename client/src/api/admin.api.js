import client from './client';

// Dashboard Stats
export const getDashboardStats = () => client.get('/admin/stats');

// Orders Management
export const getAllOrders = (params) => client.get('/admin/orders', { params });

export const updateOrderStatus = (orderId, status, note) => 
  client.put(`/admin/orders/${orderId}/status`, { status, note });

export const assignRider = (orderId, riderId) =>
  client.put(`/admin/orders/${orderId}/assign-rider`, { riderId });

// Products Management
export const getAllProducts = () => client.get('/admin/products');

export const createProduct = (formData) => 
  client.post('/admin/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// Users Management
export const getAllUsers = (params) => client.get('/admin/users', { params });

export const updateUserRole = (userId, role) =>
  client.put(`/admin/users/${userId}/role`, { role });

export const updateUserStatus = (userId, status) =>
  client.put(`/admin/users/${userId}/status`, { status });

// Riders Management
export const getAllRiders = (params) => client.get('/admin/riders', { params });


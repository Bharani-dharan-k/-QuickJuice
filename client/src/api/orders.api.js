import client from './client';

export const createOrder = (orderData) => client.post('/orders/checkout', orderData);

export const getMyOrders = () => client.get('/orders');

export const getOrder = (orderId) => client.get(`/orders/${orderId}`);

export const updateOrderStatus = (orderId, status) => 
  client.patch(`/orders/${orderId}/status`, { status });

export const cancelOrder = (orderId, reason) => 
  client.patch(`/orders/${orderId}/cancel`, { reason });

export const rateOrder = (orderId, rating, review) =>
  client.post(`/orders/${orderId}/rate`, { rating, review });
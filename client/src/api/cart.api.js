import client from './client'

/**
 * Get user cart
 * @returns {Promise} Cart data
 */
export const getCart = async () => {
  const response = await client.get('/cart')
  return response.data
}

/**
 * Add item to cart
 * @param {Object} item - Item to add
 * @returns {Promise} Updated cart
 */
export const addToCart = async (item) => {
  const response = await client.post('/cart/add', item)
  return response.data
}

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} Updated cart
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await client.put(`/cart/update/${itemId}`, { quantity })
  return response.data
}

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise} Updated cart
 */
export const removeFromCart = async (itemId) => {
  const response = await client.delete(`/cart/remove/${itemId}`)
  return response.data
}

/**
 * Clear entire cart
 * @returns {Promise} Empty cart
 */
export const clearCart = async () => {
  const response = await client.delete('/cart/clear')
  return response.data
}

/**
 * Apply coupon to cart
 * @param {string} code - Coupon code
 * @returns {Promise} Updated cart with discount
 */
export const applyCoupon = async (code) => {
  const response = await client.post('/cart/apply-coupon', { code })
  return response.data
}

/**
 * Remove coupon from cart
 * @returns {Promise} Updated cart
 */
export const removeCoupon = async () => {
  const response = await client.delete('/cart/remove-coupon')
  return response.data
}

import client from './client'

/**
 * Get all products with filters
 * @param {Object} params - Query parameters
 * @returns {Promise} Products list
 */
export const getProducts = async (params = {}) => {
  const response = await client.get('/products', { params })
  return response.data
}

/**
 * Get single product by ID or slug
 * @param {string} id - Product ID or slug
 * @returns {Promise} Product details
 */
export const getProduct = async (id) => {
  const response = await client.get(`/products/${id}`)
  return response.data
}

/**
 * Get featured products
 * @returns {Promise} Featured products
 */
export const getFeaturedProducts = async () => {
  const response = await client.get('/products/featured')
  return response.data
}

/**
 * Create new product (admin only)
 * @param {Object} productData - Product data
 * @returns {Promise} Created product
 */
export const createProduct = async (productData) => {
  const response = await client.post('/products', productData)
  return response.data
}

/**
 * Update product (admin only)
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise} Updated product
 */
export const updateProduct = async (id, productData) => {
  const response = await client.put(`/products/${id}`, productData)
  return response.data
}

/**
 * Delete product (admin only)
 * @param {string} id - Product ID
 * @returns {Promise} Delete confirmation
 */
export const deleteProduct = async (id) => {
  const response = await client.delete(`/products/${id}`)
  return response.data
}

/**
 * Update product stock (admin only)
 * @param {string} id - Product ID
 * @param {Object} stockData - Stock update data
 * @returns {Promise} Updated product
 */
export const updateStock = async (id, stockData) => {
  const response = await client.patch(`/products/${id}/stock`, stockData)
  return response.data
}

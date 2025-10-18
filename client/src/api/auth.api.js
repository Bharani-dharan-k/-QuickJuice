import client from './client';

// Authentication API calls
export const authApi = {
  // Login
  login: async (credentials) => {
    const response = await client.post('/auth/login', credentials);
    return response.data;
  },

  // Signup
  signup: async (userData) => {
    const response = await client.post('/auth/signup', userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await client.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await client.post('/auth/refresh-token');
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await client.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await client.put('/auth/profile', userData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await client.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await client.post('/auth/reset-password', { token, password });
    return response.data;
  }
};

/**
 * Update user profile
 * @param {Object} data - Profile data to update
 * @returns {Promise<Object>} Response data
 */
export const updateProfile = async (data) => {
  try {
    const response = await client.put('/auth/update-profile', data);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export default authApi;

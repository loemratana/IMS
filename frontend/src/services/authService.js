import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

const authService = {
  /**
   * Helper to set access token manually (used after login)
   */
  setToken(token) {
    localStorage.setItem('accessToken', token);
  },

  /**
   * Helper to clear tokens and cleanup state (used after logout)
   */
  clearToken() {
    localStorage.removeItem('accessToken');
  },

  /**
   * Register a new user
   * @param {{ name, email, password, role? }} userData 
   */
  async register(userData) {
    // Expected to return the newly created user data
    return await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  /**
   * Authenticate a user and store their tokens
   * @param {{ email, password }} credentials 
   */
  async login(credentials) {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    // Based on backend implementation: { success: true, data: { user, accessToken, expiresIn } }
    if (response?.data?.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return response; // Caller handles getting user info
  },

  /**
   * Logout user and invalidate their credentials
   */
  async logout() {
    try {
      await axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      this.clearToken();
      // Optional: Force reload to clear any memory states if using standard behavior
      // window.location.href = '/login'; 
    }
  },

  /**
   * Get the currently logged-in user details
   */
  async getMe() {
    return await axiosClient.get(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Update authenticated user's password
   * @param {{ currentPassword, newPassword }} payload 
   */
  async changePassword(payload) {
    return await axiosClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  },

  /**
   * Request an email logic to reset forgotten password
   * @param {{ email }} payload 
   */
  async forgotPassword(payload) {
    return await axiosClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
  },

  /**
   * Reset the password using the token sent to user's email
   * @param {{ email, token, newPassword }} payload 
   */
  async resetPassword(payload) {
    return await axiosClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  }
};

export default authService;

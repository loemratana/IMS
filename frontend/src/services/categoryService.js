import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

const categoryService = {
  /**
   * Get all categories
   */
  async getAllCategories() {
    return await axiosClient.get(API_ENDPOINTS.CATEGORIES.BASE);
  },

  /**
   * Get a single category by ID
   */
  async getCategoryById(id) {
    return await axiosClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  /**
   * Create a new category
   * @param {{ name, description }} categoryData
   */
  async createCategory(categoryData) {
    return await axiosClient.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData);
  },

  /**
   * Update an existing category
   * @param {string} id
   * @param {{ name, description }} categoryData
   */
  async updateCategory(id, categoryData) {
    return await axiosClient.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), categoryData);
  },

  /**
   * Delete a category
   * @param {string} id
   */
  async deleteCategory(id) {
    return await axiosClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};

export default categoryService;

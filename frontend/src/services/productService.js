import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

const productService = {
  /**
   * Get all products with optional filters
   * @param {object} params - { page, limit, search, category_id, supplier_id, is_active, sort_by, sort_order }
   */
  async getAllProducts(params = {}) {
    return await axiosClient.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
  },

  /**
   * Get a single product by ID
   * @param {string|number} id
   */
  async getProductById(id) {
    return await axiosClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  /**
   * Create a new product
   * @param {object} productData
   */
  async createProduct(productData) {
    return await axiosClient.post(API_ENDPOINTS.PRODUCTS.BASE, productData);
  },

  /**
   * Update an existing product
   * @param {string|number} id
   * @param {object} productData
   */
  async updateProduct(id, productData) {
    return await axiosClient.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), productData);
  },

  /**
   * Delete (soft-delete) a product
   * @param {string|number} id
   */
  async deleteProduct(id) {
    return await axiosClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },
};

export default productService;

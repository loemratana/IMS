import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

const supplierService = {
  /**
   * Get all suppliers
   */
  async getAllSuppliers(params = {}) {
    return await axiosClient.get(API_ENDPOINTS.SUPPLIERS.BASE, { params });
  },

  /**
   * Get a single supplier by ID
   */
  async getSupplierById(id) {
    return await axiosClient.get(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
  },

  /**
   * Create a new supplier
   */
  async createSupplier(data) {
    return await axiosClient.post(API_ENDPOINTS.SUPPLIERS.BASE, data);
  },

  /**
   * Update an existing supplier
   */
  async updateSupplier(id, data) {
    return await axiosClient.put(API_ENDPOINTS.SUPPLIERS.BY_ID(id), data);
  },

  /**
   * Delete a supplier
   */
  async deleteSupplier(id) {
    return await axiosClient.delete(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
  },

  /**
   * Permanent delete a supplier
   */
  async deleteSupplierPermanent(id) {
    return await axiosClient.delete(API_ENDPOINTS.SUPPLIERS.PERMANENT(id));
  }
};

export default supplierService;

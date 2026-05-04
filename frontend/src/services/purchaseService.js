import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

const purchaseService = {
  /**
   * Get all purchase orders with optional filters
   */
  async getAllPurchaseOrders(params = {}) {
    return await axiosClient.get(API_ENDPOINTS.PURCHASES.BASE, { params });
  },

  /**
   * Get a single purchase order by ID
   */
  async getPurchaseOrderById(id) {
    return await axiosClient.get(API_ENDPOINTS.PURCHASES.BY_ID(id));
  },

  /**
   * Create a new purchase order
   */
  async createPurchaseOrder(data) {
    return await axiosClient.post(API_ENDPOINTS.PURCHASES.BASE, data);
  },

  /**
   * Approve a purchase order
   */
  async approvePurchaseOrder(id) {
    return await axiosClient.put(API_ENDPOINTS.PURCHASES.APPROVE(id));
  },

  /**
   * Reject a purchase order
   */
  async rejectPurchaseOrder(id, reason) {
    return await axiosClient.post(API_ENDPOINTS.PURCHASES.REJECT(id), { reason });
  },

  /**
   * Receive items for a purchase order
   */
  async receivePurchaseOrderItems(id, items) {
    return await axiosClient.post(API_ENDPOINTS.PURCHASES.RECEIVE(id), { items });
  }
};

export default purchaseService;

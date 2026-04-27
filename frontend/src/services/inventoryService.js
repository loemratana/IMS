import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

/**
 * Inventory Service
 * For handling stock levels, movements, and transfers
 */
const inventoryService = {
  /**
   * Get current stock levels with filtering and pagination
   * @param {object} params - { productId, warehouseId, categoryId, page, limit, sortBy, sortOrder }
   */
  async getCurrentStock(params = {}) {
    return await axiosClient.get(API_ENDPOINTS.INVENTORY.CURRENT_STOCK, { params });
  },

  /**
   * Perform Stock IN operation
   * @param {object} data - { warehouseId, productId, quantity, reason, purchaseOrderNo, ... }
   */
  async stockIn(data) {
    return await axiosClient.post(API_ENDPOINTS.INVENTORY.STOCK_IN, data);
  },

  /**
   * Perform Stock OUT operation
   * @param {object} data - { warehouseId, productId, quantity, reason, salesOrderNo, ... }
   */
  async stockOut(data) {
    return await axiosClient.post(API_ENDPOINTS.INVENTORY.STOCK_OUT, data);
  },

  /**
   * Adjust stock levels (increment or decrement)
   * @param {object} data - { warehouseId, productId, quantity, adjustmentType, reason, notes }
   */
  async adjustStock(data) {
    return await axiosClient.post(API_ENDPOINTS.INVENTORY.ADJUST_STOCK, data);
  },

  /**
   * Transfer stock between warehouses
   * @param {object} data - { fromWarehouseId, toWarehouseId, productId, quantity, reason }
   */
  async transferStock(data) {
    return await axiosClient.post(API_ENDPOINTS.INVENTORY.TRANSFER, data);
  },
};

export default inventoryService;

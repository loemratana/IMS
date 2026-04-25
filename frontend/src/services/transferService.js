import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

/**
 * Transfer Service
 * For handling transfer requests, approvals, and executions
 */
const transferService = {
  /**
   * Get all transfer requests
   * @param {object} params - Filter and pagination params
   */
  async getTransfers(params = {}) {
    return await axiosClient.get(API_ENDPOINTS.TRANSFERS.REQUESTS, { params });
  },

  /**
   * Get a transfer request by ID
   * @param {string} id - The ID of the transfer request
   */
  async getTransferRequestById(id) {
    return await axiosClient.get(API_ENDPOINTS.TRANSFERS.BY_ID(id));
  },

  /**
   * Create a new transfer request
   * @param {object} data - The transfer request payload
   */
  async createTransferRequest(data) {
    return await axiosClient.post(API_ENDPOINTS.TRANSFERS.REQUESTS, data);
  },

  /**
   * Approve a transfer request (Admin/Manager only)
   * @param {string|number} id - The ID of the transfer request
   * @param {object} data - Optional payload (e.g., approval notes)
   */
  async approveTransferRequest(id, data = {}) {
    return await axiosClient.post(API_ENDPOINTS.TRANSFERS.APPROVE(id), data);
  },

  /**
   * Execute an approved transfer request (Admin/Manager only)
   * @param {string|number} id - The ID of the transfer request
   * @param {object} data - Optional payload (e.g., execution notes or carrier details)
   */
  async executeTransfer(id, data = {}) {
    return await axiosClient.post(API_ENDPOINTS.TRANSFERS.EXECUTE(id), data);
  },
};

export default transferService;

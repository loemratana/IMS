import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

const warehouseService = {
    /**
     * Get all warehouses
     */
    async getAllWarehouses(params = {}) {
        return await axiosClient.get(API_ENDPOINTS.WAREHOUSES.BASE, { params });
    },

    /**
     * Get a single warehouse by ID
     */
    async getWarehouseById(id) {
        return await axiosClient.get(API_ENDPOINTS.WAREHOUSES.BY_ID(id));
    },

    /**
     * Create a new warehouse
     */
    async createWarehouse(warehouseData) {
        return await axiosClient.post(API_ENDPOINTS.WAREHOUSES.BASE, warehouseData);
    },

    /**
     * Update an existing warehouse
     */
    async updateWarehouse(id, warehouseData) {
        return await axiosClient.put(API_ENDPOINTS.WAREHOUSES.BY_ID(id), warehouseData);
    },

    /**
     * Delete (soft-delete) a warehouse
     */
    async deleteWarehouse(id) {
        return await axiosClient.delete(API_ENDPOINTS.WAREHOUSES.BY_ID(id));
    },
};

export default warehouseService;
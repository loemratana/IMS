import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

const customerService = {
  createCustomer: async (customerData) => {
    return await axiosClient.post(API_ENDPOINTS.CUSTOMERS.BASE, customerData);
  },

  getCustomers: async (params = {}) => {
    return await axiosClient.get(API_ENDPOINTS.CUSTOMERS.BASE, { params });
  },

  getCustomerById: async (id) => {
    return await axiosClient.get(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
  },

  updateCustomer: async (id, customerData) => {
    return await axiosClient.put(API_ENDPOINTS.CUSTOMERS.BY_ID(id), customerData);
  },

  deleteCustomer: async (id) => {
    return await axiosClient.delete(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
  },

  bulkDeleteCustomers: async (ids) => {
    return await axiosClient.post(API_ENDPOINTS.CUSTOMERS.BULK_DELETE, { ids });
  },
};

export default customerService;

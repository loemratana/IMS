export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id) => `/products/${id}`,
  },
  WAREHOUSES: {
    BASE: '/warehouses',
    BY_ID: (id) => `/warehouses/${id}`,
  },
  INVENTORY: {
    STOCK_IN: '/inventory/stock-in',
    STOCK_OUT: '/inventory/stock-out',
    TRANSFER: '/inventory/transfer',
    CURRENT_STOCK: '/inventory/current-stock',
  },
  TRANSFERS: {
    REQUESTS: '/transfers/requests',
    BY_ID: (id) => `/transfers/requests/${id}`,
    APPROVE: (id) => `/transfers/requests/${id}/approve`,
    EXECUTE: (id) => `/transfers/requests/${id}/execute`,
    CANCEL: (id) => `/transfers/requests/${id}/cancel`,
  },
};

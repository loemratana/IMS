import { Customer, mockCustomers } from '../contacts/mockData';

export type SOStatus = 'DRAFT' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface SOItem {
  id: string;
  product: { id: string; name: string; sku: string; availableStock: number };
  quantity: number;
  unitPrice: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customer: Customer;
  status: SOStatus;
  orderDate: string;
  totalAmount: number;
  itemsCount: number;
  createdBy: { name: string };
  paymentMethod: string;
  shippingAddress: string;
  notes?: string;
  items: SOItem[];
  activityLogs: { id: string; action: string; date: string; user: string }[];
}

export const mockSalesOrders: SalesOrder[] = [
  {
    id: 'so_1',
    orderNumber: 'SO-2024-001',
    customer: mockCustomers[0],
    status: 'COMPLETED',
    orderDate: '2024-05-15T09:30:00Z',
    totalAmount: 4500.00,
    itemsCount: 2,
    createdBy: { name: 'Sales Agent' },
    paymentMethod: 'Bank Transfer',
    shippingAddress: mockCustomers[0].address,
    items: [
      { id: 'item_1', product: { id: 'p_1', name: 'Wireless Noise-Canceling Headphones', sku: 'AUDIO-WH-001', availableStock: 120 }, quantity: 10, unitPrice: 200.00 },
      { id: 'item_2', product: { id: 'p_2', name: 'Mechanical Keyboard RGB', sku: 'PERIPH-KBD-002', availableStock: 80 }, quantity: 25, unitPrice: 100.00 }
    ],
    activityLogs: [
      { id: 'log_1', action: 'Draft created', date: '2024-05-15T09:30:00Z', user: 'Sales Agent' },
      { id: 'log_2', action: 'Confirmed by customer', date: '2024-05-15T10:00:00Z', user: 'System' },
      { id: 'log_3', action: 'Started processing', date: '2024-05-15T10:15:00Z', user: 'Warehouse Staff' },
      { id: 'log_4', action: 'Order completed and shipped', date: '2024-05-16T14:30:00Z', user: 'Warehouse Staff' }
    ]
  },
  {
    id: 'so_2',
    orderNumber: 'SO-2024-002',
    customer: mockCustomers[1],
    status: 'PROCESSING',
    orderDate: '2024-05-25T11:00:00Z',
    totalAmount: 12500.00,
    itemsCount: 3,
    createdBy: { name: 'Sales Agent' },
    paymentMethod: 'Credit Card (Net 30)',
    shippingAddress: mockCustomers[1].address,
    notes: 'Urgent delivery required by EOW.',
    items: [
      { id: 'item_3', product: { id: 'p_3', name: 'Ultra HD 4K Monitor', sku: 'DISP-4K-001', availableStock: 50 }, quantity: 20, unitPrice: 400.00 },
      { id: 'item_4', product: { id: 'p_4', name: 'USB-C Docking Station', sku: 'ACC-DOCK-001', availableStock: 200 }, quantity: 30, unitPrice: 100.00 },
      { id: 'item_5', product: { id: 'p_5', name: 'Ergonomic Mouse', sku: 'PERIPH-MOU-001', availableStock: 150 }, quantity: 30, unitPrice: 50.00 }
    ],
    activityLogs: [
      { id: 'log_5', action: 'Draft created', date: '2024-05-25T11:00:00Z', user: 'Sales Agent' },
      { id: 'log_6', action: 'Confirmed by customer', date: '2024-05-25T11:30:00Z', user: 'System' },
      { id: 'log_7', action: 'Started processing', date: '2024-05-25T12:00:00Z', user: 'Warehouse Staff' }
    ]
  },
  {
    id: 'so_3',
    orderNumber: 'SO-2024-003',
    customer: mockCustomers[3],
    status: 'CONFIRMED',
    orderDate: '2024-05-28T14:20:00Z',
    totalAmount: 850.00,
    itemsCount: 1,
    createdBy: { name: 'Admin User' },
    paymentMethod: 'Credit Card',
    shippingAddress: mockCustomers[3].address,
    items: [
      { id: 'item_6', product: { id: 'p_8', name: 'Smart Light Bulbs (4-Pack)', sku: 'SMART-LGT-004', availableStock: 500 }, quantity: 17, unitPrice: 50.00 }
    ],
    activityLogs: [
      { id: 'log_8', action: 'Draft created', date: '2024-05-28T14:20:00Z', user: 'Admin User' },
      { id: 'log_9', action: 'Confirmed by customer', date: '2024-05-28T15:00:00Z', user: 'System' }
    ]
  },
  {
    id: 'so_4',
    orderNumber: 'SO-2024-004',
    customer: mockCustomers[2],
    status: 'DRAFT',
    orderDate: '2024-05-29T09:00:00Z',
    totalAmount: 2400.00,
    itemsCount: 1,
    createdBy: { name: 'Sales Agent' },
    paymentMethod: 'Bank Transfer',
    shippingAddress: mockCustomers[2].address,
    items: [
      { id: 'item_7', product: { id: 'p_6', name: 'Premium Office Chair', sku: 'FURN-CHR-001', availableStock: 25 }, quantity: 12, unitPrice: 200.00 }
    ],
    activityLogs: [
      { id: 'log_10', action: 'Draft created', date: '2024-05-29T09:00:00Z', user: 'Sales Agent' }
    ]
  }
];

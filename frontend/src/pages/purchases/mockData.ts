export type POStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'RECEIVING' | 'COMPLETED' | 'CANCELLED';

export interface POItem {
  id: string;
  product: { id: string; name: string; sku: string; image?: string };
  quantity: number;
  receivedQuantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: { id: string; name: string; contact?: string; email?: string };
  warehouse: { id: string; name: string };
  status: POStatus;
  expectedDate: string;
  totalAmount: number;
  itemsCount: number;
  createdAt: string;
  createdBy: { name: string };
  notes?: string;
  items: POItem[];
  activityLogs: { id: string; action: string; date: string; user: string }[];
}

export const mockSuppliers = [
  { id: 'sup_1', name: 'TechTronics Solutions', contact: 'John Doe', email: 'john@techtronics.com' },
  { id: 'sup_2', name: 'Global Components Inc', contact: 'Jane Smith', email: 'jane@globalcomp.com' },
  { id: 'sup_3', name: 'Premium Office Supplies', contact: 'Bob Wilson', email: 'bob@premiumoffice.com' },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po_1',
    poNumber: 'PO-2024-001',
    supplier: mockSuppliers[0],
    warehouse: { id: 'wh_1', name: 'Main Distribution Center' },
    status: 'DRAFT',
    expectedDate: '2024-06-15T00:00:00Z',
    totalAmount: 12500.00,
    itemsCount: 2,
    createdAt: '2024-05-20T10:30:00Z',
    createdBy: { name: 'Admin User' },
    notes: 'Standard monthly restock for electronics.',
    items: [
      { id: 'item_1', product: { id: 'p_1', name: 'Wireless Noise-Canceling Headphones', sku: 'AUDIO-WH-001' }, quantity: 50, receivedQuantity: 0, unitPrice: 150.00 },
      { id: 'item_2', product: { id: 'p_2', name: 'Mechanical Keyboard RGB', sku: 'PERIPH-KBD-002' }, quantity: 100, receivedQuantity: 0, unitPrice: 50.00 }
    ],
    activityLogs: [
      { id: 'log_1', action: 'Draft created', date: '2024-05-20T10:30:00Z', user: 'Admin User' }
    ]
  },
  {
    id: 'po_2',
    poNumber: 'PO-2024-002',
    supplier: mockSuppliers[1],
    warehouse: { id: 'wh_2', name: 'West Coast Hub' },
    status: 'PENDING_APPROVAL',
    expectedDate: '2024-06-20T00:00:00Z',
    totalAmount: 45000.00,
    itemsCount: 3,
    createdAt: '2024-05-22T14:15:00Z',
    createdBy: { name: 'Sarah Manager' },
    notes: 'Urgent restock for upcoming Q3 sales event.',
    items: [
      { id: 'item_3', product: { id: 'p_3', name: 'Ultra HD 4K Monitor', sku: 'DISP-4K-001' }, quantity: 100, receivedQuantity: 0, unitPrice: 300.00 },
      { id: 'item_4', product: { id: 'p_4', name: 'USB-C Docking Station', sku: 'ACC-DOCK-001' }, quantity: 100, receivedQuantity: 0, unitPrice: 100.00 },
      { id: 'item_5', product: { id: 'p_5', name: 'Ergonomic Mouse', sku: 'PERIPH-MOU-001' }, quantity: 100, receivedQuantity: 0, unitPrice: 50.00 }
    ],
    activityLogs: [
      { id: 'log_2', action: 'Draft created', date: '2024-05-22T14:10:00Z', user: 'Sarah Manager' },
      { id: 'log_3', action: 'Submitted for approval', date: '2024-05-22T14:15:00Z', user: 'Sarah Manager' }
    ]
  },
  {
    id: 'po_3',
    poNumber: 'PO-2024-003',
    supplier: mockSuppliers[2],
    warehouse: { id: 'wh_1', name: 'Main Distribution Center' },
    status: 'RECEIVING',
    expectedDate: '2024-05-25T00:00:00Z',
    totalAmount: 1200.00,
    itemsCount: 1,
    createdAt: '2024-05-18T09:00:00Z',
    createdBy: { name: 'Admin User' },
    items: [
      { id: 'item_6', product: { id: 'p_6', name: 'Premium Office Chair', sku: 'FURN-CHR-001' }, quantity: 10, receivedQuantity: 5, unitPrice: 120.00 }
    ],
    activityLogs: [
      { id: 'log_4', action: 'Draft created', date: '2024-05-18T09:00:00Z', user: 'Admin User' },
      { id: 'log_5', action: 'Approved', date: '2024-05-18T10:00:00Z', user: 'Director User' },
      { id: 'log_6', action: 'Partial items received (5/10)', date: '2024-05-24T16:30:00Z', user: 'Warehouse Staff' }
    ]
  },
  {
    id: 'po_4',
    poNumber: 'PO-2024-004',
    supplier: mockSuppliers[0],
    warehouse: { id: 'wh_3', name: 'East Coast Hub' },
    status: 'COMPLETED',
    expectedDate: '2024-05-10T00:00:00Z',
    totalAmount: 8500.00,
    itemsCount: 2,
    createdAt: '2024-05-01T11:20:00Z',
    createdBy: { name: 'Warehouse Staff' },
    items: [
      { id: 'item_7', product: { id: 'p_7', name: 'Smart Home Hub', sku: 'SMART-HUB-001' }, quantity: 50, receivedQuantity: 50, unitPrice: 100.00 },
      { id: 'item_8', product: { id: 'p_8', name: 'Smart Light Bulbs (4-Pack)', sku: 'SMART-LGT-004' }, quantity: 100, receivedQuantity: 100, unitPrice: 35.00 }
    ],
    activityLogs: [
      { id: 'log_7', action: 'Draft created', date: '2024-05-01T11:20:00Z', user: 'Warehouse Staff' },
      { id: 'log_8', action: 'Approved', date: '2024-05-01T14:00:00Z', user: 'Sarah Manager' },
      { id: 'log_9', action: 'All items received', date: '2024-05-09T09:15:00Z', user: 'Warehouse Staff' },
      { id: 'log_10', action: 'Marked as completed', date: '2024-05-09T09:16:00Z', user: 'Admin User' }
    ]
  }
];

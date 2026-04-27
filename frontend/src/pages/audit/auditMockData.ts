
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'LOGIN' | 'LOGOUT';
export type AuditEntity = 'PRODUCT' | 'PURCHASE_ORDER' | 'SALES_ORDER' | 'TRANSFER' | 'WAREHOUSE' | 'USER';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  entityName?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  rawJson?: string;
}

export const auditMockData: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    userId: 'user-1',
    userName: 'Alex Rivers',
    userEmail: 'alex.rivers@enterprise.com',
    action: 'UPDATE',
    entity: 'PRODUCT',
    entityId: 'PRD-7241',
    entityName: 'High-Performance GPU',
    changes: [
      { field: 'price', oldValue: 599.99, newValue: 649.99 },
      { field: 'stockLevel', oldValue: 15, newValue: 12 }
    ],
    rawJson: JSON.stringify({ id: 'PRD-7241', name: 'High-Performance GPU', price: 649.99, stockLevel: 12, updatedAt: new Date().toISOString() }, null, 2)
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    userId: 'user-2',
    userName: 'Sarah Chen',
    userEmail: 's.chen@enterprise.com',
    action: 'APPROVE',
    entity: 'PURCHASE_ORDER',
    entityId: 'PO-9921',
    entityName: 'Supply Restock - Q2',
    changes: [
      { field: 'status', oldValue: 'PENDING_APPROVAL', newValue: 'APPROVED' }
    ],
    rawJson: JSON.stringify({ id: 'PO-9921', status: 'APPROVED', approvedBy: 'user-2' }, null, 2)
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    userId: 'user-1',
    userName: 'Alex Rivers',
    userEmail: 'alex.rivers@enterprise.com',
    action: 'CREATE',
    entity: 'SALES_ORDER',
    entityId: 'SO-1042',
    entityName: 'Order #1042 - TechCorp',
    changes: [
      { field: 'id', oldValue: null, newValue: 'SO-1042' },
      { field: 'customerId', oldValue: null, newValue: 'CUST-881' },
      { field: 'totalAmount', oldValue: null, newValue: 24500.00 }
    ],
    rawJson: JSON.stringify({ id: 'SO-1042', customerId: 'CUST-881', totalAmount: 24500.00, status: 'DRAFT' }, null, 2)
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    userId: 'user-3',
    userName: 'Marcus Miller',
    userEmail: 'm.miller@enterprise.com',
    action: 'DELETE',
    entity: 'TRANSFER',
    entityId: 'TRF-552',
    entityName: 'Warehouse A -> B (Standard)',
    changes: [
      { field: 'deleted', oldValue: false, newValue: true }
    ],
    rawJson: JSON.stringify({ id: 'TRF-552', deleted: true, deletedAt: new Date().toISOString() }, null, 2)
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    userId: 'user-2',
    userName: 'Sarah Chen',
    userEmail: 's.chen@enterprise.com',
    action: 'UPDATE',
    entity: 'WAREHOUSE',
    entityId: 'WH-001',
    entityName: 'Main Distribution Center',
    changes: [
      { field: 'manager', oldValue: 'John Doe', newValue: 'Sarah Chen' },
      { field: 'capacity', oldValue: 5000, newValue: 7500 }
    ]
  }
];

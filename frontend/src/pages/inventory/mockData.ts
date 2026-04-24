
export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  price: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  product: Product;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minStockLevel: number;
  status: 'normal' | 'low' | 'out';
  warehouse: string;
  lastRestock: string;
  lastSold: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER';
  quantity: number;
  reason: string;
  user: string;
  date: string;
}

export const mockProducts: Product[] = [
  { id: '1', name: 'iPhone 15 Pro', sku: 'IP15P-256-BLK', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=100&h=100&fit=crop', category: 'Electronics', price: 999 },
  { id: '2', name: 'MacBook Air M2', sku: 'MBA-M2-13-GR', image: 'https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?w=100&h=100&fit=crop', category: 'Computing', price: 1199 },
  { id: '3', name: 'Sony WH-1000XM5', sku: 'SNY-XM5-SLV', image: 'https://images.unsplash.com/photo-1644794106607-ca398305047f?w=100&h=100&fit=crop', category: 'Accessories', price: 349 },
  { id: '4', name: 'Logitech MX Master 3S', sku: 'LOG-MX3S-GR', image: 'https://images.unsplash.com/photo-1625773130450-4889c256a596?w=100&h=100&fit=crop', category: 'Accessories', price: 99 },
  { id: '5', name: 'iPad Pro 12.9"', sku: 'IPD-P129-M2', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop', category: 'Computing', price: 1099 },
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv1',
    productId: '1',
    product: mockProducts[0],
    currentStock: 45,
    reservedStock: 5,
    availableStock: 40,
    minStockLevel: 10,
    status: 'normal',
    warehouse: 'Main Warehouse',
    lastRestock: '2024-03-15T10:00:00Z',
    lastSold: '2024-03-20T14:30:00Z',
  },
  {
    id: 'inv2',
    productId: '2',
    product: mockProducts[1],
    currentStock: 8,
    reservedStock: 2,
    availableStock: 6,
    minStockLevel: 10,
    status: 'low',
    warehouse: 'Main Warehouse',
    lastRestock: '2024-03-01T09:00:00Z',
    lastSold: '2024-03-18T11:20:00Z',
  },
  {
    id: 'inv3',
    productId: '3',
    product: mockProducts[2],
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    minStockLevel: 5,
    status: 'out',
    warehouse: 'East Hub',
    lastRestock: '2024-02-15T15:00:00Z',
    lastSold: '2024-03-10T16:45:00Z',
  },
  {
    id: 'inv4',
    productId: '4',
    product: mockProducts[3],
    currentStock: 120,
    reservedStock: 15,
    availableStock: 105,
    minStockLevel: 20,
    status: 'normal',
    warehouse: 'Main Warehouse',
    lastRestock: '2024-03-19T08:30:00Z',
    lastSold: '2024-03-21T09:15:00Z',
  },
];

export const mockMovements: StockMovement[] = [
  { id: 'm1', productId: '1', type: 'IN', quantity: 50, reason: 'Purchase from Apple Inc', user: 'Admin User', date: '2024-03-15T10:00:00Z' },
  { id: 'm2', productId: '1', type: 'OUT', quantity: 5, reason: 'Sale Order #SO-1021', user: 'Staff A', date: '2024-03-20T14:30:00Z' },
  { id: 'm3', productId: '2', type: 'ADJUST', quantity: -2, reason: 'Damage during handling', user: 'Warehouse Manager', date: '2024-03-18T11:20:00Z' },
  { id: 'm4', productId: '3', type: 'OUT', quantity: 12, reason: 'Sale Order #SO-1019', user: 'Staff B', date: '2024-03-10T16:45:00Z' },
];

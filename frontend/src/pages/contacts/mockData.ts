export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
  totalOrders: number;
  lifetimeValue: number;
  lastOrderDate: string;
  joinDate: string;
}

export const mockCustomers: Customer[] = [
  {
    id: 'cust_1',
    name: 'Acme Corp',
    email: 'billing@acmecorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Blvd, Tech City, TC 90210',
    status: 'ACTIVE',
    totalOrders: 14,
    lifetimeValue: 45200.50,
    lastOrderDate: '2024-05-25T14:30:00Z',
    joinDate: '2023-01-15T09:00:00Z'
  },
  {
    id: 'cust_2',
    name: 'Globex Inc',
    email: 'procurement@globex.com',
    phone: '+1 (555) 987-6543',
    address: '456 Industrial Pkwy, Metro Area, MA 10001',
    status: 'ACTIVE',
    totalOrders: 8,
    lifetimeValue: 28500.00,
    lastOrderDate: '2024-05-20T10:15:00Z',
    joinDate: '2023-04-22T11:20:00Z'
  },
  {
    id: 'cust_3',
    name: 'Initech',
    email: 'accounts@initech.net',
    phone: '+1 (555) 456-7890',
    address: '789 Corporate Dr, Office Park, OP 30303',
    status: 'INACTIVE',
    totalOrders: 2,
    lifetimeValue: 3400.00,
    lastOrderDate: '2023-11-10T08:45:00Z',
    joinDate: '2023-08-05T14:10:00Z'
  },
  {
    id: 'cust_4',
    name: 'Umbrella Corp',
    email: 'purchasing@umbrellacorp.com',
    phone: '+1 (555) 222-3333',
    address: '100 Research Way, Lab City, LC 50505',
    status: 'ACTIVE',
    totalOrders: 24,
    lifetimeValue: 112000.75,
    lastOrderDate: '2024-05-28T09:30:00Z',
    joinDate: '2022-11-01T10:00:00Z'
  }
];

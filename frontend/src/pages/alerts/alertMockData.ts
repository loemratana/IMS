
export interface AlertRule {
  id: string;
  name: string;
  description: string;
  conditionType: 'THRESHOLD' | 'INACTIVITY' | 'EXPIRY';
  threshold: number;
  scope: 'ALL' | 'CATEGORY' | 'SPECIFIC';
  channels: ('EMAIL' | 'TELEGRAM' | 'IN_APP')[];
  isActive: boolean;
  lastTriggered?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL';
  channel: 'EMAIL' | 'TELEGRAM' | 'IN_APP';
  status: 'SENT' | 'FAILED' | 'PENDING';
  entityId?: string;
  entityName?: string;
  createdAt: string;
}

export const alertRulesMock: AlertRule[] = [
  {
    id: 'rule-1',
    name: 'Critical Stock Level',
    description: 'Triggered when any product stock drops below 5 units.',
    conditionType: 'THRESHOLD',
    threshold: 5,
    scope: 'ALL',
    channels: ['EMAIL', 'TELEGRAM', 'IN_APP'],
    isActive: true,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'rule-2',
    name: 'Low Stock Warning',
    description: 'General warning for products below 20 units.',
    conditionType: 'THRESHOLD',
    threshold: 20,
    scope: 'ALL',
    channels: ['IN_APP'],
    isActive: true,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
  },
  {
    id: 'rule-3',
    name: 'GPU Inventory Alert',
    description: 'Specific monitoring for high-value GPU stock.',
    conditionType: 'THRESHOLD',
    threshold: 2,
    scope: 'SPECIFIC',
    channels: ['EMAIL', 'TELEGRAM'],
    isActive: false
  }
];

export const notificationsMock: Notification[] = [
  {
    id: 'notif-1',
    title: 'Critical Stock: High-Performance GPU',
    message: 'Stock level for High-Performance GPU has dropped to 2 units (Threshold: 5).',
    type: 'CRITICAL',
    channel: 'TELEGRAM',
    status: 'SENT',
    entityId: 'PRD-7241',
    entityName: 'High-Performance GPU',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'notif-2',
    title: 'Low Stock: Wireless Mouse',
    message: 'Wireless Mouse stock is at 12 units (Threshold: 20).',
    type: 'WARNING',
    channel: 'IN_APP',
    status: 'SENT',
    entityId: 'PRD-1120',
    entityName: 'Wireless Mouse',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'notif-3',
    title: 'Daily Summary Sent',
    message: 'The daily inventory summary has been successfully mailed to admin@enterprise.com.',
    type: 'INFO',
    channel: 'EMAIL',
    status: 'SENT',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  },
  {
    id: 'notif-4',
    title: 'Connection Failed',
    message: 'Failed to send Telegram alert: Bot token invalid.',
    type: 'CRITICAL',
    channel: 'TELEGRAM',
    status: 'FAILED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

export const alertStatsMock = {
  activeRules: 8,
  lowStockAlerts: 14,
  criticalStockAlerts: 3,
  notificationsSent24h: 128
};

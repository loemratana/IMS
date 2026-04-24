import React from 'react';
import { Package, DollarSign, AlertTriangle, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from './types';

interface ProductStatsProps {
  total: number;
  stockValue: number;
  lowStock: number;
  outOfStock: number;
}

export function ProductStats({ total, stockValue, lowStock, outOfStock }: ProductStatsProps) {
  const stats = [
    { label: 'Total Products', value: total, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Stock Value', value: formatCurrency(stockValue), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Low Stock', value: lowStock, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Out of Stock', value: outOfStock, icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="border-border/50 shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`rounded-lg p-2 ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold leading-tight">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

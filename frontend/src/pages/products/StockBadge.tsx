import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Product } from './types';

export function StockBadge({ product }: { product: Product }) {
  if (product.quantity === 0)
    return (
      <Badge variant="secondary" className="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-none gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block" />
        Out of Stock
      </Badge>
    );
  if (product.isLowStock)
    return (
      <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-none gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
        Low Stock
      </Badge>
    );
  if (!product.isActive)
    return (
      <Badge variant="secondary" className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-none gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 inline-block" />
        Inactive
      </Badge>
    );
  return (
    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-none gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
      Active
    </Badge>
  );
}

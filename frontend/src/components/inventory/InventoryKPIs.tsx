
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  AlertTriangle,
  XCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface KPIProps {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  recentStockIn: number;
  totalValue: number;
}

const InventoryKPIs: React.FC<KPIProps> = ({
  totalItems,
  lowStockItems,
  outOfStockItems,
  recentStockIn,
  totalValue
}) => {
  const kpis = [
    {
      label: 'Total Stock Items',
      value: totalItems,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10'
    },
    {
      label: 'Low Stock Items',
      value: lowStockItems,
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10'
    },
    {
      label: 'Out of Stock',
      value: outOfStockItems,
      icon: XCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-900/30'
    },
    {
      label: 'Recent Stock In',
      value: `+${recentStockIn}`,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10'
    },
    {
      label: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-200/40 dark:bg-slate-800/40'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="border-border/50 shadow-none bg-card transition-colors transition-shadow">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                {kpi.label}
              </p>
              <h3 className="text-lg font-bold text-foreground leading-none">
                {kpi.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InventoryKPIs;

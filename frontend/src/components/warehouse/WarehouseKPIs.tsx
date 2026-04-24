
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle2, DollarSign, AlertTriangle } from 'lucide-react';

interface WarehouseKPIsProps {
  totalWarehouses: number;
  activeWarehouses: number;
  totalStockValue: number;
  lowStockAlerts: number;
}

const WarehouseKPIs: React.FC<WarehouseKPIsProps> = ({
  totalWarehouses,
  activeWarehouses,
  totalStockValue,
  lowStockAlerts
}) => {
  const kpis = [
    {
      label: 'Total Warehouses',
      value: totalWarehouses,
      icon: Building2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10'
    },
    {
      label: 'Active Warehouses',
      value: activeWarehouses,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10'
    },
    {
      label: 'Total Stock Value',
      value: `$${totalStockValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-500/10'
    },
    {
      label: 'Low Stock Alerts',
      value: lowStockAlerts,
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="border-border/50 shadow-none bg-card transition-colors">
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

export default WarehouseKPIs;

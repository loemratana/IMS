import { Boxes, DollarSign, Package, AlertTriangle } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { InventoryPie } from "@/components/dashboard/InventoryPie";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-accent uppercase tracking-wider">Overview</p>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1">
            Welcome back, Alex 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening across your inventory today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          <Button size="sm" className="h-9 bg-gradient-accent text-accent-foreground hover:opacity-90 shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Add product
          </Button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Products" value="2,847" delta={12.4} icon={Package} accent="violet" />
        <KpiCard label="Total Stock Value" value="$1.24M" delta={8.2} icon={DollarSign} accent="emerald" />
        <KpiCard label="Low Stock Items" value="38" delta={-4.1} icon={AlertTriangle} accent="amber" />
        <KpiCard label="Total Sales" value="$94,210" delta={23.6} icon={Boxes} accent="blue" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SalesChart />
        <InventoryPie />
      </div>

      {/* Activity */}
      <div className="grid grid-cols-1 gap-4">
        <RecentActivity />
      </div>
    </div>
  );
}

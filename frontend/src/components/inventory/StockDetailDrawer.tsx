
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Warehouse, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  PackageSearch,
  ArrowRightLeft
} from 'lucide-react';
import { InventoryItem, mockMovements } from '@/pages/inventory/mockData';
import StockHistoryTimeline from './StockHistoryTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  item: any | null; // Using any for now to facilitate real data
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (action: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER') => void;
}

const StockDetailDrawer: React.FC<Props> = ({ item, open, onOpenChange, onAction }) => {
  if (!item) return null;

  // Extract from real data structure
  const product = item.product;
  const warehouse = item.warehouse;
  const metrics = item.metrics;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-xl w-full p-0 flex flex-col h-full bg-background border-l-slate-200 dark:border-l-slate-800 transition-colors">
        <SheetHeader className="p-6 border-b border-slate-100 dark:border-b-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-4 mb-2">
            <div className="h-16 w-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-card p-1 transition-colors">
              <img src={product.image} className="w-full h-full object-cover rounded-lg" alt="" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-bold text-foreground truncate">{product.name}</SheetTitle>
              <p className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{product.sku}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {product.category && (
              <Badge variant="outline" className="bg-background border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                <Package className="h-3 w-3 mr-1" />
                {typeof product.category === 'string' ? product.category : product.category.name}
              </Badge>
            )}
            <Badge variant="outline" className="bg-background border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              <Warehouse className="h-3 w-3 mr-1" />
              {typeof warehouse === 'string' ? warehouse : warehouse.name}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center transition-colors">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Total Quantity</p>
                <p className="text-2xl font-black text-foreground">{item.quantity}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center transition-colors">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Total Value</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${metrics?.totalValue?.toLocaleString() || '0'}</p>
              </div>
            </div>

            <Tabs defaultValue="history" className="w-full">
              <TabsList className="w-full grid grid-cols-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-6">
                <TabsTrigger value="history" className="rounded-lg font-bold py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">Movement History</TabsTrigger>
                <TabsTrigger value="details" className="rounded-lg font-bold py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">Info & Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="mt-0">
                <StockHistoryTimeline movements={mockMovements.filter(m => m.productId === item.productId)} />
                <p className="text-xs text-center text-muted-foreground mt-4 italic">Movement API integration pending</p>
              </TabsContent>

              <TabsContent value="details" className="mt-0 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/50">
                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Last Updated
                    </div>
                    <span className="text-sm font-semibold text-foreground">{new Date(item.updatedAt || item.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/50 text-rose-500 dark:text-rose-400">
                    <div className="flex items-center text-sm">
                      <PackageSearch className="h-4 w-4 mr-2" />
                      Min. Threshold
                    </div>
                    <span className="text-sm font-black">{item.minStock} items</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 grid grid-cols-3 gap-3">
          <Button variant="outline" className="flex-1 gap-2 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 h-12 rounded-xl" onClick={() => onAction('IN')}>
            <ArrowUpRight className="h-4 w-4" />
            In
          </Button>
          <Button variant="outline" className="flex-1 gap-2 border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/40 h-12 rounded-xl" onClick={() => onAction('OUT')}>
            <ArrowDownRight className="h-4 w-4" />
            Out
          </Button>
          <Button variant="outline" className="flex-1 gap-2 border-slate-200 dark:border-slate-800 h-12 rounded-xl dark:bg-slate-900/50 dark:hover:bg-slate-800" onClick={() => onAction('TRANSFER')}>
            <ArrowRightLeft className="h-4 w-4" />
            Transfer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StockDetailDrawer;

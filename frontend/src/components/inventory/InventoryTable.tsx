import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  History,
  ArrowUpRight,
  ArrowDownRight,
  PackageSearch,
  Loader2,
  Box,
  ArrowRightLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RealInventoryItem {
  id: string;
  quantity: number;
  minStock: number;
  product: {
    name: string;
    sku: string;
    image: string;
    price: number;
    category?: { name: string };
  };
  warehouse: {
    name: string;
  };
  metrics: {
    totalValue: number;
    stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  };
}

interface Props {
  data: RealInventoryItem[];
  isLoading?: boolean;
  onSelectItem: (item: any) => void;
  onAction: (action: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER', item: any) => void;
}

const InventoryTable: React.FC<Props> = ({ data, isLoading, onSelectItem, onAction }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return (
          <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-50 shadow-none font-medium text-[10px] uppercase tracking-tight py-0">
            In Stock
          </Badge>
        );
      case 'LOW_STOCK':
        return (
          <Badge className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50 hover:bg-amber-50 shadow-none font-medium text-[10px] uppercase tracking-tight py-0">
            Low Stock
          </Badge>
        );
      case 'OUT_OF_STOCK':
        return (
          <Badge className="bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/50 hover:bg-rose-50 shadow-none font-medium text-[10px] uppercase tracking-tight py-0">
            Out of Stock
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
        <p className="text-sm font-medium">Loading inventory data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Box className="h-10 w-10 opacity-10" />
        <p className="text-sm">No inventory records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30 dark:bg-blue-500/10">
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="w-[300px] text-muted-foreground font-semibold py-4">Product Info</TableHead>
            <TableHead className="text-muted-foreground font-semibold py-4 text-center">Warehouse</TableHead>
            <TableHead className="text-muted-foreground font-semibold py-4 text-center">Stock Level</TableHead>
            <TableHead className="text-muted-foreground font-semibold py-4 text-center">Total Value</TableHead>
            <TableHead className="text-muted-foreground font-semibold py-4 text-center">Status</TableHead>
            <TableHead className="w-[100px] text-right pr-6 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-muted/30 transition-colors border-border/30"
              onClick={() => onSelectItem(item)}
            >
              <TableCell className="py-4">
                <div className="flex items-center space-x-3 pl-2">
                  <div className="h-12 w-12 rounded-lg border border-border/40 overflow-hidden bg-muted/20 flex-shrink-0 flex items-center justify-center">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Box className="h-6 w-6 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-foreground truncate">
                      {item.product.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tighter">
                        {item.product.sku}
                      </span>
                      {item.product.category && (
                        <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border/50">
                          {item.product.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-center py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {item.warehouse.name}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-center py-4">
                <div className="flex flex-col items-center">
                  <div className={`text-base font-bold ${item.quantity <= item.minStock ? 'text-rose-500' : 'text-foreground'}`}>
                    {item.quantity}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    min limit: {item.minStock}
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-center py-4">
                <span className="font-semibold text-sm">
                  ${item.metrics?.totalValue ? item.metrics.totalValue.toLocaleString() : '0.00'}
                </span>
              </TableCell>

              <TableCell className="text-center py-4">
                {getStatusBadge(item.metrics?.stockStatus)}
              </TableCell>

              <TableCell className="text-right py-4 pr-6" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-foreground">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-1 border-slate-200 dark:border-slate-800">
                    <DropdownMenuItem className="gap-2 py-2 rounded-lg cursor-pointer" onClick={() => onAction('IN', item)}>
                      <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                      Stock In (Receive)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 py-2 rounded-lg cursor-pointer" onClick={() => onAction('OUT', item)}>
                      <ArrowDownRight className="h-4 w-4 text-rose-600" />
                      Stock Out (Issue)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 py-2 rounded-lg cursor-pointer" onClick={() => onAction('TRANSFER', item)}>
                      <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                      Transfer Between
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 py-2 rounded-lg cursor-pointer" onClick={() => onAction('ADJUST', item)}>
                      <PackageSearch className="h-4 w-4 text-amber-600" />
                      Manual Adjustment
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 py-2 rounded-lg cursor-pointer" onClick={() => onSelectItem(item)}>
                      <History className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      View Full History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;

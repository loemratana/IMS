
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
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, MapPin, User, Phone, Package, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  contactPerson: string;
  phone: string;
  totalStockValue: number;
  stockCount: number;
  capacityUsage: number;
  isActive: boolean;
}

interface WarehouseTableProps {
  data: Warehouse[];
  onSelectItem: (item: Warehouse) => void;
  onAction: (type: 'EDIT' | 'DELETE' | 'VIEW', item: Warehouse) => void;
}

const WarehouseTable: React.FC<WarehouseTableProps> = ({ data, onSelectItem, onAction }) => {
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30 dark:bg-blue-500/10">
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="w-[280px] text-muted-foreground font-semibold py-4 pl-6">Warehouse Info</TableHead>
            <TableHead className="text-muted-foreground font-semibold py-4">Contact Info</TableHead>
            <TableHead className="text-muted-foreground font-semibold py-4 text-center">Stock Overview</TableHead>
            <TableHead className="text-muted-foreground font-semibold py-4">Capacity</TableHead>
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
              <TableCell className="py-4 pl-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm leading-tight">{item.name}</p>
                    <div className="flex items-center mt-1 text-[11px] text-muted-foreground uppercase tracking-wider space-x-2">
                       <span className="font-bold">{item.code}</span>
                       <span>•</span>
                       <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {item.location}</span>
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium flex items-center"><User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" /> {item.contactPerson}</p>
                  <p className="text-xs text-muted-foreground flex items-center"><Phone className="h-3.5 w-3.5 mr-1.5" /> {item.phone}</p>
                </div>
              </TableCell>

              <TableCell className="py-4 text-center">
                <div className="flex flex-col items-center">
                  <p className="text-sm font-bold flex items-center gap-1">
                    <Package className="h-3.5 w-3.5 text-indigo-500" />
                    {(item.stockCount || 0).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    ${(item.totalStockValue || 0).toLocaleString()}
                  </p>
                </div>
              </TableCell>

              <TableCell className="py-4">
                <div className="w-[120px] space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>{item.capacityUsage || 0}%</span>
                    <span className="text-muted-foreground uppercase font-black tracking-tighter">Full</span>
                  </div>
                  <Progress 
                    value={item.capacityUsage || 0} 
                    className="h-1.5" 
                    indicatorClassName={(item.capacityUsage || 0) > 85 ? "bg-rose-500" : (item.capacityUsage || 0) > 60 ? "bg-amber-500" : "bg-indigo-500"}
                  />
                </div>
              </TableCell>

              <TableCell className="py-4 text-center">
                {item.isActive ? (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-none font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-none font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5">
                    Inactive
                  </Badge>
                )}
              </TableCell>

              <TableCell className="py-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 rounded-full transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Warehouse Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onAction('VIEW', item)}>
                       View Stock View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction('EDIT', item)}>
                       Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-900/10" 
                      onClick={() => onAction('DELETE', item)}
                    >
                       Delete Warehouse
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

export default WarehouseTable;

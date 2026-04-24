
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw } from 'lucide-react';

const InventoryFilters: React.FC = () => {
  return (
    <div className="p-4 border-b dark:border-border/10 bg-muted/5 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by Product Name or SKU..." 
            className="pl-9 bg-muted/20 dark:bg-muted/10 border-border/40 focus:border-primary/50 transition-all shadow-none"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:flex lg:items-center">
          <Select>
            <SelectTrigger className="w-full lg:w-[140px] bg-background border-input shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="normal">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full lg:w-[160px] bg-background border-input shadow-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="computing">Computing</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full lg:w-[160px] bg-background border-input shadow-sm">
              <SelectValue placeholder="Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="main">Main Warehouse</SelectItem>
              <SelectItem value="east">East Hub</SelectItem>
              <SelectItem value="west">West Hub</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="lg:w-auto gap-2 border-border/50 dark:bg-muted/10 shadow-none text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;

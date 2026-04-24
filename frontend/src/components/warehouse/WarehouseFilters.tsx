
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
import { Search, RotateCcw, MapPin, Activity } from 'lucide-react';

interface WarehouseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  onReset: () => void;
}

const WarehouseFilters: React.FC<WarehouseFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  location,
  onLocationChange,
  onReset
}) => {
  return (
    <div className="p-4 border-b dark:border-border/10 bg-muted/5 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or code..." 
            className="pl-9 bg-muted/20 dark:bg-muted/10 border-border/40 focus:border-primary/40 transition-all shadow-none"
          />
        </div>
        
        <div className="grid grid-cols-2 lg:flex lg:items-center gap-2">
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full lg:w-[150px] bg-background border-input shadow-sm">
              <Activity className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={onLocationChange}>
            <SelectTrigger className="w-full lg:w-[180px] bg-background border-input shadow-sm">
              <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Phnom Penh">Phnom Penh</SelectItem>
              <SelectItem value="Siem Reap">Siem Reap</SelectItem>
              <SelectItem value="Kampot">Kampot</SelectItem>
              <SelectItem value="Sihanoukville">Sihanoukville</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={onReset}
            className="lg:w-auto gap-2 border-border/50 dark:bg-muted/10 shadow-none text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseFilters;

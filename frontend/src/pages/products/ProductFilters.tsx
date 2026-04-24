import React from 'react';
import {
  Search, X, Layers, Tag, SlidersHorizontal,
  RefreshCw, BarChart2, Download, Trash2
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { formatCurrency } from './types';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (val: [number, number]) => void;
  categories: any[];
  showFilters: boolean;
  onToggleFilters: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  colVisibility: Record<string, boolean>;
  onColVisibilityChange: (key: string, val: boolean) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onExport: () => void;
  isBulkDeleting: boolean;
}

export function ProductFilters({
  search, onSearchChange, categoryFilter, onCategoryChange,
  statusFilter, onStatusChange, priceRange, onPriceRangeChange,
  categories, showFilters, onToggleFilters, onRefresh, isFetching,
  colVisibility, onColVisibilityChange, selectedCount, onBulkDelete,
  onExport, isBulkDeleting
}: ProductFiltersProps) {

  return (
    <div className="p-4 border-b border-border/40 space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name or SKU…"
            className="pl-9"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button onClick={() => onSearchChange('')} className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={categoryFilter || 'all'} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-9 w-[150px]">
              <Layers className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c: any) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter || 'all'} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 w-[145px]">
              <Tag className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            size="sm"
            className="h-9 gap-1.5"
            onClick={onToggleFilters}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {showFilters && <X className="h-3 w-3" />}
          </Button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onRefresh} disabled={isFetching}>
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <BarChart2 className="h-3.5 w-3.5" /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(colVisibility).map(([key, visible]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={visible}
                  onCheckedChange={(val) => onColVisibilityChange(key, val)}
                  className="capitalize"
                >
                  {key}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Advanced filters panel */}
      {showFilters && (
        <div className="pt-2 pb-1 border-t border-border/30 space-y-3">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="flex-1 space-y-2 min-w-[200px]">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Price Range</span>
                <span>{formatCurrency(priceRange[0])} – {formatCurrency(priceRange[1])}</span>
              </div>
              <Slider
                min={0} max={10000} step={50}
                value={priceRange}
                onValueChange={(v) => onPriceRangeChange(v as [number, number])}
                className="w-full"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground"
              onClick={() => { onPriceRangeChange([0, 10000]); onCategoryChange('all'); onStatusChange('all'); onSearchChange(''); }}>
              <X className="h-3 w-3 mr-1" /> Reset all
            </Button>
          </div>
        </div>
      )}

      {/* Bulk actions */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 py-1.5 px-3 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-sm font-medium text-primary">{selectedCount} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onExport}>
              <Download className="h-3 w-3" /> Export
            </Button>
            <Button
              variant="destructive" size="sm" className="h-7 text-xs gap-1"
              onClick={onBulkDelete}
              disabled={isBulkDeleting}
            >
              <Trash2 className="h-3 w-3" />
              {isBulkDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

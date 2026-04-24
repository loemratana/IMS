import React from 'react';
import {
  MoreHorizontal, Eye, Edit2, Trash2, ChevronUp,
  ChevronDown, ChevronsUpDown, Package, Plus,
  Image as ImageIcon
} from 'lucide-react';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Product, SortField, SortOrder, formatCurrency } from './types';
import { StockBadge } from './StockBadge';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  selectedIds: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  colVisibility: Record<string, boolean>;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  page: number;
  pagination?: {
    total: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
  limit: number;
  openCreate: () => void;
}

export function ProductTable({
  products, isLoading, selectedIds, onToggleOne, onToggleAll,
  allSelected, colVisibility, sortBy, sortOrder, onSort,
  onView, onEdit, onDelete, onPageChange, page, pagination, limit, openCreate
}: ProductTableProps) {

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <ChevronsUpDown className="h-3.5 w-3.5 ml-1 opacity-40" />;
    return sortOrder === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5 ml-1 text-primary" />
      : <ChevronDown className="h-3.5 w-3.5 ml-1 text-primary" />;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30 dark:bg-muted/10">
            <TableRow className="hover:bg-transparent border-border/40 dark:border-border/10">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleAll}
                />
              </TableHead>
              {colVisibility.image && <TableHead className="w-[60px]">Image</TableHead>}
              {colVisibility.name && (
                <TableHead className="min-w-[180px]">
                  <button className="flex items-center font-semibold hover:text-foreground" onClick={() => onSort('name')}>
                    Name <SortIcon field="name" />
                  </button>
                </TableHead>
              )}
              {colVisibility.sku && <TableHead className="hidden sm:table-cell">SKU</TableHead>}
              {colVisibility.category && <TableHead className="hidden md:table-cell">Category</TableHead>}
              {colVisibility.price && (
                <TableHead className="hidden sm:table-cell">
                  <button className="flex items-center font-semibold hover:text-foreground" onClick={() => onSort('price')}>
                    Price <SortIcon field="price" />
                  </button>
                </TableHead>
              )}
              {colVisibility.stock && (
                <TableHead className="hidden md:table-cell">
                  <button className="flex items-center font-semibold hover:text-foreground" onClick={() => onSort('quantity')}>
                    Stock <SortIcon field="quantity" />
                  </button>
                </TableHead>
              )}
              {colVisibility.status && <TableHead className="w-[130px]">Status</TableHead>}
              {colVisibility.created && (
                <TableHead className="hidden lg:table-cell">
                  <button className="flex items-center font-semibold hover:text-foreground" onClick={() => onSort('createdAt')}>
                    Created <SortIcon field="createdAt" />
                  </button>
                </TableHead>
              )}
              <TableHead className="w-[60px] text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-border/30">
                  <TableCell className="pl-4"><Skeleton className="h-4 w-4 rounded" /></TableCell>
                  {colVisibility.image && <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>}
                  {colVisibility.name && <TableCell><Skeleton className="h-4 w-36 rounded" /></TableCell>}
                  {colVisibility.sku && <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20 rounded" /></TableCell>}
                  {colVisibility.category && <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24 rounded" /></TableCell>}
                  {colVisibility.price && <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-16 rounded" /></TableCell>}
                  {colVisibility.stock && <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-12 rounded" /></TableCell>}
                  {colVisibility.status && <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>}
                  {colVisibility.created && <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24 rounded" /></TableCell>}
                  <TableCell className="pr-4"><Skeleton className="h-8 w-8 rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Package className="h-12 w-12 opacity-20" />
                    <p className="font-medium">No products found</p>
                    <p className="text-sm">Try adjusting your filters or create a new product.</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={openCreate}>
                      <Plus className="h-4 w-4 mr-1" /> Create Product
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className={`group border-border/30 dark:border-border/10 transition-colors cursor-pointer hover:bg-muted/30 dark:hover:bg-muted/10
                    ${selectedIds.has(product.id) ? 'bg-primary/5 dark:bg-primary/10 hover:bg-primary/8' : ''}
                    ${product.isLowStock ? 'border-l-4 border-l-amber-400' : ''}
                    ${product.quantity === 0 ? 'border-l-4 border-l-rose-400' : ''}
                  `}
                  onClick={() => onView(product)}
                >
                  <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onCheckedChange={() => onToggleOne(product.id)}
                    />
                  </TableCell>

                  {colVisibility.image && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="h-10 w-10 rounded-md bg-muted/40 border border-border/40 overflow-hidden flex items-center justify-center">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                        )}
                      </div>
                    </TableCell>
                  )}

                  {colVisibility.name && (
                    <TableCell>
                      <div className="font-semibold text-sm leading-tight">{product.name}</div>
                      {product.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{product.description}</div>
                      )}
                    </TableCell>
                  )}

                  {colVisibility.sku && (
                    <TableCell className="hidden sm:table-cell">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{product.sku}</code>
                    </TableCell>
                  )}

                  {colVisibility.category && (
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {product.category?.name || <span className="italic opacity-50">—</span>}
                    </TableCell>
                  )}

                  {colVisibility.price && (
                    <TableCell className="hidden sm:table-cell text-sm font-medium">
                      {formatCurrency(product.price)}
                    </TableCell>
                  )}

                  {colVisibility.stock && (
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-semibold ${product.quantity === 0 ? 'text-rose-500' : product.isLowStock ? 'text-amber-600' : ''}`}>
                          {product.quantity}
                        </span>
                        <span className="text-xs text-muted-foreground">/ {product.minStock} min</span>
                      </div>
                    </TableCell>
                  )}

                  {colVisibility.status && (
                    <TableCell><StockBadge product={product} /></TableCell>
                  )}

                  {colVisibility.created && (
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                  )}

                  <TableCell className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onView(product)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8" onClick={() => onPageChange(page - 1)} disabled={!pagination.hasPrevPage}>
              Previous
            </Button>
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = i + 1;
                return (
                  <Button key={p} size="sm" variant={page === p ? 'default' : 'ghost'}
                    className="h-8 w-8 p-0 text-xs" onClick={() => onPageChange(p)}>
                    {p}
                  </Button>
                );
              })}
            </div>
            <Button variant="outline" size="sm" className="h-8" onClick={() => onPageChange(page + 1)} disabled={!pagination.hasNextPage}>
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import productService from '@/services/productService';
import categoryService from '@/services/categoryService';

import {
  Product, SortField, SortOrder, SheetMode, ProductFormValues
} from './types';
import { ProductStats } from './ProductStats';
import { ProductFilters } from './ProductFilters';
import { ProductTable } from './ProductTable';
import { ProductSheet } from './ProductSheet';

const ProductsPage = () => {
  const queryClient = useQueryClient();

  // ── Filters & Pagination state ──
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  // ── Selection & UI state ──
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Column visibility
  const [colVisibility, setColVisibility] = useState<Record<string, boolean>>({
    image: true, name: true, sku: true, category: true,
    price: true, stock: true, status: true, created: true,
  });

  // ── Queries ──
  const { data: productsResponse, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['products', { page, search, categoryFilter, statusFilter, sortBy, sortOrder }],
    queryFn: () => productService.getAllProducts({
      page,
      limit: LIMIT,
      search: search || undefined,
      category_id: categoryFilter || undefined,
      is_active: statusFilter === 'active' ? 'true' : statusFilter === 'inactive' ? 'false' : undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    }),
    placeholderData: (prev) => prev,
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories(),
  });

  const products: Product[] = useMemo(() => {
    const raw = productsResponse?.data ?? [];
    return raw.filter((p: Product) => {
      const inPriceRange = p.price >= priceRange[0] && p.price <= priceRange[1];
      const stockOk = statusFilter === 'low-stock' ? p.isLowStock
        : statusFilter === 'out-of-stock' ? p.quantity === 0
          : true;
      return inPriceRange && stockOk;
    });
  }, [productsResponse, priceRange, statusFilter]);

  const pagination = productsResponse?.pagination;
  const summary = productsResponse?.summary;
  const categories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];

  // ── Mutations ──
  const createMutation = useMutation({
    mutationFn: (data: ProductFormValues) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
      setSheetMode(null);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create product'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormValues }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
      setSheetMode(null);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
      setDeletingId(null);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to delete product'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => productService.deleteProduct(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`${selectedIds.size} product(s) deleted`);
      setSelectedIds(new Set());
    },
  });

  // ── Event Handlers ──
  const openCreate = () => {
    setActiveProduct(null);
    setSheetMode('create');
  };

  const handleEdit = (product: Product) => {
    setActiveProduct(product);
    setSheetMode('edit');
  };

  const handleView = (product: Product) => {
    setActiveProduct(product);
    setSheetMode('view');
  };

  const handleSubmit = (values: ProductFormValues) => {
    const data = {
      ...values,
      category_id: values.category_id === 'none' ? undefined : values.category_id,
      supplier_id: values.supplier_id === 'none' ? undefined : values.supplier_id,
    };

    if (sheetMode === 'edit' && activeProduct) {
      updateMutation.mutate({ id: activeProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
    setPage(1);
  };

  const exportCSV = useCallback(() => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'];
    const rows = products.map((p) => [
      p.id, p.name, p.sku, p.category?.name || '', p.price, p.quantity,
      p.quantity === 0 ? 'Out of Stock' : p.isLowStock ? 'Low Stock' : p.isActive ? 'Active' : 'Inactive',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'products.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Products exported');
  }, [products]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your product catalog, pricing, and inventory levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="h-9 gap-1.5">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button onClick={openCreate} className="h-9 gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" /> Create Product
          </Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <ProductStats
        total={pagination?.total ?? 0}
        stockValue={summary?.totalStockValue ?? 0}
        lowStock={summary?.lowStockCount ?? 0}
        outOfStock={products.filter(p => p.quantity === 0).length}
      />

      <Card className="border-border/50 shadow-none overflow-hidden">
        {/* ── Filters ── */}
        <ProductFilters
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          categoryFilter={categoryFilter}
          onCategoryChange={(v) => { setCategoryFilter(v === 'all' ? '' : v); setPage(1); }}
          statusFilter={statusFilter}
          onStatusChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          categories={categories}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRefresh={() => refetch()}
          isFetching={isFetching}
          colVisibility={colVisibility}
          onColVisibilityChange={(key, val) => setColVisibility(prev => ({ ...prev, [key]: val }))}
          selectedCount={selectedIds.size}
          onBulkDelete={() => bulkDeleteMutation.mutate([...selectedIds])}
          onExport={exportCSV}
          isBulkDeleting={bulkDeleteMutation.isPending}
        />

        {/* ── Table ── */}
        <ProductTable
          products={products}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onToggleOne={(id) => {
            const next = new Set(selectedIds);
            next.has(id) ? next.delete(id) : next.add(id);
            setSelectedIds(next);
          }}
          onToggleAll={() => {
            if (products.length > 0 && selectedIds.size === products.length) setSelectedIds(new Set());
            else setSelectedIds(new Set(products.map(p => p.id)));
          }}
          allSelected={products.length > 0 && selectedIds.size === products.length}
          colVisibility={colVisibility}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={(id: string) => setDeletingId(id)}
          onPageChange={setPage}
          page={page}
          pagination={pagination}
          limit={LIMIT}
          openCreate={openCreate}
        />
      </Card>

      {/* ── Details Sheet ── */}
      <ProductSheet
        mode={sheetMode}
        onClose={() => setSheetMode(null)}
        product={activeProduct}
        onEdit={handleEdit}
        onDelete={(id: string) => setDeletingId(id)}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* ── Delete Confirm ── */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the product as inactive. It can be reactivated later by editing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingId !== null && deleteMutation.mutate(deletingId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsPage;

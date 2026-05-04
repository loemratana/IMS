import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Edit2, Trash2, ImageIcon, DollarSign, ShoppingCart,
  AlertTriangle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { auditMockData } from '../audit/auditMockData';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { AuditLogDetailDrawer } from '@/components/audit/AuditLogDetailDrawer';
import { History } from 'lucide-react';

import {
  Product, SheetMode, ProductFormValues, productSchema,
  generateSKU, formatCurrency
} from './types';
import { StockBadge } from './StockBadge';
import { CategorySelect } from './CategorySelect';

interface ProductSheetProps {
  mode: SheetMode;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onSubmit: (values: ProductFormValues) => void;
  isPending: boolean;
}

export function ProductSheet({
  mode, onClose, product, onEdit, onDelete, onSubmit, isPending
}: ProductSheetProps) {

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '', description: '', category_id: 'none', supplier_id: 'none',
      price: 0, min_stock: 5, sku: '', image_url: '', is_active: true,
    },
  });

  const watchedName = form.watch('name');

  const [selectedLog, setSelectedLog] = React.useState<any>(null);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = React.useState(false);

  // Reset form when mode or product changes
  useEffect(() => {
    if ((mode === 'create')) {
      form.reset({ name: '', description: '', category_id: 'none', supplier_id: 'none', price: 0, min_stock: 5, sku: '', image_url: '', is_active: true });
    } else if (mode === 'edit' && product) {
      form.reset({
        name: product.name,
        description: product.description || '',
        category_id: product.category?.id?.toString() || 'none',
        supplier_id: product.supplier?.id?.toString() || 'none',
        price: product.price,
        min_stock: product.minStock,
        sku: product.sku,
        image_url: product.imageUrl || '',
        is_active: product.isActive,
      });
    }
  }, [mode, product, form]);

  return (
    <Sheet open={mode !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {mode === 'create' ? 'Create Product'
              : mode === 'edit' ? 'Edit Product'
                : product?.name}
          </SheetTitle>
          <SheetDescription>
            {mode === 'create' ? 'Add a new product to your catalog.'
              : mode === 'edit' ? 'Update product details below.'
                : 'Product details and stock information.'}
          </SheetDescription>
        </SheetHeader>

        {/* ── View Mode ── */}
        {mode === 'view' && product && (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="details" className="font-bold">Details</TabsTrigger>
              <TabsTrigger value="activity" className="font-bold flex items-center gap-2">
                <History className="h-3.5 w-3.5" /> Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 m-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="w-full h-48 rounded-xl bg-muted/40 border border-border/40 overflow-hidden flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Price', value: formatCurrency(product.price), icon: DollarSign },
                  { label: 'In Stock', value: product.quantity, icon: ShoppingCart },
                  { label: 'Min Stock', value: product.minStock, icon: AlertTriangle },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-lg border border-border/40 p-3 text-center">
                    <Icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-lg font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                {[
                  { label: 'SKU', value: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{product.sku}</code> },
                  { label: 'Category', value: product.category?.name || '—' },
                  { label: 'Supplier', value: product.supplier?.name || '—' },
                  { label: 'Stock Value', value: formatCurrency(product.stockValue) },
                  { label: 'Status', value: <StockBadge product={product} /> },
                  { label: 'Created', value: new Date(product.createdAt).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-1.5 border-b border-border/20 last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {product.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => onEdit(product)}>
                  <Edit2 className="h-4 w-4 mr-1.5" /> Edit
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="m-0 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">Recent Activity</h4>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                    {auditMockData.filter(l => l.entity === 'PRODUCT' && l.entityId === product.sku).length} Events
                  </Badge>
                </div>
                <div className="-mx-1">
                  <AuditLogTable 
                    logs={auditMockData.filter(l => l.entity === 'PRODUCT')} 
                    onViewDetails={(log) => {
                      setSelectedLog(log);
                      setIsLogDrawerOpen(true);
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <AuditLogDetailDrawer 
          log={selectedLog}
          open={isLogDrawerOpen}
          onOpenChange={setIsLogDrawerOpen}
        />

        {/* ── Create / Edit Form ── */}
        {(mode === 'create' || mode === 'edit') && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {form.watch('image_url') && (
                <div className="w-full h-36 rounded-xl overflow-hidden border border-border/40 bg-muted/30">
                  <img src={form.watch('image_url')} alt="Preview" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}

              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl><Input placeholder="e.g. Wireless Keyboard Pro" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Brief product description…" rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="sku" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>SKU</FormLabel>
                    <button type="button" className="text-xs text-primary hover:underline"
                      onClick={() => form.setValue('sku', generateSKU(watchedName || 'PRD'))}>
                      Auto-generate
                    </button>
                  </div>
                  <FormControl><Input placeholder="e.g. WKB-PRO-001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                        <Input type="number" min="0" step="0.01" className="pl-7" placeholder="0.00" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="min_stock" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Stock Alert</FormLabel>
                    <FormControl><Input type="number" min="0" placeholder="5" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <CategorySelect control={form.control} name="category_id" />

              <FormField control={form.control} name="image_url" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="is_active" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3">
                  <div>
                    <FormLabel className="text-sm font-medium">Active Status</FormLabel>
                    <p className="text-xs text-muted-foreground">Product will appear in listings</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}
                  disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1"
                  disabled={isPending}>
                  {isPending ? 'Saving…'
                    : mode === 'edit' ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}

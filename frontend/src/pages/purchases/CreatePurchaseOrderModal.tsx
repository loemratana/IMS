import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ShoppingCart, Calendar, MapPin, Building2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import purchaseService from '@/services/purchaseService';
import supplierService from '@/services/supplierService';
import warehouseService from '@/services/warehouseService';
import productService from '@/services/productService';
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePurchaseOrderModal({ open, onOpenChange }: Props) {
  const [items, setItems] = useState([{ id: Date.now(), productId: '', quantity: 1, unitPrice: 0 }]);
  const [supplierId, setSupplierId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();

  // Queries
  const { data: suppliersRes } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierService.getAllSuppliers(),
    enabled: open
  });

  const { data: warehousesRes } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehouseService.getAllWarehouses(),
    enabled: open
  });

  const { data: productsRes } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAllProducts(),
    enabled: open
  });

  const suppliers = suppliersRes?.data || [];
  const warehouses = warehousesRes?.data || [];
  const products = productsRes?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => purchaseService.createPurchaseOrder(data),
    onSuccess: () => {
      toast.success('Purchase Order created successfully!');
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create Purchase Order');
    }
  });

  const resetForm = () => {
    setItems([{ id: Date.now(), productId: '', quantity: 1, unitPrice: 0 }]);
    setSupplierId('');
    setWarehouseId('');
    setExpectedDate('');
    setNotes('');
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (field === 'productId') {
          const prod = products.find((p: any) => p.id === value);
          return { ...item, productId: value, unitPrice: prod ? parseFloat(prod.price) : 0 };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleSubmit = (status: 'DRAFT' | 'PENDING') => {
    if (!supplierId || !warehouseId) {
      toast.error("Please select a supplier and warehouse.");
      return;
    }
    if (items.some(i => !i.productId || i.quantity <= 0)) {
      toast.error("Please fill out all item details correctly.");
      return;
    }

    const payload = {
      supplierId,
      warehouseId,
      expectedDate: expectedDate || undefined,
      notes,
      items: items.map(({ productId, quantity, unitPrice }) => ({
        productId,
        quantity,
        price: unitPrice
      }))
    };

    createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-card border-border/50 rounded-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 border-b border-border/50 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">Create Purchase Order</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Fill in the details to generate a new PO.</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-8">
          {/* Left Column: Details */}
          <div className="lg:w-1/3 space-y-5">
            <h3 className="font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
              <Building2 className="h-4 w-4 text-muted-foreground" /> Order Details
            </h3>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Supplier</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger className="w-full h-11 bg-background border-border rounded-xl">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Destination Warehouse</Label>
              <Select value={warehouseId} onValueChange={setWarehouseId}>
                <SelectTrigger className="w-full h-11 bg-background border-border rounded-xl">
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w: any) => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Expected Delivery Date
              </Label>
              <Input 
                type="date" 
                className="h-11 bg-background border-border rounded-xl" 
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notes / Instructions</Label>
              <Textarea
                placeholder="Add any special instructions for the supplier..."
                className="resize-none h-24 bg-background border-border rounded-xl"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column: Items */}
          <div className="lg:w-2/3 flex flex-col space-y-4">
            <h3 className="font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" /> Order Items
            </h3>

            <div className="flex-1 border border-border/60 rounded-xl overflow-hidden bg-background">
              <div className="grid grid-cols-12 gap-2 p-3 bg-muted/40 border-b border-border/60 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-5 pl-2">Product</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>

              <div className="p-2 space-y-2">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Select value={item.productId} onValueChange={(val) => updateItem(item.id, 'productId', val)}>
                        <SelectTrigger className="h-10 border-border bg-card shadow-sm">
                          <SelectValue placeholder="Select product..." />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p: any) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        className="h-10 text-center border-border bg-card shadow-sm font-semibold"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="h-10 pl-7 text-right border-border bg-card shadow-sm font-semibold"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2 text-right font-bold text-foreground pr-2 flex items-center justify-end">
                      ${(item.quantity * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-border/60 bg-muted/10 flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={addItem} className="h-9 gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                  <Plus className="h-4 w-4" /> Add Line Item
                </Button>
              </div>
            </div>

            {/* Totals Box */}
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex flex-col items-end gap-1 mt-auto">
              <div className="flex justify-between w-full sm:w-64 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 text-sm">
                <span className="text-muted-foreground">Tax (0%)</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="h-px w-full sm:w-64 bg-border my-1"></div>
              <div className="flex justify-between w-full sm:w-64 text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-indigo-600">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

          </div>
        </div>

        <DialogFooter className="p-4 border-t border-border/50 bg-muted/20 shrink-0 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11 px-6 rounded-xl font-bold border-border/80 text-muted-foreground hover:text-foreground">
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              onClick={() => handleSubmit('DRAFT')} 
              className="h-11 px-6 rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm"
              disabled={createMutation.isPending}
            >
              Save Draft
            </Button>
            <Button 
              onClick={() => handleSubmit('PENDING')} 
              className="h-11 px-6 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Submit Order
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

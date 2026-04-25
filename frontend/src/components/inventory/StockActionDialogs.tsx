import React, { useState, useEffect } from 'react';
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
import { ArrowUpCircle, ArrowDownCircle, Settings2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import productService from '@/services/productService';
import warehouseService from '@/services/warehouseService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  item: any | null;
  type: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER' | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const StockActionDialogs: React.FC<Props> = ({ item, type, open, onOpenChange, onSubmit }) => {
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: '',
    reason: '',
    purchaseOrderNo: '',
    unitCost: '',
    notes: ''
  });
  
  const [productOpen, setProductOpen] = useState(false);

  // Fetch products and warehouses if no item is provided
  const { data: productsRes } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAllProducts({ limit: 100 }),
    enabled: !item && open
  });

  const { data: warehousesRes } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehouseService.getAllWarehouses(),
    enabled: !item && open
  });

  const products = productsRes?.data || [];
  const warehouses = warehousesRes?.data || [];

  // Reset form when dialog opens/closes or type changes
  useEffect(() => {
    if (open) {
      setFormData({
        productId: item ? (item.productId || item.id) : '',
        warehouseId: item ? item.warehouseId : '',
        quantity: '',
        reason: '',
        purchaseOrderNo: '',
        unitCost: '',
        notes: ''
      });
    }
  }, [open, type, item]);

  if (!type) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTitle = () => {
    switch (type) {
      case 'IN': return 'Add Stock (Receive)';
      case 'OUT': return 'Deduct Stock (Issue)';
      case 'ADJUST': return 'Manual Adjustment';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'IN': return <ArrowUpCircle className="h-6 w-6 text-emerald-600" />;
      case 'OUT': return <ArrowDownCircle className="h-6 w-6 text-rose-600" />;
      case 'ADJUST': return <Settings2 className="h-6 w-6 text-amber-600" />;
    }
  };

  const handleConfirm = () => {
    const payload = {
      productId: item ? (item.productId || item.id) : formData.productId,
      warehouseId: item ? item.warehouseId : formData.warehouseId,
      quantity: Number(formData.quantity),
      reason: formData.reason,
      purchaseOrderNo: formData.purchaseOrderNo,
      unitCost: formData.unitCost ? Number(formData.unitCost) : undefined,
      notes: formData.notes
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl bg-card border-slate-200 dark:border-slate-800 transition-colors max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-xl border ${type === 'IN' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800' :
              type === 'OUT' ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800' :
                'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800'
              }`}>
              {getIcon()}
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">{getTitle()}</DialogTitle>
          </div>
          {item && (
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                <span>Product</span>
                <span className="text-foreground font-bold">{item.product?.name || item.name}</span>
              </div>
            </div>
          )}
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!item && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold text-slate-700 dark:text-slate-300">Product</Label>
                <Popover open={productOpen} onOpenChange={setProductOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={productOpen}
                      className="h-11 rounded-xl bg-background border-slate-200 dark:border-slate-800 justify-between font-normal"
                    >
                      {formData.productId
                        ? products.find((p: any) => p.id === formData.productId)?.name
                        : "Select product..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 rounded-xl" align="start">
                    <Command>
                      <CommandInput placeholder="Search products..." />
                      <CommandList>
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup>
                          {products.map((p: any) => (
                            <CommandItem
                              key={p.id}
                              value={p.name}
                              onSelect={() => {
                                handleInputChange('productId', p.id);
                                setProductOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.productId === p.id ? "opacity-100 text-emerald-600" : "opacity-0"
                                )}
                              />
                              {p.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-slate-700 dark:text-slate-300">Warehouse</Label>
                <Select value={formData.warehouseId} onValueChange={(v) => handleInputChange('warehouseId', v)}>
                  <SelectTrigger className="h-11 rounded-xl bg-background border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Select warehouse..." />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w: any) => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="font-bold text-slate-700 dark:text-slate-300">Quantity</Label>
              <div className="relative">
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="0"
                  className="h-11 rounded-xl text-lg font-bold border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 pl-4 bg-background transition-colors"
                />
              </div>
            </div>

            {type === 'IN' && (
              <div className="grid gap-2">
                <Label htmlFor="unitCost" className="font-bold text-slate-700 dark:text-slate-300">Unit Cost ($)</Label>
                <div className="relative">
                  <Input
                    id="unitCost"
                    type="number"
                    value={formData.unitCost}
                    onChange={(e) => handleInputChange('unitCost', e.target.value)}
                    placeholder="0.00"
                    className="h-11 rounded-xl font-bold border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 pl-4 bg-background transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {type === 'IN' && (
            <div className="grid gap-2">
              <Label htmlFor="purchaseOrderNo" className="font-bold text-slate-700 dark:text-slate-300">Purchase Order #</Label>
              <Input
                id="purchaseOrderNo"
                value={formData.purchaseOrderNo}
                onChange={(e) => handleInputChange('purchaseOrderNo', e.target.value)}
                placeholder="PO-2024-XXXX"
                className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-background"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="reason" className="font-bold text-slate-700 dark:text-slate-300">Reference / Reason</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="e.g. Monthly restock, Sale, or Adjustment"
              className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-background"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="font-bold text-slate-700 dark:text-slate-300">Internal Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional details about this transaction..."
              className="min-h-[80px] rounded-xl border-slate-200 dark:border-slate-800 resize-none bg-background transition-colors"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-12 flex-1 rounded-xl border-slate-200 dark:border-slate-800 font-bold dark:bg-slate-900/50 dark:hover:bg-slate-800">
            Cancel
          </Button>
          <Button className={`h-12 flex-[2] rounded-xl font-bold px-6 shadow-sm transition-all ${type === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
            type === 'OUT' ? 'bg-rose-600 hover:bg-rose-700 text-white' :
              'bg-amber-600 hover:bg-amber-700 text-white'
            }`} onClick={handleConfirm}>
            Submit {type === 'IN' ? 'Stock In' : type === 'OUT' ? 'Stock Out' : 'Adjustment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockActionDialogs;

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
import { Plus, Trash2, ShoppingBag, CreditCard, MapPin, User, AlertTriangle } from 'lucide-react';
import { mockCustomers } from '../contacts/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSalesOrderModal({ open, onOpenChange }: Props) {
  const [items, setItems] = useState([{ id: 1, product: '', quantity: 1, unitPrice: 0, availableStock: 100 }]); // Mocked available stock
  const [customer, setCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', quantity: 1, unitPrice: 0, availableStock: Math.floor(Math.random() * 50) + 10 }]);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleSubmit = (action: 'DRAFT' | 'CONFIRM') => {
    if (!customer) {
      toast.error("Please select a customer.");
      return;
    }
    
    // Stock Validation
    const outOfStockItems = items.filter(i => i.quantity > i.availableStock);
    if (outOfStockItems.length > 0) {
      toast.error(`Cannot process order: ${outOfStockItems.length} item(s) exceed available stock.`);
      return;
    }

    if (items.some(i => !i.product || i.quantity <= 0)) {
      toast.error("Please fill out all item details correctly.");
      return;
    }
    
    toast.success(`Sales Order ${action === 'DRAFT' ? 'saved as draft' : 'confirmed'}!`);
    onOpenChange(false);
    setTimeout(() => {
      setItems([{ id: 1, product: '', quantity: 1, unitPrice: 0, availableStock: 100 }]);
      setCustomer('');
      setPaymentMethod('');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-card border-border/50 rounded-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 border-b border-border/50 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">Create Sales Order</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Generate a new sales order for a customer.</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-8">
          {/* Left Column: Details */}
          <div className="lg:w-1/3 space-y-5">
            <h3 className="font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
              <User className="h-4 w-4 text-muted-foreground" /> Customer Details
            </h3>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer</Label>
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger className="w-full h-11 bg-background border-border rounded-xl">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" /> Payment Method
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full h-11 bg-background border-border rounded-xl">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cc">Credit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="net30">Net 30</SelectItem>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Shipping Address
              </Label>
              <Textarea 
                placeholder="Enter shipping address..." 
                className="resize-none h-24 bg-background border-border rounded-xl"
                defaultValue={customer ? mockCustomers.find(c => c.id === customer)?.address : ''}
              />
            </div>
          </div>

          {/* Right Column: Items */}
          <div className="lg:w-2/3 flex flex-col space-y-4">
            <h3 className="font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" /> Order Items
            </h3>
            
            <div className="flex-1 border border-border/60 rounded-xl overflow-hidden bg-background">
              <div className="grid grid-cols-12 gap-2 p-3 bg-muted/40 border-b border-border/60 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-4 pl-2">Product</div>
                <div className="col-span-3 text-center">Stock / Qty</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="p-2 space-y-2">
                {items.map((item) => {
                  const isOutOfStock = item.quantity > item.availableStock;
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <Input 
                          placeholder="Product..." 
                          className="h-10 border-border bg-card shadow-sm"
                          value={item.product}
                          onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3 flex items-center gap-2">
                        <div className="flex-1 relative">
                          <Input 
                            type="number" 
                            min="1"
                            className={cn("h-10 text-center border-border bg-card shadow-sm font-semibold", isOutOfStock && "border-rose-300 text-rose-600 focus-visible:ring-rose-500")}
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                          />
                        </div>
                        <div className="text-[10px] text-muted-foreground font-bold flex flex-col items-center">
                          <span>/ {item.availableStock}</span>
                          {isOutOfStock && <AlertTriangle className="h-3 w-3 text-rose-500 mt-0.5" />}
                        </div>
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
                  )
                })}
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
            <Button variant="secondary" onClick={() => handleSubmit('DRAFT')} className="h-11 px-6 rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm">
              Save Draft
            </Button>
            <Button onClick={() => handleSubmit('CONFIRM')} className="h-11 px-6 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              Confirm Order
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

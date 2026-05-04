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
import { Truck, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import purchaseService from '@/services/purchaseService';
import { PurchaseOrder } from './mockData';
import { toast } from "sonner";

interface Props {
  po: any | null; // Using any for now to match backend response
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiveItemsModal({ po, open, onOpenChange }: Props) {
  const [receiveData, setReceiveData] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  const receiveMutation = useMutation({
    mutationFn: (items: { itemId: string, quantity: number }[]) => 
      purchaseService.receivePurchaseOrderItems(po.id, items),
    onSuccess: (res) => {
      toast.success(res.message || 'Items received successfully');
      queryClient.invalidateQueries({ queryKey: ['purchase', po.id] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to receive items');
    }
  });

  useEffect(() => {
    if (open && po) {
      // Initialize receive data with 0
      const initial: Record<string, number> = {};
      (po.items || []).forEach((item: any) => {
        const remaining = item.quantity - (item.receivedQuantity || 0);
        if (remaining > 0) {
          initial[item.id] = remaining; // default to receive all remaining
        }
      });
      setReceiveData(initial);
    }
  }, [open, po]);

  if (!po) return null;

  const handleQuantityChange = (id: string, val: string, max: number) => {
    const num = parseInt(val) || 0;
    if (num < 0) return;
    if (num > max) {
      toast.error(`Cannot receive more than remaining ordered quantity (${max})`);
      setReceiveData(prev => ({ ...prev, [id]: max }));
      return;
    }
    setReceiveData(prev => ({ ...prev, [id]: num }));
  };

  const handleConfirm = () => {
    const itemsToReceive = Object.entries(receiveData)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }));

    if (itemsToReceive.length === 0) {
      toast.error("Please enter quantity to receive.");
      return;
    }
    
    receiveMutation.mutate(itemsToReceive);
  };

  const pendingItems = (po.items || []).filter((i: any) => i.quantity > (i.receivedQuantity || 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-2xl p-0 overflow-hidden bg-card border-border/50">
        <DialogHeader className="p-6 border-b border-border/50 bg-indigo-50/50 dark:bg-indigo-900/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                Receive Items
                <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md dark:bg-indigo-900 dark:text-indigo-300">{po.poNumber}</span>
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Record incoming stock for this purchase order.</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {pendingItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3" />
              <h3 className="text-lg font-bold text-foreground">All items received</h3>
              <p className="text-muted-foreground mt-1">This purchase order has been fully received.</p>
            </div>
          ) : (
            <div className="border border-border/60 rounded-xl overflow-hidden bg-background">
              <div className="grid grid-cols-12 gap-4 p-3 bg-muted/40 border-b border-border/60 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-5 pl-2">Product</div>
                <div className="col-span-2 text-center">Ordered</div>
                <div className="col-span-2 text-center">Pending</div>
                <div className="col-span-3 text-right pr-2">Receive Qty</div>
              </div>
              
              <div className="p-2 space-y-2">
                {pendingItems.map((item: any) => {
                  const pending = item.quantity - (item.receivedQuantity || 0);
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-card p-2 rounded-lg border border-border/40">
                      <div className="col-span-5">
                        <p className="font-bold text-sm text-foreground">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{item.product.sku}</p>
                      </div>
                      <div className="col-span-2 text-center font-medium">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="inline-flex items-center justify-center bg-amber-50 text-amber-700 font-bold h-6 min-w-[2rem] px-2 rounded-md text-xs dark:bg-amber-900/30">
                          {pending}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <div className="relative">
                          <Input 
                            type="number"
                            min="0"
                            max={pending}
                            value={receiveData[item.id] !== undefined ? receiveData[item.id] : ''}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value, pending)}
                            className="h-10 text-right pr-8 font-bold border-indigo-200 focus-visible:ring-indigo-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                            /{pending}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t border-border/50 bg-muted/20 shrink-0 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11 px-6 rounded-xl font-bold border-border/80">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={pendingItems.length === 0 || receiveMutation.isPending}
            className="h-11 px-6 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md gap-2"
          >
            {receiveMutation.isPending ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <CheckCircle2 className="h-4 w-4" />}
            Confirm Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

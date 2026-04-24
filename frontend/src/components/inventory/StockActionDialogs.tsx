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
import { ArrowUpCircle, ArrowDownCircle, Settings2 } from 'lucide-react';

interface Props {
  item: any | null;
  type: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER' | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const StockActionDialogs: React.FC<Props> = ({ item, type, open, onOpenChange, onSubmit }) => {
  const [formData, setFormData] = useState({
    quantity: '',
    reason: '',
    purchaseOrderNo: '',
    unitCost: '',
    notes: ''
  });

  // Reset form when dialog opens/closes or type changes
  useEffect(() => {
    if (open) {
      setFormData({
        quantity: '',
        reason: '',
        purchaseOrderNo: '',
        unitCost: '',
        notes: ''
      });
    }
  }, [open, type]);

  if (!item || !type) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTitle = () => {
    switch (type) {
      case 'IN': return 'Add Stock (Receive)';
      case 'OUT': return 'Deduct Stock (Issue)';
      case 'ADJUST': return 'Manual Adjustment';
      case 'TRANSFER': return 'Warehouse Transfer';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'IN': return <ArrowUpCircle className="h-6 w-6 text-emerald-600" />;
      case 'OUT': return <ArrowDownCircle className="h-6 w-6 text-rose-600" />;
      case 'ADJUST': return <Settings2 className="h-6 w-6 text-amber-600" />;
      case 'TRANSFER': return <ArrowUpCircle className="h-6 w-6 text-blue-600" />;
    }
  };

  const handleConfirm = () => {
    const payload = {
      productId: item.productId || item.id,
      warehouseId: item.warehouseId,
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
            <div className={`p-2 rounded-xl border ${
              type === 'IN' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800' : 
              type === 'OUT' ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800' : 
              'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800'
            }`}>
              {getIcon()}
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">{getTitle()}</DialogTitle>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              <span>Product</span>
              <span className="text-foreground font-bold">{item.product?.name || item.name}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
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
          <Button className={`h-12 flex-[2] rounded-xl font-bold px-6 shadow-sm transition-all ${
            type === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 
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

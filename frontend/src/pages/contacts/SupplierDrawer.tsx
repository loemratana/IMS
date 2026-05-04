import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  FileText, 
  Truck, 
  ShoppingBag, 
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import supplierService from '@/services/supplierService';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  supplier: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (supplier: any) => void;
}

export function SupplierDrawer({ supplier, open, onOpenChange, onEdit }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => supplierService.deleteSupplier(supplier.id),
    onSuccess: () => {
      toast.success('Supplier deactivated successfully');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate supplier');
    }
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: () => supplierService.deleteSupplierPermanent(supplier.id),
    onSuccess: () => {
      toast.success('Supplier permanently deleted');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete supplier permanently');
    }
  });

  if (!supplier) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-card/95 backdrop-blur-xl border-l-border/50">
        
        <SheetHeader className="p-6 border-b border-border/40 bg-muted/20 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 shadow-sm">
                <span className="font-bold text-indigo-700 text-2xl">{supplier.name.charAt(0)}</span>
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  {supplier.name}
                  {supplier.status === 'ACTIVE' ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none font-bold">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="font-bold shadow-none">Inactive</Badge>
                  )}
                </SheetTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Calendar className="h-3.5 w-3.5" /> Supplier since {new Date(supplier.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-lg"
                onClick={() => onEdit(supplier)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-100">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                  <AlertDialogHeader>
                    <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                      <AlertTriangle className="h-6 w-6 text-rose-600" />
                    </div>
                    <AlertDialogTitle className="text-xl font-bold">Delete Supplier?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      Choose between deactivating this supplier (soft delete) or permanent removal.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                    <Button 
                      variant="outline"
                      className="rounded-xl font-bold border-rose-200 text-rose-600 hover:bg-rose-50"
                      onClick={() => deleteMutation.mutate()}
                      disabled={deleteMutation.isPending}
                    >
                      Deactivate
                    </Button>
                    <Button 
                      className="rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md"
                      onClick={() => permanentDeleteMutation.mutate()}
                      disabled={permanentDeleteMutation.isPending}
                    >
                      Permanent Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-background rounded-xl p-4 border border-border/50 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <FileText className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Supplier Code</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{supplier.code}</span>
            </div>
            <div className="bg-background rounded-xl p-4 border border-border/50 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Truck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Tier</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{supplier.type}</span>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Contact Information</h3>
            <div className="bg-background border border-border/60 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Business Email</p>
                  <p className="text-sm font-medium text-foreground">{supplier.email}</p>
                </div>
              </div>
              <div className="h-px w-full bg-border/50"></div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Phone Number</p>
                  <p className="text-sm font-medium text-foreground">{supplier.phone}</p>
                </div>
              </div>
              <div className="h-px w-full bg-border/50"></div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Warehouse Address</p>
                  <p className="text-sm font-medium text-foreground">{supplier.address}</p>
                </div>
              </div>
            </div>
          </section>

          {supplier.notes && (
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Internal Notes</h3>
              <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 rounded-xl p-4">
                <p className="text-sm text-amber-900/80 dark:text-amber-200/70">{supplier.notes}</p>
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Purchase History</h3>
              <Button variant="link" className="text-indigo-600 h-auto p-0">View all POs</Button>
            </div>
            
            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-muted/10 rounded-2xl border border-dashed border-border/60">
              <ShoppingBag className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No purchase history found</p>
            </div>
          </section>

        </div>
      </SheetContent>
    </Sheet>
  );
}

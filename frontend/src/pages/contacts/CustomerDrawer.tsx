import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Calendar, Edit, FileText, ShoppingCart, TrendingUp } from "lucide-react";
import { Customer } from './index';

interface Props {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDrawer({ customer, open, onOpenChange }: Props) {
  if (!customer) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-card/95 backdrop-blur-xl border-l-border/50">
        
        <SheetHeader className="p-6 border-b border-border/40 bg-muted/20 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 shadow-sm">
                <span className="font-bold text-indigo-700 text-2xl">{customer.name.charAt(0)}</span>
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  {customer.name}
                  {customer.status === 'ACTIVE' ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none font-bold">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="font-bold shadow-none">Inactive</Badge>
                  )}
                </SheetTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Calendar className="h-3.5 w-3.5" /> Customer since {new Date(customer.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg">
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-background rounded-xl p-4 border border-border/50 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <FileText className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Customer Code</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{customer.code}</span>
            </div>
            <div className="bg-background rounded-xl p-4 border border-border/50 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Type</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{customer.type}</span>
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
                  <p className="text-xs font-semibold text-muted-foreground">Email Address</p>
                  <p className="text-sm font-medium text-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="h-px w-full bg-border/50"></div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Phone Number</p>
                  <p className="text-sm font-medium text-foreground">{customer.phone}</p>
                </div>
              </div>
              <div className="h-px w-full bg-border/50"></div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Billing Address</p>
                  <p className="text-sm font-medium text-foreground">{customer.address}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Recent Orders</h3>
              <Button variant="link" className="text-indigo-600 h-auto p-0">View all</Button>
            </div>
            
            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-muted/10 rounded-2xl border border-dashed border-border/60">
              <ShoppingCart className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No recent orders found</p>
            </div>
          </section>

        </div>
      </SheetContent>
    </Sheet>
  );
}

import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, CheckCircle2, XCircle, FileText, Package, Send, Check, ChevronRight, Activity, MapPin, CreditCard, User
} from "lucide-react";
import { SalesOrder, SOStatus } from './mockData';
import { cn } from "@/lib/utils";

interface Props {
  so: SalesOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SalesOrderDrawer({ so, open, onOpenChange }: Props) {
  if (!so) return null;

  const getStatusBadge = (status: SOStatus) => {
    switch (status) {
      case 'DRAFT': return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200"><FileText className="h-3 w-3 mr-1" /> Draft</Badge>;
      case 'CONFIRMED': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Confirmed</Badge>;
      case 'PROCESSING': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3 mr-1" /> Processing</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'CANCELLED': return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200"><XCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>;
      default: return null;
    }
  };

  const getProgressStep = () => {
    switch (so.status) {
      case 'DRAFT': return 0;
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'COMPLETED': return 3;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const step = getProgressStep();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-card/95 backdrop-blur-xl border-l-border/50">
        
        <SheetHeader className="p-6 border-b border-border/40 bg-muted/20 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <SheetTitle className="text-2xl font-bold tracking-tight text-foreground">{so.orderNumber}</SheetTitle>
                {getStatusBadge(so.status)}
              </div>
              <SheetDescription className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> 
                Ordered: <strong className="text-foreground">{new Date(so.orderDate).toLocaleDateString()}</strong>
              </SheetDescription>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-background rounded-xl p-3 border border-border/50 shadow-sm flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Customer</span>
              <span className="font-semibold text-foreground truncate">{so.customer.name}</span>
            </div>
            <div className="bg-background rounded-xl p-3 border border-border/50 shadow-sm flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Payment Method</span>
              <span className="font-semibold text-foreground truncate">{so.paymentMethod}</span>
            </div>
          </div>

          {/* Status Progress Bar */}
          {step >= 0 && (
            <div className="mt-8 px-2">
              <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0 rounded-full"></div>
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>

                {/* Steps */}
                {[
                  { label: "Draft", icon: FileText, active: step >= 0 },
                  { label: "Confirmed", icon: CheckCircle2, active: step >= 1 },
                  { label: "Processing", icon: Clock, active: step >= 2 },
                  { label: "Completed", icon: Package, active: step >= 3 }
                ].map((s, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-2 bg-muted/20">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                      s.active ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200" : "bg-card border-border text-muted-foreground"
                    )}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-wider absolute top-10 whitespace-nowrap",
                      s.active ? "text-indigo-700 dark:text-indigo-400" : "text-muted-foreground"
                    )}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-6"></div> {/* Spacer for absolute labels */}
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="items" className="w-full flex-1 flex flex-col">
            <div className="px-6 border-b border-border/40">
              <TabsList className="bg-transparent h-12 w-full justify-start gap-6 border-none p-0">
                <TabsTrigger value="items" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 h-12 font-medium text-muted-foreground data-[state=active]:text-foreground">
                  <Package className="h-4 w-4 mr-2" /> Order Items
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 h-12 font-medium text-muted-foreground data-[state=active]:text-foreground">
                  <Activity className="h-4 w-4 mr-2" /> Timeline
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="items" className="m-0 space-y-4">
                
                <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 rounded-xl p-4 flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider mb-1">Shipping Address</h4>
                    <p className="text-sm font-medium text-blue-900/80 dark:text-blue-200/80 leading-relaxed">{so.shippingAddress}</p>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  {so.items.map(item => (
                    <div key={item.id} className="bg-background border border-border/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-indigo-200 transition-colors">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">SKU: {item.product.sku}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Qty</span>
                          <span className="font-semibold text-foreground">{item.quantity}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Unit Price</span>
                          <span className="font-semibold text-foreground">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex flex-col items-end w-20">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Total</span>
                          <span className="font-bold text-indigo-600">${(item.quantity * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <div className="bg-muted/30 border border-border/50 rounded-xl p-4 w-full sm:w-64 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${so.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-px w-full bg-border/50 my-1"></div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-indigo-600">${so.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {so.notes && (
                  <div className="mt-6 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider mb-2">Customer Notes</h4>
                    <p className="text-sm text-amber-900/80 dark:text-amber-200/70">{so.notes}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="m-0">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:ml-5 md:before:-translate-x-px md:before:translate-y-2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border/50 before:to-transparent">
                  {so.activityLogs.map((log, index) => (
                    <div key={log.id} className="relative flex items-start gap-4">
                      <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-background border-2 border-border flex items-center justify-center shrink-0 z-10 shadow-sm">
                        <div className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-indigo-500" />
                      </div>
                      <div className="flex flex-col pt-1 md:pt-2">
                        <p className="text-sm font-semibold text-foreground">{log.action}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="font-medium">{log.user}</span>
                          <span>•</span>
                          <span>{new Date(log.date).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <SheetFooter className="p-4 border-t border-border/40 bg-muted/20 shrink-0 flex-col sm:flex-row gap-3">
          {so.status === 'DRAFT' && (
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md font-bold rounded-xl h-11">
              <CheckCircle2 className="h-4 w-4 mr-2" /> Confirm Order
            </Button>
          )}
          
          {so.status === 'CONFIRMED' && (
            <Button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white shadow-md font-bold rounded-xl h-11">
              <Clock className="h-4 w-4 mr-2" /> Start Processing
            </Button>
          )}

          {so.status === 'PROCESSING' && (
            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-bold rounded-xl h-11">
              <Send className="h-4 w-4 mr-2" /> Ship & Complete
            </Button>
          )}

          {so.status !== 'COMPLETED' && so.status !== 'CANCELLED' && (
            <Button variant="outline" className="w-full sm:w-auto border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold rounded-xl h-11">
              <XCircle className="h-4 w-4 mr-2" /> Cancel Order
            </Button>
          )}
        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
}

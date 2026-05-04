import React, { useState } from 'react';
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
  Clock, CheckCircle2, XCircle, Truck, FileText, Package, Check, ChevronRight, Activity, Paperclip, Calendar
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import purchaseService from '@/services/purchaseService';
import { PurchaseOrder, POStatus } from './mockData';
import { ReceiveItemsModal } from './ReceiveItemsModal';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';

interface Props {
  poId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PurchaseOrderDrawer({ poId, open, onOpenChange }: Props) {
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: poResponse, isLoading } = useQuery({
    queryKey: ['purchase', poId],
    queryFn: () => purchaseService.getPurchaseOrderById(poId!),
    enabled: !!poId && open,
  });

  const approveMutation = useMutation({
    mutationFn: () => purchaseService.approvePurchaseOrder(poId!),
    onSuccess: () => {
      toast.success('Purchase order approved successfully');
      queryClient.invalidateQueries({ queryKey: ['purchase', poId] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve purchase order');
    }
  });

  const po = poResponse?.data;

  if (!po && !isLoading) return null;

  const getStatusBadge = (status: POStatus) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3 mr-1" /> Pending Approval</Badge>;
      case 'APPROVED': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'RECEIVING': return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200"><Truck className="h-3 w-3 mr-1" /> Receiving</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'REJECTED': return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const items = po?.items || [];
  const totalOrdered = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalReceived = items.reduce((sum, item) => sum + (item.receivedQuantity || 0), 0);
  const progressPercent = totalOrdered > 0 ? (totalReceived / totalOrdered) * 100 : 0;

  if (isLoading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-6 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4" />
          <p className="text-muted-foreground">Loading details...</p>
        </SheetContent>
      </Sheet>
    );
  }

  if (!po) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-card/95 backdrop-blur-xl border-l-border/50">
          
          <SheetHeader className="p-6 border-b border-border/40 bg-muted/20 shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <SheetTitle className="text-2xl font-bold tracking-tight text-foreground">{po.poNumber}</SheetTitle>
                  {getStatusBadge(po.status)}
                </div>
                <SheetDescription className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> 
                  Expected: <strong className="text-foreground">{new Date(po.expectedDate).toLocaleDateString()}</strong>
                </SheetDescription>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-background rounded-xl p-3 border border-border/50 shadow-sm flex flex-col">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Supplier</span>
                <span className="font-semibold text-foreground truncate">{po.supplier?.name || 'N/A'}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{po.supplier?.email}</span>
              </div>
              <div className="bg-background rounded-xl p-3 border border-border/50 shadow-sm flex flex-col">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</span>
                <span className="font-semibold text-foreground truncate">{po.status}</span>
              </div>
            </div>


            {/* Progress Bar for Receiving */}
            {(po.status === 'APPROVED' || po.status === 'RECEIVING' || po.status === 'COMPLETED') && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-muted-foreground">Receiving Progress</span>
                  <span className="text-indigo-600">{totalReceived} / {totalOrdered} Items</span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-indigo-100 dark:bg-indigo-950" indicatorClassName="bg-indigo-600" />
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="items" className="w-full flex-1 flex flex-col">
              <div className="px-6 border-b border-border/40">
                <TabsList className="bg-transparent h-12 w-full justify-start gap-6 border-none p-0">
                  <TabsTrigger value="items" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 h-12 font-medium text-muted-foreground data-[state=active]:text-foreground">
                    <Package className="h-4 w-4 mr-2" /> Items
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 h-12 font-medium text-muted-foreground data-[state=active]:text-foreground">
                    <Activity className="h-4 w-4 mr-2" /> Activity
                  </TabsTrigger>
                  <TabsTrigger value="attachments" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 h-12 font-medium text-muted-foreground data-[state=active]:text-foreground">
                    <Paperclip className="h-4 w-4 mr-2" /> Attachments
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="items" className="m-0 space-y-4">
                  {items.map((item: any) => (
                    <div key={item.id} className="bg-background border border-border/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{item.product?.name || 'Unknown Product'}</h4>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">SKU: {item.product?.sku || 'N/A'}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Ordered</span>
                          <span className="font-semibold text-foreground">{item.quantity}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Received</span>
                          <span className="font-bold text-indigo-600">{item.receivedQuantity || 0}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Price</span>
                          <span className="font-semibold text-foreground">${parseFloat(item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {po.notes && (
                    <div className="mt-6 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider mb-2">Internal Notes</h4>
                      <p className="text-sm text-amber-900/80 dark:text-amber-200/70">{po.notes}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="m-0">
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:ml-5 md:before:-translate-x-px md:before:translate-y-2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border/50 before:to-transparent">
                    {(po.activityLogs || []).map((log: any) => (
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

                <TabsContent value="attachments" className="m-0">
                  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/60 rounded-2xl bg-muted/20">
                    <Paperclip className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <h3 className="text-sm font-bold text-foreground">No attachments yet</h3>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">Upload invoices, receipts, or supplier communications.</p>
                    <Button variant="outline" size="sm" className="bg-background shadow-sm">Upload File</Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <SheetFooter className="p-4 border-t border-border/40 bg-muted/20 shrink-0 flex-col sm:flex-row gap-3">
            {po.status === 'DRAFT' && (
              <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md font-bold rounded-xl h-11">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Submit for Approval
              </Button>
            )}
            
            {po.status === 'PENDING' && (
              <>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold rounded-xl h-11"
                  onClick={() => {/* Implement reject logic if needed */}}
                >
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
                <Button 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md font-bold rounded-xl h-11"
                  onClick={() => approveMutation.mutate()}
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Approve Order
                </Button>
              </>
            )}

            {(po.status === 'APPROVED' || po.status === 'RECEIVING') && (
              <Button 
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-bold rounded-xl h-11"
                onClick={() => setIsReceiveModalOpen(true)}
              >
                <Truck className="h-4 w-4 mr-2" /> Receive Items
              </Button>
            )}
          </SheetFooter>

        </SheetContent>
      </Sheet>

      <ReceiveItemsModal
        po={po}
        open={isReceiveModalOpen}
        onOpenChange={setIsReceiveModalOpen}
      />
    </>
  );
}

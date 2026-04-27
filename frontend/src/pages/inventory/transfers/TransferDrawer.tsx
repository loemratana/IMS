import React from "react";
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
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  User, 
  Calendar, 
  ArrowRight,
  Package,
  History,
  FileText,
  MoreHorizontal,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TransferRequest, TransferStatus } from "./index";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import transferService from "@/services/transferService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TransferDrawerProps {
  transfer: TransferRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferDrawer({ transfer, open, onOpenChange }: TransferDrawerProps) {
  const queryClient = useQueryClient();

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: () => transferService.approveTransferRequest(transfer?.id as string),
    onSuccess: () => {
      toast.success("Transfer request approved!");
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve transfer");
    }
  });

  // Execute Mutation
  const executeMutation = useMutation({
    mutationFn: () => transferService.executeTransfer(transfer?.id as string),
    onSuccess: () => {
      toast.success("Transfer executed successfully!");
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to execute transfer");
    }
  });

  // Cancel Mutation
  const cancelMutation = useMutation({
    mutationFn: () => transferService.cancelTransferRequest(transfer?.id as string),
    onSuccess: () => {
      toast.success("Transfer request cancelled!");
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel transfer");
    }
  });

  // Fetch detailed data
  const { data: detailedTransferData, isLoading } = useQuery({
    queryKey: ['transfer', transfer?.id],
    queryFn: () => transferService.getTransferRequestById(transfer?.id as string),
    enabled: !!transfer?.id,
  });

  const detailedTransfer = detailedTransferData?.data || transfer;

  if (!transfer) return null;

  const getStatusBadge = (status: TransferStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 gap-1 font-bold py-1 px-3 rounded-lg"><Clock className="h-3.5 w-3.5" /> Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 gap-1 font-bold py-1 px-3 rounded-lg"><CheckCircle2 className="h-3.5 w-3.5" /> Approved</Badge>;
      case 'EXECUTED':
        return <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 gap-1 font-bold py-1 px-3 rounded-lg"><Truck className="h-3.5 w-3.5" /> Executed</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50 gap-1 font-bold py-1 px-3 rounded-lg"><XCircle className="h-3.5 w-3.5" /> Rejected</Badge>;
      default:
        return <Badge variant="outline" className="font-bold py-1 px-3 rounded-lg">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getTimelineDate = (status: TransferStatus | 'CREATED' | 'RESERVATION') => {
    if (!detailedTransferData?.data?.history) return "Not started";
    const history = detailedTransferData.data.history;
    
    let actionStr = '';
    if (status === 'CREATED') actionStr = 'CREATED';
    else if (status === 'RESERVATION') actionStr = 'RESERVATION_CREATED';
    else if (status === 'APPROVED') actionStr = 'APPROVED';
    else if (status === 'EXECUTED') actionStr = 'EXECUTION_COMPLETED';
    
    const event = history.find((h: any) => h.action === actionStr);
    return event ? formatDate(event.performedAt) : "Not started";
  };

  const timelineItems = [
    { 
      title: "Request Created", 
      time: getTimelineDate('CREATED') !== "Not started" ? getTimelineDate('CREATED') : formatDate(detailedTransfer.requestedAt), 
      user: detailedTransfer.requestedBy?.name || detailedTransfer.requester?.name,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-50",
      completed: true
    },
    { 
      title: "Stock Reserved", 
      time: getTimelineDate('RESERVATION') !== "Not started" ? getTimelineDate('RESERVATION') : "System Processing...", 
      user: detailedTransferData?.data?.reservation?.reservor?.name || "System",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      completed: detailedTransfer.status !== 'CANCELLED' && detailedTransfer.status !== 'REJECTED' && !!detailedTransferData?.data?.reservation
    },
    { 
      title: "Manager Approval", 
      time: detailedTransfer.status === 'PENDING' ? "Awaiting review..." : getTimelineDate('APPROVED'), 
      user: detailedTransfer.status === 'PENDING' ? null : (detailedTransferData?.data?.approver?.name || "Admin User"),
      icon: CheckCircle2,
      color: detailedTransfer.status === 'PENDING' ? "text-slate-300" : "text-blue-500",
      bg: detailedTransfer.status === 'PENDING' ? "bg-slate-50" : "bg-blue-50",
      completed: detailedTransfer.status !== 'PENDING' && detailedTransfer.status !== 'CANCELLED' && detailedTransfer.status !== 'REJECTED'
    },
    { 
      title: "Execution Completed", 
      time: detailedTransfer.status === 'EXECUTED' ? getTimelineDate('EXECUTED') : "Not started", 
      user: detailedTransfer.status === 'EXECUTED' ? (detailedTransferData?.data?.execution?.executor?.name || "Warehouse Staff") : null,
      icon: Truck,
      color: detailedTransfer.status === 'EXECUTED' ? "text-emerald-500" : "text-slate-300",
      bg: detailedTransfer.status === 'EXECUTED' ? "bg-emerald-50" : "bg-slate-50",
      completed: detailedTransfer.status === 'EXECUTED'
    }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] p-0 flex flex-col border-l border-border bg-card">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div className="bg-slate-900 dark:bg-slate-950 p-6 text-white shrink-0">
          <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/10 px-2 py-1 rounded uppercase tracking-widest">{detailedTransfer.requestNumber}</span>
             {getStatusBadge(detailedTransfer.status)}
          </div>
          <SheetHeader className="text-left space-y-1">
            <SheetTitle className="text-2xl font-bold text-white leading-tight">
              {detailedTransfer.product.name}
            </SheetTitle>
            <SheetDescription className="text-slate-400 font-medium">
              Moving {detailedTransfer.quantity} units from {detailedTransfer.sourceWarehouse.code} to {detailedTransfer.targetWarehouse.code}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Transfer Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">SKU / ID</span>
                <p className="text-sm font-semibold text-foreground">{detailedTransfer.product.sku}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Priority</span>
                <p className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-tighter">
                  {detailedTransfer.priority === 'URGENT' && <AlertCircle className="h-3.5 w-3.5 text-rose-500" />}
                  <span className={cn(
                    detailedTransfer.priority === 'URGENT' ? 'text-rose-600 dark:text-rose-400' : 
                    detailedTransfer.priority === 'HIGH' ? 'text-amber-600 dark:text-amber-400' :
                    detailedTransfer.priority === 'MEDIUM' ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
                  )}>{detailedTransfer.priority}</span>
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Requested By</span>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" /> {detailedTransfer.requestedBy?.name || detailedTransfer.requester?.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Expected Date</span>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {formatDate(detailedTransfer.expectedDeliveryDate) || 'N/A'}</p>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Warehouse Path */}
            <div className="bg-muted/30 dark:bg-muted/10 rounded-2xl p-5 border border-border shadow-inner">
               <div className="flex items-center justify-between mb-3">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Source</span>
                   <span className="text-lg font-bold text-foreground leading-tight">{detailedTransfer.sourceWarehouse.name}</span>
                   <span className="text-xs font-medium text-muted-foreground">{detailedTransfer.sourceWarehouse.code}</span>
                   {detailedTransferData?.data?.currentStock && (
                     <span className="text-[10px] font-bold text-muted-foreground mt-1">Avail: {detailedTransferData.data.currentStock.source.available}</span>
                   )}
                 </div>
                 <div className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                 </div>
                 <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target</span>
                   <span className="text-lg font-bold text-foreground leading-tight text-right">{detailedTransfer.targetWarehouse.name}</span>
                   <span className="text-xs font-medium text-muted-foreground text-right">{detailedTransfer.targetWarehouse.code}</span>
                 </div>
               </div>
               <div className="p-3 bg-background border border-border/50 rounded-xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{detailedTransfer.product.name}</p>
                    <p className="text-[10px] font-medium text-muted-foreground">{detailedTransfer.quantity} units to be moved</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-xs font-bold", detailedTransfer.status === 'CANCELLED' ? "text-slate-500" : "text-emerald-600 dark:text-emerald-400")}>
                      {detailedTransferData?.data?.reservation?.status || "Reserved"}
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground/60">{detailedTransferData?.data?.reservation?.reservationNumber || "SR-Pending"}</p>
                  </div>
               </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                   <History className="h-4 w-4 text-muted-foreground" /> Activity Timeline
                 </h4>
                 <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                    Expand Details
                 </Button>
               </div>
               <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border/60">
                 {timelineItems.map((item, idx) => (
                   <div key={idx} className="relative group">
                     <div className={cn(
                       "absolute -left-[24px] top-1 h-[24px] w-[24px] rounded-full flex items-center justify-center border-2 bg-card transition-all z-10",
                       item.completed ? "border-emerald-500 shadow-sm" : "border-border"
                     )}>
                       {item.completed ? (
                         <CheckCircle2 className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                       ) : (
                         <div className="h-1.5 w-1.5 rounded-full bg-border" />
                       )}
                     </div>
                     <div className="space-y-0.5">
                       <p className={cn("text-xs font-bold", item.completed ? "text-foreground" : "text-muted-foreground")}>{item.title}</p>
                       <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-medium">
                         {item.time} 
                         {item.user && <><span className="text-border">•</span> <span className="text-foreground/70 font-semibold">{item.user}</span></>}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Notes */}
            {(detailedTransfer.requestNotes || detailedTransfer.notes) && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                   <MessageSquare className="h-4 w-4 text-muted-foreground" /> Requester Notes
                </h4>
                <div className="p-4 bg-muted/30 dark:bg-muted/10 border border-border rounded-2xl text-xs text-muted-foreground leading-relaxed italic">
                  "{detailedTransfer.requestNotes || detailedTransfer.notes}"
                </div>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="p-6 bg-card border-t border-border shrink-0 gap-3 sm:gap-0">
          {detailedTransfer.status === 'PENDING' && (
            <div className="flex flex-col w-full gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-xl h-12 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-700 font-bold transition-all active:scale-95">
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
                <Button 
                  onClick={() => approveMutation.mutate()}
                  disabled={approveMutation.isPending}
                  className="rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/10 transition-all active:scale-95"
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <><CheckCircle2 className="h-4 w-4 mr-2" /> Approve</>
                  )}
                </Button>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="rounded-xl h-10 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Cancel Request"}
              </Button>
            </div>
          )}
          {detailedTransfer.status === 'APPROVED' && (
            <Button 
              onClick={() => executeMutation.mutate()}
              disabled={executeMutation.isPending}
              className="w-full rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-100 dark:shadow-none transition-all active:scale-95"
            >
              {executeMutation.isPending ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing...</>
              ) : (
                <><Truck className="h-5 w-5 mr-2" /> Execute Physical Transfer</>
              )}
            </Button>
          )}
          {detailedTransfer.status === 'EXECUTED' && (
            <Button variant="outline" className="w-full rounded-xl h-12 border-border font-bold text-muted-foreground hover:bg-muted/50 hover:text-foreground">
              <FileText className="h-5 w-5 mr-2" /> Download Manifest (PDF)
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

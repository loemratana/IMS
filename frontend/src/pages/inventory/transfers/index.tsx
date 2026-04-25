import React, { useState } from "react";
import {
  Plus, Search, Filter, ArrowRight, MoreHorizontal,
  Clock, CheckCircle2, XCircle, Truck, AlertCircle,
  FileText, History, Info, LayoutGrid, List, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import transferService from "@/services/transferService";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CreateTransferModal } from "./CreateTransferModal";
import { TransferDrawer } from "./TransferDrawer";

// Types
export type TransferStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'EXECUTED';
export type TransferPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TransferRequest {
  id: string;
  requestNumber: string;
  sourceWarehouse: { name: string; code: string };
  targetWarehouse: { name: string; code: string };
  product: { name: string; sku: string; image?: string };
  quantity: number;
  status: TransferStatus;
  priority: TransferPriority;
  requester: { name: string };
  requestedAt: string;
  expectedDeliveryDate?: string;
  notes?: string;
}

export default function TransfersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch transfers from API
  const { data: transfersData, isLoading, refetch } = useQuery({
    queryKey: ['transfers', activeTab, searchQuery],
    queryFn: () => transferService.getTransfers({
      status: activeTab === 'all' ? undefined : activeTab.toUpperCase(),
      search: searchQuery || undefined
    }),
  });

  const transfers = transfersData?.data || [];

  // UI State
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTransferClick = (transfer: TransferRequest) => {
    setSelectedTransfer(transfer);
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (status: TransferStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 font-medium"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 font-medium"><CheckCircle2 className="h-3 w-3" /> Approved</Badge>;
      case 'EXECUTED':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 font-medium"><Truck className="h-3 w-3" /> Completed</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1 font-medium"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 gap-1 font-medium">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: TransferPriority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="flex items-center text-[10px] uppercase tracking-wider font-bold text-rose-600 animate-pulse"><AlertCircle className="h-3 w-3 mr-1" /> Urgent</span>;
      case 'HIGH':
        return <span className="flex items-center text-[10px] uppercase tracking-wider font-bold text-amber-600">High</span>;
      case 'MEDIUM':
        return <span className="flex items-center text-[10px] uppercase tracking-wider font-bold text-blue-600">Medium</span>;
      case 'LOW':
        return <span className="flex items-center text-[10px] uppercase tracking-wider font-bold text-slate-500">Low</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold  text-foreground">Transfers</h1>
          <p className="text-muted-foreground mt-1">Manage stock movements between warehouses and tracking statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex gap-2 bg-background shadow-sm border-border/50 hover:bg-accent/10">
            <History className="h-4 w-4 text-muted-foreground" /> History
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> New Transfer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending Requests", value: "12", icon: Clock, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", borderColor: "border-amber-200 dark:border-amber-900/20" },
          { label: "Approved", value: "8", icon: CheckCircle2, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", borderColor: "border-blue-200 dark:border-blue-900/20" },
          { label: "In Transit", value: "5", icon: Truck, color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400", borderColor: "border-indigo-200 dark:border-indigo-900/20" },
          { label: "Completed (MTD)", value: "142", icon: CheckCircle2, color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", borderColor: "border-emerald-200 dark:border-emerald-900/20" },
        ].map((stat, i) => (
          <Card key={i} className={cn("border-none shadow-sm hover:shadow-md transition-shadow bg-card overflow-hidden")}>
            <CardContent className="p-0">
              <div className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={cn("p-2.5 rounded-xl", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className={cn("h-1 w-full opacity-30", stat.color.split(' ')[0])} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar & Filters */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transfers, products, or SKU..."
              className="pl-9 bg-background border-border focus-visible:ring-primary h-10 rounded-lg shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="bg-muted/80 p-1 h-10 rounded-lg">
                <TabsTrigger value="all" className="rounded-md px-3 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">All</TabsTrigger>
                <TabsTrigger value="pending" className="rounded-md px-3 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">Pending</TabsTrigger>
                <TabsTrigger value="active" className="rounded-md px-3 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">Active</TabsTrigger>
                <TabsTrigger value="done" className="rounded-md px-3 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">Done</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon" className="h-10 w-10 bg-background border-border hover:bg-muted rounded-lg">
              <Filter className="h-4 w-4 text-foreground" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* List Section */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-border/40 shadow-sm bg-card">
              <CardContent className="p-5 flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : transfers.length > 0 ? (
          transfers.map((transfer: any) => (
            <Card
              key={transfer.id}
              onClick={() => handleTransferClick(transfer)}
              className="border-border/40 shadow-sm hover:shadow-md transition-all transition-shadow duration-300 group bg-card cursor-pointer hover:border-border"
            >
              <CardContent className="p-0">
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors overflow-hidden">
                      <FileText className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase tracking-tighter">{transfer.requestNumber}</span>
                        {getPriorityBadge(transfer.priority)}
                      </div>
                      <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight">{transfer.product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                        <span className="font-semibold text-foreground/80">{transfer.quantity} units</span>
                        <span className="text-border">•</span>
                        Requested by {transfer.requester?.name || 'System'}
                      </p>
                    </div>
                  </div>

                  {/* Path */}
                  <div className="flex items-center justify-between md:justify-center flex-1 max-w-sm px-4">
                    <div className="flex flex-col items-end md:items-center">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Source</span>
                      <span className="text-sm font-semibold text-foreground">{transfer.sourceWarehouse.name}</span>
                    </div>
                    <div className="px-6 flex flex-col items-center">
                      <div className="h-px w-12 bg-border relative">
                        <ArrowRight className="h-4 w-4 text-muted-foreground absolute -top-2 left-1/2 -translate-x-1/2 bg-card" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-center">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Target</span>
                      <span className="text-sm font-semibold text-foreground">{transfer.targetWarehouse.name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="flex flex-col items-end gap-1.5">
                      {getStatusBadge(transfer.status)}
                      <span className="text-[10px] text-muted-foreground font-medium">{new Date(transfer.requestedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border-border shadow-xl bg-card">
                          <DropdownMenuLabel className="text-xs font-bold text-muted-foreground px-2.5 py-1.5 uppercase tracking-wider">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="rounded-lg px-2.5 py-2 text-sm font-medium focus:bg-slate-50 gap-2">
                            <Info className="h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {transfer.status === 'PENDING' && (
                            <>
                              <DropdownMenuItem className="rounded-lg px-2.5 py-2 text-sm font-medium focus:bg-blue-50 text-blue-600 gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Approve Request
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg px-2.5 py-2 text-sm font-medium focus:bg-rose-50 text-rose-600 gap-2">
                                <XCircle className="h-4 w-4" /> Reject Request
                              </DropdownMenuItem>
                            </>
                          )}
                          {transfer.status === 'APPROVED' && (
                            <DropdownMenuItem className="rounded-lg px-2.5 py-2 text-sm font-medium focus:bg-emerald-50 text-emerald-600 gap-2">
                              <Truck className="h-4 w-4" /> Execute Transfer
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-card rounded-2xl border border-dashed border-border/60">
            <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <Truck className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No transfers found</h3>
            <p className="text-muted-foreground max-w-xs text-center mt-1">There are no transfer records matching your current filters.</p>
            <Button variant="outline" className="mt-6 border-border bg-background shadow-none">Clear all filters</Button>
          </div>
        )}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs font-medium text-muted-foreground">Showing 1-4 of 24 transfers</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="h-8 rounded-lg text-xs font-bold border-border bg-background/50">Previous</Button>
          <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold border-border bg-card shadow-sm">Next</Button>
        </div>
      </div>

      {/* Dialogs & Drawers */}
      <CreateTransferModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) refetch(); // Refresh after closing modal
        }}
      />
      <TransferDrawer
        transfer={selectedTransfer}
        open={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
          if (!open) refetch(); // Refresh after closing drawer
        }}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Search, Filter, Clock, CheckCircle2, AlertCircle, ShoppingBag, Send, ChevronRight, MoreHorizontal, FileText, Info, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { mockSalesOrders, SalesOrder, SOStatus } from './mockData';
import { CreateSalesOrderModal } from './CreateSalesOrderModal';
import { SalesOrderDrawer } from './SalesOrderDrawer';

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSO, setSelectedSO] = useState<SalesOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter logic
  const filteredSOs = mockSalesOrders.filter(so => {
    const matchesStatus = activeTab === 'ALL' || so.status === activeTab;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      so.orderNumber.toLowerCase().includes(searchLower) ||
      so.customer.name.toLowerCase().includes(searchLower);
    
    return matchesStatus && matchesSearch;
  });

  const handleSOClick = (so: SalesOrder) => {
    setSelectedSO(so);
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (status: SOStatus) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20 gap-1 font-medium shadow-none"><FileText className="h-3 w-3" /> Draft</Badge>;
      case 'CONFIRMED':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 gap-1 font-medium shadow-none"><CheckCircle2 className="h-3 w-3" /> Confirmed</Badge>;
      case 'PROCESSING':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 gap-1 font-medium shadow-none"><Clock className="h-3 w-3" /> Processing</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 gap-1 font-medium shadow-none"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 gap-1 font-medium shadow-none"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders, fulfillment, and shipping.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-9 gap-1.5 shadow-sm font-semibold active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" /> Create Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "New Drafts", value: "8", icon: FileText, color: "bg-slate-100 text-slate-600 border-slate-200" },
          { label: "Confirmed", value: "14", icon: CheckCircle2, color: "bg-blue-100 text-blue-600 border-blue-200" },
          { label: "Processing", value: "6", icon: Clock, color: "bg-amber-100 text-amber-600 border-amber-200" },
          { label: "Completed", value: "142", icon: ShoppingBag, color: "bg-emerald-100 text-emerald-600 border-emerald-200" },
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
              placeholder="Search by Order number or Customer..."
              className="pl-9 bg-background border-border focus-visible:ring-indigo-500 h-10 rounded-lg shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Tabs defaultValue="ALL" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="bg-muted/80 p-1 h-10 rounded-lg">
                <TabsTrigger value="ALL" className="rounded-md px-3 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium">All</TabsTrigger>
                <TabsTrigger value="DRAFT" className="rounded-md px-3 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium">Draft</TabsTrigger>
                <TabsTrigger value="CONFIRMED" className="rounded-md px-3 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium">Confirmed</TabsTrigger>
                <TabsTrigger value="PROCESSING" className="rounded-md px-3 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium">Processing</TabsTrigger>
                <TabsTrigger value="COMPLETED" className="rounded-md px-3 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-background border-border hover:bg-muted rounded-lg">
              <Filter className="h-4 w-4 text-foreground" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* List Section */}
      <div className="space-y-3">
        {filteredSOs.length > 0 ? (
          filteredSOs.map((so) => (
            <Card
              key={so.id}
              onClick={() => handleSOClick(so)}
              className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 group bg-card cursor-pointer hover:border-indigo-200"
            >
              <CardContent className="p-0">
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                      <ShoppingBag className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md tracking-tight">{so.orderNumber}</span>
                        {getStatusBadge(so.status)}
                      </div>
                      <h3 className="font-bold text-foreground truncate group-hover:text-indigo-600 transition-colors leading-tight">{so.customer.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                        <span className="font-semibold text-foreground/80">{so.itemsCount} items</span>
                      </p>
                    </div>
                  </div>

                  {/* Date & Amount */}
                  <div className="flex items-center justify-between md:justify-center flex-1 max-w-sm px-4">
                    <div className="flex flex-col items-start md:items-center">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Order Date</span>
                      <span className="text-sm font-semibold text-foreground">{new Date(so.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="h-8 w-px bg-border mx-6 hidden md:block"></div>
                    <div className="flex flex-col items-end md:items-center">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Total Amount</span>
                      <span className="text-sm font-bold text-foreground">${so.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border-border shadow-xl bg-card">
                        <DropdownMenuLabel className="text-xs font-bold text-muted-foreground px-2.5 py-1.5 uppercase tracking-wider">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="rounded-lg px-2.5 py-2 text-sm font-medium focus:bg-slate-50 gap-2 cursor-pointer">
                          <Info className="h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        {so.status === 'DRAFT' && (
                          <DropdownMenuItem className="rounded-lg px-2.5 py-2 text-sm font-medium focus:bg-blue-50 text-blue-600 gap-2 cursor-pointer">
                            <CheckCircle2 className="h-4 w-4" /> Confirm Order
                          </DropdownMenuItem>
                        )}
                        {so.status === 'CONFIRMED' && (
                          <DropdownMenuItem className="rounded-lg px-2.5 py-2 text-sm font-medium focus:bg-amber-50 text-amber-600 gap-2 cursor-pointer">
                            <Clock className="h-4 w-4" /> Start Processing
                          </DropdownMenuItem>
                        )}
                        {so.status === 'PROCESSING' && (
                          <DropdownMenuItem className="rounded-lg px-2.5 py-2 text-sm font-medium focus:bg-emerald-50 text-emerald-600 gap-2 cursor-pointer">
                            <Send className="h-4 w-4" /> Ship & Complete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-card rounded-2xl border border-dashed border-border/60">
            <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No sales orders found</h3>
            <p className="text-muted-foreground max-w-xs text-center mt-1">There are no orders matching your current filters.</p>
            <Button variant="outline" className="mt-6 border-border bg-background shadow-none" onClick={() => { setSearchQuery(''); setActiveTab('ALL'); }}>Clear filters</Button>
          </div>
        )}
      </div>

      <CreateSalesOrderModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
      
      <SalesOrderDrawer
        so={selectedSO}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
}

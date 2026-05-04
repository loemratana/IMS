import React, { useState } from 'react';
import { Users, Search, Filter, Briefcase, Mail, Phone, MapPin, ChevronRight, MoreHorizontal, Activity, Info, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CustomerDrawer } from './CustomerDrawer';
import { SupplierDrawer } from './SupplierDrawer';
import { CreateCustomerModal } from './CreateCustomerModal';
import customerService from '@/services/customerService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import supplierService from '@/services/supplierService';
import { CreateSupplierModal } from './CreateSupplierModal';

export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [isSupplierDrawerOpen, setIsSupplierDrawerOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<any | null>(null);

  const queryClient = useQueryClient();

  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: () => customerService.getCustomers({ search: searchQuery }),
    enabled: activeTab === 'customers'
  });

  const { data: suppliersData, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['suppliers', searchQuery],
    queryFn: () => supplierService.getAllSuppliers({ search: searchQuery }),
    enabled: activeTab === 'suppliers'
  });

  const createCustomerMutation = useMutation({
    mutationFn: (newCustomer: any) => customerService.createCustomer(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsCustomerModalOpen(false);
      toast({ title: "Success", description: "Customer created successfully." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create customer.",
        variant: "destructive",
      });
    }
  });

  const createSupplierMutation = useMutation({
    mutationFn: (newSupplier: any) => supplierService.createSupplier(newSupplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsSupplierModalOpen(false);
      toast({ title: "Success", description: "Supplier created successfully." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create supplier.",
        variant: "destructive",
      });
    }
  });

  const updateSupplierMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => supplierService.updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsSupplierModalOpen(false);
      setSupplierToEdit(null);
      toast({ title: "Success", description: "Supplier updated successfully." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update supplier.",
        variant: "destructive",
      });
    }
  });

  const customers = customersData?.data?.data || [];
  const suppliers = suppliersData?.data || [];
  const isLoading = activeTab === 'customers' ? isLoadingCustomers : isLoadingSuppliers;
  const currentItems = activeTab === 'customers' ? customers : suppliers;

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    if (activeTab === 'customers') {
      setIsCustomerDrawerOpen(true);
    } else {
      setIsSupplierDrawerOpen(true);
    }
  };

  const handleEditSupplier = (supplier: any) => {
    setSupplierToEdit(supplier);
    setIsSupplierDrawerOpen(false);
    setIsSupplierModalOpen(true);
  };

  const openAddModal = () => {
    if (activeTab === 'customers') {
      setIsCustomerModalOpen(true);
    } else {
      setSupplierToEdit(null);
      setIsSupplierModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {activeTab === 'customers' ? 'Customers' : 'Suppliers'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {activeTab === 'customers'
              ? 'Manage your customer relationships and view order histories.'
              : 'Manage your global suppliers and inventory sources.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="w-auto">
            <TabsList className="grid w-full grid-cols-2 h-10 rounded-xl bg-muted/60 p-1">
              <TabsTrigger value="customers" className="rounded-lg px-4 font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Customers</TabsTrigger>
              <TabsTrigger value="suppliers" className="rounded-lg px-4 font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Suppliers</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            onClick={openAddModal}
            className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white transition-all active:scale-95 rounded-xl h-10 font-semibold shadow-md"
          >
            <Plus className="h-4 w-4" /> Add {activeTab === 'customers' ? 'Customer' : 'Supplier'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: "1,248", icon: Users, color: "bg-indigo-100 text-indigo-600" },
          { label: "Active This Month", value: "156", icon: Activity, color: "bg-emerald-100 text-emerald-600" },
          { label: "Average LTV", value: "$4,250", icon: Briefcase, color: "bg-blue-100 text-blue-600" }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow bg-card overflow-hidden">
            <CardContent className="p-0">
              <div className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-xl", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar & Filters */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name or email..."
              className="pl-9 bg-background border-border focus-visible:ring-indigo-500 h-10 rounded-lg shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-background border-border hover:bg-muted rounded-lg">
            <Filter className="h-4 w-4 text-foreground" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-48 border-none bg-muted/20" />
          ))
        ) : currentItems.length > 0 ? (
          currentItems.map((item: any) => (
            <Card
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="cursor-pointer group hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden bg-card"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 group-hover:shadow-sm transition-shadow">
                      <span className="font-bold text-indigo-700 text-lg">{item.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.status === 'ACTIVE' ? (
                          <span className="flex items-center text-xs font-semibold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> Active
                          </span>
                        ) : (
                          <span className="flex items-center text-xs font-semibold text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span> Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 mt-auto">
                  <p className="text-sm text-muted-foreground flex items-center gap-2 truncate">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> {item.email}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 truncate">
                    <Phone className="h-3.5 w-3.5 shrink-0" /> {item.phone}
                  </p>
                </div>

                <div className="border-t border-border/50 mt-5 pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Code</p>
                    <p className="font-bold text-foreground">{item.code}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Type</p>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">{item.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-24 flex flex-col items-center justify-center bg-card rounded-2xl border border-dashed border-border/60">
            <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold text-foreground">No {activeTab} found</h3>
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>Clear search</Button>
          </div>
        )}
      </div>

      <CustomerDrawer
        customer={activeTab === 'customers' ? selectedItem : null}
        open={isCustomerDrawerOpen}
        onOpenChange={setIsCustomerDrawerOpen}
      />

      <SupplierDrawer
        supplier={activeTab === 'suppliers' ? selectedItem : null}
        open={isSupplierDrawerOpen}
        onOpenChange={setIsSupplierDrawerOpen}
        onEdit={handleEditSupplier}
      />

      <CreateCustomerModal
        open={isCustomerModalOpen}
        onOpenChange={setIsCustomerModalOpen}
        onSubmit={(v) => createCustomerMutation.mutate(v)}
        isLoading={createCustomerMutation.isPending}
      />

      <CreateSupplierModal
        open={isSupplierModalOpen}
        onOpenChange={(open) => {
          setIsSupplierModalOpen(open);
          if (!open) setSupplierToEdit(null);
        }}
        onSubmit={(v) => {
          if (supplierToEdit) {
            updateSupplierMutation.mutate({ id: supplierToEdit.id, data: v });
          } else {
            createSupplierMutation.mutate(v);
          }
        }}
        isLoading={createSupplierMutation.isPending || updateSupplierMutation.isPending}
        initialData={supplierToEdit}
      />
    </div >
  );
}

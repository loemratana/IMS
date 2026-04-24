
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Download, Building2 } from 'lucide-react';
import { toast } from "sonner";

import warehouseService from '@/services/warehouseService';
import WarehouseKPIs from '@/components/warehouse/WarehouseKPIs';
import WarehouseFilters from '@/components/warehouse/WarehouseFilters';
import WarehouseTable, { Warehouse } from '@/components/warehouse/WarehouseTable';
import WarehouseDetailDrawer from '@/components/warehouse/WarehouseDetailDrawer';
import WarehouseFormDialog from '@/components/warehouse/WarehouseFormDialog';

const WarehousesPage = () => {
  const queryClient = useQueryClient();
  
  // UI States
  const [selectedItem, setSelectedItem] = useState<Warehouse | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    isActive: undefined,
    location: ''
  });

  // Queries
  const { data: warehousesResponse, isLoading, refetch } = useQuery({
    queryKey: ['warehouses', filters],
    queryFn: () => warehouseService.getAllWarehouses(filters)
  });

  const warehouses = warehousesResponse?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => warehouseService.createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success("Warehouse created successfully");
      setIsFormOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({id, data}: {id: string, data: any}) => warehouseService.updateWarehouse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success("Warehouse updated successfully");
      setIsFormOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => warehouseService.deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success("Warehouse deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete warehouse");
    }
  });

  // Handlers
  const handleSelectItem = (item: Warehouse) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleAction = (type: 'EDIT' | 'DELETE' | 'VIEW', item: Warehouse) => {
    setSelectedItem(item);
    if (type === 'EDIT') {
      setIsFormOpen(true);
    } else if (type === 'VIEW') {
      setIsDrawerOpen(true);
    } else if (type === 'DELETE') {
      if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
        deleteMutation.mutate(item.id);
      }
    }
  };

  const handleCreateNew = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
             <Building2 className="h-6 w-6 text-indigo-600" />
             Warehouse Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure storage locations, monitor capacity, and manage warehouse logistics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5 border-border/50">
            <Download className="h-4 w-4" /> Export Report
          </Button>
          <Button className="h-9 gap-1.5 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreateNew}>
            <Plus className="h-4 w-4" /> Create Warehouse
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <WarehouseKPIs 
        totalWarehouses={warehouses.length}
        activeWarehouses={warehouses.filter((w: Warehouse) => w.isActive).length}
        totalStockValue={warehouses.reduce((acc: number, curr: any) => acc + (curr.totalStockValue || 0), 0)}
        lowStockAlerts={12}
      />

      {/* Main Content Card */}
      <Card className="border-border/50 shadow-none overflow-hidden">
        <WarehouseFilters 
          search={filters.search}
          onSearchChange={(v) => setFilters(prev => ({ ...prev, search: v }))}
          status={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
          onStatusChange={(v) => setFilters(prev => ({ ...prev, isActive: v === 'all' ? undefined : v === 'active' }))}
          location={filters.location || 'all'}
          onLocationChange={(v) => setFilters(prev => ({ ...prev, location: v === 'all' ? '' : v }))}
          onReset={() => setFilters({ search: '', isActive: undefined, location: '' })}
        />

        <WarehouseTable 
          data={warehouses}
          onSelectItem={handleSelectItem}
          onAction={handleAction}
        />
      </Card>

      {/* Detail Drawer */}
      <WarehouseDetailDrawer 
        warehouse={selectedItem}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />

      {/* Create/Edit Form */}
      <WarehouseFormDialog 
        warehouse={selectedItem}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default WarehousesPage;

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import InventoryKPIs from '@/components/inventory/InventoryKPIs';
import InventoryFilters from '@/components/inventory/InventoryFilters';
import InventoryTable from '@/components/inventory/InventoryTable';
import StockDetailDrawer from '@/components/inventory/StockDetailDrawer';
import StockActionDialogs from '@/components/inventory/StockActionDialogs';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Download } from 'lucide-react';
import { toast } from "sonner";
import inventoryService from '@/services/inventoryService';
import { CreateTransferModal } from './transfers/CreateTransferModal';

const InventoryPage = () => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionType, setActionType] = useState<'IN' | 'OUT' | 'ADJUST' | 'TRANSFER' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  // Fetch real data using React Query
  const { data: inventoryResponse, isLoading, refetch } = useQuery({
    queryKey: ['inventory', filters],
    queryFn: () => inventoryService.getCurrentStock(filters)
  });

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleAction = (type: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER', item: any | null = null) => {
    setSelectedItem(item);
    setActionType(type);

    if (type === 'TRANSFER') {
      setIsTransferModalOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleSubmitAction = async (formData: any) => {
    try {
      let response;
      if (actionType === 'IN') {
        response = await inventoryService.stockIn(formData);
      } else if (actionType === 'OUT') {
        response = await inventoryService.stockOut(formData);
      } else if (actionType === 'TRANSFER') {
        response = await inventoryService.transferStock(formData);
      } else {
        toast.error("Action not implemented yet");
        return;
      }

      if (response.success) {
        toast.success("Inventory updated successfully", {
          description: response.message || "Stock movement has been recorded.",
        });
        setIsDialogOpen(false);
        refetch(); // Refresh table data
      } else {
        toast.error(response.message || "Failed to update inventory");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor stock levels, track movements, and manage warehouse locations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5 border-border/50">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="h-9 gap-1.5 shadow-sm" onClick={() => handleAction('IN')}>
            <Plus className="h-4 w-4" /> Stock In
          </Button>
        </div>
      </div>

      <InventoryKPIs
        totalItems={inventoryResponse?.summary?.totalProducts || 0}
        lowStockItems={inventoryResponse?.summary?.lowStockCount || 0}
        outOfStockItems={inventoryResponse?.summary?.outOfStockCount || 0}
        recentStockIn={0} // To be implemented with movements API
        totalValue={inventoryResponse?.summary?.totalQuantity || 0}
      />

      <Card className="border-border/50 shadow-none overflow-hidden">
        <InventoryFilters onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))} />

        <InventoryTable
          data={inventoryResponse?.data || []}
          isLoading={isLoading}
          onSelectItem={handleSelectItem}
          onAction={(type, item) => handleAction(type, item)}
        />
      </Card>

      <StockDetailDrawer
        item={selectedItem}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onAction={(type) => handleAction(type as any)}
      />

      <StockActionDialogs
        item={selectedItem}
        type={actionType}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitAction}
      />

      <CreateTransferModal
        open={isTransferModalOpen}
        onOpenChange={setIsTransferModalOpen}
        initialData={selectedItem ? {
          productId: selectedItem.productId || selectedItem.product?.id || selectedItem.id,
          sourceWarehouseId: selectedItem.warehouseId || selectedItem.warehouse?.id
        } : undefined}
      />
    </div>
  );
};

export default InventoryPage;

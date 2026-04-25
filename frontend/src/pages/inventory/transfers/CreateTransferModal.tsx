import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Info, AlertCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import transferService from "@/services/transferService";
import warehouseService from "@/services/warehouseService";
import productService from "@/services/productService";

const transferSchema = z.object({
  sourceWarehouseId: z.string().min(1, "Source warehouse is required"),
  targetWarehouseId: z.string().min(1, "Target warehouse is required"),
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  notes: z.string().optional(),
}).refine(data => data.sourceWarehouseId !== data.targetWarehouseId, {
  message: "Source and target warehouses must be different",
  path: ["targetWarehouseId"],
});

type TransferFormValues = z.infer<typeof transferSchema>;

interface CreateTransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    productId?: string;
    sourceWarehouseId?: string;
  };
}

export function CreateTransferModal({ open, onOpenChange, initialData }: CreateTransferModalProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      priority: "MEDIUM",
      quantity: 1,
      productId: initialData?.productId || "",
      sourceWarehouseId: initialData?.sourceWarehouseId || "",
    },
  });

  // Fetch Warehouses
  const { data: warehousesData } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => warehouseService.getAllWarehouses(),
    enabled: open
  });

  // Fetch Products
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAllProducts(),
    enabled: open
  });

  const warehouses = warehousesData?.data || [];
  const products = productsData?.data || [];

  // Create Transfer Mutation
  const createMutation = useMutation({
    mutationFn: (values: TransferFormValues) => transferService.createTransferRequest(values),
    onSuccess: () => {
      toast.success("Transfer request created successfully!");
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create transfer request");
    }
  });

  // Reset form when initialData changes or modal opens
  React.useEffect(() => {
    if (open) {
      form.reset({
        priority: "MEDIUM",
        quantity: 1,
        productId: initialData?.productId || "",
        sourceWarehouseId: initialData?.sourceWarehouseId || "",
      });
    }
  }, [open, initialData, form]);

  const onSubmit = (values: TransferFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        <div className="bg-slate-900 p-6 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Package size={120} />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-bold">New Transfer Request</DialogTitle>
            <DialogDescription className="text-slate-400">
              Move stock between warehouses. All requests require approval before execution.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6 bg-card">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sourceWarehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Source Warehouse</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-border h-12 bg-background">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl bg-card border-border">
                        {warehouses.map((wh: any) => (
                          <SelectItem key={wh.id} value={wh.id}>{wh.name} ({wh.code})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetWarehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Warehouse</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-border h-12 bg-background">
                          <SelectValue placeholder="Select target" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl bg-card border-border">
                        {warehouses.map((wh: any) => (
                          <SelectItem key={wh.id} value={wh.id}>{wh.name} ({wh.code})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Product</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-border h-12 bg-background">
                        <SelectValue placeholder="Search product to transfer..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl bg-card border-border">
                      {products.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                  <div className="flex items-center gap-2 mt-2 p-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-900/20 rounded-lg text-[11px] text-blue-700 dark:text-blue-400">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    <span>Available stock: <strong>42 units</strong> in Main Warehouse.</span>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-xl border-border h-12 bg-background" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-border h-12 bg-background">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl bg-card border-border">
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Transfer Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Optional details or reason for transfer..." 
                      className="rounded-xl border-border min-h-[100px] resize-none bg-background"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 mt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl h-12 px-6 font-semibold hover:bg-muted">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="rounded-xl h-12 px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10"
              >
                {createMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  "Create Transfer Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

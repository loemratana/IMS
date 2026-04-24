
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Layers,
  Info,
  Activity,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Navigation
} from 'lucide-react';
import { Warehouse } from './WarehouseTable';

const warehouseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters'),
  location: z.string().min(1, 'Location is required'),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  capacity: z.coerce.number().optional().default(0),
  minStock: z.coerce.number().optional().default(0),
  maxStock: z.coerce.number().optional().default(0),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

interface WarehouseFormDialogProps {
  warehouse: Warehouse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WarehouseFormValues) => void;
  isPending?: boolean;
}

const WarehouseFormDialog: React.FC<WarehouseFormDialogProps> = ({
  warehouse,
  open,
  onOpenChange,
  onSubmit,
  isPending = false
}) => {
  const isEdit = !!warehouse;

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: '',
      code: '',
      location: '',
      address: '',
      contactPerson: '',
      phone: '',
      capacity: 0,
      minStock: 0,
      maxStock: 0,
      isActive: true,
      description: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (warehouse) {
        form.reset({
          name: warehouse.name,
          code: warehouse.code,
          location: warehouse.location,
          address: warehouse.address || '',
          contactPerson: warehouse.contactPerson || '',
          phone: warehouse.phone || '',
          capacity: warehouse.capacity || 0,
          minStock: (warehouse as any).minStock || 0,
          maxStock: (warehouse as any).maxStock || 0,
          isActive: warehouse.isActive,
          description: warehouse.description || '',
        });
      } else {
        form.reset({
          name: '',
          code: '',
          location: '',
          address: '',
          contactPerson: '',
          phone: '',
          capacity: 0,
          minStock: 0,
          maxStock: 0,
          isActive: true,
          description: '',
        });
      }
    }
  }, [open, warehouse, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden p-0 bg-background transition-colors border-border/60">
        <DialogHeader className="p-6 pb-2">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-100 dark:border-indigo-900/50">
            <Building2 className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
            {isEdit ? 'Edit Warehouse' : 'New Warehouse'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            {isEdit ? 'Update warehouse configuration and logistics details.' : 'Register a new storage location and set operating limits.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 pt-2 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center text-muted-foreground">
                      <Building2 className="h-3 w-3 mr-2" /> Warehouse Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Main Distribution" className="bg-muted/10 border-border/60 focus:border-indigo-500/50 transition-all shadow-none h-11" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center text-muted-foreground">
                      <Layers className="h-3 w-3 mr-2" /> Site Code
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="WH-001" className="bg-muted/10 border-border/60 focus:border-indigo-500/50 transition-all shadow-none h-11 uppercase" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-2" /> Province / City
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Phnom Penh" className="bg-muted/10 border-border/60 focus:border-indigo-500/50 transition-all shadow-none h-11" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center text-muted-foreground">
                      <Navigation className="h-3 w-3 mr-2" /> Exact Address
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="St. 271, Boeng Tumpun..." className="bg-muted/10 border-border/60 focus:border-indigo-500/50 transition-all shadow-none h-11" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center text-muted-foreground">
                      <User className="h-3 w-3 mr-2" /> Contact Manager
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" className="bg-muted/10 border-border/60 focus:border-indigo-500/50 transition-all shadow-none h-11" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center text-muted-foreground">
                      <Phone className="h-3 w-3 mr-2" /> Site Phone
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+855 ..." className="bg-muted/10 border-border/60 focus:border-indigo-500/50 transition-all shadow-none h-11" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center text-muted-foreground">
                      <BarChart3 className="h-3 w-3 mr-2" /> Capacity
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" className="bg-muted/10 border-border/60 focus:border-indigo-500/50 transition-all shadow-none h-11" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center text-muted-foreground text-amber-600 dark:text-amber-400">
                      <TrendingDown className="h-3 w-3 mr-2" /> Min Threshold
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" className="bg-muted/10 border-border/60 focus:border-amber-500/50 transition-all shadow-none h-11" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center text-muted-foreground text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-3 w-3 mr-2" /> Max Limit
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="4500" className="bg-muted/10 border-border/60 focus:border-emerald-500/50 transition-all shadow-none h-11" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <div className="flex items-center space-x-3 px-4 h-11 border rounded-xl bg-muted/5 border-border/60 transition-colors">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest flex-1 cursor-pointer">Active Site</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-indigo-600"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center text-muted-foreground">
                    <Info className="h-3 w-3 mr-2" /> Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Specific storage instructions..." className="bg-muted/10 border-border/60 focus:border-indigo-500/50 transition-all shadow-none min-h-[70px] resize-none" {...field} />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl font-bold border-border/60 h-11 flex-1">
                 Cancel
              </Button>
              <Button type="submit" className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex-1 h-11" disabled={isPending}>
                 {isPending ? 'Syncing...' : isEdit ? 'Update Site' : 'Create Site'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseFormDialog;

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  X, 
  Truck, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const supplierSchema = z.object({
  name: z.string().min(2, 'Supplier name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  address: z.string().optional(),
  type: z.enum(['REGULAR', 'PREMIUM', 'STRATEGIC']),
  notes: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface CreateSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SupplierFormValues) => void;
  isLoading?: boolean;
  initialData?: any;
}

export function CreateSupplierModal({ open, onOpenChange, onSubmit, isLoading, initialData }: CreateSupplierModalProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      type: initialData?.type || 'REGULAR',
      notes: initialData?.notes || '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address,
        type: initialData.type,
        notes: initialData.notes,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        type: 'REGULAR',
        notes: '',
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: SupplierFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-card">
        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)} 
              className="text-indigo-100 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-2 relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 shadow-sm">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {initialData ? 'Update Supplier' : 'Add Global Supplier'}
            </DialogTitle>
            <DialogDescription className="text-indigo-100 font-medium">
              {initialData ? `Editing details for ${initialData.name}` : 'Onboard a new supplier to your inventory ecosystem.'}
            </DialogDescription>
          </div>
          
          {/* Abstract decorative elements */}
          <div className="absolute -bottom-12 -right-12 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-12 -left-12 h-32 w-32 bg-indigo-500/30 rounded-full blur-2xl" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-3 w-3" /> Supplier Information
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Supplier Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Global Tech Supplies" className="pl-10 h-11 rounded-xl bg-muted/30 border-border focus:ring-indigo-600" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Supplier Tier</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border focus:ring-indigo-600">
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="REGULAR" className="text-sm font-medium">Regular Supplier</SelectItem>
                            <SelectItem value="PREMIUM" className="text-sm font-medium">Premium Partner</SelectItem>
                            <SelectItem value="STRATEGIC" className="text-sm font-medium">Strategic Alliance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Supplier Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Special shipping terms, lead times, etc..." 
                          className="min-h-[100px] rounded-xl bg-muted/30 border-border focus:ring-indigo-600 resize-none text-sm" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column: Contact Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Contact Details
                  </h3>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Business Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="sales@globaltech.com" className="pl-10 h-11 rounded-xl bg-muted/30 border-border focus:ring-indigo-600" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="+1 (555) 0102" className="pl-10 h-11 rounded-xl bg-muted/30 border-border focus:ring-indigo-600" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Warehouse Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea 
                              placeholder="Full physical address..." 
                              className="pl-10 min-h-[90px] rounded-xl bg-muted/30 border-border focus:ring-indigo-600 resize-none text-sm" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            <DialogFooter className="sm:justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Certified Supplier Onboarding</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => onOpenChange(false)} 
                  className="h-11 rounded-xl px-6 font-bold shadow-sm"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="h-11 rounded-xl px-8 font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/10 active:scale-95 transition-all"
                >
                  {isLoading ? 'Processing...' : (initialData ? 'Update Supplier' : 'Onboard Supplier')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

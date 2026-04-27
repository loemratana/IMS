import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  ShieldCheck,
  Plus,
  ArrowRight
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
  FormDescription
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

const customerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  address: z.string().optional(),
  type: z.enum(['RETAIL', 'WHOLESALE', 'CORPORATE', 'GOVERNMENT']),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CreateCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CustomerFormValues) => void;
  isLoading?: boolean;
}

export function CreateCustomerModal({ open, onOpenChange, onSubmit, isLoading }: CreateCustomerModalProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'RETAIL',
      notes: '',
    },
  });

  const handleFormSubmit = (values: CustomerFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-card">
        <div className="bg-zinc-900 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)} 
              className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-2 relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4 border border-zinc-700 shadow-sm">
              <User className="h-6 w-6 text-zinc-100" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Add New Customer</DialogTitle>
            <DialogDescription className="text-zinc-400 font-medium">
              Create a new customer profile for your inventory management system.
            </DialogDescription>
          </div>
          
          {/* Abstract decorative elements */}
          <div className="absolute -bottom-12 -right-12 h-40 w-40 bg-zinc-800/50 rounded-full blur-3xl" />
          <div className="absolute -top-12 -left-12 h-32 w-32 bg-zinc-700/20 rounded-full blur-2xl" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-3 w-3" /> Basic Information
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="John Doe" className="pl-10 h-11 rounded-xl bg-muted/30 border-border focus:ring-zinc-900" {...field} />
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
                        <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Customer Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border focus:ring-zinc-900">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="RETAIL" className="text-sm font-medium">Retail Customer</SelectItem>
                            <SelectItem value="WHOLESALE" className="text-sm font-medium">Wholesale Client</SelectItem>
                            <SelectItem value="CORPORATE" className="text-sm font-medium">Corporate Account</SelectItem>
                            <SelectItem value="GOVERNMENT" className="text-sm font-medium">Government Body</SelectItem>
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
                      <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special requirements or history..." 
                          className="min-h-[100px] rounded-xl bg-muted/30 border-border focus:ring-zinc-900 resize-none" 
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
                        <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="john@company.com" className="pl-10 h-11 rounded-xl bg-muted/30 border-border focus:ring-zinc-900" {...field} />
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
                            <Input placeholder="+1 (555) 000-0000" className="pl-10 h-11 rounded-xl bg-muted/30 border-border focus:ring-zinc-900" {...field} />
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
                        <FormLabel className="text-[11px] font-bold uppercase text-muted-foreground">Business Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea 
                              placeholder="Street address, city, zip code..." 
                              className="pl-10 min-h-[90px] rounded-xl bg-muted/30 border-border focus:ring-zinc-900 resize-none" 
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
                <span className="text-[10px] font-bold uppercase tracking-wider">All data is securely encrypted</span>
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
                  className="h-11 rounded-xl px-8 font-bold bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10 active:scale-95 transition-all"
                >
                  {isLoading ? 'Creating...' : 'Create Customer'}
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

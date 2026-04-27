import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  X, 
  ShieldAlert, 
  Mail, 
  MessageSquare, 
  Bell,
  Package,
  Layers,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const ruleSchema = z.object({
  name: z.string().min(3, 'Name is too short'),
  description: z.string().min(10, 'Description is too short'),
  threshold: z.coerce.number().min(0),
  scope: z.enum(['ALL', 'CATEGORY', 'SPECIFIC']),
  channels: z.array(z.string()).min(1, 'Select at least one channel'),
});

type RuleFormValues = z.infer<typeof ruleSchema>;

interface AlertRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RuleFormValues) => void;
}

export function AlertRuleModal({ open, onOpenChange, onSubmit }: AlertRuleModalProps) {
  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      name: '',
      description: '',
      threshold: 10,
      scope: 'ALL',
      channels: ['IN_APP'],
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        <div className="bg-indigo-600 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-4">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-2 relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 shadow-lg">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">Create Alert Rule</DialogTitle>
            <DialogDescription className="text-indigo-100 font-medium opacity-90">
              Set automated triggers for stock monitoring and notifications.
            </DialogDescription>
          </div>
          {/* Abstract blobs */}
          <div className="absolute -bottom-16 -right-16 h-48 w-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-16 -left-16 h-48 w-48 bg-indigo-400/20 rounded-full blur-3xl" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Rule Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Critical GPU Alert" className="h-10 rounded-xl bg-muted/20 border-border focus-visible:ring-indigo-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly explain what this rule monitors..." 
                          className="min-h-[100px] rounded-xl bg-muted/20 border-border focus-visible:ring-indigo-500 resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="threshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Stock Threshold</FormLabel>
                        <div className="flex items-center gap-3">
                           <div className="flex-1">
                             <FormControl>
                               <Input type="number" className="h-10 rounded-xl bg-muted/20 border-border focus-visible:ring-indigo-500" {...field} />
                             </FormControl>
                           </div>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/40 px-2 py-1 rounded">Units</span>
                        </div>
                        <FormDescription className="text-[10px] font-medium leading-tight">Alert triggers when stock falls below this value.</FormDescription>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scope"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground">Scope</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 rounded-xl bg-muted/20 border-border focus-visible:ring-indigo-500 font-bold text-xs">
                              <SelectValue placeholder="Select scope" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="ALL" className="font-bold text-xs">All Products</SelectItem>
                            <SelectItem value="CATEGORY" className="font-bold text-xs">Specific Category</SelectItem>
                            <SelectItem value="SPECIFIC" className="font-bold text-xs">Selected Items</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground block">Notification Channels</FormLabel>
                  <div className="space-y-2">
                    {[
                      { id: 'IN_APP', label: 'In-App Notifications', icon: Bell, color: 'text-indigo-500' },
                      { id: 'EMAIL', label: 'Email Alerts', icon: Mail, color: 'text-blue-500' },
                      { id: 'TELEGRAM', label: 'Telegram Bot', icon: MessageSquare, color: 'text-sky-500' },
                    ].map((channel) => (
                      <FormField
                        key={channel.id}
                        control={form.control}
                        name="channels"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={channel.id}
                              className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border border-border/50 p-3 bg-muted/5 hover:bg-muted/10 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(channel.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, channel.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== channel.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <div className="flex items-center gap-2 flex-1">
                                <channel.icon className={cn("h-4 w-4", channel.color)} />
                                <FormLabel className="text-xs font-bold cursor-pointer">{channel.label}</FormLabel>
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage className="text-[10px] font-bold" />
                </div>
              </div>
            </div>

            <Separator className="bg-border/40" />

            <DialogFooter className="flex items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground flex-1">
                <Info className="h-4 w-4 text-indigo-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Rules take effect immediately.</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="h-10 rounded-xl font-bold px-6 shadow-sm">
                  Cancel
                </Button>
                <Button type="submit" className="h-10 rounded-xl font-bold px-8 shadow-md shadow-indigo-500/20 active:scale-95 transition-all">
                  Create Rule <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

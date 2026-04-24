
import React from 'react';
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Warehouse } from './WarehouseTable';
import { Building2, MapPin, User, Phone, Mail, Package, History, PieChart } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface WarehouseDetailDrawerProps {
   warehouse: Warehouse | null;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

const WarehouseDetailDrawer: React.FC<WarehouseDetailDrawerProps> = ({
   warehouse,
   open,
   onOpenChange
}) => {
   if (!warehouse) return null;

   return (
      <Sheet open={open} onOpenChange={onOpenChange}>
         <SheetContent className="sm:max-w-[500px] p-0 overflow-y-auto bg-background transition-colors">
            <div className="p-6 pb-0">
               <SheetHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                     <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                        <Building2 className="h-7 w-7" />
                     </div>
                     <Badge variant={warehouse.isActive ? "default" : "secondary"} className={warehouse.isActive ? "bg-emerald-500 hover:bg-emerald-600 border-none mr-4" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}>
                        {warehouse.isActive ? "Active Warehouse" : "Inactive"}
                     </Badge>
                  </div>
                  <div>
                     <SheetTitle className="text-2xl font-bold">{warehouse.name}</SheetTitle>
                     <SheetDescription className="text-sm font-medium uppercase tracking-widest text-indigo-500 mt-1">
                        ID: #{warehouse.code}
                     </SheetDescription>
                  </div>
               </SheetHeader>
            </div>

            <div className="p-6">
               <Tabs defaultValue="info" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 mb-6 bg-muted/40 p-1">
                     <TabsTrigger value="info" className="text-xs font-bold uppercase tracking-wider">Overview</TabsTrigger>
                     <TabsTrigger value="stock" className="text-xs font-bold uppercase tracking-wider">Stock</TabsTrigger>
                     <TabsTrigger value="history" className="text-xs font-bold uppercase tracking-wider">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-6 mt-0">
                     <div className="grid grid-cols-1 gap-4">
                        <Card className="border-border/50 shadow-none bg-muted/10">
                           <CardContent className="p-4 space-y-4">
                              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center">
                                 <MapPin className="h-3 w-3 mr-2 text-indigo-500" /> Location Details
                              </h4>
                              <div className="space-y-2">
                                 <p className="text-sm font-medium leading-relaxed">
                                    {warehouse.location} - Cambodian National Hwy 4, PP SEZ Area 2, Phnom Penh.
                                 </p>
                              </div>
                           </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-none bg-muted/10">
                           <CardContent className="p-4 space-y-4">
                              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center">
                                 <User className="h-3 w-3 mr-2 text-indigo-500" /> Contact Representative
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                 <div className="flex items-center text-sm font-medium">
                                    <User className="h-4 w-4 mr-3 text-muted-foreground" />
                                    {warehouse.contactPerson}
                                 </div>
                                 <div className="flex items-center text-sm font-medium">
                                    <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                                    {warehouse.phone}
                                 </div>
                                 <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                    <Mail className="h-4 w-4 mr-3" />
                                    contact@warehouse.com.kh
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     </div>
                  </TabsContent>

                  <TabsContent value="stock" className="space-y-4 mt-0">
                     <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                           <p className="text-[10px] font-bold text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-widest mb-1">Total Items</p>
                           <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{warehouse.stockCount.toLocaleString()}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                           <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest mb-1">Stock Value</p>
                           <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${warehouse.totalStockValue / 1000}k</p>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Stored Categories</h4>
                        {[
                           { name: 'Electronics', count: 450, percentage: 40 },
                           { name: 'Peripherals', count: 280, percentage: 25 },
                           { name: 'Hardware', count: 390, percentage: 35 }
                        ].map((cat, i) => (
                           <div key={i} className="flex flex-col space-y-1.5 p-3 rounded-lg border border-border/40 hover:bg-muted/10 transition-colors">
                              <div className="flex justify-between items-center text-sm font-semibold">
                                 <div className="flex items-center gap-2">
                                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                    {cat.name}
                                 </div>
                                 <span>{cat.count} items</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-0 mt-0">
                     <div className="relative pl-6 border-l-2 border-muted space-y-6 py-2">
                        {[
                           { type: 'STOCK IN', date: 'Oct 24, 2023 - 10:30 AM', desc: '50x MacBook Pro M3 added', icon: Building2, color: 'text-emerald-500' },
                           { type: 'TRANSFER', date: 'Oct 22, 2023 - 02:15 PM', desc: '20x Dell Monitors moved to East Hub', icon: History, color: 'text-indigo-500' },
                           { type: 'STOCK OUT', date: 'Oct 20, 2023 - 09:45 AM', desc: '15x iPad Pro shipped to Client A', icon: Package, color: 'text-rose-500' }
                        ].map((activity, i) => (
                           <div key={i} className="relative group">
                              <div className={`absolute -left-[31px] top-0.5 rounded-full p-1 bg-background border-2 border-muted group-hover:border-primary transition-colors`}>
                                 <activity.icon className={`h-3 w-3 ${activity.color}`} />
                              </div>
                              <div className="space-y-1">
                                 <p className={`text-[10px] font-black uppercase tracking-widest ${activity.color}`}>{activity.type}</p>
                                 <p className="text-sm font-semibold">{activity.desc}</p>
                                 <p className="text-xs text-muted-foreground">{activity.date}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </TabsContent>
               </Tabs>
            </div>
         </SheetContent>
      </Sheet>
   );
};

export default WarehouseDetailDrawer;

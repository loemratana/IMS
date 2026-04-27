import React from 'react';
import {
  Bell,
  AlertTriangle,
  TrendingDown,
  ShieldAlert,
  ArrowUpRight,
  ArrowRight,
  Package,
  Activity,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { alertStatsMock, notificationsMock } from './alertMockData';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

export default function AlertsOverview() {
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Smart Alerts
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse ml-1" />
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Monitor inventory thresholds and automated notification triggers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-xl font-bold gap-2 shadow-sm">
            <Activity className="h-4 w-4" /> Monitoring Status
          </Button>
          <Button className="h-10 rounded-xl font-bold gap-2 shadow-md shadow-indigo-500/20 active:scale-95 transition-all">
            <Bell className="h-4 w-4" /> View All Notifications
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Rules", value: alertStatsMock.activeRules, icon: ShieldAlert, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/30", trend: "Monitoring enabled" },
          { label: "Low Stock", value: alertStatsMock.lowStockAlerts, icon: TrendingDown, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/30", trend: "+2 since yesterday" },
          { label: "Critical Stock", value: alertStatsMock.criticalStockAlerts, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/30", trend: "Action required" },
          { label: "Sent (24h)", value: alertStatsMock.notificationsSent24h, icon: Bell, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-900/30", trend: "100% delivery rate" },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1">
                  {stat.trend}
                </p>
              </div>
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 shadow-sm", stat.bg, stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notifications List */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm bg-card overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-600" />
                Recent Notifications
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs font-bold gap-1 text-muted-foreground hover:text-indigo-600">
                View History <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {notificationsMock.map((notif) => (
                <div key={notif.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-4 cursor-pointer group">
                  <div className={cn(
                    "p-2.5 rounded-xl shrink-0 shadow-sm",
                    notif.type === 'CRITICAL' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                      notif.type === 'WARNING' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  )}>
                    {notif.type === 'CRITICAL' ? <AlertTriangle className="h-5 w-5" /> :
                      notif.type === 'WARNING' ? <TrendingDown className="h-5 w-5" /> :
                        <Bell className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-indigo-600 transition-colors">{notif.title}</h4>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{format(new Date(notif.createdAt), 'HH:mm')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 border-border/50 uppercase tracking-tighter">
                        {notif.channel}
                      </Badge>
                      {notif.entityName && (
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <Package className="h-3 w-3" /> {notif.entityName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alert Rules Quick View */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                Active Channels
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Email Notifications", status: "Connected", icon: "📧", color: "bg-blue-50 text-blue-700" },
                { name: "Telegram Bot", status: "Active", icon: "✈️", color: "bg-sky-50 text-sky-700" },
                { name: "In-App Alerts", status: "Enabled", icon: "🔔", color: "bg-indigo-50 text-indigo-700" }
              ].map((channel, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-indigo-200 transition-colors bg-muted/5 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{channel.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">{channel.name}</span>
                      <span className="text-[10px] font-bold text-emerald-600">{channel.status}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-indigo-600 text-white border-none shadow-xl shadow-indigo-500/20 overflow-hidden relative">
            <div className="absolute -top-12 -right-12 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-24 w-24 bg-indigo-400/20 rounded-full blur-xl" />
            <CardContent className="p-6 relative z-10 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight">Need custom alerts?</h3>
                <p className="text-xs text-indigo-100 font-medium leading-relaxed opacity-90">
                  Configure specific threshold rules for high-value items or sensitive stock movements.
                </p>
              </div>
              <Button variant="secondary" className="w-full font-bold text-xs h-9 rounded-xl shadow-lg shadow-black/10">
                Configure Alert Rules
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stock Health Table */}
      <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/5 flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-rose-500" />
            Stock Health Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search items..." className="h-8 pl-8 text-xs w-48 rounded-lg" />
            </div>
            <Button variant="outline" size="sm" className="h-8 rounded-lg gap-1 text-xs font-bold">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-black uppercase py-4">Product</TableHead>
                <TableHead className="text-xs font-black uppercase py-4">Category</TableHead>
                <TableHead className="text-xs font-black uppercase py-4">Current Stock</TableHead>
                <TableHead className="text-xs font-black uppercase py-4">Threshold</TableHead>
                <TableHead className="text-xs font-black uppercase py-4">Status</TableHead>
                <TableHead className="text-right text-xs font-black uppercase py-4 pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: "High-Performance GPU", sku: "PRD-7241", category: "Hardware", current: 2, threshold: 5, status: "Critical" },
                { name: "Wireless Mouse", sku: "PRD-1120", category: "Peripherals", current: 12, threshold: 20, status: "Low Stock" },
                { name: "Mechanical Keyboard", sku: "PRD-3342", category: "Peripherals", current: 18, threshold: 20, status: "Low Stock" },
                { name: "4K Monitor 27\"", sku: "PRD-9981", category: "Displays", current: 4, threshold: 10, status: "Critical" },
              ].map((item, idx) => (
                <TableRow key={idx} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{item.name}</span>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{item.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">{item.category}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={cn(
                      "text-sm font-black",
                      item.status === 'Critical' ? 'text-rose-600' : 'text-amber-600'
                    )}>{item.current}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-bold text-foreground/70">{item.threshold}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={cn(
                      "text-[10px] font-black uppercase tracking-wider py-0.5 px-2 border-none shadow-sm",
                      item.status === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                    )}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right pr-6">
                    <Button variant="ghost" size="sm" className="h-8 rounded-lg font-bold text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                      Restock <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

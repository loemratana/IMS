import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Users,
  Activity,
  Layers,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { auditMockData, AuditLog, AuditAction, AuditEntity } from './audit/auditMockData';
import { AuditLogTable } from '@/components/audit/AuditLogTable';
import { AuditLogDetailDrawer } from '@/components/audit/AuditLogDetailDrawer';
import { cn } from "@/lib/utils";

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [selectedEntity, setSelectedEntity] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter logic
  const filteredLogs = useMemo(() => {
    return auditMockData.filter(log => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entityName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAction = selectedAction === "ALL" || log.action === selectedAction;
      const matchesEntity = selectedEntity === "ALL" || log.entity === selectedEntity;

      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [searchQuery, selectedAction, selectedEntity]);

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Entity', 'Entity ID', 'Changes'];
    const rows = filteredLogs.map(log => [
      log.timestamp,
      log.userName,
      log.action,
      log.entity,
      log.entityId,
      log.changes?.map(c => `${c.field}: ${c.oldValue} -> ${c.newValue}`).join('; ') || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Audit Logs
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 font-bold ml-2">
              Enterprise
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Complete immutable trail of system activities and data changes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-1.5 shadow-sm bg-card hover:bg-muted font-bold transition-all"
            onClick={exportToCSV}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button
            className="h-9 gap-1.5 shadow-sm font-bold active:scale-95 transition-all"
          >
            <ShieldCheck className="h-4 w-4" /> Policy Center
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: "1,284", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/30", trend: "+12% vs last week" },
          { label: "Active Users", value: "24", icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/30", trend: "Normal activity" },
          { label: "Data Changes", value: "856", icon: RefreshCw, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30", trend: "+5% vs last week" },
          { label: "Security Alerts", value: "0", icon: Clock, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-900/30", trend: "System healthy" },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-all group cursor-default overflow-hidden">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" /> {stat.trend}
                </p>
              </div>
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 shadow-sm", stat.bg, stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-10 py-2 -mx-1 px-1 bg-background/80 backdrop-blur-md">
        <Card className="border-border/50  bg-card/50">
          <CardContent className="p-3 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, entity ID, or record name..."
                className="pl-9 bg-background/50 border-border focus-visible:ring-indigo-500 h-10 rounded-xl shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger className="w-full md:w-[140px] h-10 rounded-xl border-border bg-background/50 font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Action" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="ALL" className="font-bold">All Actions</SelectItem>
                  <SelectItem value="CREATE" className="font-bold">Create</SelectItem>
                  <SelectItem value="UPDATE" className="font-bold">Update</SelectItem>
                  <SelectItem value="DELETE" className="font-bold">Delete</SelectItem>
                  <SelectItem value="APPROVE" className="font-bold">Approve</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger className="w-full md:w-[140px] h-10 rounded-xl border-border bg-background/50 font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Entity" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="ALL" className="font-bold">All Entities</SelectItem>
                  <SelectItem value="PRODUCT" className="font-bold">Products</SelectItem>
                  <SelectItem value="PURCHASE_ORDER" className="font-bold">Purchase Orders</SelectItem>
                  <SelectItem value="SALES_ORDER" className="font-bold">Sales Orders</SelectItem>
                  <SelectItem value="TRANSFER" className="font-bold">Transfers</SelectItem>
                </SelectContent>
              </Select>

              <Separator orientation="vertical" className="h-8 hidden md:block" />

              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-background/50 border-border hover:bg-muted rounded-xl transition-all active:scale-95 shadow-sm">
                <Calendar className="h-4 w-4 text-foreground" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-background/50 border-border hover:bg-muted rounded-xl transition-all active:scale-95 shadow-sm">
                <Filter className="h-4 w-4 text-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Content */}
      <div className="space-y-4">
        {filteredLogs.length > 0 ? (
          <AuditLogTable
            logs={filteredLogs}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <Card className="border-dashed border-border/60 bg-card/30">
            <CardContent className="py-20 flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-extrabold text-foreground tracking-tight">No activity logs found</h3>
              <p className="text-muted-foreground max-w-sm mt-2 font-medium">
                We couldn't find any logs matching your current filters. Try adjusting your search or filter settings.
              </p>
              <Button
                variant="link"
                className="mt-4 text-indigo-600 font-bold hover:no-underline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedAction("ALL");
                  setSelectedEntity("ALL");
                }}
              >
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Drawer */}
      <AuditLogDetailDrawer
        log={selectedLog}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
}

// Sub-components used in header
function Badge({ variant, className, children }: { variant?: any, className?: string, children: React.ReactNode }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variant === "outline" ? "text-foreground" : "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      className
    )}>
      {children}
    </span>
  );
}

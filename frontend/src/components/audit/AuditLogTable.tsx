import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  History, 
  Plus, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  LogIn, 
  LogOut,
  ChevronRight,
  Eye,
  ArrowRight
} from 'lucide-react';
import { AuditLog, AuditAction } from '@/pages/audit/auditMockData';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface AuditLogTableProps {
  logs: AuditLog[];
  onViewDetails: (log: AuditLog) => void;
  isLoading?: boolean;
}

const getActionStyles = (action: AuditAction) => {
  switch (action) {
    case 'CREATE':
      return {
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-500/20',
        icon: Plus
      };
    case 'UPDATE':
      return {
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-200 dark:border-blue-500/20',
        icon: RefreshCw
      };
    case 'DELETE':
      return {
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        border: 'border-rose-200 dark:border-rose-500/20',
        icon: Trash2
      };
    case 'APPROVE':
      return {
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-500/10',
        border: 'border-indigo-200 dark:border-indigo-500/20',
        icon: CheckCircle2
      };
    case 'REJECT':
      return {
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        border: 'border-amber-200 dark:border-amber-500/20',
        icon: XCircle
      };
    case 'LOGIN':
      return {
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-50 dark:bg-slate-500/10',
        border: 'border-slate-200 dark:border-slate-500/20',
        icon: LogIn
      };
    case 'LOGOUT':
      return {
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-50 dark:bg-slate-500/10',
        border: 'border-slate-200 dark:border-slate-500/20',
        icon: LogOut
      };
    default:
      return {
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-50 dark:bg-slate-500/10',
        border: 'border-slate-200 dark:border-slate-500/20',
        icon: History
      };
  }
};

export function AuditLogTable({ logs, onViewDetails, isLoading }: AuditLogTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full animate-pulse bg-muted rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[180px] font-semibold text-xs uppercase tracking-wider py-4">Time</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider py-4">User</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider py-4">Action</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider py-4">Entity</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider py-4">Changes</TableHead>
              <TableHead className="w-[80px] text-right py-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => {
              const styles = getActionStyles(log.action);
              const ActionIcon = styles.icon;
              
              return (
                <TableRow 
                  key={log.id} 
                  className="group hover:bg-muted/30 transition-colors cursor-pointer border-b border-border last:border-0"
                  onMouseEnter={() => setHoveredRow(log.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onViewDetails(log)}
                >
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{format(new Date(log.timestamp), 'yyyy')}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border shadow-sm">
                        <AvatarImage src={log.userAvatar} />
                        <AvatarFallback className="bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          {log.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground leading-tight">{log.userName}</span>
                        <span className="text-xs text-muted-foreground leading-tight">{log.userEmail}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <Badge variant="outline" className={cn("gap-1.5 font-bold uppercase tracking-tight py-0.5 px-2.5 rounded-full border-none shadow-sm transition-all", styles.bg, styles.color)}>
                      <ActionIcon className="h-3 w-3" />
                      {log.action}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground/80 tracking-tight uppercase">{log.entity.replace('_', ' ')}</span>
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 font-mono">{log.entityId}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4 max-w-[300px]">
                    <div className="flex flex-wrap gap-1.5">
                      {log.changes && log.changes.length > 0 ? (
                        log.changes.map((change, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-md border border-border/50">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{change.field}:</span>
                            <span className="text-xs font-medium line-through opacity-50">{String(change.oldValue)}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground/60" />
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{String(change.newValue)}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No field changes</span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn("h-8 w-8 rounded-lg text-muted-foreground hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 transition-all shadow-none", 
                        hoveredRow === log.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                      )}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

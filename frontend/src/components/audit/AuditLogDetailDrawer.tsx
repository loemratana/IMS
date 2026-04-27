import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuditLog } from '@/pages/audit/auditMockData';
import { format } from 'date-fns';
import {
  FileText,
  Code,
  User,
  Calendar,
  Activity,
  Database,
  ArrowRight,
  Info
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface AuditLogDetailDrawerProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetailDrawer({ log, open, onOpenChange }: AuditLogDetailDrawerProps) {
  const [viewMode, setViewMode] = useState<'diff' | 'json'>('diff');

  if (!log) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col gap-0 border-l border-border bg-card">
        <SheetHeader className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 font-bold uppercase tracking-widest text-[10px] py-0.5 px-2">
              Log Details
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">{log.id}</span>
          </div>
          <SheetTitle className="text-2xl font-semibold text-zinc-100 tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-100 border border-zinc-800 shadow-sm">
              <Activity className="h-5 w-5" />
            </div>

            <span className="capitalize text-muted-foreground" >
              {log.action.toLowerCase()} {log.entity.replace('_', ' ')}
            </span>
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm mt-2 font-medium">
            Full audit trail for {log.entityName || log.entityId} performed by {log.userName}.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 grid grid-cols-2 gap-4 border-b border-border bg-muted/5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <User className="h-3 w-3" /> Actor
              </span>
              <p className="text-sm font-bold text-foreground">{log.userName}</p>
              <p className="text-xs text-muted-foreground">{log.userEmail}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> Timestamp
              </span>
              <p className="text-sm font-bold text-foreground">{format(new Date(log.timestamp), 'MMMM d, yyyy')}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(log.timestamp), 'HH:mm:ss (O)')}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Database className="h-3 w-3" /> Entity Type
              </span>
              <p className="text-sm font-bold text-foreground">{log.entity.replace('_', ' ')}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" /> Record ID
              </span>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">{log.entityId}</p>
            </div>
          </div>

          <Tabs defaultValue="diff" className="w-full flex-1 flex flex-col" onValueChange={(v) => setViewMode(v as any)}>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white dark:bg-slate-950">
              <TabsList className="bg-muted/50 p-1 h-9">
                <TabsTrigger value="diff" className="gap-2 text-xs font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <FileText className="h-3.5 w-3.5" /> Visual Diff
                </TabsTrigger>
                <TabsTrigger value="json" className="gap-2 text-xs font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm">
                  <Code className="h-3.5 w-3.5" /> Raw JSON
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <TabsContent value="diff" className="m-0 space-y-6">
                  {log.changes && log.changes.length > 0 ? (
                    <div className="space-y-4">
                      {log.changes.map((change, idx) => (
                        <div key={idx} className="rounded-xl border border-border overflow-hidden bg-white dark:bg-slate-900/50 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/50">
                          <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center justify-between">
                            <span className="text-xs font-black text-foreground uppercase tracking-wider">{change.field}</span>
                          </div>
                          <div className="grid grid-cols-2 divide-x divide-border">
                            <div className="p-4 bg-rose-50/30 dark:bg-rose-950/10">
                              <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest block mb-1">Before</span>
                              <pre className="text-sm font-medium text-rose-800 dark:text-rose-300 whitespace-pre-wrap font-mono leading-relaxed">
                                {String(change.oldValue || 'None')}
                              </pre>
                            </div>
                            <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/10">
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">After</span>
                              <div className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                                <pre className="text-sm font-bold text-emerald-800 dark:text-emerald-300 whitespace-pre-wrap font-mono leading-relaxed">
                                  {String(change.newValue || 'None')}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Info className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">No field-level changes</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mt-1">
                        This action may have been a state change or didn't involve specific property modifications.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="json" className="m-0">
                  <div className="rounded-xl bg-slate-950 p-6 shadow-inner">
                    <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {log.rawJson ? log.rawJson : JSON.stringify(log, null, 2)}
                    </pre>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

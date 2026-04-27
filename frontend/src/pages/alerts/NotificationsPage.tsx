import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  Mail,
  MessageSquare,
  Package,
  AlertTriangle,
  History,
  ExternalLink
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
import { notificationsMock, Notification } from './alertMockData';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredNotifications = notificationsMock.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Notification History
            <History className="h-6 w-6 text-indigo-600 ml-1" />
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Review delivery logs for all automated system alerts and communications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-xl font-bold gap-2 shadow-sm">
            <Calendar className="h-4 w-4" /> Filter Date
          </Button>
          <Button variant="outline" className="h-10 rounded-xl font-bold gap-2 shadow-sm">
            <Download className="h-4 w-4" /> Export logs
          </Button>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-10 py-2 -mx-1 px-1 bg-background/80 backdrop-blur-md">
        <Card className="border-border/50 bg-card/50 shadow-lg shadow-black/5">
          <CardContent className="p-3 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts by content, product name, or status..."
                className="pl-9 bg-background/50 border-border focus-visible:ring-indigo-500 h-10 rounded-xl shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-10 rounded-xl px-4 gap-2 font-bold text-xs">
                All Channels
              </Button>
              <Button variant="outline" className="h-10 rounded-xl px-4 gap-2 font-bold text-xs">
                Any Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Table */}
      <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase py-4 pl-6">Time</TableHead>
                <TableHead className="text-[10px] font-black uppercase py-4">Alert Details</TableHead>
                <TableHead className="text-[10px] font-black uppercase py-4">Product</TableHead>
                <TableHead className="text-[10px] font-black uppercase py-4">Channel</TableHead>
                <TableHead className="text-[10px] font-black uppercase py-4">Status</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase py-4 pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notif) => (
                <TableRow key={notif.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="py-5 pl-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">{format(new Date(notif.createdAt), 'MMM d')}</span>
                      <span className="text-[10px] font-bold text-muted-foreground">{format(new Date(notif.createdAt), 'HH:mm:ss')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-start gap-3 max-w-md">
                      <div className={cn(
                        "h-8 w-8 rounded-lg shrink-0 flex items-center justify-center shadow-sm mt-0.5",
                        notif.type === 'CRITICAL' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                        notif.type === 'WARNING' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      )}>
                        {notif.type === 'CRITICAL' ? <AlertTriangle className="h-4 w-4" /> : 
                         notif.type === 'WARNING' ? <TrendingDown className="h-4 w-4" /> : 
                         <Bell className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-foreground group-hover:text-indigo-600 transition-colors">{notif.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{notif.message}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    {notif.entityName ? (
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="text-xs font-bold text-foreground/80">{notif.entityName}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-2">
                      {notif.channel === 'EMAIL' ? <Mail className="h-4 w-4 text-blue-500" /> :
                       notif.channel === 'TELEGRAM' ? <MessageSquare className="h-4 w-4 text-sky-500" /> :
                       <Bell className="h-4 w-4 text-indigo-500" />}
                      <span className="text-xs font-bold text-foreground/70 uppercase tracking-tight">{notif.channel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-2">
                      {notif.status === 'SENT' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-500" />
                      )}
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        notif.status === 'SENT' ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {notif.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 text-right pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white shadow-none group-hover:shadow-sm">
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-indigo-600" />
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

function TrendingDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

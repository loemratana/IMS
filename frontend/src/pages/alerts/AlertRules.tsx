import React, { useState } from 'react';
import {
  Plus,
  Settings,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Mail,
  MessageSquare,
  Bell,
  Search,
  Filter,
  ShieldAlert,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { alertRulesMock, AlertRule } from './alertMockData';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

export default function AlertRules() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRules = alertRulesMock.filter(rule =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Alert Rules
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold ml-1">
              {alertRulesMock.length} Rules
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Define triggers for stock movements, expiry dates, and system events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-xl font-bold gap-2 shadow-sm">
            <Settings className="h-4 w-4" /> Integration Settings
          </Button>
          <Button className="h-10 rounded-xl font-bold gap-2 shadow-md shadow-indigo-500/20 active:scale-95 transition-all">
            <Plus className="h-4 w-4" /> Create New Rule
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rules by name or description..."
              className="pl-9 bg-background border-border focus-visible:ring-indigo-500 h-10 rounded-xl shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 font-bold px-4">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRules.map((rule) => (
          <Card key={rule.id} className={cn(
            "border-border/50 shadow-sm hover:shadow-md transition-all group flex flex-col h-full",
            !rule.isActive && "opacity-80"
          )}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className={cn(
                  "text-[9px] font-black uppercase tracking-widest py-0.5 px-2 border-none shadow-sm",
                  rule.conditionType === 'THRESHOLD' ? 'bg-indigo-600 text-white' : 'bg-slate-600 text-white'
                )}>
                  {rule.conditionType}
                </Badge>
                <Switch checked={rule.isActive} />
              </div>
              <CardTitle className="text-xl font-black tracking-tight group-hover:text-indigo-600 transition-colors">
                {rule.name}
              </CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground line-clamp-2 mt-1 min-h-[32px]">
                {rule.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-indigo-600" />
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Trigger</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">Stock &lt; {rule.threshold} units</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Scope</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{rule.scope}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block px-1">Channels</span>
                <div className="flex flex-wrap gap-2">
                  {rule.channels.map(channel => (
                    <Badge key={channel} variant="outline" className="bg-white dark:bg-slate-900 border-border/60 text-[10px] font-bold py-0.5 gap-1.5 shadow-sm">
                      {channel === 'EMAIL' ? <Mail className="h-3 w-3 text-blue-500" /> :
                        channel === 'TELEGRAM' ? <MessageSquare className="h-3 w-3 text-sky-500" /> :
                          <Bell className="h-3 w-3 text-indigo-500" />}
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border/50 bg-muted/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground">
                  {rule.lastTriggered ? `Last: ${format(new Date(rule.lastTriggered), 'MMM d, HH:mm')}` : 'Never triggered'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-muted-foreground hover:text-indigo-600 shadow-none">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-600 shadow-none">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}

        {/* Create Rule Empty Card */}
        <button className="border-2 border-dashed border-border/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group min-h-[350px]">
          <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
            <Plus className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight text-foreground">Add New Rule</h3>
            <p className="text-xs text-muted-foreground font-medium max-w-[200px]">
              Set up a custom monitoring condition for your inventory.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

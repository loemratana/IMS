import React from 'react';
import { 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Send, 
  Settings, 
  Globe, 
  Cpu,
  Lock,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AlertSettings() {
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Integration Settings
            <Settings className="h-6 w-6 text-indigo-600 ml-1" />
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Configure notification channels and external API integrations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email Channel */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/5 border-b border-border/50 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black tracking-tight">Email Notifications</CardTitle>
                    <CardDescription className="text-xs font-medium">SMTP server configuration for automated mailing.</CardDescription>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">SMTP Server</Label>
                  <Input defaultValue="smtp.enterprise-mail.com" className="h-10 rounded-xl bg-muted/20 border-border focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Port</Label>
                  <Input defaultValue="587" className="h-10 rounded-xl bg-muted/20 border-border focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Username</Label>
                  <Input defaultValue="alerts@enterprise.com" className="h-10 rounded-xl bg-muted/20 border-border focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Password</Label>
                  <Input type="password" value="••••••••••••" className="h-10 rounded-xl bg-muted/20 border-border focus-visible:ring-indigo-500" />
                </div>
              </div>
              <Separator className="bg-border/40" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-4 w-4 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">SSL/TLS Encryption Active</span>
                </div>
                <Button variant="outline" className="h-9 rounded-xl font-bold gap-2 text-xs shadow-sm">
                  <Send className="h-3.5 w-3.5" /> Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Telegram Channel */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/5 border-b border-border/50 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400 shadow-sm">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black tracking-tight">Telegram Bot Integration</CardTitle>
                    <CardDescription className="text-xs font-medium">Connect your enterprise bot for real-time mobile alerts.</CardDescription>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Bot API Token</Label>
                <Input defaultValue="623849102:AAFv_L-XU93..." className="h-10 rounded-xl bg-muted/20 border-border focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Chat ID (Admin Group)</Label>
                <div className="flex gap-2">
                  <Input defaultValue="-10018473920" className="h-10 rounded-xl bg-muted/20 border-border focus-visible:ring-indigo-500 flex-1" />
                  <Button variant="outline" className="h-10 rounded-xl font-bold px-4 shadow-sm">Fetch ID</Button>
                </div>
              </div>
              <Separator className="bg-border/40" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Webhook Connected</span>
                </div>
                <Button variant="outline" className="h-9 rounded-xl font-bold gap-2 text-xs shadow-sm">
                  <Send className="h-3.5 w-3.5" /> Send Test Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-indigo-50/50 dark:bg-indigo-900/10">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <Info className="h-4 w-4" /> System Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Configure your system notifications to ensure your warehouse team never misses a critical stock movement.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  { label: "Default Sender", value: "ims-alerts@company.com", icon: Globe },
                  { label: "Retry Policy", value: "3 attempts / 10 min", icon: Cpu },
                  { label: "API Version", value: "v2.4 (Enterprise)", icon: Settings }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Webhooks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[11px] font-medium text-muted-foreground">
                Push inventory events to external ERP or tracking systems.
              </p>
              <Button variant="outline" className="w-full h-10 rounded-xl font-bold text-xs gap-2 shadow-sm border-dashed border-border/80">
                 + Add Webhook Endpoint
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black tracking-tight leading-tight">Secure Alerts</h3>
            <p className="text-[11px] font-medium opacity-80 leading-relaxed">
              All notification data is encrypted before transit. We never log full message contents for sensitive stock movements.
            </p>
            <Button variant="secondary" className="w-full font-bold text-xs h-9 rounded-xl">
              Security Docs <ExternalLink className="h-3 w-3 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

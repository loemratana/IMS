import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Edit3, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const activities = [
  { user: "Sarah Chen", initials: "SC", action: "created", target: "PO #4421", meta: "Acme Supplies", time: "2m ago", icon: Plus, tone: "success" as const },
  { user: "Marcus Lee", initials: "ML", action: "updated stock", target: "SKU-2384", meta: "+250 units", time: "14m ago", icon: TrendingUp, tone: "default" as const },
  { user: "Priya Patel", initials: "PP", action: "edited", target: "Wireless Mouse Pro", meta: "Price changed", time: "1h ago", icon: Edit3, tone: "default" as const },
  { user: "James Wilson", initials: "JW", action: "deleted", target: "SKU-1129", meta: "Discontinued", time: "3h ago", icon: Trash2, tone: "destructive" as const },
  { user: "Sarah Chen", initials: "SC", action: "transferred", target: "120 units", meta: "WH-East → WH-West", time: "5h ago", icon: TrendingDown, tone: "default" as const },
];

const toneClass = {
  success: "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
  default: "bg-accent-soft text-accent",
};

export function RecentActivity() {
  return (
    <Card className="shadow-card border-border/60">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Recent activity</CardTitle>
          <CardDescription className="text-xs">Latest audit trail across the workspace</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-8 text-accent hover:text-accent">
          View all <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <ul className="divide-y divide-border">
        {activities.map((a, i) => (
          <li key={i} className="flex items-start gap-3 px-6 py-3 hover:bg-secondary/40 transition-smooth">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-[10px] bg-gradient-brand text-primary-foreground">{a.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{a.user}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>{" "}
                <span className="font-medium">{a.target}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.meta}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className={`${toneClass[a.tone]} border-0 px-1.5 py-0 h-5`}>
                <a.icon className="h-3 w-3" />
              </Badge>
              <span className="text-[10px] text-muted-foreground">{a.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

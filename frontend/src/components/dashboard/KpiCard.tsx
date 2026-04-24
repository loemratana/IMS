import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  delta: number;
  deltaSuffix?: string;
  icon: LucideIcon;
  accent?: "violet" | "blue" | "amber" | "emerald";
}

const accentMap = {
  violet: "from-violet-500/15 to-violet-500/0 text-violet-600 dark:text-violet-300",
  blue: "from-blue-500/15 to-blue-500/0 text-blue-600 dark:text-blue-300",
  amber: "from-amber-500/15 to-amber-500/0 text-amber-600 dark:text-amber-300",
  emerald: "from-emerald-500/15 to-emerald-500/0 text-emerald-600 dark:text-emerald-300",
};

export function KpiCard({ label, value, delta, deltaSuffix = "vs last month", icon: Icon, accent = "violet" }: KpiCardProps) {
  const positive = delta >= 0;
  return (
    <Card className="relative overflow-hidden p-5 shadow-card hover:shadow-elevated transition-smooth border-border/60">
      <div className={cn("absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl opacity-60", accentMap[accent])} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="relative mt-4 flex items-center gap-1.5 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-semibold",
            positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta)}%
        </span>
        <span className="text-muted-foreground">{deltaSuffix}</span>
      </div>
    </Card>
  );
}

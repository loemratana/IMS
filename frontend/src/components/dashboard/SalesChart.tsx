import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const data = [
  { m: "Jan", sales: 32000, orders: 18000 },
  { m: "Feb", sales: 41000, orders: 22000 },
  { m: "Mar", sales: 38000, orders: 24000 },
  { m: "Apr", sales: 52000, orders: 28000 },
  { m: "May", sales: 49000, orders: 31000 },
  { m: "Jun", sales: 61000, orders: 35000 },
  { m: "Jul", sales: 72000, orders: 41000 },
  { m: "Aug", sales: 68000, orders: 39000 },
  { m: "Sep", sales: 81000, orders: 46000 },
  { m: "Oct", sales: 89000, orders: 52000 },
  { m: "Nov", sales: 95000, orders: 58000 },
  { m: "Dec", sales: 110000, orders: 64000 },
];

export function SalesChart() {
  return (
    <Card className="shadow-card border-border/60 col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Sales overview</CardTitle>
          <CardDescription className="text-xs">Revenue and order volume across the year</CardDescription>
        </div>
        <Tabs defaultValue="12m">
          <TabsList className="h-8 bg-secondary/60">
            <TabsTrigger value="3m" className="text-xs h-6">3M</TabsTrigger>
            <TabsTrigger value="6m" className="text-xs h-6">6M</TabsTrigger>
            <TabsTrigger value="12m" className="text-xs h-6">12M</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                  boxShadow: "var(--shadow-elevated)",
                }}
                formatter={(v: number) => `$${v.toLocaleString()}`}
              />
              <Area type="monotone" dataKey="sales" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#salesGrad)" />
              <Area type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#ordersGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

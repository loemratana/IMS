import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Electronics", value: 4200, color: "hsl(252 83% 62%)" },
  { name: "Apparel", value: 2800, color: "hsl(280 80% 65%)" },
  { name: "Home & Kitchen", value: 1900, color: "hsl(199 89% 55%)" },
  { name: "Beauty", value: 1300, color: "hsl(38 95% 55%)" },
  { name: "Sports", value: 900, color: "hsl(152 60% 45%)" },
];

const total = data.reduce((s, d) => s + d.value, 0);

export function InventoryPie() {
  return (
    <Card className="shadow-card border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Inventory distribution</CardTitle>
        <CardDescription className="text-xs">Stock units by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2} stroke="none">
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold">{total.toLocaleString()}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">units</span>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {data.map((d) => (
            <li key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-foreground">{d.name}</span>
              </div>
              <span className="text-muted-foreground font-medium">
                {((d.value / total) * 100).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

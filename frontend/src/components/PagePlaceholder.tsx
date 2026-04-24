import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Card className="shadow-card border-border/60 border-dashed flex flex-col items-center justify-center py-20 text-center">
        <div className="h-12 w-12 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
          <Construction className="h-6 w-6 text-accent" />
        </div>
        <h2 className="text-lg font-semibold">Coming soon</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          This module is scaffolded and ready for your data. Ask Lovable to build it out next.
        </p>
      </Card>
    </div>
  );
}

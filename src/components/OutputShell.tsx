import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function OutputLoading({ label = "AI is working on it…" }: { label?: string }) {
  return (
    <Card className="shadow-card">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4 animate-pulse" aria-hidden="true" />
          {label}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Generating">
          <div className="h-full w-1/3 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-brand-gradient" />
        </div>
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

export function EmptyOutput({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <Card className="border-dashed shadow-none">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">{icon}</span>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

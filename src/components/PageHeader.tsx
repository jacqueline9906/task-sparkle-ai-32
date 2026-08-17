import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)] gap-2">
      <div className="flex min-w-0 items-center gap-3">
        {Icon ? (
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
        <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      </div>
      {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
    </header>
  );
}

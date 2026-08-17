import { Link } from "@tanstack/react-router";
import { ShieldCheck, Sparkles } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex gap-3 rounded-xl border border-border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground ${className}`}
    >
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <p>
        <span className="font-semibold text-foreground">Responsible AI:</span> AI-generated content
        may contain errors or inaccuracies. Always review and verify AI-generated information before
        using it for important workplace decisions, communications, or commitments.{" "}
        <Link to="/responsible-ai" className="font-medium text-primary underline-offset-2 hover:underline">
          Learn more
        </Link>
      </p>
    </div>
  );
}

export function AiLabel({ demo }: { demo?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      {demo ? "AI-generated · Demo Mode" : "AI-generated content"}
    </span>
  );
}

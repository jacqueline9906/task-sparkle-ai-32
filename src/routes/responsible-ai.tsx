import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Eye, SearchCheck, Lock, UserCheck, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "How we approach responsible AI: human review, accuracy verification, privacy awareness and human judgement in workplace decisions.",
      },
      { property: "og:title", content: "Responsible AI — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Principles for using AI-generated workplace content safely and responsibly.",
      },
    ],
  }),
  component: ResponsibleAi,
});

const principles = [
  {
    icon: Eye,
    title: "Human review",
    body: "Every AI output is a first draft. Read it end to end before you send, share or commit to it.",
  },
  {
    icon: SearchCheck,
    title: "Accuracy verification",
    body: "Check names, numbers, dates and commitments against your own records. AI can be confidently wrong.",
  },
  {
    icon: Lock,
    title: "Privacy awareness",
    body: "Avoid pasting personal, confidential or regulated data unless your organisation permits it.",
  },
  {
    icon: UserCheck,
    title: "Support, not replace",
    body: "AI should support human decision-making, never replace responsible professional judgement.",
  },
  {
    icon: Scale,
    title: "No authority claims",
    body: "AI-generated content is not guaranteed factual or authoritative and should not be presented as such.",
  },
];

function ResponsibleAi() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="truncate text-3xl font-bold tracking-tight">Responsible AI</h1>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        AI-generated content may contain errors or inaccuracies. Always review and verify
        AI-generated information before using it for important workplace decisions, communications,
        or commitments.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <Card key={p.title} className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <p.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {p.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{p.body}</CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/app">Back to dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckSquare, FileText, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Generate professional emails, summarize meeting notes and turn goals into prioritized action plans — in one AI productivity workspace.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Email generation, meeting summaries and AI task planning in one workspace.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Mail,
    title: "Write Better Emails",
    body: "Generate professional emails tailored to your purpose and tone.",
  },
  {
    icon: FileText,
    title: "Understand Meetings Faster",
    body: "Convert meeting notes into summaries, decisions, and actionable tasks.",
  },
  {
    icon: CheckSquare,
    title: "Plan Work Intelligently",
    body: "Transform goals into prioritized and manageable action plans.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gradient text-primary-foreground">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="truncate font-semibold">AI Workplace Productivity Assistant</span>
        </div>
        <Button asChild size="sm">
          <Link to="/auth">Get Started</Link>
        </Button>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Work Smarter. Automate More. Get More Done.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          AI Workplace Productivity Assistant brings email generation, meeting summarization, and
          intelligent task planning together in one powerful productivity workspace.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#features">Explore Features</a>
          </Button>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="shadow-card">
              <CardHeader>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <CardTitle className="pt-3 text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:px-6">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            AI-generated content should always be reviewed by a human.
          </p>
          <Link to="/responsible-ai" className="hover:text-foreground hover:underline">
            Responsible AI
          </Link>
        </div>
      </footer>
    </div>
  );
}

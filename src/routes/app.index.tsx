import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckSquare, Clock, FileText, Mail, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { EmptyOutput } from "@/components/OutputShell";
import { useEmails, useMeetings, usePlans, useUser } from "@/lib/store";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const tools = [
  {
    icon: Mail,
    title: "Smart Email Generator",
    description: "Generate clear, professional emails in seconds using AI.",
    cta: "Generate Email",
    to: "/app/email",
  },
  {
    icon: FileText,
    title: "Meeting Notes Summarizer",
    description: "Transform meeting notes into concise summaries, decisions, and action items.",
    cta: "Summarize Meeting",
    to: "/app/meetings",
  },
  {
    icon: CheckSquare,
    title: "AI Task Planner",
    description: "Turn goals and tasks into an organized, prioritized action plan.",
    cta: "Create Task Plan",
    to: "/app/tasks",
  },
] as const;

function Dashboard() {
  const { user } = useUser();
  const { emails } = useEmails();
  const { meetings } = useMeetings();
  const { plans } = usePlans();

  const minutesSaved = emails.length * 12 + meetings.length * 25 + plans.length * 20;
  const timeSaved =
    minutesSaved >= 60
      ? `${Math.floor(minutesSaved / 60)}h ${minutesSaved % 60}m`
      : `${minutesSaved}m`;

  const stats = [
    { label: "Emails Generated", value: emails.length, icon: Mail },
    { label: "Meetings Summarized", value: meetings.length, icon: FileText },
    { label: "Tasks Planned", value: plans.reduce((n, p) => n + p.tasks.length, 0), icon: CheckSquare },
    { label: "Estimated Time Saved", value: timeSaved, icon: Clock },
  ];

  const recent = [
    ...emails.map((e) => ({
      id: e.id,
      type: "Email",
      title: e.subject,
      preview: e.body.slice(0, 110),
      date: e.created_at,
      to: "/app/email" as const,
    })),
    ...meetings.map((m) => ({
      id: m.id,
      type: "Meeting",
      title: m.meeting_title || "Untitled meeting",
      preview: m.summary.slice(0, 110),
      date: m.created_at,
      to: "/app/meetings" as const,
    })),
    ...plans.map((p) => ({
      id: p.id,
      type: "Task Plan",
      title: p.goal.slice(0, 60),
      preview: p.tasks.map((t) => t.name).join(", ").slice(0, 110),
      date: p.created_at,
      to: "/app/tasks" as const,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm font-medium text-primary">AI Workplace Productivity Assistant</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting()}, {user?.name?.split(" ")[0] ?? "there"}! 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Work smarter, automate routine tasks, and get more done with AI.
        </p>
      </header>

      <section aria-labelledby="overview">
        <h2 id="overview" className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" /> Productivity overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="shadow-card">
              <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pt-6">
                <div className="min-w-0">
                  <p className="truncate text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold">{s.value}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="tools">
        <h2 id="tools" className="mb-3 text-sm font-semibold">
          AI productivity tools
        </h2>
        <div className="grid gap-5 lg:grid-cols-3">
          {tools.map((t) => (
            <Card key={t.title} className="flex flex-col shadow-card">
              <CardHeader>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground">
                  <t.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <CardTitle className="pt-3 text-lg">{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full">
                  <Link to={t.to}>{t.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="recent">
        <h2 id="recent" className="mb-3 text-sm font-semibold">
          Recent activity
        </h2>
        {recent.length === 0 ? (
          <EmptyOutput
            icon={<Clock className="h-5 w-5" />}
            title="Nothing here yet"
            description="Generate an email, summary or task plan and it will appear here."
          />
        ) : (
          <div className="space-y-3">
            {recent.map((r) => (
              <Card key={r.id} className="shadow-card">
                <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pt-6">
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{r.title}</p>
                      <Badge variant="secondary">{r.type}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.preview}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(r.date).toLocaleString()}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/app/history">Open</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <AiDisclaimer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckSquare, FileText, History, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { EmptyOutput } from "@/components/OutputShell";
import { useEmails, useMeetings, usePlans } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/history")({
  component: HistoryPage,
});

type Item = {
  id: string;
  kind: "Email" | "Meeting" | "Task Plan";
  title: string;
  preview: string;
  date: string;
  content: string;
};

function HistoryPage() {
  const { emails, remove: removeEmail } = useEmails();
  const { meetings, remove: removeMeeting } = useMeetings();
  const { plans, remove: removePlan } = usePlans();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [open, setOpen] = useState<Item | null>(null);

  const items: Item[] = [
    ...emails.map((e) => ({
      id: e.id,
      kind: "Email" as const,
      title: e.subject,
      preview: e.body.slice(0, 140),
      date: e.created_at,
      content: `Subject: ${e.subject}\n\n${e.body}`,
    })),
    ...meetings.map((m) => ({
      id: m.id,
      kind: "Meeting" as const,
      title: m.meeting_title,
      preview: m.summary.slice(0, 140),
      date: m.created_at,
      content: `${m.summary}\n\nDecisions:\n${m.decisions.map((d) => `- ${d}`).join("\n")}\n\nAction items:\n${m.action_items
        .map((a) => `- ${a.task} (${a.assignee}, ${a.priority}, ${a.due_date})`)
        .join("\n")}`,
    })),
    ...plans.map((p) => ({
      id: p.id,
      kind: "Task Plan" as const,
      title: p.goal.slice(0, 70),
      preview: p.tasks.map((t) => t.name).join(", ").slice(0, 140),
      date: p.created_at,
      content: p.tasks
        .map((t) => `${t.status === "done" ? "[x]" : "[ ]"} ${t.name} — ${t.description}`)
        .join("\n"),
    })),
  ];

  const del = (item: Item) => {
    if (item.kind === "Email") removeEmail(item.id);
    if (item.kind === "Meeting") removeMeeting(item.id);
    if (item.kind === "Task Plan") removePlan(item.id);
    toast.success("Deleted");
  };

  const filtered = (kind?: Item["kind"]) =>
    items
      .filter((i) => (kind ? i.kind === kind : true))
      .filter((i) =>
        query.trim()
          ? (i.title + i.preview).toLowerCase().includes(query.trim().toLowerCase())
          : true,
      )
      .sort((a, b) =>
        sort === "newest"
          ? b.date.localeCompare(a.date)
          : sort === "oldest"
            ? a.date.localeCompare(b.date)
            : a.title.localeCompare(b.title),
      );

  const List = ({ kind }: { kind?: Item["kind"] }) => {
    const rows = filtered(kind);
    if (rows.length === 0)
      return (
        <EmptyOutput
          icon={<History className="h-5 w-5" />}
          title="Nothing saved yet"
          description="Saved emails, meeting summaries and task plans will show up here."
        />
      );
    return (
      <div className="space-y-3">
        {rows.map((i) => (
          <Card key={i.id} className="shadow-card">
            <CardContent className="grid gap-3 pt-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{i.title || "Untitled"}</p>
                  <Badge variant="secondary" className="gap-1">
                    {i.kind === "Email" ? (
                      <Mail className="h-3 w-3" />
                    ) : i.kind === "Meeting" ? (
                      <FileText className="h-3 w-3" />
                    ) : (
                      <CheckSquare className="h-3 w-3" />
                    )}
                    {i.kind}
                  </Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{i.preview}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(i.date).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setOpen(i)}>
                  Open
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Delete ${i.title}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently removes it from your history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => del(i)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={History}
        title="History"
        subtitle="Reopen, search and manage everything you've generated."
      />

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
        <div className="space-y-2">
          <Label htmlFor="history-search">Search</Label>
          <Input
            id="history-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles and previews…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="history-sort">Sort by</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="history-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title">Title A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="plans">Task Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <List />
        </TabsContent>
        <TabsContent value="emails" className="mt-4">
          <List kind="Email" />
        </TabsContent>
        <TabsContent value="meetings" className="mt-4">
          <List kind="Meeting" />
        </TabsContent>
        <TabsContent value="plans" className="mt-4">
          <List kind="Task Plan" />
        </TabsContent>
      </Tabs>

      <AiDisclaimer />

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pr-6">{open?.title}</DialogTitle>
            <DialogDescription>
              {open?.kind} · {open ? new Date(open.date).toLocaleString() : ""}
            </DialogDescription>
          </DialogHeader>
          <pre className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
            {open?.content}
          </pre>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(open?.content ?? "");
              toast.success("Copied");
            }}
          >
            Copy
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

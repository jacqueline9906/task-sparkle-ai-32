import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Copy, Download, FileText, Pencil, RefreshCw, Save, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer, AiLabel } from "@/components/AiDisclaimer";
import { EmptyOutput, OutputLoading } from "@/components/OutputShell";
import { summarizeMeeting } from "@/lib/ai.functions";
import { uid, useMeetings, usePrefs, useUser } from "@/lib/store";
import type { ActionItem } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/app/meetings")({
  component: MeetingsPage,
});

type Result = {
  summary: string;
  key_points: string[];
  decisions: string[];
  action_items: ActionItem[];
  follow_up_questions: string[];
  demo: boolean;
};

function MeetingsPage() {
  const { user } = useUser();
  const { prefs } = usePrefs();
  const { save } = useMeetings();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [participants, setParticipants] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [editing, setEditing] = useState(false);

  const run = async () => {
    if (notes.trim().length < 20) {
      setError("Please paste at least a couple of lines of meeting notes.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await summarizeMeeting({
        data: { title, date, participants, notes: notes.trim(), length: prefs.defaultSummaryLength },
      });
      setResult(res as Result);
      setEditing(false);
      toast.success(res.demo ? "Summary ready (Demo Mode)" : "Summary ready");
    } catch {
      toast.error("Something went wrong summarizing your notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const asText = (r: Result) =>
    [
      `Meeting: ${title}`,
      `Date: ${date}`,
      `Participants: ${participants}`,
      "",
      "EXECUTIVE SUMMARY",
      r.summary,
      "",
      "KEY DISCUSSION POINTS",
      ...r.key_points.map((p) => `- ${p}`),
      "",
      "DECISIONS MADE",
      ...r.decisions.map((d) => `- ${d}`),
      "",
      "ACTION ITEMS",
      ...r.action_items.map((a) => `- ${a.task} | ${a.assignee} | ${a.priority} | ${a.due_date}`),
      "",
      "FOLLOW-UP QUESTIONS",
      ...r.follow_up_questions.map((q) => `- ${q}`),
    ].join("\n");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        subtitle="Turn lengthy meeting notes into clear summaries and actionable outcomes."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Meeting details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="m-title">Meeting title</Label>
              <Input id="m-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="m-date">Meeting date</Label>
                <Input id="m-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-participants">Participants</Label>
                <Input
                  id="m-participants"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="Ana, Ben, Chloe"
                  maxLength={300}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="m-notes">Meeting notes</Label>
              <Textarea
                id="m-notes"
                rows={12}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your meeting notes here..."
                maxLength={20000}
              />
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.md,.csv,.log,text/plain"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const text = await file.text();
                  setNotes(text.slice(0, 20000));
                  if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
                  toast.success(`Loaded ${file.name}`);
                }}
              />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4" /> Upload notes (.txt, .md)
              </Button>
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button onClick={run} disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {loading ? "Summarizing…" : "Summarize Meeting"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading ? (
            <OutputLoading label="Analysing your meeting notes…" />
          ) : !result ? (
            <EmptyOutput
              icon={<FileText className="h-5 w-5" />}
              title="Your summary will appear here"
              description="Paste or upload notes and we'll extract decisions and action items."
            />
          ) : (
            <Card className="shadow-card">
              <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <CardTitle className="truncate text-base">Meeting summary</CardTitle>
                <AiLabel demo={result.demo} />
              </CardHeader>
              <CardContent className="space-y-6">
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold">Executive summary</h3>
                  {editing ? (
                    <Textarea
                      rows={4}
                      value={result.summary}
                      onChange={(e) => setResult({ ...result, summary: e.target.value })}
                      aria-label="Executive summary"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
                  )}
                </section>

                <BulletSection title="Key discussion points" items={result.key_points} />
                <BulletSection title="Decisions made" items={result.decisions} />

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold">Action items</h3>
                  {result.action_items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No action items identified.</p>
                  ) : (
                    <ul className="space-y-2">
                      {result.action_items.map((a, i) => (
                        <li
                          key={i}
                          className="grid gap-1 rounded-xl border border-border p-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                        >
                          <div className="min-w-0">
                            <p className="font-medium">{a.task}</p>
                            <p className="text-xs text-muted-foreground">
                              {a.assignee || "Unassigned"} · due {a.due_date || "TBD"}
                            </p>
                          </div>
                          <Badge variant="secondary" className="w-fit">
                            {a.priority}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <BulletSection title="Follow-up questions" items={result.follow_up_questions} />

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(asText(result));
                      toast.success("Summary copied");
                    }}
                  >
                    <Copy className="h-4 w-4" /> Copy Summary
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
                    <Pencil className="h-4 w-4" /> {editing ? "Done editing" : "Edit"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={run}>
                    <RefreshCw className="h-4 w-4" /> Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([asText(result)], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${title || "meeting"}-summary.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success("Download started");
                    }}
                  >
                    <Download className="h-4 w-4" /> Download
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      save({
                        id: uid(),
                        user_id: user?.id ?? "demo",
                        meeting_title: title || "Untitled meeting",
                        meeting_date: date,
                        participants,
                        original_notes: notes,
                        summary: result.summary,
                        key_points: result.key_points,
                        decisions: result.decisions,
                        action_items: result.action_items,
                        follow_up_questions: result.follow_up_questions,
                        created_at: new Date().toISOString(),
                        demo: result.demo,
                      });
                      toast.success("Saved to history");
                    }}
                  >
                    <Save className="h-4 w-4" /> Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          <AiDisclaimer />
        </div>
      </div>
    </div>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing identified.</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

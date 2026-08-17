import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckSquare,
  Download,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { AiDisclaimer, AiLabel } from "@/components/AiDisclaimer";
import { EmptyOutput, OutputLoading } from "@/components/OutputShell";
import { generateTaskPlan } from "@/lib/ai.functions";
import { uid, usePlans, usePrefs, useUser } from "@/lib/store";
import type { PlanTask } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/app/tasks")({
  component: TasksPage,
});

const PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const TIMES = ["30 minutes", "1 hour", "2 hours", "Half day", "Full day", "Multiple days"];

function TasksPage() {
  const { user } = useUser();
  const { prefs } = usePrefs();
  const { save } = usePlans();

  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState(prefs.defaultPriority);
  const [availableTime, setAvailableTime] = useState("2 hours");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<PlanTask[] | null>(null);
  const [demo, setDemo] = useState(false);

  const run = async () => {
    if (goal.trim().length < 5) {
      setError("Tell us what you need to accomplish (at least 5 characters).");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await generateTaskPlan({
        data: { goal: goal.trim(), deadline, priority, availableTime },
      });
      setDemo(res.demo);
      setTasks(
        res.tasks.map((t) => ({
          id: uid(),
          name: t.name ?? "Task",
          description: t.description ?? "",
          priority: t.priority ?? "Medium",
          duration: t.duration ?? availableTime,
          deadline: t.deadline ?? "TBD",
          status: "todo" as const,
        })),
      );
      toast.success(res.demo ? "Plan created (Demo Mode)" : "Plan created");
    } catch {
      toast.error("Something went wrong creating your plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const done = tasks?.filter((t) => t.status === "done").length ?? 0;
  const total = tasks?.length ?? 0;

  const update = (id: string, patch: Partial<PlanTask>) =>
    setTasks((cur) => cur!.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const move = (index: number, dir: -1 | 1) =>
    setTasks((cur) => {
      if (!cur) return cur;
      const next = [...cur];
      const target = index + dir;
      if (target < 0 || target >= next.length) return cur;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CheckSquare}
        title="AI Task Planner"
        subtitle="Turn your goals into a practical, prioritized action plan."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Your goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Textarea
                id="goal"
                rows={6}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What do you need to accomplish?"
                maxLength={2000}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority" aria-label="Priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Available time</Label>
              <Select value={availableTime} onValueChange={setAvailableTime}>
                <SelectTrigger id="time" aria-label="Available time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button onClick={run} disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {loading ? "Planning…" : "Create My Plan"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading ? (
            <OutputLoading label="Building your action plan…" />
          ) : !tasks ? (
            <EmptyOutput
              icon={<CheckSquare className="h-5 w-5" />}
              title="Your plan will appear here"
              description="Describe a goal and we'll break it into prioritized, time-boxed tasks."
            />
          ) : (
            <Card className="shadow-card">
              <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <CardTitle className="truncate text-base">AI recommended plan</CardTitle>
                <AiLabel demo={demo} />
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-xl bg-muted/50 p-3 text-sm">
                  <p className="text-xs font-medium text-muted-foreground">Goal</p>
                  <p className="mt-1">{goal}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {done} of {total} tasks completed
                  </p>
                  <Progress value={total ? (done / total) * 100 : 0} aria-label="Plan progress" />
                </div>

                <ul className="space-y-3">
                  {tasks.map((t, i) => (
                    <li key={t.id} className="rounded-xl border border-border p-3">
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                        <Checkbox
                          checked={t.status === "done"}
                          onCheckedChange={(v) => update(t.id, { status: v ? "done" : "todo" })}
                          aria-label={`Mark ${t.name} complete`}
                          className="mt-1"
                        />
                        <div className="min-w-0 space-y-1">
                          <Input
                            value={t.name}
                            onChange={(e) => update(t.id, { name: e.target.value })}
                            aria-label="Task name"
                            className={`h-8 border-0 px-0 font-medium shadow-none focus-visible:ring-0 ${
                              t.status === "done" ? "text-muted-foreground line-through" : ""
                            }`}
                          />
                          <Textarea
                            value={t.description}
                            onChange={(e) => update(t.id, { description: e.target.value })}
                            aria-label="Task description"
                            rows={2}
                            className="resize-none border-0 px-0 text-sm text-muted-foreground shadow-none focus-visible:ring-0"
                          />
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary">{t.priority}</Badge>
                            <span>{t.duration}</span>
                            <span>· due {t.deadline || "TBD"}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Move task up"
                            onClick={() => move(i, -1)}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Move task down"
                            onClick={() => move(i, 1)}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete task"
                            onClick={() => {
                              setTasks((cur) => cur!.filter((x) => x.id !== t.id));
                              toast.success("Task deleted");
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTasks((cur) => [
                      ...(cur ?? []),
                      {
                        id: uid(),
                        name: "New task",
                        description: "",
                        priority: "Medium",
                        duration: availableTime,
                        deadline: deadline || "TBD",
                        status: "todo",
                      },
                    ])
                  }
                >
                  <Plus className="h-4 w-4" /> Add task
                </Button>

                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button variant="outline" size="sm" onClick={run}>
                    <RefreshCw className="h-4 w-4" /> Regenerate Plan
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      save({
                        id: uid(),
                        user_id: user?.id ?? "demo",
                        goal,
                        deadline,
                        priority,
                        available_time: availableTime,
                        tasks,
                        created_at: new Date().toISOString(),
                        demo,
                      });
                      toast.success("Plan saved to history");
                    }}
                  >
                    <Save className="h-4 w-4" /> Save Plan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const text = [
                        `Goal: ${goal}`,
                        `Deadline: ${deadline || "TBD"} | Priority: ${priority}`,
                        "",
                        ...tasks.map(
                          (t, i) =>
                            `${i + 1}. [${t.status === "done" ? "x" : " "}] ${t.name} (${t.priority}, ${t.duration}, due ${t.deadline})\n   ${t.description}`,
                        ),
                      ].join("\n");
                      const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "task-plan.txt";
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success("Download started");
                    }}
                  >
                    <Download className="h-4 w-4" /> Export Plan
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

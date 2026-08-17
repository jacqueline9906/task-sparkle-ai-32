import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Mail, Pencil, RefreshCw, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { generateEmail } from "@/lib/ai.functions";
import { uid, useEmails, usePrefs, useUser } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/email")({
  component: EmailPage,
});

const PURPOSES = [
  "Follow-up",
  "Meeting Request",
  "Introduction",
  "Thank You",
  "Request",
  "Apology",
  "Announcement",
  "Customer Response",
  "Job Application",
  "Other",
];
const RECIPIENTS = ["Manager", "Colleague", "Client", "Customer", "Supplier", "Executive", "Other"];
const TONES = ["Professional", "Friendly", "Formal", "Concise", "Persuasive", "Casual"];

function EmailPage() {
  const { user } = useUser();
  const { prefs } = usePrefs();
  const { save } = useEmails();

  const [purpose, setPurpose] = useState("Follow-up");
  const [recipient, setRecipient] = useState("Colleague");
  const [tone, setTone] = useState(prefs.defaultTone);
  const [keyPoints, setKeyPoints] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ subject: string; body: string; demo: boolean } | null>(null);
  const [editing, setEditing] = useState(false);

  const run = async () => {
    if (keyPoints.trim().length < 5) {
      setError("Please describe what you want to communicate (at least 5 characters).");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await generateEmail({
        data: { purpose, recipient, tone, keyPoints: keyPoints.trim(), instructions },
      });
      setResult(res);
      setEditing(false);
      toast.success(res.demo ? "Email generated (Demo Mode)" : "Email generated");
    } catch {
      toast.error("Something went wrong generating your email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        subtitle="Create professional, effective emails with the help of AI."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Picker id="purpose" label="Email purpose" value={purpose} onChange={setPurpose} options={PURPOSES} />
              <Picker id="recipient" label="Recipient" value={recipient} onChange={setRecipient} options={RECIPIENTS} />
            </div>
            <Picker id="tone" label="Tone" value={tone} onChange={setTone} options={TONES} />
            <div className="space-y-2">
              <Label htmlFor="key-points">Key points</Label>
              <Textarea
                id="key-points"
                rows={6}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Describe what you want to communicate..."
                maxLength={4000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Additional instructions (optional)</Label>
              <Textarea
                id="instructions"
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. keep it under 120 words, mention Friday's deadline"
                maxLength={1000}
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button onClick={run} disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading ? (
            <OutputLoading label="Drafting your email…" />
          ) : !result ? (
            <EmptyOutput
              icon={<Mail className="h-5 w-5" />}
              title="Your email will appear here"
              description="Fill in the purpose, tone and key points, then generate a draft."
            />
          ) : (
            <Card className="shadow-card">
              <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <CardTitle className="truncate text-base">Generated email</CardTitle>
                <AiLabel demo={result.demo} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={result.subject}
                    readOnly={!editing}
                    onChange={(e) => setResult({ ...result, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Email body</Label>
                  <Textarea
                    id="body"
                    rows={14}
                    value={result.body}
                    readOnly={!editing}
                    onChange={(e) => setResult({ ...result, body: e.target.value })}
                    className={editing ? "" : "bg-muted/40"}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="h-4 w-4" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
                    <Pencil className="h-4 w-4" /> {editing ? "Done editing" : "Edit"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={run} disabled={loading}>
                    <RefreshCw className="h-4 w-4" /> Regenerate
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      save({
                        id: uid(),
                        user_id: user?.id ?? "demo",
                        purpose,
                        recipient,
                        tone,
                        key_points: keyPoints,
                        instructions,
                        subject: result.subject,
                        body: result.body,
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

function Picker({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label={label}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

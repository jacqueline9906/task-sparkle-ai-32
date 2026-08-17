import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { applyTheme, usePrefs, useUser } from "@/lib/store";
import type { Preferences } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, setUser } = useUser();
  const { prefs, setPrefs } = usePrefs();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");

  const patch = (p: Partial<Preferences>) => setPrefs({ ...prefs, ...p });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        subtitle="Manage your profile, AI defaults, appearance and notifications."
      />

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>How you appear across the workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {avatar ? <AvatarImage src={avatar} alt="" /> : null}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(name || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="avatar">Profile image URL</Label>
              <Input id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <Button
            onClick={() => {
              if (!user) return;
              if (name.trim().length < 2) {
                toast.error("Please enter your name");
                return;
              }
              setUser({ ...user, name: name.trim(), email: email.trim(), avatar });
              toast.success("Profile updated");
            }}
          >
            Save profile
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">AI preferences</CardTitle>
          <CardDescription>Defaults applied when you open a tool.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Pref
            id="tone"
            label="Default email tone"
            value={prefs.defaultTone}
            onChange={(v) => patch({ defaultTone: v })}
            options={["Professional", "Friendly", "Formal", "Concise", "Persuasive", "Casual"]}
          />
          <Pref
            id="length"
            label="Default summary length"
            value={prefs.defaultSummaryLength}
            onChange={(v) => patch({ defaultSummaryLength: v })}
            options={["Concise", "Balanced", "Detailed"]}
          />
          <Pref
            id="task-priority"
            label="Default task priority"
            value={prefs.defaultPriority}
            onChange={(v) => patch({ defaultPriority: v })}
            options={["Low", "Medium", "High", "Urgent"]}
          />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={prefs.theme}
              onValueChange={(v) => {
                patch({ theme: v as Preferences["theme"] });
                applyTheme(v as Preferences["theme"]);
              }}
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle
            id="email-notifications"
            label="Email notifications"
            checked={prefs.emailNotifications}
            onChange={(v) => patch({ emailNotifications: v })}
          />
          <Toggle
            id="reminders"
            label="Productivity reminders"
            checked={prefs.productivityReminders}
            onChange={(v) => patch({ productivityReminders: v })}
          />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" /> Responsible AI
          </CardTitle>
          <CardDescription>
            Review how to use AI-generated content safely at work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/responsible-ai">Read our Responsible AI principles</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Pref({
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
        <SelectTrigger id={id}>
          <SelectValue />
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

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/lib/store";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Sign in or create an account to access your AI productivity workspace.",
      },
      { property: "og:title", content: "Sign in — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Access your AI productivity workspace." },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email({ message: "Enter a valid email address" }).max(255);

function AuthPage() {
  const { signIn } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (mode: "login" | "signup") => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Invalid email");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (mode === "signup" && name.trim().length < 2) return setError("Please enter your name");
    setError("");
    const displayName =
      mode === "signup" ? name.trim() : (parsed.data.split("@")[0] ?? "User").replace(/[._]/g, " ");
    signIn(displayName, parsed.data);
    toast.success(mode === "signup" ? "Account created" : "Welcome back!");
    navigate({ to: "/app", replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-primary-foreground">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-semibold">AI Workplace Productivity Assistant</span>
        </Link>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Demo access mode — no backend is configured, so your account and content stay on this
              device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
                <TabsTrigger value="forgot">Reset</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-4 space-y-4">
                <Field id="login-email" label="Email" type="email" value={email} onChange={setEmail} />
                <Field
                  id="login-password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                />
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <Button className="w-full" onClick={() => submit("login")}>
                  Log in
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="mt-4 space-y-4">
                <Field id="signup-name" label="Full name" value={name} onChange={setName} />
                <Field id="signup-email" label="Email" type="email" value={email} onChange={setEmail} />
                <Field
                  id="signup-password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                />
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <Button className="w-full" onClick={() => submit("signup")}>
                  Create account
                </Button>
              </TabsContent>

              <TabsContent value="forgot" className="mt-4 space-y-4">
                <Field id="reset-email" label="Email" type="email" value={email} onChange={setEmail} />
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    const parsed = emailSchema.safeParse(email);
                    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Invalid email");
                    setError("");
                    toast.success("Reset link sent", {
                      description: "Demo mode: no email is actually delivered.",
                    });
                  }}
                >
                  Send reset link
                </Button>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

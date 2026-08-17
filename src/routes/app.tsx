import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Search, Settings, Sun, Moon } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { applyTheme, usePrefs, useUser } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { user, hydrated, signOut } = useUser();
  const { prefs, setPrefs } = usePrefs();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/auth", replace: true });
  }, [hydrated, user, navigate]);

  if (!hydrated || !user) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading your workspace…
      </div>
    );
  }

  const dark = prefs.theme === "dark";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-border bg-background/85 px-3 py-2 backdrop-blur sm:px-4">
            <SidebarTrigger aria-label="Toggle navigation" />
            <div className="relative min-w-0">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="global-search" className="sr-only">
                Search your workspace
              </label>
              <Input
                id="global-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate({ to: "/app/history" });
                }}
                placeholder="Search history…"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle dark mode"
                onClick={() => {
                  const next = dark ? "light" : "dark";
                  setPrefs({ ...prefs, theme: next });
                  applyTheme(next);
                }}
              >
                {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                onClick={() => toast("No new notifications", { description: "You're all caught up." })}
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Settings" asChild>
                <Link to="/app/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User profile">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/app/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/responsible-ai">Responsible AI</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      signOut();
                      toast.success("Signed out");
                      navigate({ to: "/", replace: true });
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
            <Outlet />
          </main>
          <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
            <Link to="/responsible-ai" className="hover:text-foreground hover:underline">
              Responsible AI
            </Link>
            <span className="mx-2">·</span>
            AI Workplace Productivity Assistant
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}

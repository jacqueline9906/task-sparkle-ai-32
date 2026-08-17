import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  CheckSquare,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/lib/store";
import { toast } from "sonner";

type NavItem = { title: string; url: string; icon: LucideIcon; exact?: boolean };

const items: NavItem[] = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "Smart Email Generator", url: "/app/email", icon: Mail },
  { title: "Meeting Notes Summarizer", url: "/app/meetings", icon: FileText },
  { title: "AI Task Planner", url: "/app/tasks", icon: CheckSquare },
  { title: "History", url: "/app/history", icon: History },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { user, signOut } = useUser();
  const navigate = useNavigate();

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url || pathname === `${url}/` : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex min-w-0 items-center gap-2 px-1 py-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-gradient text-primary-foreground">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          {!collapsed && (
            <span className="truncate text-sm font-semibold leading-tight">AI Workplace</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url, item.exact)}
                    tooltip={item.title}
                  >
                    <Link to={item.url} aria-label={item.title}>
                      <item.icon aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={user?.name ?? "Profile"}>
              <Link to="/app/settings">
                <span
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  aria-hidden="true"
                >
                  {(user?.name ?? "U").charAt(0).toUpperCase()}
                </span>
                <span className="truncate">{user?.name ?? "Profile"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link to="/app/settings">
                <Settings aria-hidden="true" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              onClick={() => {
                signOut();
                toast.success("Signed out");
                navigate({ to: "/", replace: true });
              }}
            >
              <LogOut aria-hidden="true" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

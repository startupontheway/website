import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, FileText, Users, LogOut, Tag } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/blogs", label: "Blogs", icon: FileText, exact: false },
  { to: "/admin/categories", label: "Categories", icon: Tag, exact: false },
  { to: "/admin/leads", label: "Leads", icon: Users, exact: false },
] as const;

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/admin/login";

  useEffect(() => {
    if (loading || isLogin) return;
    if (!user) navigate({ to: "/admin/login" });
  }, [user, loading, navigate, isLogin]);

  if (isLogin) return <Outlet />;

  if (loading || (user && isAdmin === null)) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-6 text-center">
        <div className="max-w-md">
          <h1 className="h-display text-3xl">Not authorized</h1>
          <p className="mt-2 text-muted-foreground">
            Your account is signed in but does not have admin access. Contact an existing admin to grant the
            <code className="mx-1 rounded bg-muted px-1">admin</code> role.
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
            className="mt-6 rounded-full border border-border bg-card px-4 py-2 text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background text-[11px] font-semibold">S</span>
          <span className="font-display text-base">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "bg-foreground text-background" }}
              activeOptions={{ exact: n.exact }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted"
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="mb-3 truncate px-2 text-xs text-muted-foreground">{user.email}</div>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

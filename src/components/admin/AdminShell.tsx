import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import {
  LayoutDashboard,
  Gem,
  Sparkles,
  ShoppingBag,
  CalendarClock,
  LogOut,
  Menu,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";
import { useIsAdmin } from "@/lib/admin-context";
import { useAuth } from "@/lib/auth-context";

const NAV: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/gemstones", label: "Gemstones", icon: Gem },
  { to: "/admin/jewelry", label: "Jewelry", icon: Sparkles },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/admin/seed", label: "Seed Data", icon: UploadCloud },
];

export function AdminGate({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/admin/login", replace: true });
  }, [isAdmin, loading, navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="eyebrow">Verifying access…</p>
      </div>
    );
  }
  return <AdminShell>{children}</AdminShell>;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-background transform transition-transform lg:relative lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border">
          <p className="eyebrow">Disal · Admin</p>
          <p className="mt-2 font-display text-lg leading-tight truncate">
            {user?.email}
          </p>
        </div>
        <nav className="p-3 space-y-1">
          {NAV.map((n) => {
            const active = n.exact
              ? pathname === n.to
              : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to as any}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition ${
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-border">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 border-b border-border bg-background px-4 py-3 flex items-center gap-3">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <p className="eyebrow">Disal · Admin</p>
        </header>
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}

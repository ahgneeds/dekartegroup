import { NavLink, Outlet, Navigate, Link } from "react-router-dom";
import { Inbox, LogOut, ExternalLink, Settings } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { useAdminSession } from "@/hooks/use-admin-session";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin/dashboard", label: "Demandes", icon: Inbox },
  { to: "/admin/dashboard#settings", label: "Réglages", icon: Settings },
];

const AdminLayout = () => {
  const { session, loading } = useAdminSession();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie.");
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-muted/40">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex min-h-full bg-muted/40">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-60 flex-col border-e border-border bg-card md:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link to="/" className="inline-flex">
            <Logo compact />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin/dashboard"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )
                }
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-border p-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-start rounded-xl"
          >
            <Link to="/">
              <ExternalLink className="size-4" aria-hidden />
              Voir le site
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start rounded-xl text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" aria-hidden />
            Déconnexion
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:ms-60">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-border bg-card px-4 md:hidden">
          <Link to="/" className="inline-flex">
            <Logo compact />
          </Link>
          <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Déconnexion">
            <LogOut className="size-4" aria-hidden />
          </Button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

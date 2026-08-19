import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/logo";
import { useAdminSession } from "@/hooks/use-admin-session";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const { session, loading } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && session) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      toast.error("Veuillez saisir votre email et votre mot de passe.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      toast.error("Identifiants incorrects. Vérifiez votre email et votre mot de passe.");
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-soft p-6">
      <div className="w-full max-w-sm rounded-3xl border border-border/70 bg-card p-8 shadow-elegant">
        <div className="flex justify-center">
          <Logo compact />
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-center">
          <Lock className="size-4 text-primary" aria-hidden />
          <h1 className="font-display text-xl font-semibold">Back office Dekarte</h1>
        </div>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Espace réservé à l'administrateur.
        </p>

        <div className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email</Label>
            <Input
              id="adminEmail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@dekarte.ma"
              autoComplete="email"
              className="h-11"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminPassword">Mot de passe</Label>
            <Input
              id="adminPassword"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void handleLogin();
              }}
              autoComplete="current-password"
              className="h-11"
              dir="ltr"
            />
          </div>
          <Button
            className="w-full rounded-full"
            size="lg"
            onClick={handleLogin}
            disabled={busy || loading}
          >
            <LogIn className="size-4" aria-hidden />
            {busy ? "Connexion…" : "Se connecter"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

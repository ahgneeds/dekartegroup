import type { Database } from "@/integrations/supabase/types";
import { adminLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type RequestRow = Database["public"]["Tables"]["requests"]["Row"];

const STATUS_STYLES: Record<string, string> = {
  demande_recue: "bg-muted text-muted-foreground border border-border",
  paiement_en_attente: "bg-accent/20 text-accent-foreground border border-accent/40",
  paiement_recu: "bg-primary/10 text-primary border border-primary/25",
  en_cours: "bg-secondary text-secondary-foreground border border-border",
  design_livre: "bg-primary/10 text-primary border border-primary/25",
  termine: "bg-foreground text-background border border-foreground",
};

export const StatusBadge = ({ code }: { code: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      STATUS_STYLES[code] ?? "bg-muted text-muted-foreground border border-border",
    )}
  >
    {adminLabel(code)}
  </span>
);

export const PaymentBadge = ({ code }: { code: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      code === "paye"
        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
        : "bg-destructive/10 text-destructive border border-destructive/25",
    )}
  >
    {code === "paye" ? "Payé" : "Non payé"}
  </span>
);

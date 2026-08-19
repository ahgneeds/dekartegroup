import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CircleDollarSign,
  Hourglass,
  Inbox,
  MessageCircle,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_PRICE_PER_M2, adminLabel } from "@/lib/constants";
import { formatDh, formatNumber } from "@/lib/format";
import { PaymentBadge, StatusBadge, type RequestRow } from "./admin-ui";
import { cn } from "@/lib/utils";

type Filter = "all" | "unpaid" | "paid";

const Dashboard = () => {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [price, setPrice] = useState<string>(String(DEFAULT_PRICE_PER_M2));
  const [savingPrice, setSavingPrice] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Impossible de charger les demandes.");
    } else {
      setRequests(data ?? []);
    }
    setLoading(false);
  };

  const loadPrice = async () => {
    const { data } = await supabase
      .from("settings")
      .select("price_per_m2")
      .eq("id", 1)
      .maybeSingle();
    if (data?.price_per_m2 != null) {
      setPrice(String(Number(data.price_per_m2)));
    }
  };

  useEffect(() => {
    void loadRequests();
    void loadPrice();
  }, []);

  const savePrice = async () => {
    const parsed = Number.parseFloat(price);
    if (Number.isNaN(parsed) || parsed <= 0) {
      toast.error("Veuillez saisir un prix au m² valide (supérieur à 0).");
      return;
    }
    setSavingPrice(true);
    const { error } = await supabase
      .from("settings")
      .update({ price_per_m2: parsed, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setSavingPrice(false);
    if (error) {
      toast.error("Impossible d'enregistrer le prix.");
    } else {
      toast.success(`Prix mis à jour : ${formatDh(parsed)} / m². Les nouvelles demandes utiliseront ce prix.`);
    }
  };

  const filtered =
    filter === "unpaid"
      ? requests.filter((request) => request.payment_status !== "paye")
      : filter === "paid"
        ? requests.filter((request) => request.payment_status === "paye")
        : requests;

  const counts = {
    total: requests.length,
    unpaid: requests.filter((request) => request.payment_status !== "paye").length,
    paid: requests.filter((request) => request.payment_status === "paye").length,
  };

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Toutes", count: counts.total },
    { key: "unpaid", label: "Non payées", count: counts.unpaid },
    { key: "paid", label: "Payées", count: counts.paid },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Demandes de design
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez les demandes envoyées depuis le simulateur public.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total
            </span>
            <Inbox className="size-4 text-muted-foreground" aria-hidden />
          </div>
          <p className="mt-2 font-display text-3xl font-bold">{counts.total}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Non payées
            </span>
            <Hourglass className="size-4 text-accent-foreground" aria-hidden />
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-accent-foreground">
            {counts.unpaid}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payées
            </span>
            <CircleDollarSign className="size-4 text-emerald-600" aria-hidden />
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-emerald-700">
            {counts.paid}
          </p>
        </div>
      </div>

      <section id="settings" className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2.5">
          <Settings className="size-4 text-primary" aria-hidden />
          <h2 className="font-display text-lg font-semibold">Prix global au m²</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Utilisé par la calculatrice publique pour les nouvelles demandes. Les demandes déjà soumises gardent le prix qui a été appliqué à leur envoi.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="relative w-40">
            <Input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              inputMode="decimal"
              className="h-10 pe-14"
              dir="ltr"
            />
            <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              DH/m²
            </span>
          </div>
          <Button onClick={savePrice} disabled={savingPrice} className="rounded-full">
            {savingPrice ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                filter === tab.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-xs font-bold",
                  filter === tab.key ? "bg-primary-foreground/20" : "bg-secondary",
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {loading && (
            <p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p>
          )}
          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card/60 py-12 text-center">
              <p className="text-sm text-muted-foreground">Aucune demande pour le moment.</p>
            </div>
          )}
          {!loading &&
            filtered.map((request) => (
              <Link
                key={request.id}
                to={`/admin/requests/${request.id}`}
                className="block rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-shadow hover:shadow-elegant"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {request.client_name}
                      </span>
                      <StatusBadge code={request.status} />
                      <PaymentBadge code={request.payment_status} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MessageCircle className="size-3.5" aria-hidden />
                        <span dir="ltr">{request.whatsapp}</span>
                      </span>
                      <span>{adminLabel(request.property_type)}</span>
                      <span>{formatNumber(request.total_surface_m2)} m²</span>
                      <span>{adminLabel(request.style)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="font-display text-lg font-bold text-primary" dir="ltr">
                      {formatDh(request.total_price_dh)}
                    </span>
                    <span className="text-xs text-muted-foreground" dir="ltr">
                      {new Date(request.created_at).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

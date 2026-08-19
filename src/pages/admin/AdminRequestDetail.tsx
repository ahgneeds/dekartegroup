import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ImageIcon,
  MessageCircle,
  NotebookPen,
  Save,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { PHOTO_BUCKET, REQUEST_STATUSES, adminLabel } from "@/lib/constants";
import { formatDh, formatNumber } from "@/lib/format";
import { PaymentBadge, StatusBadge, type RequestRow } from "./admin-ui";

type RoomRow = {
  type: string;
  longueur: string | null;
  largeur: string | null;
  hauteur: string | null;
  surface: number | null;
};

const PhotoGrid = ({ paths }: { paths: string[] }) => {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const entries = await Promise.all(
        paths.map(async (path) => {
          const { data } = await supabase.storage
            .from(PHOTO_BUCKET)
            .createSignedUrl(path, 3600);
          return [path, data?.signedUrl ?? null] as const;
        }),
      );
      if (!cancelled) {
        setUrls(
          Object.fromEntries(entries.filter(([, url]) => url !== null) as [string, string][]),
        );
        setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [paths]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Chargement des photos…</p>;
  }
  if (Object.keys(urls).length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune photo fournie.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {Object.values(urls).map((url, index) => (
        <a key={url} href={url} target="_blank" rel="noreferrer" className="block">
          <img
            src={url}
            alt={`Photo ${index + 1}`}
            className="aspect-square w-full rounded-xl border border-border object-cover transition-transform hover:scale-[1.02]"
          />
        </a>
      ))}
    </div>
  );
};

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<RequestRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      toast.error("Demande introuvable.");
      setLoading(false);
      return;
    }
    setRequest(data);
    setStatus(data.status);
    setPaymentStatus(data.payment_status);
    setNotes(data.admin_notes ?? "");
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveChanges = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("requests")
      .update({ status, payment_status: paymentStatus, admin_notes: notes })
      .eq("id", request!.id);
    setSaving(false);
    if (error) {
      toast.error("Impossible d'enregistrer les modifications.");
    } else {
      toast.success("Modifications enregistrées.");
    }
  };

  if (loading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Chargement…</p>;
  }
  if (!request) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">Demande introuvable.</p>
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link to="/admin/dashboard">Retour aux demandes</Link>
        </Button>
      </div>
    );
  }

  const rooms: RoomRow[] = Array.isArray(request.rooms) ? (request.rooms as RoomRow[]) : [];
  const photoPaths: string[] = Array.isArray(request.photo_urls)
    ? request.photo_urls.filter((path): path is string => typeof path === "string")
    : [];

  const infoRows: { label: string; value: string }[] = [
    { label: "Client", value: request.client_name },
    { label: "WhatsApp", value: request.whatsapp },
    { label: "Email", value: request.email ?? "—" },
    { label: "Type de bien", value: adminLabel(request.property_type) },
    { label: "Périmètre", value: adminLabel(request.design_scope) },
    { label: "Surface totale", value: `${formatNumber(request.total_surface_m2)} m²` },
    { label: "Style", value: adminLabel(request.style) },
    {
      label: "Budget",
      value: request.budget_dh != null ? formatDh(Number(request.budget_dh)) : "—",
    },
    { label: "Prix / m² appliqué", value: formatDh(Number(request.price_per_m2)) },
    { label: "Prix total", value: formatDh(Number(request.total_price_dh)) },
    { label: "Moyen de paiement", value: request.payment_method ? adminLabel(request.payment_method) : "—" },
    {
      label: "Date de demande",
      value: new Date(request.created_at).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/admin/dashboard">
            <ArrowLeft className="size-4" aria-hidden />
            Retour aux demandes
          </Link>
        </Button>
        <a
          href={`https://wa.me/${request.whatsapp.replace("+", "")}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
        >
          <MessageCircle className="size-4" aria-hidden />
          Contacter sur WhatsApp
        </a>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {request.client_name}
          </h1>
          <StatusBadge code={request.status} />
          <PaymentBadge code={request.payment_status} />
        </div>

        <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {infoRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 border-b border-border/60 pb-2.5"
            >
              <dt className="text-sm text-muted-foreground">{row.label}</dt>
              <dd className="text-sm font-semibold" dir="auto">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        {request.design_scope !== "toute_propriete" && rooms.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pièces
            </h2>
            <div className="mt-2.5 overflow-hidden rounded-2xl border border-border/70">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-start text-muted-foreground">
                  <tr>
                    {["Type", "Longueur", "Largeur", "Hauteur", "Surface"].map((header) => (
                      <th key={header} className="px-4 py-2.5 text-start font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, index) => (
                    <tr key={index} className="border-t border-border/60">
                      <td className="px-4 py-2.5 font-medium">{adminLabel(room.type)}</td>
                      <td className="px-4 py-2.5" dir="ltr">{room.longueur ?? "—"} m</td>
                      <td className="px-4 py-2.5" dir="ltr">{room.largeur ?? "—"} m</td>
                      <td className="px-4 py-2.5" dir="ltr">{room.hauteur ?? "—"} m</td>
                      <td className="px-4 py-2.5 font-semibold text-primary" dir="ltr">
                        {room.surface != null ? `${formatNumber(room.surface)} m²` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2.5">
            <Tag className="size-4 text-primary" aria-hidden />
            <h2 className="font-display text-lg font-semibold">Statuts</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Statut de la demande</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_STATUSES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {adminLabel(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Statut de paiement</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non_paye">Non payé</SelectItem>
                  <SelectItem value="paye">Payé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2.5">
            <NotebookPen className="size-4 text-primary" aria-hidden />
            <h2 className="font-display text-lg font-semibold">Notes internes</h2>
          </div>
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ajoutez vos notes internes sur cette demande…"
            className="mt-4 min-h-28"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2.5">
          <ImageIcon className="size-4 text-primary" aria-hidden />
          <h2 className="font-display text-lg font-semibold">
            Photos du client ({photoPaths.length})
          </h2>
        </div>
        <div className="mt-4">
          <PhotoGrid paths={photoPaths} />
        </div>
      </div>

      <div className="text-end">
        <Button onClick={saveChanges} disabled={saving} className="rounded-full px-8">
          <Save className="size-4" aria-hidden />
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
};

export default RequestDetail;

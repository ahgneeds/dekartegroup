import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, CheckCircle2, PackageCheck, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/brand/logo";
import { PaymentContent } from "@/components/payment/PaymentContent";
import type { RoomInput } from "@/lib/constants";
import {
  propertyTypeLabel,
  roomTypeLabel,
  scopeLabel,
  styleLabel,
} from "@/lib/labels";
import { formatDh, formatNumber } from "@/lib/format";

type SubmittedRequest = {
  id: string;
  clientName: string;
  whatsapp: string;
  propertyType: string;
  scope: string;
  rooms: RoomInput[];
  totalSurface: number;
  style: string;
  budget: string | null;
  pricePerM2: number;
  totalPrice: number;
  photoCount: number;
  createdAt: string;
};

const loadLastRequest = (): SubmittedRequest | null => {
  try {
    const raw = sessionStorage.getItem("dekarte_last_request");
    if (!raw) return null;
    return JSON.parse(raw) as SubmittedRequest;
  } catch {
    return null;
  }
};

const Confirmation = () => {
  const { t } = useTranslation();
  const [request] = useState<SubmittedRequest | null>(loadLastRequest);

  if (!request) {
    return <Navigate to="/simulateur" replace />;
  }

  const deliverableItems = [
    { title: t("deliverable.item1.title"), desc: t("deliverable.item1.desc") },
    { title: t("deliverable.item2.title"), desc: t("deliverable.item2.desc") },
    { title: t("deliverable.item3.title"), desc: t("deliverable.item3.desc") },
    { title: t("deliverable.item4.title"), desc: t("deliverable.item4.desc") },
    { title: t("deliverable.item5.title"), desc: t("deliverable.item5.desc") },
    { title: t("deliverable.item6.title"), desc: t("deliverable.item6.desc") },
  ];

  const summaryRows: { label: string; value: string }[] = [
    { label: t("summary.client"), value: request.clientName },
    { label: t("summary.whatsapp"), value: request.whatsapp },
    { label: t("summary.property"), value: propertyTypeLabel(request.propertyType, t) },
    {
      label: t("summary.scope"),
      value:
        request.scope === "toute_propriete"
          ? scopeLabel(request.scope, t)
          : `${scopeLabel(request.scope, t)} · ${request.rooms.length} ${t("summary.rooms")}`,
    },
    { label: t("summary.surface"), value: `${formatNumber(request.totalSurface)} m²` },
    { label: t("summary.style"), value: styleLabel(request.style, t) },
    {
      label: t("summary.budget"),
      value: request.budget ? formatDh(Number.parseFloat(request.budget)) : "—",
    },
    { label: t("summary.pricePerM2"), value: formatDh(request.pricePerM2) },
    { label: t("summary.total"), value: formatDh(request.totalPrice) },
  ];

  return (
    <div className="min-h-full bg-gradient-soft">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="Dekarte — accueil">
            <Logo compact />
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container max-w-3xl py-10">
        <div className="text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-9" aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("confirmation.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {t("confirmation.subtitle")}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <ReceiptText className="size-4 text-primary" aria-hidden />
            {t("confirmation.id")} · <span dir="ltr">{request.id.slice(0, 8)}</span>
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-xl font-semibold">{t("summary.title")}</h2>
          <dl className="mt-4 divide-y divide-border/70 rounded-2xl border border-border/70 bg-background/50">
            {summaryRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-3">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="text-sm font-semibold text-foreground" dir="auto">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          {request.scope !== "toute_propriete" && request.rooms.length > 0 && (
            <div className="mt-4 rounded-2xl border border-border/70 bg-background/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("summary.roomsDetail")}
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {request.rooms.map((room, index) => (
                  <li key={index} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-foreground">{roomTypeLabel(room.type, t)}</span>
                    <span className="text-muted-foreground" dir="ltr">
                      {room.length || "—"} × {room.width || "—"} m
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
          <PaymentContent totalDh={formatDh(request.totalPrice)} />
        </div>

        <div className="mt-6 rounded-3xl bg-foreground p-6 text-background shadow-elegant sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <PackageCheck className="size-5" aria-hidden />
            </span>
            <h2 className="font-display text-xl font-semibold">{t("deliverable.title")}</h2>
          </div>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {deliverableItems.map((item) => (
              <li key={item.title} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-background/80"> — {item.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link to="/">{t("confirmation.backHome")}</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;

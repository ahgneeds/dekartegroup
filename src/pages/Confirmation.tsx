import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Banknote,
  Check,
  CheckCircle2,
  Copy,
  Landmark,
  MessageCircle,
  PackageCheck,
  ReceiptText,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/brand/logo";
import {
  PAYMENT_INFO,
  PAYMENT_METHODS,
  type RoomInput,
} from "@/lib/constants";
import {
  propertyTypeLabel,
  paymentMethodLabel,
  roomTypeLabel,
  scopeLabel,
  styleLabel,
} from "@/lib/labels";
import { formatDh, formatNumber } from "@/lib/format";

type SubmittedRequest = {
  id: string;
  clientName: string;
  whatsapp: string;
  email: string | null;
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  if (!request) {
    return <Navigate to="/simulateur" replace />;
  }

  const copyRib = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_INFO.rib);
      setCopied(true);
    } catch {
      toast.error(t("common.copyFailed"));
    }
  };

  const summaryRows: { label: string; value: string }[] = [
    { label: t("summary.client"), value: request.clientName },
    { label: t("summary.whatsapp"), value: request.whatsapp },
    {
      label: t("summary.property"),
      value: propertyTypeLabel(request.propertyType, t),
    },
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

  const deliverableItems = [
    {
      title: t("deliverable.item1.title"),
      desc: t("deliverable.item1.desc"),
    },
    {
      title: t("deliverable.item2.title"),
      desc: t("deliverable.item2.desc"),
    },
    {
      title: t("deliverable.item3.title"),
      desc: t("deliverable.item3.desc"),
    },
    {
      title: t("deliverable.item4.title"),
      desc: t("deliverable.item4.desc"),
    },
    {
      title: t("deliverable.item5.title"),
      desc: t("deliverable.item5.desc"),
    },
    {
      title: t("deliverable.item6.title"),
      desc: t("deliverable.item6.desc"),
    },
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

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-gradient-primary px-5 py-4 text-primary-foreground shadow-elegant">
            <span className="text-sm font-semibold">{t("price.total")}</span>
            <span className="font-display text-2xl font-bold" dir="ltr">
              {formatDh(request.totalPrice)}
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-primary/25 bg-card p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
              <Banknote className="size-5" aria-hidden />
            </span>
            <h2 className="font-display text-xl font-semibold">{t("payment.title")}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("payment.subtitle")}
          </p>

          <div className="mt-5 rounded-2xl border border-border/70 bg-background/50 p-5">
            <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <Landmark className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{PAYMENT_INFO.accountName}</p>
                <p className="text-sm text-muted-foreground">{PAYMENT_INFO.bank}</p>
                <p className="mt-1 font-mono text-sm font-semibold text-primary" dir="ltr">
                  {PAYMENT_INFO.rib}
                </p>
              </div>
              <Button variant="soft" size="sm" onClick={copyRib} className="rounded-full">
                {copied ? (
                  <>
                    <Check className="size-4" aria-hidden />
                    {t("common.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="size-4" aria-hidden />
                    {t("common.copy")}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border/70 bg-background/50 p-5">
            <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <Send className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-foreground">{t("payment.agency.title")}</p>
                <p className="text-sm text-muted-foreground">{t("payment.agency.hint")}</p>
              </div>
            </div>
            <dl className="mt-4 grid gap-2.5 sm:grid-cols-3">
              <div className="rounded-xl bg-card p-3 ring-1 ring-border/60">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("payment.agency.name")}
                </dt>
                <dd className="mt-1 font-semibold text-foreground">{PAYMENT_INFO.accountName}</dd>
              </div>
              <div className="rounded-xl bg-card p-3 ring-1 ring-border/60">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("payment.agency.phone")}
                </dt>
                <dd className="mt-1 font-semibold text-foreground" dir="ltr">
                  {PAYMENT_INFO.whatsapp}
                </dd>
              </div>
              <div className="rounded-xl bg-card p-3 ring-1 ring-border/60">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("payment.agency.city")}
                </dt>
                <dd className="mt-1 font-semibold text-foreground">
                  {PAYMENT_INFO.city}, {PAYMENT_INFO.country}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("payment.methods.title")}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2.5">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
                >
                  {paymentMethodLabel(method, t)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl bg-primary/5 p-5 ring-1 ring-primary/15 sm:flex-row sm:items-center">
            <p className="text-sm leading-relaxed text-foreground/90">
              {t("payment.proof")}
            </p>
            <a
              href={`https://wa.me/${PAYMENT_INFO.whatsappIntl}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="size-4" aria-hidden />
              {PAYMENT_INFO.whatsapp}
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-foreground p-6 text-background shadow-elegant sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <PackageCheck className="size-5" aria-hidden />
            </span>
            <h2 className="font-display text-xl font-semibold">
              {t("deliverable.title")}
            </h2>
          </div>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {deliverableItems.map((item) => (
              <li key={item.title} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-background/70"> — {item.desc}</span>
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

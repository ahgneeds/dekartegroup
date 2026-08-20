import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Banknote,
  Check,
  Copy,
  Landmark,
  MessageCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PAYMENT_INFO, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodLabel } from "@/lib/labels";

/**
 * Payment instructions shared by the post-submission popup and the
 * confirmation page.
 */
export const PaymentContent = ({ totalDh }: { totalDh: string }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copyRib = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_INFO.rib);
      setCopied(true);
    } catch {
      toast.error(t("common.copyFailed"));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/50 px-5 py-4">
        <span className="text-sm font-semibold text-muted-foreground">{t("price.total")}</span>
        <span className="font-display text-2xl font-bold text-primary" dir="ltr">
          {totalDh}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
          <Banknote className="size-5" aria-hidden />
        </span>
        <h3 className="font-display text-xl font-semibold">{t("payment.title")}</h3>
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

      <div className="mt-4 rounded-2xl border border-border/70 bg-background/50 p-5">
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
        <p className="text-sm leading-relaxed text-foreground/90">{t("payment.proof")}</p>
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
  );
};

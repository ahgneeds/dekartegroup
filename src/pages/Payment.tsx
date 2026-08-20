import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/brand/logo";
import { PaymentContent } from "@/components/payment/PaymentContent";
import { formatDh } from "@/lib/format";
import type { SubmittedRequest } from "@/components/simulator/types";

const loadLastRequest = (): SubmittedRequest | null => {
  try {
    const raw = sessionStorage.getItem("dekarte_last_request");
    if (!raw) return null;
    return JSON.parse(raw) as SubmittedRequest;
  } catch {
    return null;
  }
};

/**
 * Dedicated payment page shown right after the request is sent — replaces the
 * old popup. Focused on the bank / transfer instructions.
 */
const Payment = () => {
  const { t } = useTranslation();
  const [request] = useState<SubmittedRequest | null>(loadLastRequest);

  if (!request) {
    return <Navigate to="/simulateur" replace />;
  }

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

      <main className="container max-w-xl py-10">
        <div className="text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-9" aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("confirmation.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            {t("confirmation.subtitle")}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <ReceiptText className="size-4 text-primary" aria-hidden />
            {t("confirmation.id")} · <span dir="ltr">{request.id.slice(0, 8)}</span>
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-border/70 bg-card p-5 shadow-soft sm:p-7">
          <PaymentContent totalDh={formatDh(request.totalPrice)} />
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

export default Payment;

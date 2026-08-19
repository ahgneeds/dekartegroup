import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/brand/logo";
import { PAYMENT_INFO } from "@/lib/constants";

export const LandingFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="container flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:justify-between sm:text-start">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Logo compact />
          <p className="max-w-xs text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <a
            href={`https://wa.me/${PAYMENT_INFO.whatsappIntl}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-secondary"
          >
            <MessageCircle className="size-4 text-primary" aria-hidden />
            {t("footer.whatsapp")} · {PAYMENT_INFO.whatsapp}
          </a>
          <LanguageSwitcher />
        </div>
      </div>
      <div className="border-t border-border/60 py-5">
        <p className="text-center text-xs text-muted-foreground">
          {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

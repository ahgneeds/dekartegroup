import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/brand/logo";

export const LandingHeader = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="Dekarte — accueil">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button asChild size="sm" className="hidden rounded-full px-5 sm:inline-flex">
            <Link to="/simulateur">{t("common.cta")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

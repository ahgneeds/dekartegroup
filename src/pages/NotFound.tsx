import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-soft p-6">
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="size-8" aria-hidden />
        </span>
        <h1 className="mt-5 font-display text-5xl font-bold tracking-tight">404</h1>
        <p className="mt-3 text-muted-foreground">{t("notFound.title")}</p>
        <Button asChild className="mt-6 rounded-full px-8">
          <Link to="/">{t("notFound.actions.backHome")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

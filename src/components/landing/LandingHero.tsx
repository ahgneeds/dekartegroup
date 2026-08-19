import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandImage } from "@/components/brand/brand-image";
import { IMAGES } from "@/lib/images";

const ZELLIGE_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cpath d='M48 0 L57 39 L96 48 L57 57 L48 96 L39 57 L0 48 L39 39 Z' fill='none' stroke='%2318325A' stroke-opacity='0.07' stroke-width='1.2'/%3E%3C/svg%3E\")";

export const LandingHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ backgroundImage: ZELLIGE_PATTERN, backgroundSize: "96px 96px" }}
        aria-hidden
      />
      <div className="container relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            {t("hero.badge")}
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 text-base shadow-elegant"
            >
              <Link to="/simulateur">
                {t("common.cta")}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base">
              <a href="#styles">{t("hero.ctaSecondary")}</a>
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">{t("hero.points")}</p>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative mx-auto max-w-md">
            <div className="overflow-hidden rounded-b-[2.5rem] rounded-t-[11rem] border-[6px] border-card shadow-elegant">
              <BrandImage
                src={IMAGES.hero}
                alt={t("hero.imageAlt")}
                className="aspect-[4/5] w-full md:aspect-[4/4.6]"
                fallbackClassName="aspect-[4/5] w-full md:aspect-[4/4.6]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

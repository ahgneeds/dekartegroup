import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandImage } from "@/components/brand/brand-image";
import { IMAGES } from "@/lib/images";

export const LandingHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            {t("hero.badge")}
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="rounded-full px-8 text-base shadow-elegant">
              <Link to="/simulateur">{t("common.cta")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base">
              <a href="#styles">{t("hero.ctaSecondary")}</a>
            </Button>
          </div>

          <ul className="mt-10 grid max-w-md gap-2.5 text-sm text-muted-foreground">
            {[t("hero.point1"), t("hero.point2"), t("hero.point3")].map((point) => (
              <li key={point} className="flex items-center gap-2.5">
                <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="overflow-hidden rounded-[2rem] border border-border/60 shadow-elegant">
            <BrandImage
              src={IMAGES.hero}
              alt={t("hero.imageAlt")}
              className="aspect-[4/3] w-full md:aspect-[5/4]"
              fallbackClassName="aspect-[4/3] w-full md:aspect-[5/4]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BadgeCheck, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandImage } from "@/components/brand/brand-image";
import { IMAGES } from "@/lib/images";
import { usePricePerM2 } from "@/hooks/use-price-per-m2";
import { formatNumber } from "@/lib/format";

const ZELLIGE_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cpath d='M48 0 L57 39 L96 48 L57 57 L48 96 L39 57 L0 48 L39 39 Z' fill='none' stroke='%2318325A' stroke-opacity='0.07' stroke-width='1.2'/%3E%3C/svg%3E\")";

export const LandingHero = () => {
  const { t } = useTranslation();
  const { price } = usePricePerM2();

  const features = [
    { icon: BadgeCheck, label: t("hero.feat1") },
    { icon: Check, label: t("hero.feat2") },
    { icon: Check, label: t("hero.feat3") },
    { icon: Check, label: t("hero.feat4") },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ backgroundImage: ZELLIGE_PATTERN, backgroundSize: "96px 96px" }}
        aria-hidden
      />
      <div className="container relative grid items-center gap-12 py-14 md:grid-cols-2 md:py-20">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-3">
            <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-full bg-accent text-accent-foreground shadow-soft ring-2 ring-accent/30">
              <span className="font-hero text-base font-extrabold leading-none" dir="ltr">
                {formatNumber(price)}
              </span>
              <span className="mt-0.5 text-[9px] font-bold uppercase leading-none tracking-wide">
                {t("hero.priceUnit")}
              </span>
            </span>
            <span className="font-hero text-lg font-semibold text-foreground">
              {t("hero.pricePre")}
            </span>
          </div>

          <h1 className="mt-6 font-hero text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            {t("hero.title")}{" "}
            <span className="inline-block rounded-2xl bg-accent px-3 text-accent-foreground">
              {t("hero.highlight")}
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            {t("hero.subtitle")}
          </p>

          <ul className="mt-6 grid max-w-lg gap-2 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li
                  key={feature.label}
                  className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card/80 px-3.5 py-2.5 text-sm font-medium text-foreground"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  {feature.label}
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-primary px-10 py-6 text-base text-primary-foreground shadow-elegant hover:bg-primary/90 sm:w-auto"
            >
              <Link to="/simulateur">
                {t("common.cta")}
                <ArrowRight className="size-5" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative mx-auto max-w-md py-4">
            <div className="overflow-hidden rounded-b-[2.5rem] rounded-t-[11rem] border-[6px] border-card shadow-elegant">
              <BrandImage
                src={IMAGES.hero}
                alt={t("hero.imageAlt")}
                className="aspect-[4/5] w-full md:aspect-[4/4.6]"
                fallbackClassName="aspect-[4/5] w-full md:aspect-[4/4.6]"
              />
            </div>
            <div className="absolute -left-4 top-8 w-24 -rotate-6 overflow-hidden rounded-2xl border-4 border-card shadow-soft sm:-left-10 sm:w-36">
              <BrandImage
                src={IMAGES.styleMarocain}
                alt=""
                className="aspect-[4/5] w-full"
                fallbackClassName="aspect-[4/5] w-full"
              />
            </div>
            <div className="absolute -right-3 bottom-20 w-20 rotate-6 overflow-hidden rounded-2xl border-4 border-card shadow-soft sm:-right-8 sm:w-32">
              <BrandImage
                src={IMAGES.styleModerne}
                alt=""
                className="aspect-[4/5] w-full"
                fallbackClassName="aspect-[4/5] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

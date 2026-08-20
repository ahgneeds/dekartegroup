import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, Palette, Ruler, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Merged "how it works" + "what you get" section: compact, centered,
 * with no wasted space — three quick steps, then a tight deliverables strip.
 */
export const LandingHowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Ruler,
      title: t("process.step1.title"),
      desc: t("process.step1.desc"),
    },
    {
      icon: Palette,
      title: t("process.step2.title"),
      desc: t("process.step2.desc"),
    },
    {
      icon: Sparkles,
      title: t("process.step3.title"),
      desc: t("process.step3.desc"),
    },
  ];

  const items = [
    t("deliverable.item1.title"),
    t("deliverable.item2.title"),
    t("deliverable.item3.title"),
    t("deliverable.item4.title"),
    t("deliverable.item5.title"),
    t("deliverable.item6.title"),
  ];

  return (
    <section className="border-y border-border/60 bg-card/60">
      <div className="container py-14 md:py-16">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("process.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("process.subtitle")}</p>
        </header>

        <div className="mt-12 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border/70 bg-background p-6 pt-8 text-center shadow-soft"
              >
                <span className="absolute -top-3 start-1/2 flex size-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-border/70 bg-background shadow-soft">
          <div className="bg-foreground px-6 py-4 text-center">
            <h3 className="font-display text-lg font-semibold text-background">
              {t("deliverable.title")}
            </h3>
          </div>
          <ul className="grid gap-2.5 p-5 sm:grid-cols-2 sm:p-6">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Check className="size-3" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary px-8 text-base text-primary-foreground shadow-elegant hover:bg-primary/90"
          >
            <Link to="/simulateur">
              {t("common.cta")}
              <ArrowRight className="size-5" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

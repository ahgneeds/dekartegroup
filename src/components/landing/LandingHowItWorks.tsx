import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Ultra-short "how it works": three one-line steps, then a tight
 * "what you get" checklist — no heavy cards, no wasted space.
 */
export const LandingHowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    { title: t("process.step1.title"), desc: t("process.step1.desc") },
    { title: t("process.step2.title"), desc: t("process.step2.desc") },
    { title: t("process.step3.title"), desc: t("process.step3.desc") },
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
      <div className="container py-12 md:py-14">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("process.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("process.subtitle")}</p>
        </header>

        <div className="mx-auto mt-8 grid max-w-3xl gap-2.5 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3.5 shadow-soft"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </span>
              <p className="text-sm font-semibold leading-snug text-foreground">
                {step.title}{" "}
                <span className="font-normal text-muted-foreground">— {step.desc}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border border-border/70 bg-background shadow-soft">
          <div className="bg-foreground px-6 py-3.5 text-center">
            <h3 className="font-display text-base font-semibold text-background">
              {t("deliverable.title")}
            </h3>
          </div>
          <ul className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-4 py-2.5 text-sm font-medium text-foreground"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Check className="size-3" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center">
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

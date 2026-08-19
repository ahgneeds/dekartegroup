import { useTranslation } from "react-i18next";
import { Ruler, Palette, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LandingProcess = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Ruler,
      step: t("process.step1.step"),
      title: t("process.step1.title"),
      desc: t("process.step1.desc"),
    },
    {
      icon: Palette,
      step: t("process.step2.step"),
      title: t("process.step2.title"),
      desc: t("process.step2.desc"),
    },
    {
      icon: Sparkles,
      step: t("process.step3.step"),
      title: t("process.step3.title"),
      desc: t("process.step3.desc"),
    },
  ];

  return (
    <section className="border-y border-border/60 bg-card/60">
      <div className="container py-14 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("process.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("process.subtitle")}</p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
                  <Icon className="size-6" aria-hidden />
                </div>
                <span className="mt-4 block font-display text-4xl font-bold text-primary/15">
                  {index + 1}
                </span>
                <h3 className="-mt-6 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg" className="rounded-full px-8 text-base shadow-elegant">
            <Link to="/simulateur">{t("common.cta")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

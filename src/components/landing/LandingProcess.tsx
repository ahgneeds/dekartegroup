import { useTranslation } from "react-i18next";
import { ClipboardList, Palette, Images, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LandingProcess = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: ClipboardList,
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
      icon: Images,
      step: t("process.step3.step"),
      title: t("process.step3.title"),
      desc: t("process.step3.desc"),
    },
    {
      icon: MessageCircle,
      step: t("process.step4.step"),
      title: t("process.step4.title"),
      desc: t("process.step4.desc"),
    },
  ];

  return (
    <section className="bg-gradient-soft py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("process.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("process.subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
                  <Icon className="size-5" aria-hidden />
                </div>
                <span className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">
                  {step.step}
                </span>
                <h3 className="mt-1.5 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                <span className="mt-3 block text-xs text-muted-foreground/70">
                  {index + 1} / 4
                </span>
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

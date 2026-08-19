import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export const LandingDeliverable = () => {
  const { t } = useTranslation();

  const items = [
    {
      title: t("deliverable.item1.title"),
      desc: t("deliverable.item1.desc"),
    },
    {
      title: t("deliverable.item2.title"),
      desc: t("deliverable.item2.desc"),
    },
    {
      title: t("deliverable.item3.title"),
      desc: t("deliverable.item3.desc"),
    },
    {
      title: t("deliverable.item4.title"),
      desc: t("deliverable.item4.desc"),
    },
    {
      title: t("deliverable.item5.title"),
      desc: t("deliverable.item5.desc"),
    },
    {
      title: t("deliverable.item6.title"),
      desc: t("deliverable.item6.desc"),
    },
  ];

  return (
    <section className="container py-16 md:py-24">
      <div className="overflow-hidden rounded-[2rem] bg-foreground text-background shadow-elegant">
        <div className="grid gap-10 p-8 md:grid-cols-2 md:p-14">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("deliverable.title")}
            </h2>
            <p className="mt-4 leading-relaxed text-background/80">
              {t("deliverable.subtitle")}
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-background px-8 text-base text-primary shadow-soft hover:bg-background/90"
            >
              <Link to="/simulateur">{t("common.cta")}</Link>
            </Button>
          </div>
          <ul className="grid gap-3">
            {items.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-2xl bg-background/5 p-4"
              >
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/90 text-accent-foreground">
                  <Check className="size-3.5" aria-hidden />
                </span>
                <span>
                  <span className="font-semibold text-background">{item.title}</span>
                  <span className="text-background/80"> — {item.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

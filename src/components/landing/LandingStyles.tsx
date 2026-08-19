import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { BrandImage } from "@/components/brand/brand-image";
import { IMAGES } from "@/lib/images";

export const LandingStyles = () => {
  const { t } = useTranslation();

  const styles = [
    {
      title: t("styles.marocain.title"),
      desc: t("styles.marocain.desc"),
      src: IMAGES.styleMarocain,
    },
    {
      title: t("styles.moderne.title"),
      desc: t("styles.moderne.desc"),
      src: IMAGES.styleModerne,
    },
    {
      title: t("styles.mixte.title"),
      desc: t("styles.mixte.desc"),
      src: IMAGES.styleMixte,
    },
  ];

  return (
    <section id="styles" className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("styles.sectionTitle")}
        </h2>
        <p className="mt-4 text-muted-foreground">{t("styles.sectionSubtitle")}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {styles.map((style, index) => (
          <div
            key={style.title}
            className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow hover:shadow-elegant"
          >
            <div className="overflow-hidden">
              <BrandImage
                src={style.src}
                alt={style.title}
                className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
                fallbackClassName="aspect-[4/3] w-full"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold">{style.title}</h3>
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {style.desc}
              </p>
              <Button asChild variant="soft" className="mt-5 w-full rounded-full">
                <Link to="/simulateur">{t("styles.choose")}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

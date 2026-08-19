import { useTranslation } from "react-i18next";
import { Palette, Check } from "lucide-react";

import { StepCard } from "./StepCard";
import { BrandImage } from "@/components/brand/brand-image";
import { IMAGES } from "@/lib/images";
import { STYLES } from "@/lib/constants";
import { styleLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { SimulatorState } from "./types";

const styleAssets: Record<string, string> = {
  marocain: IMAGES.styleMarocain,
  moderne: IMAGES.styleModerne,
  mixte: IMAGES.styleMixte,
};

type Props = {
  state: SimulatorState;
  onChange: (patch: Partial<SimulatorState>) => void;
};

export const StepStyle = ({ state, onChange }: Props) => {
  const { t } = useTranslation();

  return (
    <StepCard icon={Palette} title={t("style.title")} subtitle={t("style.subtitle")}>
      <div className="grid gap-4 sm:grid-cols-3">
        {STYLES.map((style) => {
          const selected = state.style === style;
          return (
            <button
              key={style}
              type="button"
              onClick={() => onChange({ style })}
              aria-pressed={selected}
              className={cn(
                "group relative overflow-hidden rounded-2xl border text-start shadow-soft transition-all",
                selected
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border/80 hover:border-primary/50",
              )}
            >
              <BrandImage
                src={styleAssets[style]}
                alt={styleLabel(style, t)}
                className="aspect-[4/3] w-full"
                fallbackClassName="aspect-[4/3] w-full"
              />
              <span
                className={cn(
                  "absolute end-3 top-3 flex size-7 items-center justify-center rounded-full border-2 transition-all",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-white bg-black/30 text-transparent",
                )}
              >
                <Check className="size-4" aria-hidden />
              </span>
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 px-4 py-3 text-sm font-semibold text-white transition-colors",
                  selected ? "bg-primary/95" : "bg-gradient-to-t from-black/80 to-black/10",
                )}
              >
                {styleLabel(style, t)}
              </span>
            </button>
          );
        })}
      </div>
    </StepCard>
  );
};

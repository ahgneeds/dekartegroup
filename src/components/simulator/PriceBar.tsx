import { useTranslation } from "react-i18next";
import { Calculator } from "lucide-react";

import { formatDh, formatNumber, formatSurface } from "@/lib/format";

type PriceBarProps = {
  surface: number;
  pricePerM2: number;
};

/**
 * Always-visible price calculation: surface × price/m² = total.
 */
export const PriceBar = ({ surface, pricePerM2 }: PriceBarProps) => {
  const { t } = useTranslation();
  const total = surface * pricePerM2;

  return (
    <div className="sticky bottom-4 z-30 mx-auto w-full max-w-3xl px-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/95 px-5 py-3.5 shadow-elegant backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calculator className="size-4.5" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("price.perM2")}
            </p>
            <p className="text-sm font-medium text-foreground">
              {formatDh(pricePerM2)}
            </p>
          </div>
        </div>

        <p className="text-sm font-semibold text-foreground" dir="ltr">
          {t("price.formula", {
            surface: formatNumber(surface),
            price: formatNumber(pricePerM2),
            total: formatNumber(total),
          })}
        </p>

        <div className="leading-tight text-end">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("price.total")}
          </p>
          <p className="font-display text-lg font-bold text-primary">
            {formatDh(total)}
          </p>
        </div>
      </div>
    </div>
  );
};

/** Small formatted surface used in room lines. */
export const SurfaceTag = ({ surface }: { surface: number }) => {
  return (
    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
      {formatSurface(surface)}
    </span>
  );
};

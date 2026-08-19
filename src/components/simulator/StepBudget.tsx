import { useTranslation } from "react-i18next";
import { Wallet, Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepCard } from "./StepCard";
import { MIN_BUDGET_DH } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { SimulatorState } from "./types";

type Props = {
  state: SimulatorState;
  onChange: (patch: Partial<SimulatorState>) => void;
  errors: Record<string, string>;
};

export const StepBudget = ({ state, onChange, errors }: Props) => {
  const { t } = useTranslation();

  return (
    <StepCard
      icon={Wallet}
      title={t("budget.title")}
      subtitle={t("budget.subtitle")}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="budget">
            {t("budget.label")}{" "}
            <span className="font-normal text-muted-foreground">{t("common.optional")}</span>
          </Label>
          <div className="relative max-w-sm">
            <Input
              id="budget"
              value={state.budget}
              onChange={(event) => onChange({ budget: event.target.value })}
              placeholder={formatNumber(MIN_BUDGET_DH)}
              className="h-11 ps-4 pe-16"
              inputMode="numeric"
              dir="ltr"
            />
            <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              DH
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{t("budget.minHint", { min: formatNumber(MIN_BUDGET_DH) })}</p>
          {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-accent/15 p-4 ring-1 ring-accent/30">
          <Info className="mt-0.5 size-4.5 shrink-0 text-accent-foreground" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground/90">{t("budget.note")}</p>
        </div>
      </div>
    </StepCard>
  );
};

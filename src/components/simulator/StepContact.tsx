import { useTranslation } from "react-i18next";
import { UserRound, Phone, AtSign } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepCard } from "./StepCard";
import type { SimulatorState } from "./types";

type Props = {
  state: SimulatorState;
  onChange: (patch: Partial<SimulatorState>) => void;
  errors: Record<string, string>;
};

export const StepContact = ({ state, onChange, errors }: Props) => {
  const { t } = useTranslation();

  return (
    <StepCard
      icon={UserRound}
      title={t("contact.title")}
      subtitle={t("contact.subtitle")}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">{t("contact.name.label")}</Label>
          <Input
            id="name"
            value={state.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder={t("contact.name.placeholder")}
            className="h-11"
            autoComplete="name"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">{t("contact.whatsapp.label")}</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="whatsapp"
              value={state.whatsapp}
              onChange={(event) => onChange({ whatsapp: event.target.value })}
              placeholder={t("contact.whatsapp.placeholder")}
              className="h-11 ps-10"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t("contact.whatsapp.hint")}</p>
          {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            {t("contact.email.label")}{" "}
            <span className="font-normal text-muted-foreground">{t("common.optional")}</span>
          </Label>
          <div className="relative">
            <AtSign className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="email"
              type="email"
              value={state.email}
              onChange={(event) => onChange({ email: event.target.value })}
              placeholder="exemple@email.com"
              className="h-11 ps-10"
              autoComplete="email"
              dir="ltr"
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
      </div>
    </StepCard>
  );
};

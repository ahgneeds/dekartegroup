import { useTranslation } from "react-i18next";
import {
  Building2,
  Home,
  DoorOpen,
  House,
  Store,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";

import { StepCard } from "./StepCard";
import { SelectableCard } from "./SelectableCard";
import { PROPERTY_TYPES } from "@/lib/constants";
import { propertyTypeLabel } from "@/lib/labels";
import type { SimulatorState } from "./types";

const propertyIcons: Record<string, typeof Building2> = {
  appartement: Building2,
  villa: Home,
  studio: DoorOpen,
  maison: House,
  local_commercial: Store,
  bureau: Briefcase,
  autre: MoreHorizontal,
};

type Props = {
  state: SimulatorState;
  onChange: (patch: Partial<SimulatorState>) => void;
};

export const StepProperty = ({ state, onChange }: Props) => {
  const { t } = useTranslation();

  return (
    <StepCard icon={Home} title={t("property.title")} subtitle={t("property.subtitle")}>
      <div className="grid gap-3 sm:grid-cols-2">
        {PROPERTY_TYPES.map((type) => (
          <SelectableCard
            key={type}
            icon={propertyIcons[type]}
            title={propertyTypeLabel(type, t)}
            selected={state.propertyType === type}
            onSelect={() => onChange({ propertyType: type })}
          />
        ))}
      </div>
    </StepCard>
  );
};

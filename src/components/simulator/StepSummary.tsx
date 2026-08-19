import { useTranslation } from "react-i18next";
import { Send, ClipboardCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StepCard } from "./StepCard";
import {
  propertyTypeLabel,
  roomTypeLabel,
  scopeLabel,
  styleLabel,
} from "@/lib/labels";
import { roomSurface } from "@/lib/constants";
import { formatDh, formatNumber } from "@/lib/format";
import type { SimulatorState } from "./types";

type Props = {
  state: SimulatorState;
  totalSurface: number;
  pricePerM2: number;
  submitting: boolean;
  onSubmit: () => void;
};

export const StepSummary = ({
  state,
  totalSurface,
  pricePerM2,
  submitting,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const totalPrice = totalSurface * pricePerM2;

  const rows: { label: string; value: string }[] = [
    { label: t("summary.client"), value: state.name.trim() },
    { label: t("summary.whatsapp"), value: state.whatsapp.trim() },
    { label: t("summary.property"), value: propertyTypeLabel(state.propertyType, t) },
    {
      label: t("summary.scope"),
      value:
        state.scope === "toute_propriete"
          ? scopeLabel(state.scope, t)
          : state.rooms.length > 0
            ? `${scopeLabel(state.scope, t)} · ${state.rooms.length} ${t("summary.rooms")}`
            : scopeLabel(state.scope, t),
    },
    { label: t("summary.surface"), value: `${formatNumber(totalSurface)} m²` },
    { label: t("summary.style"), value: styleLabel(state.style, t) },
    {
      label: t("summary.budget"),
      value: state.budget ? formatDh(Number.parseFloat(state.budget)) : "—",
    },
    { label: t("summary.pricePerM2"), value: formatDh(pricePerM2) },
    { label: t("summary.total"), value: formatDh(totalPrice) },
  ];

  return (
    <StepCard icon={ClipboardCheck} title={t("summary.title")} subtitle={t("summary.subtitle")}>
      <dl className="divide-y divide-border/70 rounded-2xl border border-border/70 bg-background/50">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-3">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-sm font-semibold text-foreground" dir="auto">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {state.scope !== "toute_propriete" && state.rooms.length > 0 && (
        <div className="mt-4 rounded-2xl border border-border/70 bg-background/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("summary.roomsDetail")}
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {state.rooms.map((room, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-foreground">{roomTypeLabel(room.type, t)}</span>
                <span className="text-muted-foreground" dir="ltr">
                  {room.length || "—"} × {room.width || "—"} m ={" "}
                  <span className="font-semibold text-primary">
                    {formatNumber(roomSurface(room))} m²
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-gradient-primary px-5 py-4 text-primary-foreground shadow-elegant">
        <span className="text-sm font-semibold">{t("price.total")}</span>
        <span className="font-display text-2xl font-bold" dir="ltr">
          {formatDh(totalPrice)}
        </span>
      </div>

      <Button
        type="button"
        size="lg"
        className="mt-6 w-full rounded-full text-base shadow-elegant"
        onClick={onSubmit}
        disabled={submitting}
      >
        <Send className="size-4" aria-hidden />
        {submitting ? t("summary.sending") : t("summary.send")}
      </Button>
    </StepCard>
  );
};

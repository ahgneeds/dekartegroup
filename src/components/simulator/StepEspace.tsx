import { useTranslation } from "react-i18next";
import {
  Briefcase,
  Building2,
  DoorOpen,
  Home,
  House,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Ruler,
  Store,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepCard } from "./StepCard";
import { SelectableCard } from "./SelectableCard";
import { SurfaceTag } from "./PriceBar";
import { DESIGN_SCOPES, PROPERTY_TYPES, ROOM_TYPES } from "@/lib/constants";
import { roomSurface } from "@/lib/constants";
import {
  propertyTypeLabel,
  roomTypeLabel,
  scopeLabel,
} from "@/lib/labels";
import { formatNumber } from "@/lib/format";
import type { SimulatorState } from "./types";

type Props = {
  state: SimulatorState;
  onChange: (patch: Partial<SimulatorState>) => void;
  totalSurface: number;
  errors: Record<string, string>;
};

const propertyIcons: Record<string, typeof Building2> = {
  appartement: Building2,
  villa: Home,
  studio: DoorOpen,
  maison: House,
  local_commercial: Store,
  bureau: Briefcase,
  autre: MoreHorizontal,
};

const scopeIcons: Record<string, typeof LayoutGrid> = {
  une_piece: DoorOpen,
  plusieurs_pieces: LayoutGrid,
  toute_propriete: Home,
};

export const StepEspace = ({ state, onChange, totalSurface, errors }: Props) => {
  const { t } = useTranslation();
  const isWhole = state.scope === "toute_propriete";

  const updateRoom = (index: number, patch: Partial<SimulatorState["rooms"][number]>) => {
    onChange({
      rooms: state.rooms.map((room, i) => (i === index ? { ...room, ...patch } : room)),
    });
  };

  return (
    <StepCard icon={Ruler} title={t("espace.title")} subtitle={t("espace.subtitle")}>
      <div className="space-y-6">
        <div>
          <p className="mb-2.5 text-sm font-semibold text-foreground">{t("espace.property")}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PROPERTY_TYPES.map((type) => (
              <SelectableCard
                key={type}
                icon={propertyIcons[type]}
                title={propertyTypeLabel(type, t)}
                selected={state.propertyType === type}
                onSelect={() => onChange({ propertyType: type })}
                className="!p-3.5"
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-sm font-semibold text-foreground">{t("espace.scope")}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {DESIGN_SCOPES.map((scope) => (
              <SelectableCard
                key={scope}
                icon={scopeIcons[scope]}
                title={scopeLabel(scope, t)}
                selected={state.scope === scope}
                onSelect={() => onChange({ scope })}
                className="!p-3.5"
              />
            ))}
          </div>
        </div>

        {state.scope && (
          <div>
            {isWhole ? (
              <div className="space-y-2">
                <Label htmlFor="totalSurface">{t("scope.whole.label")}</Label>
                <div className="relative max-w-xs">
                  <Input
                    id="totalSurface"
                    value={state.totalSurface}
                    onChange={(event) => onChange({ totalSurface: event.target.value })}
                    placeholder="120"
                    className="h-11 pe-14"
                    inputMode="decimal"
                    dir="ltr"
                  />
                  <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    m²
                  </span>
                </div>
                {errors.totalSurface && (
                  <p className="text-sm text-destructive">{errors.totalSurface}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{t("espace.rooms")}</p>
                  <Button
                    type="button"
                    variant="soft"
                    size="sm"
                    className="rounded-full"
                    onClick={() =>
                      onChange({
                        rooms: [
                          ...state.rooms,
                          { type: "salon", length: "", width: "", height: "" },
                        ],
                      })
                    }
                  >
                    <Plus className="size-4" aria-hidden />
                    {t("scope.rooms.add")}
                  </Button>
                </div>

                {state.rooms.map((room, index) => {
                  const surface = roomSurface(room);
                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-border/70 bg-background/60 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Select
                          value={room.type}
                          onValueChange={(type) => updateRoom(index, { type })}
                        >
                          <SelectTrigger className="w-full sm:w-56">
                            <SelectValue placeholder={t("scope.rooms.type")} />
                          </SelectTrigger>
                          <SelectContent>
                            {ROOM_TYPES.map((roomType) => (
                              <SelectItem key={roomType} value={roomType}>
                                {roomTypeLabel(roomType, t)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <SurfaceTag surface={surface} />
                          {state.rooms.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                onChange({ rooms: state.rooms.filter((_, i) => i !== index) })
                              }
                              aria-label={t("scope.rooms.remove")}
                            >
                              <Trash2 className="size-4" aria-hidden />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            {t("scope.rooms.length")}
                          </Label>
                          <Input
                            value={room.length}
                            onChange={(event) => updateRoom(index, { length: event.target.value })}
                            className="h-10"
                            inputMode="decimal"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            {t("scope.rooms.width")}
                          </Label>
                          <Input
                            value={room.width}
                            onChange={(event) => updateRoom(index, { width: event.target.value })}
                            className="h-10"
                            inputMode="decimal"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            {t("scope.rooms.height")}
                          </Label>
                          <Input
                            value={room.height}
                            onChange={(event) => updateRoom(index, { height: event.target.value })}
                            className="h-10"
                            inputMode="decimal"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between rounded-2xl bg-primary/5 px-5 py-4 ring-1 ring-primary/15">
                  <span className="text-sm font-medium text-foreground">
                    {t("scope.rooms.totalSurface")}
                  </span>
                  <span className="font-display text-lg font-bold text-primary">
                    {formatNumber(totalSurface)} m²
                  </span>
                </div>
                {errors.rooms && <p className="text-sm text-destructive">{errors.rooms}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </StepCard>
  );
};

import { useTranslation } from "react-i18next";
import { LayoutGrid, Plus, Trash2, Warehouse } from "lucide-react";

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
import { DESIGN_SCOPES, ROOM_TYPES } from "@/lib/constants";
import { roomTypeLabel, scopeLabel } from "@/lib/labels";
import { roomSurface } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { SimulatorState } from "./types";

type Props = {
  state: SimulatorState;
  onChange: (patch: Partial<SimulatorState>) => void;
  totalSurface: number;
  errors: Record<string, string>;
};

export const StepScope = ({ state, onChange, totalSurface, errors }: Props) => {
  const { t } = useTranslation();
  const isWhole = state.scope === "toute_propriete";

  return (
    <StepCard icon={LayoutGrid} title={t("scope.title")} subtitle={t("scope.subtitle")}>
      <div className="grid gap-3 sm:grid-cols-3">
        {DESIGN_SCOPES.map((scope) => (
          <SelectableCard
            key={scope}
            title={scopeLabel(scope, t)}
            selected={state.scope === scope}
            onSelect={() => onChange({ scope })}
            className={scope === "toute_propriete" ? "sm:col-span-1" : undefined}
          />
        ))}
      </div>

      {state.scope && (
        <div className="mt-7 space-y-6">
          {isWhole ? (
            <div className="space-y-2">
              <Label htmlFor="totalSurface">{t("scope.whole.label")}</Label>
              <div className="relative max-w-xs">
                <Input
                  id="totalSurface"
                  value={state.totalSurface}
                  onChange={(event) => onChange({ totalSurface: event.target.value })}
                  placeholder="80"
                  className="h-11 ps-4 pe-14"
                  inputMode="decimal"
                  dir="ltr"
                />
                <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  m²
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{t("scope.whole.hint")}</p>
              {errors.totalSurface && (
                <p className="text-sm text-destructive">{errors.totalSurface}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Warehouse className="size-5 text-muted-foreground" aria-hidden />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("scope.rooms.label")}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="soft"
                  size="sm"
                  className="rounded-full"
                  onClick={() =>
                    onChange({
                      rooms: [...state.rooms, { type: "salon", length: "", width: "", height: "" }],
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
                        onValueChange={(type) =>
                          onChange({
                            rooms: state.rooms.map((r, i) =>
                              i === index ? { ...r, type } : r,
                            ),
                          })
                        }
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
                          onChange={(event) =>
                            onChange({
                              rooms: state.rooms.map((r, i) =>
                                i === index ? { ...r, length: event.target.value } : r,
                              ),
                            })
                          }
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
                          onChange={(event) =>
                            onChange({
                              rooms: state.rooms.map((r, i) =>
                                i === index ? { ...r, width: event.target.value } : r,
                              ),
                            })
                          }
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
                          onChange={(event) =>
                            onChange({
                              rooms: state.rooms.map((r, i) =>
                                i === index ? { ...r, height: event.target.value } : r,
                              ),
                            })
                          }
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
    </StepCard>
  );
};

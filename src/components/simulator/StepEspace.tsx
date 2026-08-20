import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ImagePlus,
  Plus,
  Ruler,
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
import { SurfaceTag } from "./PriceBar";
import { DESIGN_SCOPES, MAX_PHOTO_SIZE_MB, PROPERTY_TYPES, ROOM_TYPES } from "@/lib/constants";
import { roomSurface } from "@/lib/constants";
import {
  propertyTypeLabel,
  roomTypeLabel,
  scopeLabel,
} from "@/lib/labels";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SimulatorState } from "./types";

type Props = {
  state: SimulatorState;
  onChange: (patch: Partial<SimulatorState>) => void;
  totalSurface: number;
  errors: Record<string, string>;
};

/** Compact text-only selectable chip. */
const Chip = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={cn(
      "rounded-full border px-4 py-2 text-sm font-medium transition-all",
      selected
        ? "border-primary bg-primary text-primary-foreground shadow-soft"
        : "border-border/80 bg-card text-foreground hover:border-primary/50 hover:bg-secondary/60",
    )}
  >
    {label}
  </button>
);

export const StepEspace = ({ state, onChange, totalSurface, errors }: Props) => {
  const { t } = useTranslation();
  const isWhole = state.scope === "toute_propriete";
  const roomPhotoInputs = useRef<(HTMLInputElement | null)[]>([]);

  const updateRoom = (
    index: number,
    patch: Partial<SimulatorState["rooms"][number]>,
  ) => {
    onChange({
      rooms: state.rooms.map((room, i) => (i === index ? { ...room, ...patch } : room)),
    });
  };

  const attachRoomPhoto = (index: number, file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024 || !file.type.startsWith("image/")) return;
    const room = state.rooms[index];
    if (room.photo) URL.revokeObjectURL(room.photo.previewUrl);
    updateRoom(index, { photo: { file, previewUrl: URL.createObjectURL(file) } });
  };

  const removeRoomPhoto = (index: number) => {
    const room = state.rooms[index];
    if (room.photo) URL.revokeObjectURL(room.photo.previewUrl);
    updateRoom(index, { photo: undefined });
  };

  return (
    <StepCard icon={Ruler} title={t("espace.title")} subtitle={t("espace.subtitle")}>
      <div className="space-y-6">
        <div>
          <p className="mb-2.5 text-sm font-semibold text-foreground">{t("espace.property")}</p>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((type) => (
              <Chip
                key={type}
                label={propertyTypeLabel(type, t)}
                selected={state.propertyType === type}
                onClick={() => onChange({ propertyType: type })}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-sm font-semibold text-foreground">{t("espace.scope")}</p>
          <div className="flex flex-wrap gap-2">
            {DESIGN_SCOPES.map((scope) => (
              <Chip
                key={scope}
                label={scopeLabel(scope, t)}
                selected={state.scope === scope}
                onClick={() => onChange({ scope })}
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

                      <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="min-w-0 space-y-1.5">
                          <Label className="truncate text-[11px] leading-tight text-muted-foreground sm:text-xs">
                            {t("scope.rooms.length")}
                          </Label>
                          <Input
                            value={room.length}
                            onChange={(event) => updateRoom(index, { length: event.target.value })}
                            className="h-10 min-w-0"
                            inputMode="decimal"
                            dir="ltr"
                          />
                        </div>
                        <div className="min-w-0 space-y-1.5">
                          <Label className="truncate text-[11px] leading-tight text-muted-foreground sm:text-xs">
                            {t("scope.rooms.width")}
                          </Label>
                          <Input
                            value={room.width}
                            onChange={(event) => updateRoom(index, { width: event.target.value })}
                            className="h-10 min-w-0"
                            inputMode="decimal"
                            dir="ltr"
                          />
                        </div>
                        <div className="min-w-0 space-y-1.5">
                          <Label className="truncate text-[11px] leading-tight text-muted-foreground sm:text-xs">
                            {t("scope.rooms.height")}
                          </Label>
                          <Input
                            value={room.height}
                            onChange={(event) => updateRoom(index, { height: event.target.value })}
                            className="h-10 min-w-0"
                            inputMode="decimal"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <input
                          ref={(element) => {
                            roomPhotoInputs.current[index] = element;
                          }}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(event) => {
                            attachRoomPhoto(index, event.target.files?.[0]);
                            event.target.value = "";
                          }}
                        />
                        {room.photo ? (
                          <div className="flex items-center gap-3 rounded-xl bg-secondary/40 p-2">
                            <img
                              src={room.photo.previewUrl}
                              alt={t("photos.title")}
                              className="size-14 rounded-lg object-cover"
                            />
                            <p className="flex-1 text-xs text-muted-foreground">
                              {t("photos.attached")}
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => removeRoomPhoto(index)}
                            >
                              <Trash2 className="size-4" aria-hidden />
                              {t("scope.rooms.remove")}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="soft"
                            size="sm"
                            className="rounded-full"
                            onClick={() => roomPhotoInputs.current[index]?.click()}
                          >
                            <ImagePlus className="size-4" aria-hidden />
                            {t("photos.upload")}
                          </Button>
                        )}
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

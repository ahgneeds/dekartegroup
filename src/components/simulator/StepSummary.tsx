import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Camera, ImagePlus, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StepCard } from "./StepCard";
import {
  propertyTypeLabel,
  roomTypeLabel,
  scopeLabel,
  styleLabel,
} from "@/lib/labels";
import { roomSurface, MAX_PHOTO_SIZE_MB } from "@/lib/constants";
import { formatDh, formatNumber } from "@/lib/format";
import type { PendingPhoto, SimulatorState } from "./types";

type Props = {
  state: SimulatorState;
  onChange: (patch: Partial<SimulatorState>) => void;
  totalSurface: number;
  pricePerM2: number;
  submitting: boolean;
  onSubmit: () => void;
};

export const StepSummary = ({
  state,
  onChange,
  totalSurface,
  pricePerM2,
  submitting,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const totalPrice = totalSurface * pricePerM2;

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const added: PendingPhoto[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024 || !file.type.startsWith("image/")) {
        continue;
      }
      added.push({ file, previewUrl: URL.createObjectURL(file) });
    }
    if (added.length > 0) {
      onChange({ photos: [...state.photos, ...added] });
    }
  };

  const removePhoto = (index: number) => {
    const photo = state.photos[index];
    URL.revokeObjectURL(photo.previewUrl);
    onChange({ photos: state.photos.filter((_, i) => i !== index) });
  };

  const rows: { label: string; value: string }[] = [
    { label: t("summary.client"), value: state.name.trim() },
    { label: t("summary.whatsapp"), value: state.whatsapp.trim() },
    { label: t("summary.property"), value: propertyTypeLabel(state.propertyType, t) },
    {
      label: t("summary.scope"),
      value:
        state.scope === "toute_propriete"
          ? scopeLabel(state.scope, t)
          : `${scopeLabel(state.scope, t)} · ${state.rooms.length} ${t("summary.rooms")}`,
    },
    { label: t("summary.surface"), value: `${formatNumber(totalSurface)} m²` },
    { label: t("summary.style"), value: styleLabel(state.style, t) },
    {
      label: t("summary.budget"),
      value: state.budget ? formatDh(Number.parseFloat(state.budget)) : "—",
    },
    { label: t("summary.pricePerM2"), value: formatDh(pricePerM2) },
  ];

  return (
    <StepCard icon={Camera} title={t("summary.title")} subtitle={t("summary.subtitle")}>
      {/* Optional photos — compact */}
      <div className="mb-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        {state.photos.length === 0 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-border bg-background/50 px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
          >
            <ImagePlus className="size-5 text-primary" aria-hidden />
            {t("photos.upload")} — {t("photos.optional")}
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
            {state.photos.map((photo, index) => (
              <div key={photo.previewUrl} className="group relative overflow-hidden rounded-xl border border-border/70">
                <img
                  src={photo.previewUrl}
                  alt={`${t("photos.title")} ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  aria-label={t("photos.remove")}
                  className="absolute end-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-destructive"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              aria-label={t("photos.upload")}
            >
              <ImagePlus className="size-5" aria-hidden />
            </button>
          </div>
        )}
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Camera className="size-3.5 shrink-0 text-primary" aria-hidden />
          {t("photos.tip")}
        </p>
      </div>

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
              <li key={index} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  {roomTypeLabel(room.type, t)}
                  {room.photo && <Camera className="size-3.5 text-primary" aria-hidden />}
                </span>
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

      <div className="mt-5 flex items-center justify-between rounded-2xl border border-border/70 bg-background/50 px-5 py-4">
        <span className="text-sm font-semibold text-muted-foreground">{t("price.total")}</span>
        <span className="font-display text-2xl font-bold text-primary" dir="ltr">
          {formatDh(totalPrice)}
        </span>
      </div>

      <Button
        type="button"
        size="lg"
        className="mt-6 w-full rounded-full bg-primary text-base text-primary-foreground shadow-elegant hover:bg-primary/90"
        onClick={onSubmit}
        disabled={submitting}
      >
        <Send className="size-4" aria-hidden />
        {submitting ? t("summary.sending") : t("summary.send")}
      </Button>
    </StepCard>
  );
};

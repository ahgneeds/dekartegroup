import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Camera, ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StepCard } from "./StepCard";
import { MAX_PHOTO_SIZE_MB } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { PendingPhoto, SimulatorState } from "./types";

type Props = {
  state: SimulatorState;
  onChange: (patch: Partial<SimulatorState>) => void;
  errors: Record<string, string>;
};

export const StepPhotos = ({ state, onChange, errors }: Props) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const added: PendingPhoto[] = [];
    for (const file of Array.from(files)) {
      if (
        file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024 ||
        !file.type.startsWith("image/")
      ) {
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

  return (
    <StepCard
      icon={Camera}
      title={t("photos.title")}
      subtitle={t("photos.subtitle")}
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-2xl bg-primary/5 p-4 ring-1 ring-primary/15">
          <Camera className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground/90">{t("photos.tip")}</p>
        </div>

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

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
          }}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background/50 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
            <ImagePlus className="size-5" aria-hidden />
          </span>
          <span className="font-semibold text-foreground">{t("photos.upload")}</span>
          <span className="text-xs text-muted-foreground">
            JPG · PNG · WEBP — {t("photos.maxSize", { size: formatNumber(MAX_PHOTO_SIZE_MB) })}
          </span>
        </div>

        {state.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {state.photos.map((photo, index) => (
              <div
                key={photo.previewUrl}
                className="group relative overflow-hidden rounded-2xl border border-border/70"
              >
                <img
                  src={photo.previewUrl}
                  alt={`${t("photos.title")} ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  aria-label={t("photos.remove")}
                  className="absolute end-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-destructive"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.photos && <p className="text-sm text-destructive">{errors.photos}</p>}
      </div>
    </StepCard>
  );
};

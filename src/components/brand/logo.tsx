import { useState } from "react";
import { Armchair } from "lucide-react";

import { IMAGES } from "@/lib/images";

/**
 * Dekarte logo. Uses the uploaded logo file when present (public/images/logo.png)
 * and falls back to the styled wordmark otherwise.
 */
export const Logo = ({ compact = false }: { compact?: boolean }) => {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={IMAGES.logo}
        alt="Dekarte"
        className={compact ? "h-9 w-auto object-contain" : "h-11 w-auto object-contain"}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
        <Armchair className="size-5" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Dekarte
        </span>
        {!compact && (
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Univers Immobilier & Déco
          </span>
        )}
      </span>
    </span>
  );
};

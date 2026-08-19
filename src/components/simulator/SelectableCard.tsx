import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectableCardProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
};

export const SelectableCard = ({
  icon: Icon,
  title,
  description,
  selected,
  onSelect,
  className,
}: SelectableCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-start transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary/40"
          : "border-border/80 bg-card hover:border-primary/40 hover:bg-secondary/50",
        className,
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-xl transition-colors",
            selected ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
      )}
      <span className="font-semibold text-foreground">{title}</span>
      {description && (
        <span className="text-sm leading-relaxed text-muted-foreground">{description}</span>
      )}
      <span
        className={cn(
          "absolute end-3 top-3 flex size-6 items-center justify-center rounded-full border transition-all",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-transparent",
        )}
      >
        <Check className="size-3.5" aria-hidden />
      </span>
    </button>
  );
};

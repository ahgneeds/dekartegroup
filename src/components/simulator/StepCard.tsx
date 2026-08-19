import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StepCardProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export const StepCard = ({ icon: Icon, title, subtitle, children }: StepCardProps) => {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
};

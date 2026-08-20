import { formatSurface } from "@/lib/format";

/**
 * Small formatted surface used in room lines.
 */
export const SurfaceTag = ({ surface }: { surface: number }) => {
  return (
    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
      {formatSurface(surface)}
    </span>
  );
};

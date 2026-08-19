import { useState } from "react";
import { Armchair } from "lucide-react";

import { cn } from "@/lib/utils";

type BrandImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Ratio box used when the image fails to load. */
  fallbackClassName?: string;
};

/**
 * Renders an image from the public folder and gracefully falls back to a
 * decorative gradient block if the file has not been provided yet.
 */
export const BrandImage = ({
  src,
  alt,
  className,
  fallbackClassName,
}: BrandImageProps) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-primary text-primary-foreground/90",
          fallbackClassName,
          className,
        )}
      >
        <Armchair className="size-10" aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
};

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fallbackLng, languageOptions, normalizeLanguage } from "@/i18n/config";

type LanguageSwitcherProps = {
  className?: string;
};

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();

  const currentLanguage =
    normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? fallbackLng;

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-full border border-input bg-card p-0.5 shadow-soft",
        className,
      )}
    >
      {languageOptions.map((language) => {
        const active = language.value === currentLanguage;
        return (
          <Button
            key={language.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              void i18n.changeLanguage(language.value);
            }}
            className={cn(
              "h-8 rounded-full px-3.5 text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {language.label}
          </Button>
        );
      })}
    </div>
  );
};

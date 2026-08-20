import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_PRICE_PER_M2, PAYMENT_INFO } from "@/lib/constants";

type SiteSettings = {
  /** Live price per m² from the admin back office. */
  price: number;
  /** Live WhatsApp number (international format, e.g. +212661221643). */
  whatsappIntl: string;
};

/**
 * Live site settings (price + WhatsApp number), edited from the back office.
 * Falls back to defaults while loading or on error.
 */
export const useSiteSettings = (): SiteSettings => {
  const [settings, setSettings] = useState<SiteSettings>({
    price: DEFAULT_PRICE_PER_M2,
    whatsappIntl: PAYMENT_INFO.whatsappIntl,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("settings")
        .select("price_per_m2, whatsapp_phone")
        .eq("id", 1)
        .maybeSingle();
      if (cancelled) return;
      setSettings({
        price:
          data?.price_per_m2 != null && Number.isFinite(Number(data.price_per_m2))
            ? Number(data.price_per_m2)
            : DEFAULT_PRICE_PER_M2,
        whatsappIntl:
          typeof data?.whatsapp_phone === "string" && data.whatsapp_phone.trim() !== ""
            ? data.whatsapp_phone.trim()
            : PAYMENT_INFO.whatsappIntl,
      });
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
};

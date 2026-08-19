import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_PRICE_PER_M2 } from "@/lib/constants";

/**
 * Live price per m², read from the admin-controlled settings singleton.
 * Falls back to the default of 20 DH/m² while loading or on error.
 */
export const usePricePerM2 = () => {
  const [price, setPrice] = useState<number>(DEFAULT_PRICE_PER_M2);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("settings")
        .select("price_per_m2")
        .eq("id", 1)
        .maybeSingle();
      if (!cancelled) {
        const value = data?.price_per_m2;
        if (value != null && Number.isFinite(Number(value))) {
          setPrice(Number(value));
        }
        setLoaded(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { price, loaded };
};

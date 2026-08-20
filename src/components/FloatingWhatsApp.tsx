import { MessageCircle } from "lucide-react";

import { useSiteSettings } from "@/hooks/use-site-settings";

/**
 * Small, discreet sticky WhatsApp button shown on every page.
 * The number comes from the back office (settings.whatsapp_phone).
 */
export const FloatingWhatsApp = () => {
  const { whatsappIntl } = useSiteSettings();
  const digits = whatsappIntl.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 end-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 ps-4 pe-5 text-white shadow-elegant transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" aria-hidden />
      <span className="text-sm font-semibold" dir="ltr">
        {whatsappIntl}
      </span>
    </a>
  );
};

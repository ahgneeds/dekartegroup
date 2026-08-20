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
      className="fixed bottom-5 end-5 z-50 flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elegant transition-transform hover:scale-105"
    >
      <MessageCircle className="size-6" aria-hidden />
    </a>
  );
};

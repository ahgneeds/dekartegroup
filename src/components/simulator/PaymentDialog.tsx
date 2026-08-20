import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentContent } from "@/components/payment/PaymentContent";
import { formatDh } from "@/lib/format";
import type { RoomInput } from "@/lib/constants";

export type SubmittedRequest = {
  id: string;
  clientName: string;
  whatsapp: string;
  propertyType: string;
  scope: string;
  rooms: RoomInput[];
  totalSurface: number;
  style: string;
  budget: string | null;
  pricePerM2: number;
  totalPrice: number;
};

type PaymentDialogProps = {
  open: boolean;
  request: SubmittedRequest | null;
  onClose: () => void;
};

/**
 * Payment popup shown the instant the user taps "send".
 * Mobile: full-width bottom sheet with a compact header and smooth scrolling.
 * Desktop: centered card with uniform rounded corners.
 */
export const PaymentDialog = ({ open, request, onClose }: PaymentDialogProps) => {
  const { t } = useTranslation();

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="gap-0 overflow-hidden !rounded-[2rem] p-0 ring-1 ring-black/5 sm:max-w-xl [&>button]:z-20 [&>button]:flex [&>button]:size-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-white/10 [&>button]:text-white [&>button]:backdrop-blur [&>button]:right-3 [&>button]:top-3 sm:[&>button]:right-4 sm:[&>button]:top-4">
        <div className="nice-scroll max-h-[92dvh] overflow-y-auto overscroll-contain scroll-smooth">
          <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-gradient-primary px-5 py-4 pe-14 text-primary-foreground sm:gap-3.5 sm:px-8 sm:py-5 sm:pe-16">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur sm:size-11">
              <CheckCircle2 className="size-5 sm:size-6" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="truncate font-display text-base font-semibold leading-tight sm:text-xl">
                  {t("confirmation.title")}
                </DialogTitle>
                <span
                  className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold backdrop-blur sm:px-3.5 sm:py-1.5 sm:text-[11px]"
                  dir="ltr"
                >
                  {t("confirmation.id")} · {request.id.slice(0, 8)}
                </span>
              </div>
              <DialogDescription className="mt-0.5 truncate text-[11px] leading-snug text-primary-foreground/75 sm:mt-1 sm:text-xs">
                {t("confirmation.subtitle")}
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-3 px-5 py-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:space-y-3 sm:px-8 sm:py-6 sm:pb-9">
            <PaymentContent totalDh={formatDh(request.totalPrice)} />

            <div className="pt-2 text-center">
              <Button variant="outline" className="w-full rounded-full px-8 sm:w-auto" onClick={onClose}>
                {t("confirmation.backHome")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

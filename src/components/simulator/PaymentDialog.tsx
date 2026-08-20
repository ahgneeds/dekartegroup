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
 * The WHOLE popup scrolls (header included — nothing stays sticky).
 * The header text always gets full width so it is never squeezed by the
 * reference pill.
 */
export const PaymentDialog = ({ open, request, onClose }: PaymentDialogProps) => {
  const { t } = useTranslation();

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="gap-0 overflow-hidden !rounded-[2rem] p-0 ring-1 ring-black/5 sm:max-w-xl [&>button]:z-20 [&>button]:flex [&>button]:size-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-black/30 [&>button]:text-white [&>button]:backdrop-blur [&>button]:right-3 [&>button]:top-3 sm:[&>button]:right-4 sm:[&>button]:top-4">
        <div className="nice-scroll max-h-[92dvh] overflow-y-auto overscroll-contain scroll-smooth">
          <div className="border-b border-white/10 bg-gradient-primary px-5 py-5 pe-12 text-primary-foreground sm:px-8 sm:py-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur sm:size-11">
                <CheckCircle2 className="size-5 sm:size-6" aria-hidden />
              </span>
              <DialogTitle className="font-display text-lg font-semibold leading-tight sm:text-xl">
                {t("confirmation.title")}
              </DialogTitle>
            </div>
            <DialogDescription className="mt-2 text-xs leading-relaxed text-primary-foreground/80 sm:text-sm">
              {t("confirmation.subtitle")}
            </DialogDescription>
            <span
              className="mt-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold backdrop-blur sm:text-[11px]"
              dir="ltr"
            >
              {t("confirmation.id")} · {request.id.slice(0, 8)}
            </span>
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

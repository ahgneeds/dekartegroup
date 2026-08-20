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
 * Shown the instant the user taps "send": a compact success header, then the
 * payment instructions take almost the whole modal so the bank and transfer
 * details are impossible to miss. Uniform rounded corners + soft scrolling.
 */
export const PaymentDialog = ({ open, request, onClose }: PaymentDialogProps) => {
  const { t } = useTranslation();

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="gap-0 overflow-hidden !rounded-[2rem] p-0 ring-1 ring-black/5 sm:max-w-xl [&>button]:z-20 [&>button]:flex [&>button]:size-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-white/10 [&>button]:text-white [&>button]:backdrop-blur">
        <div className="nice-scroll max-h-[92vh] overflow-y-auto overscroll-contain scroll-smooth">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-gradient-primary px-6 py-5 pe-16 text-primary-foreground sm:px-8">
            <div className="flex min-w-0 items-center gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <CheckCircle2 className="size-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <DialogTitle className="font-display text-xl font-semibold leading-tight">
                  {t("confirmation.title")}
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs leading-snug text-primary-foreground/75">
                  {t("confirmation.subtitle")}
                </DialogDescription>
              </div>
            </div>
            <span
              className="shrink-0 self-center rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur"
              dir="ltr"
            >
              {t("confirmation.id")} · {request.id.slice(0, 8)}
            </span>
          </div>

          <div className="space-y-3 px-6 py-6 pb-9 sm:px-8">
            <PaymentContent totalDh={formatDh(request.totalPrice)} />

            <div className="pt-2 text-center">
              <Button variant="outline" className="rounded-full px-8" onClick={onClose}>
                {t("confirmation.backHome")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

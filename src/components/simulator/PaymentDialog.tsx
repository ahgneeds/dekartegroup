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
import { styleLabel } from "@/lib/labels";
import { formatDh, formatNumber } from "@/lib/format";
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
 * Shown immediately after the request is saved: success confirmation plus
 * the full manual payment instructions.
 */
export const PaymentDialog = ({ open, request, onClose }: PaymentDialogProps) => {
  const { t } = useTranslation();

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-xl">
        <div className="bg-gradient-primary px-6 py-6 text-primary-foreground sm:px-8">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <CheckCircle2 className="size-8" aria-hidden />
          </span>
          <DialogTitle className="mt-4 font-display text-2xl font-semibold">
            {t("confirmation.title")}
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-sm text-primary-foreground/80">
            {t("confirmation.subtitle")}
          </DialogDescription>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-black/15 px-3.5 py-1 text-xs">
            {t("confirmation.id")} · <span dir="ltr">{request.id.slice(0, 8)}</span>
          </p>
        </div>

        <div className="space-y-3 px-6 py-6 sm:px-8">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-background/60 p-3 text-center ring-1 ring-border/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("summary.surface")}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-foreground" dir="ltr">
                {formatNumber(request.totalSurface)} m²
              </p>
            </div>
            <div className="rounded-xl bg-background/60 p-3 text-center ring-1 ring-border/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("summary.style")}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-foreground">
                {styleLabel(request.style, t)}
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3 text-center ring-1 ring-primary/20">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {t("summary.total")}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-primary" dir="ltr">
                {formatDh(request.totalPrice)}
              </p>
            </div>
          </div>

          <PaymentContent totalDh={formatDh(request.totalPrice)} />

          <div className="pt-2 text-center">
            <Button variant="outline" className="rounded-full px-8" onClick={onClose}>
              {t("confirmation.backHome")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

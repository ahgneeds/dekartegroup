import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/brand/logo";
import { StepContact } from "@/components/simulator/StepContact";
import { StepEspace } from "@/components/simulator/StepEspace";
import { StepStyle } from "@/components/simulator/StepStyle";
import { StepSummary } from "@/components/simulator/StepSummary";
import {
  initialSimulatorState,
  type SimulatorState,
  type SubmittedRequest,
} from "@/components/simulator/types";
import { usePricePerM2 } from "@/hooks/use-price-per-m2";
import { supabase } from "@/integrations/supabase/client";
import { PHOTO_BUCKET, roomSurface } from "@/lib/constants";
import { budgetSchema, contactSchema, normalizeWhatsApp, parsePositiveNumber } from "@/lib/validation";
import { cn } from "@/lib/utils";

const Simulator = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<SimulatorState>(initialSimulatorState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { price } = usePricePerM2();

  const stepLabels = [
    t("sim.step1"),
    t("sim.step2"),
    t("sim.step3"),
    t("sim.step4"),
  ];
  const stepCount = stepLabels.length;

  const update = (patch: Partial<SimulatorState>) => {
    setState((previous) => ({ ...previous, ...patch }));
  };

  const totalSurface = useMemo(() => {
    if (state.scope === "toute_propriete") {
      return parsePositiveNumber(state.totalSurface) ?? 0;
    }
    return state.rooms.reduce((sum, room) => sum + roomSurface(room), 0);
  }, [state]);

  const validateStep = (index: number): boolean => {
    const nextErrors: Record<string, string> = {};
    let valid = true;

    if (index === 0) {
      const result = contactSchema.safeParse(state);
      if (!result.success) {
        valid = false;
        for (const issue of result.error.issues) {
          const field = String(issue.path[0] ?? "");
          nextErrors[field] = t("contact.errors.invalid");
        }
      }
    } else if (index === 1) {
      if (!state.propertyType) {
        valid = false;
        nextErrors.step = t("errors.selection");
      } else if (!state.scope) {
        valid = false;
        nextErrors.step = t("errors.selection");
      } else if (state.scope === "toute_propriete") {
        if (totalSurface <= 0) {
          valid = false;
          nextErrors.totalSurface = t("errors.surface");
        }
      } else if (totalSurface <= 0) {
        valid = false;
        nextErrors.rooms = t("errors.rooms");
      }
    } else if (index === 2) {
      if (!state.style) {
        valid = false;
        nextErrors.step = t("errors.selection");
      } else {
        const result = budgetSchema.safeParse(state.budget);
        if (!result.success) {
          valid = false;
          nextErrors.budget = t("budget.minError");
        }
      }
    }

    setErrors(nextErrors);
    return valid;
  };

  const goNext = () => {
    if (validateStep(step)) {
      setErrors({});
      setStep((current) => Math.min(current + 1, stepCount - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!validateStep(0) || totalSurface <= 0) {
      setErrors((previous) => ({ ...previous, step: t("errors.submit") }));
      return;
    }

    const normalizedWhatsapp = normalizeWhatsApp(state.whatsapp) ?? state.whatsapp.trim();
    const totalPrice = totalSurface * price;
    const requestId = crypto.randomUUID();

    const payload: SubmittedRequest = {
      id: requestId,
      clientName: state.name.trim(),
      whatsapp: normalizedWhatsapp,
      propertyType: state.propertyType,
      scope: state.scope,
      rooms: state.rooms,
      totalSurface: Number(totalSurface.toFixed(2)),
      style: state.style,
      budget: state.budget.trim() || null,
      pricePerM2: price,
      totalPrice: Number(totalPrice.toFixed(2)),
    };

    // Navigate to the payment page instantly — the request is saved in the
    // background so the user never waits before seeing how to pay.
    sessionStorage.setItem("dekarte_last_request", JSON.stringify(payload));
    navigate("/paiement");

    void persistRequest(payload, state);
  };

  const persistRequest = async (payload: SubmittedRequest, state: SimulatorState) => {
    setSubmitting(true);
    try {
      const uploadPhoto = async (file: File): Promise<string | null> => {
        try {
          const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
          const path = `photos/${crypto.randomUUID()}.${extension}`;
          const { error } = await supabase.storage
            .from(PHOTO_BUCKET)
            .upload(path, file, {
              contentType: file.type || "image/jpeg",
              upsert: false,
            });
          return error ? null : path;
        } catch {
          return null;
        }
      };

      // Room photos are optional: upload them in parallel, but never block
      // the request if an upload fails — the request itself must always be saved.
      const roomPhotoPaths = await Promise.all(
        state.rooms.map((room) =>
          room.photo ? uploadPhoto(room.photo.file) : Promise.resolve(null),
        ),
      );

      const { error } = await supabase
        .from("requests")
        .insert({
          id: payload.id,
          client_name: payload.clientName,
          whatsapp: payload.whatsapp,
          property_type: payload.propertyType,
          design_scope: payload.scope,
          rooms:
            payload.scope === "toute_propriete"
              ? []
              : payload.rooms.map((room, index) => ({
                  type: room.type,
                  longueur: room.length.trim() || null,
                  largeur: room.width.trim() || null,
                  hauteur: room.height.trim() || null,
                  surface: roomSurface(room),
                  photo_url: roomPhotoPaths[index] ?? null,
                })),
          total_surface_m2: payload.totalSurface,
          style: payload.style,
          budget_dh: payload.budget ? Number.parseFloat(payload.budget) : null,
          price_per_m2: payload.pricePerM2,
          total_price_dh: payload.totalPrice,
          photo_urls: [],
        });

      if (error) throw error;
    } catch (error) {
      console.error("Dekarte submit failed:", error);
      toast.error(t("errors.saveFallback"));
    } finally {
      setSubmitting(false);
    }
  };

  const isSummary = step === stepCount - 1;

  return (
    <div className="flex min-h-full flex-col bg-gradient-soft">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="Dekarte — accueil">
            <Logo compact />
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container max-w-3xl flex-1 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("sim.title")}
          </h1>
          <p className="mt-1.5 text-muted-foreground">{t("sim.subtitle")}</p>

          <ol className="mt-6 flex items-center gap-1.5 sm:gap-2">
            {stepLabels.map((label, index) => {
              const active = index === step;
              const done = index < step;
              return (
                <li key={label} className="flex flex-1 flex-col gap-1.5">
                  <span
                    className={cn(
                      "h-1.5 rounded-full transition-colors",
                      active && "bg-primary",
                      done && "bg-primary/40",
                      !active && !done && "bg-border",
                    )}
                  />
                  <span
                    className={cn(
                      "hidden items-center gap-1.5 text-[11px] font-medium sm:flex",
                      active ? "text-primary" : done ? "text-muted-foreground" : "text-muted-foreground/60",
                    )}
                  >
                    {done ? (
                      <Check className="size-3" aria-hidden />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="space-y-6">
          {step === 0 && (
            <StepContact state={state} onChange={update} errors={errors} />
          )}
          {step === 1 && (
            <StepEspace state={state} onChange={update} totalSurface={totalSurface} errors={errors} />
          )}
          {step === 2 && <StepStyle state={state} onChange={update} errors={errors} />}
          {step === 3 && (
            <StepSummary
              state={state}
              totalSurface={totalSurface}
              pricePerM2={price}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
          )}

          {errors.step && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errors.step}
            </p>
          )}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={step === 0}
              className="rounded-full"
            >
              <ArrowLeft className="size-4" aria-hidden />
              {t("common.back")}
            </Button>
            {!isSummary && (
              <Button type="button" onClick={goNext} className="rounded-full px-7 shadow-soft">
                {t("common.next")}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Simulator;

import { z } from "zod";
import { MIN_BUDGET_DH } from "./constants";

/**
 * Normalize a Moroccan WhatsApp number to the +212XXXXXXXXX form.
 * Accepts: 0612345678, 0712345678, +212612345678, 00212612345678.
 * Returns null when the number is not a valid Moroccan mobile number.
 */
export function normalizeWhatsApp(value: string): string | null {
  const cleaned = value.replace(/[\s.\-()]/g, "");
  const local = cleaned.match(/^(0[67]\d{8})$/);
  if (local) return `+212${local[1].slice(1)}`;
  const intl = cleaned.match(/^(?:\+212|00212)([67]\d{8})$/);
  if (intl) return `+212${intl[1]}`;
  return null;
}

export const whatsappSchema = z
  .string()
  .trim()
  .min(1, "whatsapp")
  .refine((value) => normalizeWhatsApp(value) !== null, "whatsapp");

const optionalEmailSchema = z
  .union([z.email(), z.literal("")])
  .optional();

export const contactSchema = z.object({
  name: z.string().trim().min(2),
  whatsapp: whatsappSchema,
  email: optionalEmailSchema,
});

export const parsePositiveNumber = (value: string): number | null => {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
};

export const budgetSchema = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    const parsed = Number.parseFloat(value);
    return !Number.isNaN(parsed) && parsed >= MIN_BUDGET_DH;
  });

export type ContactInput = z.infer<typeof contactSchema>;

import type { RoomInput } from "@/lib/constants";

export type PendingPhoto = {
  file: File;
  previewUrl: string;
};

/** A room with an optional attached photo. */
export type SimulatorRoom = RoomInput & { photo?: PendingPhoto };

/** Data needed to display the post-submit payment page. */
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

export type SimulatorState = {
  name: string;
  whatsapp: string;
  propertyType: string;
  scope: string;
  rooms: SimulatorRoom[];
  totalSurface: string;
  style: string;
  budget: string;
};

export const initialSimulatorState: SimulatorState = {
  name: "",
  whatsapp: "",
  propertyType: "",
  scope: "",
  rooms: [{ type: "salon", length: "", width: "", height: "" }],
  totalSurface: "",
  style: "",
  budget: "",
};

export const STEP_LABELS = [
  "sim.step1",
  "sim.step2",
  "sim.step3",
  "sim.step4",
] as const;

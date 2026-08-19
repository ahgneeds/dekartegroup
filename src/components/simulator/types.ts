import type { RoomInput } from "@/lib/constants";

export type PendingPhoto = {
  file: File;
  previewUrl: string;
};

export type SimulatorState = {
  name: string;
  whatsapp: string;
  email: string;
  propertyType: string;
  scope: string;
  rooms: RoomInput[];
  totalSurface: string;
  style: string;
  budget: string;
  photos: PendingPhoto[];
};

export const initialSimulatorState: SimulatorState = {
  name: "",
  whatsapp: "",
  email: "",
  propertyType: "",
  scope: "",
  rooms: [{ type: "salon", length: "", width: "", height: "" }],
  totalSurface: "",
  style: "",
  budget: "",
  photos: [],
};

export const STEP_LABELS = [
  "sim.step1",
  "sim.step2",
  "sim.step3",
  "sim.step4",
  "sim.step5",
] as const;

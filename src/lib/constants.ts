export const PROPERTY_TYPES = [
  "appartement",
  "villa",
  "studio",
  "maison",
  "local_commercial",
  "bureau",
  "autre",
] as const;

export const ROOM_TYPES = [
  "salon",
  "chambre",
  "balcon",
  "terrasse",
  "entree",
  "salle_a_manger",
  "vestibule",
  "autre",
] as const;

export const STYLES = ["marocain", "moderne", "mixte"] as const;

export const DESIGN_SCOPES = [
  "une_piece",
  "plusieurs_pieces",
  "toute_propriete",
] as const;

export const PAYMENT_METHODS = [
  "virement",
  "cash_plus",
  "wafacash",
  "western_union",
] as const;

export const REQUEST_STATUSES = [
  "demande_recue",
  "paiement_en_attente",
  "paiement_recu",
  "en_cours",
  "design_livre",
  "termine",
] as const;

export const DEFAULT_PRICE_PER_M2 = 20;
export const MIN_BUDGET_DH = 2000;
export const MAX_PHOTO_SIZE_MB = 10;
export const PHOTO_BUCKET = "request-photos";

export const PAYMENT_INFO = {
  accountName: "Adam Houat",
  bank: "SAHAM BANK",
  rib: "022780000053002874403274",
  whatsapp: "0661221643",
  whatsappIntl: "+212661221643",
  city: "Casablanca",
  country: "Maroc",
} as const;

export type RoomInput = {
  type: string;
  length: string;
  width: string;
  height: string;
};

export type UploadedPhoto = {
  path: string;
  previewUrl: string;
};

export const roomSurface = (room: RoomInput): number => {
  const length = Number.parseFloat(room.length);
  const width = Number.parseFloat(room.width);
  if (Number.isNaN(length) || Number.isNaN(width) || length <= 0 || width <= 0) {
    return 0;
  }
  return length * width;
};

export const roomHeight = (room: RoomInput): number => {
  const height = Number.parseFloat(room.height);
  return Number.isNaN(height) ? 0 : height;
};

/** French-only labels for the admin back office (static, not translated). */
export const ADMIN_LABELS: Record<string, string> = {
  // property types
  appartement: "Appartement",
  villa: "Villa",
  studio: "Studio",
  maison: "Maison",
  local_commercial: "Local commercial",
  bureau: "Bureau",
  autre: "Autre",
  // room types
  salon: "Salon",
  chambre: "Chambre",
  cuisine: "Cuisine",
  salle_de_bain: "Salle de bain",
  balcon: "Balcon",
  terrasse: "Terrasse",
  entree: "Entrée",
  salle_a_manger: "Salle à manger",
  vestibule: "Vestibule",
  // design scopes
  une_piece: "Une pièce",
  plusieurs_pieces: "Plusieurs pièces",
  toute_propriete: "Toute la propriété",
  // styles
  marocain: "Marocain",
  moderne: "Moderne",
  mixte: "Mixte",
  // request statuses
  demande_recue: "Demande reçue",
  paiement_en_attente: "Paiement en attente",
  paiement_recu: "Paiement reçu",
  en_cours: "En cours",
  design_livre: "Design livré",
  termine: "Terminé",
  // payment statuses / methods
  non_paye: "Non payé",
  paye: "Payé",
  virement: "Virement bancaire",
  cash_plus: "Cash Plus",
  wafacash: "Wafacash",
  western_union: "Western Union",
};

export const adminLabel = (code: string): string =>
  ADMIN_LABELS[code] ?? code;

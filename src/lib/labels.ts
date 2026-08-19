import type { TFunction } from "i18next";

const map = <T extends string>(record: Record<T, string>) => record;

export const propertyTypeLabel = (code: string, t: TFunction): string =>
  map({
    appartement: t("propertyTypes.appartement"),
    villa: t("propertyTypes.villa"),
    studio: t("propertyTypes.studio"),
    maison: t("propertyTypes.maison"),
    local_commercial: t("propertyTypes.localCommercial"),
    bureau: t("propertyTypes.bureau"),
    autre: t("propertyTypes.autre"),
  })[code as keyof typeof map] ?? code;

export const roomTypeLabel = (code: string, t: TFunction): string =>
  map({
    salon: t("roomTypes.salon"),
    chambre: t("roomTypes.chambre"),
    cuisine: t("roomTypes.cuisine"),
    salle_de_bain: t("roomTypes.salleDeBain"),
    bureau: t("roomTypes.bureau"),
    balcon: t("roomTypes.balcon"),
    terrasse: t("roomTypes.terrasse"),
    entree: t("roomTypes.entree"),
    salle_a_manger: t("roomTypes.salleAManger"),
    mra7: t("roomTypes.mra7"),
    autre: t("roomTypes.autre"),
  })[code as keyof typeof map] ?? code;

export const styleLabel = (code: string, t: TFunction): string =>
  map({
    marocain: t("styles.marocain.title"),
    moderne: t("styles.moderne.title"),
    mixte: t("styles.mixte.title"),
  })[code as keyof typeof map] ?? code;

export const paymentMethodLabel = (code: string, t: TFunction): string =>
  map({
    virement: t("payment.methods.virement"),
    cash_plus: t("payment.methods.cashPlus"),
    wafacash: t("payment.methods.wafacash"),
  })[code as keyof typeof map] ?? code;

export const scopeLabel = (code: string, t: TFunction): string =>
  map({
    une_piece: t("scope.unePiece"),
    plusieurs_pieces: t("scope.plusieursPieces"),
    toute_propriete: t("scope.toutePropriete"),
  })[code as keyof typeof map] ?? code;

import type { TFunction } from "i18next";

const map = <T extends string>(record: Record<T, string>) => record;

export const propertyTypeLabel = (code: string, t: TFunction): string =>
  map({
    appartement: t("propertyTypes.appartement"),
    villa: t("propertyTypes.villa"),
    studio: t("propertyTypes.studio"),
    autre: t("propertyTypes.autre"),
  })[code as keyof typeof map] ?? code;

export const roomTypeLabel = (code: string, t: TFunction): string =>
  map({
    salon: t("roomTypes.salon"),
    chambre: t("roomTypes.chambre"),
    balcon: t("roomTypes.balcon"),
    terrasse: t("roomTypes.terrasse"),
    entree: t("roomTypes.entree"),
    salle_a_manger: t("roomTypes.salleAManger"),
    vestibule: t("roomTypes.vestibule"),
    autre: t("roomTypes.autre"),
  })[code as keyof typeof map] ?? code;

export const styleLabel = (code: string, t: TFunction): string =>
  map({
    marocain: t("styles.marocain.title"),
    moderne: t("styles.moderne.title"),
    mixte: t("styles.mixte.title"),
  })[code as keyof typeof map] ?? code;

export const scopeLabel = (code: string, t: TFunction): string =>
  map({
    une_piece: t("scope.unePiece"),
    plusieurs_pieces: t("scope.plusieursPieces"),
    toute_propriete: t("scope.toutePropriete"),
  })[code as keyof typeof map] ?? code;

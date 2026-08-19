export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value);

export const formatSurface = (m2: number): string => `${formatNumber(m2)} m²`;

export const formatDh = (amount: number): string =>
  `${formatNumber(amount)} DH`;

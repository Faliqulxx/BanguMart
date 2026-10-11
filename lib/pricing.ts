export type PriceTier = "eceran" | "grosir" | "kontraktor";

export interface TierPrices {
  eceran: number;
  grosir: number;
  kontraktor: number;
  minGrosirQty?: number;
}

/**
 * Menentukan harga efektif berdasarkan jenis pelanggan dan jumlah pembelian
 */
export function getEffectivePrice(
  prices: TierPrices,
  customerTier: PriceTier = "eceran",
  qty: number = 1
): { unitPrice: number; appliedTier: PriceTier } {
  // Jika pelanggan bertipe kontraktor, otomatis dapat harga kontraktor
  if (customerTier === "kontraktor") {
    return { unitPrice: prices.kontraktor, appliedTier: "kontraktor" };
  }

  // Jika pelanggan toko/tukang bertipe grosir, atau jumlah mencapai minGrosirQty
  const minGrosir = prices.minGrosirQty || 5;
  if (customerTier === "grosir" || qty >= minGrosir) {
    return { unitPrice: prices.grosir, appliedTier: "grosir" };
  }

  // Standar eceran
  return { unitPrice: prices.eceran, appliedTier: "eceran" };
}

/**
 * Menghitung subtotal dengan diskon item
 */
export function calculateItemTotal(
  unitPrice: number,
  qty: number,
  discountAmount: number = 0,
  discountPercent: number = 0
): number {
  const gross = unitPrice * qty;
  const pctDiscount = (gross * discountPercent) / 100;
  const net = gross - discountAmount - pctDiscount;
  return Math.max(0, Math.round(net));
}

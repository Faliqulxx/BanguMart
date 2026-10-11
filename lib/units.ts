export interface UnitConversion {
  unit: string;
  factor: number; // berapa unit dasar yang setara dengan 1 unit ini
  label?: string;
}

export interface ProductUnit {
  unit: string;
  factor: number; // e.g. 1 dus = 0.96 m2 or 1 ikat = 10 batang
  isBase?: boolean;
  priceModifier?: number; // optional custom ratio if not strictly linear
}

export const STANDARD_UNITS = [
  { id: "sak", name: "Sak", desc: "Semen, mortar, perekat" },
  { id: "dus", name: "Dus / Box", desc: "Keramik, granit, paku per dus" },
  { id: "batang", name: "Batang", desc: "Besi beton, pipa PVC, reng baja" },
  { id: "lembar", name: "Lembar", desc: "Triplek, gypsum, asbes, seng" },
  { id: "kaleng", name: "Kaleng / Pail", desc: "Cat tembok, pelapis anti bocor" },
  { id: "roll", name: "Roll", desc: "Kabel listrik, kawat, selang" },
  { id: "m", name: "Meter (m)", desc: "Kabel eceran, selang eceran" },
  { id: "m2", name: "Meter Persegi (m²)", desc: "Keramik eceran, granit luas" },
  { id: "m3", name: "Meter Kubik (m³)", desc: "Pasir cor, split, urug" },
  { id: "kg", name: "Kilogram (kg)", desc: "Paku eceran, kawat bendrat" },
  { id: "pcs", name: "Pieces / Buah", desc: "Fitting, saklar, kran air, amplas" },
  { id: "rit", name: "Rit (Truk)", desc: "Material curah angkutan truk" },
  { id: "ikat", name: "Ikat", desc: "Besi beton per 10 atau 20 btg" },
  { id: "palet", name: "Palet", desc: "Semen per 40 sak" },
];

/**
 * Menghitung konversi jumlah dari satu satuan ke satuan dasar produk
 */
export function convertToBaseQty(qty: number, unitName: string, units: ProductUnit[]): number {
  const match = units.find(u => u.unit.toLowerCase() === unitName.toLowerCase());
  if (!match) return qty;
  return qty * match.factor;
}

/**
 * Menghitung harga jual berdasarkan satuan yang dipilih
 */
export function calculateUnitPrice(
  basePrice: number,
  targetUnit: string,
  baseUnit: string,
  units: ProductUnit[]
): number {
  if (targetUnit.toLowerCase() === baseUnit.toLowerCase()) {
    return basePrice;
  }
  const match = units.find(u => u.unit.toLowerCase() === targetUnit.toLowerCase());
  if (!match) return basePrice;
  return Math.round(basePrice * match.factor);
}

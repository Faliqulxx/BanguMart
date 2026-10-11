"use client";

import React, { useState } from "react";
import { Search, Plus, Filter, Check } from "lucide-react";
import { Product, CATEGORIES } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import { getEffectivePrice } from "@/lib/pricing";
import { calculateUnitPrice } from "@/lib/units";
import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductCatalogProps {
  onScanClick: () => void;
}

export function ProductCatalog({ onScanClick }: ProductCatalogProps) {
  const { products, addToCart, selectedCustomer } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  
  // State per-product selected unit in card
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});

  const customerTier = selectedCustomer?.priceTier || "eceran";

  // Filter products
  const filtered = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "Semua Kategori" || p.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.code.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.barcode.includes(term);
    return matchesCategory && matchesSearch;
  });

  const handleUnitChange = (productId: string, unit: string) => {
    setSelectedUnits((prev) => ({ ...prev, [productId]: unit }));
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl border border-[#ECECE8] p-3 sm:p-4 shadow-sm overflow-hidden">
      {/* Search & Actions Bar */}
      <div className="flex items-center gap-2 mb-2.5 shrink-0">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama barang, kode SKU, atau barcode..."
            className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl bg-[#F7F7F5] border border-[#ECECE8] focus:outline-none focus:border-[#F5A800] focus:ring-1 focus:ring-[#F5A800]"
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onScanClick}
          className="shrink-0 font-bold"
        >
          Scan
        </Button>
      </div>

      {/* Category Chips Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2.5 text-xs scrollbar-none shrink-0">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all shrink-0 ${
                isSelected
                  ? "bg-[#1F2933] text-white shadow-xs"
                  : "bg-[#F7F7F5] text-[#6B7280] hover:bg-[#ECECE8] hover:text-[#1F2933]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Tier Price Indicator */}
      {selectedCustomer && (
        <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-[#FFF7E0] border border-[#FDEBB8] flex items-center justify-between text-xs text-[#B45309] shrink-0">
          <span>
            Harga Tier Pelanggan: <strong className="uppercase">{customerTier}</strong> ({selectedCustomer.name})
          </span>
          <span className="text-[11px] font-bold">Otomatis Diterapkan</span>
        </div>
      )}

      {/* Product Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#6B7280]">
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-bold text-sm text-[#1F2933]">Barang tidak ditemukan</p>
            <p className="text-xs">Coba kata kunci lain atau pilih Semua Kategori</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3">
            {filtered.map((prod) => {
              const activeUnit = selectedUnits[prod.id] || prod.baseUnit;
              const basePrice = getEffectivePrice(prod.prices, customerTier, 1).unitPrice;
              const unitPrice = calculateUnitPrice(basePrice, activeUnit, prod.baseUnit, prod.units);
              const isLowStock = prod.stock <= prod.minStock;
              const isOutOfStock = prod.stock <= 0;

              return (
                <div
                  key={prod.id}
                  className="bg-white border border-[#ECECE8] hover:border-[#F5A800] rounded-xl p-3 flex flex-col justify-between transition-all hover:shadow-md group"
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className="text-2xl">{prod.imageIcon || "📦"}</span>
                      {isOutOfStock ? (
                        <Badge variant="danger" size="sm">Habis</Badge>
                      ) : isLowStock ? (
                        <Badge variant="warning" size="sm">Sisa {prod.stock}</Badge>
                      ) : (
                        <span className="text-[10px] text-[#6B7280] font-mono">{prod.code}</span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-[#1F2933] line-clamp-2 leading-snug group-hover:text-[#B45309]">
                      {prod.name}
                    </h4>
                    <p className="text-[10px] text-[#6B7280] mt-0.5">{prod.brand}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#ECECE8]">
                    {/* Unit Selector if product has multiple units (PRD 6.2a) */}
                    {prod.units.length > 1 && (
                      <div className="flex items-center gap-1 mb-2 overflow-x-auto pb-0.5">
                        {prod.units.map((u) => (
                          <button
                            key={u.unit}
                            onClick={() => handleUnitChange(prod.id, u.unit)}
                            className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors ${
                              activeUnit === u.unit
                                ? "bg-[#F5A800] text-[#1F2933]"
                                : "bg-[#F7F7F5] text-[#6B7280] hover:bg-[#ECECE8]"
                            }`}
                          >
                            {u.unit}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-end justify-between gap-1">
                      <div>
                        <span className="text-xs sm:text-sm font-extrabold text-[#1F2933]">
                          {formatRupiah(unitPrice)}
                        </span>
                        <span className="text-[10px] text-[#6B7280] ml-0.5 block">
                          per {activeUnit}
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        size="xs"
                        disabled={isOutOfStock}
                        onClick={() => addToCart(prod, activeUnit, 1)}
                        className="px-2.5 py-1 font-bold shrink-0 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

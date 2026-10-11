"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Plus, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";

export function LowStockList() {
  const { products } = useAppStore();
  const lowStock = products.filter((p) => p.stock <= p.minStock).slice(0, 8);

  return (
    <div className="bg-white rounded-xl p-5 border border-[#ECECE8] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#E5484D] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1F2933]">Produk Stok Menipis</h3>
            <p className="text-xs text-[#6B7280]">8 produk berada di bawah batas minimum</p>
          </div>
        </div>

        <Link
          href="/stok"
          className="text-xs font-bold text-[#B45309] hover:underline flex items-center gap-1"
        >
          Kelola Stok <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {lowStock.map((prod) => (
          <div
            key={prod.id}
            className="p-3 rounded-xl border border-[#ECECE8] bg-[#F7F7F5]/40 hover:bg-white hover:border-[#F5A800] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span className="text-xl">{prod.imageIcon || "📦"}</span>
                <Badge variant="danger" size="sm">
                  Segera restock
                </Badge>
              </div>
              <h4 className="text-xs font-bold text-[#1F2933] line-clamp-1">{prod.name}</h4>
              <p className="text-[11px] text-[#6B7280]">{prod.category}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-[#ECECE8] flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#E5484D]">
                  {prod.stock} {prod.baseUnit}
                </span>
                <span className="text-[10px] text-[#6B7280] ml-1">(min {prod.minStock})</span>
              </div>

              <Link href={`/supplier?tab=pembelian&item=${prod.id}`}>
                <Button variant="outline" size="xs" icon={<Plus className="w-3 h-3" />}>
                  PO
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

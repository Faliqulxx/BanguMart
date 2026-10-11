import React from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { ArrowRight } from "lucide-react";

interface TopProductItem {
  id: string;
  name: string;
  icon: string;
  unit: string;
  price: number;
  sold: number;
}

const topProductsList: TopProductItem[] = [
  { id: "1", name: "Semen Tiga Roda 50kg", icon: "🧱", unit: "sak", price: 68000, sold: 48 },
  { id: "2", name: "Besi Beton 10mm (12m)", icon: "🏗️", unit: "batang", price: 92000, sold: 36 },
  { id: "3", name: "Cat Tembok Avian 5kg", icon: "🎨", unit: "kaleng", price: 125000, sold: 28 },
  { id: "4", name: 'Pipa PVC 3/4" AW (4m)', icon: "🚰", unit: "batang", price: 18000, sold: 21 },
  { id: "5", name: "Keramik Lantai 40x40", icon: "⬜", unit: "dus", price: 85000, sold: 18 },
];

export function TopProducts() {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#ECECE8] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1F2933]">Produk Terlaris</h3>
          <p className="text-xs text-[#6B7280]">5 produk paling laku minggu ini</p>
        </div>
        <Link
          href="/laporan"
          className="text-xs font-bold text-[#B45309] hover:underline flex items-center gap-1"
        >
          Lihat analitik <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-[#ECECE8]">
        {topProductsList.map((item, index) => (
          <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-5 text-xs font-bold text-[#6B7280] text-center">
                #{index + 1}
              </span>
              <div className="w-9 h-9 rounded-lg bg-[#F7F7F5] flex items-center justify-center text-lg shrink-0 border border-[#ECECE8]">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1F2933] truncate">{item.name}</p>
                <p className="text-[11px] text-[#6B7280]">
                  {formatRupiah(item.price)} / {item.unit}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-extrabold text-[#1F2933]">
                {item.sold} {item.unit}
              </span>
              <p className="text-[10px] text-[#16A34A] font-semibold">terjual</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

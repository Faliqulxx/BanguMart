"use client";

import React, { useState } from "react";
import { salesHistory7Days, salesHistory30Days } from "@/data/stats";
import { formatRupiah } from "@/lib/format";

export function SalesChart() {
  const [period, setPeriod] = useState<"7days" | "30days">("7days");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = period === "7days" ? salesHistory7Days : salesHistory30Days;
  const maxSales = Math.max(...data.map((d) => d.penjualan));
  const maxTrx = Math.max(...data.map((d) => d.transaksi));

  return (
    <div className="bg-white rounded-xl p-5 border border-[#ECECE8] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-[#1F2933]">Grafik Tren Penjualan</h3>
          <p className="text-xs text-[#6B7280]">Perbandingan omzet dan volume transaksi harian</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#F5A800]" />
              <span className="text-[#1F2933]">Penjualan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#A9AEB5]" />
              <span className="text-[#6B7280]">Transaksi</span>
            </div>
          </div>

          {/* Period Select */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "7days" | "30days")}
            className="text-xs font-semibold px-2.5 py-1.5 bg-[#F7F7F5] border border-[#ECECE8] rounded-lg text-[#1F2933] focus:outline-none focus:border-[#F5A800]"
          >
            <option value="7days">7 Hari Terakhir</option>
            <option value="30days">30 Hari Terakhir</option>
          </select>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="relative h-64 w-full flex items-end gap-2 sm:gap-4 pt-8 pb-6 border-b border-[#ECECE8]">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 pb-6">
          <div className="border-b border-dashed border-[#D1D5DB] w-full" />
          <div className="border-b border-dashed border-[#D1D5DB] w-full" />
          <div className="border-b border-dashed border-[#D1D5DB] w-full" />
        </div>

        {/* Bars Container */}
        {data.map((item, idx) => {
          const salesHeightPct = Math.round((item.penjualan / (maxSales * 1.15)) * 100);
          const trxHeightPct = Math.round((item.transaksi / (maxTrx * 1.25)) * 100);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.tanggal}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-[#1F2933] text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
                  <p className="font-bold text-[#F5A800]">{formatRupiah(item.penjualan)}</p>
                  <p className="text-white/80">{item.transaksi} Transaksi</p>
                </div>
              )}

              {/* Dual Bars Side-by-Side */}
              <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                {/* Sales Bar (Amber) */}
                <div
                  style={{ height: `${salesHeightPct}%` }}
                  className={`w-3.5 sm:w-6 bg-[#F5A800] rounded-t-md transition-all duration-300 ${
                    isHovered ? "bg-[#DB9500] scale-x-105" : "hover:bg-[#DB9500]"
                  }`}
                />

                {/* Trx Bar (Gray) */}
                <div
                  style={{ height: `${trxHeightPct}%` }}
                  className={`w-2.5 sm:w-4 bg-[#A9AEB5] rounded-t-sm transition-all duration-300 ${
                    isHovered ? "bg-[#8E939B]" : ""
                  }`}
                />
              </div>

              {/* X Axis Label */}
              <span className="absolute -bottom-6 text-[11px] font-semibold text-[#6B7280]">
                {item.tanggal}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 text-[11px] text-[#6B7280]">
        <span>Sumbu Y: Skala s.d {formatRupiah(maxSales * 1.15)}</span>
        <span className="font-medium">Rata-rata: Rp 3.750.000 / hari</span>
      </div>
    </div>
  );
}

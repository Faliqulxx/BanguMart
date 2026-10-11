"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatAngka } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  PieChart,
  Truck,
  Users,
  Wallet,
  Boxes,
} from "lucide-react";

export default function LaporanPage() {
  const { transactions, products, receivables, suppliers, showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    "penjualan" | "labarugi" | "piutanghutang" | "stok" | "pengiriman" | "kasir"
  >("penjualan");

  const [period, setPeriod] = useState<"hari_ini" | "7_hari" | "30_hari">("7_hari");

  // Penjualan aggregation
  const totalOmzet = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTrxCount = transactions.length;
  const avgTrxValue = totalTrxCount > 0 ? Math.round(totalOmzet / totalTrxCount) : 0;

  // Laba rugi aggregation (dummy estimates)
  const estimasiHPP = Math.round(totalOmzet * 0.82); // HPP ~82%
  const labaKotor = totalOmzet - estimasiHPP;
  const bebanOperasional = 3500000; // Listrik, gaji, armada
  const labaBersih = Math.max(0, labaKotor - bebanOperasional);

  // Kategori sales distribution
  const categoryBreakdown = [
    { name: "Semen & Perekat", pct: 32, total: Math.round(totalOmzet * 0.32), color: "#F5A800" },
    { name: "Besi & Baja", pct: 28, total: Math.round(totalOmzet * 0.28), color: "#1F2933" },
    { name: "Cat & Pelapis", pct: 14, total: Math.round(totalOmzet * 0.14), color: "#2563EB" },
    { name: "Keramik & Lantai", pct: 12, total: Math.round(totalOmzet * 0.12), color: "#16A34A" },
    { name: "Pipa & Sanitasi", pct: 8, total: Math.round(totalOmzet * 0.08), color: "#9333EA" },
    { name: "Lainnya", pct: 6, total: Math.round(totalOmzet * 0.06), color: "#6B7280" },
  ];

  // Kasir performance
  const rinaTrx = transactions.filter((t) => t.cashierName === "Rina Wulandari");
  const budiTrx = transactions.filter((t) => t.cashierName === "Budi Santoso");

  const handleExport = () => {
    showToast("Ekspor Laporan", "Fitur ekspor PDF & Excel segera hadir", "info");
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
          <div>
            <h1 className="text-xl font-black text-[#1F2933]">Laporan & Analitik Bisnis Toko</h1>
            <p className="text-xs text-[#6B7280]">
              Laporan performa penjualan, estimasi laba rugi, kasir, dan perputaran material
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="text-xs font-bold px-3 py-2 bg-[#F7F7F5] border border-[#ECECE8] rounded-lg text-[#1F2933] focus:outline-none"
            >
              <option value="hari_ini">Hari Ini (18 Okt 2026)</option>
              <option value="7_hari">7 Hari Terakhir</option>
              <option value="30_hari">Bulan Ini (30 Hari)</option>
            </select>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Ekspor
            </Button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-white p-1.5 rounded-xl border border-[#ECECE8] shadow-xs text-xs font-bold">
          {[
            { id: "penjualan", label: "Penjualan" },
            { id: "labarugi", label: "Laba Rugi" },
            { id: "piutanghutang", label: "Piutang & Hutang" },
            { id: "stok", label: "Analisis Stok" },
            { id: "kasir", label: "Kinerja Kasir" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-[#F5A800] text-[#1F2933] shadow-xs"
                  : "text-[#6B7280] hover:text-[#1F2933]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Penjualan */}
        {activeTab === "penjualan" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
                <span className="text-xs text-[#6B7280]">Total Omzet Penjualan</span>
                <p className="text-2xl font-black text-[#1F2933] mt-1">{formatRupiah(totalOmzet)}</p>
                <span className="text-[10px] text-[#16A34A] font-semibold">↑ 12% dari periode lalu</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
                <span className="text-xs text-[#6B7280]">Total Transaksi Kasir</span>
                <p className="text-2xl font-black text-[#1F2933] mt-1">{totalTrxCount} Transaksi</p>
                <span className="text-[10px] text-[#16A34A] font-semibold">↑ 8% volume</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
                <span className="text-xs text-[#6B7280]">Rata-Rata Nilai Struk (AOV)</span>
                <p className="text-2xl font-black text-[#1F2933] mt-1">{formatRupiah(avgTrxValue)}</p>
                <span className="text-[10px] text-[#6B7280]">per transaksi</span>
              </div>
            </div>

            {/* Category Breakdown (Donut Simulation) */}
            <div className="bg-white p-5 rounded-xl border border-[#ECECE8] shadow-xs">
              <h3 className="font-bold text-sm text-[#1F2933] mb-3">
                Distribusi Penjualan per Kategori Material
              </h3>

              {/* Stacked Progress Bar */}
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#ECECE8] mb-4">
                {categoryBreakdown.map((cat) => (
                  <div
                    key={cat.name}
                    style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                    title={`${cat.name}: ${cat.pct}%`}
                    className="h-full hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.name} className="p-2.5 rounded-lg bg-[#F7F7F5] border border-[#ECECE8]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-[11px] font-bold text-[#1F2933] truncate">{cat.name}</span>
                    </div>
                    <p className="text-sm font-black text-[#1F2933]">{cat.pct}%</p>
                    <p className="text-[10px] text-[#6B7280]">{formatRupiah(cat.total)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Laba Rugi (PRD 6.7) */}
        {activeTab === "labarugi" && (
          <div className="bg-white p-5 rounded-xl border border-[#ECECE8] shadow-xs max-w-2xl mx-auto space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-[#1F2933]">Estimasi Laporan Laba Rugi</h3>
              <p className="text-xs text-[#6B7280]">Periode berjalan toko bangunan</p>
            </div>

            <div className="divide-y divide-[#ECECE8] text-xs">
              <div className="py-2.5 flex justify-between font-bold text-sm">
                <span>1. Pendapatan Penjualan Bersih (Omzet):</span>
                <span className="text-[#1F2933]">{formatRupiah(totalOmzet)}</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#E5484D]">
                <span>2. Harga Pokok Penjualan (HPP):</span>
                <span>-{formatRupiah(estimasiHPP)}</span>
              </div>
              <div className="py-2.5 flex justify-between font-extrabold bg-[#FFF7E0] p-2 rounded-lg">
                <span>LABA KOTOR (Margin ~18%):</span>
                <span className="text-[#B45309]">{formatRupiah(labaKotor)}</span>
              </div>
              <div className="py-2.5 flex justify-between text-[#6B7280]">
                <span>3. Beban Operasional (Gaji, Listrik, Bensin Armada):</span>
                <span>-{formatRupiah(bebanOperasional)}</span>
              </div>
              <div className="py-3 flex justify-between font-black text-base bg-[#DCFCE7] p-3 rounded-xl text-[#15803D]">
                <span>ESTIMASI LABA BERSIH:</span>
                <span>{formatRupiah(labaBersih)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Piutang & Hutang */}
        {activeTab === "piutanghutang" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#ECECE8] shadow-xs">
              <span className="text-xs text-[#6B7280]">Total Piutang Kontraktor / Toko</span>
              <p className="text-2xl font-black text-[#1F2933] mt-1">
                {formatRupiah(receivables.reduce((s, r) => s + r.remainingAmount, 0))}
              </p>
              <p className="text-xs text-[#B45309] mt-2">
                {receivables.filter((r) => r.status === "Segera Jatuh Tempo").length} faktur mendekati jatuh tempo
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#ECECE8] shadow-xs">
              <span className="text-xs text-[#6B7280]">Total Hutang Dagang ke Supplier</span>
              <p className="text-2xl font-black text-[#E5484D] mt-1">
                {formatRupiah(suppliers.reduce((s, sup) => s + sup.totalDebt, 0))}
              </p>
              <p className="text-xs text-[#6B7280] mt-2">
                Tersebar di {suppliers.filter((s) => s.totalDebt > 0).length} supplier distributor resmi
              </p>
            </div>
          </div>
        )}

        {/* Tab: Analisis Stok */}
        {activeTab === "stok" && (
          <div className="bg-white p-5 rounded-xl border border-[#ECECE8] shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#1F2933]">Analisis Perputaran Persediaan</h3>
              <p className="text-xs text-[#6B7280]">Produk fast-moving vs slow-moving</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0]">
                <h4 className="font-extrabold text-[#15803D] mb-2">🔥 Fast Moving (Paling Sering Habis)</h4>
                <ul className="space-y-1 text-[#1F2933]">
                  <li>• Semen Tiga Roda 50kg (Perputaran 48 sak/minggu)</li>
                  <li>• Besi Beton 10mm SNI (Perputaran 36 batang/minggu)</li>
                  <li>• Cat Tembok Avian 5kg (Perputaran 28 kaleng/minggu)</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#ECECE8]">
                <h4 className="font-extrabold text-[#6B7280] mb-2">⏳ Slow Moving (Perputaran Lambat)</h4>
                <ul className="space-y-1 text-[#1F2933]">
                  <li>• Kawat Harmonika Galvanis 1.5x25m (Stok bertahan &gt; 30 hari)</li>
                  <li>• Tandon Air Penguin 650L (Barang bernilai tinggi)</li>
                  <li>• Cangkul Gagang Kayu</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Kinerja Kasir */}
        {activeTab === "kasir" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#ECECE8] shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#1F2933] text-[#F5A800] font-black text-sm flex items-center justify-center">
                  RW
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1F2933]">Rina Wulandari</h4>
                  <p className="text-xs text-[#6B7280]">Kasir Utama</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t border-[#ECECE8]">
                <div className="flex justify-between">
                  <span>Jumlah Transaksi:</span>
                  <span className="font-bold">{rinaTrx.length || 18} Transaksi</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Penerimaan:</span>
                  <span className="text-[#16A34A]">{formatRupiah(totalOmzet * 0.65)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#ECECE8] shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF7E0] text-[#B45309] font-black text-sm flex items-center justify-center">
                  BS
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1F2933]">Budi Santoso</h4>
                  <p className="text-xs text-[#6B7280]">Owner / Kasir Pengganti</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t border-[#ECECE8]">
                <div className="flex justify-between">
                  <span>Jumlah Transaksi:</span>
                  <span className="font-bold">{budiTrx.length || 6} Transaksi</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Penerimaan:</span>
                  <span className="text-[#16A34A]">{formatRupiah(totalOmzet * 0.35)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatAngka, formatTanggal } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Boxes,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  Search,
  Plus,
} from "lucide-react";

export default function StokPage() {
  const { products, applyStockAdjustment, showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<"ringkasan" | "mutasi" | "opname">("ringkasan");
  const [searchTerm, setSearchTerm] = useState("");

  // Opname state: map of productId -> physicalCount
  const [opnameCounts, setOpnameCounts] = useState<Record<string, number>>({});
  const [opnameReason, setOpnameReason] = useState("Stok opname bulanan rutin");

  // Summary calculations
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock <= 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.stock * p.purchasePrice, 0);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simulated mutasi logs
  const mutasiLogs = [
    { id: "m-1", date: "2026-10-18 16:20", type: "Keluar", prod: "Kabel Listrik NYM 2x1,5mm", qty: 2, unit: "roll", ref: "TRX-0018", user: "Rina W." },
    { id: "m-2", date: "2026-10-18 14:45", type: "Keluar", prod: "Semen Tiga Roda 50kg", qty: 15, unit: "sak", ref: "TRX-0017", user: "Budi S." },
    { id: "m-3", date: "2026-10-18 11:30", type: "Masuk", prod: "Semen Tiga Roda 50kg", qty: 100, unit: "sak", ref: "PO-202610-001", user: "Hendra (Gudang)" },
    { id: "m-4", date: "2026-10-17 11:15", type: "Keluar", prod: "Cat Tembok Avian 5kg", qty: 4, unit: "kaleng", ref: "TRX-0016", user: "Rina W." },
    { id: "m-5", date: "2026-10-17 09:30", type: "Keluar", prod: "Besi Beton 10mm (12m)", qty: 20, unit: "batang", ref: "TRX-0015", user: "Budi S." },
    { id: "m-6", date: "2026-10-16 10:00", type: "Penyesuaian", prod: "Paku Kayu 5cm", qty: -2, unit: "kg", ref: "Opname Fisik", user: "Hendra" },
  ];

  const handleApplyOpnameItem = (prodId: string, currentStock: number) => {
    const physical = opnameCounts[prodId];
    if (physical === undefined || isNaN(physical)) {
      showToast("Isi Hasil Fisik", "Masukkan angka hitung fisik terlebih dahulu", "error");
      return;
    }
    applyStockAdjustment(prodId, physical, opnameReason);
  };

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
          <div>
            <h1 className="text-xl font-black text-[#1F2933]">Manajemen & Mutasi Stok Gudang</h1>
            <p className="text-xs text-[#6B7280]">
              Monitoring persediaan, kartu stok mutasi, dan stok opname berkala
            </p>
          </div>

          <div className="flex bg-[#F7F7F5] p-1 rounded-lg border border-[#ECECE8] text-xs font-bold">
            <button
              onClick={() => setActiveTab("ringkasan")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "ringkasan" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              Ringkasan Stok
            </button>
            <button
              onClick={() => setActiveTab("mutasi")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "mutasi" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              Mutasi Stok
            </button>
            <button
              onClick={() => setActiveTab("opname")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "opname" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              Stok Opname
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
            <span className="text-xs text-[#6B7280]">Total Jenis Produk</span>
            <p className="text-xl sm:text-2xl font-black text-[#1F2933] mt-1">{totalProducts}</p>
            <span className="text-[10px] text-[#16A34A] font-semibold">Semua kategori</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
            <span className="text-xs text-[#6B7280]">Stok Menipis</span>
            <p className="text-xl sm:text-2xl font-black text-[#F59E0B] mt-1">{lowStockProducts.length}</p>
            <span className="text-[10px] text-[#B45309] font-semibold">Perlu restock</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
            <span className="text-xs text-[#6B7280]">Stok Habis (Kosong)</span>
            <p className="text-xl sm:text-2xl font-black text-[#E5484D] mt-1">{outOfStockProducts.length}</p>
            <span className="text-[10px] text-[#E5484D] font-semibold">Stok nol</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
            <span className="text-xs text-[#6B7280]">Nilai Persediaan</span>
            <p className="text-lg sm:text-xl font-black text-[#1F2933] mt-1 truncate">
              {formatRupiah(totalInventoryValue)}
            </p>
            <span className="text-[10px] text-[#6B7280]">Harga modal beli</span>
          </div>
        </div>

        {/* Tab 1: Ringkasan Stok & Perlu Restock */}
        {activeTab === "ringkasan" && (
          <div className="space-y-4">
            {/* Search Filter */}
            <div className="bg-white p-3.5 rounded-xl border border-[#ECECE8] flex items-center justify-between shadow-xs">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari barang atau lokasi rak..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-[#F7F7F5] border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
                />
              </div>

              <Link href="/supplier?tab=pembelian">
                <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  Buat PO Pembelian
                </Button>
              </Link>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl border border-[#ECECE8] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F5] text-[#6B7280] font-bold text-[11px] uppercase border-b border-[#ECECE8]">
                    <tr>
                      <th className="px-4 py-3">Nama Produk</th>
                      <th className="px-4 py-3">Lokasi Gudang</th>
                      <th className="px-4 py-3 text-right">Stok Fisik</th>
                      <th className="px-4 py-3 text-right">Min. Stok</th>
                      <th className="px-4 py-3 text-right">Nilai Barang</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECECE8]">
                    {filtered.map((prod) => {
                      const isLow = prod.stock <= prod.minStock && prod.stock > 0;
                      const isOut = prod.stock <= 0;

                      return (
                        <tr key={prod.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-extrabold text-[#1F2933]">{prod.name}</p>
                            <p className="text-[10px] text-[#6B7280]">
                              {prod.code} • {prod.category}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-[#6B7280]">{prod.location}</td>
                          <td className="px-4 py-3 text-right font-black text-[#1F2933]">
                            {prod.stock} {prod.baseUnit}
                          </td>
                          <td className="px-4 py-3 text-right text-[#6B7280]">
                            {prod.minStock} {prod.baseUnit}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-[#1F2933]">
                            {formatRupiah(prod.stock * prod.purchasePrice)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge
                              variant={isOut ? "danger" : isLow ? "warning" : "success"}
                              size="sm"
                            >
                              {isOut ? "Habis" : isLow ? "Menipis" : "Aman"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {(isLow || isOut) && (
                              <Link href={`/supplier?tab=pembelian&item=${prod.id}`}>
                                <Button variant="outline" size="xs">
                                  + Buat PO
                                </Button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Mutasi Stok Log */}
        {activeTab === "mutasi" && (
          <div className="bg-white rounded-xl border border-[#ECECE8] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#ECECE8]">
              <h3 className="font-bold text-sm text-[#1F2933]">Riwayat Mutasi Keluar Masuk Barang</h3>
              <p className="text-xs text-[#6B7280]">
                Semua pergerakan stok dari transaksi kasir, penerimaan PO, dan penyesuaian opname
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] text-[#6B7280] font-bold text-[11px] uppercase border-b border-[#ECECE8]">
                  <tr>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Jenis</th>
                    <th className="px-4 py-3">Barang</th>
                    <th className="px-4 py-3 text-right">Jumlah</th>
                    <th className="px-4 py-3">Referensi</th>
                    <th className="px-4 py-3">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECE8]">
                  {mutasiLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F7F7F5]/50">
                      <td className="px-4 py-3 text-[#6B7280]">{log.date}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            log.type === "Masuk"
                              ? "success"
                              : log.type === "Keluar"
                              ? "danger"
                              : "neutral"
                          }
                          size="sm"
                        >
                          {log.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#1F2933]">{log.prod}</td>
                      <td className="px-4 py-3 text-right font-black">
                        {log.qty > 0 ? `+${log.qty}` : log.qty} {log.unit}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#6B7280]">{log.ref}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{log.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Stok Opname Form (PRD 6.4) */}
        {activeTab === "opname" && (
          <div className="bg-white p-5 rounded-xl border border-[#ECECE8] space-y-4 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-[#1F2933]">Form Hitung Stok Fisik (Stok Opname)</h3>
              <p className="text-xs text-[#6B7280]">
                Masukkan hasil penghitungan fisik gudang untuk melihat selisih dan melakukan penyesuaian
              </p>
            </div>

            <div className="border border-[#ECECE8] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] border-b border-[#ECECE8] text-[#6B7280] font-bold text-[11px] uppercase">
                  <tr>
                    <th className="px-4 py-3">Barang</th>
                    <th className="px-4 py-3">Satuan</th>
                    <th className="px-4 py-3 text-right">Stok Sistem</th>
                    <th className="px-4 py-3 text-center">Hitung Fisik</th>
                    <th className="px-4 py-3 text-right">Selisih</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECE8]">
                  {products.slice(0, 10).map((p) => {
                    const physical = opnameCounts[p.id] ?? p.stock;
                    const diff = physical - p.stock;

                    return (
                      <tr key={p.id} className="hover:bg-[#F7F7F5]/50">
                        <td className="px-4 py-3 font-bold text-[#1F2933]">{p.name}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{p.baseUnit}</td>
                        <td className="px-4 py-3 text-right font-black">{p.stock}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            value={physical}
                            onChange={(e) =>
                              setOpnameCounts((prev) => ({
                                ...prev,
                                [p.id]: parseFloat(e.target.value) || 0,
                              }))
                            }
                            className="w-20 text-center font-bold px-2 py-1 rounded border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-black">
                          {diff === 0 ? (
                            <span className="text-[#6B7280]">0</span>
                          ) : diff > 0 ? (
                            <span className="text-[#16A34A]">+{diff} (Lebih)</span>
                          ) : (
                            <span className="text-[#E5484D]">{diff} (Kurang)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => handleApplyOpnameItem(p.id, p.stock)}
                          >
                            Terapkan
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

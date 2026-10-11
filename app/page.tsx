"use client";

import React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScanBanner } from "@/components/layout/ScanBanner";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { LowStockList } from "@/components/dashboard/LowStockList";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import {
  Banknote,
  Receipt,
  PackageCheck,
  AlertOctagon,
  Clock,
  Truck,
  FileText,
  Boxes,
  Users,
  BarChart3,
  Settings,
  ShoppingCart,
  Package,
} from "lucide-react";

export default function DashboardPage() {
  const { stats, currentRole } = useAppStore();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-28px font-black text-[#1F2933] tracking-tight">
              Halo, Budi Santoso 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Selamat datang kembali di BanguMart POS Toko Bangunan.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6B7280]">Peran:</span>
            <span className="font-bold text-[#1F2933] bg-white px-2.5 py-1 rounded-lg border border-[#ECECE8]">
              {currentRole}
            </span>
          </div>
        </div>

        {/* Mobile Scan Barcode Banner (PRD 4.3 & 6.1) */}
        <ScanBanner />

        {/* Mobile Grid Menu 3x2 (PRD 6.1: Transaksi, Produk, Stok, Pelanggan, Laporan, Pengaturan) */}
        <div className="sm:hidden grid grid-cols-3 gap-2 my-2">
          <Link
            href="/transaksi"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#ECECE8] text-center shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF7E0] text-[#B45309] flex items-center justify-center mb-1">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#1F2933]">Transaksi</span>
          </Link>

          <Link
            href="/produk"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#ECECE8] text-center shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF7E0] text-[#B45309] flex items-center justify-center mb-1">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#1F2933]">Produk</span>
          </Link>

          <Link
            href="/stok"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#ECECE8] text-center shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF7E0] text-[#B45309] flex items-center justify-center mb-1">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#1F2933]">Stok</span>
          </Link>

          <Link
            href="/pelanggan"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#ECECE8] text-center shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF7E0] text-[#B45309] flex items-center justify-center mb-1">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#1F2933]">Pelanggan</span>
          </Link>

          <Link
            href="/laporan"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#ECECE8] text-center shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF7E0] text-[#B45309] flex items-center justify-center mb-1">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#1F2933]">Laporan</span>
          </Link>

          <Link
            href="/pengaturan"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#ECECE8] text-center shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF7E0] text-[#B45309] flex items-center justify-center mb-1">
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#1F2933]">Pengaturan</span>
          </Link>
        </div>

        {/* 4 Kartu Statistik Utama (PRD 6.1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Penjualan Hari Ini"
            value={formatRupiah(stats.penjualanHariIni)}
            changeText={`↑ ${stats.perubahan.penjualan}%`}
            isPositive
            subtitle="dari kemarin"
            icon={<Banknote className="w-5 h-5" />}
          />
          <StatCard
            title="Jumlah Transaksi"
            value={`${stats.jumlahTransaksi}`}
            changeText={`↑ ${stats.perubahan.transaksi}%`}
            isPositive
            subtitle="dari kemarin"
            icon={<Receipt className="w-5 h-5" />}
          />
          <StatCard
            title="Produk Terjual"
            value={`${stats.produkTerjual} item`}
            changeText={`↑ ${stats.perubahan.produk}%`}
            isPositive
            subtitle="dari kemarin"
            icon={<PackageCheck className="w-5 h-5" />}
          />
          <StatCard
            title="Stok Menipis"
            value={`${stats.stokMenipis} produk`}
            changeText="Perlu restock"
            isWarning
            subtitle="di bawah batas aman"
            icon={<AlertOctagon className="w-5 h-5 text-[#E5484D]" />}
          />
        </div>

        {/* Kartu Tambahan Khas Toko Bangunan (PRD 6.1) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3.5 border border-[#ECECE8] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#6B7280] truncate">Piutang Belum Lunas</p>
              <p className="text-xs sm:text-sm font-extrabold text-[#1F2933] truncate">
                {formatRupiah(stats.piutang.total)}
              </p>
              <p className="text-[10px] text-[#6B7280]">{stats.piutang.faktur} faktur aktif</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-[#ECECE8] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#6B7280] truncate">Jatuh Tempo Minggu Ini</p>
              <p className="text-xs sm:text-sm font-extrabold text-[#1F2933]">
                {stats.piutang.jatuhTempoMingguIni} Faktur
              </p>
              <p className="text-[10px] text-[#B45309] font-medium">Segera follow-up</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-[#ECECE8] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#6B7280] truncate">Pengiriman Hari Ini</p>
              <p className="text-xs sm:text-sm font-extrabold text-[#1F2933]">
                {stats.pengirimanHariIni.total} Jadwal
              </p>
              <p className="text-[10px] text-[#1D4ED8] font-medium">
                {stats.pengirimanHariIni.dalamPerjalanan} di jalan
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-[#ECECE8] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFF7E0] text-[#B45309] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#6B7280] truncate">Pesanan Menunggu</p>
              <p className="text-xs sm:text-sm font-extrabold text-[#1F2933]">
                {stats.pesananMenunggu} Pesanan (SO)
              </p>
              <p className="text-[10px] text-[#6B7280]">Penyiapan gudang</p>
            </div>
          </div>
        </div>

        {/* Charts & Top Products Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div className="lg:col-span-1">
            <TopProducts />
          </div>
        </div>

        {/* Low Stock Highlight */}
        <LowStockList />

        {/* Recent Transactions Table */}
        <RecentTransactions />
      </div>
    </AppLayout>
  );
}

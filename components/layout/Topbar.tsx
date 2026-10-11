"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Package,
  AlertTriangle,
  Truck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import { UserRole } from "@/data/users";

export function Topbar() {
  const router = useRouter();
  const { currentRole, setCurrentRole, products, customers, transactions, receivables, deliveries } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered search results
  const query = searchQuery.trim().toLowerCase();
  const matchedProducts = query
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.code.toLowerCase().includes(query) ||
            p.barcode.includes(query)
        )
        .slice(0, 4)
    : [];

  const matchedCustomers = query
    ? customers
        .filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            (c.company && c.company.toLowerCase().includes(query)) ||
            c.phone.includes(query)
        )
        .slice(0, 3)
    : [];

  const matchedInvoices = query
    ? receivables
        .filter(
          (r) =>
            r.invoiceNo.toLowerCase().includes(query) ||
            r.trxNo.toLowerCase().includes(query)
        )
        .slice(0, 3)
    : [];

  // Notifications calculation
  const lowStockItems = products.filter((p) => p.stock <= p.minStock);
  const dueReceivables = receivables.filter(
    (r) => r.status === "Segera Jatuh Tempo" || r.status === "Terlambat"
  );
  const todayDeliveries = deliveries.filter(
    (d) => d.date === "2026-10-18" || d.status === "Dalam Perjalanan"
  );
  const totalNotifCount = lowStockItems.length + dueReceivables.length + todayDeliveries.length;

  const roles: UserRole[] = ["Owner", "Admin", "Kasir", "Staf Gudang", "Sopir"];

  return (
    <header className="h-14 sm:h-16 shrink-0 bg-white border-b border-[#ECECE8] sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-3 select-none">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center">
        <Link href="/">
          <Logo size="sm" showSubtitle={false} />
        </Link>
      </div>

      {/* Global Search Bar (PRD 4.3: radius penuh, placeholder cari produk, kode...) */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Cari produk, kode barang, atau pelanggan..."
            className="w-full bg-[#F7F7F5] border border-[#ECECE8] text-sm text-[#1F2933] pl-10 pr-4 py-2 rounded-full focus:outline-none focus:border-[#F5A800] focus:ring-2 focus:ring-[#F5A800]/20 transition-all placeholder:text-[#6B7280]"
          />
        </div>

        {/* Global Search Dropdown */}
        {isSearchOpen && query && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-[#ECECE8] p-2 overflow-hidden z-40 max-h-96 overflow-y-auto">
            {matchedProducts.length === 0 && matchedCustomers.length === 0 && matchedInvoices.length === 0 ? (
              <p className="text-xs text-[#6B7280] text-center py-4">
                Tidak ada hasil ditemukan untuk &ldquo;{searchQuery}&rdquo;
              </p>
            ) : (
              <div className="space-y-3">
                {matchedProducts.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase px-2 mb-1">
                      Produk
                    </p>
                    {matchedProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(`/produk?search=${encodeURIComponent(p.code)}`);
                        }}
                        className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-[#F7F7F5] transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{p.imageIcon || "📦"}</span>
                          <div>
                            <p className="font-semibold text-[#1F2933]">{p.name}</p>
                            <p className="text-[11px] text-[#6B7280]">
                              {p.code} • Stok: {p.stock} {p.baseUnit}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#1F2933]">
                          {formatRupiah(p.prices.eceran)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedCustomers.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase px-2 mb-1">
                      Pelanggan
                    </p>
                    {matchedCustomers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(`/pelanggan?id=${c.id}`);
                        }}
                        className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-[#F7F7F5] transition-colors text-xs"
                      >
                        <div>
                          <p className="font-semibold text-[#1F2933]">{c.name}</p>
                          <p className="text-[11px] text-[#6B7280]">
                            {c.type} • {c.phone}
                          </p>
                        </div>
                        <span className="text-[10px] bg-[#FFF7E0] text-[#B45309] font-bold px-2 py-0.5 rounded">
                          Tier: {c.priceTier}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions: Notifications & User profile */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Role Quick Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF7E0] border border-[#FDEBB8] text-xs font-semibold text-[#B45309]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Peran: {currentRole}</span>
        </div>

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-[#1F2933] hover:bg-[#F7F7F5] border border-transparent hover:border-[#ECECE8] transition-colors"
            title="Pusat Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {totalNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#E5484D] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {totalNotifCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown (PRD 6.9: stok menipis, piutang jatuh tempo, pengiriman) */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#ECECE8] p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#ECECE8]">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#1F2933]">Notifikasi</h4>
                  <span className="text-[11px] font-bold px-2 py-0.2 bg-[#FEE2E2] text-[#E5484D] rounded-full">
                    {totalNotifCount} baru
                  </span>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {/* Low Stock Notifications */}
                {lowStockItems.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#FFF7E0] border border-[#FDEBB8]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] mb-1">
                      <AlertTriangle className="w-4 h-4 text-[#E5484D]" />
                      <span>{lowStockItems.length} Produk Perlu Segera Restock</span>
                    </div>
                    <ul className="text-[11px] text-[#1F2933] space-y-1 pl-6 list-disc">
                      {lowStockItems.slice(0, 3).map((item) => (
                        <li key={item.id}>
                          {item.name}: sisa <span className="font-bold text-[#E5484D]">{item.stock} {item.baseUnit}</span> (min {item.minStock})
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/stok"
                      onClick={() => setIsNotifOpen(false)}
                      className="mt-2 text-[11px] font-bold text-[#B45309] hover:underline flex items-center gap-1"
                    >
                      Buka Ringkasan Stok <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Due Receivables */}
                {dueReceivables.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#FEE2E2] border border-[#FECACA]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#B91C1C] mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{dueReceivables.length} Piutang Jatuh Tempo / Terlambat</span>
                    </div>
                    <p className="text-[11px] text-[#7F1D1D]">
                      Faktur untuk {dueReceivables[0]?.customerName} ({formatRupiah(dueReceivables[0]?.remainingAmount)}) membutuhkan tindak lanjut pengingat.
                    </p>
                    <Link
                      href="/pelanggan/piutang"
                      onClick={() => setIsNotifOpen(false)}
                      className="mt-2 text-[11px] font-bold text-[#B91C1C] hover:underline flex items-center gap-1"
                    >
                      Buka Menu Piutang <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Deliveries Today */}
                {todayDeliveries.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#DBEAFE] border border-[#BFDBFE]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1D4ED8] mb-1">
                      <Truck className="w-4 h-4" />
                      <span>{todayDeliveries.length} Pengiriman Proyek Aktif Hari Ini</span>
                    </div>
                    <p className="text-[11px] text-[#1E3A8A]">
                      Armada Pickup L300 & Truk Engkel sedang mengantar ke lokasi proyek.
                    </p>
                    <Link
                      href="/transaksi?tab=pengiriman"
                      onClick={() => setIsNotifOpen(false)}
                      className="mt-2 text-[11px] font-bold text-[#1D4ED8] hover:underline flex items-center gap-1"
                    >
                      Buka Papan Pengiriman <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown & Role Switcher */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-[#F7F7F5] border border-transparent hover:border-[#ECECE8] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#1F2933] text-[#F5A800] font-extrabold text-xs flex items-center justify-center shrink-0">
              BS
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-[#1F2933] leading-tight">Budi S.</p>
              <p className="text-[10px] text-[#6B7280] leading-tight">{currentRole}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] hidden sm:block" />
          </button>

          {/* User Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#ECECE8] p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-[#ECECE8] mb-1.5">
                <p className="text-xs font-bold text-[#1F2933]">Budi Santoso</p>
                <p className="text-[11px] text-[#6B7280]">budi.owner@bangumart.id</p>
              </div>

              {/* Role Switcher (Simulasi PRD 3 & 6.8) */}
              <div className="px-3 py-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">
                  Ganti Peran (Simulasi)
                </p>
                <div className="space-y-1">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                        currentRole === role
                          ? "bg-[#FFF7E0] text-[#B45309] font-bold"
                          : "text-[#3F4650] hover:bg-[#F7F7F5]"
                      }`}
                    >
                      <span>{role}</span>
                      {currentRole === role && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#ECECE8] mt-2 pt-1.5">
                <Link
                  href="/pengaturan"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#3F4650] hover:bg-[#F7F7F5] rounded-lg transition-colors font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-[#6B7280]" />
                  <span>Pengaturan Toko</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#E5484D] hover:bg-[#FEE2E2] rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

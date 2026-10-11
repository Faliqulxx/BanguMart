"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Menu,
  Boxes,
  Users,
  Truck,
  BarChart3,
  Settings,
  Calculator,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export function BottomNav() {
  const pathname = usePathname();
  const { cart, currentRole } = useAppStore();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const mainNav = [
    {
      name: "Beranda",
      href: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Transaksi",
      href: "/transaksi",
      icon: <ShoppingCart className="w-5 h-5" />,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      name: "Produk",
      href: "/produk",
      icon: <Package className="w-5 h-5" />,
    },
    {
      name: "Kalkulator",
      href: "/kalkulator",
      icon: <Calculator className="w-5 h-5" />,
    },
  ];

  const moreNav = [
    { name: "Stok Barang", href: "/stok", icon: <Boxes className="w-5 h-5" />, desc: "Ringkasan stok & opname" },
    { name: "Pelanggan & Piutang", href: "/pelanggan", icon: <Users className="w-5 h-5" />, desc: "Data kontraktor & tagihan" },
    { name: "Supplier & PO", href: "/supplier", icon: <Truck className="w-5 h-5" />, desc: "Pembelian & hutang dagang" },
    { name: "Laporan & Analitik", href: "/laporan", icon: <BarChart3 className="w-5 h-5" />, desc: "Penjualan, kas, & laba rugi" },
    { name: "Pengaturan Sistem", href: "/pengaturan", icon: <Settings className="w-5 h-5" />, desc: "Profil toko, tarif & nota" },
  ];

  return (
    <>
      {/* Bottom Nav Bar (Mobile only, < 640px) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#ECECE8] z-40 px-2 flex items-center justify-around select-none shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {mainNav.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
                isActive
                  ? "text-[#B45309] font-bold"
                  : "text-[#6B7280] hover:text-[#1F2933]"
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-[#F5A800] text-[#1F2933] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}

        {/* Lainnya Button */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isMoreOpen ? "text-[#B45309] font-bold" : "text-[#6B7280] hover:text-[#1F2933]"
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Lainnya</span>
        </button>
      </nav>

      {/* Drawer for "Lainnya" */}
      {isMoreOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-[#1F2933]/50 backdrop-blur-xs"
            onClick={() => setIsMoreOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl border-t border-[#ECECE8] shadow-2xl p-5 z-10 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECECE8] mb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#1F2933]">Menu Lainnya</h3>
                <p className="text-xs text-[#6B7280]">Peran aktif: {currentRole}</p>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-full hover:bg-[#F7F7F5] text-[#6B7280]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 mb-6">
              {moreNav.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-[#ECECE8] hover:bg-[#FFF7E0] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFF7E0] text-[#B45309] flex items-center justify-center shrink-0">
                    {m.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1F2933]">{m.name}</h4>
                    <p className="text-xs text-[#6B7280]">{m.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  Truck,
  BarChart3,
  Settings,
  Calculator,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/lib/store";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
  allowedRoles?: string[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole, stats, products, receivables, deliveries } = useAppStore();

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const overdueCount = receivables.filter((r) => r.status === "Terlambat" || r.status === "Segera Jatuh Tempo").length;
  const pendingDeliveries = deliveries.filter((d) => d.status === "Dalam Perjalanan" || d.status === "Disiapkan").length;

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      name: "Transaksi",
      href: "/transaksi",
      icon: <ShoppingCart className="w-5 h-5 shrink-0" />,
      allowedRoles: ["Owner", "Admin", "Kasir", "Staf Gudang", "Sopir"],
    },
    {
      name: "Produk",
      href: "/produk",
      icon: <Package className="w-5 h-5 shrink-0" />,
      allowedRoles: ["Owner", "Admin", "Staf Gudang"],
    },
    {
      name: "Stok",
      href: "/stok",
      icon: <Boxes className="w-5 h-5 shrink-0" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      allowedRoles: ["Owner", "Admin", "Staf Gudang"],
    },
    {
      name: "Pelanggan",
      href: "/pelanggan",
      icon: <Users className="w-5 h-5 shrink-0" />,
      badge: overdueCount > 0 ? `${overdueCount}` : undefined,
      allowedRoles: ["Owner", "Admin", "Kasir"],
    },
    {
      name: "Supplier",
      href: "/supplier",
      icon: <Truck className="w-5 h-5 shrink-0" />,
      allowedRoles: ["Owner", "Admin", "Staf Gudang"],
    },
    {
      name: "Laporan",
      href: "/laporan",
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
      allowedRoles: ["Owner", "Admin"],
    },
    {
      name: "Pengaturan",
      href: "/pengaturan",
      icon: <Settings className="w-5 h-5 shrink-0" />,
      allowedRoles: ["Owner", "Admin"],
    },
  ];

  // Filter based on role permissions
  const filteredNav = navItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(currentRole)
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#ECECE8] h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-14 sm:h-16 px-5 border-b border-[#ECECE8] flex items-center shrink-0">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
        <p className="px-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
          Menu Utama
        </p>

        {filteredNav.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? "bg-[#F5A800] text-[#1F2933] shadow-sm font-bold"
                  : "text-[#3F4650] hover:bg-[#F7F7F5] hover:text-[#1F2933]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-[#1F2933]" : "text-[#6B7280] group-hover:text-[#1F2933]"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-[#1F2933] text-[#F5A800]"
                      : "bg-[#FEE2E2] text-[#E5484D]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Feature Highlight: Kalkulator Material */}
        <div className="pt-4 mt-4 border-t border-[#ECECE8]">
          <p className="px-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
            Fitur Toko Bangunan
          </p>
          <Link
            href="/kalkulator"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              pathname === "/kalkulator"
                ? "bg-[#F5A800] text-[#1F2933] shadow-sm font-bold"
                : "text-[#3F4650] hover:bg-[#FFF7E0] hover:text-[#B45309]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-[#B45309]" />
              <span>Hitung Material</span>
            </div>
            <span className="text-[10px] bg-[#FFF7E0] text-[#B45309] font-bold px-1.5 py-0.5 rounded border border-[#FDEBB8]">
              PRO
            </span>
          </Link>
        </div>
      </div>

      {/* Role Indicator Footer */}
      <div className="p-3.5 border-t border-[#ECECE8] bg-[#F7F7F5]/60">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#ECECE8]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#FFF7E0] text-[#B45309] font-bold text-xs flex items-center justify-center shrink-0 border border-[#FDEBB8]">
              {currentRole.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1F2933] truncate">Budi Santoso</p>
              <p className="text-[10px] text-[#6B7280] truncate">Peran: {currentRole}</p>
            </div>
          </div>
          <Link
            href="/pengaturan"
            className="text-[11px] font-semibold text-[#B45309] hover:underline shrink-0"
          >
            Ubah
          </Link>
        </div>
      </div>
    </aside>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Eye } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function RecentTransactions() {
  const { transactions } = useAppStore();
  const recent = transactions.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-[#ECECE8] shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#ECECE8] flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1F2933]">Transaksi Terbaru</h3>
          <p className="text-xs text-[#6B7280]">Aktivitas kasir dan penjualan terkini</p>
        </div>
        <Link
          href="/transaksi?tab=riwayat"
          className="text-xs font-bold text-[#B45309] hover:underline flex items-center gap-1"
        >
          Lihat semua ({transactions.length}) <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F7F5] text-[#6B7280] font-semibold uppercase text-[11px] border-b border-[#ECECE8]">
            <tr>
              <th className="px-4 py-3">No. Transaksi</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3">Metode Bayar</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECECE8] text-[#1F2933]">
            {recent.map((trx) => (
              <tr key={trx.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-[#1F2933]">
                  {trx.trxNo}
                </td>
                <td className="px-4 py-3 text-[#6B7280]">
                  {formatTanggal(trx.date)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold">{trx.customerName}</div>
                  <div className="text-[10px] text-[#6B7280]">{trx.customerType}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{trx.paymentMethod}</span>
                  {trx.needsDelivery && (
                    <span className="ml-1.5 text-[10px] bg-[#DBEAFE] text-[#1D4ED8] px-1.5 py-0.5 rounded">
                      Kirim
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-bold text-[#1F2933]">
                  {formatRupiah(trx.total)}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant={
                      trx.status === "Selesai"
                        ? "success"
                        : trx.status === "Belum Lunas"
                        ? "warning"
                        : trx.status === "Diretur"
                        ? "danger"
                        : "secondary"
                    }
                    size="sm"
                  >
                    {trx.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

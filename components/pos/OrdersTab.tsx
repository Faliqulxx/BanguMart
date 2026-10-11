"use client";

import React, { useState } from "react";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";
import { SalesOrder } from "@/data/salesOrders";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppStore } from "@/lib/store";
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  ShoppingCart,
} from "lucide-react";

export function OrdersTab() {
  const { salesOrders, convertOrderToTransaction, showToast } = useAppStore();
  const [selectedSo, setSelectedSo] = useState<SalesOrder | null>(null);

  const handleUpdateStatus = (soId: string, newStatus: SalesOrder["status"]) => {
    // Local store mutation
    useAppStore.setState((state) => ({
      salesOrders: state.salesOrders.map((s) => (s.id === soId ? { ...s, status: newStatus } : s)),
    }));
    showToast("Status Pesanan Diperbarui", `Status pesanan diubah ke ${newStatus}`, "info");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-[#ECECE8] flex items-center justify-between shadow-xs">
        <div>
          <h3 className="text-base font-bold text-[#1F2933]">Pesanan Penjualan (Sales Orders)</h3>
          <p className="text-xs text-[#6B7280]">
            Kelola pesanan material yang sedang disiapkan staf gudang sebelum pengiriman/pengambilan
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {salesOrders.map((so) => {
          const statusColors: Record<string, any> = {
            Baru: "info",
            Disiapkan: "warning",
            Siap: "primary",
            Selesai: "success",
            Dibatalkan: "danger",
          };

          return (
            <div
              key={so.id}
              className="bg-white rounded-xl border border-[#ECECE8] p-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#1F2933]">
                      {so.orderNo}
                    </span>
                    <h4 className="text-sm font-extrabold text-[#1F2933] mt-0.5">
                      {so.customerName}
                    </h4>
                  </div>
                  <Badge variant={statusColors[so.status]} size="sm">
                    {so.status}
                  </Badge>
                </div>

                {so.projectName && (
                  <p className="text-[11px] text-[#B45309] font-medium mb-1">
                    {so.projectName}
                  </p>
                )}

                <p className="text-[11px] text-[#6B7280] mb-3">
                  Waktu: {formatTanggalWaktu(so.date)}
                </p>

                {/* Items & Financial summary */}
                <div className="p-2.5 rounded-lg bg-[#F7F7F5] space-y-1.5 text-xs mb-3">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Item Barang:</span>
                    <span className="font-bold text-[#1F2933]">{so.items.length} item</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Uang Muka (DP):</span>
                    <span className="font-semibold text-[#16A34A]">{formatRupiah(so.dpPaid)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Sisa Tagihan:</span>
                    <span className="font-bold text-[#E5484D]">
                      {formatRupiah(so.remainingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-xs pt-1 border-t border-[#ECECE8]">
                    <span>Total Order:</span>
                    <span className="text-[#1F2933]">{formatRupiah(so.total)}</span>
                  </div>
                </div>

                {so.notes && (
                  <p className="text-[11px] text-[#6B7280] italic mb-3">
                    Catatan: {so.notes}
                  </p>
                )}
              </div>

              {/* Status workflow buttons */}
              <div className="pt-2 border-t border-[#ECECE8] flex flex-col gap-2">
                <div className="flex gap-2">
                  {so.status === "Baru" && (
                    <Button
                      variant="soft"
                      size="xs"
                      onClick={() => handleUpdateStatus(so.id, "Disiapkan")}
                      className="flex-1 font-bold"
                    >
                      Mulai Siapkan (Gudang)
                    </Button>
                  )}
                  {so.status === "Disiapkan" && (
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => handleUpdateStatus(so.id, "Siap")}
                      className="flex-1 font-bold"
                    >
                      Tandai Siap Kirim
                    </Button>
                  )}
                  {so.status === "Siap" && (
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => convertOrderToTransaction(so.id)}
                      className="flex-1 font-bold"
                    >
                      Proses Transaksi & Kirim
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => setSelectedSo(so)}
                    icon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Detail
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Order Detail Modal */}
      {selectedSo && (
        <Modal
          isOpen={!!selectedSo}
          onClose={() => setSelectedSo(null)}
          title={`Detail Pesanan ${selectedSo.orderNo}`}
          subtitle={`Pelanggan: ${selectedSo.customerName}`}
          maxWidth="lg"
        >
          <div className="space-y-3 text-xs">
            <div className="border border-[#ECECE8] rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#F7F7F5] border-b border-[#ECECE8] text-[#6B7280]">
                  <tr>
                    <th className="p-2">Material</th>
                    <th className="p-2 text-center">Satuan</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Harga</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECE8]">
                  {selectedSo.items.map((i, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-bold">{i.name}</td>
                      <td className="p-2 text-center">{i.unit}</td>
                      <td className="p-2 text-right">{i.qty}</td>
                      <td className="p-2 text-right">{formatRupiah(i.unitPrice)}</td>
                      <td className="p-2 text-right font-black">{formatRupiah(i.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedSo.deliveryAddress && (
              <div className="p-2.5 rounded-lg bg-[#F7F7F5]">
                <p className="font-bold text-[#1F2933]">Alamat Pengiriman:</p>
                <p className="text-[#6B7280]">{selectedSo.deliveryAddress}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

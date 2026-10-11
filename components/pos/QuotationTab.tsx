"use client";

import React, { useState } from "react";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { Quotation } from "@/data/quotations";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppStore } from "@/lib/store";
import {
  FileText,
  Share2,
  ShoppingCart,
  CheckCircle,
  Copy,
  Printer,
  Plus,
  ArrowRight,
} from "lucide-react";

export function QuotationTab() {
  const { quotations, convertQuotationToOrder, convertQuotationToCart, showToast } = useAppStore();
  const [selectedQt, setSelectedQt] = useState<Quotation | null>(null);
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waTargetQt, setWaTargetQt] = useState<Quotation | null>(null);

  const handleOpenWaModal = (qt: Quotation) => {
    setWaTargetQt(qt);
    setWaModalOpen(true);
  };

  const getWaMessage = (qt: Quotation) => {
    const itemsList = qt.items
      .map((i) => `• ${i.name} (${i.qty} ${i.unit}) = ${formatRupiah(i.subtotal)}`)
      .join("\n");

    return `*PENAWARAN HARGA BANGUMART POS*\nNo: ${qt.quotationNo}\nTanggal: ${formatTanggal(qt.date)}\nPelanggan: ${qt.customerName}\n${qt.projectName ? `Proyek: ${qt.projectName}\n` : ""}\n*Daftar Material:*\n${itemsList}\n\n*Total Penawaran: ${formatRupiah(qt.total)}*\nBerlaku hingga: ${formatTanggal(qt.validUntil)}\n\n_Silakan balas pesan ini untuk konfirmasi pesanan._`;
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-white p-4 rounded-xl border border-[#ECECE8] flex items-center justify-between shadow-xs">
        <div>
          <h3 className="text-base font-bold text-[#1F2933]">Daftar Penawaran Harga (Quotation)</h3>
          <p className="text-xs text-[#6B7280]">
            Kirim estimasi RAB material ke kontraktor, lalu konversi ke Pesanan atau Kasir
          </p>
        </div>
      </div>

      {/* Quotation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {quotations.map((qt) => {
          const statusVariants: Record<string, any> = {
            Draft: "secondary",
            Terkirim: "info",
            Disetujui: "success",
            Ditolak: "danger",
            Kedaluwarsa: "warning",
          };

          return (
            <div
              key={qt.id}
              className="bg-white rounded-xl border border-[#ECECE8] p-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#1F2933]">
                      {qt.quotationNo}
                    </span>
                    <h4 className="text-sm font-extrabold text-[#1F2933] mt-0.5">
                      {qt.customerName}
                    </h4>
                  </div>
                  <Badge variant={statusVariants[qt.status]} size="sm">
                    {qt.status}
                  </Badge>
                </div>

                {qt.projectName && (
                  <p className="text-[11px] text-[#B45309] font-medium mb-2">
                    Proyek: {qt.projectName}
                  </p>
                )}

                <div className="p-2.5 rounded-lg bg-[#F7F7F5] space-y-1 text-xs mb-3">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Jumlah Material:</span>
                    <span className="font-bold text-[#1F2933]">{qt.items.length} Macam</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Masa Berlaku:</span>
                    <span>s.d {formatTanggal(qt.validUntil)}</span>
                  </div>
                  <div className="flex justify-between font-black text-xs pt-1 border-t border-[#ECECE8]">
                    <span>Total RAB:</span>
                    <span className="text-[#1F2933]">{formatRupiah(qt.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#ECECE8]">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => handleOpenWaModal(qt)}
                    className="flex-1"
                    icon={<Share2 className="w-3.5 h-3.5 text-[#16A34A]" />}
                  >
                    Kirim WA
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => setSelectedQt(qt)}
                    className="flex-1"
                  >
                    Rincian
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="soft"
                    size="xs"
                    onClick={() => convertQuotationToOrder(qt.id)}
                    className="flex-1 font-bold text-[#B45309]"
                  >
                    Ubah jadi SO
                  </Button>
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => convertQuotationToCart(qt.id)}
                    className="flex-1 font-bold"
                  >
                    Ke Kasir
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Message Preview Modal (PRD 6.2c) */}
      {waTargetQt && (
        <Modal
          isOpen={waModalOpen}
          onClose={() => setWaModalOpen(false)}
          title="Pratinjau Pesan WhatsApp"
          subtitle={`Kirim ke: ${waTargetQt.customerName}`}
          maxWidth="md"
          footer={
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(getWaMessage(waTargetQt));
                  showToast("Teks Disalin", "Format pesan siap ditempel di WhatsApp", "success");
                }}
                icon={<Copy className="w-3.5 h-3.5" />}
              >
                Salin Teks
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  showToast("WhatsApp Terbuka", "Membuka WhatsApp Web untuk mengirim", "success");
                  setWaModalOpen(false);
                }}
              >
                Kirim Sekarang
              </Button>
            </div>
          }
        >
          <div className="p-3.5 rounded-xl bg-[#DCF8C6]/30 border border-[#A7E9AF] text-xs font-mono whitespace-pre-line text-[#1F2933]">
            {getWaMessage(waTargetQt)}
          </div>
        </Modal>
      )}

      {/* Quotation Detail Modal */}
      {selectedQt && (
        <Modal
          isOpen={!!selectedQt}
          onClose={() => setSelectedQt(null)}
          title={`Penawaran ${selectedQt.quotationNo}`}
          subtitle={`Pelanggan: ${selectedQt.customerName}`}
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
                  {selectedQt.items.map((i, idx) => (
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

            <div className="flex justify-end pt-2">
              <div className="w-56 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(selectedQt.subtotal)}</span>
                </div>
                {selectedQt.shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Estimasi Ongkir:</span>
                    <span>+{formatRupiah(selectedQt.shippingFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm pt-1 border-t border-[#ECECE8]">
                  <span>Total Penawaran:</span>
                  <span>{formatRupiah(selectedQt.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

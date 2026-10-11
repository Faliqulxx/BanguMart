"use client";

import React, { useState } from "react";
import { Printer, CheckCircle, Download, Share2, Copy } from "lucide-react";
import { Transaction } from "@/data/transactions";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/lib/store";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function ReceiptModal({ isOpen, onClose, transaction }: ReceiptModalProps) {
  const { settings, showToast } = useAppStore();
  const [printFormat, setPrintFormat] = useState<"thermal" | "a4">("thermal");

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
    showToast("Mencetak Nota", "Perintah cetak dikirim ke printer", "info");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`Nota: ${transaction.trxNo} - ${formatRupiah(transaction.total)}`);
    showToast("Disalin ke Clipboard", "Ringkasan nota berhasil disalin", "success");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nota Penjualan & Faktur"
      subtitle={`${transaction.trxNo} • ${transaction.invoiceNo}`}
      maxWidth={printFormat === "a4" ? "2xl" : "md"}
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintFormat("thermal")}
              className={`text-xs px-2.5 py-1 rounded font-bold transition-colors ${
                printFormat === "thermal"
                  ? "bg-[#1F2933] text-white"
                  : "bg-[#F7F7F5] text-[#6B7280] hover:text-[#1F2933]"
              }`}
            >
              Struk 80mm
            </button>
            <button
              onClick={() => setPrintFormat("a4")}
              className={`text-xs px-2.5 py-1 rounded font-bold transition-colors ${
                printFormat === "a4"
                  ? "bg-[#1F2933] text-white"
                  : "bg-[#F7F7F5] text-[#6B7280] hover:text-[#1F2933]"
              }`}
            >
              Faktur A4
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopyLink} icon={<Copy className="w-3.5 h-3.5" />}>
              Salin
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} icon={<Printer className="w-3.5 h-3.5" />}>
              Cetak Dokumen
            </Button>
          </div>
        </div>
      }
    >
      {printFormat === "thermal" ? (
        /* Thermal Receipt 80mm Layout */
        <div className="bg-white p-4 rounded-xl border border-dashed border-[#D1D5DB] max-w-sm mx-auto font-mono text-xs text-[#1F2933] select-all">
          <div className="text-center pb-3 border-b border-dashed border-[#D1D5DB]">
            <h4 className="font-extrabold text-base tracking-tight font-sans">
              Bangu<span className="text-[#F5A800]">Mart</span> POS
            </h4>
            <p className="text-[11px] text-[#6B7280] font-sans">{settings.address}</p>
            <p className="text-[11px] text-[#6B7280] font-sans">Telp: {settings.phone}</p>
          </div>

          <div className="py-2.5 border-b border-dashed border-[#D1D5DB] text-[11px] space-y-0.5">
            <div className="flex justify-between">
              <span>No. Nota:</span>
              <span className="font-bold">{transaction.trxNo}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal:</span>
              <span>{formatTanggalWaktu(transaction.date)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>{transaction.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span className="font-bold">{transaction.customerName}</span>
            </div>
          </div>

          {/* Items */}
          <div className="py-2.5 border-b border-dashed border-[#D1D5DB] space-y-1.5 text-[11px]">
            {transaction.items.map((item, idx) => (
              <div key={idx}>
                <div className="font-bold">{item.name}</div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>
                    {item.qty} {item.unit} × {formatRupiah(item.unitPrice)}
                  </span>
                  <span className="text-[#1F2933] font-semibold">{formatRupiah(item.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="py-2.5 border-b border-dashed border-[#D1D5DB] space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(transaction.subtotal)}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-[#E5484D]">
                <span>Diskon:</span>
                <span>-{formatRupiah(transaction.discount)}</span>
              </div>
            )}
            {transaction.tax > 0 && (
              <div className="flex justify-between">
                <span>PPN:</span>
                <span>+{formatRupiah(transaction.tax)}</span>
              </div>
            )}
            {transaction.shippingFee > 0 && (
              <div className="flex justify-between">
                <span>Biaya Kirim:</span>
                <span>+{formatRupiah(transaction.shippingFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold pt-1 border-t border-dashed border-[#D1D5DB]">
              <span>TOTAL:</span>
              <span>{formatRupiah(transaction.total)}</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span>Bayar ({transaction.paymentMethod}):</span>
              <span>{formatRupiah(transaction.amountPaid)}</span>
            </div>
            {transaction.change > 0 && (
              <div className="flex justify-between text-[11px]">
                <span>Kembalian:</span>
                <span>{formatRupiah(transaction.change)}</span>
              </div>
            )}
            {transaction.status === "Belum Lunas" && (
              <div className="flex justify-between text-[11px] font-bold text-[#E5484D]">
                <span>Sisa Tagihan (Tempo):</span>
                <span>{formatRupiah(transaction.total - transaction.amountPaid)}</span>
              </div>
            )}
          </div>

          <div className="pt-3 text-center text-[10px] text-[#6B7280] space-y-0.5">
            <p>Terima kasih telah berbelanja di BanguMart!</p>
            <p>Barang yang sudah dibeli dapat ditukar maksimal 3 hari.</p>
          </div>
        </div>
      ) : (
        /* Formal A4 Invoice Layout */
        <div className="bg-white p-6 rounded-xl border border-[#ECECE8] space-y-4 text-xs text-[#1F2933]">
          <div className="flex justify-between items-start border-b border-[#ECECE8] pb-4">
            <div>
              <Logo size="md" />
              <p className="text-[11px] text-[#6B7280] mt-1">{settings.address}</p>
              <p className="text-[11px] text-[#6B7280]">NPWP: {settings.npwp}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-black text-[#1F2933]">FAKTUR PENJUALAN</h2>
              <p className="font-mono text-xs font-bold text-[#6B7280]">{transaction.invoiceNo}</p>
              <p className="text-[11px] text-[#6B7280]">Tanggal: {formatTanggalWaktu(transaction.date)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-[#F7F7F5]">
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase font-bold">Kepada Yth:</p>
              <p className="font-bold text-sm text-[#1F2933]">{transaction.customerName}</p>
              <p className="text-[11px] text-[#6B7280]">Tipe: {transaction.customerType}</p>
              {transaction.projectAddress && (
                <p className="text-[11px] text-[#1F2933] font-medium mt-1">
                  Proyek: {transaction.projectAddress}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#6B7280] uppercase font-bold">Informasi Pembayaran:</p>
              <p className="font-semibold text-xs">Metode: {transaction.paymentMethod}</p>
              <p className="font-semibold text-xs">Status: {transaction.status}</p>
              {transaction.dueDate && (
                <p className="text-[11px] text-[#E5484D] font-bold">
                  Jatuh Tempo: {transaction.dueDate}
                </p>
              )}
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] border-y border-[#ECECE8] text-[#6B7280]">
              <tr>
                <th className="py-2 px-2">No</th>
                <th className="py-2 px-2">Deskripsi Barang</th>
                <th className="py-2 px-2 text-right">Qty</th>
                <th className="py-2 px-2 text-center">Satuan</th>
                <th className="py-2 px-2 text-right">Harga Satuan</th>
                <th className="py-2 px-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECE8]">
              {transaction.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-2">{idx + 1}</td>
                  <td className="py-2 px-2 font-bold">{item.name}</td>
                  <td className="py-2 px-2 text-right">{item.qty}</td>
                  <td className="py-2 px-2 text-center">{item.unit}</td>
                  <td className="py-2 px-2 text-right">{formatRupiah(item.unitPrice)}</td>
                  <td className="py-2 px-2 text-right font-semibold">{formatRupiah(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-2 border-t border-[#ECECE8]">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatRupiah(transaction.subtotal)}</span>
              </div>
              {transaction.shippingFee > 0 && (
                <div className="flex justify-between">
                  <span>Ongkos Kirim:</span>
                  <span>+{formatRupiah(transaction.shippingFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-[#ECECE8]">
                <span>Total:</span>
                <span>{formatRupiah(transaction.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

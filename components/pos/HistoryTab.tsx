"use client";

import React, { useState } from "react";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";
import { Transaction } from "@/data/transactions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ReceiptModal } from "@/components/pos/ReceiptModal";
import { useAppStore } from "@/lib/store";
import {
  Search,
  Filter,
  Printer,
  RotateCcw,
  Eye,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export function HistoryTab() {
  const { transactions, showToast } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [printTrx, setPrintTrx] = useState<Transaction | null>(null);

  // Return Modal states
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("Salah ukuran / dimensi");
  const [returnType, setReturnType] = useState("Tukar Barang");

  const filtered = transactions.filter((t) => {
    const matchesStatus = statusFilter === "Semua" || t.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      t.trxNo.toLowerCase().includes(term) ||
      t.customerName.toLowerCase().includes(term) ||
      t.paymentMethod.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const handleProcessReturn = () => {
    if (!selectedTrx) return;
    showToast(
      "Retur Berhasil Diproses",
      `Transaksi ${selectedTrx.trxNo} berhasil diretur dengan metode ${returnType}`,
      "success"
    );
    setReturnModalOpen(false);
    setSelectedTrx(null);
  };

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#ECECE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari no. transaksi atau pelanggan..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-[#F7F7F5] border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B7280]">Status:</span>
          {["Semua", "Selesai", "Belum Lunas", "Diretur"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                statusFilter === st
                  ? "bg-[#1F2933] text-white"
                  : "bg-[#F7F7F5] text-[#6B7280] hover:text-[#1F2933]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-[#ECECE8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] text-[#6B7280] font-bold text-[11px] uppercase border-b border-[#ECECE8]">
              <tr>
                <th className="px-4 py-3">No. Transaksi</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Pembayaran</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECE8]">
              {filtered.map((trx) => (
                <tr key={trx.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#1F2933]">
                    {trx.trxNo}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {formatTanggalWaktu(trx.date)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <div>{trx.customerName}</div>
                    <div className="text-[10px] text-[#6B7280]">{trx.customerType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">{trx.paymentMethod}</span>
                    {trx.needsDelivery && (
                      <span className="ml-1 text-[10px] bg-[#DBEAFE] text-[#1D4ED8] px-1.5 py-0.2 rounded font-bold">
                        Kirim
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-black text-[#1F2933]">
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
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => setSelectedTrx(trx)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Detail
                      </Button>
                      <Button
                        variant="soft"
                        size="xs"
                        onClick={() => setPrintTrx(trx)}
                        icon={<Printer className="w-3.5 h-3.5" />}
                      >
                        Cetak
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTrx && (
        <Modal
          isOpen={!!selectedTrx}
          onClose={() => setSelectedTrx(null)}
          title={`Detail Transaksi ${selectedTrx.trxNo}`}
          subtitle={selectedTrx.invoiceNo}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setReturnModalOpen(true)}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Proses Retur
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setSelectedTrx(null)}>
                  Tutup
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setPrintTrx(selectedTrx);
                    setSelectedTrx(null);
                  }}
                  icon={<Printer className="w-3.5 h-3.5" />}
                >
                  Cetak Nota
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Summary info */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F7F7F5]">
              <div>
                <p className="text-[#6B7280]">Pelanggan:</p>
                <p className="font-bold text-[#1F2933]">{selectedTrx.customerName}</p>
                <p className="text-[#6B7280] mt-1">Kasir: {selectedTrx.cashierName}</p>
              </div>
              <div className="text-right">
                <p className="text-[#6B7280]">Metode Pembayaran:</p>
                <p className="font-bold text-[#1F2933]">{selectedTrx.paymentMethod}</p>
                <p className="text-[#6B7280] mt-1">Status: {selectedTrx.status}</p>
              </div>
            </div>

            {/* Items table */}
            <div className="border border-[#ECECE8] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] border-b border-[#ECECE8] text-[#6B7280]">
                  <tr>
                    <th className="p-2.5">Barang</th>
                    <th className="p-2.5 text-center">Satuan</th>
                    <th className="p-2.5 text-right">Qty</th>
                    <th className="p-2.5 text-right">Harga</th>
                    <th className="p-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECE8]">
                  {selectedTrx.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold">{item.name}</td>
                      <td className="p-2.5 text-center">{item.unit}</td>
                      <td className="p-2.5 text-right">{item.qty}</td>
                      <td className="p-2.5 text-right">{formatRupiah(item.unitPrice)}</td>
                      <td className="p-2.5 text-right font-bold">{formatRupiah(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <div className="w-56 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(selectedTrx.subtotal)}</span>
                </div>
                {selectedTrx.discount > 0 && (
                  <div className="flex justify-between text-[#E5484D]">
                    <span>Diskon:</span>
                    <span>-{formatRupiah(selectedTrx.discount)}</span>
                  </div>
                )}
                {selectedTrx.shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Biaya Kirim:</span>
                    <span>+{formatRupiah(selectedTrx.shippingFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm pt-1 border-t border-[#ECECE8]">
                  <span>Total:</span>
                  <span>{formatRupiah(selectedTrx.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Return Modal (PRD 6.2b: alasan rusak, salah ukuran, uang/kredit toko/tukar) */}
      <Modal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        title="Form Pengajuan Retur Barang"
        subtitle={`Transaksi: ${selectedTrx?.trxNo}`}
        maxWidth="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setReturnModalOpen(false)}>
              Batal
            </Button>
            <Button variant="danger" size="sm" onClick={handleProcessReturn}>
              Konfirmasi Retur
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[#1F2933] block mb-1">Alasan Retur:</label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
            >
              <option value="Salah ukuran / dimensi">Salah ukuran / dimensi material</option>
              <option value="Barang cacat / rusak fisik">Barang cacat / pecah saat kirim</option>
              <option value="Salah pesan / kelebihan beli">Salah pesan / kelebihan beli proyek</option>
              <option value="Kualitas tidak sesuai spek">Kualitas tidak sesuai spek proyek</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[#1F2933] block mb-1">
              Bentuk Kompensasi Pengembalian:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Tukar Barang", "Kredit Toko", "Uang Tunai"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setReturnType(type)}
                  className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                    returnType === type
                      ? "bg-[#1F2933] text-white border-[#1F2933]"
                      : "bg-[#F7F7F5] border-[#ECECE8] text-[#1F2933]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-[#6B7280] bg-[#FFF7E0] p-2.5 rounded-lg border border-[#FDEBB8]">
            * Stok barang akan otomatis dikembalikan ke gudang penyimpanan setelah retur disetujui.
          </p>
        </div>
      </Modal>

      {/* Receipt Modal Trigger */}
      <ReceiptModal
        isOpen={!!printTrx}
        onClose={() => setPrintTrx(null)}
        transaction={printTrx}
      />
    </div>
  );
}

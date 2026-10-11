"use client";

import React, { useState } from "react";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { Delivery, DeliveryStatus } from "@/data/deliveries";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppStore } from "@/lib/store";
import {
  Truck,
  MapPin,
  User,
  Printer,
  CheckCircle,
  Clock,
  PenTool,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function DeliveryTab() {
  const { deliveries, updateDeliveryStatus, showToast } = useAppStore();
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [sjModalOpen, setSjModalOpen] = useState(false);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [receiverName, setReceiverName] = useState("");

  const columns: { status: DeliveryStatus; label: string; color: string }[] = [
    { status: "Dijadwalkan", label: "Dijadwalkan", color: "border-t-[#F59E0B]" },
    { status: "Disiapkan", label: "Disiapkan", color: "border-t-[#2563EB]" },
    { status: "Dalam Perjalanan", label: "Dalam Perjalanan", color: "border-t-[#F5A800]" },
    { status: "Diterima", label: "Diterima / Selesai", color: "border-t-[#16A34A]" },
  ];

  const handleOpenProof = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setReceiverName(delivery.receivedBy || "");
    setProofModalOpen(true);
  };

  const handleSaveProof = () => {
    if (!selectedDelivery) return;
    updateDeliveryStatus(selectedDelivery.id, "Diterima", receiverName || "Mandor Proyek");
    setProofModalOpen(false);
    showToast("Bukti Terima Disimpan", `Pengiriman ${selectedDelivery.deliveryNo} berstatus Diterima`, "success");
  };

  const handlePrintSj = (del: Delivery) => {
    setSelectedDelivery(del);
    setSjModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-[#ECECE8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-[#1F2933]">Papan Pengiriman Proyek (Surat Jalan)</h3>
          <p className="text-xs text-[#6B7280]">
            Pantau pergerakan armada toko (Pickup L300 & Truk Engkel) menuju lokasi proyek pelanggan
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="primary" size="sm">
            Pak Joko: Pickup L300
          </Badge>
          <Badge variant="secondary" size="sm">
            Pak Anto: Truk Engkel
          </Badge>
        </div>
      </div>

      {/* Kanban Board 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 items-start">
        {columns.map((col) => {
          const itemsInCol = deliveries.filter((d) => d.status === col.status);

          return (
            <div
              key={col.status}
              className={`bg-[#F7F7F5] rounded-xl border border-[#ECECE8] border-t-4 ${col.color} p-3 min-h-[500px] flex flex-col`}
            >
              {/* Column Title */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-[#1F2933]">{col.label}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#6B7280] border border-[#ECECE8]">
                  {itemsInCol.length}
                </span>
              </div>

              {/* Delivery Cards */}
              <div className="space-y-2.5 flex-1">
                {itemsInCol.length === 0 ? (
                  <p className="text-center py-10 text-[11px] text-[#9CA3AF]">
                    Tidak ada kiriman
                  </p>
                ) : (
                  itemsInCol.map((del) => (
                    <div
                      key={del.id}
                      className="bg-white rounded-xl border border-[#ECECE8] p-3 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        {/* Delivery No & Customer */}
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <span className="font-mono text-[11px] font-bold text-[#B45309]">
                            {del.deliveryNo}
                          </span>
                          <span className="text-[10px] text-[#6B7280] font-medium">
                            {del.scheduledTime}
                          </span>
                        </div>

                        <h4 className="text-xs font-extrabold text-[#1F2933]">
                          {del.customerName}
                        </h4>

                        <div className="flex items-start gap-1 text-[11px] text-[#6B7280] mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#E5484D] shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-tight">{del.projectAddress}</span>
                        </div>

                        <div className="mt-2 p-2 rounded-lg bg-[#F7F7F5] text-[10px] space-y-0.5 text-[#3F4650]">
                          <p>
                            <strong>Sopir:</strong> {del.driverName}
                          </p>
                          <p>
                            <strong>Armada:</strong> {del.vehicle}
                          </p>
                          <p className="text-[#6B7280] truncate">
                            <strong>Muatan:</strong> {del.items.map((i) => `${i.qty} ${i.unit} ${i.name}`).join(", ")}
                          </p>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-3 pt-2 border-t border-[#ECECE8] flex items-center justify-between gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handlePrintSj(del)}
                          className="text-[11px] px-2 text-[#6B7280] hover:text-[#1F2933]"
                          title="Cetak Surat Jalan"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Surat Jalan
                        </Button>

                        {/* Status Advancement Controls */}
                        {del.status === "Dijadwalkan" && (
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => updateDeliveryStatus(del.id, "Disiapkan")}
                            className="text-[11px]"
                          >
                            Siapkan
                          </Button>
                        )}

                        {del.status === "Disiapkan" && (
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => updateDeliveryStatus(del.id, "Dalam Perjalanan")}
                            className="text-[11px]"
                          >
                            Berangkat
                          </Button>
                        )}

                        {del.status === "Dalam Perjalanan" && (
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => handleOpenProof(del)}
                            className="text-[11px] bg-[#16A34A] hover:bg-[#15803D] text-white"
                          >
                            Bukti Terima
                          </Button>
                        )}

                        {del.status === "Diterima" && (
                          <Badge variant="success" size="sm" icon={<CheckCircle className="w-3 h-3" />}>
                            Selesai
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Surat Jalan Print Modal (PRD 6.2e & 10D) */}
      {selectedDelivery && (
        <Modal
          isOpen={sjModalOpen}
          onClose={() => setSjModalOpen(false)}
          title={`Surat Jalan Pengiriman ${selectedDelivery.deliveryNo}`}
          subtitle="Dokumen resmi pengantaran barang ke proyek"
          maxWidth="lg"
          footer={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setSjModalOpen(false)}>
                Tutup
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  window.print();
                  showToast("Mencetak Surat Jalan", "Dokumen dikirim ke printer", "info");
                }}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Cetak Surat Jalan (SJ)
              </Button>
            </div>
          }
        >
          <div className="bg-white p-5 rounded-xl border border-[#ECECE8] text-xs space-y-4">
            <div className="flex justify-between items-start border-b border-[#ECECE8] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#1F2933]">BANGUMART POS</h3>
                <p className="text-[#6B7280] text-[11px]">SURAT JALAN / PENGANTAR BARANG</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-[#1F2933]">{selectedDelivery.deliveryNo}</span>
                <p className="text-[11px] text-[#6B7280]">Tanggal: {formatTanggal(selectedDelivery.date)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-[#F7F7F5] rounded-lg">
              <div>
                <p className="font-bold text-[#1F2933]">Tujuan Pengiriman:</p>
                <p className="font-semibold text-[#1F2933]">{selectedDelivery.customerName}</p>
                <p className="text-[#6B7280]">{selectedDelivery.projectAddress}</p>
                <p className="text-[#6B7280]">Telp: {selectedDelivery.customerPhone}</p>
              </div>
              <div>
                <p className="font-bold text-[#1F2933]">Ekspedisi / Armada:</p>
                <p className="text-[#1F2933]">Sopir: {selectedDelivery.driverName}</p>
                <p className="text-[#1F2933]">Kendaraan: {selectedDelivery.vehicle}</p>
                <p className="text-[#6B7280]">Jadwal: {selectedDelivery.scheduledTime}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F5] border-y border-[#ECECE8] text-[#6B7280]">
                <tr>
                  <th className="py-2 px-2">No</th>
                  <th className="py-2 px-2">Nama Barang / Material</th>
                  <th className="py-2 px-2 text-right">Jumlah</th>
                  <th className="py-2 px-2 text-center">Satuan</th>
                  <th className="py-2 px-2">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECE8]">
                {selectedDelivery.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-2">{idx + 1}</td>
                    <td className="py-2 px-2 font-bold">{item.name}</td>
                    <td className="py-2 px-2 text-right font-black">{item.qty}</td>
                    <td className="py-2 px-2 text-center">{item.unit}</td>
                    <td className="py-2 px-2 text-[#6B7280]">Kondisi baik & baru</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature blocks */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
              <div>
                <p className="text-[#6B7280] mb-12">Disiapkan Oleh (Gudang)</p>
                <p className="font-bold text-[#1F2933] border-t border-[#ECECE8] pt-1">Hendra W.</p>
              </div>
              <div>
                <p className="text-[#6B7280] mb-12">Dibawa Oleh (Sopir)</p>
                <p className="font-bold text-[#1F2933] border-t border-[#ECECE8] pt-1">
                  {selectedDelivery.driverName}
                </p>
              </div>
              <div>
                <p className="text-[#6B7280] mb-12">Diterima Oleh (Mandor/Proyek)</p>
                <p className="font-bold text-[#1F2933] border-t border-[#ECECE8] pt-1">
                  {selectedDelivery.receivedBy || "( ....................... )"}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Digital Receipt Proof Signature Modal (PRD 6.2e) */}
      {selectedDelivery && (
        <Modal
          isOpen={proofModalOpen}
          onClose={() => setProofModalOpen(false)}
          title="Bukti Terima Pengiriman"
          subtitle={`Konfirmasi barang tiba di proyek: ${selectedDelivery.customerName}`}
          maxWidth="md"
          footer={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setProofModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveProof}>
                Simpan Bukti Terima
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">
                Nama Penerima / Mandor Proyek:
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Contoh: Pak Slamet (Mandor)"
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
              />
            </div>

            {/* Digital Signature Simulation Box */}
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">
                Area Tanda Tangan Digital (Simulasi Layar Sentuh Sopir):
              </label>
              <div className="h-28 bg-[#F7F7F5] border-2 border-dashed border-[#D1D5DB] rounded-xl flex items-center justify-center text-center p-4 cursor-crosshair">
                <div className="text-[#9CA3AF]">
                  <PenTool className="w-6 h-6 mx-auto mb-1 text-[#F5A800]" />
                  <p className="text-[11px] font-semibold text-[#1F2933]">
                    {receiverName ? `Tanda tangan digital ${receiverName} terekam` : "Sentuh untuk simulasi tanda tangan penerima"}
                  </p>
                  <p className="text-[9px] text-[#6B7280]">Koordinat GPS & Timestamp otomatis tersimpan</p>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span className="text-[11px]">
                Surat jalan akan otomatis diarsip sebagai barang selesai diantar.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

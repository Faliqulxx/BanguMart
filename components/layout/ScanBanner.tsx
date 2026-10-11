"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, ArrowRight, ScanLine } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";

export function ScanBanner() {
  const router = useRouter();
  const { products, addToCart, showToast } = useAppStore();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");

  const handleSimulateScan = (productCode?: string) => {
    let target = products[0];
    if (productCode) {
      const match = products.find(
        (p) => p.code.toLowerCase() === productCode.toLowerCase() || p.barcode === productCode
      );
      if (match) target = match;
    } else {
      // Pick random popular product (e.g. Semen Tiga Roda or Besi)
      const sample = [products[0], products[1], products[3], products[4]];
      target = sample[Math.floor(Math.random() * sample.length)];
    }

    addToCart(target, target.baseUnit, 1);
    setIsScanModalOpen(false);
    showToast("Barcode Terpindai!", `${target.name} otomatis masuk keranjang`, "success");
    router.push("/transaksi");
  };

  return (
    <>
      {/* Amber Mobile Banner (PRD 4.3 & 6.1) */}
      <div
        onClick={() => setIsScanModalOpen(true)}
        className="sm:hidden w-full bg-[#F5A800] hover:bg-[#DB9500] text-[#1F2933] p-3.5 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] select-none my-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F2933] text-[#F5A800] flex items-center justify-center shrink-0 shadow-inner">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold tracking-tight leading-tight">
              Scan Barcode
            </h4>
            <p className="text-xs text-[#1F2933]/80 font-medium">
              Langsung ke transaksi kasir
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-[#1F2933]" />
        </div>
      </div>

      {/* Barcode Scanner Simulation Modal */}
      <Modal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        title="Simulasi Pemindai Barcode"
        subtitle="Gunakan kamera smartphone atau masukkan kode barcode manual"
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Simulated Camera Viewfinder */}
          <div className="relative aspect-video bg-[#1F2933] rounded-xl overflow-hidden flex flex-col items-center justify-center text-white border-2 border-[#F5A800]">
            <div className="absolute inset-8 border border-white/40 rounded-lg pointer-events-none flex items-center justify-center">
              <div className="w-full h-0.5 bg-[#E5484D] shadow-[0_0_8px_#E5484D] animate-pulse" />
            </div>
            <QrCode className="w-12 h-12 text-[#F5A800] mb-2 opacity-80" />
            <p className="text-xs font-semibold text-white/90">Arahkan barcode ke dalam bingkai</p>
            <p className="text-[10px] text-white/60 mt-0.5">Mendukung EAN-13, UPC, Code 128</p>
          </div>

          {/* Quick barcode simulation buttons */}
          <div>
            <p className="text-xs font-bold text-[#1F2933] mb-2">Pilih contoh barcode barang:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="xs"
                onClick={() => handleSimulateScan("SMN-001")}
                className="justify-start text-left"
              >
                🧱 Semen Tiga Roda (8991001)
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => handleSimulateScan("BSI-010")}
                className="justify-start text-left"
              >
                🏗️ Besi Beton 10mm (8992002)
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => handleSimulateScan("CAT-005")}
                className="justify-start text-left"
              >
                🎨 Cat Avian 5kg (8993003)
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => handleSimulateScan("PVC-034")}
                className="justify-start text-left"
              >
                🚰 Pipa PVC 3/4 (8994004)
              </Button>
            </div>
          </div>

          {/* Manual Barcode Input */}
          <div className="pt-2 border-t border-[#ECECE8]">
            <label className="text-xs font-semibold text-[#1F2933] block mb-1">
              Atau ketik Barcode / Kode SKU:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Contoh: 899100100101 atau SMN-001"
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSimulateScan(manualBarcode || "SMN-001")}
              >
                Pindai
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

"use client";

import React, { useState } from "react";
import {
  Banknote,
  QrCode,
  CreditCard,
  Building2,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Tag,
  Percent,
  ShieldCheck,
  Lock,
  Unlock,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import { PaymentMethod, Transaction } from "@/data/transactions";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (trx: Transaction) => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const {
    cart,
    selectedCustomer,
    shippingFee,
    cartDiscount,
    cartDiscountPercent,
    setCartDiscount,
    taxEnabledInCart,
    settings,
    currentRole,
    checkoutTransaction,
    showToast,
  } = useAppStore();

  const isOwner = currentRole === "Owner";

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = taxEnabledInCart
    ? Math.round((subtotal - cartDiscount) * (settings.taxRatePercent / 100))
    : 0;
  const grandTotal = Math.max(0, subtotal - cartDiscount + tax + shippingFee);

  const [method, setMethod] = useState<PaymentMethod>("Tunai");
  const [cashGiven, setCashGiven] = useState<number>(grandTotal);
  const [creditTermDays, setCreditTermDays] = useState<number>(14);
  const [dpAmount, setDpAmount] = useState<number>(Math.round(grandTotal * 0.3));

  // Discount adjustment state inside PaymentModal
  const [discMode, setDiscMode] = useState<"rp" | "percent" | "override">("rp");
  const [discVal, setDiscVal] = useState<string>("");
  const [overridePrice, setOverridePrice] = useState<string>("");
  const [ownerPin, setOwnerPin] = useState<string>("");
  const [isPinApproved, setIsPinApproved] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>("");

  // Sync state when modal opens or discount changes
  React.useEffect(() => {
    if (isOpen) {
      if (cartDiscountPercent > 0) {
        setDiscMode("percent");
        setDiscVal(String(cartDiscountPercent));
      } else if (cartDiscount > 0) {
        setDiscMode("rp");
        setDiscVal(String(cartDiscount));
      } else {
        setDiscVal("");
      }
      setOverridePrice(String(grandTotal));
      setOwnerPin("");
      setIsPinApproved(false);
      setPinError("");
    }
  }, [isOpen, cartDiscount, cartDiscountPercent]);

  // Delivery options
  const [needsDelivery, setNeedsDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<"Pak Joko" | "Pak Anto">("Pak Joko");
  const [selectedVehicle, setSelectedVehicle] = useState<
    "Pickup L300 (W 8920 UZ)" | "Truk Engkel (W 9102 PQ)"
  >("Pickup L300 (W 8920 UZ)");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  // Populate address from customer projects if available
  React.useEffect(() => {
    if (selectedCustomer?.projects && selectedCustomer.projects.length > 0) {
      setDeliveryAddress(selectedCustomer.projects[0].address);
    } else if (selectedCustomer?.address) {
      setDeliveryAddress(selectedCustomer.address);
    }
  }, [selectedCustomer]);

  // Reset cashGiven when total changes
  React.useEffect(() => {
    if (method === "Tunai") {
      setCashGiven(grandTotal);
    }
  }, [grandTotal, method]);

  const change = Math.max(0, cashGiven - grandTotal);

  // Credit validations
  const customerLimit = selectedCustomer?.creditLimit || 0;
  const currentReceivable = selectedCustomer?.currentReceivable || 0;
  const remainingLimit = Math.max(0, customerLimit - currentReceivable);
  const creditAmount = method === "DP_Tempo" ? grandTotal - dpAmount : grandTotal;
  const isOverCreditLimit = (method === "Kredit" || method === "DP_Tempo") && creditAmount > remainingLimit;

  // Due date calculation
  const getDueDateString = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  // Discount application handler
  const handleApplyDiscount = () => {
    if (discMode === "override" && isOwner) {
      const target = parseFloat(overridePrice) || 0;
      if (target <= 0) {
        showToast("Nilai Tidak Valid", "Total tagihan harus lebih dari 0", "error");
        return;
      }
      const grossWithoutDisc = subtotal + shippingFee;
      const targetDiscount = Math.max(0, grossWithoutDisc - target);
      setCartDiscount(targetDiscount, false);
      showToast("Harga Diubah", `Total tagihan khusus Owner diatur ke ${formatRupiah(target)}`, "success");
      return;
    }

    const num = parseFloat(discVal) || 0;
    const isPercent = discMode === "percent";
    const nominalRp = isPercent ? Math.round((subtotal * Math.min(100, Math.max(0, num))) / 100) : num;

    // Validation rules:
    // 1. Owner: Bebas tanpa batas & tanpa PIN
    // 2. Kasir/Karyawan: Potongan <= 1.000 berlaku langsung. Jika > 1.000 wajib PIN Owner (1234)
    if (!isOwner && nominalRp > 1000 && !isPinApproved) {
      if (ownerPin !== "1234") {
        setPinError("PIN Owner salah. Gunakan 1234 untuk persetujuan.");
        showToast("PIN Owner Diperlukan", `Potongan ${formatRupiah(nominalRp)} melebihi batas kasir (Rp 1.000). Masukkan PIN Owner (1234).`, "error");
        return;
      } else {
        setIsPinApproved(true);
        setPinError("");
      }
    }

    setCartDiscount(num, isPercent);
    showToast(
      "Potongan Berhasil",
      isOwner
        ? "Potongan diterapkan langsung oleh Owner"
        : nominalRp <= 1000
        ? `Potongan ${formatRupiah(nominalRp)} disetujui (dalam batas kasir s/d Rp 1.000)`
        : `Potongan ${formatRupiah(nominalRp)} disetujui dengan otorisasi PIN Owner`,
      "success"
    );
  };

  const handleQuickPreset = (nominal: number) => {
    if (!isOwner && nominal > 1000 && !isPinApproved) {
      setDiscMode("rp");
      setDiscVal(String(nominal));
      showToast("Butuh PIN Owner", `Potongan ${formatRupiah(nominal)} melebihi batas kasir Rp 1.000. Masukkan PIN Owner (1234).`, "warning");
      return;
    }
    setDiscMode("rp");
    setDiscVal(String(nominal));
    setCartDiscount(nominal, false);
    showToast(
      "Potongan Diterapkan",
      isOwner
        ? `Potongan ${formatRupiah(nominal)} diterapkan oleh Owner`
        : `Potongan ${formatRupiah(nominal)} disetujui dalam batas kasir`,
      "success"
    );
  };

  const handleProcessPayment = () => {
    if (method === "Tunai" && cashGiven < grandTotal) {
      showToast("Nominal Kurang", "Uang tunai yang diterima kurang dari total tagihan", "error");
      return;
    }

    if ((method === "Kredit" || method === "DP_Tempo") && !selectedCustomer) {
      showToast("Pelanggan Belum Dipilih", "Transaksi kredit mewajibkan data pelanggan", "error");
      return;
    }

    if (needsDelivery && !deliveryAddress.trim()) {
      showToast("Alamat Kosong", "Masukkan alamat proyek untuk pengiriman", "error");
      return;
    }

    const paid =
      method === "Tunai"
        ? cashGiven
        : method === "DP_Tempo"
        ? dpAmount
        : method === "Kredit"
        ? 0
        : grandTotal;

    const trx = checkoutTransaction({
      paymentMethod: method,
      amountPaid: paid,
      change: method === "Tunai" ? change : 0,
      dueDate: getDueDateString(creditTermDays),
      needsDelivery,
      deliveryDetails: needsDelivery
        ? {
            address: deliveryAddress,
            driverName: selectedDriver,
            vehicle: selectedVehicle,
            time: "Hari ini / Siap Kirim",
            notes: deliveryNotes,
          }
        : undefined,
    });

    onSuccess(trx);
  };

  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: "Tunai", label: "Tunai", icon: <Banknote className="w-4 h-4" /> },
    { id: "Transfer", label: "Transfer Bank", icon: <Building2 className="w-4 h-4" /> },
    { id: "QRIS", label: "QRIS", icon: <QrCode className="w-4 h-4" /> },
    { id: "Kartu", label: "Kartu Debit/Kredit", icon: <CreditCard className="w-4 h-4" /> },
    { id: "Kredit", label: "Kredit / Tempo", icon: <Clock className="w-4 h-4" /> },
    { id: "DP_Tempo", label: "DP + Sisa Tempo", icon: <Clock className="w-4 h-4" /> },
  ];

  const currentEnteredNominal =
    discMode === "percent"
      ? Math.round((subtotal * (parseFloat(discVal) || 0)) / 100)
      : discMode === "override"
      ? Math.max(0, subtotal + shippingFee - (parseFloat(overridePrice) || 0))
      : parseFloat(discVal) || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pembayaran Transaksi"
      subtitle={`Total Tagihan: ${formatRupiah(grandTotal)}`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-xs text-[#6B7280]">Total yang harus dibayar:</span>
            <p className="text-base font-black text-[#1F2933]">{formatRupiah(grandTotal)}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="md" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" size="md" onClick={handleProcessPayment} className="font-extrabold px-6">
              Selesaikan Transaksi
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Diskon Khusus / Potongan Harga Panel */}
        <div className="p-3 sm:p-3.5 rounded-2xl border border-[#ECECE8] bg-[#F7F7F5]/80 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFF7E0] text-[#B45309] flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2933]">
                  Diskon Khusus / Potongan Harga
                </h4>
                <p className="text-[10px] text-[#6B7280]">
                  {isOwner
                    ? "Akses Owner: Anda dapat langsung mengubah harga/potongan tanpa batasan"
                    : "Akses Kasir: Dapat memberi potongan langsung maks. Rp 1.000 jika diminta pelanggan"}
                </p>
              </div>
            </div>

            {/* Role Privilege Badge */}
            <span
              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                isOwner
                  ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
                  : "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]"
              }`}
            >
              {isOwner ? (
                <>
                  <ShieldCheck className="w-3 h-3" />
                  <span>Owner (Bebas Ubah Harga & Potongan)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  <span>Kasir (Maks. Potongan Rp 1.000)</span>
                </>
              )}
            </span>
          </div>

          {/* Mode Switcher & Input */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
            {/* Mode selection buttons */}
            <div className="sm:col-span-5 flex items-center bg-white rounded-xl p-1 border border-[#ECECE8]">
              <button
                type="button"
                onClick={() => setDiscMode("rp")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  discMode === "rp"
                    ? "bg-[#1F2933] text-white shadow-xs"
                    : "text-[#6B7280] hover:text-[#1F2933]"
                }`}
              >
                Nominal (Rp)
              </button>
              <button
                type="button"
                onClick={() => setDiscMode("percent")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  discMode === "percent"
                    ? "bg-[#1F2933] text-white shadow-xs"
                    : "text-[#6B7280] hover:text-[#1F2933]"
                }`}
              >
                Persen (%)
              </button>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setDiscMode("override")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    discMode === "override"
                      ? "bg-[#F5A800] text-[#1F2933] shadow-xs"
                      : "text-[#6B7280] hover:text-[#1F2933]"
                  }`}
                  title="Owner dapat mengetikkan total tagihan akhir secara langsung"
                >
                  Ubah Total
                </button>
              )}
            </div>

            {/* Input field and apply button */}
            <div className="sm:col-span-7 flex items-center gap-1.5">
              <div className="relative flex-1">
                {discMode === "override" ? (
                  <input
                    type="number"
                    value={overridePrice}
                    onChange={(e) => setOverridePrice(e.target.value)}
                    placeholder="Ketik total akhir baru..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#ECECE8] text-xs font-extrabold text-[#1F2933] focus:outline-none focus:border-[#F5A800]"
                  />
                ) : (
                  <>
                    <input
                      type="number"
                      value={discVal}
                      onChange={(e) => {
                        setDiscVal(e.target.value);
                        setPinError("");
                      }}
                      placeholder={discMode === "rp" ? "Contoh: 1000" : "Contoh: 5"}
                      min="0"
                      max={discMode === "percent" ? 100 : undefined}
                      className="w-full px-3 pr-8 py-1.5 rounded-xl bg-white border border-[#ECECE8] text-xs font-extrabold text-[#1F2933] focus:outline-none focus:border-[#F5A800]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6B7280]">
                      {discMode === "rp" ? "Rp" : "%"}
                    </span>
                  </>
                )}
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleApplyDiscount}
                className="shrink-0 font-bold text-xs"
              >
                Terapkan
              </Button>

              {cartDiscount > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setCartDiscount(0);
                    setDiscVal("");
                    setIsPinApproved(false);
                    showToast("Diskon Direset", "Diskon transaksi dihapus", "info");
                  }}
                  className="shrink-0 text-xs text-[#E5484D] hover:bg-[#FEE2E2]"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Quick presets & helpers */}
          <div className="flex items-center justify-between flex-wrap gap-1.5 pt-1 border-t border-dashed border-[#ECECE8]">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[10px] font-bold text-[#6B7280]">Pilihan Cepat:</span>
              <button
                type="button"
                onClick={() => handleQuickPreset(500)}
                className="px-2 py-0.5 rounded-md bg-white border border-[#ECECE8] hover:bg-[#FFF7E0] text-[10px] font-bold text-[#1F2933]"
              >
                -Rp 500
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(1000)}
                className="px-2 py-0.5 rounded-md bg-white border border-[#ECECE8] hover:bg-[#FFF7E0] text-[10px] font-bold text-[#1F2933]"
              >
                -Rp 1.000 (Maks Kasir)
              </button>
              {subtotal % 1000 > 0 && subtotal % 1000 <= 1000 && (
                <button
                  type="button"
                  onClick={() => handleQuickPreset(subtotal % 1000)}
                  className="px-2 py-0.5 rounded-md bg-[#FFF7E0] border border-[#FDEBB8] text-[10px] font-bold text-[#B45309]"
                  title="Bulatkan ratusan receh"
                >
                  Bulatkan (-{formatRupiah(subtotal % 1000)})
                </button>
              )}
              {isOwner && (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(5000)}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#ECECE8] hover:bg-[#FFF7E0] text-[10px] font-bold text-[#1F2933]"
                  >
                    -Rp 5.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscMode("percent");
                      setDiscVal("5");
                      setCartDiscount(5, true);
                    }}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#ECECE8] hover:bg-[#FFF7E0] text-[10px] font-bold text-[#1F2933]"
                  >
                    -5%
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscMode("percent");
                      setDiscVal("10");
                      setCartDiscount(10, true);
                    }}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#ECECE8] hover:bg-[#FFF7E0] text-[10px] font-bold text-[#1F2933]"
                  >
                    -10%
                  </button>
                </>
              )}
            </div>

            {/* Display active discount feedback */}
            {cartDiscount > 0 && (
              <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Hemat {formatRupiah(cartDiscount)} {cartDiscountPercent > 0 ? `(${cartDiscountPercent}%)` : ""}</span>
              </span>
            )}
          </div>

          {/* Conditional PIN authorization inline prompt for Kasir if entered discount > 1.000 */}
          {!isOwner && currentEnteredNominal > 1000 && !isPinApproved && (
            <div className="p-2.5 rounded-xl bg-[#FFF7E0] border border-[#FDEBB8] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#B45309]">
                <Lock className="w-3.5 h-3.5" />
                <span>Otorisasi PIN Owner Diperlukan</span>
              </div>
              <p className="text-[11px] text-[#6B7280]">
                Potongan sebesar <strong className="text-[#1F2933]">{formatRupiah(currentEnteredNominal)}</strong> melebihi wewenang kasir (maks. Rp 1.000). Masukkan PIN Owner (Dummy: <strong>1234</strong>) untuk melanjutkan.
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="password"
                  value={ownerPin}
                  onChange={(e) => {
                    setOwnerPin(e.target.value);
                    setPinError("");
                  }}
                  placeholder="PIN Owner (1234)"
                  maxLength={6}
                  className="w-36 px-2.5 py-1 rounded-lg bg-white border border-[#ECECE8] text-xs font-mono tracking-widest focus:outline-none focus:border-[#F5A800]"
                />
                <Button
                  variant="primary"
                  size="xs"
                  onClick={handleApplyDiscount}
                  className="font-bold text-[11px]"
                >
                  Setujui Potongan
                </Button>
              </div>
              {pinError && (
                <p className="text-[10px] text-[#E5484D] font-bold">{pinError}</p>
              )}
            </div>
          )}

          {!isOwner && isPinApproved && currentEnteredNominal > 1000 && (
            <div className="p-2 rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] text-[11px] font-bold text-[#15803D] flex items-center gap-1.5">
              <Unlock className="w-3.5 h-3.5" />
              <span>Potongan {formatRupiah(currentEnteredNominal)} telah disetujui dengan PIN Owner.</span>
            </div>
          )}
        </div>

        {/* Method Picker Buttons */}
        <div>
          <label className="text-xs font-bold text-[#1F2933] block mb-2">
            Pilih Metode Pembayaran:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  method === m.id
                    ? "bg-[#F5A800] text-[#1F2933] border-[#DB9500] shadow-xs"
                    : "bg-[#F7F7F5] border-[#ECECE8] text-[#3F4650] hover:bg-white"
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Panel based on method */}
        {method === "Tunai" && (
          <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#ECECE8] space-y-3">
            <div>
              <label className="text-xs font-bold text-[#1F2933] block mb-1">
                Uang Diterima (Rp):
              </label>
              <input
                type="number"
                value={cashGiven}
                onChange={(e) => setCashGiven(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#ECECE8] text-lg font-black text-[#1F2933] focus:outline-none focus:border-[#F5A800]"
              />
            </div>

            {/* Quick cash shortcut chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCashGiven(grandTotal)}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#ECECE8] text-xs font-bold text-[#1F2933] hover:bg-[#FFF7E0]"
              >
                Uang Pas
              </button>
              {[50000, 100000, 200000, 500000, 1000000].map((nominal) => {
                if (nominal < grandTotal && nominal * 2 < grandTotal) return null;
                return (
                  <button
                    key={nominal}
                    onClick={() => setCashGiven(nominal)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#ECECE8] text-xs font-bold text-[#1F2933] hover:bg-[#FFF7E0]"
                  >
                    {formatRupiah(nominal)}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#ECECE8]">
              <span className="text-xs font-bold text-[#6B7280]">Kembalian:</span>
              <span className={`text-base font-black ${change >= 0 ? "text-[#16A34A]" : "text-[#E5484D]"}`}>
                {formatRupiah(change)}
              </span>
            </div>
          </div>
        )}

        {(method === "Transfer" || method === "QRIS" || method === "Kartu") && (
          <div className="p-4 rounded-xl bg-[#F7F7F5] border border-[#ECECE8] text-center space-y-2">
            <p className="text-xs text-[#6B7280]">Simulasi pembayaran non-tunai</p>
            <div className="p-3 bg-white rounded-lg border border-[#ECECE8] inline-block font-mono text-sm font-bold">
              Total Pembayaran: {formatRupiah(grandTotal)}
            </div>
            <p className="text-[11px] text-[#16A34A] font-semibold">
              ✓ Status pembayaran terverifikasi otomatis
            </p>
          </div>
        )}

        {(method === "Kredit" || method === "DP_Tempo") && (
          <div className="p-4 rounded-xl bg-[#FFF7E0] border border-[#FDEBB8] space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-[#B45309]">Penjualan Kredit / Piutang</p>
                <p className="text-[11px] text-[#6B7280]">
                  Pelanggan: <strong>{selectedCustomer ? selectedCustomer.name : "Belum dipilih"}</strong>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#6B7280]">Sisa Limit Kredit:</p>
                <p className="text-xs font-bold text-[#1F2933]">{formatRupiah(remainingLimit)}</p>
              </div>
            </div>

            {isOverCreditLimit && (
              <div className="p-2 rounded bg-[#FEE2E2] text-[#B91C1C] text-xs flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Transaksi ini melebihi limit kredit pelanggan! (Disetujui Owner)</span>
              </div>
            )}

            {method === "DP_Tempo" && (
              <div>
                <label className="text-xs font-bold text-[#1F2933] block mb-1">
                  Uang Muka (DP) yang dibayar tunai/transfer (Rp):
                </label>
                <input
                  type="number"
                  value={dpAmount}
                  onChange={(e) => setDpAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#ECECE8] text-sm font-bold focus:outline-none focus:border-[#F5A800]"
                />
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Sisa Piutang Tempo: <strong>{formatRupiah(Math.max(0, grandTotal - dpAmount))}</strong>
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#1F2933] block mb-1">
                Pilih Jangka Waktu Jatuh Tempo:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setCreditTermDays(days)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      creditTermDays === days
                        ? "bg-[#1F2933] text-white border-[#1F2933]"
                        : "bg-white border-[#ECECE8] text-[#1F2933] hover:bg-[#F7F7F5]"
                    }`}
                  >
                    {days} Hari ({getDueDateString(days)})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Checkbox Perlu Dikirim (PRD 6.2a) */}
        <div className="p-3.5 rounded-xl border border-[#ECECE8] bg-white">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={needsDelivery}
              onChange={(e) => setNeedsDelivery(e.target.checked)}
              className="w-4 h-4 text-[#F5A800] rounded focus:ring-[#F5A800]"
            />
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#1F2933]">
              <Truck className="w-4 h-4 text-[#B45309]" />
              <span>Perlu Dikirim ke Lokasi Proyek (Surat Jalan & Jadwal Sopir)</span>
            </div>
          </label>

          {needsDelivery && (
            <div className="mt-3 pt-3 border-t border-[#ECECE8] space-y-3 text-xs">
              {/* Project Address */}
              <div>
                <label className="font-semibold text-[#1F2933] block mb-1">
                  Alamat Pengiriman / Nama Proyek:
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Contoh: Jl. Veteran No. 88, Gresik (Proyek Ruko)"
                  className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
                />
              </div>

              {/* Driver and Vehicle */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#1F2933] block mb-1">Pilih Sopir:</label>
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
                  >
                    <option value="Pak Joko">Pak Joko (Siaga)</option>
                    <option value="Pak Anto">Pak Anto (Siaga)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#1F2933] block mb-1">Pilih Armada:</label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
                  >
                    <option value="Pickup L300 (W 8920 UZ)">Pickup L300 (W 8920 UZ)</option>
                    <option value="Truk Engkel (W 9102 PQ)">Truk Engkel (W 9102 PQ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1F2933] block mb-1">Catatan Sopir:</label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Contoh: Titipkan mandor proyek, gerbang depan"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

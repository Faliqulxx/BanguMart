"use client";

import React, { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  User,
  Pause,
  FileText,
  CreditCard,
  Truck,
  Edit2,
  Percent,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useAppStore, CartItem } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface CartPanelProps {
  onOpenPayment: () => void;
  onOpenQuotation: () => void;
}

export function CartPanel({ onOpenPayment, onOpenQuotation }: CartPanelProps) {
  const {
    cart,
    customers,
    selectedCustomer,
    setSelectedCustomer,
    updateCartItemQty,
    updateCartItemUnit,
    updateCartItemPrice,
    updateCartItemDiscount,
    updateCartItemNote,
    removeFromCart,
    clearCart,
    shippingFee,
    setShippingFee,
    cartDiscount,
    cartDiscountPercent,
    setCartDiscount,
    taxEnabledInCart,
    setTaxEnabledInCart,
    holdCurrentCart,
    heldCarts,
    restoreHeldCart,
    deleteHeldCart,
    settings,
    currentRole,
    showToast,
  } = useAppStore();

  const isOwner = currentRole === "Owner";

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [pricePinModalOpen, setPricePinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [tempNewPrice, setTempNewPrice] = useState("");
  const [tempDiscount, setTempDiscount] = useState("");
  const [tempDiscountMode, setTempDiscountMode] = useState<"rp" | "percent">("rp");
  const [tempNote, setTempNote] = useState("");
  const [isShippingOpen, setIsShippingOpen] = useState(false);

  // Cart-level discount modal state
  const [isCartDiscountOpen, setIsCartDiscountOpen] = useState(false);
  const [cartDiscMode, setCartDiscMode] = useState<"rp" | "percent">("rp");
  const [cartDiscVal, setCartDiscVal] = useState("");
  const [cartDiscPin, setCartDiscPin] = useState("");

  // Subtotal & Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = taxEnabledInCart
    ? Math.round((subtotal - cartDiscount) * (settings.taxRatePercent / 100))
    : 0;
  const grandTotal = Math.max(0, subtotal - cartDiscount + tax + shippingFee);

  // Credit limit calculation for customer
  const customerLimit = selectedCustomer?.creditLimit || 0;
  const currentReceivable = selectedCustomer?.currentReceivable || 0;
  const remainingLimit = Math.max(0, customerLimit - currentReceivable);
  const isOverLimit = customerLimit > 0 && grandTotal + currentReceivable > customerLimit;

  // Handle item price/discount edit
  const handleOpenPriceEdit = (item: CartItem) => {
    setEditingItem(item);
    setTempNewPrice(String(item.unitPrice));
    if (item.discountPercent > 0) {
      setTempDiscountMode("percent");
      setTempDiscount(String(item.discountPercent));
    } else {
      setTempDiscountMode("rp");
      setTempDiscount(item.discount > 0 ? String(item.discount) : "");
    }
    setTempNote(item.note || "");
    setPinInput("");
    setPricePinModalOpen(true);
  };

  const handleApplyPriceEdit = () => {
    if (!editingItem) return;
    const priceNum = parseFloat(tempNewPrice) || editingItem.unitPrice;
    const discNum = parseFloat(tempDiscount) || 0;
    const isPriceChanged = Math.abs(priceNum - editingItem.unitPrice) > 0.01;
    const isPercent = tempDiscountMode === "percent";
    const effectiveDiscRp = isPercent
      ? Math.round((priceNum * editingItem.qty * discNum) / 100)
      : discNum;

    // Authorization checks:
    // 1. Owner: Bebas ubah harga satuan & diskon tanpa PIN
    // 2. Kasir/Karyawan:
    //    - Jika ubah harga satuan: Wajib PIN Owner
    //    - Jika diskon > Rp 1.000: Wajib PIN Owner
    //    - Jika diskon <= Rp 1.000 dan harga tidak diubah: Disetujui langsung tanpa PIN
    if (!isOwner) {
      if (isPriceChanged || effectiveDiscRp > 1000) {
        if (pinInput !== "1234") {
          showToast(
            "PIN Owner Diperlukan",
            isPriceChanged
              ? "Ubah harga satuan memerlukan PIN Owner (Gunakan 1234)"
              : "Potongan melebihi batas kasir Rp 1.000. Wajib masukkan PIN Owner (1234)",
            "error"
          );
          return;
        }
      }
    }

    updateCartItemPrice(editingItem.product.id, priceNum);
    updateCartItemDiscount(editingItem.product.id, discNum, isPercent);
    updateCartItemNote(editingItem.product.id, tempNote);

    setPricePinModalOpen(false);
    showToast(
      "Harga & Diskon Diperbarui",
      isOwner
        ? "Diterapkan langsung dengan wewenang Owner"
        : effectiveDiscRp <= 1000 && !isPriceChanged
        ? "Potongan disetujui (dalam batas kasir maks Rp 1.000)"
        : "Disetujui dengan otorisasi PIN Owner",
      "success"
    );
  };

  const handleApplyCartDiscount = () => {
    const num = parseFloat(cartDiscVal) || 0;
    const isPercent = cartDiscMode === "percent";
    const nominalRp = isPercent ? Math.round((subtotal * num) / 100) : num;

    if (!isOwner && nominalRp > 1000) {
      if (cartDiscPin !== "1234") {
        showToast(
          "PIN Owner Diperlukan",
          `Potongan ${formatRupiah(nominalRp)} melebihi batas kasir (Rp 1.000). Masukkan PIN Owner (1234).`,
          "error"
        );
        return;
      }
    }

    setCartDiscount(num, isPercent);
    setIsCartDiscountOpen(false);
    showToast(
      "Diskon Transaksi Diterapkan",
      isOwner
        ? "Diterapkan langsung oleh Owner"
        : nominalRp <= 1000
        ? "Potongan disetujui dalam limit kasir (≤ Rp 1.000)"
        : "Potongan disetujui dengan PIN Owner",
      "success"
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl border border-[#ECECE8] shadow-sm overflow-hidden">
      {/* Customer Header Selector */}
      <div className="shrink-0 p-3 border-b border-[#ECECE8] bg-[#F7F7F5]/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#FFF7E0] text-[#B45309] flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#1F2933] truncate">
                {selectedCustomer ? selectedCustomer.name : "Pelanggan Umum"}
              </span>
              <span className="text-[10px] bg-[#ECECE8] text-[#1F2933] font-semibold px-1.5 py-0.2 rounded uppercase">
                {selectedCustomer ? selectedCustomer.type : "Eceran"}
              </span>
            </div>
            {selectedCustomer && selectedCustomer.creditLimit > 0 && (
              <p className="text-[10px] text-[#6B7280]">
                Limit: {formatRupiah(remainingLimit)} sisa
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => setIsCustomerModalOpen(true)}
            className="text-[11px]"
          >
            Ganti
          </Button>

          {heldCarts.length > 0 && (
            <button
              onClick={() => setIsHeldModalOpen(true)}
              className="relative p-1.5 rounded-lg bg-[#FFF7E0] text-[#B45309] hover:bg-[#FDEBB8] text-xs font-bold"
              title="Antrean Transaksi Ditahan"
            >
              <Pause className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-[#E5484D] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {heldCarts.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Credit Limit Alert if applicable */}
      {isOverLimit && (
        <div className="px-3.5 py-2 bg-[#FEE2E2] border-b border-[#FECACA] flex items-center gap-2 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Peringatan: Total melebihi sisa limit kredit ({formatRupiah(remainingLimit)})
          </span>
        </div>
      )}

      {/* Cart Items List */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 divide-y divide-[#ECECE8]">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#6B7280]">
            <span className="text-4xl mb-2">🛒</span>
            <p className="font-bold text-sm text-[#1F2933]">Keranjang Masih Kosong</p>
            <p className="text-xs max-w-xs mt-1">
              Pilih barang dari katalog di sebelah kiri atau gunakan tombol Scan Barcode
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={`${item.product.id}-${item.selectedUnit}`} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h5 className="text-xs font-bold text-[#1F2933] truncate">
                      {item.product.name}
                    </h5>
                    <button
                      onClick={() => handleOpenPriceEdit(item)}
                      className="text-[#9CA3AF] hover:text-[#B45309] p-0.5 rounded"
                      title="Ubah harga / diskon item (Butuh PIN)"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#6B7280]">
                    <span>{formatRupiah(item.unitPrice)}</span>
                    <span>×</span>
                    {/* Unit Switcher dropdown */}
                    {item.product.units.length > 1 ? (
                      <select
                        value={item.selectedUnit}
                        onChange={(e) =>
                          updateCartItemUnit(item.product.id, e.target.value)
                        }
                        className="bg-[#F7F7F5] border border-[#ECECE8] rounded px-1 text-[10px] font-bold text-[#1F2933]"
                      >
                        {item.product.units.map((u) => (
                          <option key={u.unit} value={u.unit}>
                            {u.unit}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-semibold text-[#1F2933]">{item.selectedUnit}</span>
                    )}

                    {item.discount > 0 && (
                      <span className="text-[#E5484D] font-bold">
                        (-{formatRupiah(item.discount)})
                      </span>
                    )}
                  </div>
                  {item.note && (
                    <p className="text-[10px] text-[#B45309] italic mt-0.5">
                      Catatan: {item.note}
                    </p>
                  )}
                </div>

                {/* Subtotal Item */}
                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-[#1F2933]">
                    {formatRupiah(item.total)}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center justify-between mt-2 pt-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateCartItemQty(item.product.id, item.qty - 1)}
                    className="w-6 h-6 rounded-md bg-[#F7F7F5] hover:bg-[#ECECE8] text-[#1F2933] flex items-center justify-center font-bold text-xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  {/* Allow direct typing including decimals for bulk e.g. pasir */}
                  <input
                    type="number"
                    step={item.product.isBulk ? "0.1" : "1"}
                    value={item.qty}
                    onChange={(e) =>
                      updateCartItemQty(item.product.id, parseFloat(e.target.value) || 0)
                    }
                    className="w-12 text-center text-xs font-bold py-0.5 rounded border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
                  />

                  <button
                    onClick={() => updateCartItemQty(item.product.id, item.qty + 1)}
                    className="w-6 h-6 rounded-md bg-[#F7F7F5] hover:bg-[#ECECE8] text-[#1F2933] flex items-center justify-center font-bold text-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-[#9CA3AF] hover:text-[#E5484D] p-1 transition-colors"
                  title="Hapus dari keranjang"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Checkout Footer */}
      <div className="shrink-0 p-3 sm:p-3.5 border-t border-[#ECECE8] bg-[#F7F7F5]/70 space-y-2">
        {/* Subtotal row */}
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} item)</span>
          <span className="font-semibold text-[#1F2933]">{formatRupiah(subtotal)}</span>
        </div>

        {/* Transaction Discount Row */}
        {cartDiscount > 0 && (
          <div className="flex justify-between text-xs text-[#E5484D] font-medium">
            <span className="flex items-center gap-1">
              <span>Diskon {cartDiscountPercent > 0 ? `(${cartDiscountPercent}%)` : ""}</span>
              <button
                onClick={() => setCartDiscount(0)}
                className="text-[10px] text-[#9CA3AF] hover:text-[#E5484D] underline ml-1"
                title="Batalkan diskon transaksi"
              >
                Hapus
              </button>
            </span>
            <span className="font-bold">-{formatRupiah(cartDiscount)}</span>
          </div>
        )}

        {/* Shipping & Tax & Discount Toggles */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed border-[#ECECE8]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setCartDiscVal(
                  cartDiscountPercent > 0
                    ? String(cartDiscountPercent)
                    : cartDiscount > 0
                    ? String(cartDiscount)
                    : ""
                );
                setCartDiscMode(cartDiscountPercent > 0 ? "percent" : "rp");
                setCartDiscPin("");
                setIsCartDiscountOpen(true);
              }}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                cartDiscount > 0
                  ? "bg-[#FEE2E2] text-[#B91C1C]"
                  : "bg-white border border-[#ECECE8] text-[#6B7280] hover:text-[#1F2933]"
              }`}
            >
              <Percent className="w-3 h-3" />
              <span>{cartDiscount > 0 ? `-${formatRupiah(cartDiscount)}` : "+ Diskon"}</span>
            </button>

            <button
              onClick={() => setIsShippingOpen(true)}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                shippingFee > 0
                  ? "bg-[#DBEAFE] text-[#1D4ED8]"
                  : "bg-white border border-[#ECECE8] text-[#6B7280] hover:text-[#1F2933]"
              }`}
            >
              <Truck className="w-3 h-3" />
              <span>{shippingFee > 0 ? formatRupiah(shippingFee) : "+ Ongkir"}</span>
            </button>

            <button
              onClick={() => setTaxEnabledInCart(!taxEnabledInCart)}
              className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                taxEnabledInCart
                  ? "bg-[#DCFCE7] text-[#15803D]"
                  : "bg-white border border-[#ECECE8] text-[#6B7280] hover:text-[#1F2933]"
              }`}
            >
              PPN {settings.taxRatePercent}%
            </button>
          </div>

          {tax > 0 && (
            <span className="text-[11px] text-[#6B7280]">+{formatRupiah(tax)}</span>
          )}
        </div>

        {/* Grand Total */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="text-xs font-bold text-[#1F2933]">Total Tagihan</span>
            {taxEnabledInCart && <span className="text-[10px] text-[#6B7280] ml-1">(inc PPN)</span>}
          </div>
          <span className="text-lg font-black text-[#1F2933]">
            {formatRupiah(grandTotal)}
          </span>
        </div>

        {/* Actions Row (Hold, Quotation, Checkout) */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <Button
            variant="secondary"
            size="sm"
            disabled={cart.length === 0}
            onClick={() => holdCurrentCart()}
            className="col-span-1 px-1 text-xs"
            title="Tahan transaksi untuk melayani pelanggan lain"
          >
            <Pause className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tahan</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={cart.length === 0}
            onClick={onOpenQuotation}
            className="col-span-1 px-1 text-xs"
            title="Buat penawaran harga resmi"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Penawaran</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            disabled={cart.length === 0}
            onClick={onOpenPayment}
            className="col-span-2 font-bold shadow-md"
          >
            <CreditCard className="w-4 h-4" />
            <span>Bayar (F9)</span>
          </Button>
        </div>
      </div>

      {/* Select Customer Modal */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Pilih Pelanggan"
        subtitle="Harga katalog dan limit kredit akan menyesuaikan tier pelanggan"
        maxWidth="md"
      >
        <div className="space-y-2 max-h-80 overflow-y-auto">
          <button
            onClick={() => {
              setSelectedCustomer(null);
              setIsCustomerModalOpen(false);
            }}
            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
              selectedCustomer === null
                ? "border-[#F5A800] bg-[#FFF7E0]"
                : "border-[#ECECE8] hover:bg-[#F7F7F5]"
            }`}
          >
            <div>
              <p className="text-xs font-bold text-[#1F2933]">Pelanggan Umum (Walk-in)</p>
              <p className="text-[11px] text-[#6B7280]">Tingkat Harga: Eceran Standar</p>
            </div>
            {selectedCustomer === null && <Check className="w-4 h-4 text-[#B45309]" />}
          </button>

          {customers.map((c) => {
            const isSelected = selectedCustomer?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCustomer(c);
                  setIsCustomerModalOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-[#F5A800] bg-[#FFF7E0]"
                    : "border-[#ECECE8] hover:bg-[#F7F7F5]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#1F2933]">{c.name}</p>
                    <Badge variant={c.type === "Kontraktor" ? "primary" : "secondary"} size="sm">
                      {c.type}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#6B7280]">{c.phone} • Tier: {c.priceTier}</p>
                  {c.creditLimit > 0 && (
                    <p className="text-[10px] text-[#B45309] font-medium mt-0.5">
                      Limit: {formatRupiah(c.creditLimit)} (Piutang: {formatRupiah(c.currentReceivable)})
                    </p>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#B45309]" />}
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Held Carts Modal */}
      <Modal
        isOpen={isHeldModalOpen}
        onClose={() => setIsHeldModalOpen(false)}
        title="Antrean Transaksi Ditahan"
        subtitle="Lanjutkan transaksi pelanggan yang tertunda"
        maxWidth="md"
      >
        <div className="space-y-3">
          {heldCarts.length === 0 ? (
            <p className="text-center py-6 text-xs text-[#6B7280]">Tidak ada transaksi ditahan.</p>
          ) : (
            heldCarts.map((h) => (
              <div
                key={h.id}
                className="p-3 rounded-xl border border-[#ECECE8] bg-[#F7F7F5] flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#1F2933]">
                    {h.customer ? h.customer.name : "Pelanggan Umum"} ({h.items.length} item)
                  </h4>
                  <p className="text-[11px] text-[#6B7280]">{h.note}</p>
                  <p className="text-[10px] text-[#1F2933] font-bold mt-1">
                    Total: {formatRupiah(h.items.reduce((s, i) => s + i.total, 0))}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => {
                      restoreHeldCart(h.id);
                      setIsHeldModalOpen(false);
                    }}
                  >
                    Buka
                  </Button>
                  <button
                    onClick={() => deleteHeldCart(h.id)}
                    className="p-1 text-[#E5484D] hover:bg-[#FEE2E2] rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Price Edit & PIN Approval Modal */}
      <Modal
        isOpen={pricePinModalOpen}
        onClose={() => setPricePinModalOpen(false)}
        title="Ubah Harga / Diskon Item"
        subtitle={`Produk: ${editingItem?.product.name}`}
        maxWidth="sm"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setPricePinModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={handleApplyPriceEdit}>
              Terapkan Perubahan
            </Button>
          </div>
        }
      >
        <div className="space-y-3.5 text-xs">
          {/* Role Status Banner */}
          <div className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${
            isOwner
              ? "bg-[#DCFCE7] border-[#BBF7D0] text-[#15803D]"
              : "bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1]"
          }`}>
            <span className="font-bold">
              {isOwner ? "🛡️ Akses Owner (Bebas Ubah Harga & Diskon)" : "👤 Akses Kasir (Maks. Potongan Rp 1.000)"}
            </span>
            <span className="text-[10px] font-semibold uppercase">{currentRole}</span>
          </div>

          <div>
            <label className="font-bold text-[#1F2933] block mb-1">
              Harga Satuan Baru (Rp):
            </label>
            <input
              type="number"
              value={tempNewPrice}
              onChange={(e) => setTempNewPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-sm font-bold focus:outline-none focus:border-[#F5A800]"
            />
            {editingItem && Math.abs((parseFloat(tempNewPrice) || 0) - editingItem.unitPrice) > 0.01 && (
              <p className="text-[10px] text-[#B45309] mt-1 font-semibold">
                * Harga asal: {formatRupiah(editingItem.unitPrice)} {!isOwner && "(Ubah harga satuan wajib PIN Owner)"}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#1F2933]">
                Diskon Item:
              </label>
              <div className="flex items-center bg-[#F7F7F5] rounded-lg p-0.5 border border-[#ECECE8]">
                <button
                  type="button"
                  onClick={() => setTempDiscountMode("rp")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    tempDiscountMode === "rp"
                      ? "bg-[#1F2933] text-white shadow-xs"
                      : "text-[#6B7280] hover:text-[#1F2933]"
                  }`}
                >
                  Rp
                </button>
                <button
                  type="button"
                  onClick={() => setTempDiscountMode("percent")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    tempDiscountMode === "percent"
                      ? "bg-[#1F2933] text-white shadow-xs"
                      : "text-[#6B7280] hover:text-[#1F2933]"
                  }`}
                >
                  %
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                value={tempDiscount}
                onChange={(e) => setTempDiscount(e.target.value)}
                placeholder="0"
                min="0"
                max={tempDiscountMode === "percent" ? 100 : undefined}
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-sm focus:outline-none focus:border-[#F5A800]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6B7280]">
                {tempDiscountMode === "rp" ? "Rp" : "%"}
              </span>
            </div>

            {tempDiscountMode === "percent" && editingItem && (
              <p className="text-[10px] text-[#6B7280] mt-1">
                Ekuivalen potongan: <strong className="text-[#1F2933]">{formatRupiah(Math.round(((parseFloat(tempNewPrice) || editingItem.unitPrice) * editingItem.qty * (parseFloat(tempDiscount) || 0)) / 100))}</strong>
              </p>
            )}
          </div>

          <div>
            <label className="font-bold text-[#1F2933] block mb-1">
              Catatan Khusus:
            </label>
            <input
              type="text"
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Contoh: Diskon pesanan borongan"
              className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
            />
          </div>

          {/* Conditional PIN Field for non-owner */}
          {!isOwner && (
            <div className="pt-2 border-t border-[#ECECE8]">
              <label className="font-bold text-[#1F2933] block mb-1 flex items-center justify-between">
                <span>PIN Otorisasi Owner:</span>
                <span className="text-[10px] text-[#6B7280]">Dummy: 1234</span>
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN jika diskon > Rp 1.000 / ubah harga"
                maxLength={6}
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-sm font-mono tracking-widest focus:outline-none focus:border-[#F5A800]"
              />
              <p className="text-[10px] text-[#6B7280] mt-1">
                * Jika hanya memberi potongan ≤ Rp 1.000 tanpa ubah harga satuan, PIN tidak diperlukan.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Cart-level Transaction Discount Modal */}
      <Modal
        isOpen={isCartDiscountOpen}
        onClose={() => setIsCartDiscountOpen(false)}
        title="Diskon Transaksi (Potongan Total)"
        subtitle="Berlaku untuk total keseluruhan belanja"
        maxWidth="sm"
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCartDiscount(0);
                setIsCartDiscountOpen(false);
              }}
            >
              Hapus Diskon
            </Button>
            <Button variant="primary" size="sm" onClick={handleApplyCartDiscount}>
              Terapkan Diskon
            </Button>
          </div>
        }
      >
        <div className="space-y-3.5 text-xs">
          {/* Role Status Banner */}
          <div className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${
            isOwner
              ? "bg-[#DCFCE7] border-[#BBF7D0] text-[#15803D]"
              : "bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1]"
          }`}>
            <span className="font-bold">
              {isOwner ? "🛡️ Akses Owner (Bebas Potongan Tanpa Batas)" : "👤 Akses Kasir (Maks. Potongan Langsung Rp 1.000)"}
            </span>
            <span className="text-[10px] font-semibold uppercase">{currentRole}</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#1F2933]">
                Bentuk Diskon:
              </label>
              <div className="flex items-center bg-[#F7F7F5] rounded-lg p-0.5 border border-[#ECECE8]">
                <button
                  type="button"
                  onClick={() => setCartDiscMode("rp")}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    cartDiscMode === "rp"
                      ? "bg-[#1F2933] text-white shadow-xs"
                      : "text-[#6B7280] hover:text-[#1F2933]"
                  }`}
                >
                  Nominal (Rp)
                </button>
                <button
                  type="button"
                  onClick={() => setCartDiscMode("percent")}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    cartDiscMode === "percent"
                      ? "bg-[#1F2933] text-white shadow-xs"
                      : "text-[#6B7280] hover:text-[#1F2933]"
                  }`}
                >
                  Persentase (%)
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                value={cartDiscVal}
                onChange={(e) => setCartDiscVal(e.target.value)}
                placeholder="0"
                min="0"
                max={cartDiscMode === "percent" ? 100 : undefined}
                className="w-full px-3 py-2.5 rounded-lg border border-[#ECECE8] text-base font-extrabold focus:outline-none focus:border-[#F5A800]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6B7280]">
                {cartDiscMode === "rp" ? "Rp" : "%"}
              </span>
            </div>

            {cartDiscMode === "percent" && (
              <p className="text-[11px] text-[#6B7280] mt-1">
                Ekuivalen potongan: <strong className="text-[#1F2933]">{formatRupiah(Math.round((subtotal * (parseFloat(cartDiscVal) || 0)) / 100))}</strong> dari subtotal {formatRupiah(subtotal)}
              </p>
            )}
          </div>

          {/* Quick preset chips */}
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
              Pilihan Cepat:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setCartDiscMode("rp");
                  setCartDiscVal("500");
                }}
                className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] border border-[#ECECE8] hover:bg-[#FFF7E0] text-[11px] font-bold"
              >
                Rp 500
              </button>
              <button
                type="button"
                onClick={() => {
                  setCartDiscMode("rp");
                  setCartDiscVal("1000");
                }}
                className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] border border-[#ECECE8] hover:bg-[#FFF7E0] text-[11px] font-bold"
              >
                Rp 1.000 (Maks Kasir)
              </button>
              {isOwner && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setCartDiscMode("rp");
                      setCartDiscVal("5000");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] border border-[#ECECE8] hover:bg-[#FFF7E0] text-[11px] font-bold"
                  >
                    Rp 5.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCartDiscMode("percent");
                      setCartDiscVal("5");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] border border-[#ECECE8] hover:bg-[#FFF7E0] text-[11px] font-bold"
                  >
                    5%
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCartDiscMode("percent");
                      setCartDiscVal("10");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] border border-[#ECECE8] hover:bg-[#FFF7E0] text-[11px] font-bold"
                  >
                    10%
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Conditional PIN prompt for Kasir if > 1000 */}
          {!isOwner && (
            <div className="pt-2 border-t border-[#ECECE8]">
              <label className="font-bold text-[#1F2933] block mb-1 flex items-center justify-between">
                <span>PIN Otorisasi Owner:</span>
                <span className="text-[10px] text-[#6B7280]">Dummy: 1234</span>
              </label>
              <input
                type="password"
                value={cartDiscPin}
                onChange={(e) => setCartDiscPin(e.target.value)}
                placeholder="Wajib jika potongan > Rp 1.000"
                maxLength={6}
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-sm font-mono tracking-widest focus:outline-none focus:border-[#F5A800]"
              />
              <p className="text-[10px] text-[#6B7280] mt-1">
                * Kasir dapat memberi diskon s/d Rp 1.000 langsung tanpa PIN.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Shipping Fee Modal */}
      <Modal
        isOpen={isShippingOpen}
        onClose={() => setIsShippingOpen(false)}
        title="Biaya Pengiriman (Ongkir)"
        subtitle="Tarif pengantaran material ke lokasi proyek"
        maxWidth="sm"
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShippingFee(0);
                setIsShippingOpen(false);
              }}
            >
              Gratis Ongkir
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsShippingOpen(false)}>
              Simpan Ongkir
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[#1F2933] block mb-1">
              Nominal Biaya Kirim (Rp):
            </label>
            <input
              type="number"
              value={shippingFee}
              onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-sm font-bold focus:outline-none focus:border-[#F5A800]"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setShippingFee(50000)}
              className="p-2 rounded border border-[#ECECE8] hover:bg-[#FFF7E0] text-[11px] font-semibold"
            >
              Pickup Dekat (50rb)
            </button>
            <button
              onClick={() => setShippingFee(150000)}
              className="p-2 rounded border border-[#ECECE8] hover:bg-[#FFF7E0] text-[11px] font-semibold"
            >
              Truk Engkel (150rb)
            </button>
            <button
              onClick={() => setShippingFee(250000)}
              className="p-2 rounded border border-[#ECECE8] hover:bg-[#FFF7E0] text-[11px] font-semibold"
            >
              Luar Kota (250rb)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

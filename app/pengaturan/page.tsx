"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { initialUsers, UserRole } from "@/data/users";
import { formatRupiah } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Settings,
  Store,
  Users,
  Printer,
  Percent,
  Truck,
  CreditCard,
  Sun,
  ShieldCheck,
  Save,
} from "lucide-react";

export default function PengaturanPage() {
  const { settings, updateSettings, currentRole, setCurrentRole, showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    "toko" | "peran" | "nota" | "pajak" | "pengiriman" | "kredit"
  >("toko");

  // Form states
  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [npwp, setNpwp] = useState(settings.npwp);

  const [invoiceFormat, setInvoiceFormat] = useState(settings.invoiceFormat);
  const [taxEnabled, setTaxEnabled] = useState(settings.taxEnabled);
  const [taxRate, setTaxRate] = useState(settings.taxRatePercent);

  const [deliveryBase, setDeliveryBase] = useState(settings.deliveryTariffBase);
  const [deliveryKm, setDeliveryKm] = useState(settings.deliveryTariffPerKm);

  const [defaultLimit, setDefaultLimit] = useState(settings.defaultCreditLimit);
  const [defaultTerm, setDefaultTerm] = useState(settings.defaultCreditTermDays);

  const handleSaveStore = () => {
    updateSettings({
      storeName,
      tagline,
      address,
      phone,
      email,
      npwp,
      invoiceFormat,
      taxEnabled,
      taxRatePercent: taxRate,
      deliveryTariffBase: deliveryBase,
      deliveryTariffPerKm: deliveryKm,
      defaultCreditLimit: defaultLimit,
      defaultCreditTermDays: defaultTerm,
    });
  };

  const rolesList: UserRole[] = ["Owner", "Admin", "Kasir", "Staf Gudang", "Sopir"];

  return (
    <AppLayout>
      <div className="space-y-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
          <div>
            <h1 className="text-xl font-black text-[#1F2933]">Pengaturan Sistem Toko</h1>
            <p className="text-xs text-[#6B7280]">
              Kelola profil toko, templat nota, simulasi peran pengguna, pajak, dan armada kirim
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveStore}
            icon={<Save className="w-4 h-4" />}
          >
            Simpan Pengaturan
          </Button>
        </div>

        {/* Tab Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Navigation vertical on desktop */}
          <div className="md:col-span-3 bg-white p-2 rounded-xl border border-[#ECECE8] shadow-xs space-y-1">
            {[
              { id: "toko", label: "Profil Toko", icon: <Store className="w-4 h-4" /> },
              { id: "peran", label: "Pengguna & Peran", icon: <Users className="w-4 h-4" /> },
              { id: "nota", label: "Nota & Dokumen", icon: <Printer className="w-4 h-4" /> },
              { id: "pajak", label: "Pajak (PPN)", icon: <Percent className="w-4 h-4" /> },
              { id: "pengiriman", label: "Tarif Pengiriman", icon: <Truck className="w-4 h-4" /> },
              { id: "kredit", label: "Aturan Kredit", icon: <CreditCard className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors text-left ${
                  activeTab === item.id
                    ? "bg-[#F5A800] text-[#1F2933]"
                    : "text-[#6B7280] hover:bg-[#F7F7F5] hover:text-[#1F2933]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Form Content Body */}
          <div className="md:col-span-9 bg-white p-5 rounded-xl border border-[#ECECE8] shadow-xs">
            {/* Tab: Profil Toko */}
            {activeTab === "toko" && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-[#1F2933]">Informasi Profil Toko</h3>
                  <p className="text-[#6B7280]">
                    Identitas ini akan otomatis dicetak pada Nota Kasir, Faktur A4, dan Surat Jalan
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1F2933] block mb-1">Nama Toko:</label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#ECECE8] font-bold text-[#1F2933] focus:outline-none focus:border-[#F5A800]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1F2933] block mb-1">Slogan / Tagline:</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#ECECE8] text-[#1F2933] focus:outline-none focus:border-[#F5A800]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#1F2933] block mb-1">Alamat Lengkap Toko:</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1F2933] block mb-1">Nomor Telepon / WhatsApp:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1F2933] block mb-1">NPWP Toko:</label>
                    <input
                      type="text"
                      value={npwp}
                      onChange={(e) => setNpwp(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Pengguna & Peran (PRD 3 & 6.8: pengalih peran dummy) */}
            {activeTab === "peran" && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-[#1F2933]">Simulasi Pengalih Peran (Role Switcher)</h3>
                  <p className="text-[#6B7280]">
                    Pilih peran aktif untuk menguji hak akses menu pada sistem POS ini
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rolesList.map((r) => (
                    <div
                      key={r}
                      onClick={() => setCurrentRole(r)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        currentRole === r
                          ? "border-[#F5A800] bg-[#FFF7E0] shadow-xs"
                          : "border-[#ECECE8] hover:bg-[#F7F7F5]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1F2933] text-[#F5A800] font-bold text-xs flex items-center justify-center">
                          {r.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1F2933]">{r}</p>
                          <p className="text-[11px] text-[#6B7280]">
                            {r === "Owner"
                              ? "Akses penuh laporan & persetujuan"
                              : r === "Admin"
                              ? "Kelola barang, supplier & nota"
                              : r === "Kasir"
                              ? "Fokus transaksi & pembayaran"
                              : r === "Staf Gudang"
                              ? "Cek stok & penyiapan pesanan"
                              : "Pengiriman & bukti terima"}
                          </p>
                        </div>
                      </div>

                      {currentRole === r && (
                        <span className="text-xs font-black text-[#B45309]">Aktif ✓</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-[#F7F7F5] rounded-xl border border-[#ECECE8] text-[#6B7280]">
                  <p className="font-bold text-[#1F2933]">Daftar Staf Terdaftar:</p>
                  <ul className="mt-1 space-y-1 list-disc pl-4 text-[11px]">
                    {initialUsers.map((u) => (
                      <li key={u.id}>
                        {u.name} — <strong className="text-[#1F2933]">{u.role}</strong> ({u.email})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Nota & Dokumen */}
            {activeTab === "nota" && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-[#1F2933]">Format Standar Pencetakan Nota</h3>
                  <p className="text-[#6B7280]">Pilih jenis kertas cetak default kasir</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "thermal58", label: "Thermal 58mm (Kecil)" },
                    { id: "thermal80", label: "Thermal 80mm (Standar)" },
                    { id: "a4", label: "Kertas A4 / Surat Jalan" },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setInvoiceFormat(fmt.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-colors ${
                        invoiceFormat === fmt.id
                          ? "border-[#F5A800] bg-[#FFF7E0] text-[#B45309]"
                          : "border-[#ECECE8] text-[#1F2933] hover:bg-[#F7F7F5]"
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Pajak PPN */}
            {activeTab === "pajak" && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-[#1F2933]">Pengaturan Pajak Pertambahan Nilai (PPN)</h3>
                  <p className="text-[#6B7280]">Pajak dapat diaktifkan per transaksi di kasir</p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-[#ECECE8]">
                  <input
                    type="checkbox"
                    checked={taxEnabled}
                    onChange={(e) => setTaxEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#F5A800] rounded"
                  />
                  <div>
                    <p className="font-bold text-[#1F2933]">Aktifkan PPN Otomatis pada Semua Transaksi</p>
                    <p className="text-[#6B7280] text-[11px]">Tarif default: 11%</p>
                  </div>
                </label>

                <div>
                  <label className="font-bold text-[#1F2933] block mb-1">Persentase PPN (%):</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-32 p-2 rounded-lg border border-[#ECECE8] font-bold"
                  />
                </div>
              </div>
            )}

            {/* Tab: Tarif Pengiriman */}
            {activeTab === "pengiriman" && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-[#1F2933]">Tarif Standar Pengiriman Proyek</h3>
                  <p className="text-[#6B7280]">Biaya angkut armada pickup dan truk</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1F2933] block mb-1">Tarif Dasar Minimal (Rp):</label>
                    <input
                      type="number"
                      value={deliveryBase}
                      onChange={(e) => setDeliveryBase(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-[#ECECE8] font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1F2933] block mb-1">Tarif Tambahan per Km (Rp):</label>
                    <input
                      type="number"
                      value={deliveryKm}
                      onChange={(e) => setDeliveryKm(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-[#ECECE8] font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Aturan Kredit */}
            {activeTab === "kredit" && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-[#1F2933]">Aturan Kredit & Termin Piutang</h3>
                  <p className="text-[#6B7280]">Ketentuan kredit untuk kontraktor dan toko langganan</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#1F2933] block mb-1">Plafon Limit Default (Rp):</label>
                    <input
                      type="number"
                      value={defaultLimit}
                      onChange={(e) => setDefaultLimit(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-[#ECECE8] font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#1F2933] block mb-1">Termin Default (Hari):</label>
                    <input
                      type="number"
                      value={defaultTerm}
                      onChange={(e) => setDefaultTerm(parseInt(e.target.value) || 14)}
                      className="w-full p-2 rounded-lg border border-[#ECECE8] font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { Customer } from "@/data/customers";
import { ReceivableInvoice } from "@/data/receivables";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  Building,
  CreditCard,
  DollarSign,
  AlertCircle,
  Clock,
  Share2,
  CheckCircle2,
  Copy,
  FolderGit2,
} from "lucide-react";

function PelangganContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "daftar";

  const {
    customers,
    receivables,
    payReceivable,
    addCustomer,
    updateCustomer,
    showToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"daftar" | "piutang">(
    initialTab === "piutang" ? "piutang" : "daftar"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("Semua");

  // Selected customer for detail modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add customer modal
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustType, setNewCustType] = useState<Customer["type"]>("Kontraktor");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustAddress, setNewCustAddress] = useState("");
  const [newCustCreditLimit, setNewCustCreditLimit] = useState("20000000");

  // Payment Receivable modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ReceivableInvoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState("Transfer BCA");

  // WhatsApp Reminder modal
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waInvoice, setWaInvoice] = useState<ReceivableInvoice | null>(null);

  // Filtered customers
  const filteredCustomers = customers.filter((c) => {
    const matchesType = typeFilter === "Semua" || c.type === typeFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      (c.company && c.company.toLowerCase().includes(term)) ||
      c.phone.includes(term);
    return matchesType && matchesSearch;
  });

  // Receivables stats
  const totalReceivables = receivables.reduce((sum, r) => sum + r.remainingAmount, 0);
  const dueSoonCount = receivables.filter((r) => r.status === "Segera Jatuh Tempo").length;
  const overdueCount = receivables.filter((r) => r.status === "Terlambat").length;

  // Aging buckets: 0-30, 31-60, >60 days
  const aging0to30 = receivables
    .filter((r) => r.agingDays <= 30)
    .reduce((sum, r) => sum + r.remainingAmount, 0);
  const aging31to60 = receivables
    .filter((r) => r.agingDays > 30 && r.agingDays <= 60)
    .reduce((sum, r) => sum + r.remainingAmount, 0);
  const agingOver60 = receivables
    .filter((r) => r.agingDays > 60)
    .reduce((sum, r) => sum + r.remainingAmount, 0);

  const handleOpenPayment = (inv: ReceivableInvoice) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.remainingAmount); // default bayar penuh
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedInvoice) return;
    payReceivable(selectedInvoice.id, payAmount, payMethod);
    setPaymentModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleOpenWaReminder = (inv: ReceivableInvoice) => {
    setWaInvoice(inv);
    setWaModalOpen(true);
  };

  const getWaReminderText = (inv: ReceivableInvoice) => {
    return `*PENGINGAT JATUH TEMPO FAKTUR - BANGUMART*\n\nKepada Yth. Bapak/Ibu ${inv.customerName},\nKami menginformasikan faktur material konstruksi:\n• No. Faktur: ${inv.invoiceNo}\n• Jatuh Tempo: ${formatTanggal(inv.dueDate)}\n• Sisa Tagihan: *${formatRupiah(inv.remainingAmount)}*\n\nPembayaran dapat ditransfer ke Rek. BCA 018-999-1234 a.n BanguMart.\nTerima kasih atas kerja samanya. 🙏`;
  };

  const handleSaveNewCustomer = () => {
    if (!newCustName.trim()) {
      showToast("Nama Wajib Diisi", "Mohon masukkan nama pelanggan", "error");
      return;
    }

    addCustomer({
      name: newCustName,
      type: newCustType,
      priceTier: newCustType === "Kontraktor" ? "kontraktor" : newCustType === "Umum" ? "eceran" : "grosir",
      phone: newCustPhone || "0812-0000-0000",
      address: newCustAddress || "Gresik",
      creditLimit: parseFloat(newCustCreditLimit) || 0,
      currentReceivable: 0,
      paymentTermDays: newCustType === "Kontraktor" ? 30 : 14,
      loyaltyPoints: 0,
    });
    setIsAddCustomerOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
        <div>
          <h1 className="text-xl font-black text-[#1F2933]">Data Pelanggan & Piutang Dagang</h1>
          <p className="text-xs text-[#6B7280]">
            Kelola kontraktor langganan, toko cabang, tukang, limit kredit, dan kartu piutang
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#F7F7F5] p-1 rounded-lg border border-[#ECECE8] text-xs font-bold">
            <button
              onClick={() => setActiveTab("daftar")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "daftar" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              Daftar Pelanggan ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab("piutang")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "piutang" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              Piutang & Aging ({receivables.length})
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddCustomerOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            + Pelanggan
          </Button>
        </div>
      </div>

      {/* Tab: Daftar Pelanggan */}
      {activeTab === "daftar" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-[#ECECE8] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, perusahaan, atau no. telp..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-[#F7F7F5] border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#6B7280]">Tipe:</span>
              {["Semua", "Kontraktor", "Toko", "Tukang", "Umum"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    typeFilter === t
                      ? "bg-[#1F2933] text-white"
                      : "bg-[#F7F7F5] text-[#6B7280] hover:text-[#1F2933]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCustomers.map((c) => {
              const remainingLimit = Math.max(0, c.creditLimit - c.currentReceivable);

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-xl border border-[#ECECE8] p-4 flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#1F2933] group-hover:text-[#B45309]">
                          {c.name}
                        </h4>
                        {c.company && (
                          <p className="text-[11px] text-[#6B7280] font-medium">{c.company}</p>
                        )}
                      </div>
                      <Badge
                        variant={
                          c.type === "Kontraktor"
                            ? "primary"
                            : c.type === "Toko"
                            ? "info"
                            : c.type === "Tukang"
                            ? "warning"
                            : "secondary"
                        }
                        size="sm"
                      >
                        {c.type}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-[#6B7280] mb-3">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        <span>{c.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        <span className="truncate">{c.address}</span>
                      </div>
                    </div>

                    {/* Credit info */}
                    <div className="p-2.5 rounded-lg bg-[#F7F7F5] text-xs space-y-1 mb-3">
                      <div className="flex justify-between text-[#6B7280]">
                        <span>Tingkat Harga:</span>
                        <span className="font-bold uppercase text-[#1F2933]">{c.priceTier}</span>
                      </div>
                      <div className="flex justify-between text-[#6B7280]">
                        <span>Limit Kredit:</span>
                        <span className="font-semibold text-[#1F2933]">{formatRupiah(c.creditLimit)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-xs pt-1 border-t border-[#ECECE8]">
                        <span>Sisa Piutang:</span>
                        <span className={c.currentReceivable > 0 ? "text-[#E5484D]" : "text-[#16A34A]"}>
                          {formatRupiah(c.currentReceivable)}
                        </span>
                      </div>
                    </div>

                    {/* Contractor Projects preview */}
                    {c.projects && c.projects.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase mb-1">
                          Proyek Aktif ({c.projects.length}):
                        </p>
                        <div className="space-y-1">
                          {c.projects.map((proj) => (
                            <div
                              key={proj.id}
                              className="p-1.5 rounded bg-[#FFF7E0] border border-[#FDEBB8] text-[11px] text-[#B45309] font-medium flex items-center justify-between"
                            >
                              <span className="truncate">{proj.name}</span>
                              <span className="font-bold">{formatRupiah(proj.totalSpent)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#ECECE8] flex items-center justify-between">
                    <span className="text-[11px] text-[#6B7280]">
                      Termin: {c.paymentTermDays} hari
                    </span>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => setSelectedCustomer(c)}
                    >
                      Detail Profil & Proyek
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Piutang & Aging Chart (PRD 6.5c) */}
      {activeTab === "piutang" && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
              <span className="text-xs text-[#6B7280]">Total Piutang Berjalan</span>
              <p className="text-xl sm:text-2xl font-black text-[#1F2933] mt-1">
                {formatRupiah(totalReceivables)}
              </p>
              <p className="text-[11px] text-[#6B7280]">{receivables.length} faktur aktif</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
              <span className="text-xs text-[#6B7280]">Jatuh Tempo Minggu Ini</span>
              <p className="text-xl sm:text-2xl font-black text-[#F59E0B] mt-1">
                {dueSoonCount} Faktur
              </p>
              <p className="text-[11px] text-[#B45309]">Perlu kirim pengingat WA</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
              <span className="text-xs text-[#6B7280]">Sudah Lewat Jatuh Tempo</span>
              <p className="text-xl sm:text-2xl font-black text-[#E5484D] mt-1">
                {overdueCount} Faktur
              </p>
              <p className="text-[11px] text-[#E5484D]">Segera tagih pembayaran</p>
            </div>
          </div>

          {/* Aging Chart Visualization (0-30, 31-60, >60 hari) */}
          <div className="bg-white p-5 rounded-xl border border-[#ECECE8] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#1F2933]">Umur Piutang (Aging Breakdown)</h3>
                <p className="text-xs text-[#6B7280]">Distribusi tagihan berdasarkan rentang hari</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0]">
                <span className="text-xs font-bold text-[#15803D]">0 - 30 Hari (Lancar)</span>
                <p className="text-lg font-black text-[#15803D] mt-1">{formatRupiah(aging0to30)}</p>
                <div className="w-full h-2 bg-white/60 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[#16A34A] w-[70%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A]">
                <span className="text-xs font-bold text-[#B45309]">31 - 60 Hari (Perhatian)</span>
                <p className="text-lg font-black text-[#B45309] mt-1">{formatRupiah(aging31to60)}</p>
                <div className="w-full h-2 bg-white/60 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[#F59E0B] w-[20%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FEE2E2] border border-[#FECACA]">
                <span className="text-xs font-bold text-[#B91C1C]">&gt; 60 Hari (Macet/Kritis)</span>
                <p className="text-lg font-black text-[#B91C1C] mt-1">{formatRupiah(agingOver60)}</p>
                <div className="w-full h-2 bg-white/60 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[#E5484D] w-[10%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Receivables Invoices Table */}
          <div className="bg-white rounded-xl border border-[#ECECE8] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#ECECE8]">
              <h3 className="font-bold text-sm text-[#1F2933]">Faktur Piutang Belum Lunas</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] text-[#6B7280] font-bold text-[11px] uppercase border-b border-[#ECECE8]">
                  <tr>
                    <th className="px-4 py-3">No. Faktur</th>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Tgl Faktur</th>
                    <th className="px-4 py-3">Jatuh Tempo</th>
                    <th className="px-4 py-3 text-right">Total Faktur</th>
                    <th className="px-4 py-3 text-right">Terbayar</th>
                    <th className="px-4 py-3 text-right">Sisa Piutang</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECE8]">
                  {receivables.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#1F2933]">
                        {inv.invoiceNo}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#1F2933]">{inv.customerName}</div>
                        <div className="text-[10px] text-[#6B7280]">{inv.notes}</div>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">{formatTanggal(inv.invoiceDate)}</td>
                      <td className="px-4 py-3 font-semibold text-[#1F2933]">{formatTanggal(inv.dueDate)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatRupiah(inv.totalAmount)}</td>
                      <td className="px-4 py-3 text-right text-[#16A34A] font-semibold">{formatRupiah(inv.paidAmount)}</td>
                      <td className="px-4 py-3 text-right font-black text-[#E5484D]">{formatRupiah(inv.remainingAmount)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={
                            inv.status === "Belum Jatuh Tempo"
                              ? "success"
                              : inv.status === "Segera Jatuh Tempo"
                              ? "warning"
                              : "danger"
                          }
                          size="sm"
                        >
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => handleOpenPayment(inv)}
                          >
                            Terima Bayar
                          </Button>
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => handleOpenWaReminder(inv)}
                            icon={<Share2 className="w-3 h-3 text-[#16A34A]" />}
                          >
                            WA
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail & Projects Modal (PRD 6.5b) */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Profil: ${selectedCustomer.name}`}
          subtitle={`${selectedCustomer.type} • Tier: ${selectedCustomer.priceTier}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F7F7F5]">
              <div>
                <p className="text-[#6B7280]">Perusahaan / Toko:</p>
                <p className="font-bold text-[#1F2933]">{selectedCustomer.company || "-"}</p>
                <p className="text-[#6B7280] mt-1">NPWP: {selectedCustomer.npwp || "Pribadi"}</p>
                <p className="text-[#6B7280]">Telepon: {selectedCustomer.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-[#6B7280]">Limit Kredit:</p>
                <p className="font-black text-sm text-[#1F2933]">{formatRupiah(selectedCustomer.creditLimit)}</p>
                <p className="text-[#E5484D] font-bold mt-1">
                  Piutang Berjalan: {formatRupiah(selectedCustomer.currentReceivable)}
                </p>
                <p className="text-[#6B7280]">Termin: {selectedCustomer.paymentTermDays} hari</p>
              </div>
            </div>

            {/* Project List */}
            {selectedCustomer.projects && selectedCustomer.projects.length > 0 && (
              <div>
                <h4 className="font-bold text-sm text-[#1F2933] mb-2 flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-[#B45309]" />
                  <span>Daftar Proyek Konstruksi Pelanggan</span>
                </h4>
                <div className="space-y-2">
                  {selectedCustomer.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3 rounded-xl border border-[#ECECE8] bg-white space-y-1"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#1F2933]">{proj.name}</span>
                        <span className="text-[11px] font-black text-[#16A34A]">
                          Total Belanja: {formatRupiah(proj.totalSpent)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7280]">{proj.address}</p>
                      {proj.notes && (
                        <p className="text-[10px] text-[#B45309] italic">{proj.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Receive Payment Modal (Cicilan / Penuh) */}
      {selectedInvoice && (
        <Modal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          title="Terima Pembayaran Piutang"
          subtitle={`Faktur: ${selectedInvoice.invoiceNo} • ${selectedInvoice.customerName}`}
          maxWidth="sm"
          footer={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPaymentModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmPayment}>
                Konfirmasi Pelunasan
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F7F7F5] space-y-1">
              <div className="flex justify-between">
                <span>Total Faktur:</span>
                <span className="font-bold">{formatRupiah(selectedInvoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sudah Terbayar:</span>
                <span className="text-[#16A34A]">{formatRupiah(selectedInvoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-1 border-t border-[#ECECE8]">
                <span>Sisa Tagihan:</span>
                <span className="text-[#E5484D]">{formatRupiah(selectedInvoice.remainingAmount)}</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-[#1F2933] block mb-1">
                Nominal Pembayaran Diterima (Rp):
              </label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-base font-black text-[#1F2933] focus:outline-none focus:border-[#F5A800]"
              />
            </div>

            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Metode Penerimaan:</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none"
              >
                <option value="Transfer BCA">Transfer Bank BCA</option>
                <option value="Transfer Mandiri">Transfer Bank Mandiri</option>
                <option value="Tunai / Kasir">Uang Tunai di Kasir</option>
                <option value="Cek / Bilyet Giro">Cek / Bilyet Giro</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* WhatsApp Reminder Preview Modal */}
      {waInvoice && (
        <Modal
          isOpen={waModalOpen}
          onClose={() => setWaModalOpen(false)}
          title="Pratinjau Pengingat Piutang via WhatsApp"
          subtitle={`Kirim ke: ${waInvoice.customerName} (${waInvoice.customerPhone})`}
          maxWidth="md"
          footer={
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(getWaReminderText(waInvoice));
                  showToast("Teks Disalin", "Format pesan WhatsApp siap ditempel", "success");
                }}
                icon={<Copy className="w-3.5 h-3.5" />}
              >
                Salin Teks
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  showToast("WhatsApp Terkirim", "Pesan pengingat dikirim ke pelanggan", "success");
                  setWaModalOpen(false);
                }}
              >
                Kirim via WhatsApp
              </Button>
            </div>
          }
        >
          <div className="p-3.5 rounded-xl bg-[#DCF8C6]/30 border border-[#A7E9AF] text-xs font-mono whitespace-pre-line text-[#1F2933]">
            {getWaReminderText(waInvoice)}
          </div>
        </Modal>
      )}

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        title="Daftarkan Pelanggan Baru"
        subtitle="Atur tipe pelanggan dan plafon kredit"
        maxWidth="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsAddCustomerOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveNewCustomer}>
              Simpan Pelanggan
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[#1F2933] block mb-1">Nama Pelanggan:</label>
            <input
              type="text"
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
              placeholder="Contoh: CV. Berkah Konstruksi"
              className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Tipe Pelanggan:</label>
              <select
                value={newCustType}
                onChange={(e) => setNewCustType(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none"
              >
                <option value="Kontraktor">Kontraktor (Harga Khusus)</option>
                <option value="Toko">Toko / Reseller (Grosir)</option>
                <option value="Tukang">Tukang Bangunan (Grosir)</option>
                <option value="Umum">Umum / Walk-in (Eceran)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#1F2933] block mb-1">No. Handphone / WA:</label>
              <input
                type="text"
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#1F2933] block mb-1">Limit Plafon Kredit (Rp):</label>
            <input
              type="number"
              value={newCustCreditLimit}
              onChange={(e) => setNewCustCreditLimit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#1F2933] block mb-1">Alamat Kantor / Domisili:</label>
            <input
              type="text"
              value={newCustAddress}
              onChange={(e) => setNewCustAddress(e.target.value)}
              placeholder="Alamat lengkap kota"
              className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function PelangganPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#6B7280]">Memuat Pelanggan...</div>}>
        <PelangganContent />
      </Suspense>
    </AppLayout>
  );
}

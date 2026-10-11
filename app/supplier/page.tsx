"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { Supplier } from "@/data/suppliers";
import { PurchaseOrder } from "@/data/purchaseOrders";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Truck,
  Plus,
  Search,
  Phone,
  MapPin,
  CheckCircle2,
  PackageCheck,
  CreditCard,
  FileText,
  Boxes,
} from "lucide-react";

function SupplierContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "daftar";
  const preselectedItem = searchParams.get("item") || "";

  const {
    suppliers,
    purchaseOrders,
    products,
    receivePurchaseOrder,
    addPurchaseOrder,
    paySupplierDebt,
    addSupplier,
    showToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"daftar" | "pembelian" | "hutang">(
    initialTab === "pembelian" ? "pembelian" : initialTab === "hutang" ? "hutang" : "daftar"
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Receiving Goods Modal
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [receivingPo, setReceivingPo] = useState<PurchaseOrder | null>(null);
  const [receivedMap, setReceivedMap] = useState<Record<string, number>>({});

  // New PO Modal
  const [isPoModalOpen, setIsPoModalOpen] = useState(!!preselectedItem);
  const [poSupplierId, setPoSupplierId] = useState(suppliers[0]?.id || "");
  const [poProductId, setPoProductId] = useState(preselectedItem || products[0]?.id || "");
  const [poQty, setPoQty] = useState(50);
  const [poPrice, setPoPrice] = useState(60000);

  // Pay Debt Modal
  const [payDebtOpen, setPayDebtOpen] = useState(false);
  const [debtSupplier, setDebtSupplier] = useState<Supplier | null>(null);
  const [debtPayAmount, setDebtPayAmount] = useState(0);

  // Detail Supplier Modal
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const totalDebt = suppliers.reduce((sum, s) => sum + s.totalDebt, 0);

  const handleOpenReceive = (po: PurchaseOrder) => {
    setReceivingPo(po);
    const initialMap: Record<string, number> = {};
    po.items.forEach((item) => {
      initialMap[item.productId] = Math.max(0, item.qty - (item.receivedQty || 0));
    });
    setReceivedMap(initialMap);
    setReceiveModalOpen(true);
  };

  const handleConfirmReceive = () => {
    if (!receivingPo) return;
    receivePurchaseOrder(receivingPo.id, receivedMap);
    setReceiveModalOpen(false);
  };

  const handleCreatePo = () => {
    const sup = suppliers.find((s) => s.id === poSupplierId);
    const prod = products.find((p) => p.id === poProductId);
    if (!sup || !prod) return;

    const subtotal = poQty * poPrice;
    addPurchaseOrder({
      date: new Date().toISOString().slice(0, 10),
      supplierId: sup.id,
      supplierName: sup.name,
      supplierPhone: sup.phone,
      items: [
        {
          productId: prod.id,
          name: prod.name,
          unit: prod.baseUnit,
          qty: poQty,
          purchasePrice: poPrice,
          subtotal,
          receivedQty: 0,
        },
      ],
      subtotal,
      tax: 0,
      total: subtotal,
      status: "Dipesan",
      expectedDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      isPaid: false,
      notes: "Pesanan restock barang otomatis",
    });

    setIsPoModalOpen(false);
    setActiveTab("pembelian");
  };

  const handleConfirmPayDebt = () => {
    if (!debtSupplier) return;
    paySupplierDebt(debtSupplier.id, debtPayAmount);
    setPayDebtOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
        <div>
          <h1 className="text-xl font-black text-[#1F2933]">Manajemen Supplier & Pembelian (PO)</h1>
          <p className="text-xs text-[#6B7280]">
            Pemesanan restock material, penerimaan fisik gudang, dan hutang dagang distributor
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
              Daftar Supplier ({suppliers.length})
            </button>
            <button
              onClick={() => setActiveTab("pembelian")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "pembelian" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              Purchase Orders ({purchaseOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("hutang")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "hutang" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              Hutang Dagang
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPoModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            + Buat PO
          </Button>
        </div>
      </div>

      {/* Tab: Daftar Supplier */}
      {activeTab === "daftar" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className="bg-white rounded-xl border border-[#ECECE8] p-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#1F2933]">{sup.name}</h4>
                    <p className="text-[11px] text-[#6B7280] font-medium">{sup.contactPerson}</p>
                  </div>
                  <Badge variant="primary" size="sm">
                    {sup.category}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-[#6B7280] mb-3">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span>{sup.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="truncate">{sup.address}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F7F7F5] space-y-1 text-xs mb-3">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Termin Bayar:</span>
                    <span className="font-bold text-[#1F2933]">
                      {sup.paymentTermDays === 0 ? "Tunai / Cash" : `${sup.paymentTermDays} Hari`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-[#ECECE8]">
                    <span>Total Hutang:</span>
                    <span className={sup.totalDebt > 0 ? "text-[#E5484D]" : "text-[#16A34A]"}>
                      {formatRupiah(sup.totalDebt)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase mb-1">
                    Produk Yang Disuplai:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {sup.suppliedProducts.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#F7F7F5] text-[#3F4650] px-2 py-0.5 rounded border border-[#ECECE8]"
                      >
                        {item}
                      </span>
                    ))}
                    {sup.suppliedProducts.length > 3 && (
                      <span className="text-[10px] text-[#6B7280] font-bold">
                        +{sup.suppliedProducts.length - 3} lagi
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#ECECE8] flex gap-2">
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => setSelectedSupplier(sup)}
                  className="flex-1"
                >
                  Detail
                </Button>
                {sup.totalDebt > 0 && (
                  <Button
                    variant="soft"
                    size="xs"
                    onClick={() => {
                      setDebtSupplier(sup);
                      setDebtPayAmount(sup.totalDebt);
                      setPayDebtOpen(true);
                    }}
                    className="flex-1 text-[#B45309]"
                  >
                    Bayar Hutang
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Purchase Orders (PO) */}
      {activeTab === "pembelian" && (
        <div className="bg-white rounded-xl border border-[#ECECE8] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#ECECE8] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#1F2933]">Daftar Purchase Orders (PO)</h3>
              <p className="text-xs text-[#6B7280]">
                Klik &ldquo;Penerimaan Barang&rdquo; saat truk distributor tiba untuk menambah stok lokal
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F5] text-[#6B7280] font-bold text-[11px] uppercase border-b border-[#ECECE8]">
                <tr>
                  <th className="px-4 py-3">No. PO</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Material Dipesan</th>
                  <th className="px-4 py-3 text-right">Total Nilai</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Aksi Gudang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECE8]">
                {purchaseOrders.map((po) => {
                  const statusColors: Record<string, any> = {
                    Draft: "secondary",
                    Dipesan: "warning",
                    "Diterima Sebagian": "info",
                    Diterima: "success",
                    Dibatalkan: "danger",
                  };

                  return (
                    <tr key={po.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#1F2933]">{po.poNo}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{formatTanggal(po.date)}</td>
                      <td className="px-4 py-3 font-semibold text-[#1F2933]">{po.supplierName}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-[#1F2933]">
                          {po.items.map((i) => `${i.qty} ${i.unit} ${i.name}`).join(", ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-black text-[#1F2933]">
                        {formatRupiah(po.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={statusColors[po.status]} size="sm">
                          {po.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {po.status !== "Diterima" && po.status !== "Dibatalkan" ? (
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => handleOpenReceive(po)}
                            icon={<PackageCheck className="w-3.5 h-3.5" />}
                          >
                            Terima Barang
                          </Button>
                        ) : (
                          <span className="text-[11px] text-[#16A34A] font-bold">
                            ✓ Stok Bertambah
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Hutang Dagang Supplier (PRD 6.6c) */}
      {activeTab === "hutang" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-[#6B7280]">Total Hutang Dagang ke Supplier</span>
              <p className="text-2xl font-black text-[#E5484D] mt-1">{formatRupiah(totalDebt)}</p>
            </div>
            <p className="text-xs text-[#6B7280] max-w-xs text-right">
              Kewajiban pelunasan faktur pembelian material kepada para distributor
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#ECECE8] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F5] text-[#6B7280] font-bold text-[11px] uppercase border-b border-[#ECECE8]">
                <tr>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Termin</th>
                  <th className="px-4 py-3 text-right">Sisa Hutang</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECE8]">
                {suppliers
                  .filter((s) => s.totalDebt > 0)
                  .map((sup) => (
                    <tr key={sup.id} className="hover:bg-[#F7F7F5]/50">
                      <td className="px-4 py-3 font-bold text-[#1F2933]">{sup.name}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{sup.category}</td>
                      <td className="px-4 py-3">{sup.paymentTermDays} Hari</td>
                      <td className="px-4 py-3 text-right font-black text-[#E5484D]">
                        {formatRupiah(sup.totalDebt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => {
                            setDebtSupplier(sup);
                            setDebtPayAmount(sup.totalDebt);
                            setPayDebtOpen(true);
                          }}
                        >
                          Bayar Hutang
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Penerimaan Barang Modal (PRD 6.6b: stok bertambah di state lokal) */}
      {receivingPo && (
        <Modal
          isOpen={receiveModalOpen}
          onClose={() => setReceiveModalOpen(false)}
          title={`Penerimaan Barang Fisik: ${receivingPo.poNo}`}
          subtitle={`Supplier: ${receivingPo.supplierName}`}
          maxWidth="md"
          footer={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setReceiveModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmReceive}>
                Konfirmasi Masuk Gudang (+ Stok)
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-[11px] text-[#6B7280] bg-[#FFF7E0] p-2.5 rounded-lg border border-[#FDEBB8]">
              Periksa kuantitas fisik yang diturunkan dari armada supplier. Jumlah yang diterima akan langsung menambah stok di sistem.
            </p>

            <div className="border border-[#ECECE8] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] border-b border-[#ECECE8] text-[#6B7280]">
                  <tr>
                    <th className="p-2">Material</th>
                    <th className="p-2 text-right">Dipesan</th>
                    <th className="p-2 text-center">Diterima Sekarang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECE8]">
                  {receivingPo.items.map((item) => (
                    <tr key={item.productId}>
                      <td className="p-2 font-bold">{item.name}</td>
                      <td className="p-2 text-right">
                        {item.qty} {item.unit}
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          value={receivedMap[item.productId] ?? item.qty}
                          onChange={(e) =>
                            setReceivedMap((prev) => ({
                              ...prev,
                              [item.productId]: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-20 text-center font-bold px-2 py-1 rounded border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {/* Create PO Modal */}
      <Modal
        isOpen={isPoModalOpen}
        onClose={() => setIsPoModalOpen(false)}
        title="Buat Purchase Order (PO) Baru"
        subtitle="Pemesanan material ke distributor resmi"
        maxWidth="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsPoModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreatePo}>
              Terbitkan PO
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[#1F2933] block mb-1">Pilih Supplier:</label>
            <select
              value={poSupplierId}
              onChange={(e) => setPoSupplierId(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-[#1F2933] block mb-1">Pilih Produk:</label>
            <select
              value={poProductId}
              onChange={(e) => {
                setPoProductId(e.target.value);
                const found = products.find((p) => p.id === e.target.value);
                if (found) setPoPrice(found.purchasePrice);
              }}
              className="w-full p-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stok saat ini: {p.stock} {p.baseUnit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Jumlah Pesan:</label>
              <input
                type="number"
                value={poQty}
                onChange={(e) => setPoQty(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-lg border border-[#ECECE8] text-xs font-bold focus:outline-none focus:border-[#F5A800]"
              />
            </div>
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Harga Beli Modal (Rp):</label>
              <input
                type="number"
                value={poPrice}
                onChange={(e) => setPoPrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-lg border border-[#ECECE8] text-xs font-bold focus:outline-none focus:border-[#F5A800]"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F7F7F5] flex justify-between font-bold">
            <span>Estimasi Total PO:</span>
            <span className="text-[#1F2933]">{formatRupiah(poQty * poPrice)}</span>
          </div>
        </div>
      </Modal>

      {/* Pay Debt Modal */}
      {debtSupplier && (
        <Modal
          isOpen={payDebtOpen}
          onClose={() => setPayDebtOpen(false)}
          title="Pembayaran Hutang Supplier"
          subtitle={`Supplier: ${debtSupplier.name}`}
          maxWidth="sm"
          footer={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPayDebtOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmPayDebt}>
                Konfirmasi Bayar
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#F7F7F5] rounded-xl flex justify-between font-bold">
              <span>Sisa Hutang:</span>
              <span className="text-[#E5484D]">{formatRupiah(debtSupplier.totalDebt)}</span>
            </div>
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Nominal Pembayaran (Rp):</label>
              <input
                type="number"
                value={debtPayAmount}
                onChange={(e) => setDebtPayAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-lg border border-[#ECECE8] text-base font-black focus:outline-none focus:border-[#F5A800]"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function SupplierPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#6B7280]">Memuat Supplier...</div>}>
        <SupplierContent />
      </Suspense>
    </AppLayout>
  );
}

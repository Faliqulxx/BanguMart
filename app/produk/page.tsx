"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { formatRupiah, formatAngka } from "@/lib/format";
import { Product, CATEGORIES } from "@/data/products";
import { STANDARD_UNITS } from "@/lib/units";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Package,
  Layers,
  Scale,
  MapPin,
  CheckCircle,
} from "lucide-react";

function ProdukContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const { products, addProduct, updateProduct, showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<"daftar" | "kategori" | "satuan">("daftar");
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori");
  const [stockFilter, setStockFilter] = useState<"semua" | "aman" | "menipis" | "habis">("semua");

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formBarcode, setFormBarcode] = useState("");
  const [formCategory, setFormCategory] = useState("Semen & Perekat");
  const [formBrand, setFormBrand] = useState("");
  const [formBaseUnit, setFormBaseUnit] = useState("sak");
  const [formEceran, setFormEceran] = useState("68000");
  const [formGrosir, setFormGrosir] = useState("66000");
  const [formKontraktor, setFormKontraktor] = useState("64500");
  const [formPurchasePrice, setFormPurchasePrice] = useState("60000");
  const [formStock, setFormStock] = useState("20");
  const [formMinStock, setFormMinStock] = useState("10");
  const [formLocation, setFormLocation] = useState("Gudang A");
  const [formIsBulk, setFormIsBulk] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === "Semua Kategori" || p.category === categoryFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.code.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term);

    let matchesStock = true;
    if (stockFilter === "habis") matchesStock = p.stock <= 0;
    else if (stockFilter === "menipis") matchesStock = p.stock > 0 && p.stock <= p.minStock;
    else if (stockFilter === "aman") matchesStock = p.stock > p.minStock;

    return matchesCat && matchesSearch && matchesStock;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormName("");
    setFormCode(`MAT-${String(products.length + 10).padStart(3, "0")}`);
    setFormBarcode(`899${Date.now().toString().slice(-9)}`);
    setFormCategory("Semen & Perekat");
    setFormBrand("");
    setFormBaseUnit("sak");
    setFormEceran("50000");
    setFormGrosir("48000");
    setFormKontraktor("46000");
    setFormPurchasePrice("40000");
    setFormStock("25");
    setFormMinStock("10");
    setFormLocation("Gudang A - Rak 01");
    setFormIsBulk(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormCode(p.code);
    setFormBarcode(p.barcode);
    setFormCategory(p.category);
    setFormBrand(p.brand);
    setFormBaseUnit(p.baseUnit);
    setFormEceran(String(p.prices.eceran));
    setFormGrosir(String(p.prices.grosir));
    setFormKontraktor(String(p.prices.kontraktor));
    setFormPurchasePrice(String(p.purchasePrice));
    setFormStock(String(p.stock));
    setFormMinStock(String(p.minStock));
    setFormLocation(p.location);
    setFormIsBulk(!!p.isBulk);
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formName.trim()) {
      showToast("Nama Wajib Diisi", "Mohon masukkan nama produk", "error");
      return;
    }

    const payload = {
      code: formCode,
      barcode: formBarcode,
      name: formName,
      category: formCategory,
      brand: formBrand || "Lokal",
      baseUnit: formBaseUnit,
      units: [{ unit: formBaseUnit, factor: 1, isBase: true }],
      prices: {
        eceran: parseFloat(formEceran) || 0,
        grosir: parseFloat(formGrosir) || 0,
        kontraktor: parseFloat(formKontraktor) || 0,
        minGrosirQty: 5,
      },
      purchasePrice: parseFloat(formPurchasePrice) || 0,
      stock: parseFloat(formStock) || 0,
      minStock: parseFloat(formMinStock) || 0,
      location: formLocation,
      isBulk: formIsBulk,
      imageIcon: "🧱",
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs">
        <div>
          <h1 className="text-xl font-black text-[#1F2933]">Manajemen Produk Toko Bangunan</h1>
          <p className="text-xs text-[#6B7280]">
            Katalog barang, multi-satuan, harga bertingkat (eceran, grosir, kontraktor)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtabs */}
          <div className="flex bg-[#F7F7F5] p-1 rounded-lg border border-[#ECECE8] text-xs font-bold">
            <button
              onClick={() => setActiveTab("daftar")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "daftar" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              Daftar Produk
            </button>
            <button
              onClick={() => setActiveTab("kategori")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "kategori" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              Kategori
            </button>
            <button
              onClick={() => setActiveTab("satuan")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "satuan" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              Satuan & Harga
            </button>
          </div>

          <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            + Tambah Produk
          </Button>
        </div>
      </div>

      {activeTab === "daftar" && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-xl border border-[#ECECE8] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari produk, SKU, atau merk..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-[#F7F7F5] border border-[#ECECE8] focus:outline-none focus:border-[#F5A800]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg bg-[#F7F7F5] border border-[#ECECE8] text-[#1F2933] focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 text-xs">
                {(["semua", "aman", "menipis", "habis"] as const).map((sf) => (
                  <button
                    key={sf}
                    onClick={() => setStockFilter(sf)}
                    className={`px-2.5 py-1.5 rounded-lg font-bold capitalize transition-colors ${
                      stockFilter === sf
                        ? "bg-[#1F2933] text-white"
                        : "bg-[#F7F7F5] text-[#6B7280] hover:text-[#1F2933]"
                    }`}
                  >
                    {sf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table View (Desktop) / Cards View (Mobile) */}
          <div className="bg-white rounded-xl border border-[#ECECE8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] text-[#6B7280] font-bold text-[11px] uppercase border-b border-[#ECECE8]">
                  <tr>
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Satuan</th>
                    <th className="px-4 py-3 text-right">Eceran</th>
                    <th className="px-4 py-3 text-right">Grosir</th>
                    <th className="px-4 py-3 text-right">Kontraktor</th>
                    <th className="px-4 py-3 text-center">Stok</th>
                    <th className="px-4 py-3">Lokasi</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECECE8]">
                  {filteredProducts.map((p) => {
                    const isLow = p.stock <= p.minStock && p.stock > 0;
                    const isOut = p.stock <= 0;

                    return (
                      <tr key={p.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{p.imageIcon || "📦"}</span>
                            <div>
                              <p className="font-extrabold text-[#1F2933]">{p.name}</p>
                              <p className="text-[10px] text-[#6B7280]">
                                SKU: {p.code} • {p.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#3F4650]">{p.category}</td>
                        <td className="px-4 py-3 font-semibold text-[#1F2933]">
                          {p.baseUnit}
                          {p.units.length > 1 && (
                            <span className="text-[10px] text-[#B45309] block">
                              +{p.units.length - 1} opsi satuan
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-black text-[#1F2933]">
                          {formatRupiah(p.prices.eceran)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[#3F4650]">
                          {formatRupiah(p.prices.grosir)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[#B45309]">
                          {formatRupiah(p.prices.kontraktor)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant={isOut ? "danger" : isLow ? "warning" : "success"}
                            size="sm"
                          >
                            {p.stock} {p.baseUnit}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-[#6B7280]">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                            <span>{p.location}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => handleOpenEdit(p)}
                            icon={<Edit className="w-3.5 h-3.5" />}
                          >
                            Ubah
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Kategori Tab */}
      {activeTab === "kategori" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {CATEGORIES.filter((c) => c !== "Semua Kategori").map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const totalStock = products
              .filter((p) => p.category === cat)
              .reduce((sum, p) => sum + p.stock, 0);

            return (
              <div
                key={cat}
                className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="font-extrabold text-sm text-[#1F2933]">{cat}</h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {count} jenis produk • Total stok {formatAngka(totalStock)} unit
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FFF7E0] text-[#B45309] font-black text-sm flex items-center justify-center">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Satuan & Harga Tab */}
      {activeTab === "satuan" && (
        <div className="bg-white p-5 rounded-xl border border-[#ECECE8] space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#1F2933]">Daftar Satuan Konstruksi Terdaftar</h3>
            <p className="text-xs text-[#6B7280]">
              Satuan standar yang dipakai untuk jual-beli toko bangunan
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {STANDARD_UNITS.map((u) => (
              <div key={u.id} className="p-3 rounded-lg border border-[#ECECE8] bg-[#F7F7F5]">
                <span className="font-mono text-xs font-bold text-[#B45309] uppercase">{u.id}</span>
                <h5 className="font-bold text-xs text-[#1F2933] mt-0.5">{u.name}</h5>
                <p className="text-[11px] text-[#6B7280]">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Ubah Data Produk" : "Tambah Produk Baru"}
        subtitle="Konfigurasi harga bertingkat dan konversi satuan"
        maxWidth="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveProduct}>
              Simpan Produk
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Nama Produk:</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contoh: Semen Gresik 40kg"
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
              />
            </div>
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Merek / Brand:</label>
              <input
                type="text"
                value={formBrand}
                onChange={(e) => setFormBrand(e.target.value)}
                placeholder="Contoh: Semen Indonesia"
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none focus:border-[#F5A800]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Kode SKU:</label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Kategori:</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-2 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none"
              >
                {CATEGORIES.filter((c) => c !== "Semua Kategori").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Satuan Dasar:</label>
              <select
                value={formBaseUnit}
                onChange={(e) => setFormBaseUnit(e.target.value)}
                className="w-full px-2 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none"
              >
                {STANDARD_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Tiers (PRD 6.3a) */}
          <div className="p-3 rounded-xl bg-[#FFF7E0] border border-[#FDEBB8] space-y-2">
            <h5 className="font-extrabold text-xs text-[#B45309]">
              Harga Bertingkat (Tiered Pricing)
            </h5>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-bold text-[#1F2933] block mb-0.5">Eceran (Rp):</label>
                <input
                  type="number"
                  value={formEceran}
                  onChange={(e) => setFormEceran(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-white border border-[#ECECE8] font-bold text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#1F2933] block mb-0.5">Grosir (Rp):</label>
                <input
                  type="number"
                  value={formGrosir}
                  onChange={(e) => setFormGrosir(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-white border border-[#ECECE8] font-bold text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#1F2933] block mb-0.5">Kontraktor (Rp):</label>
                <input
                  type="number"
                  value={formKontraktor}
                  onChange={(e) => setFormKontraktor(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-white border border-[#ECECE8] font-bold text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Stok Awal:</label>
              <input
                type="number"
                value={formStock}
                onChange={(e) => setFormStock(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Batas Min Stok:</label>
              <input
                type="number"
                value={formMinStock}
                onChange={(e) => setFormMinStock(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-[#1F2933] block mb-1">Lokasi Rak:</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#ECECE8] text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function ProdukPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#6B7280]">Memuat Produk...</div>}>
        <ProdukContent />
      </Suspense>
    </AppLayout>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Calculator,
  Grid,
  Paintbrush,
  Layers,
  Plus,
  ArrowRight,
  Info,
  Package,
} from "lucide-react";

export default function KalkulatorPage() {
  const router = useRouter();
  const { products, addToCart, showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<"keramik" | "cat" | "cor" | "bundel">("keramik");

  // Keramik State
  const [panjangRuangan, setPanjangRuangan] = useState(4);
  const [lebarRuangan, setLebarRuangan] = useState(3.5);
  const [ukuranKeramik, setUkuranKeramik] = useState<"40x40" | "60x60" | "30x30">("40x40");
  const [persenCadangan, setPersenCadangan] = useState(10); // 10% waste

  // Cat State
  const [luasDinding, setLuasDinding] = useState(45);
  const [jumlahLapis, setJumlahLapis] = useState(2);
  const [dayaSebar, setDayaSebar] = useState(10); // 10 m2 / kg

  // Cor State
  const [panjangCor, setPanjangCor] = useState(10);
  const [lebarCor, setLebarCor] = useState(0.2);
  const [tinggiCor, setTinggiCor] = useState(0.3); // sloof 20x30 cm

  // --- Perhitungan Keramik ---
  const luasLantai = panjangRuangan * lebarRuangan;
  const luasDenganCadangan = luasLantai * (1 + persenCadangan / 100);
  // 40x40 1 dus = 0.96 m2; 60x60 1 dus = 1.44 m2; 30x30 1 dus = 1.0 m2
  const m2PerDus = ukuranKeramik === "40x40" ? 0.96 : ukuranKeramik === "60x60" ? 1.44 : 1.0;
  const butuhDusKeramik = Math.ceil(luasDenganCadangan / m2PerDus);
  const butuhNatSak = Math.ceil(luasLantai / 10); // 1 kg nat untuk ~10 m2

  // --- Perhitungan Cat ---
  const totalLuasCat = luasDinding * jumlahLapis;
  const totalKgCat = Math.ceil(totalLuasCat / dayaSebar);
  const butuhKaleng5kg = Math.ceil(totalKgCat / 5);

  // --- Perhitungan Cor ---
  const volumeCorM3 = panjangCor * lebarCor * tinggiCor;
  // Rasio praktis beton mutu K-200 / 1:2:3 per m3: ~7 sak semen (50kg), 0.54 m3 pasir, 0.82 m3 split
  const butuhSemenSak = Math.ceil(volumeCorM3 * 7);
  const butuhPasirM3 = Number((volumeCorM3 * 0.54).toFixed(1));
  const butuhSplitM3 = Number((volumeCorM3 * 0.82).toFixed(1));

  // Handler masukkan ke kasir
  const handleAddKeramikToCart = () => {
    const keramikProd =
      ukuranKeramik === "60x60"
        ? products.find((p) => p.code === "GRN-060") || products[5]
        : products.find((p) => p.code === "KRM-040") || products[5];
    const natProd = products.find((p) => p.code === "NAT-001");

    if (keramikProd) addToCart(keramikProd, "dus", butuhDusKeramik);
    if (natProd) addToCart(natProd, "sak", butuhNatSak);

    showToast("Hasil Kalkulator Dimasukkan", "Keramik & Nat berhasil ditambahkan ke keranjang POS", "success");
    router.push("/transaksi");
  };

  const handleAddCatToCart = () => {
    const catProd = products.find((p) => p.code === "CAT-005") || products[3];
    const kuasProd = products.find((p) => p.code === "PRK-003");

    if (catProd) addToCart(catProd, "kaleng", butuhKaleng5kg);
    if (kuasProd) addToCart(kuasProd, "pcs", 2);

    showToast("Cat Dimasukkan ke Keranjang", `${butuhKaleng5kg} kaleng cat ditambahkan ke kasir`, "success");
    router.push("/transaksi");
  };

  const handleAddCorToCart = () => {
    const semenProd = products.find((p) => p.code === "SMN-001") || products[0];
    const pasirProd = products.find((p) => p.code === "PSR-001") || products[7];
    const splitProd = products.find((p) => p.code === "SPL-001") || products[33];

    if (semenProd) addToCart(semenProd, "sak", butuhSemenSak);
    if (pasirProd) addToCart(pasirProd, "m3", Math.max(1, Math.round(butuhPasirM3)));
    if (splitProd) addToCart(splitProd, "m3", Math.max(1, Math.round(butuhSplitM3)));

    showToast("Material Cor Dimasukkan", "Semen, pasir & split berhasil masuk kasir", "success");
    router.push("/transaksi");
  };

  const handleAddBundle = (bundleName: string, items: { code: string; unit: string; qty: number }[]) => {
    items.forEach((it) => {
      const p = products.find((prod) => prod.code === it.code);
      if (p) addToCart(p, it.unit, it.qty);
    });
    showToast("Paket Bundel Ditambahkan", `${bundleName} siap ditransaksikan`, "success");
    router.push("/transaksi");
  };

  return (
    <AppLayout>
      <div className="space-y-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECECE8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFF7E0] text-[#B45309] flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-black text-[#1F2933]">Kalkulator Kebutuhan Material</h1>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Bantu hitung kebutuhan semen, keramik, cat, dan cor pelanggan, lalu masukkan langsung ke kasir
            </p>
          </div>

          <div className="flex bg-[#F7F7F5] p-1 rounded-xl border border-[#ECECE8] text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab("keramik")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "keramik" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Keramik & Lantai</span>
            </button>
            <button
              onClick={() => setActiveTab("cat")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "cat" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>Cat Tembok</span>
            </button>
            <button
              onClick={() => setActiveTab("cor")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "cor" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cor & Pondasi</span>
            </button>
            <button
              onClick={() => setActiveTab("bundel")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "bundel" ? "bg-white text-[#1F2933] shadow-xs" : "text-[#6B7280]"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Paket Hemat</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Keramik & Lantai */}
        {activeTab === "keramik" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Input Form */}
            <div className="md:col-span-6 bg-white p-5 rounded-2xl border border-[#ECECE8] space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-[#1F2933]">Ukuran Ruangan & Pilihan Keramik</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1F2933] block mb-1">
                    Panjang Ruangan (meter):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={panjangRuangan}
                    onChange={(e) => setPanjangRuangan(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-[#ECECE8] text-sm font-bold focus:outline-none focus:border-[#F5A800]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1F2933] block mb-1">
                    Lebar Ruangan (meter):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={lebarRuangan}
                    onChange={(e) => setLebarRuangan(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-[#ECECE8] text-sm font-bold focus:outline-none focus:border-[#F5A800]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F2933] block mb-1">
                  Ukuran Keramik / Granit:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "40x40", label: "40x40 cm (0.96 m²/dus)" },
                    { id: "60x60", label: "60x60 cm (1.44 m²/dus)" },
                    { id: "30x30", label: "30x30 cm (1.00 m²/dus)" },
                  ].map((uk) => (
                    <button
                      key={uk.id}
                      type="button"
                      onClick={() => setUkuranKeramik(uk.id as any)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                        ukuranKeramik === uk.id
                          ? "bg-[#1F2933] text-white border-[#1F2933]"
                          : "bg-[#F7F7F5] border-[#ECECE8] text-[#1F2933] hover:bg-white"
                      }`}
                    >
                      {uk.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1F2933] block mb-1">
                  Cadangan Potongan & Sudut (% Waste):
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPersenCadangan(pct)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        persenCadangan === pct
                          ? "bg-[#F5A800] text-[#1F2933] border-[#DB9500]"
                          : "bg-white border-[#ECECE8] text-[#6B7280]"
                      }`}
                    >
                      +{pct}% (Rekomendasi {pct === 10 ? "Standar" : ""})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Calculation Result */}
            <div className="md:col-span-6 bg-[#FFF7E0] border border-[#FDEBB8] p-5 rounded-2xl flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider">
                  Hasil Estimasi Kebutuhan
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-[#FDEBB8]">
                    <span className="text-[11px] text-[#6B7280]">Luas Area Bersih:</span>
                    <p className="text-xl font-black text-[#1F2933]">{luasLantai.toFixed(2)} m²</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#FDEBB8]">
                    <span className="text-[11px] text-[#6B7280]">Luas + Cadangan ({persenCadangan}%):</span>
                    <p className="text-xl font-black text-[#1F2933]">{luasDenganCadangan.toFixed(2)} m²</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#FDEBB8] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#1F2933]">
                        Jumlah Dus Keramik Dibutuhkan:
                      </h4>
                      <p className="text-xs text-[#6B7280]">Ukuran {ukuranKeramik} cm</p>
                    </div>
                    <span className="text-2xl font-black text-[#B45309]">
                      {butuhDusKeramik} Dus
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#ECECE8] flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">Rekomendasi Semen Nat (AM 53 1kg):</span>
                    <span className="font-bold text-[#1F2933]">{butuhNatSak} Sak (kg)</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>*Hitungan ini adalah perkiraan standar toko untuk meminimalkan kekurangan keramik.</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleAddKeramikToCart}
                className="mt-4 w-full font-bold shadow-md"
                icon={<Plus className="w-4 h-4" />}
              >
                + Masukkan {butuhDusKeramik} Dus ke Kasir (POS)
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Cat Tembok */}
        {activeTab === "cat" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 bg-white p-5 rounded-2xl border border-[#ECECE8] space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-[#1F2933]">Luas Dinding & Lapisan Pengecatan</h3>

              <div>
                <label className="text-xs font-bold text-[#1F2933] block mb-1">
                  Total Luas Bidang Dinding (m²):
                </label>
                <input
                  type="number"
                  value={luasDinding}
                  onChange={(e) => setLuasDinding(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg border border-[#ECECE8] text-base font-bold focus:outline-none focus:border-[#F5A800]"
                />
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Contoh: Ruangan 3x4m tinggi 3m = keliling 14m × 3m = 42 m²
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1F2933] block mb-1">
                    Jumlah Lapis Pengecatan:
                  </label>
                  <select
                    value={jumlahLapis}
                    onChange={(e) => setJumlahLapis(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded-lg border border-[#ECECE8] text-xs font-bold"
                  >
                    <option value={1}>1 Lapis (Finishing Ulang)</option>
                    <option value={2}>2 Lapis (Standar Dinding Baru)</option>
                    <option value={3}>3 Lapis (Dinding Kasar/Gelap)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1F2933] block mb-1">
                    Daya Sebar Rata-Rata:
                  </label>
                  <input
                    type="number"
                    value={dayaSebar}
                    onChange={(e) => setDayaSebar(parseFloat(e.target.value) || 10)}
                    className="w-full p-2 rounded-lg border border-[#ECECE8] text-xs font-bold"
                  />
                  <span className="text-[10px] text-[#6B7280]">m² / kg</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 bg-[#FFF7E0] border border-[#FDEBB8] p-5 rounded-2xl flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider">
                  Hasil Estimasi Cat
                </span>

                <div className="bg-white p-4 rounded-xl border border-[#FDEBB8] space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-[#6B7280]">Total Luas Cat ({jumlahLapis}x lapis):</span>
                    <span className="text-base font-bold text-[#1F2933]">{totalLuasCat} m²</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#ECECE8]">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#1F2933]">Kebutuhan Cat Tembok:</h4>
                      <p className="text-xs text-[#6B7280]">Kaleng ukuran standar 5kg</p>
                    </div>
                    <span className="text-2xl font-black text-[#B45309]">
                      {butuhKaleng5kg} Kaleng (5kg)
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#6B7280]">
                  * Termasuk bonus rekomendasi kuas rol & kuas cat sudut 3 inch.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleAddCatToCart}
                className="mt-4 w-full font-bold shadow-md"
                icon={<Plus className="w-4 h-4" />}
              >
                + Masukkan {butuhKaleng5kg} Kaleng Cat ke Kasir
              </Button>
            </div>
          </div>
        )}

        {/* Tab 3: Cor & Pondasi */}
        {activeTab === "cor" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 bg-white p-5 rounded-2xl border border-[#ECECE8] space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-[#1F2933]">Dimensi Pengecoran / Sloof / Kolom</h3>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1F2933] block mb-1">Panjang (m):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={panjangCor}
                    onChange={(e) => setPanjangCor(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-[#ECECE8] text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1F2933] block mb-1">Lebar (m):</label>
                  <input
                    type="number"
                    step="0.05"
                    value={lebarCor}
                    onChange={(e) => setLebarCor(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-[#ECECE8] text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1F2933] block mb-1">Tinggi/Tebal (m):</label>
                  <input
                    type="number"
                    step="0.05"
                    value={tinggiCor}
                    onChange={(e) => setTinggiCor(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border border-[#ECECE8] text-sm font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F7F5] text-xs">
                <span className="text-[#6B7280]">Total Volume Beton:</span>
                <p className="text-lg font-black text-[#1F2933]">{volumeCorM3.toFixed(2)} m³</p>
                <p className="text-[10px] text-[#6B7280] mt-0.5">Menggunakan rasio SNI campuran beton 1:2:3</p>
              </div>
            </div>

            <div className="md:col-span-6 bg-[#FFF7E0] border border-[#FDEBB8] p-5 rounded-2xl flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider">
                  Rincian Material Cor
                </span>

                <div className="bg-white p-4 rounded-xl border border-[#FDEBB8] space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#1F2933]">Semen Tiga Roda 50kg:</span>
                      <p className="text-[10px] text-[#6B7280]">Kebutuhan pengikat</p>
                    </div>
                    <span className="text-lg font-black text-[#1F2933]">{butuhSemenSak} Sak</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#ECECE8]">
                    <div>
                      <span className="font-bold text-[#1F2933]">Pasir Pasang Merapi:</span>
                      <p className="text-[10px] text-[#6B7280]">Agregat halus</p>
                    </div>
                    <span className="text-lg font-black text-[#1F2933]">{butuhPasirM3} m³</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#ECECE8]">
                    <div>
                      <span className="font-bold text-[#1F2933]">Batu Split Cor 1x2:</span>
                      <p className="text-[10px] text-[#6B7280]">Agregat kasar</p>
                    </div>
                    <span className="text-lg font-black text-[#1F2933]">{butuhSplitM3} m³</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleAddCorToCart}
                className="mt-4 w-full font-bold shadow-md"
                icon={<Plus className="w-4 h-4" />}
              >
                + Masukkan Paket Cor ke Kasir
              </Button>
            </div>
          </div>
        )}

        {/* Tab 4: Paket / Bundel Material Hemat (PRD 7) */}
        {activeTab === "bundel" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Paket 1: Pasang Keramik Kamar Mandi */}
            <div className="bg-white p-5 rounded-2xl border border-[#ECECE8] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs bg-[#FFF7E0] text-[#B45309] font-bold px-2.5 py-1 rounded-full">
                  Paket 01
                </span>
                <h3 className="font-extrabold text-base text-[#1F2933] mt-2">
                  Paket Pasang Keramik Kamar Mandi
                </h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Solusi komplit lantai anti licin kamar mandi 2x2 meter
                </p>

                <ul className="text-xs text-[#3F4650] space-y-1.5 mt-3 pt-3 border-t border-[#ECECE8]">
                  <li>• 5 Dus Keramik Lantai 40x40</li>
                  <li>• 2 Sak Mortar Perekat MU-380</li>
                  <li>• 2 Sak Pengisi Nat AM 53</li>
                  <li>• 1 pcs Kran Onda 1/2&rdquo;</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#ECECE8] mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B7280]">Estimasi Paket:</span>
                  <p className="text-sm font-black text-[#1F2933]">Rp 694.000</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    handleAddBundle("Paket Keramik Kamar Mandi", [
                      { code: "KRM-040", unit: "dus", qty: 5 },
                      { code: "SMN-380", unit: "sak", qty: 2 },
                      { code: "NAT-001", unit: "sak", qty: 2 },
                      { code: "SAN-KRN1", unit: "pcs", qty: 1 },
                    ])
                  }
                >
                  + Ke Kasir
                </Button>
              </div>
            </div>

            {/* Paket 2: Pengecatan Interior Rumah */}
            <div className="bg-white p-5 rounded-2xl border border-[#ECECE8] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs bg-[#DCFCE7] text-[#15803D] font-bold px-2.5 py-1 rounded-full">
                  Paket 02
                </span>
                <h3 className="font-extrabold text-base text-[#1F2933] mt-2">
                  Paket Dinding Rumah Cantik
                </h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Cat tembok interior anti jamur + perlengkapan tukang
                </p>

                <ul className="text-xs text-[#3F4650] space-y-1.5 mt-3 pt-3 border-t border-[#ECECE8]">
                  <li>• 4 Kaleng Cat Avian 5kg</li>
                  <li>• 1 Kaleng No Drop Anti Bocor 4kg</li>
                  <li>• 3 pcs Kuas Cat Eterna 3&rdquo;</li>
                  <li>• 1 pcs Meteran Rubber 5m</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#ECECE8] mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B7280]">Estimasi Paket:</span>
                  <p className="text-sm font-black text-[#1F2933]">Rp 769.000</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    handleAddBundle("Paket Dinding Rumah Cantik", [
                      { code: "CAT-005", unit: "kaleng", qty: 4 },
                      { code: "CAT-ND4", unit: "kaleng", qty: 1 },
                      { code: "PRK-003", unit: "pcs", qty: 3 },
                      { code: "PRK-MTR5", unit: "pcs", qty: 1 },
                    ])
                  }
                >
                  + Ke Kasir
                </Button>
              </div>
            </div>

            {/* Paket 3: Rangka Baja Ringan Atap */}
            <div className="bg-white p-5 rounded-2xl border border-[#ECECE8] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs bg-[#DBEAFE] text-[#1D4ED8] font-bold px-2.5 py-1 rounded-full">
                  Paket 03
                </span>
                <h3 className="font-extrabold text-base text-[#1F2933] mt-2">
                  Paket Rangka Atap Baja Ringan
                </h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Struktur kanopi atau teras rumah kokoh anti rayap
                </p>

                <ul className="text-xs text-[#3F4650] space-y-1.5 mt-3 pt-3 border-t border-[#ECECE8]">
                  <li>• 10 Batang Kanal C75 Kencana</li>
                  <li>• 15 Batang Reng Baja 0.45mm</li>
                  <li>• 2 Dus Baut Roofing Seng 5cm</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#ECECE8] mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B7280]">Estimasi Paket:</span>
                  <p className="text-sm font-black text-[#1F2933]">Rp 1.694.000</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    handleAddBundle("Paket Rangka Atap Baja", [
                      { code: "BAJ-C75", unit: "batang", qty: 10 },
                      { code: "BAJ-R45", unit: "batang", qty: 15 },
                      { code: "PKU-RFG5", unit: "dus", qty: 2 },
                    ])
                  }
                >
                  + Ke Kasir
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

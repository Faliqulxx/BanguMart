export interface Supplier {
  id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  paymentTermDays: number; // 0 (tunai), 14, 30 hari
  totalDebt: number; // total hutang belum lunas
  contactPerson: string;
  suppliedProducts: string[];
}

export const initialSuppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "PT. Semen Nusantara Distribusi",
    category: "Semen & Perekat",
    phone: "031-7482910",
    address: "Kawasan Industri Gresik Kav. 12-14",
    paymentTermDays: 14,
    totalDebt: 24500000,
    contactPerson: "Pak Hendra (Sales Spv)",
    suppliedProducts: ["Semen Tiga Roda 50kg", "Semen Gresik 40kg", "Mortar Utama MU-380"],
  },
  {
    id: "sup-2",
    name: "CV. Baja Utama Perkasa",
    category: "Besi & Baja",
    phone: "031-5948372",
    address: "Jl. Margomulyo Indah No. 22, Surabaya",
    paymentTermDays: 30,
    totalDebt: 38200000,
    contactPerson: "Ibu Linda Tan",
    suppliedProducts: ["Besi Beton 10mm", "Besi Beton 8mm", "Besi Beton 6mm", "Besi Hollow 4x4", "Kawat Bendrat"],
  },
  {
    id: "sup-3",
    name: "PT. Cat Prima Abadi",
    category: "Cat & Pelapis",
    phone: "021-8938472",
    address: "Jl. Industri Rungkut Blok H-10, Surabaya",
    paymentTermDays: 14,
    totalDebt: 12600000,
    contactPerson: "Pak Bambang",
    suppliedProducts: ["Cat Tembok Avian 5kg", "No Drop Waterproofing 4kg", "Cat Primer Meni Besi", "Thinner B Super"],
  },
  {
    id: "sup-4",
    name: "UD. Pipa Makmur Sentosa",
    category: "Pipa & Sanitasi",
    phone: "0812-3322-1100",
    address: "Komp. Pergudangan Kalianak 51 Blok B",
    paymentTermDays: 0, // Tunai
    totalDebt: 0,
    contactPerson: "Koh Akong",
    suppliedProducts: ['Pipa PVC 3/4"', 'Pipa PVC 1/2"', 'Knee / Elbow Sambungan PVC 3/4"', 'Kran Air Onda', 'Tandon Air 650L'],
  },
  {
    id: "sup-5",
    name: "PT. Keramik Indah Nusantara",
    category: "Keramik & Lantai",
    phone: "031-8920192",
    address: "Jl. Raya Gedangan No. 88, Sidoarjo",
    paymentTermDays: 30,
    totalDebt: 19800000,
    contactPerson: "Bu Ratna",
    suppliedProducts: ["Keramik Lantai 40x40", "Granit Tile 60x60", "Semen Nat Keramik AM 53"],
  },
  {
    id: "sup-6",
    name: "CV. Elektrik Jaya Bersama",
    category: "Listrik",
    phone: "031-3829102",
    address: "Pertokoan Glodok Surabaya Blok C-05",
    paymentTermDays: 14,
    totalDebt: 8400000,
    contactPerson: "Pak Arif Setiawan",
    suppliedProducts: ["Kabel Listrik NYM 2x1,5mm", "Stop Kontak Broco", "Saklar Tunggal Broco", "Lampu LED Philips 12W"],
  },
  {
    id: "sup-7",
    name: "PT. Bangun Sarana Mandiri",
    category: "Atap & Plafon",
    phone: "031-7689102",
    address: "Jl. Mastrip Karang Pilang No. 70",
    paymentTermDays: 14,
    totalDebt: 15400000,
    contactPerson: "Pak Dedi Sunaryo",
    suppliedProducts: ["Genteng Metal Pasir", "Papan Gypsum Jayaboard 9mm", "Reng Baja Ringan", "Baja Ringan Kanal C"],
  },
];

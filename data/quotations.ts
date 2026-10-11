export interface QuotationItem {
  productId: string;
  name: string;
  unit: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface Quotation {
  id: string;
  quotationNo: string;
  date: string;
  validUntil: string;
  customerId: string;
  customerName: string;
  projectName?: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: "Draft" | "Terkirim" | "Disetujui" | "Ditolak" | "Kedaluwarsa";
  notes?: string;
}

export const initialQuotations: Quotation[] = [
  {
    id: "qt-1",
    quotationNo: "QT-202610-001",
    date: "2026-10-17",
    validUntil: "2026-10-24",
    customerId: "cust-4",
    customerName: "UD. Sumber Rejeki",
    projectName: "Ruko 3 Lantai Jl. Veteran",
    items: [
      { productId: "prod-2", name: "Besi Beton 10mm (12m SNI)", unit: "batang", qty: 50, unitPrice: 87000, subtotal: 4350000 },
      { productId: "prod-1", name: "Semen Tiga Roda 50kg", unit: "sak", qty: 40, unitPrice: 64500, subtotal: 2580000 },
      { productId: "prod-8", name: "Pasir Pasang Merapi Super", unit: "m3", qty: 8, unitPrice: 200000, subtotal: 1600000 },
    ],
    subtotal: 8530000,
    discount: 80000,
    shippingFee: 150000,
    total: 8600000,
    status: "Disetujui",
    notes: "Harga khusus proyek tahap 2",
  },
  {
    id: "qt-2",
    quotationNo: "QT-202610-002",
    date: "2026-10-18",
    validUntil: "2026-10-25",
    customerId: "cust-5",
    customerName: "CV. Karya Bangun",
    projectName: "Renovasi Gedung Kantor BUMN",
    items: [
      { productId: "prod-24", name: "Papan Gypsum Jayaboard 9mm", unit: "lembar", qty: 80, unitPrice: 68500, subtotal: 5480000 },
      { productId: "prod-18", name: "Besi Hollow Galvanis 4x4", unit: "batang", qty: 40, unitPrice: 81000, subtotal: 3240000 },
      { productId: "prod-32", name: 'Sekrup Gypsum 6x1" Drywall', unit: "dus", qty: 10, unitPrice: 47000, subtotal: 470000 },
    ],
    subtotal: 9190000,
    discount: 90000,
    shippingFee: 200000,
    total: 9300000,
    status: "Terkirim",
    notes: "Pengiriman bertahap 2 kali",
  },
  {
    id: "qt-3",
    quotationNo: "QT-202610-003",
    date: "2026-10-18",
    validUntil: "2026-10-25",
    customerId: "cust-2",
    customerName: "Andri Pratama",
    projectName: "Renovasi Rumah Driyorejo",
    items: [
      { productId: "prod-6", name: "Keramik Lantai 40x40 Polos Putih", unit: "dus", qty: 35, unitPrice: 81000, subtotal: 2835000 },
      { productId: "prod-23", name: "Pengisi Nat Keramik AM 53 1kg", unit: "sak", qty: 10, unitPrice: 16500, subtotal: 165000 },
    ],
    subtotal: 3000000,
    discount: 50000,
    shippingFee: 75000,
    total: 3025000,
    status: "Draft",
    notes: "Estimasi kalkulator keramik",
  },
  {
    id: "qt-4",
    quotationNo: "QT-202610-004",
    date: "2026-10-14",
    validUntil: "2026-10-21",
    customerId: "cust-10",
    customerName: "Bintang Graha Mandiri",
    projectName: "Cluster Royal Regency Tahap 2",
    items: [
      { productId: "prod-22", name: "Granit Tile 60x60 Glazed Cream", unit: "dus", qty: 60, unitPrice: 198000, subtotal: 11880000 },
    ],
    subtotal: 11880000,
    discount: 180000,
    shippingFee: 250000,
    total: 11950000,
    status: "Disetujui",
    notes: "Siap diproses ke Surat Pesanan (SO)",
  },
  {
    id: "qt-5",
    quotationNo: "QT-202610-005",
    date: "2026-10-01",
    validUntil: "2026-10-08",
    customerId: "cust-7",
    customerName: "PT. Citra Mandiri Perkasa",
    projectName: "Pabrik Plastik Legundi",
    items: [
      { productId: "prod-42", name: "Kawat Harmonika Galvanis 1.5x25m", unit: "roll", qty: 10, unitPrice: 620000, subtotal: 6200000 },
    ],
    subtotal: 6200000,
    discount: 100000,
    shippingFee: 200000,
    total: 6300000,
    status: "Kedaluwarsa",
  },
  {
    id: "qt-6",
    quotationNo: "QT-202610-006",
    date: "2026-10-05",
    validUntil: "2026-10-12",
    customerId: "cust-1",
    customerName: "Toko Maju Jaya",
    items: [
      { productId: "prod-29", name: "Lampu LED Bulb Philips 12W", unit: "dus", qty: 5, unitPrice: 520000, subtotal: 2600000 },
    ],
    subtotal: 2600000,
    discount: 50000,
    shippingFee: 50000,
    total: 2600000,
    status: "Ditolak",
    notes: "Menunggu promo akhir bulan",
  },
];

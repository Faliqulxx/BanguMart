export interface SalesOrderItem {
  productId: string;
  name: string;
  unit: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface SalesOrder {
  id: string;
  orderNo: string;
  date: string;
  customerId: string;
  customerName: string;
  projectName?: string;
  items: SalesOrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  dpPaid: number;
  remainingAmount: number;
  status: "Baru" | "Disiapkan" | "Siap" | "Selesai" | "Dibatalkan";
  deliveryAddress?: string;
  notes?: string;
}

export const initialSalesOrders: SalesOrder[] = [
  {
    id: "so-1",
    orderNo: "SO-202610-001",
    date: "2026-10-18T09:00:00",
    customerId: "cust-4",
    customerName: "UD. Sumber Rejeki",
    projectName: "Ruko 3 Lantai Jl. Veteran",
    items: [
      { productId: "prod-2", name: "Besi Beton 10mm (12m SNI)", unit: "batang", qty: 50, unitPrice: 87000, subtotal: 4350000 },
      { productId: "prod-1", name: "Semen Tiga Roda 50kg", unit: "sak", qty: 40, unitPrice: 64500, subtotal: 2580000 },
    ],
    subtotal: 6930000,
    discount: 50000,
    shippingFee: 150000,
    total: 7030000,
    dpPaid: 2000000,
    remainingAmount: 5030000,
    status: "Disiapkan",
    deliveryAddress: "Jl. Veteran No. 88, Gresik",
    notes: "Staf Gudang sedang menyiapkan ikatan besi",
  },
  {
    id: "so-2",
    orderNo: "SO-202610-002",
    date: "2026-10-18T10:30:00",
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
    dpPaid: 5000000,
    remainingAmount: 6950000,
    status: "Baru",
    deliveryAddress: "Jl. Raya Babat Jerawat Kav. 12",
    notes: "DP diterima via Transfer BCA",
  },
  {
    id: "so-3",
    orderNo: "SO-202610-003",
    date: "2026-10-17T14:15:00",
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
    dpPaid: 1500000,
    remainingAmount: 1525000,
    status: "Siap",
    deliveryAddress: "Driyorejo Permai Blok B2/14",
    notes: "Sudah dipacking di pallet depan, siap diangkut Pak Joko",
  },
  {
    id: "so-4",
    orderNo: "SO-202610-004",
    date: "2026-10-16T11:00:00",
    customerId: "cust-5",
    customerName: "CV. Karya Bangun",
    projectName: "Gudang Logistik Margomulyo",
    items: [
      { productId: "prod-18", name: "Besi Hollow Galvanis 4x4", unit: "batang", qty: 30, unitPrice: 81000, subtotal: 2430000 },
    ],
    subtotal: 2430000,
    discount: 30000,
    shippingFee: 100000,
    total: 2500000,
    dpPaid: 2500000,
    remainingAmount: 0,
    status: "Selesai",
    deliveryAddress: "Kawasan Pergudangan Suri Mulia Blok D-15",
  },
  {
    id: "so-5",
    orderNo: "SO-202610-005",
    date: "2026-10-15T16:00:00",
    customerId: "cust-6",
    customerName: "Pak Haryanto",
    items: [
      { productId: "prod-3", name: "Besi Beton 8mm (12m SNI)", unit: "batang", qty: 25, unitPrice: 56000, subtotal: 1400000 },
    ],
    subtotal: 1400000,
    discount: 0,
    shippingFee: 50000,
    total: 1450000,
    dpPaid: 0,
    remainingAmount: 1450000,
    status: "Dibatalkan",
    notes: "Dibatalkan oleh pelanggan karena perubahan spek gambar",
  },
];

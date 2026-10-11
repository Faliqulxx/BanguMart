export interface DeliveryItem {
  name: string;
  qty: number;
  unit: string;
}

export type DeliveryStatus = "Dijadwalkan" | "Disiapkan" | "Dalam Perjalanan" | "Diterima";

export interface Delivery {
  id: string;
  deliveryNo: string; // SJ-xxx
  trxNo: string;
  orderNo?: string;
  customerName: string;
  customerPhone: string;
  projectAddress: string;
  date: string;
  scheduledTime: string;
  driverName: "Pak Joko" | "Pak Anto";
  vehicle: "Pickup L300 (W 8920 UZ)" | "Truk Engkel (W 9102 PQ)";
  items: DeliveryItem[];
  shippingFee: number;
  status: DeliveryStatus;
  receivedBy?: string;
  receivedAt?: string;
  signaturePlaceholder?: boolean;
  notes?: string;
}

export const initialDeliveries: Delivery[] = [
  // 1. Hari ini - Dalam Perjalanan (Pak Joko)
  {
    id: "del-1",
    deliveryNo: "SJ-20261018-001",
    trxNo: "TRX-0015",
    customerName: "UD. Sumber Rejeki",
    customerPhone: "0811-9876-5432",
    projectAddress: "Jl. Veteran No. 88, Gresik",
    date: "2026-10-18",
    scheduledTime: "13:30 WIB",
    driverName: "Pak Joko",
    vehicle: "Truk Engkel (W 9102 PQ)",
    items: [
      { name: "Besi Beton 10mm (12m SNI)", qty: 20, unit: "batang" },
      { name: "Besi Beton 8mm (12m SNI)", qty: 10, unit: "batang" },
      { name: "Kawat Bendrat Beton Hitam", qty: 6, unit: "kg" },
    ],
    shippingFee: 150000,
    status: "Dalam Perjalanan",
    notes: "Sudah berangkat jam 13:45, perkiraan sampai 14:15",
  },
  // 2. Hari ini - Dalam Perjalanan (Pak Anto)
  {
    id: "del-2",
    deliveryNo: "SJ-20261018-002",
    trxNo: "TRX-0014",
    customerName: "UD. Sumber Rejeki",
    customerPhone: "0811-9876-5432",
    projectAddress: "Griya Asri Cendana Blok C No. 1-8",
    date: "2026-10-18",
    scheduledTime: "14:00 WIB",
    driverName: "Pak Anto",
    vehicle: "Pickup L300 (W 8920 UZ)",
    items: [
      { name: "Bata Ringan Hebel 7.5cm", qty: 12, unit: "m3" },
      { name: "Mortar Utama MU-380 40kg", qty: 20, unit: "sak" },
    ],
    shippingFee: 150000,
    status: "Dalam Perjalanan",
    notes: "Konfirmasi satpam gerbang depan",
  },
  // 3. Hari ini - Disiapkan
  {
    id: "del-3",
    deliveryNo: "SJ-20261018-003",
    trxNo: "TRX-0017",
    customerName: "Andri Pratama",
    customerPhone: "0813-8899-1234",
    projectAddress: "Driyorejo Permai Blok B2/14",
    date: "2026-10-18",
    scheduledTime: "15:30 WIB",
    driverName: "Pak Joko",
    vehicle: "Pickup L300 (W 8920 UZ)",
    items: [
      { name: "Keramik Lantai 40x40 Polos Putih", qty: 35, unit: "dus" },
      { name: "Pengisi Nat Keramik AM 53", qty: 10, unit: "sak" },
    ],
    shippingFee: 75000,
    status: "Disiapkan",
    notes: "Barang sudah dinaikkan separuh",
  },
  // 4. Hari ini - Dijadwalkan
  {
    id: "del-4",
    deliveryNo: "SJ-20261018-004",
    trxNo: "TRX-0018",
    customerName: "Toko Maju Jaya",
    customerPhone: "0812-3456-7890",
    projectAddress: "Jl. Raya Menganti No. 45, Gresik",
    date: "2026-10-18",
    scheduledTime: "16:45 WIB",
    driverName: "Pak Anto",
    vehicle: "Pickup L300 (W 8920 UZ)",
    items: [
      { name: "Kabel Listrik NYM 2x1,5mm", qty: 2, unit: "roll" },
      { name: "Stop Kontak Arde Broco Galleo", qty: 3, unit: "pcs" },
    ],
    shippingFee: 50000,
    status: "Dijadwalkan",
    notes: "Kirim sebelum toko tutup jam 17:30",
  },
  // 5. Kemarin - Selesai / Diterima
  {
    id: "del-5",
    deliveryNo: "SJ-20261017-001",
    trxNo: "TRX-0013",
    customerName: "CV. Karya Bangun",
    customerPhone: "0812-7766-5544",
    projectAddress: "Kawasan Pergudangan Suri Mulia Blok D-15",
    date: "2026-10-17",
    scheduledTime: "10:00 WIB",
    driverName: "Pak Joko",
    vehicle: "Truk Engkel (W 9102 PQ)",
    items: [
      { name: "Kanal C Baja Ringan C75.75", qty: 60, unit: "batang" },
      { name: "Reng Baja Ringan 0.45mm", qty: 80, unit: "batang" },
    ],
    shippingFee: 200000,
    status: "Diterima",
    receivedBy: "Mandor Slamet",
    receivedAt: "2026-10-17 11:20 WIB",
    signaturePlaceholder: true,
  },
  // 6. Kemarin - Selesai / Diterima
  {
    id: "del-6",
    deliveryNo: "SJ-20261017-002",
    trxNo: "TRX-0012",
    customerName: "Pak Haryanto",
    customerPhone: "0878-5544-3322",
    projectAddress: "Desa Cerme Lor RT 02 RW 01",
    date: "2026-10-17",
    scheduledTime: "14:00 WIB",
    driverName: "Pak Anto",
    vehicle: "Pickup L300 (W 8920 UZ)",
    items: [
      { name: "Semen Tiga Roda 50kg", qty: 8, unit: "sak" },
      { name: "Pasir Pasang Merapi Super", qty: 2, unit: "m3" },
    ],
    shippingFee: 50000,
    status: "Diterima",
    receivedBy: "Pak Haryanto Sendiri",
    receivedAt: "2026-10-17 15:10 WIB",
    signaturePlaceholder: true,
  },
  // 7. Besok - Dijadwalkan
  {
    id: "del-7",
    deliveryNo: "SJ-20261019-001",
    trxNo: "TRX-0019",
    customerName: "Bintang Graha Mandiri",
    customerPhone: "0812-9900-1122",
    projectAddress: "Jl. Raya Babat Jerawat Kav. 12",
    date: "2026-10-19",
    scheduledTime: "09:00 WIB",
    driverName: "Pak Joko",
    vehicle: "Truk Engkel (W 9102 PQ)",
    items: [
      { name: "Granit Tile 60x60 Glazed Cream", qty: 60, unit: "dus" },
    ],
    shippingFee: 250000,
    status: "Dijadwalkan",
    notes: "Pengiriman pertama proyek cluster",
  },
  // 8. Besok - Dijadwalkan
  {
    id: "del-8",
    deliveryNo: "SJ-20261019-002",
    trxNo: "TRX-0020",
    customerName: "PT. Citra Mandiri Perkasa",
    customerPhone: "0813-2233-4455",
    projectAddress: "Jl. Raya Legundi KM 28, Krian",
    date: "2026-10-19",
    scheduledTime: "11:00 WIB",
    driverName: "Pak Anto",
    vehicle: "Pickup L300 (W 8920 UZ)",
    items: [
      { name: "Kawat Harmonika Galvanis", qty: 10, unit: "roll" },
      { name: "Pipa PVC 3/4 AW", qty: 15, unit: "batang" },
    ],
    shippingFee: 150000,
    status: "Dijadwalkan",
  },
];

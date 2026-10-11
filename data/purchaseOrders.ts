export interface PurchaseOrderItem {
  productId: string;
  name: string;
  unit: string;
  qty: number;
  purchasePrice: number;
  subtotal: number;
  receivedQty?: number;
}

export interface PurchaseOrder {
  id: string;
  poNo: string;
  date: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Draft" | "Dipesan" | "Diterima Sebagian" | "Diterima" | "Dibatalkan";
  expectedDate: string;
  receivedDate?: string;
  isPaid: boolean;
  notes?: string;
}

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-1",
    poNo: "PO-202610-001",
    date: "2026-10-17",
    supplierId: "sup-1",
    supplierName: "PT. Semen Nusantara Distribusi",
    supplierPhone: "031-7482910",
    items: [
      { productId: "prod-1", name: "Semen Tiga Roda 50kg", unit: "sak", qty: 100, purchasePrice: 61000, subtotal: 6100000, receivedQty: 100 },
      { productId: "prod-15", name: "Mortar Utama MU-380 40kg", unit: "sak", qty: 50, purchasePrice: 85000, subtotal: 4250000, receivedQty: 50 },
    ],
    subtotal: 10350000,
    tax: 0,
    total: 10350000,
    status: "Diterima",
    expectedDate: "2026-10-18",
    receivedDate: "2026-10-18",
    isPaid: false,
    notes: "Restock semen menipis, barang sudah masuk gudang A",
  },
  {
    id: "po-2",
    poNo: "PO-202610-002",
    date: "2026-10-18",
    supplierId: "sup-2",
    supplierName: "CV. Baja Utama Perkasa",
    supplierPhone: "031-5948372",
    items: [
      { productId: "prod-11", name: "Besi Beton 6mm (12m SNI)", unit: "batang", qty: 80, purchasePrice: 31000, subtotal: 2480000, receivedQty: 0 },
      { productId: "prod-2", name: "Besi Beton 10mm (12m SNI)", unit: "batang", qty: 50, purchasePrice: 82000, subtotal: 4100000, receivedQty: 0 },
    ],
    subtotal: 6580000,
    tax: 0,
    total: 6580000,
    status: "Dipesan",
    expectedDate: "2026-10-20",
    isPaid: false,
    notes: "Menunggu armada distributor kirim besok lusa",
  },
  {
    id: "po-3",
    poNo: "PO-202610-003",
    date: "2026-10-16",
    supplierId: "sup-3",
    supplierName: "PT. Cat Prima Abadi",
    supplierPhone: "021-8938472",
    items: [
      { productId: "prod-4", name: "Cat Tembok Avian 5kg (Putih)", unit: "kaleng", qty: 40, purchasePrice: 108000, subtotal: 4320000, receivedQty: 20 },
      { productId: "prod-19", name: "No Drop Waterproofing 4kg", unit: "kaleng", qty: 20, purchasePrice: 168000, subtotal: 3360000, receivedQty: 20 },
    ],
    subtotal: 7680000,
    tax: 0,
    total: 7680000,
    status: "Diterima Sebagian",
    expectedDate: "2026-10-17",
    receivedDate: "2026-10-17",
    isPaid: false,
    notes: "Avian 20 kaleng menyusul pengiriman berikutnya",
  },
  {
    id: "po-4",
    poNo: "PO-202610-004",
    date: "2026-10-18",
    supplierId: "sup-4",
    supplierName: "UD. Pipa Makmur Sentosa",
    supplierPhone: "0812-3322-1100",
    items: [
      { productId: "prod-5", name: 'Pipa PVC 3/4" AW (4m)', unit: "batang", qty: 50, purchasePrice: 14500, subtotal: 725000, receivedQty: 0 },
      { productId: "prod-20", name: 'Pipa PVC 1/2" AW (4m)', unit: "batang", qty: 50, purchasePrice: 11000, subtotal: 550000, receivedQty: 0 },
    ],
    subtotal: 1275000,
    tax: 0,
    total: 1275000,
    status: "Draft",
    expectedDate: "2026-10-21",
    isPaid: false,
  },
  {
    id: "po-5",
    poNo: "PO-202610-005",
    date: "2026-10-10",
    supplierId: "sup-5",
    supplierName: "PT. Keramik Indah Nusantara",
    supplierPhone: "031-8920192",
    items: [
      { productId: "prod-6", name: "Keramik Lantai 40x40 Polos Putih", unit: "dus", qty: 150, purchasePrice: 72000, subtotal: 10800000, receivedQty: 150 },
    ],
    subtotal: 10800000,
    tax: 0,
    total: 10800000,
    status: "Diterima",
    expectedDate: "2026-10-12",
    receivedDate: "2026-10-12",
    isPaid: true,
    notes: "Sudah dilunasi via transfer giro",
  },
  {
    id: "po-6",
    poNo: "PO-202610-006",
    date: "2026-10-08",
    supplierId: "sup-6",
    supplierName: "CV. Elektrik Jaya Bersama",
    supplierPhone: "031-3829102",
    items: [
      { productId: "prod-7", name: "Kabel Listrik NYM 2x1,5mm", unit: "roll", qty: 10, purchasePrice: 300000, subtotal: 3000000, receivedQty: 0 },
    ],
    subtotal: 3000000,
    tax: 0,
    total: 3000000,
    status: "Dibatalkan",
    expectedDate: "2026-10-11",
    isPaid: false,
    notes: "Harga supplier naik mendadak, PO direvisi",
  },
];

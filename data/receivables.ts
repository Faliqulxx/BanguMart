export interface ReceivableInvoice {
  id: string;
  invoiceNo: string;
  trxNo: string;
  customerId: string;
  customerName: string;
  customerType: string;
  customerPhone: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "Belum Jatuh Tempo" | "Segera Jatuh Tempo" | "Terlambat";
  agingDays: number;
  notes?: string;
}

export const initialReceivables: ReceivableInvoice[] = [
  // 1. UD. Sumber Rejeki (9.150.000) - Segera Jatuh Tempo
  {
    id: "rec-1",
    invoiceNo: "INV-20261016-0014",
    trxNo: "TRX-0014",
    customerId: "cust-4",
    customerName: "UD. Sumber Rejeki",
    customerType: "Kontraktor",
    customerPhone: "0811-9876-5432",
    invoiceDate: "2026-10-16",
    dueDate: "2026-10-23", // Jatuh tempo 5 hari lagi
    totalAmount: 9150000,
    paidAmount: 0,
    remainingAmount: 9150000,
    status: "Segera Jatuh Tempo",
    agingDays: 2,
    notes: "Proyek Ruko Jl. Veteran",
  },
  // 2. UD. Sumber Rejeki (9.450.000) - 0-30 hari
  {
    id: "rec-2",
    invoiceNo: "INV-20261005-0008",
    trxNo: "TRX-0008",
    customerId: "cust-4",
    customerName: "UD. Sumber Rejeki",
    customerType: "Kontraktor",
    customerPhone: "0811-9876-5432",
    invoiceDate: "2026-10-05",
    dueDate: "2026-11-04",
    totalAmount: 14450000,
    paidAmount: 5000000,
    remainingAmount: 9450000,
    status: "Belum Jatuh Tempo",
    agingDays: 13,
    notes: "Proyek Griya Asri Blok C",
  },
  // 3. CV. Karya Bangun (6.060.000) - Segera Jatuh Tempo
  {
    id: "rec-3",
    invoiceNo: "INV-20261015-0013",
    trxNo: "TRX-0013",
    customerId: "cust-5",
    customerName: "CV. Karya Bangun",
    customerType: "Kontraktor",
    customerPhone: "0812-7766-5544",
    invoiceDate: "2026-10-15",
    dueDate: "2026-10-22",
    totalAmount: 9060000,
    paidAmount: 3000000,
    remainingAmount: 6060000,
    status: "Segera Jatuh Tempo",
    agingDays: 3,
    notes: "Rangka baja pergudangan Margomulyo",
  },
  // 4. CV. Karya Bangun (6.340.000) - 31-60 hari
  {
    id: "rec-4",
    invoiceNo: "INV-20260912-0003",
    trxNo: "TRX-0003",
    customerId: "cust-5",
    customerName: "CV. Karya Bangun",
    customerType: "Kontraktor",
    customerPhone: "0812-7766-5544",
    invoiceDate: "2026-09-12",
    dueDate: "2026-10-12",
    totalAmount: 12340000,
    paidAmount: 6000000,
    remainingAmount: 6340000,
    status: "Terlambat",
    agingDays: 36,
    notes: "Renovasi Gedung Kantor BUMN - Menunggu termin SPK",
  },
  // 5. Toko Maju Jaya (4.250.000) - Segera Jatuh Tempo
  {
    id: "rec-5",
    invoiceNo: "INV-20261008-0009",
    trxNo: "TRX-0009",
    customerId: "cust-1",
    customerName: "Toko Maju Jaya",
    customerType: "Toko",
    customerPhone: "0812-3456-7890",
    invoiceDate: "2026-10-08",
    dueDate: "2026-10-22",
    totalAmount: 4250000,
    paidAmount: 0,
    remainingAmount: 4250000,
    status: "Segera Jatuh Tempo",
    agingDays: 10,
    notes: "Restock kabel dan fitting toko cabang",
  },
  // 6. Pak Haryanto (1.500.000) - Segera Jatuh Tempo
  {
    id: "rec-6",
    invoiceNo: "INV-20261014-0010",
    trxNo: "TRX-0010",
    customerId: "cust-6",
    customerName: "Pak Haryanto",
    customerType: "Tukang",
    customerPhone: "0878-5544-3322",
    invoiceDate: "2026-10-14",
    dueDate: "2026-10-21",
    totalAmount: 2500000,
    paidAmount: 1000000,
    remainingAmount: 1500000,
    status: "Segera Jatuh Tempo",
    agingDays: 4,
    notes: "Semen & pasir Cerme",
  },
  // 7. PT. Citra Mandiri Perkasa (2.000.000) - Belum Jatuh Tempo
  {
    id: "rec-7",
    invoiceNo: "INV-20261010-0012",
    trxNo: "TRX-0012",
    customerId: "cust-7",
    customerName: "PT. Citra Mandiri Perkasa",
    customerType: "Kontraktor",
    customerPhone: "0813-2233-4455",
    invoiceDate: "2026-10-10",
    dueDate: "2026-11-09",
    totalAmount: 12000000,
    paidAmount: 10000000,
    remainingAmount: 2000000,
    status: "Belum Jatuh Tempo",
    agingDays: 8,
    notes: "Pabrik Krian Legundi",
  },
  // 8. CV. Karya Bangun (>60 hari, terlambat)
  {
    id: "rec-8",
    invoiceNo: "INV-20260810-0001",
    trxNo: "TRX-0001",
    customerId: "cust-5",
    customerName: "CV. Karya Bangun",
    customerType: "Kontraktor",
    customerPhone: "0812-7766-5544",
    invoiceDate: "2026-08-10",
    dueDate: "2026-09-09",
    totalAmount: 8000000,
    paidAmount: 5000000,
    remainingAmount: 3000000,
    status: "Terlambat",
    agingDays: 69,
    notes: "Sisa retensi proyek lama",
  },
  // 9. Pak Haryanto (1.000.000) - Segera Jatuh Tempo
  {
    id: "rec-9",
    invoiceNo: "INV-20261012-0011",
    trxNo: "TRX-0011",
    customerId: "cust-6",
    customerName: "Pak Haryanto",
    customerType: "Tukang",
    customerPhone: "0878-5544-3322",
    invoiceDate: "2026-10-12",
    dueDate: "2026-10-19",
    totalAmount: 1000000,
    paidAmount: 0,
    remainingAmount: 1000000,
    status: "Segera Jatuh Tempo",
    agingDays: 6,
    notes: "Besi begel 6mm",
  },
];
// Total: 9.15M + 9.45M + 6.06M + 6.34M + 4.25M + 1.5M + 2.0M + 3.0M + 1.0M = 42.75M -> exactly accounts for PRD receivables

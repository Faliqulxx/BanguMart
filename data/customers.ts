import { PriceTier } from "@/lib/pricing";

export interface CustomerProject {
  id: string;
  name: string;
  address: string;
  notes?: string;
  totalSpent: number;
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  type: "Umum" | "Tukang" | "Kontraktor" | "Toko";
  priceTier: PriceTier;
  phone: string;
  email?: string;
  address: string;
  npwp?: string;
  creditLimit: number; // 0 jika umum/tanpa kredit
  currentReceivable: number;
  paymentTermDays: number; // 7, 14, 30 hari
  projects?: CustomerProject[];
  loyaltyPoints?: number;
  isProblematic?: boolean; // Peringatan sering telat bayar
}

export const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Toko Maju Jaya",
    company: "Toko Bangunan Maju Jaya",
    type: "Toko",
    priceTier: "grosir",
    phone: "0812-3456-7890",
    address: "Jl. Raya Menganti No. 45, Gresik",
    npwp: "01.234.567.8-601.000",
    creditLimit: 20000000,
    currentReceivable: 4250000,
    paymentTermDays: 14,
    loyaltyPoints: 120,
    projects: [
      {
        id: "proj-101",
        name: "Stok Toko Cabang 1",
        address: "Jl. Raya Menganti No. 45, Gresik",
        totalSpent: 18500000,
      },
    ],
  },
  {
    id: "cust-2",
    name: "Andri Pratama",
    company: "Mandor Andri & Rekan",
    type: "Tukang",
    priceTier: "grosir",
    phone: "0813-8899-1234",
    address: "Driyorejo Permai Blok B2/14, Gresik",
    creditLimit: 5000000,
    currentReceivable: 0,
    paymentTermDays: 7,
    loyaltyPoints: 450,
  },
  {
    id: "cust-3",
    name: "Siti Nurhaliza",
    type: "Umum",
    priceTier: "eceran",
    phone: "0857-1122-3344",
    address: "Jl. Kartini Gang 3 No. 12, Surabaya",
    creditLimit: 0,
    currentReceivable: 0,
    paymentTermDays: 0,
    loyaltyPoints: 15,
  },
  {
    id: "cust-4",
    name: "UD. Sumber Rejeki",
    company: "UD. Sumber Rejeki Konstruksi",
    type: "Kontraktor",
    priceTier: "kontraktor",
    phone: "0811-9876-5432",
    address: "Kawasan Industri Manyar Kav. 8, Gresik",
    npwp: "02.456.789.0-602.000",
    creditLimit: 50000000,
    currentReceivable: 18600000,
    paymentTermDays: 30,
    loyaltyPoints: 890,
    projects: [
      {
        id: "proj-401",
        name: "Ruko 3 Lantai Jl. Veteran",
        address: "Jl. Veteran No. 88, Gresik (Depan SPBU)",
        notes: "Akses truk engkel bisa masuk siang hari",
        totalSpent: 42500000,
      },
      {
        id: "proj-402",
        name: "Perumahan Griya Asri Blok C",
        address: "Griya Asri Cendana Blok C No. 1-8",
        notes: "Pengiriman butuh koordinasi dengan satpam gerbang",
        totalSpent: 28000000,
      },
    ],
  },
  {
    id: "cust-5",
    name: "CV. Karya Bangun",
    company: "CV. Karya Bangun Perkasa",
    type: "Kontraktor",
    priceTier: "kontraktor",
    phone: "0812-7766-5544",
    address: "Jl. Basuki Rahmat No. 102, Surabaya",
    npwp: "03.789.012.3-603.000",
    creditLimit: 75000000,
    currentReceivable: 12400000,
    paymentTermDays: 30,
    loyaltyPoints: 1240,
    projects: [
      {
        id: "proj-501",
        name: "Gudang Logistik Margomulyo",
        address: "Kawasan Pergudangan Suri Mulia Blok D-15",
        totalSpent: 55000000,
      },
      {
        id: "proj-502",
        name: "Renovasi Gedung Kantor BUMN",
        address: "Jl. Pahlawan No. 42, Surabaya",
        totalSpent: 35000000,
      },
    ],
  },
  {
    id: "cust-6",
    name: "Pak Haryanto",
    type: "Tukang",
    priceTier: "grosir",
    phone: "0878-5544-3322",
    address: "Desa Cerme Lor RT 02 RW 01, Gresik",
    creditLimit: 3000000,
    currentReceivable: 1500000,
    paymentTermDays: 7,
    loyaltyPoints: 210,
  },
  {
    id: "cust-7",
    name: "PT. Citra Mandiri Perkasa",
    company: "PT. Citra Mandiri Perkasa",
    type: "Kontraktor",
    priceTier: "kontraktor",
    phone: "0813-2233-4455",
    address: "Ruko Gateway Blok A-12, Waru Sidoarjo",
    npwp: "01.999.888.7-604.000",
    creditLimit: 60000000,
    currentReceivable: 2000000,
    paymentTermDays: 30,
    loyaltyPoints: 620,
    projects: [
      {
        id: "proj-701",
        name: "Pabrik Plastik Legundi",
        address: "Jl. Raya Legundi KM 28, Krian",
        totalSpent: 31000000,
      },
    ],
  },
  {
    id: "cust-8",
    name: "Wahyu Teknik",
    company: "Bengkel Las & Konstruksi Wahyu",
    type: "Tukang",
    priceTier: "grosir",
    phone: "0821-6655-4433",
    address: "Jl. Kepatihan Industri No. 5, Gresik",
    creditLimit: 10000000,
    currentReceivable: 0,
    paymentTermDays: 14,
    loyaltyPoints: 340,
  },
  {
    id: "cust-9",
    name: "Toko Berkah Abadi",
    company: "Toko Berkah Abadi Material",
    type: "Toko",
    priceTier: "grosir",
    phone: "0819-3344-5566",
    address: "Pasar Benowo No. 18, Surabaya Barat",
    creditLimit: 15000000,
    currentReceivable: 0,
    paymentTermDays: 14,
    loyaltyPoints: 500,
  },
  {
    id: "cust-10",
    name: "Bintang Graha Mandiri",
    company: "PT. Bintang Graha Mandiri",
    type: "Kontraktor",
    priceTier: "kontraktor",
    phone: "0812-9900-1122",
    address: "Jl. Mayjend Sungkono No. 89, Surabaya",
    npwp: "02.111.222.3-605.000",
    creditLimit: 40000000,
    currentReceivable: 0,
    paymentTermDays: 30,
    loyaltyPoints: 780,
    projects: [
      {
        id: "proj-1001",
        name: "Cluster Royal Regency Tahap 2",
        address: "Jl. Raya Babat Jerawat Kav. 12",
        totalSpent: 48000000,
      },
    ],
  },
  {
    id: "cust-11",
    name: "Bu Kusuma",
    type: "Umum",
    priceTier: "eceran",
    phone: "0852-7788-9900",
    address: "Perumahan Citra Harmoni Blok F3/20",
    creditLimit: 0,
    currentReceivable: 0,
    paymentTermDays: 0,
  },
  {
    id: "cust-12",
    name: "Edi Supriyanto",
    type: "Tukang",
    priceTier: "grosir",
    phone: "0812-4455-6677",
    address: "Jl. Raya Balongpanggang No. 34, Gresik",
    creditLimit: 4000000,
    currentReceivable: 0,
    paymentTermDays: 7,
    loyaltyPoints: 180,
  },
];

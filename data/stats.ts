export interface DashboardStats {
  penjualanHariIni: number;
  jumlahTransaksi: number;
  produkTerjual: number;
  stokMenipis: number;
  perubahan: {
    penjualan: number;
    transaksi: number;
    produk: number;
  };
  piutang: {
    total: number;
    faktur: number;
    jatuhTempoMingguIni: number;
  };
  pengirimanHariIni: {
    total: number;
    dalamPerjalanan: number;
  };
  pesananMenunggu: number;
}

export const initialStats: DashboardStats = {
  penjualanHariIni: 4850000,
  jumlahTransaksi: 24,
  produkTerjual: 56,
  stokMenipis: 8,
  perubahan: { penjualan: 12, transaksi: 8, produk: 14 },
  piutang: { total: 38750000, faktur: 9, jatuhTempoMingguIni: 5 },
  pengirimanHariIni: { total: 4, dalamPerjalanan: 2 },
  pesananMenunggu: 3,
};

export interface DailySalesData {
  tanggal: string;
  penjualan: number; // in Rupiah
  transaksi: number;
}

export const salesHistory7Days: DailySalesData[] = [
  { tanggal: "12 Okt", penjualan: 2500000, transaksi: 14 },
  { tanggal: "13 Okt", penjualan: 3800000, transaksi: 20 },
  { tanggal: "14 Okt", penjualan: 3400000, transaksi: 18 },
  { tanggal: "15 Okt", penjualan: 4500000, transaksi: 22 },
  { tanggal: "16 Okt", penjualan: 3200000, transaksi: 17 },
  { tanggal: "17 Okt", penjualan: 4300000, transaksi: 23 },
  { tanggal: "18 Okt", penjualan: 4850000, transaksi: 24 },
];

export const salesHistory30Days: DailySalesData[] = [
  { tanggal: "20 Sep", penjualan: 2100000, transaksi: 12 },
  { tanggal: "24 Sep", penjualan: 3300000, transaksi: 18 },
  { tanggal: "28 Sep", penjualan: 4100000, transaksi: 21 },
  { tanggal: "02 Okt", penjualan: 3600000, transaksi: 19 },
  { tanggal: "06 Okt", penjualan: 4200000, transaksi: 22 },
  { tanggal: "10 Okt", penjualan: 3900000, transaksi: 20 },
  { tanggal: "14 Okt", penjualan: 4500000, transaksi: 23 },
  { tanggal: "18 Okt", penjualan: 4850000, transaksi: 24 },
];

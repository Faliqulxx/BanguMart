const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const MANUAL_DIR = path.join(ROOT_DIR, 'manual-book');
const IMAGES_DIR = path.join(MANUAL_DIR, 'images');
const MAUAL_DIR = path.join(ROOT_DIR, 'maual book');

if (!fs.existsSync(MANUAL_DIR)) fs.mkdirSync(MANUAL_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
if (!fs.existsSync(MAUAL_DIR)) fs.mkdirSync(MAUAL_DIR, { recursive: true });

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const pages = [
  {
    id: 'login',
    url: 'http://localhost:3000/login',
    filename: '00-login.png',
    title: 'Halaman Masuk & Autentikasi Peran',
    category: 'Akses & Keamanan',
    badge: 'Multi-Role Access',
    badgeColor: '#F5A800',
    description: 'Gerbang masuk aplikasi POS dengan desain visual toko bangunan, keamanan sandi, dan simulasi pergantian peran cepat.',
    features: [
      {
        title: 'Desain Split-Screen Modern',
        detail: 'Sisi kiri menampilkan ilustrasi toko bangunan Mitra Bangunan Material Jaya dan sisi kanan kartu formulir masuk bernuansa hangat.'
      },
      {
        title: 'Simulasi Peran Cepat (1-Klik)',
        detail: 'Tombol pintas untuk langsung memilih akun demo: Owner (Budi Santoso), Kasir (Rina), Gudang (Hendra), atau Sopir (Pak Joko).'
      },
      {
        title: 'Fitur Lupa Kata Sandi Terintegrasi',
        detail: 'Modal interaktif untuk simulasi pengiriman tautan instruksi pemulihan kata sandi ke email terdaftar pengguna.'
      },
      {
        title: 'Keamanan & Visibilitas Sandi',
        detail: 'Dilengkapi toggle lihat/sembunyikan kata sandi serta validasi kelengkapan isian sebelum diarahkan ke sistem POS.'
      }
    ],
    tips: 'Pilih profil peran yang sesuai untuk menguji batasan hak akses diskon dan wewenang operasional toko.'
  },
  {
    id: 'dashboard',
    url: 'http://localhost:3000/',
    filename: '01-dashboard.png',
    title: 'Dashboard & Ringkasan Performa Toko',
    category: 'Ringkasan Eksekutif',
    badge: 'Fitur Utama',
    badgeColor: '#F5A800',
    description: 'Pusat komando dan pemantauan performa bisnis toko bangunan secara real-time harian dan mingguan.',
    features: [
      {
        title: 'KPI Metrik Utama',
        detail: 'Menampilkan Total Penjualan Hari Ini, Jumlah Transaksi, Estimasi Margin Laba Kotor, dan Pesanan yang Perlu Dikirim hari ini.'
      },
      {
        title: 'Grafik Tren Penjualan 7 Hari',
        detail: 'Visualisasi grafik omset mingguan untuk menganalisis kenaikan atau penurunan penjualan secara cepat.'
      },
      {
        title: 'Peringatan Stok Kritis (Restock Alert)',
        detail: 'Daftar produk material yang telah mencapai atau berada di bawah batas minimum stok (buffer limit).'
      },
      {
        title: 'Aksi Cepat & Navigasi Terintegrasi',
        detail: 'Tombol pintas untuk langsung buka kasir POS, buat pesanan material, cek piutang, dan hitung estimasi material.'
      }
    ],
    tips: 'Gunakan filter peran di pojok kanan atas untuk melihat data dari sudut pandang Owner, Kasir, atau Gudang.'
  },
  {
    id: 'pos-kasir',
    url: 'http://localhost:3000/transaksi?tab=kasir',
    filename: '02-pos-kasir.png',
    title: 'Kasir POS Multi-Satuan & Multi-Tier',
    category: 'Kasir & Transaksi',
    badge: '100% Fullscreen Viewport',
    badgeColor: '#10B981',
    description: 'Antarmuka kasir cepat dirancang tanpa scroll halaman luar, memudahkan kasir melayani antrean ramai tanpa hambatan.',
    features: [
      {
        title: 'Layout Ergonomis Pinned Footer',
        detail: 'Panel keranjang dan tombol "Bayar (F9)" selalu terkunci rapi di layar tanpa terdorong ke bawah, menjamin kelancaran kasir.'
      },
      {
        title: 'Multi-Satuan Material Bangunan',
        detail: 'Dukungan satuan bertingkat (Semen: Sak/Palet; Besi: Batang/Ikat; Pasir: m3/Rit; Cat: Kaleng/Pail) dengan konversi harga otomatis.'
      },
      {
        title: 'Tingkat Harga Tier Pelanggan',
        detail: 'Harga barang otomatis menyesuaikan tier pelanggan: Eceran standar, Grosir (toko/tukang), atau Kontraktor borongan.'
      },
      {
        title: 'Pencarian & Scan Barcode Cepat',
        detail: 'Cari barang berdasarkan nama, kode SKU material, merk, atau barcode dengan responsif instan.'
      }
    ],
    tips: 'Tekan tombol keyboard F9 untuk langsung membuka jendela pembayaran tanpa harus menggerakkan kursor mouse.'
  },
  {
    id: 'pembayaran-diskon',
    url: 'http://localhost:3000/transaksi?tab=kasir&modal=payment',
    filename: '03-pembayaran-diskon.png',
    title: 'Diskon Bertingkat (Rp & %) & Otorisasi Peran',
    category: 'Pembayaran & Keamanan',
    badge: 'Otorisasi PIN Pintar',
    badgeColor: '#6366F1',
    description: 'Sistem pemberian diskon fleksibel nominal rupiah atau persentase dengan kontrol wewenang peran kasir dan owner.',
    features: [
      {
        title: 'Bentuk Diskon Ganda (Rp dan %)',
        detail: 'Bisa memberi diskon dalam Rupiah langsung atau persentase, dengan kalkulasi nominal otomatis.'
      },
      {
        title: 'Wewenang Penuh Owner (Bebas Potongan)',
        detail: 'Owner dapat langsung memotong harga tanpa batas, atau memakai fitur "Ubah Total" untuk mengetikkan harga akhir langsung.'
      },
      {
        title: 'Batas Kasir Maksimal Rp 1.000',
        detail: 'Kasir/karyawan berwenang memberi potongan pembulatan s/d Rp 1.000 langsung tanpa PIN jika diminta pelanggan.'
      },
      {
        title: 'Perlindungan PIN Owner (Dummy: 1234)',
        detail: 'Jika kasir memberi potongan di atas Rp 1.000 atau mengubah harga dasar, sistem mewajibkan verifikasi PIN Owner.'
      }
    ],
    tips: 'Gunakan tombol cepat "-Rp 500", "-Rp 1.000", atau "Bulatkan" untuk mempercepat transaksi kasir saat pembeli meminta kembalian pas.'
  },
  {
    id: 'kalkulator-material',
    url: 'http://localhost:3000/kalkulator',
    filename: '04-kalkulator-material.png',
    title: 'Kalkulator Kebutuhan Material Proyek',
    category: 'Fitur Spesial Material',
    badge: 'Estimasi Otomatis SNI',
    badgeColor: '#F59E0B',
    description: 'Alat bantu pintar untuk menghitung estimasi kebutuhan semen, bata, pasir, keramik, dan cat berdasarkan dimensi proyek bangunan.',
    features: [
      {
        title: 'Pilihan Jenis Konstruksi Proyek',
        detail: 'Dukungan formula kalkulasi untuk Pasangan Dinding Bata, Plesteran Dinding, Pasang Keramik Lantai, dan Pengecatan.'
      },
      {
        title: 'Input Dimensi Luas & Tebal',
        detail: 'Cukup masukkan panjang, tinggi dinding, atau luas lantai ruangan untuk mendapatkan rincian kebutuhan material.'
      },
      {
        title: 'Rekomendasi Merk & Stok Toko',
        detail: 'Kalkulator otomatis memetakan estimasi material ke stok produk yang tersedia di gudang BanguMart beserta harganya.'
      },
      {
        title: 'Satu-Klik Masukkan ke Kasir POS',
        detail: 'Hasil hitungan material dapat langsung dimasukkan ke keranjang belanja kasir tanpa perlu input manual satu per satu.'
      }
    ],
    tips: 'Sangat cocok digunakan saat kontraktor atau tukang berkonsultasi kebutuhan material langsung di meja kasir.'
  },
  {
    id: 'piutang-kontraktor',
    url: 'http://localhost:3000/pelanggan/piutang',
    filename: '05-piutang-kontraktor.png',
    title: 'Manajemen Piutang & Kredit Kontraktor',
    category: 'Keuangan & Pelanggan',
    badge: 'Manajemen Risiko',
    badgeColor: '#EF4444',
    description: 'Pengelolaan piutang tempo kontraktor dengan analisis umur piutang (aging schedule) dan monitoring limit kredit.',
    features: [
      {
        title: 'Analisis Umur Piutang (Aging)',
        detail: 'Pengelompokan faktur piutang: Belum Jatuh Tempo, 0-14 Hari, 15-30 Hari, dan >30 Hari untuk memprioritaskan penagihan.'
      },
      {
        title: 'Batas Kredit (Credit Limit) per Pelanggan',
        detail: 'Setiap kontraktor memiliki plafon kredit; transaksi baru akan dicek agar tidak melebihi sisa limit yang aman.'
      },
      {
        title: 'Riwayat Pembayaran Cicilan / Pelunasan',
        detail: 'Mencatat cicilan bertahap piutang beserta metode bayar (Transfer/Tunai) dan kwitansi resmi.'
      },
      {
        title: 'Notifikasi Jatuh Tempo Terintegrasi',
        detail: 'Lonceng notifikasi di Topbar memberi peringatan otomatis saat ada faktur kontraktor yang mendekati atau melewati jatuh tempo.'
      }
    ],
    tips: 'Periksa selalu sisa limit kredit pelanggan sebelum menyetujui transaksi tempo atau pengiriman material proyek jumlah besar.'
  },
  {
    id: 'pengiriman-surat-jalan',
    url: 'http://localhost:3000/transaksi?tab=pengiriman',
    filename: '06-pengiriman-surat-jalan.png',
    title: 'Surat Jalan & Manajemen Pengiriman Proyek',
    category: 'Logistik & Armada',
    badge: 'Tracking Armada',
    badgeColor: '#3B82F6',
    description: 'Sistem pengiriman armada material proyek dilengkapi nomor surat jalan resmi, jadwal rute, dan pemilihan sopir.',
    features: [
      {
        title: 'Manajemen Armada & Sopir',
        detail: 'Pilihan armada toko: Pickup L300 (W 8920 UZ) dan Truk Engkel (W 9102 PQ) beserta sopir penanggung jawab (Pak Joko / Pak Anto).'
      },
      {
        title: 'Surat Jalan Otomatis (No. SJ)',
        detail: 'Penomoran surat jalan resmi terstandar (contoh: SJ-20261011-001) yang tertaut langsung dengan nomor nota kasir.'
      },
      {
        title: 'Tracking Status Pengiriman',
        detail: 'Status pengiriman terpadu: Disiapkan di Gudang, Dalam Perjalanan Pengantaran, hingga Terkirim dengan nama penerima.'
      },
      {
        title: 'Ongkos Kirim Otomatis / Manual',
        detail: 'Kalkulasi tarif ongkir berdasarkan armada dan jarak proyek dengan opsi gratis ongkir untuk pelanggan loyal.'
      }
    ],
    tips: 'Cetak surat jalan dalam format thermal atau A4 untuk diserahkan ke sopir sebagai bukti serah terima material di lokasi proyek.'
  },
  {
    id: 'penawaran-quotation',
    url: 'http://localhost:3000/transaksi?tab=penawaran',
    filename: '07-penawaran-quotation.png',
    title: 'Surat Penawaran Harga (Quotation Resmi)',
    category: 'Penjualan Proyek',
    badge: 'Konversi Instan',
    badgeColor: '#8B5CF6',
    description: 'Pembuatan surat penawaran harga resmi (Quotation) untuk tender proyek kontraktor dengan masa berlaku harga material.',
    features: [
      {
        title: 'Surat Penawaran Berstandar Formal',
        detail: 'Mencantumkan nomor penawaran, tanggal terbit, masa berlaku penawaran (7-30 hari), nama proyek, dan syarat pembayaran.'
      },
      {
        title: 'Kunci Harga Material Proyek',
        detail: 'Menjamin stabilitas harga material (seperti besi atau semen) selama masa berlakunya penawaran disepakati.'
      },
      {
        title: 'Konversi 1-Klik ke Pesanan (SO)',
        detail: 'Saat kontraktor menyetujui penawaran, kasir cukup menekan satu tombol untuk mengubahnya menjadi Sales Order resmi.'
      },
      {
        title: 'Langsung Buka di Kasir POS',
        detail: 'Bisa langsung memuat barang-barang di penawaran ke keranjang kasir POS untuk langsung ditransaksikan.'
      }
    ],
    tips: 'Kirim surat penawaran ke format dokumen A4 untuk dikirim via WhatsApp atau dicetak fisik saat tender proyek.'
  },
  {
    id: 'pesanan-so',
    url: 'http://localhost:3000/transaksi?tab=pesanan',
    filename: '08-pesanan-so.png',
    title: 'Pesanan Penjualan (Sales Order / SO)',
    category: 'Penjualan Proyek',
    badge: 'Manajemen Order',
    badgeColor: '#06B6D4',
    description: 'Manajemen pemesanan barang sebelum pengiriman atau sebelum pelunasan pembayaran oleh kontraktor/pembeli partai besar.',
    features: [
      {
        title: 'Booking Stok Material',
        detail: 'Mencatat komitmen kebutuhan material proyek pelanggan sehingga stok tidak terjual ke pembeli lain.'
      },
      {
        title: 'Tracking Status Pesanan',
        detail: 'Status terstruktur: Menunggu Konfirmasi, Dikonfirmasi / Siap Kirim, Selesai Ditransaksikan, atau Dibatalkan.'
      },
      {
        title: 'Integrasi Uang Muka (DP)',
        detail: 'Mendukung pencatatan DP awal dan penghitungan sisa pelunasan saat material tiba di lokasi proyek.'
      },
      {
        title: 'Konversi Cepat Menjadi Transaksi Kasir',
        detail: 'Tombol "Proses ke Kasir" memindahkan seluruh item pesanan ke pembayaran kasir dalam hitungan detik.'
      }
    ],
    tips: 'Gunakan SO untuk proyek bertahap (termin) di mana barang dikirim dalam beberapa rit pengantaran terpisah.'
  },
  {
    id: 'manajemen-produk',
    url: 'http://localhost:3000/produk',
    filename: '09-manajemen-produk.png',
    title: 'Katalog Produk & Master Multi-Satuan',
    category: 'Inventori & Master Data',
    badge: 'Multi-Satuan Material',
    badgeColor: '#10B981',
    description: 'Pengelolaan data master barang toko bangunan dengan konfigurasi satuan turunan dan penetapan harga bertingkat.',
    features: [
      {
        title: 'Hierarki Multi-Satuan per Produk',
        detail: 'Mendefinisikan satuan terkecil dan satuan grosir (misal: 1 Sak = 1 Sak, 1 Palet = 40 Sak; 1 Rit = 6 m3).'
      },
      {
        title: 'Harga Bertingkat 3-Tier',
        detail: 'Pengaturan terpisah untuk Harga Eceran, Harga Grosir (dengan minimal beli), dan Harga Khusus Kontraktor.'
      },
      {
        title: 'Manajemen Stok & Batas Minimum',
        detail: 'Menentukan ambang batas minimum stok (Buffer Stock) agar sistem mengirim notifikasi sebelum barang habis.'
      },
      {
        title: 'Pencarian & Filter Kategori Terlengkap',
        detail: 'Kategori spesifik toko bangunan: Semen & Perekat, Besi & Baja, Cat & Pelapis, Pipa & Sanitasi, Keramik & Lantai, Bahan Pokok.'
      }
    ],
    tips: 'Pastikan faktor pengali satuan turunan diisi dengan benar agar potongan stok kasir terhitung akurat dalam satuan dasar.'
  },
  {
    id: 'riwayat-struk',
    url: 'http://localhost:3000/transaksi?tab=riwayat',
    filename: '10-riwayat-struk.png',
    title: 'Riwayat Transaksi & Cetak Nota / Faktur A4',
    category: 'Dokumen & Pembukuan',
    badge: 'Cetak Thermal & A4',
    badgeColor: '#F5A800',
    description: 'Pusat arsip seluruh transaksi penjualan toko bangunan dengan pencarian nomor nota dan cetak ulang dokumen.',
    features: [
      {
        title: 'Pencarian Riwayat Cepat',
        detail: 'Cari riwayat transaksi berdasarkan Nomor Nota (TRX-xxxx / INV-xxxx), nama pembeli, atau filter rentang tanggal.'
      },
      {
        title: 'Cetak Struk Thermal 80mm',
        detail: 'Format cetak struk kasir thermal ringkas dan rapi, cocok untuk printer kasir mini Epson, Panda, atau printer Bluetooth.'
      },
      {
        title: 'Cetak Faktur Pajak & Surat Jalan Formal A4',
        detail: 'Format faktur formal berlogo toko lengkap dengan NPWP, alamat toko, rincian PPN, tanda tangan kasir dan penerima.'
      },
      {
        title: 'Status Pelunasan Nota',
        detail: 'Penanda jelas transaksi Selesai (Lunas), Belum Lunas (Tempo), atau Dibatalkan.'
      }
    ],
    tips: 'Gunakan tombol "Salin Teks Nota" untuk mengirimkan rincian pembelian langsung ke chat WhatsApp pelanggan.'
  },
  {
    id: 'laporan-keuangan',
    url: 'http://localhost:3000/laporan',
    filename: '11-laporan-keuangan.png',
    title: 'Laporan Penjualan & Analisis Laba Rugi',
    category: 'Laporan & Finansial',
    badge: 'Analisis Finansial',
    badgeColor: '#3B82F6',
    description: 'Laporan komprehensif untuk menganalisis pendapatan kotor, margin laba bersih, dan produk yang paling menguntungkan.',
    features: [
      {
        title: 'Ringkasan Finansial Periode',
        detail: 'Informasi Total Omset Penjualan, Total HPP (Harga Pokok Penjualan), Laba Kotor, dan Rata-rata Nilai Transaksi.'
      },
      {
        title: 'Analisis Komposisi Pembayaran',
        detail: 'Distribusi metode bayar pelanggan: Tunai, QRIS, Transfer Bank, dan Porsi Penjualan Kredit Tempo.'
      },
      {
        title: 'Ranking Produk Terlaris (Top Selling)',
        detail: 'Daftar produk dengan volume penjualan tertinggi dan kontribusi laba terbesar bagi toko bangunan.'
      },
      {
        title: 'Ekspor Data Laporan',
        detail: 'Dukungan untuk mencetak atau mengunduh laporan keuangan toko untuk keperluan rekap pembukuan akuntansi.'
      }
    ],
    tips: 'Owner dapat memantau perbandingan porsi tunai vs piutang untuk menjaga kesehatan arus kas (cash flow) toko.'
  },
  {
    id: 'pengaturan-toko',
    url: 'http://localhost:3000/pengaturan',
    filename: '12-pengaturan-toko.png',
    title: 'Pengaturan Toko & Manajemen Pengguna',
    category: 'Konfigurasi Sistem',
    badge: 'Kustomisasi Penuh',
    badgeColor: '#6B7280',
    description: 'Pusat konfigurasi identitas toko, ketentuan pajak PPN, tarif dasar armada logistik, dan profil tim karyawan.',
    features: [
      {
        title: 'Identitas & Kontak Toko',
        detail: 'Pengaturan nama toko (BanguMart), tagline, alamat cabang, nomor telepon resmi, dan NPWP untuk dokumen faktur.'
      },
      {
        title: 'Konfigurasi Pajak PPN (11%)',
        detail: 'Pengaturan aktivasi PPN transaksi, persentase tarif pajak, dan opsi apakah harga barang sudah termasuk pajak.'
      },
      {
        title: 'Tarif Dasar Armada Pengiriman',
        detail: 'Pengaturan tarif dasar pengantaran material dan tarif per kilometer untuk armada pickup dan truk engkel.'
      },
      {
        title: 'Manajemen Peran & Akses (Role)',
        detail: 'Daftar pengguna dengan peran Owner (Budi Santoso), Kasir (Rina Wulandari), Gudang (Hendra), dan Sopir (Pak Joko).'
      }
    ],
    tips: 'Perubahan pada identitas toko akan langsung tercermin pada kepala faktur dan struk kasir saat dicetak.'
  }
];

console.log('--- 1. CAPTURING SCREENSHOTS ---');
for (const page of pages) {
  const destPath = path.join(IMAGES_DIR, page.filename);
  console.log(`Capturing: ${page.title} -> ${page.filename}...`);
  const res = spawnSync(CHROME_PATH, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1280,800',
    '--virtual-time-budget=3500',
    '--screenshot=' + destPath,
    page.url
  ]);
  if (!fs.existsSync(destPath)) {
    console.error(`FAILED to capture: ${page.filename}`, res.stderr ? res.stderr.toString() : '');
  } else {
    console.log(`SUCCESS: ${page.filename} (${fs.statSync(destPath).size} bytes)`);
  }
}

console.log('--- 2. BUILDING MANUAL BOOK HTML ---');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>BanguMart POS - Manual Book & Panduan Penggunaan</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #F7F7F5;
      color: #1F2933;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .page {
      width: 297mm;
      height: 210mm;
      page-break-after: always;
      position: relative;
      background: #FFFFFF;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 16mm 18mm 14mm 18mm;
    }

    /* Cover Page */
    .page.cover {
      background: linear-gradient(135deg, #1F2933 0%, #111827 100%);
      color: #FFFFFF;
      justify-content: space-between;
      padding: 24mm;
    }

    .cover-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cover-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.5px;
    }

    .cover-logo-icon {
      width: 44px;
      height: 44px;
      background: #F5A800;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1F2933;
      font-weight: 900;
      font-size: 22px;
    }

    .cover-badge {
      background: rgba(245, 168, 0, 0.2);
      border: 1px solid rgba(245, 168, 0, 0.4);
      color: #F5A800;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 6px 14px;
      border-radius: 20px;
      text-transform: uppercase;
    }

    .cover-center {
      max-width: 820px;
    }

    .cover-title {
      font-size: 46px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -1px;
      margin-bottom: 16px;
    }

    .cover-title span {
      color: #F5A800;
    }

    .cover-subtitle {
      font-size: 18px;
      line-height: 1.5;
      color: #9CA3AF;
      font-weight: 500;
      margin-bottom: 24px;
    }

    .cover-pills {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .cover-pill {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      color: #E5E7EB;
    }

    .cover-bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 16px;
      font-size: 11px;
      color: #9CA3AF;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1.5px solid #ECECE8;
      margin-bottom: 12px;
      height: 38px;
    }

    .page-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 900;
      color: #1F2933;
    }

    .page-brand-icon {
      width: 22px;
      height: 22px;
      background: #F5A800;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      color: #1F2933;
    }

    .page-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: #6B7280;
      font-weight: 700;
    }

    .page-tag {
      background: #FFF7E0;
      border: 1px solid #FDEBB8;
      color: #B45309;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 800;
      text-transform: uppercase;
    }

    /* Content Layout: 2 Columns (Image on Left, Content on Right) */
    .page-content {
      display: grid;
      grid-template-columns: 53% 47%;
      gap: 16px;
      flex: 1;
      min-height: 0;
      align-items: stretch;
    }

    /* Left Column: Screenshot Frame */
    .col-image {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }

    .browser-frame {
      background: #FFFFFF;
      border-radius: 12px;
      border: 1.5px solid #E5E7EB;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .browser-header {
      background: #F3F4F6;
      border-bottom: 1px solid #E5E7EB;
      padding: 7px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .browser-dots {
      display: flex;
      gap: 5px;
    }

    .browser-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .dot-red { background: #EF4444; }
    .dot-yellow { background: #F59E0B; }
    .dot-green { background: #10B981; }

    .browser-url {
      flex: 1;
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      padding: 2px 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #6B7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .browser-body {
      background: #F9FAFB;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .browser-img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }

    .image-caption {
      margin-top: 6px;
      font-size: 10px;
      color: #6B7280;
      text-align: center;
      font-style: italic;
    }

    /* Right Column: Explanations */
    .col-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding-left: 6px;
    }

    .info-header {
      margin-bottom: 8px;
    }

    .feature-category {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #F5A800;
      margin-bottom: 2px;
    }

    .feature-title {
      font-size: 20px;
      font-weight: 900;
      color: #1F2933;
      line-height: 1.2;
      letter-spacing: -0.3px;
      margin-bottom: 4px;
    }

    .feature-desc {
      font-size: 11.5px;
      line-height: 1.45;
      color: #4B5563;
      font-weight: 500;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin: 8px 0;
      flex: 1;
      justify-content: center;
    }

    .feature-item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      background: #F7F7F5;
      padding: 7px 10px;
      border-radius: 8px;
      border: 1px solid #ECECE8;
    }

    .feature-icon-badge {
      width: 20px;
      height: 20px;
      background: #1F2933;
      color: #F5A800;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 900;
      shrink: 0;
      margin-top: 1px;
    }

    .feature-item-content {
      flex: 1;
    }

    .feature-item-title {
      font-size: 11px;
      font-weight: 800;
      color: #1F2933;
      margin-bottom: 1px;
    }

    .feature-item-detail {
      font-size: 10px;
      line-height: 1.35;
      color: #6B7280;
    }

    .callout-box {
      background: #FFF7E0;
      border: 1.5px solid #FDEBB8;
      border-radius: 8px;
      padding: 8px 12px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-top: 4px;
    }

    .callout-icon {
      font-size: 14px;
      line-height: 1;
    }

    .callout-text {
      font-size: 10px;
      line-height: 1.4;
      color: #92400E;
    }

    .callout-text strong {
      color: #78350F;
    }

    /* Page Footer */
    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid #ECECE8;
      margin-top: 8px;
      font-size: 9.5px;
      color: #9CA3AF;
      height: 22px;
    }

    .page-footer strong {
      color: #4B5563;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="page cover">
    <div class="cover-top">
      <div class="cover-logo">
        <div class="cover-logo-icon">B</div>
        <span>Bangu<span style="color:#F5A800;">Mart</span> POS</span>
      </div>
      <div class="cover-badge">Buku Panduan Pengguna (User Manual)</div>
    </div>

    <div class="cover-center">
      <h1 class="cover-title">
        Panduan Lengkap Sistem POS<br>
        <span>Toko Bangunan & Material</span>
      </h1>
      <p class="cover-subtitle">
        Dokumentasi resmi alur kerja kasir, multi-satuan material, otorisasi diskon peran, kalkulator estimasi konstruksi, manajemen piutang kontraktor, dan pengiriman armada surat jalan.
      </p>

      <div class="cover-pills">
        <div class="cover-pill">✓ Kasir Fullscreen Tanpa Scroll</div>
        <div class="cover-pill">✓ Multi-Satuan (Sak/Palet/m3/Rit)</div>
        <div class="cover-pill">✓ Diskon Rp & % (Owner vs Kasir)</div>
        <div class="cover-pill">✓ Aging Piutang Kontraktor</div>
        <div class="cover-pill">✓ Surat Jalan & Armada Sopir</div>
        <div class="cover-pill">✓ Estimator Kebutuhan Material</div>
      </div>
    </div>

    <div class="cover-bottom">
      <div>
        <p><strong>BanguMart POS v0.1.0</strong> • Edisi Toko Bangunan & Retail Proyek</p>
        <p>Pengembang: Tim Antigravity Engineering • Gresik / Jawa Timur</p>
      </div>
      <div style="text-align: right;">
        <p>Format Dokumen: <strong>PDF Resmi</strong></p>
        <p>Oktober 2026</p>
      </div>
    </div>
  </div>

  <!-- FEATURE PAGES -->
  ${pages.map((p, idx) => {
    const pageNum = idx + 2;
    return `
  <div class="page">
    <div class="page-header">
      <div class="page-brand">
        <div class="page-brand-icon">B</div>
        <span>BanguMart POS • Buku Panduan</span>
      </div>
      <div class="page-meta">
        <span class="page-tag" style="background:${p.badgeColor}20; color:${p.badgeColor}; border-color:${p.badgeColor}40;">${p.badge}</span>
        <span>Halaman ${pageNum}</span>
      </div>
    </div>

    <div class="page-content">
      <!-- Kolom Kiri: Screenshot -->
      <div class="col-image">
        <div class="browser-frame">
          <div class="browser-header">
            <div class="browser-dots">
              <div class="browser-dot dot-red"></div>
              <div class="browser-dot dot-yellow"></div>
              <div class="browser-dot dot-green"></div>
            </div>
            <div class="browser-url">${p.url}</div>
          </div>
          <div class="browser-body">
            <img class="browser-img" src="./images/${p.filename}" alt="${p.title}" />
          </div>
        </div>
        <div class="image-caption">Gambar ${idx + 1}: Tampilan antarmuka ${p.title}</div>
      </div>

      <!-- Kolom Kanan: Penjelasan Fitur -->
      <div class="col-info">
        <div class="info-header">
          <div class="feature-category">${p.category}</div>
          <h2 class="feature-title">${p.title}</h2>
          <p class="feature-desc">${p.description}</p>
        </div>

        <div class="features-list">
          ${p.features.map((f, fIdx) => `
          <div class="feature-item">
            <div class="feature-icon-badge">${fIdx + 1}</div>
            <div class="feature-item-content">
              <div class="feature-item-title">${f.title}</div>
              <div class="feature-item-detail">${f.detail}</div>
            </div>
          </div>
          `).join('')}
        </div>

        <div class="callout-box">
          <span class="callout-icon">💡</span>
          <div class="callout-text">
            <strong>Tips Penggunaan:</strong> ${p.tips}
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>BanguMart POS Manual Book • Dokumen Resmi Pengguna</span>
      <span><strong>Halaman ${pageNum} dari ${pages.length + 1}</strong></span>
    </div>
  </div>
    `;
  }).join('\n')}

</body>
</html>
`;

const htmlPath = path.join(MANUAL_DIR, 'index.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
console.log(`Saved HTML: ${htmlPath}`);

console.log('--- 3. PRINTING PDF VIA CHROME HEADLESS ---');
const pdfPath = path.join(MANUAL_DIR, 'Manual-Book-BanguMart-POS.pdf');

const pdfRes = spawnSync(CHROME_PATH, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--print-to-pdf=' + pdfPath,
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=2000',
  'file:///' + htmlPath.replace(/\\/g, '/')
]);

if (fs.existsSync(pdfPath)) {
  const size = fs.statSync(pdfPath).size;
  console.log(`SUCCESS: PDF Generated at ${pdfPath} (${size} bytes)`);

  // Mirror to "maual book" folder as requested
  const mirrorPdfPath = path.join(MAUAL_DIR, 'Manual-Book-BanguMart-POS.pdf');
  const mirrorHtmlPath = path.join(MAUAL_DIR, 'index.html');
  fs.copyFileSync(pdfPath, mirrorPdfPath);
  fs.copyFileSync(htmlPath, mirrorHtmlPath);

  // Mirror images
  const mirrorImagesDir = path.join(MAUAL_DIR, 'images');
  if (!fs.existsSync(mirrorImagesDir)) fs.mkdirSync(mirrorImagesDir, { recursive: true });
  for (const p of pages) {
    const srcImg = path.join(IMAGES_DIR, p.filename);
    const destImg = path.join(mirrorImagesDir, p.filename);
    if (fs.existsSync(srcImg)) fs.copyFileSync(srcImg, destImg);
  }
  console.log(`SUCCESS: Mirrored to ${MAUAL_DIR}`);
} else {
  console.error('FAILED to generate PDF:', pdfRes.stderr ? pdfRes.stderr.toString() : '');
}

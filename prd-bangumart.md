# PRD: BanguMart POS (Sistem POS Toko Bangunan)

**Versi:** 1.0
**Tanggal:** 11 Oktober 2026
**Status:** Draft
**Lingkup:** Frontend saja dengan data dummy (tanpa backend dan database)
**Slogan:** "Kelola Toko Bangunan Jadi Lebih Mudah"

---

## 1. Ringkasan

BanguMart adalah aplikasi web POS (point of sale) untuk toko bangunan. Aplikasi membantu pencatatan transaksi, manajemen stok, data pelanggan, pembelian dari supplier, pengiriman barang, serta laporan penjualan dan keuangan dalam satu sistem.

Tahap ini hanya membangun **tampilan (UI) yang responsif dengan data dummy**. Tujuannya untuk validasi desain dan alur kerja sebelum backend (Supabase) dibuat. Seluruh aksi (simpan, ubah, bayar, kirim) hanya mengubah state lokal.

Tampilan mengacu pada gambar referensi BanguMart: latar putih bersih, aksen **kuning amber**, teks **charcoal gelap**, kartu putih bersudut membulat, serta kesan modern dan industrial.

### Kenapa berbeda dari POS toko biasa
Toko bangunan punya kebutuhan khusus yang harus tampak di desain:
- Satu barang bisa dijual dalam **banyak satuan** (sak, dus, batang, m², kg, roll).
- **Harga bertingkat** (eceran, grosir, kontraktor).
- **Penjualan kredit dan piutang** untuk kontraktor langganan.
- **Pengiriman ke lokasi proyek** dan dokumen seperti faktur dan surat jalan.
- **Penawaran harga** dan pesanan sebelum transaksi.

## 2. Tujuan dan Non-Tujuan

### Tujuan
- Menyediakan seluruh halaman utama dengan tampilan konsisten dan profesional.
- Menampilkan alur lengkap: penawaran, pesanan, kasir, pembayaran (tunai atau kredit), pengiriman, hingga pelunasan piutang.
- Responsif di laptop, tablet, dan handphone, termasuk tombol **Scan Barcode** di handphone.
- Semua data dari file dummy lokal agar mudah diganti dengan API nanti.
- Komponen reusable untuk disambungkan ke Supabase pada tahap berikutnya.

### Non-Tujuan (tidak dikerjakan sekarang)
- Autentikasi sungguhan, database, dan API.
- Integrasi printer, scanner barcode fisik, dan payment gateway.
- Mode offline dan sinkronisasi data.
- Integrasi pajak resmi (e-Faktur) dan akuntansi.
- Perhitungan HPP, pajak, dan stok yang divalidasi server.

## 3. Pengguna dan Peran

| Peran | Kebutuhan utama |
|---|---|
| Owner | Melihat dashboard dan laporan, menyetujui diskon, harga khusus, dan kredit |
| Admin | Mengelola produk, harga, supplier, pelanggan, dan pengaturan |
| Kasir | Transaksi, cetak nota, terima pembayaran, dan pelunasan piutang |
| Staf Gudang | Cek stok, penerimaan barang, penyiapan pesanan, dan stok opname |
| Sopir / Pengiriman | Melihat daftar kirim dan memperbarui status pengiriman |

Pada tahap tampilan, peran hanya mengubah menu yang terlihat (pengalih peran dummy di Pengaturan). Pengguna dummy: **Budi Santoso** (Admin/Owner).

## 4. Design System (Acuan dari Gambar)

### 4.1 Palet Warna

| Token | Hex (perkiraan) | Penggunaan |
|---|---|---|
| `primary` | `#F5A800` | Tombol utama, menu aktif, banner Scan Barcode, batang grafik utama, logo |
| `primary-hover` | `#DB9500` | Hover tombol utama |
| `primary-soft` | `#FDEBB8` | Lingkaran ikon fitur, latar menu aktif ringan, highlight |
| `primary-subtle` | `#FFF7E0` | Latar badge dan area sorotan sangat ringan |
| `dark` | `#1F2933` | Judul, angka utama, footer, teks gelap pada tombol kuning |
| `dark-soft` | `#3F4650` | Bagian logo (jendela rumah), ikon sekunder |
| `bg-page` | `#F7F7F5` | Latar halaman |
| `bg-card` | `#FFFFFF` | Kartu, tabel, topbar, sidebar |
| `border` | `#ECECE8` | Garis kartu dan pemisah tabel |
| `text-secondary` | `#6B7280` | Label, subjudul, teks pendukung |
| `chart-secondary` | `#A9AEB5` | Batang abu pada grafik (seri Transaksi) |
| `success` | `#16A34A` | Persentase naik, status selesai |
| `success-soft` | `#DCFCE7` | Latar badge "Selesai" |
| `danger` | `#E5484D` | "Perlu restock", "Segera restock", persentase turun |
| `danger-soft` | `#FEE2E2` | Latar badge bahaya |
| `info` | `#2563EB` | Status diproses / dikirim |
| `info-soft` | `#DBEAFE` | Latar badge diproses |
| `warning` | `#F59E0B` | Status menunggu / jatuh tempo dekat |
| `warning-soft` | `#FEF3C7` | Latar badge menunggu |

> Warna adalah perkiraan dari gambar. Boleh disesuaikan sedikit selama nuansa **kuning amber + charcoal + putih** terjaga. Semua token dipusatkan di konfigurasi Tailwind.

**Catatan penggunaan warna:** tombol kuning memakai teks `dark` (bukan putih) agar kontras terbaca. Item sidebar aktif memakai latar `primary` dengan teks `dark` tebal.

### 4.2 Tipografi
- Font: **Inter** (alternatif: Plus Jakarta Sans).
- Judul halaman: 24px, semibold, warna `dark`.
- Angka statistik: 24 sampai 28px, bold.
- Label dan isi tabel: 12 sampai 14px, regular.
- Teks sekunder: 12px, `text-secondary`.
- Judul pemasaran (opsional, halaman login): 36 sampai 48px, extrabold, dengan kata penekanan berwarna `primary` (contoh: "Jadi **Lebih Mudah**").

### 4.3 Komponen Dasar
- **Kartu:** putih, radius 12px, border `border`, bayangan sangat tipis.
- **Tombol utama:** latar `primary`, teks `dark`, semibold, radius 8px.
- **Tombol sekunder:** putih dengan border `border`; **tombol bahaya:** merah.
- **Badge status:** pill kecil, latar lembut dan teks tebal sewarna.
- **Input pencarian:** radius penuh, ikon kaca pembesar, placeholder "Cari produk, kode barang, atau nama pelanggan...".
- **Ikon fitur:** ikon garis dalam lingkaran `primary-soft`.
- **Sidebar aktif:** blok `primary` penuh dengan ikon dan teks `dark`.
- **Tabel:** header abu muda, baris dipisah garis tipis, tanpa zebra.
- **Grafik:** batang `primary` (Penjualan) dan `chart-secondary` (Transaksi), legenda di atas grafik.
- **Banner Scan Barcode (handphone):** blok `primary` lebar penuh, ikon scan di kiri, teks "Scan Barcode" dan "Langsung ke transaksi", panah di kanan.

### 4.4 Logo dan Identitas
- Logo: ikon **rumah dengan atap garis kuning** dan jendela empat kotak (abu), dengan teks **BanguMart** tebal dan subjudul "POS Toko Bangunan".
- Favicon: ikon rumah saja.
- Ikon rumah dibuat sebagai SVG sendiri (bukan menyalin gambar referensi persis); boleh disederhanakan.

### 4.5 Breakpoint

| Perangkat | Lebar | Layout |
|---|---|---|
| Laptop / desktop | ≥ 1024px | Sidebar tetap + konten penuh |
| Tablet | 640 sampai 1023px | Sidebar ringkas atau dapat dilipat, grid 2 kolom |
| Handphone | < 640px | Tanpa sidebar; **bottom navigation**, menu grid, dan banner Scan Barcode |

## 5. Struktur Navigasi

### Sidebar (laptop dan tablet), sesuai referensi
1. Dashboard
2. Transaksi
3. Produk
4. Stok
5. Pelanggan
6. Supplier
7. Laporan
8. Pengaturan

Halaman yang lebih kompleks memakai **tab di dalam halaman** agar sidebar tetap ringkas:

| Menu | Tab di dalamnya |
|---|---|
| Transaksi | Kasir, Riwayat, Penawaran, Pesanan, Pengiriman |
| Produk | Daftar Produk, Kategori, Satuan & Harga |
| Stok | Ringkasan Stok, Mutasi, Stok Opname |
| Pelanggan | Daftar Pelanggan, Piutang |
| Supplier | Daftar Supplier, Pembelian (PO), Hutang |
| Laporan | Penjualan, Laba Rugi, Piutang & Hutang, Stok, Pengiriman |
| Pengaturan | Profil Toko, Pengguna & Peran, Nota & Dokumen, Pajak, Pengiriman, Tampilan |

### Topbar
- Logo BanguMart (di sidebar atau kiri atas).
- Kolom pencarian global.
- Ikon notifikasi (bell) dengan penanda angka (stok menipis, piutang jatuh tempo, pengiriman hari ini).
- Avatar dan nama pengguna ("Budi S.") dengan dropdown (Profil, Ganti Peran, Keluar).

### Bottom Navigation (handphone)
Beranda, Transaksi, Produk, Lainnya (berisi Stok, Pelanggan, Supplier, Laporan, Pengaturan).

## 6. Spesifikasi Halaman

### 6.1 Dashboard (sesuai referensi)

**Header:** "Halo, Budi Santoso 👋" dan subjudul "Selamat datang kembali di BanguMart."

**Empat kartu statistik utama:**

| Kartu | Nilai | Keterangan |
|---|---|---|
| Total Penjualan Hari Ini | Rp 4.850.000 | ↑ 12% dari kemarin (hijau) |
| Jumlah Transaksi | 24 | ↑ 8% dari kemarin |
| Produk Terjual | 56 | ↑ 14% dari kemarin |
| Stok Menipis | 8 | ↓ "Perlu restock" (merah) |

**Kartu tambahan khas toko bangunan** (baris kedua, lebih kecil):
- Piutang Belum Lunas: total nominal dan jumlah faktur.
- Jatuh Tempo Minggu Ini.
- Pengiriman Hari Ini (jumlah dan yang sedang di jalan).
- Pesanan Menunggu Disiapkan.

**Grafik Penjualan:** bar chart dua seri (Penjualan kuning, Transaksi abu) untuk 7 hari terakhir, dropdown periode ("7 Hari Terakhir", "30 Hari", "Bulan Ini"), sumbu Y dalam juta.

**Produk Terlaris:** 5 produk dengan gambar, nama, satuan, dan jumlah terjual.

**Transaksi Terbaru:** tabel No. Transaksi, Tanggal, Pelanggan, Total, Status; tautan "Lihat semua".

**Responsif:**
- Laptop: statistik 4 kolom, grafik dan produk terlaris berdampingan, tabel di bawah grafik.
- Tablet: grafik di atas, produk terlaris dan tabel disusun ke bawah.
- Handphone: sapaan, **banner Scan Barcode**, menu grid 3x2 (Transaksi, Produk, Stok, Pelanggan, Laporan, Pengaturan), kartu "Penjualan Hari Ini", dan daftar **Produk Stok Menipis** dengan label "Segera restock".

### 6.2 Transaksi

#### a. Kasir (POS)
- Layout dua panel: **katalog produk** (kiri) dan **keranjang** (kanan).
- Pencarian cepat berdasarkan nama, kode barang, atau barcode; filter kategori (chip). Tombol **Scan Barcode** (simulasi dengan memilih produk acak atau input kode).
- Kartu produk: gambar, nama, merek, harga sesuai tingkat pelanggan, stok, dan pilihan satuan.
- **Pilih satuan saat memasukkan barang** (contoh: Keramik per dus atau per m²; Kabel per roll atau per meter). Harga dan stok menyesuaikan satuan.
- Keranjang: jumlah (bisa desimal untuk barang curah), ubah satuan, ubah harga per item (dengan persetujuan, dummy), diskon per item dan total, catatan item.
- **Pilih pelanggan:** umum, tukang, kontraktor, atau toko. Harga otomatis mengikuti tingkat pelanggan (eceran, grosir, kontraktor).
- Ringkasan: subtotal, diskon, PPN (opsi), biaya kirim, total.
- Metode bayar: Tunai, Transfer, QRIS, Kartu, **Kredit/Tempo**, dan **DP + sisa tempo**. Mendukung pembayaran terpisah (split).
- **Kredit/Tempo:** pilih jatuh tempo (7, 14, 30 hari), tampilkan limit kredit dan sisa limit pelanggan, peringatan bila melebihi limit.
- Opsi **Perlu Dikirim:** buka form alamat proyek, tanggal kirim, sopir, dan biaya kirim.
- Tombol **Tahan Transaksi** (hold) dan **Buat Penawaran**.
- Modal pembayaran: uang diterima, kembalian otomatis, lalu modal **Nota/Faktur** yang bisa dicetak (tampilan saja).
- Handphone: keranjang tampil sebagai bottom sheet.

#### b. Riwayat
- Tabel semua transaksi dengan filter tanggal, status, metode bayar, dan pelanggan.
- Klik baris membuka detail: item, satuan, pembayaran, status kirim, tombol **Cetak Nota**, **Cetak Faktur**, **Retur**.
- Status: Selesai, Belum Lunas, Dibatalkan, Diretur.
- **Retur:** pilih item dan jumlah, alasan (rusak, salah ukuran, salah pesan), dan jenis pengembalian (uang, kredit toko, tukar barang).

#### c. Penawaran (Quotation)
- Daftar penawaran: No., tanggal, pelanggan, proyek, total, masa berlaku, status (Draft, Terkirim, Disetujui, Ditolak, Kedaluwarsa).
- Buat penawaran dari keranjang atau form baru.
- Aksi: **Kirim via WhatsApp** (pratinjau pesan), **Cetak PDF**, dan **Ubah jadi Pesanan** atau **Ubah jadi Transaksi**.

#### d. Pesanan (Sales Order)
- Daftar pesanan dengan status: Baru, Disiapkan, Siap Diambil/Dikirim, Selesai, Dibatalkan.
- Detail menampilkan DP yang sudah dibayar dan sisa tagihan.
- Gudang dapat mengubah status ke "Disiapkan" dan "Siap".

#### e. Pengiriman
- Daftar dan papan status: **Dijadwalkan → Disiapkan → Dalam Perjalanan → Diterima**.
- Kartu berisi: no. pengiriman, pelanggan, alamat proyek, tanggal dan jam, sopir, kendaraan, dan ringkasan barang.
- Aksi: **Cetak Surat Jalan**, ubah status, dan **Bukti Terima** (area tanda tangan atau unggah foto, simulasi).
- Biaya kirim dihitung dari jarak atau tonase (dummy, tabel tarif di Pengaturan).
- Tampilan kalender pengiriman per hari untuk melihat beban sopir.

### 6.3 Produk

#### a. Daftar Produk
- Tabel: gambar, nama, kode/SKU, kategori, merek, satuan dasar, harga jual, stok, dan status.
- Pencarian, filter kategori dan merek, filter stok (aman, menipis, habis).
- **Tambah/Ubah Produk** lewat modal atau halaman form:
  - Informasi dasar: nama, kode, barcode, kategori, merek, deskripsi, foto.
  - **Satuan dan konversi:** satuan dasar dan satuan lain dengan faktor konversi (contoh: 1 dus = 4 pcs = 0,64 m²).
  - **Harga bertingkat per satuan:** eceran, grosir (dengan minimal jumlah), dan kontraktor.
  - Harga beli terakhir dan margin otomatis.
  - Stok minimum, lokasi gudang/rak, dan opsi barang curah (boleh desimal).
  - Varian (ukuran, ketebalan, warna) sebagai baris tabel.
  - Opsi tanggal kedaluwarsa (untuk semen, cat, lem).
- Handphone: tampilan kartu menggantikan tabel.

#### b. Kategori
Semen & Perekat, Besi & Baja, Cat & Pelapis, Pipa & Sanitasi, Keramik & Lantai, Kayu & Triplek, Listrik, Perkakas, Atap & Plafon, Pasir/Batu/Material Curah, Paku/Baut/Fitting.

#### c. Satuan & Harga
- Tabel pengelolaan satuan (sak, dus, batang, lembar, kaleng, roll, m, m², m³, kg, pcs).
- Pengaturan tingkat harga (eceran, grosir, kontraktor) dan aturan harga grosir berdasarkan jumlah.
- **Riwayat perubahan harga beli dan jual** per produk.

### 6.4 Stok
- Kartu ringkasan: total produk, stok menipis, stok habis, nilai persediaan, dan akan kedaluwarsa.
- Tabel stok dengan indikator warna (aman, menipis, habis) dan lokasi gudang.
- Daftar **Perlu Restock** dengan tombol **Buat PO** (membuka form pembelian dengan item terisi).
- **Mutasi Stok:** barang masuk, keluar, retur, dan penyesuaian, dengan filter tanggal.
- **Stok Opname:** form hitung fisik per produk, selisih otomatis, dan tombol **Terapkan Penyesuaian** (dummy).
- Perhitungan nilai persediaan (rata-rata harga beli, dummy).

### 6.5 Pelanggan

#### a. Daftar Pelanggan
- Tabel/kartu: nama, tipe (Umum, Tukang, Kontraktor, Toko), kontak, total belanja, sisa piutang, dan limit kredit.
- Filter tipe dan status piutang. Tombol **+ Tambah Pelanggan**.

#### b. Detail Pelanggan
- Profil: nama, perusahaan, NPWP (opsional), kontak, alamat, tingkat harga, **limit kredit**, dan termin default.
- **Daftar proyek:** satu pelanggan bisa memiliki beberapa proyek, tiap proyek punya alamat, nama proyek, dan riwayat belanja sendiri.
- Tab: Riwayat Transaksi, Piutang, Penawaran, Pengiriman, Catatan.
- **Poin/komisi loyalitas** untuk tukang dan kontraktor langganan (opsional, bagian Pengaturan).
- Penanda pelanggan bermasalah (sering telat bayar).

#### c. Piutang
- Ringkasan: total piutang, jatuh tempo minggu ini, dan sudah lewat jatuh tempo.
- Tabel faktur belum lunas: no. faktur, pelanggan, tanggal, jatuh tempo, total, terbayar, dan sisa. Badge: Belum Jatuh Tempo, Segera Jatuh Tempo, Terlambat.
- Aksi **Terima Pembayaran** (modal: nominal, metode, tanggal; bisa cicilan) dan **Kirim Pengingat** (pratinjau pesan WhatsApp).
- **Umur piutang** (aging): 0 sampai 30, 31 sampai 60, dan lebih dari 60 hari, dalam grafik batang.

### 6.6 Supplier

#### a. Daftar Supplier
- Nama, kontak, kategori produk, termin bayar, dan total hutang.
- Detail supplier: info, daftar produk yang disuplai dan harga terakhir, riwayat pembelian.

#### b. Pembelian (Purchase Order)
- Daftar PO dengan status: Draft, Dipesan, Diterima Sebagian, Diterima, Dibatalkan.
- Form PO: pilih supplier, tambah item (satuan, jumlah, harga beli), diskon, dan total.
- **Penerimaan barang:** centang item yang diterima, jumlah aktual, dan selisih; stok bertambah (state lokal).
- Perbandingan harga antar supplier untuk produk yang sama.

#### c. Hutang
- Tabel faktur supplier belum lunas dengan jatuh tempo.
- Aksi **Bayar Hutang** (nominal, metode) dan umur hutang.

### 6.7 Laporan
- Filter periode (hari ini, 7 hari, 30 hari, kustom) dan tombol **Ekspor** (menampilkan toast "Fitur segera hadir").
- **Penjualan:** omzet, jumlah transaksi, rata-rata nilai transaksi, grafik, dan produk terlaris.
- **Laba Rugi:** pendapatan, HPP, laba kotor, biaya operasional, dan laba bersih (dummy). Laba per produk dan per pelanggan.
- **Piutang & Hutang:** ringkasan dan umur tagihan.
- **Stok:** nilai persediaan, barang lambat laku, dan barang paling sering habis.
- **Pengiriman:** jumlah kirim, tepat waktu, dan biaya kirim.
- **Kinerja Kasir:** transaksi dan total per pengguna.
- **Kas:** kas masuk dan keluar per metode bayar.
- Grafik donut penjualan per kategori.

### 6.8 Pengaturan
- **Profil Toko:** nama, alamat, kontak, NPWP, logo.
- **Pengguna & Peran:** daftar pengguna, peran, dan tombol ubah. Pengalih peran dummy untuk melihat perbedaan menu.
- **Nota & Dokumen:** templat nota (struk kecil dan A4), faktur, surat jalan, dan penawaran, dengan pratinjau.
- **Pajak:** PPN aktif atau tidak, persentase, dan harga sudah termasuk pajak.
- **Pengiriman:** tarif per jarak/tonase, daftar sopir dan kendaraan.
- **Kredit:** limit default, termin default, dan aturan blokir transaksi.
- **Tampilan:** mode terang (default) dan opsi mode gelap sebagai pengembangan lanjutan.
- Semua tombol simpan hanya menampilkan toast sukses.

### 6.9 Halaman Pendukung
- **Login** dengan tampilan pemasaran: logo, judul "Kelola Toko Bangunan Jadi **Lebih Mudah**", empat fitur utama (Transaksi Cepat, Kelola Stok, Data Pelanggan, Laporan Penjualan), dan form masuk. Login hanya simulasi dan langsung masuk ke Dashboard.
- **Halaman 404** dan keadaan kosong (empty state) yang ramah.
- **Pusat Notifikasi:** stok menipis, piutang jatuh tempo, pengiriman hari ini, dan PO tiba.

## 7. Fitur Tambahan (Pembeda)

### Kalkulator Kebutuhan Material
Halaman atau modal yang menghitung kebutuhan material dari ukuran, lalu menambahkannya ke keranjang atau penawaran.
- **Keramik/lantai:** input panjang dan lebar ruangan, ukuran keramik, dan persen cadangan (default 10%). Hasil: jumlah dus.
- **Cat tembok:** input luas dinding, jumlah lapis, dan daya sebar. Hasil: jumlah kaleng.
- **Pondasi/cor (sederhana):** volume, hasil jumlah semen, pasir, dan kerikil (rasio dummy).
- Semua rumus dummy dan harus diberi catatan "perkiraan".

### Pelacakan Barang Curah
Pasir, batu, dan tanah dijual per m³ atau per rit (truk), lengkap dengan konversi dan biaya angkut.

### Paket / Bundel
Contoh: "Paket Pasang Keramik Kamar Mandi" berisi keramik, semen instan, nat, dan jasa.

## 8. Data Dummy

Simpan di folder `/data` dan ketik dengan TypeScript. Semua nama merek hanya contoh.

### 8.1 Statistik Dashboard (`stats.ts`)
```ts
export const stats = {
  penjualanHariIni: 4850000,
  jumlahTransaksi: 24,
  produkTerjual: 56,
  stokMenipis: 8,
  perubahan: { penjualan: 12, transaksi: 8, produk: 14 },
  piutang: { total: 38750000, faktur: 9, jatuhTempoMingguIni: 5 },
  pengirimanHariIni: { total: 4, dalamPerjalanan: 2 },
  pesananMenunggu: 3,
};
```

### 8.2 Grafik Penjualan 7 Hari
Dua seri: **Penjualan** (juta rupiah) dan **Transaksi** (jumlah, ditampilkan sebagai batang abu yang lebih kecil).

| Tanggal | Penjualan (Rp) | Transaksi |
|---|---|---|
| 12 Okt | 2.500.000 | 14 |
| 13 Okt | 3.800.000 | 20 |
| 14 Okt | 3.400.000 | 18 |
| 15 Okt | 4.500.000 | 22 |
| 16 Okt | 3.200.000 | 17 |
| 17 Okt | 4.300.000 | 23 |
| 18 Okt | 4.850.000 | 24 |

### 8.3 Produk Terlaris
| Produk | Satuan | Harga | Terjual |
|---|---|---|---|
| Semen Tiga Roda 50kg | sak | Rp 68.000 | 48 |
| Besi Beton 10mm | batang | Rp 92.000 | 36 |
| Cat Tembok Avian 5kg | kaleng | Rp 125.000 | 28 |
| Pipa PVC 3/4" | batang | Rp 18.000 | 21 |
| Keramik 40x40 | dus | Rp 85.000 | 18 |

> Pada gambar referensi, angka di bawah nama produk bisa berupa harga atau stok. Di PRD ini harga diisi dengan nilai realistis dan stok disediakan terpisah.

### 8.4 Transaksi Terbaru
| No. Transaksi | Tanggal | Pelanggan | Total | Status |
|---|---|---|---|---|
| TRX-0018 | 18 Okt 2025 | Toko Maju Jaya | Rp 750.000 | Selesai |
| TRX-0017 | 18 Okt 2025 | Andri Pratama | Rp 1.250.000 | Selesai |
| TRX-0016 | 17 Okt 2025 | Siti Nurhaliza | Rp 980.000 | Selesai |
| TRX-0015 | 17 Okt 2025 | UD. Sumber Rejeki | Rp 2.400.000 | Selesai |

### 8.5 Stok Menipis (dari referensi handphone)
| Produk | Stok | Label |
|---|---|---|
| Semen Tiga Roda | 3 sak | Segera restock |
| Cat Tembok Avian | 5 kaleng | Segera restock |
| Pipa PVC 3/4" | 7 batang | Segera restock |

Lengkapi sampai **8 produk** menipis agar sesuai angka di kartu statistik.

### 8.6 Produk (`products.ts`), minimal 40 item
Contoh struktur dan isi:

| Kode | Produk | Kategori | Satuan Dasar | Satuan Lain | Harga Eceran | Harga Grosir | Harga Kontraktor | Stok |
|---|---|---|---|---|---|---|---|---|
| SMN-001 | Semen Tiga Roda 50kg | Semen & Perekat | sak | palet (40 sak) | Rp 68.000 | Rp 66.000 | Rp 64.500 | 3 |
| BSI-010 | Besi Beton 10mm (12m) | Besi & Baja | batang | ikat (10 batang) | Rp 92.000 | Rp 89.000 | Rp 87.000 | 120 |
| BSI-008 | Besi Beton 8mm (12m) | Besi & Baja | batang | ikat (10 batang) | Rp 58.000 | Rp 56.000 | Rp 54.500 | 150 |
| CAT-005 | Cat Tembok Avian 5kg | Cat & Pelapis | kaleng | dus (4 kaleng) | Rp 125.000 | Rp 120.000 | Rp 117.000 | 5 |
| PVC-034 | Pipa PVC 3/4" (4m) | Pipa & Sanitasi | batang | ikat (20 batang) | Rp 18.000 | Rp 17.000 | Rp 16.200 | 7 |
| KRM-040 | Keramik 40x40 | Keramik & Lantai | dus (6 pcs = 0,96 m²) | m², pcs | Rp 85.000 | Rp 81.000 | Rp 78.000 | 85 |
| KBL-215 | Kabel NYM 2x1,5mm | Listrik | meter | roll (50 m) | Rp 7.500 | Rp 7.000 | Rp 6.800 | 420 |
| PSR-001 | Pasir Pasang | Material Curah | m³ | rit (4 m³) | Rp 220.000 | Rp 210.000 | Rp 200.000 | 18 |
| KYU-004 | Triplek 9mm (122x244) | Kayu & Triplek | lembar | - | Rp 135.000 | Rp 130.000 | Rp 126.000 | 40 |
| ATP-002 | Genteng Metal Pasir | Atap & Plafon | lembar | - | Rp 78.000 | Rp 75.000 | Rp 72.000 | 60 |

Lengkapi dengan paku, baut, lem, kuas, cangkul, kran air, lampu, saklar, dan lainnya sampai 40 item, termasuk 8 produk dengan stok di bawah minimum.

### 8.7 Pelanggan (`customers.ts`), minimal 12 data
| Nama | Tipe | Tingkat Harga | Limit Kredit | Sisa Piutang |
|---|---|---|---|---|
| Toko Maju Jaya | Toko | Grosir | Rp 20.000.000 | Rp 4.250.000 |
| Andri Pratama | Tukang | Grosir | Rp 5.000.000 | Rp 0 |
| Siti Nurhaliza | Umum | Eceran | Rp 0 | Rp 0 |
| UD. Sumber Rejeki | Kontraktor | Kontraktor | Rp 50.000.000 | Rp 18.600.000 |
| CV. Karya Bangun | Kontraktor | Kontraktor | Rp 75.000.000 | Rp 12.400.000 |
| Pak Haryanto | Tukang | Grosir | Rp 3.000.000 | Rp 1.500.000 |

Beri 1 sampai 3 **proyek** pada kontraktor, misalnya "Ruko Jl. Veteran, Gresik" dan "Perumahan Griya Asri Blok C".

### 8.8 Supplier (`suppliers.ts`), minimal 6 data
Contoh: PT. Semen Nusantara Distribusi (termin 14 hari), CV. Baja Utama (30 hari), PT. Cat Prima Abadi (14 hari), UD. Pipa Makmur (tunai), PT. Keramik Indah (30 hari), CV. Elektrik Jaya (14 hari).

### 8.9 Data Lain
- **Transaksi:** minimal 40 riwayat dengan campuran tunai, transfer, dan kredit; sebagian punya pengiriman.
- **Piutang:** 9 faktur belum lunas dengan umur berbeda (aman, segera jatuh tempo, terlambat).
- **Penawaran:** 6 data dengan status berbeda.
- **Pesanan:** 5 data dengan status berbeda.
- **Pengiriman:** 8 data (4 untuk hari ini, sisanya kemarin dan besok), dengan sopir **Pak Joko** dan **Pak Anto**, kendaraan "Pickup L300" dan "Truk Engkel".
- **Purchase order:** 6 data dengan status berbeda; **Hutang:** 4 faktur.
- **Pengguna:** Budi Santoso (Owner), Rina Wulandari (Kasir), Hendra (Staf Gudang), Pak Joko (Sopir).
- Gambar produk memakai ilustrasi sederhana atau emoji sebagai placeholder.

## 9. Struktur Folder yang Disarankan

```
bangumart-pos/
├── app/
│   ├── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # sidebar + topbar + bottom nav
│   │   ├── page.tsx                # Dashboard
│   │   ├── transaksi/
│   │   │   ├── page.tsx            # Kasir
│   │   │   ├── riwayat/page.tsx
│   │   │   ├── penawaran/page.tsx
│   │   │   ├── pesanan/page.tsx
│   │   │   └── pengiriman/page.tsx
│   │   ├── produk/page.tsx
│   │   ├── stok/page.tsx
│   │   ├── pelanggan/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── piutang/page.tsx
│   │   ├── supplier/
│   │   │   ├── page.tsx
│   │   │   ├── pembelian/page.tsx
│   │   │   └── hutang/page.tsx
│   │   ├── laporan/page.tsx
│   │   ├── kalkulator/page.tsx
│   │   └── pengaturan/page.tsx
│   └── globals.css
├── components/
│   ├── layout/    (Sidebar, Topbar, BottomNav, ScanBanner)
│   ├── ui/        (Card, Button, Badge, Table, Modal, Input, Tabs, Toast, EmptyState)
│   ├── dashboard/ (StatCard, SalesChart, TopProducts, RecentTransactions, LowStockList)
│   ├── pos/       (ProductGrid, UnitSelector, Cart, CreditPanel, PaymentModal, Invoice)
│   ├── delivery/  (DeliveryBoard, DeliveryCard, DeliveryNote)
│   ├── customer/  (CustomerForm, ProjectList, ReceivableTable, AgingChart)
│   └── tools/     (MaterialCalculator)
├── data/          (stats.ts, products.ts, customers.ts, suppliers.ts, transactions.ts, ...)
├── lib/           (format.ts untuk rupiah dan tanggal, units.ts untuk konversi satuan, pricing.ts)
└── tailwind.config.ts             # token warna dari bagian 4.1
```

Library yang disarankan: Next.js (App Router), React, TypeScript, Tailwind CSS, lucide-react, Recharts, Zustand, dan date-fns.

## 10. Alur Pengguna Utama

**A. Penjualan tunai di kasir**
Scan atau cari barang → pilih satuan → atur jumlah → pilih pelanggan (harga menyesuaikan) → Bayar → uang diterima dan kembalian → Nota.

**B. Penjualan kredit untuk kontraktor**
Pilih pelanggan kontraktor → cek limit kredit → tambah barang → pilih Kredit/Tempo dan jatuh tempo → tandai Perlu Dikirim (alamat proyek) → Simpan → Faktur dan Surat Jalan → piutang tercatat.

**C. Penawaran sampai transaksi**
Buat penawaran → Kirim via WhatsApp → Disetujui → Ubah jadi Pesanan → DP → Gudang menyiapkan → Pengiriman → Pelunasan.

**D. Pengiriman**
Dijadwalkan → Disiapkan → Dalam Perjalanan → Diterima (bukti terima) → transaksi selesai.

**E. Restock**
Notifikasi stok menipis → Buat PO ke supplier → Penerimaan barang → stok bertambah → hutang tercatat → Bayar hutang.

**F. Pelunasan piutang**
Menu Piutang → pilih faktur → Terima Pembayaran (penuh atau cicilan) → status diperbarui.

## 11. Aturan Bisnis (Disimulasikan di UI)
- Harga otomatis mengikuti **tingkat pelanggan**; harga grosir berlaku bila jumlah memenuhi minimum.
- Perubahan harga manual per item di kasir butuh persetujuan (modal PIN dummy).
- Transaksi kredit **diblokir** bila melebihi limit kredit, kecuali disetujui Owner (dummy).
- Konversi satuan memengaruhi harga dan pengurangan stok (misalnya 1 dus keramik = 0,96 m²).
- Stok tidak boleh negatif kecuali pengaturan "izinkan stok minus" aktif.
- Poin atau komisi hanya untuk tipe Tukang dan Kontraktor.
- Nomor dokumen berurutan dengan awalan: TRX (transaksi), INV (faktur), SJ (surat jalan), QT (penawaran), SO (pesanan), PO (pembelian).

## 12. Kebutuhan Non-Fungsional
- Seluruh teks antarmuka dalam **Bahasa Indonesia**.
- Format uang `Rp 4.850.000`, tanggal `18 Okt 2025`, dan jam 24 jam; satuan ditulis konsisten (sak, dus, batang, m²).
- Waktu muat awal di bawah 2 detik pada koneksi normal.
- Responsif di 360px, 768px, dan 1280px tanpa scroll horizontal.
- Area sentuh minimal 44px di handphone; kontras teks memenuhi WCAG AA (khususnya teks gelap pada latar kuning).
- Status tidak hanya dibedakan lewat warna; sertakan teks atau ikon.
- Pencarian dan filter pada tabel besar tetap lancar (paginasi atau virtualisasi untuk 500+ baris dummy).
- Tidak ada panggilan jaringan ke backend.
- Dukungan peramban modern: Chrome, Edge, Safari, Firefox (dua versi terakhir).

## 13. Kriteria Penerimaan
- [ ] Dashboard sesuai referensi dalam hal warna kuning amber, charcoal, tata letak, dan konten di laptop dan handphone (termasuk banner Scan Barcode dan daftar Stok Menipis).
- [ ] Seluruh 8 menu sidebar bisa dibuka dan berisi halaman dengan data dummy.
- [ ] Kasir dapat memilih satuan berbeda, harga mengikuti tingkat pelanggan, dan total terhitung benar.
- [ ] Transaksi kredit menampilkan limit dan sisa limit, serta memunculkan peringatan saat melebihi limit.
- [ ] Penawaran dapat diubah menjadi pesanan, dan pesanan menjadi transaksi.
- [ ] Papan pengiriman dapat mengubah status, dan surat jalan dapat ditampilkan untuk dicetak.
- [ ] Halaman Piutang menampilkan umur piutang dan modal terima pembayaran yang mengurangi sisa.
- [ ] Form PO dan penerimaan barang menambah stok di state lokal.
- [ ] Kalkulator material menghasilkan jumlah dus keramik dan kaleng cat dari input ukuran, dan bisa menambahkannya ke keranjang.
- [ ] Pencarian dan filter bekerja pada Produk, Stok, Pelanggan, dan Riwayat.
- [ ] Token warna dipusatkan di konfigurasi Tailwind, tidak ditulis ulang di komponen.
- [ ] Tidak ada scroll horizontal pada lebar 360px.
- [ ] Tidak ada panggilan jaringan ke backend.

## 14. Rencana Pengerjaan

| Tahap | Pekerjaan |
|---|---|
| 1 | Setup proyek, token desain (kuning amber dan charcoal), komponen UI dasar, logo |
| 2 | Layout: sidebar, topbar, bottom navigation, banner Scan Barcode, responsif |
| 3 | Halaman Dashboard sesuai referensi, plus kartu piutang dan pengiriman |
| 4 | Data dummy dan helper satuan dan harga (`units.ts`, `pricing.ts`) |
| 5 | Kasir: katalog, pilihan satuan, keranjang, harga bertingkat, pembayaran tunai, nota |
| 6 | Kredit/tempo, piutang, dan pelunasan |
| 7 | Produk dan Stok (termasuk form satuan dan harga, opname) |
| 8 | Pelanggan dengan proyek, Supplier, PO, dan Hutang |
| 9 | Penawaran, Pesanan, dan Pengiriman (surat jalan, bukti terima) |
| 10 | Laporan, Pengaturan, Login, dan Notifikasi |
| 11 | Kalkulator material dan paket/bundel |
| 12 | Poles responsif, aksesibilitas, dan pengujian alur A sampai F di tiga ukuran layar |

**Prioritas (MVP tampilan):** tahap 1 sampai 7. Tahap 8 sampai 11 dapat menyusul setelah inti kasir dan stok disetujui.

## 15. Tahap Selanjutnya (di Luar Lingkup)
- Backend Supabase: auth, tabel produk, satuan, harga, transaksi, pelanggan, piutang, supplier, PO, dan pengiriman.
- Pencetakan nyata ke printer thermal dan printer A4, serta pemindai barcode.
- Mode offline dan sinkronisasi.
- Integrasi WhatsApp Business untuk penawaran dan pengingat piutang.
- Integrasi e-Faktur, akuntansi, dan marketplace.
- Multi-gudang dan multi-cabang.
- Aplikasi sopir untuk bukti terima (foto, tanda tangan, dan lokasi).
- Katalog online dengan sinkronisasi stok.

## 16. Risiko dan Catatan
- Warna hex diperkirakan dari gambar dan perlu dicek ulang bila ada file desain asli.
- Data tanggal pada gambar referensi memakai tahun 2025; sesuaikan ke tahun berjalan (2026) saat implementasi bila diinginkan.
- Aturan konversi satuan dan harga bertingkat adalah bagian paling rawan salah. Sebaiknya dibuat fungsi terpusat dan diuji sejak awal.
- Rumus kalkulator material hanya perkiraan; harus diberi catatan agar tidak dianggap hitungan teknis resmi.
- Pemisahan "Harga sudah termasuk PPN" dan "PPN ditambahkan" harus jelas di UI agar tidak membingungkan kasir.
- Mengganti nama dari PawMart ke BanguMart: pastikan tidak ada istilah petshop yang tersisa di teks atau data dummy.

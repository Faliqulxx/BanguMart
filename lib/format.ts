export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, " ");
}

export function formatAngka(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return "0";
  return new Intl.NumberFormat("id-ID").format(num);
}

export function formatTanggal(dateStr: string | Date): string {
  if (!dateStr) return "-";
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return String(dateStr);
  
  const bulan = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];
  
  const d = date.getDate();
  const m = bulan[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export function formatTanggalWaktu(dateStr: string | Date): string {
  if (!dateStr) return "-";
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return String(dateStr);
  
  const tgl = formatTanggal(date);
  const jam = String(date.getHours()).padStart(2, "0");
  const menit = String(date.getMinutes()).padStart(2, "0");
  return `${tgl}, ${jam}:${menit} WIB`;
}

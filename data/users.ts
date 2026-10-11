export type UserRole = "Owner" | "Admin" | "Kasir" | "Staf Gudang" | "Sopir";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
}

export const initialUsers: UserProfile[] = [
  {
    id: "usr-1",
    name: "Budi Santoso",
    email: "budi.owner@bangumart.id",
    role: "Owner",
    avatar: "BS",
    phone: "0812-3344-5566",
  },
  {
    id: "usr-2",
    name: "Rina Wulandari",
    email: "rina.kasir@bangumart.id",
    role: "Kasir",
    avatar: "RW",
    phone: "0813-7788-9900",
  },
  {
    id: "usr-3",
    name: "Hendra Wijaya",
    email: "hendra.gudang@bangumart.id",
    role: "Staf Gudang",
    avatar: "HW",
    phone: "0856-4455-6677",
  },
  {
    id: "usr-4",
    name: "Pak Joko",
    email: "joko.driver@bangumart.id",
    role: "Sopir",
    avatar: "PJ",
    phone: "0877-1122-3344",
  },
];

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  npwp: string;
  taxEnabled: boolean;
  taxRatePercent: number; // e.g. 11
  taxIncluded: boolean;
  invoiceFormat: "thermal58" | "thermal80" | "a4";
  defaultCreditLimit: number;
  defaultCreditTermDays: number;
  deliveryTariffBase: number;
  deliveryTariffPerKm: number;
}

export const initialStoreSettings: StoreSettings = {
  storeName: "BanguMart",
  tagline: "Kelola Toko Bangunan Jadi Lebih Mudah",
  address: "Jl. Raya Menganti No. 128, Gresik, Jawa Timur",
  phone: "0812-3456-7890 / (031) 7912345",
  email: "halo@bangumart.id",
  npwp: "01.890.123.4-601.000",
  taxEnabled: false,
  taxRatePercent: 11,
  taxIncluded: true,
  invoiceFormat: "thermal80",
  defaultCreditLimit: 10000000,
  defaultCreditTermDays: 14,
  deliveryTariffBase: 50000,
  deliveryTariffPerKm: 5000,
};

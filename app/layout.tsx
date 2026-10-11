import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BanguMart POS - Kelola Toko Bangunan Jadi Lebih Mudah",
  description: "Sistem Point of Sale Modern dan Manajemen Toko Bangunan Terintegrasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F7F7F5] text-[#1F2933]">
        {children}
      </body>
    </html>
  );
}

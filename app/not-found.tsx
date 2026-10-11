import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center p-6 text-center">
      <Logo size="lg" className="mb-6" />
      <span className="text-6xl font-black text-[#F5A800]">404</span>
      <h2 className="text-xl font-black text-[#1F2933] mt-2">Halaman Tidak Ditemukan</h2>
      <p className="text-xs text-[#6B7280] max-w-sm mt-1 mb-6">
        Halaman yang Anda cari mungkin telah dipindahkan atau belum tersedia.
      </p>
      <Link href="/">
        <Button variant="primary" size="md" className="font-bold">
          Kembali ke Dashboard
        </Button>
      </Link>
    </div>
  );
}

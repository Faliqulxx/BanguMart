"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MitraLogo } from "@/components/ui/MitraLogo";
import { ToastContainer } from "@/components/ui/Toast";
import { useAppStore } from "@/lib/store";
import { initialUsers, UserRole } from "@/data/users";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  KeyRound,
  Mail,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Store,
  Layers,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentRole, showToast } = useAppStore();

  // Form states
  const [username, setUsername] = useState("budi.owner@bangumart.id");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("Owner");
  const [activeTab, setActiveTab] = useState<"login" | "forgot">("login");

  // Forgot password modal state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  // Quick select helper
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    const user = initialUsers.find((u) => u.role === role);
    if (user) {
      setUsername(user.email);
      setPassword("password123");
      showToast("Profil Demo Dipilih", `Akun ${user.name} (${role}) aktif`, "info");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      showToast("Gagal Masuk", "Harap masukkan Email atau Username", "error");
      return;
    }
    if (!password.trim()) {
      showToast("Gagal Masuk", "Harap masukkan Password", "error");
      return;
    }

    setIsLoading(true);

    // Simulate authentic network latency
    setTimeout(() => {
      setIsLoading(false);
      setCurrentRole(selectedRole);

      const matchedUser = initialUsers.find(
        (u) =>
          u.email.toLowerCase() === username.toLowerCase() ||
          u.name.toLowerCase().includes(username.toLowerCase())
      ) || { name: "Budi Santoso", role: selectedRole };

      showToast(
        "Login Berhasil",
        `Selamat datang kembali, ${matchedUser.name} (${selectedRole})!`,
        "success"
      );

      router.push("/");
    }, 700);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast("Perhatian", "Masukkan alamat email Anda terlebih dahulu", "warning");
      return;
    }

    setIsSubmittingForgot(true);
    setTimeout(() => {
      setIsSubmittingForgot(false);
      setForgotSent(true);
      showToast(
        "Instruksi Terkirim",
        `Tautan reset kata sandi telah dikirimkan ke ${forgotEmail}`,
        "success"
      );
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F9B816] select-none font-sans overflow-x-hidden">
      {/* Toast Notification Provider */}
      <ToastContainer />

      {/* ================= LEFT SECTION: ILUSTRASI HERO TOKO BANGUNAN ================= */}
      <div className="relative flex-1 bg-[#F9B816] flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[320px] lg:min-h-screen overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute inset-0 bg-radial from-[#FFCE38]/30 via-transparent to-transparent pointer-events-none" />

        {/* Illustration image container matching reference mockup */}
        <div className="relative w-full max-w-[920px] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] flex items-center justify-center drop-shadow-xl transition-transform duration-500 hover:scale-[1.01]">
          <Image
            src="/loginpage.jfif"
            alt="Ilustrasi Toko Bangunan Mitra Bangunan Material Jaya"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-contain object-center"
          />
        </div>

        {/* Floating badge bottom left */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 hidden sm:flex items-center gap-2.5 px-3.5 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-xs border border-white/20 shadow-lg">
          <Store className="w-4 h-4 text-[#F9B816]" />
          <span className="font-medium">
            POS Toko Bangunan &bull; <strong className="text-[#F9B816]">BanguMart</strong>
          </span>
        </div>
      </div>

      {/* ================= RIGHT SECTION: DARK FRAME WITH CREAM LOGIN CARD ================= */}
      <div className="w-full lg:w-[460px] xl:w-[500px] 2xl:w-[540px] shrink-0 bg-[#24272D] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[580px] lg:min-h-screen border-t lg:border-t-0 lg:border-l border-black/20 shadow-2xl relative">
        {/* Subtle dark pattern accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#32363E_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Main Cream Card */}
        <div className="relative w-full max-w-[420px] bg-[#FAF6EB] rounded-[32px] sm:rounded-[40px] p-7 sm:p-9 shadow-2xl border border-[#EDE7D4] transition-all duration-300">
          
          {/* Header Logo */}
          <div className="flex justify-center mb-6">
            <MitraLogo size="md" />
          </div>

          {/* Heading Greeting */}
          <div className="text-center mb-7">
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#1E2024] tracking-tight leading-tight">
              Selamat Datang!
            </h1>
            <p className="text-xs sm:text-[13px] font-medium text-[#626772] mt-1">
              Silakan masuk ke akun Anda
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input: Email atau Username */}
            <div className="space-y-1">
              <div className="group relative flex items-center bg-white rounded-2xl border border-[#D5D0C3] focus-within:border-[#24272D] focus-within:ring-2 focus-within:ring-[#24272D]/10 transition-all shadow-xs">
                <div className="pl-4 pr-1 text-[#4B515D] group-focus-within:text-[#1E2024] transition-colors">
                  <User className="w-5 h-5 stroke-[2]" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Email atau Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                  className="w-full pl-2 pr-4 py-3.5 bg-transparent text-sm font-medium text-[#1E2024] placeholder:text-[#8E939E] focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="space-y-1">
              <div className="group relative flex items-center bg-white rounded-2xl border border-[#D5D0C3] focus-within:border-[#24272D] focus-within:ring-2 focus-within:ring-[#24272D]/10 transition-all shadow-xs">
                <div className="pl-4 pr-1 text-[#4B515D] group-focus-within:text-[#1E2024] transition-colors">
                  <Lock className="w-5 h-5 stroke-[2]" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="w-full pl-2 pr-2 py-3.5 bg-transparent text-sm font-medium text-[#1E2024] placeholder:text-[#8E939E] focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 text-[#5E626B] hover:text-[#1E2024] transition-colors focus:outline-none cursor-pointer p-1"
                  title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 stroke-[2]" />
                  ) : (
                    <EyeOff className="w-5 h-5 stroke-[2]" />
                  )}
                </button>
              </div>
            </div>

            {/* Lupa Kata Sandi? */}
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => setActiveTab("forgot")}
                className="text-xs font-semibold text-[#4A4E58] hover:text-[#1E2024] hover:underline transition-colors cursor-pointer"
              >
                Lupa Kata Sandi?
              </button>
            </div>

            {/* Tombol MASUK (Pill Hitam Teks Kuning sesuai mockup) */}
            <div className="pt-2">
              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-13 sm:h-14 bg-[#24272D] hover:bg-[#15171A] text-[#F9B816] font-black text-sm sm:text-base tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#F9B816]" />
                    <span className="text-xs font-bold tracking-normal">Memproses...</span>
                  </>
                ) : (
                  <span>MASUK</span>
                )}
              </button>
            </div>
          </form>

          {/* ================= SIMULASI: PERAN PENGGUNA DEMO ================= */}
          <div className="mt-6 pt-5 border-t border-[#E8E2D0]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-[#626772] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F5A800]" />
                Simulasi Peran Cepat:
              </span>
              <span className="text-[10px] bg-[#EFE9D7] text-[#4F5460] font-bold px-2 py-0.5 rounded-full">
                {selectedRole}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {(
                [
                  { role: "Owner", label: "Owner (Budi)", desc: "Akses Penuh" },
                  { role: "Kasir", label: "Kasir (Rina)", desc: "Transaksi POS" },
                  { role: "Staf Gudang", label: "Gudang (Hendra)", desc: "Stok & PO" },
                  { role: "Sopir", label: "Sopir (Pak Joko)", desc: "Surat Jalan" },
                ] as const
              ).map((item) => {
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleSelectRole(item.role)}
                    className={`px-2.5 py-1.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col ${
                      isSelected
                        ? "bg-[#24272D] text-[#FAF6EB] border-[#24272D] shadow-xs"
                        : "bg-white text-[#333740] border-[#DCD6C7] hover:border-[#24272D]/50 hover:bg-[#FFFDF7]"
                    }`}
                  >
                    <span
                      className={`font-black text-[11px] leading-tight ${
                        isSelected ? "text-[#F9B816]" : "text-[#1E2024]"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`text-[9px] ${
                        isSelected ? "text-[#C4C7D0]" : "text-[#7B808D]"
                      }`}
                    >
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom copyright / brand indicator */}
        <p className="mt-4 text-[11px] text-[#8E939E] text-center font-medium">
          &copy; 2026 Mitra Bangunan POS &bull; Terhubung dengan BanguMart System
        </p>
      </div>

      {/* ================= MODAL: SIMULASI LUPA KATA SANDI ================= */}
      {activeTab === "forgot" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF6EB] rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#EDE7D4] animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => {
                setActiveTab("login");
                setForgotSent(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#4A4E58] hover:text-[#1E2024] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Content */}
            {!forgotSent ? (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#24272D] text-[#F9B816] flex items-center justify-center mb-4 shadow-sm">
                  <KeyRound className="w-6 h-6 stroke-[2]" />
                </div>

                <h3 className="text-xl font-black text-[#1E2024] tracking-tight">
                  Pemulihan Kata Sandi
                </h3>
                <p className="text-xs text-[#626772] mt-1 mb-5 leading-relaxed">
                  Masukkan email terdaftar Anda. Sistem akan mengirimkan tautan instruksi pengaturan ulang kata sandi.
                </p>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="relative flex items-center bg-white rounded-2xl border border-[#D5D0C3] focus-within:border-[#24272D] focus-within:ring-2 focus-within:ring-[#24272D]/10">
                    <div className="pl-4 text-[#4B515D]">
                      <Mail className="w-5 h-5 stroke-[2]" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Masukkan email Anda (cth: budi@bangumart.id)"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3.5 py-3 bg-transparent text-sm font-medium text-[#1E2024] placeholder:text-[#8E939E] focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="flex-1 py-3 bg-white hover:bg-neutral-100 text-[#4A4E58] font-bold text-xs rounded-xl border border-[#D5D0C3] transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingForgot}
                      className="flex-1 py-3 bg-[#24272D] hover:bg-[#15171A] text-[#F9B816] font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
                    >
                      {isSubmittingForgot ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#F9B816]" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <span>Kirim Tautan</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-[#1E2024]">
                  Tautan Pemulihan Terkirim!
                </h3>
                <p className="text-xs text-[#626772] mt-2 mb-6 leading-relaxed">
                  Kami telah mengirimkan email instruksi pemulihan ke <br />
                  <strong className="text-[#1E2024]">{forgotEmail}</strong>.
                  Silakan periksa kotak masuk atau spam email Anda.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setForgotSent(false);
                  }}
                  className="w-full py-3 bg-[#24272D] hover:bg-[#15171A] text-[#F9B816] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Kembali ke Halaman Masuk
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProductCatalog } from "@/components/pos/ProductCatalog";
import { CartPanel } from "@/components/pos/CartPanel";
import { PaymentModal } from "@/components/pos/PaymentModal";
import { ReceiptModal } from "@/components/pos/ReceiptModal";
import { HistoryTab } from "@/components/pos/HistoryTab";
import { QuotationTab } from "@/components/pos/QuotationTab";
import { OrdersTab } from "@/components/pos/OrdersTab";
import { DeliveryTab } from "@/components/pos/DeliveryTab";
import { Transaction } from "@/data/transactions";
import { useAppStore } from "@/lib/store";
import {
  ShoppingCart,
  History,
  FileText,
  PackageCheck,
  Truck,
} from "lucide-react";

function TransaksiContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "kasir";

  const { cart } = useAppStore();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
    if (searchParams.get("modal") === "payment") {
      setIsPaymentOpen(true);
    }
  }, [searchParams]);

  // Keyboard shortcut F9 to open Payment
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9" && activeTab === "kasir" && cart.length > 0) {
        e.preventDefault();
        setIsPaymentOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, cart.length]);

  const tabs = [
    { id: "kasir", label: "Kasir (POS)", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "riwayat", label: "Riwayat", icon: <History className="w-4 h-4" /> },
    { id: "penawaran", label: "Penawaran (Quotation)", icon: <FileText className="w-4 h-4" /> },
    { id: "pesanan", label: "Pesanan (SO)", icon: <PackageCheck className="w-4 h-4" /> },
    { id: "pengiriman", label: "Pengiriman", icon: <Truck className="w-4 h-4" /> },
  ];

  const handlePaymentSuccess = (trx: Transaction) => {
    setIsPaymentOpen(false);
    setLastTransaction(trx);
    setIsReceiptOpen(true);
  };

  return (
    <div className="flex flex-col h-full min-h-0 gap-2.5 overflow-hidden">
      {/* Compact Tab Navigation Header */}
      <div className="shrink-0 flex items-center gap-1 overflow-x-auto bg-white p-1.5 rounded-xl border border-[#ECECE8] shadow-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#F5A800] text-[#1F2933] shadow-xs"
                  : "text-[#6B7280] hover:text-[#1F2933] hover:bg-[#F7F7F5]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* POS Two-Panel Viewport (100% fits screen without window scroll) */}
      {activeTab === "kasir" && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
          {/* Left: Product Catalog (7 cols) */}
          <div className="lg:col-span-7 h-full min-h-0 flex flex-col">
            <ProductCatalog onScanClick={() => setIsPaymentOpen(false)} />
          </div>

          {/* Right: Cart & Checkout (5 cols) */}
          <div className="lg:col-span-5 h-full min-h-0 flex flex-col">
            <CartPanel
              onOpenPayment={() => setIsPaymentOpen(true)}
              onOpenQuotation={() => setActiveTab("penawaran")}
            />
          </div>
        </div>
      )}

      {/* Scrollable View for other tabs */}
      {activeTab !== "kasir" && (
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {activeTab === "riwayat" && <HistoryTab />}
          {activeTab === "penawaran" && <QuotationTab />}
          {activeTab === "pesanan" && <OrdersTab />}
          {activeTab === "pengiriman" && <DeliveryTab />}
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={lastTransaction}
      />
    </div>
  );
}

export default function TransaksiPage() {
  return (
    <AppLayout noScroll={true}>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#6B7280]">Memuat Kasir POS...</div>}>
        <TransaksiContent />
      </Suspense>
    </AppLayout>
  );
}

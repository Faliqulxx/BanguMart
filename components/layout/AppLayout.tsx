"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";
import { ToastContainer } from "@/components/ui/Toast";

interface AppLayoutProps {
  children: React.ReactNode;
  noScroll?: boolean;
}

export function AppLayout({ children, noScroll = false }: AppLayoutProps) {
  return (
    <div className="h-screen w-screen flex bg-[#F7F7F5] overflow-hidden select-none">
      {/* Desktop / Tablet Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar />
        <main
          className={`flex-1 min-h-0 w-full mx-auto ${
            noScroll
              ? "overflow-hidden p-2.5 sm:p-3 lg:p-3.5 flex flex-col max-w-[1680px]"
              : "overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl pb-20 sm:pb-8"
          }`}
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Real-time Toasts */}
      <ToastContainer />
    </div>
  );
}

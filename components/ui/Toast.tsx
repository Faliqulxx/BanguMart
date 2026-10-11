"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismissToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#E5484D] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#2563EB] shrink-0" />,
        };

        const borders = {
          success: "border-l-4 border-l-[#16A34A]",
          warning: "border-l-4 border-l-[#F59E0B]",
          error: "border-l-4 border-l-[#E5484D]",
          info: "border-l-4 border-l-[#2563EB]",
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white rounded-xl shadow-lg border border-[#ECECE8] p-3.5 flex items-start gap-3 transition-all duration-200 animate-in slide-in-from-bottom-2 ${
              borders[toast.type || "success"]
            }`}
          >
            {icons[toast.type || "success"]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1F2933] leading-snug">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#9CA3AF] hover:text-[#1F2933] p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

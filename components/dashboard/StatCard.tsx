import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  changeText?: string;
  isPositive?: boolean;
  isWarning?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  changeText,
  isPositive,
  isWarning,
  icon,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#ECECE8] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#6B7280]">{title}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#FFF7E0] text-[#B45309] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-28px font-extrabold text-[#1F2933] tracking-tight">
          {value}
        </h3>
      </div>

      {(changeText || subtitle) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {changeText && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold ${
                isWarning
                  ? "text-[#E5484D] bg-[#FEE2E2] px-1.5 py-0.5 rounded"
                  : isPositive
                  ? "text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded"
                  : "text-[#6B7280]"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : isWarning ? (
                <ArrowDownRight className="w-3.5 h-3.5" />
              ) : null}
              {changeText}
            </span>
          )}
          {subtitle && <span className="text-[#6B7280] text-[11px] truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

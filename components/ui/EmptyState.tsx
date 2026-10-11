import React from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-dashed border-[#D1D5DB] ${className}`}
    >
      {icon ? (
        <div className="w-14 h-14 rounded-full bg-[#FFF7E0] flex items-center justify-center text-[#B45309] mb-3.5">
          {icon}
        </div>
      ) : (
        <div className="w-14 h-14 rounded-full bg-[#F7F7F5] flex items-center justify-center text-[#9CA3AF] mb-3.5 text-2xl">
          📦
        </div>
      )}
      <h4 className="text-base font-bold text-[#1F2933]">{title}</h4>
      {description && <p className="text-xs text-[#6B7280] max-w-sm mt-1">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

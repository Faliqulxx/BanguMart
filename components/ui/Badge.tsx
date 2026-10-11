import React from "react";

export type BadgeVariant =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral"
  | "secondary";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
  icon,
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    primary: "bg-[#FFF7E0] text-[#B45309] border border-[#FDEBB8]",
    success: "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]",
    danger: "bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]",
    warning: "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]",
    info: "bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]",
    neutral: "bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]",
    secondary: "bg-[#F7F7F5] text-[#6B7280] border border-[#ECECE8]",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full shrink-0 transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

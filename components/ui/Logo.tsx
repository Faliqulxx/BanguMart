import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export function Logo({ className = "", size = "md", showSubtitle = true }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG House Logo: Roof in #F5A800 Amber, 4 Window Panes in #3F4650 */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Base house background subtle shape */}
          <rect x="6" y="16" width="28" height="20" rx="3" fill="#FFFFFF" stroke="#1F2933" strokeWidth="2.5" />
          
          {/* Amber Roof gable */}
          <path
            d="M3 17L20 4L37 17"
            stroke="#F5A800"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 7.5L7.5 17H32.5L20 7.5Z"
            fill="#FFF7E0"
          />
          
          {/* Chimney / Beam accent */}
          <rect x="27" y="6" width="3.5" height="5" rx="0.5" fill="#F5A800" />
          
          {/* 4 Window panes (dark-soft #3F4650) */}
          <rect x="11" y="21" width="6.5" height="5.5" rx="1" fill="#3F4650" />
          <rect x="22.5" y="21" width="6.5" height="5.5" rx="1" fill="#3F4650" />
          <rect x="11" y="28.5" width="6.5" height="5" rx="1" fill="#3F4650" />
          <rect x="22.5" y="28.5" width="6.5" height="5" rx="1" fill="#F5A800" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1">
          <span className={`font-extrabold tracking-tight text-[#1F2933] ${textSizes[size]}`}>
            Bangu<span className="text-[#F5A800]">Mart</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-medium tracking-wider text-[#6B7280] uppercase">
            POS Toko Bangunan
          </span>
        )}
      </div>
    </div>
  );
}

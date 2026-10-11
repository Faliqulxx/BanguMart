import React from "react";

interface MitraLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MitraLogo({ className = "", size = "md" }: MitraLogoProps) {
  const iconSizes = {
    sm: "w-10 h-10",
    md: "w-13 h-13",
    lg: "w-16 h-16",
  };

  const titleSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg tracking-tight",
    lg: "text-xl tracking-tight",
  };

  const subtitleSizes = {
    sm: "text-[9px] tracking-wider",
    md: "text-[10px] tracking-wider",
    lg: "text-[11px] tracking-wider",
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem: Gear Cog with Construction Hard Hat */}
      <div className={`relative shrink-0 ${iconSizes[size]} drop-shadow-sm`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Black Outer Gear / Cog */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M44 4h12l2.5 11.2c3.5 1 6.8 2.5 9.8 4.4l9.5-6.8 8.5 8.5-6.8 9.5c1.9 3 3.4 6.3 4.4 9.8L96 44v12l-11.2 2.5c-1 3.5-2.5 6.8-4.4 9.8l6.8 9.5-8.5 8.5-9.5-6.8c-3 1.9-6.3 3.4-9.8 4.4L56 96H44l-2.5-11.2c-3.5-1-6.8-2.5-9.8-4.4l-9.5 6.8-8.5-8.5 6.8-9.5c-1.9-3-3.4-6.3-4.4-9.8L4 56V44l11.2-2.5c1-3.5 2.5-6.8 4.4-9.8l-6.8-9.5 8.5-8.5 9.5 6.8c3-1.9 6.3-3.4 9.8-4.4L44 4zm6 20a26 26 0 100 52 26 26 0 000-52z"
            fill="#23262B"
          />

          {/* Inner Light Circle Background */}
          <circle cx="50" cy="50" r="24" fill="#FAF6EB" />

          {/* Safety Helmet / Hard Hat */}
          {/* Helmet Top Dome */}
          <path
            d="M32 53C32 37 68 37 68 53H32Z"
            fill="#F5A800"
            stroke="#23262B"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Helmet Ridge / Top Spine */}
          <path
            d="M47 38.5C47 36 53 36 53 38.5V52.5H47V38.5Z"
            fill="#FFD24D"
            stroke="#23262B"
            strokeWidth="2.2"
          />

          {/* Helmet Brim / Visor */}
          <path
            d="M27 54C27 51.5 73 51.5 73 54C73 58 27 58 27 54Z"
            fill="#F5A800"
            stroke="#23262B"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Brim Underside Accent */}
          <path
            d="M30 55.5C38 57.5 62 57.5 70 55.5"
            stroke="#D98A00"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left leading-none">
        <span className={`font-black text-[#23262B] uppercase ${titleSizes[size]}`}>
          MITRA BANGUNAN
        </span>
        <span
          className={`font-bold text-[#4B515D] uppercase mt-1 ${subtitleSizes[size]}`}
        >
          TOKO BAHAN BANGUNAN
        </span>
      </div>
    </div>
  );
}

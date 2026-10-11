import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline" | "soft";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      iconRight,
      isLoading = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none focus:outline-none focus:ring-2 focus:ring-[#F5A800]/40";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-[#F5A800] hover:bg-[#DB9500] text-[#1F2933] shadow-sm active:bg-[#C28400]",
      secondary:
        "bg-white hover:bg-[#F7F7F5] text-[#1F2933] border border-[#ECECE8] shadow-sm",
      danger:
        "bg-[#E5484D] hover:bg-[#D13B40] text-white shadow-sm active:bg-[#BA2E33]",
      outline:
        "bg-transparent hover:bg-[#FFF7E0] text-[#1F2933] border border-[#F5A800]",
      soft:
        "bg-[#FFF7E0] hover:bg-[#FDEBB8] text-[#1F2933] border border-[#FDEBB8]",
      ghost:
        "bg-transparent hover:bg-black/5 text-[#1F2933]",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      xs: "text-xs px-2.5 py-1 gap-1 min-h-[30px]",
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[34px]",
      md: "text-sm px-4 py-2 gap-2 min-h-[40px]",
      lg: "text-base px-5 py-2.5 gap-2.5 min-h-[46px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
        {iconRight && !isLoading && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

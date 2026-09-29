import React, { forwardRef } from "react";

type Variant =
  | "primary"
  | "accent"
  | "secondary"
  | "success"
  | "danger"
  | "outline"
  | "ghost";

type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      type = "button",
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<Size, string> = {
      sm: "h-9 px-3 text-xs gap-1.5 rounded-lg",
      md: "h-11 px-4 text-sm gap-2 rounded-button",
      lg: "h-12 px-6 text-base gap-2.5 rounded-button",
    };

    const variantClasses: Record<Variant, string> = {
      primary:
        "bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-primary/25 active:shadow-none",
      accent:
        "bg-accent text-white hover:bg-primary-hover shadow-md hover:shadow-accent/25",
      secondary:
        "bg-white/[0.05] text-text border border-white/10 hover:bg-white/[0.08] hover:border-white/20",
      success:
        "bg-success text-white hover:opacity-95 shadow-md hover:shadow-success/20",
      danger:
        "bg-danger text-white hover:opacity-95 shadow-md hover:shadow-danger/20",
      outline:
        "bg-transparent text-text border border-border hover:bg-white/[0.05] hover:border-white/20",
      ghost:
        "bg-transparent text-muted hover:text-text hover:bg-white/[0.05]",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`
          inline-flex
          items-center
          justify-center
          font-semibold
          tracking-wide
          transition-all
          duration-150
          ease-in-out
          hover:-translate-y-0.5
          active:translate-y-0
          active:scale-[0.98]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary/50
          disabled:opacity-50
          disabled:pointer-events-none
          disabled:transform-none
          disabled:shadow-none
          select-none
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `.trim().replace(/\s+/g, " ")}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
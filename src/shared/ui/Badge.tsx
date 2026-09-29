import type { ReactNode, HTMLAttributes } from "react";

type Variant = "success" | "warning" | "danger" | "info" | "neutral";
type Size = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  showDot?: boolean;
  className?: string;
}

export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  showDot = false,
  className = "",
  ...props
}: BadgeProps) {
  const sizes: Record<Size, string> = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const variants: Record<Variant, { badge: string; dot: string }> = {
    success: {
      badge: "bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]",
      dot: "bg-[var(--success)]",
    },
    warning: {
      badge: "bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-border)]",
      dot: "bg-[var(--warning)]",
    },
    danger: {
      badge: "bg-[var(--danger-bg)] text-[var(--danger-text)] border-[var(--danger-border)]",
      dot: "bg-[var(--danger)]",
    },
    info: {
      badge: "bg-[var(--info-bg)] text-[var(--info-text)] border-[var(--info-border)]",
      dot: "bg-[var(--info)]",
    },
    neutral: {
      badge: "bg-[var(--neutral-bg)] text-[var(--neutral-text)] border-[var(--neutral-border)]",
      dot: "bg-[var(--text-muted)]",
    },
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-pill
        font-semibold
        tracking-wide
        border
        backdrop-blur-sm
        whitespace-nowrap
        select-none
        ${sizes[size]}
        ${variants[variant].badge}
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    >
      {showDot && (
        <span
          className={`
            h-1.5 w-1.5
            rounded-full
            shrink-0
            ${variants[variant].dot}
          `}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
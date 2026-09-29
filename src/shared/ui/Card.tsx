import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = false,
  onClick,
  ...props
}: CardProps) {
  const isClickable = Boolean(onClick) || hover;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e as any);
              }
            }
          : undefined
      }
      className={`
        bg-surface/80
        backdrop-blur-sm
        border
        border-white/[0.06]
        rounded-card
        p-5
        shadow-card
        transition-all
        duration-300
        ${
          hover
            ? "hover:border-primary/40 hover:bg-surface hover:shadow-[0_0_25px_rgba(255,85,0,0.15)] hover:-translate-y-0.5"
            : ""
        }
        ${isClickable ? "cursor-pointer" : ""}
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    >
      {children}
    </div>
  );
}
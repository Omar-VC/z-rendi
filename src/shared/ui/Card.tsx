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
        bg-surface/95
        backdrop-blur-md
        border
        border-white/[0.12]
        rounded-card
        p-5
        shadow-xl
        shadow-black/40
        transition-all
        duration-300
        ${
          hover
            ? "hover:border-primary/50 hover:bg-surface hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-0.5"
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
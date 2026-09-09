import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

export default function Card({
  children,
  className = "",
  hover = false,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface
        border
        border-border
        rounded-card
        p-5
        shadow-card
        transition-all
        duration-300
        ${
          hover
            ? "hover:border-primary/40 hover:shadow-[0_0_20px_rgba(255,85,0,0.12)] cursor-pointer"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}
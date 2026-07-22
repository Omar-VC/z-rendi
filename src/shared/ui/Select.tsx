import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({
  className = "",
  children,
  ...props
}: Props) {
  return (
    <select
      className={`
        w-full
        rounded-xl
        border
        border-border
        bg-surface
        px-4
        py-3
        text-primary
        outline-none
        transition
        focus:border-accent
        focus:ring-2
        focus:ring-accent/20
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}
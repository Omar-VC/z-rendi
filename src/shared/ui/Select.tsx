import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export default function Select({
  label,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-primary">
          {label}
        </label>
      )}

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
    </div>
  );
}
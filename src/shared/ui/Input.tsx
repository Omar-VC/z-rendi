import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({
  label,
  className = "",
  ...props
}: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-primary">
          {label}
        </label>
      )}

      <input
        className={`
          w-full
          h-11
          px-4
          rounded-xl
          border
          border-gray-200
          bg-white
          text-primary
          placeholder:text-slate-400
          focus:outline-none
          focus:border-accent
          focus:ring-2
          focus:ring-orange-200
          transition
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
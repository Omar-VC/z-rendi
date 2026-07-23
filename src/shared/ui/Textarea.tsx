import React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export default function Textarea({
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

      <textarea
        className={`
          w-full
          min-h-[120px]
          px-4
          py-3
          rounded-xl
          border
          border-gray-200
          bg-white
          text-primary
          placeholder:text-slate-400
          resize-none
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
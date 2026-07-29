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
    <div className="space-y-2">

      {label && (
        <label
          className="
            block
            text-sm
            font-medium
            text-text
          "
        >
          {label}
        </label>
      )}


      <input
        className={`
          w-full

          h-11

          px-4

          rounded-button

          border
          border-border

          bg-surface

          text-text

          placeholder:text-muted

          transition

          focus:outline-none

          focus:border-accent

          focus:ring-2

          focus:ring-primary/20

          ${className}
        `}
        {...props}
      />

    </div>
  );
}
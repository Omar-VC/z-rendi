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


      <textarea
        className={`
          w-full

          min-h-[120px]

          px-4
          py-3

          rounded-button

          border
          border-border

          bg-surface

          text-text

          placeholder:text-muted

          resize-none

          focus:outline-none

          focus:border-accent

          focus:ring-2

          focus:ring-accent/20

          transition

          ${className}
        `}
        {...props}
      />

    </div>
  );
}
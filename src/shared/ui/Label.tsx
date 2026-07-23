import type { LabelHTMLAttributes } from "react";

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({
  className = "",
  children,
  ...props
}: Props) {
  return (
    <label
      className={`
        block
        mb-2
        text-sm
        font-medium
        text-primary
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  );
}
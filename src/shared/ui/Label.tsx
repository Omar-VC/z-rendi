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
        text-sm
        font-medium
        text-text
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  );
}
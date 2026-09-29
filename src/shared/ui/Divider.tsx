import type { HTMLAttributes } from "react";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Divider({
  className = "",
  ...props
}: DividerProps) {
  return (
    <div
      role="separator"
      className={`
        h-[1px]
        w-full
        bg-gradient-to-r
        from-transparent
        via-white/10
        to-transparent
        my-4
        ${className}
      `.trim().replace(/\s+/g, " ")}
      {...props}
    />
  );
}
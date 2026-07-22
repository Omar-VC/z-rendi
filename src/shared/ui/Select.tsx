import React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({
  className = "",
  children,
  ...props
}: Props) {
  return (
    <select
      className={`
        w-full
        h-11
        px-4
        rounded-xl
        border
        border-gray-200
        bg-white
        text-primary
        focus:outline-none
        focus:border-accent
        focus:ring-2
        focus:ring-orange-200
        transition
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}
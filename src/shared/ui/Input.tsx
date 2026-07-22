import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className = "",
  ...props
}: Props) {
  return (
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
  );
}
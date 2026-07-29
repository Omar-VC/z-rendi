import React from "react";


type Props = {
  children: React.ReactNode;
  className?: string;
};


export default function PageContainer({
  children,
  className = "",
}: Props) {

  return (
    <div
      className={`
        w-full
        min-h-screen

        max-w-7xl
        mx-auto

        px-4
        sm:px-6
        lg:px-8

        ${className}
      `}
    >
      {children}
    </div>
  );
}
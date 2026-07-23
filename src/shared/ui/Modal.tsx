import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  title,
  children,
  onClose,
  footer,
  size = "md",
}: Props) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div
        className={`
          w-full
          ${sizes[size]}
          max-h-[90vh]
          rounded-2xl
          bg-surface
          shadow-2xl
          flex
          flex-col
          overflow-hidden
        `}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">

          <h2 className="text-2xl font-bold text-primary">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              text-slate-500
              hover:text-primary
              transition
              text-xl
            "
          >
            ✕
          </button>

        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-5 border-t border-border bg-surface">
            {footer}
          </div>
        )}

      </div>

    </div>
  );
}
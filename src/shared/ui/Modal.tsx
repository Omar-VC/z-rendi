import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

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

  // Bloquear el scroll del body cuando el modal esté abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Renderizar usando createPortal para asegurarnos de que se monte en el body
  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]
        bg-black/75
        backdrop-blur-sm
        flex
        justify-center
        items-start
        overflow-y-auto
        p-4
        md:items-center
        animate-fadeIn
      "
      onClick={onClose}
    >
      <div
        className={`
          w-full
          ${sizes[size]}
          my-6
          md:my-0
          max-h-[calc(100dvh-3rem)]
          bg-surface
          border
          border-border
          rounded-card
          shadow-2xl
          flex
          flex-col
          overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-border
            bg-surfaceSoft/30
            shrink-0
          "
        >
          <h2
            className="
              text-xl
              md:text-2xl
              font-bold
              text-text
            "
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              text-muted
              hover:text-accent
              transition
              text-xl
              p-1
              rounded-lg
              hover:bg-surfaceSoft
            "
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          className="
            flex-1
            overflow-y-auto
            px-6
            py-5
            space-y-4
          "
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="
              shrink-0
              flex
              justify-end
              gap-3
              px-6
              py-4
              border-t
              border-border
              bg-surfaceSoft/30
            "
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
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

    <div
      className="
        fixed
        inset-0
        z-[999]
        bg-black/50

        flex
        justify-center
        items-start

        overflow-y-auto

        p-4
        md:items-center
      "
    >

      <div
        className={`
          w-full
          ${sizes[size]}

          my-6
          md:my-0

          max-h-[calc(100dvh-3rem)]

          bg-surface
          rounded-card
          shadow-2xl

          flex
          flex-col

          overflow-hidden
        `}
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

            px-5
            py-5
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
              py-5

              border-t
              border-border

              bg-surface-soft
            "
          >
            {footer}
          </div>

        )}

      </div>

    </div>

  );
}
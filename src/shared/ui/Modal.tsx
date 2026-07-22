import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({
  title,
  children,
  onClose,
}: Props) {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-primary/30
        backdrop-blur-sm
        p-4
        animate-fadeIn
      "
    >

      <div
        className="
          w-full
          max-w-lg
          rounded-2xl
          bg-white
          p-6
          shadow-cardHover
        "
      >

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-bold text-primary">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              text-slate-400
              hover:text-primary
              text-xl
              transition
            "
          >
            ×
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}
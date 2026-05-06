import React from "react";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-secondary/40 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-6 w-full max-w-md text-white">
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};


export default Modal;
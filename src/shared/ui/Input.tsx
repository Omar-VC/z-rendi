import React, { forwardRef, useId } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text select-none"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={`
            w-full
            h-11
            px-4
            rounded-button
            border
            bg-surface
            text-text
            placeholder:text-muted
            transition
            duration-150
            ease-in-out
            focus:outline-none
            focus:ring-2
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-border focus:border-accent focus:ring-primary/20"
            }
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="text-xs font-medium text-red-500 animate-in fade-in-50">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
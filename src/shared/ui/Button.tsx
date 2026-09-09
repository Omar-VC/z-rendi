type Variant =
  | "primary"
  | "accent"
  | "secondary"
  | "success"
  | "danger"
  | "outline"
  | "ghost";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: Props) {
  const variants: Record<Variant, string> = {
    primary:
      "bg-primary text-white hover:bg-primary-hover shadow-[0_0_20px_rgba(255,85,0,0.25)] hover:shadow-[0_0_25px_rgba(255,85,0,0.4)]",

    accent:
      "bg-accent text-white hover:opacity-90 shadow-[0_0_20px_rgba(255,85,0,0.25)]",

    secondary:
      "bg-buttonSecondaryBg text-buttonSecondaryText border border-buttonSecondaryBorder hover:bg-surfaceHover hover:border-white/20",

    success:
      "bg-success text-white hover:opacity-90 shadow-[0_0_20px_rgba(16,185,129,0.25)]",

    danger:
      "bg-danger text-white hover:opacity-90 shadow-[0_0_20px_rgba(239,68,68,0.25)]",

    outline:
      "bg-transparent text-text border border-border hover:bg-surfaceHover hover:border-white/30",

    ghost:
      "bg-transparent text-muted hover:text-text hover:bg-surfaceHover",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        px-4
        py-2.5
        min-h-[44px]
        rounded-button
        font-semibold
        text-sm
        tracking-wide
        transition-all
        duration-200
        hover:-translate-y-0.5
        active:scale-[0.98]
        disabled:opacity-50
        disabled:pointer-events-none
        disabled:transform-none
        select-none
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
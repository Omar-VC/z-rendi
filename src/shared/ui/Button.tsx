type Variant =
  | "primary"
  | "accent"
  | "secondary"
  | "success"
  | "danger";


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


  const variants = {

    primary:
      "bg-primary text-white hover:opacity-90",


    accent:
      "bg-accent text-white hover:opacity-90",


    secondary:
      `
      bg-buttonSecondaryBg
      text-buttonSecondaryText
      border
      border-buttonSecondaryBorder
      hover:bg-surfaceHover
      `,


    success:
      "bg-success text-white hover:opacity-90",


    danger:
      "bg-danger text-white hover:opacity-90",

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
        py-2

        min-h-[44px]

        rounded-button

        font-semibold

        transition-all
        duration-200

        hover:-translate-y-[1px]

        active:scale-95

        disabled:opacity-50
        disabled:pointer-events-none

        ${variants[variant]}

        ${className}
      `}
    >
      {children}
    </button>
  );
}
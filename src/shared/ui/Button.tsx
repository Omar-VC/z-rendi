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
};


export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
}: Props) {


  const variants = {
    primary:
      "bg-primary text-white hover:opacity-90",

    accent:
      "bg-accent text-white hover:opacity-90",

    secondary:
      "bg-secondary text-primary",

    success:
      "bg-success text-white",

    danger:
      "bg-danger text-white",
  };


  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        px-4
        py-2
        min-h-[44px]
        rounded-xl
        font-semibold
        transition
        hover:-translate-y-[1px]
        active:scale-95
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
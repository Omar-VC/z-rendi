type Variant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";


type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};


export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: Props) {


  const variants = {

    success:
      "bg-successBg text-successText border-successBorder",


    warning:
      "bg-warningBg text-warningText border-warningBorder",


    danger:
      "bg-dangerBg text-dangerText border-dangerBorder",


    info:
      "bg-infoBg text-infoText border-infoBorder",


    neutral:
      "bg-neutralBg text-neutralText border-neutralBorder",

  };


  return (

    <span
      className={`
        inline-flex
        items-center
        rounded-pill
        px-3
        py-1
        text-xs
        font-semibold
        border

        ${variants[variant]}

        ${className}
      `}
    >

      {children}

    </span>

  );
}
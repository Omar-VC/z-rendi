type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        bg-surface
        border
        border-border
        rounded-card
        p-5
        shadow-card
        transition
        duration-200
        hover:shadow-cardHover
        hover:-translate-y-1
        ${className}
      `}
    >
      {children}
    </div>
  );
}
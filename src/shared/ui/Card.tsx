type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`
        bg-surface
        rounded-xl
        border
        border-gray-200
        p-5
        shadow-card
        transition
        hover:shadow-cardHover
        ${className}
      `}
    >
      {children}
    </div>
  );
}
interface Props {
  className?: string;
}

export default function Divider({
  className = "",
}: Props) {
  return (
    <div
      className={`
        border-t
        border-border
        my-6
        ${className}
      `}
    />
  );
}
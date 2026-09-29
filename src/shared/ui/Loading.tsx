import { Loader2 } from "lucide-react"; // O podés usar un SVG personalizado / Tailwind puro

interface Props {
  text?: string;
  className?: string;
}

export default function Loading({
  text = "Cargando...",
  className = "",
}: Props) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 py-8 text-center text-muted-foreground ${className}`}
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      {text && <span className="text-sm font-medium">{text}</span>}
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
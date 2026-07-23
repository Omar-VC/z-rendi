interface Props {
  text?: string;
}

export default function Loading({
  text = "Cargando...",
}: Props) {
  return (
    <div className="py-8 text-center text-slate-500">
      {text}
    </div>
  );
}
import { useAuth } from "../../../../auth/useAuth";
import { useFichaCliente } from "../../../admin/fichas/hooks/useFichaCliente";

export default function ClienteHeader() {
  const { user } = useAuth();
  const { ficha, loading } = useFichaCliente(user?.uid);

  // Skeleton de carga
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-2 w-12 bg-primary/40 rounded-full" />
        <div className="h-9 w-64 bg-surfaceSoft rounded-lg" />
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-surfaceSoft/60 rounded-full" />
          <div className="h-6 w-24 bg-surfaceSoft/60 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-16 bg-surfaceSoft/40 rounded-xl" />
          <div className="h-16 bg-surfaceSoft/40 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-5">
      {/* Luz ambiental sutil */}
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* TITULAR Y SALUDO */}
      <div>
        <div className="w-10 h-1 rounded-full bg-primary mb-3 shadow-[0_0_8px_rgba(255,85,0,0.5)]" />

        <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          Hola, {ficha?.nombre ?? "Atleta"} 👋
        </h1>

        <p className="mt-1 text-xs sm:text-sm text-muted font-medium">
          Panel de rendimiento y evolución deportiva
        </p>
      </div>

      {/* BADGES / ETIQUETAS DEL ATLETA */}
      <div className="flex flex-wrap gap-2">
        {ficha?.deporte && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
            <span>🏉</span> {ficha.deporte}
          </span>
        )}

        {ficha?.puesto && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceSoft border border-border/80 text-text/90 text-xs font-semibold">
            {ficha.puesto}
          </span>
        )}

        {ficha?.edad && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surfaceSoft border border-border/80 text-muted text-xs font-semibold">
            {ficha.edad} años
          </span>
        )}
      </div>

      {/* MÉTRICAS ANTROPOMÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-xl border border-border/60 bg-surface/80 backdrop-blur-sm">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
            Peso Corporal
          </span>
          <p className="mt-0.5 text-lg font-black text-text tracking-tight">
            {ficha?.peso ? `${ficha.peso} kg` : "-"}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border/60 bg-surface/80 backdrop-blur-sm">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
            Estatura
          </span>
          <p className="mt-0.5 text-lg font-black text-text tracking-tight">
            {ficha?.altura ? `${ficha.altura} cm` : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
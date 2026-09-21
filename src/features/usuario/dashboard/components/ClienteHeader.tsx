// src/features/usuario/dashboard/components/ClienteHeader.tsx
import { useAuth } from "../../../../auth/useAuth";
import { useFichaCliente } from "../../../admin/fichas/hooks/useFichaCliente";
import AvatarUploadButton from "../../perfil/components/AvatarUploadButton";

export default function ClienteHeader() {
  const { user } = useAuth();
  const { ficha, loading, recargar } = useFichaCliente(user?.uid);

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-4 animate-pulse py-4">
        <div className="w-24 h-24 rounded-2xl bg-surfaceSoft" />
        <div className="h-6 w-48 bg-surfaceSoft rounded-lg" />
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-surfaceSoft/60 rounded-full" />
          <div className="h-6 w-24 bg-surfaceSoft/60 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 w-full pt-2">
          <div className="h-16 bg-surfaceSoft/40 rounded-xl" />
          <div className="h-16 bg-surfaceSoft/40 rounded-xl" />
        </div>
      </div>
    );
  }

  const fotoActual = user?.photoURL || ficha?.fotoUrl;
  const tieneFoto = Boolean(fotoActual);

  return (
    <div className="relative space-y-6 text-center">
      {/* Luz ambiental centrada */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      {/* AVATAR DESTACADO / CENTRADO */}
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative">
          <AvatarUploadButton
            fotoUrl={fotoActual}
            nombre={ficha?.nombre || user?.displayName || "Atleta"}
            size="lg" // Renderiza w-24 h-24
            onSuccess={() => recargar()}
          />
          
          {/* Indicador de estado o de llamada a la acción */}
          {tieneFoto ? (
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-success border-2 border-surface shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          ) : (
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] text-white shadow-[0_0_10px_rgba(255,85,0,0.8)] animate-bounce">
              📷
            </span>
          )}
        </div>

        {/* LEYENDA CUANDO NO TIENE FOTO */}
        {!tieneFoto && (
          <p className="mt-2 text-[11px] font-bold text-primary tracking-wide animate-pulse">
            📷 Carga tu foto de perfil
          </p>
        )}

        {/* TITULAR Y SALUDO */}
        <div className="mt-3">
          <div className="w-12 h-1 rounded-full bg-primary mx-auto mb-2 shadow-[0_0_10px_rgba(255,85,0,0.6)]" />
          <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
            Hola, {ficha?.nombre ?? "Atleta"} 👋
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted font-medium">
            Panel de rendimiento y evolución deportiva
          </p>
        </div>
      </div>

      {/* BADGES DEL ATLETA CENTRADOS */}
      <div className="flex flex-wrap justify-center gap-2">
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
        <div className="p-3.5 rounded-xl border border-border/60 bg-surface/80 backdrop-blur-sm text-left">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
            Peso Corporal
          </span>
          <p className="mt-0.5 text-lg font-black text-text tracking-tight">
            {ficha?.peso ? `${ficha.peso} kg` : "-"}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border/60 bg-surface/80 backdrop-blur-sm text-left">
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
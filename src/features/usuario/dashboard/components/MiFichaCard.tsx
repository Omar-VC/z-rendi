// src/features/usuario/dashboard/components/MiFichaCard.tsx
import Card from "../../../../shared/ui/Card";
import Button from "../../../../shared/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../auth/useAuth";
import { useFichaCliente } from "../../../admin/fichas/hooks/useFichaCliente";

export default function MiFichaCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ficha } = useFichaCliente(user?.uid);

  const fotoActual = user?.photoURL || ficha?.fotoUrl;
  const nombreMostrar = ficha?.nombre || user?.displayName || "Atleta";
  const iniciales = nombreMostrar
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card hover className="relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center text-center py-2 relative z-10">
        <div className="relative group">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-surface border border-primary/30 flex items-center justify-center text-2xl font-black text-primary shadow-[0_0_20px_rgba(255,85,0,0.15)] group-hover:border-primary/60 transition-all duration-300 overflow-hidden">
            {fotoActual ? (
              <img
                src={fotoActual}
                alt={nombreMostrar}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <span>{iniciales}</span>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-surface" />
        </div>

        <h3 className="mt-4 text-lg font-extrabold text-text tracking-tight">
          {ficha?.nombre ? `${ficha.nombre} ${ficha.apellido || ""}` : "Mi Ficha"}
        </h3>

        <p className="mt-0.5 text-xs font-semibold text-muted">
          {ficha?.deporte || "Atleta de Alto Rendimiento"}
        </p>

        <Button
          variant="accent"
          className="mt-5 w-full sm:w-auto px-6 py-2.5 shadow-[0_0_15px_rgba(255,85,0,0.2)]"
          onClick={() => navigate("/cliente/ficha")}
        >
          Ver Ficha Completa
        </Button>
      </div>
    </Card>
  );
}
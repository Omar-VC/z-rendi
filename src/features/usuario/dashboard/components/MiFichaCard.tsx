import Card from "../../../../shared/ui/Card";
import Button from "../../../../shared/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../auth/useAuth";

export default function MiFichaCard() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Iniciales del nombre para el avatar en caso de no tener foto
  const iniciales = usuario?.nombre
  ? usuario.nombre
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  : "AT";

  return (
    <Card hover className="relative overflow-hidden">
      {/* Resplandor de fondo ambiental */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center text-center py-2 relative z-10">
        {/* AVATAR TÁCTICO */}
        <div className="relative group">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-surface border border-primary/30 flex items-center justify-center text-2xl font-black text-primary shadow-[0_0_20px_rgba(255,85,0,0.15)] group-hover:border-primary/60 transition-all duration-300">
            {usuario?.fotoUrl ? (
              <img
                src={usuario.fotoUrl}
                alt={usuario.nombre}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <span>{iniciales}</span>
            )}
          </div>
          
          {/* Indicador de perfil activo */}
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-surface" />
        </div>

        {/* NOMBRE Y DATOS */}
        <h3 className="mt-4 text-lg font-extrabold text-text tracking-tight">
          {usuario?.nombre ? `${usuario.nombre} ${usuario.apellido || ""}` : "Mi Ficha"}
        </h3>

        <p className="mt-0.5 text-xs font-semibold text-muted">
          {usuario?.deporte || "Atleta de Alto Rendimiento"}
        </p>

        <p className="mt-2 text-xs text-muted/80 max-w-[220px]">
          Consulta y actualiza tus datos personales y ficha médica
        </p>

        {/* ACCIÓN PRINCIPAL */}
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
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../../../shared/ui";
import JugadorFormModal from "./JugadorFormModal";
import { jugadoresService } from "../services/jugadores.service";
import type { Jugador } from "../types/plantel";

interface Props {
  equipoId: string;
  esVoley: boolean;
}

export default function JugadoresTab({ equipoId, esVoley }: Props) {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // undefined = modal cerrado, null = alta, Jugador = edición
  const [enEdicion, setEnEdicion] = useState<Jugador | null | undefined>(undefined);

  const cargar = useCallback(
    () =>
      jugadoresService
        .obtener(equipoId)
        .then((data) => {
          setJugadores(data);
          setError("");
        })
        .catch((err) => {
          console.error("Error al cargar jugadores:", err);
          setError("No se pudo cargar el plantel.");
        })
        .finally(() => setLoading(false)),
    [equipoId],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  const guardar = async (datos: Omit<Jugador, "id">) => {
    if (enEdicion?.id) {
      await jugadoresService.actualizar(equipoId, enEdicion.id, datos);
    } else {
      await jugadoresService.crear(equipoId, datos);
    }
    await cargar();
  };

  const eliminar = async (j: Jugador) => {
    if (!j.id || !confirm(`¿Eliminar a ${j.nombre} ${j.apellido} del plantel?`)) return;
    try {
      await jugadoresService.eliminar(equipoId, j.id);
      await cargar();
    } catch (err) {
      console.error("Error al eliminar jugador:", err);
      setError("No se pudo eliminar.");
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-surfaceSoft space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-text">
          Plantel {!loading && <span className="text-muted">({jugadores.length})</span>}
        </h3>
        <Button size="sm" onClick={() => setEnEdicion(null)}>+ Agregar</Button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {loading ? (
        <p className="text-xs text-muted text-center py-6">Cargando plantel...</p>
      ) : jugadores.length === 0 ? (
        !error && <p className="text-xs text-muted text-center py-6">Todavía no hay nadie cargado.</p>
      ) : (
        <ul className="space-y-2">
          {jugadores.map((j) => (
            <li key={j.id} className="p-3 rounded-xl bg-background/80 flex items-center gap-3">
              <span className="w-9 h-9 shrink-0 rounded-lg bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
                {j.numero ?? "-"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text truncate">{j.apellido}, {j.nombre}</p>
                <p className="text-xs text-muted">
                  {j.posicion}
                  {j.posicionAlternativa && ` · Alt: ${j.posicionAlternativa}`}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setEnEdicion(j)}>Editar</Button>
              <Button size="sm" variant="ghost" onClick={() => eliminar(j)}>Eliminar</Button>
            </li>
          ))}
        </ul>
      )}

      {enEdicion !== undefined && (
        <JugadorFormModal
          jugador={enEdicion}
          esVoley={esVoley}
          onClose={() => setEnEdicion(undefined)}
          onGuardar={guardar}
        />
      )}
    </div>
  );
}

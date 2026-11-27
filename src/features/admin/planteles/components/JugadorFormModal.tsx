import { useState } from "react";
import { Button, Modal } from "../../../../shared/ui";
import { POSICIONES_VOLEY, type Jugador } from "../types/plantel";

interface Props {
  jugador: Jugador | null; // null = alta
  esVoley: boolean;
  onClose: () => void;
  onGuardar: (datos: Omit<Jugador, "id">) => Promise<void>;
}

const campo =
  "w-full h-11 px-3 rounded-xl bg-background text-text text-sm mt-1 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/50";
const etiqueta = "block text-[10px] font-mono uppercase text-muted font-semibold";

export default function JugadorFormModal({ jugador, esVoley, onClose, onGuardar }: Props) {
  const [nombre, setNombre] = useState(jugador?.nombre ?? "");
  const [apellido, setApellido] = useState(jugador?.apellido ?? "");
  const [numero, setNumero] = useState(jugador?.numero?.toString() ?? "");
  const [posicion, setPosicion] = useState(jugador?.posicion ?? "");
  const [alternativa, setAlternativa] = useState(jugador?.posicionAlternativa ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim() || !posicion.trim()) {
      setError("Completá nombre, apellido y posición cómoda.");
      return;
    }
    try {
      setGuardando(true);
      setError("");
      await onGuardar({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        numero: numero === "" ? null : Number(numero),
        posicion: posicion.trim(),
        posicionAlternativa: alternativa.trim(),
      });
      onClose();
    } catch (err) {
      console.error("Error al guardar jugador:", err);
      setError("No se pudo guardar. Revisá la conexión y los permisos.");
      setGuardando(false);
    }
  };

  const selectorPosicion = (
    valor: string,
    cambiar: (v: string) => void,
    vacio: string,
    nombreCampo: string,
  ) =>
    esVoley ? (
      <select name={nombreCampo} value={valor} onChange={(e) => cambiar(e.target.value)} className={campo}>
        <option value="">{vacio}</option>
        {POSICIONES_VOLEY.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    ) : (
      <input name={nombreCampo} value={valor} onChange={(e) => cambiar(e.target.value)} className={campo} />
    );

  return (
    <Modal title={jugador ? "Editar ficha" : "Cargar al plantel"} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className={etiqueta}>
            Nombre
            <input name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} />
          </label>
          <label className={etiqueta}>
            Apellido
            <input name="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} className={campo} />
          </label>
        </div>
        <label className={etiqueta}>
          Número de camiseta (opcional)
          <input
            name="numero"
            type="number"
            min={0}
            max={99}
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className={campo}
          />
        </label>
        <label className={etiqueta}>
          Posición cómoda
          {selectorPosicion(posicion, setPosicion, "Elegir...", "posicion")}
        </label>
        <label className={etiqueta}>
          Posición alternativa (opcional)
          {selectorPosicion(alternativa, setAlternativa, "Ninguna", "alternativa")}
        </label>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={guardando}>Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}

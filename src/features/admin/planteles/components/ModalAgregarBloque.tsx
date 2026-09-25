import { useState } from "react";
import type { BloqueSesion } from "../types/plantel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Cambiamos "orden" por "id" en el Omit para coincidir con la función agregarBloque
  onAgregar: (bloque: Omit<BloqueSesion, "id">) => void;
}

export default function ModalAgregarBloque({ isOpen, onClose, onAgregar }: Props) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<BloqueSesion["categoria"]>("entrada_en_calor");
  const [duracionMinutos, setDuracionMinutos] = useState(15);
  const [descripcion, setDescripcion] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    onAgregar({
      titulo,
      categoria,
      duracionMinutos: Number(duracionMinutos),
      descripcion,
      orden: 1, // Se envía la propiedad 'orden' requerida
    });

    // Resetear formulario
    setTitulo("");
    setCategoria("entrada_en_calor");
    setDuracionMinutos(15);
    setDescripcion("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surfaceSoft border border-background/80 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-background/60 pb-3">
          <h3 className="text-base font-bold text-text">➕ Agregar Bloque</h3>
          <button onClick={onClose} className="text-muted hover:text-text text-sm p-1">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-mono uppercase text-muted font-semibold">
              Título del Bloque
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Aceleraciones de 10m / Sentadilla"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-background text-text text-xs mt-1 shadow-inner focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-muted font-semibold">
                Orientación / Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as BloqueSesion["categoria"])}
                className="w-full h-11 px-3 rounded-xl bg-background text-text text-xs mt-1 shadow-inner focus:outline-none cursor-pointer"
              >
                <option value="entrada_en_calor">Entrada en calor</option>
                <option value="activacion">Activación</option>
                <option value="fuerza">Fuerza</option>
                <option value="resistencia">Resistencia</option>
                <option value="zona_media">Zona Media</option>
                <option value="tactico">Táctico</option>
                <option value="vuelta_a_la_calma">Vuelta a la calma</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted font-semibold">
                Duración (min)
              </label>
              <input
                type="number"
                min={1}
                required
                value={duracionMinutos}
                onChange={(e) => setDuracionMinutos(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl bg-background text-text text-xs mt-1 shadow-inner focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-muted font-semibold">
              Descripción / Ejercicios
            </label>
            <textarea
              rows={3}
              placeholder="Detalla las series, repeticiones o pautas..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-3 rounded-xl bg-background text-text text-xs mt-1 shadow-inner focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 text-xs font-bold rounded-xl bg-background text-muted hover:text-text transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-11 text-xs font-bold rounded-xl bg-primary text-black hover:bg-primary/90 transition-all shadow-md shadow-primary/25 active:scale-95"
            >
              Guardar Bloque
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
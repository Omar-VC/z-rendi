import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (equipo: { nombre: string; deporte: string; categoria?: string }) => Promise<void>;
}

export default function ModalCrearEquipo({ isOpen, onClose, onSubmit }: Props) {
  const [nombre, setNombre] = useState("");
  const [deporte, setDeporte] = useState("Fútbol");
  const [categoria, setCategoria] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      setSubmitting(true);
      await onSubmit({ nombre, deporte, categoria });
      setNombre("");
      setCategoria("");
      onClose();
    } catch (error) {
      alert("Error al crear el plantel");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md p-6 rounded-2xl bg-surfaceSoft shadow-[0_12px_40px_rgba(0,0,0,0.3)] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Crear Nuevo Equipo</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-background flex items-center justify-center text-muted hover:text-text transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
              Nombre del Plantel
            </label>
            <input
              type="text"
              placeholder="Ej: Plantel Superior / Primera División"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-xl bg-background text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
              Deporte
            </label>
            <select
              value={deporte}
              onChange={(e) => setDeporte(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-background text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner"
            >
              <option value="Fútbol">Fútbol</option>
              <option value="Rugby">Rugby</option>
              <option value="Vóley">Vóley</option>
              <option value="Basquet">Básquet</option>
              <option value="Hockey">Hockey</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
              Categoría (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: M19, Sub-20, Senior"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-background text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 text-xs font-bold text-muted hover:text-text transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 px-6 text-xs font-bold rounded-xl bg-primary text-black hover:bg-primary/90 transition-all shadow-md shadow-primary/25 disabled:opacity-50"
            >
              {submitting ? "Guardando..." : "Guardar Equipo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
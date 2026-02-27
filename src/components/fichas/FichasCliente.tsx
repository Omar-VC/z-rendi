import { useFichas } from "../../hooks/useFichas";
import FichaList from "./FichaList";
import FichaDetail from "./FichaDetail";
import { useState } from "react";

const FichasCliente = ({ clienteId }: { clienteId: string }) => {
  const { fichas, addFicha, updateFicha, deleteFicha } = useFichas(clienteId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    lesiones: "",
    altura: "",
    peso: "",
    deporte: "",
    puesto: "",
    telefono: "",
  });

  const selectedFicha = fichas.find((f) => f.id === selectedId);

  const handleCreate = async () => {
    await addFicha(formData);
    setIsModalOpen(false);
    setFormData({
      nombre: "",
      apellido: "",
      edad: "",
      lesiones: "",
      altura: "",
      peso: "",
      deporte: "",
      puesto: "",
      telefono: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Botón para abrir formulario */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary"
      >
        Nueva Ficha
      </button>

      {/* Formulario modal */}
      {isModalOpen && (
        <div className="border border-white/20 bg-secondary/40 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Crear nueva ficha
          </h3>

          <div className="space-y-3">
            <input
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="input"
            />
            <input
              placeholder="Apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              className="input"
            />
            <input
              type="number"
              placeholder="Edad"
              value={formData.edad}
              onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
              className="input"
            />
            <input
              placeholder="Historial de lesiones"
              value={formData.lesiones}
              onChange={(e) => setFormData({ ...formData, lesiones: e.target.value })}
              className="input"
            />
            <input
              type="number"
              placeholder="Altura (cm)"
              value={formData.altura}
              onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
              className="input"
            />
            <input
              type="number"
              placeholder="Peso (Kg)"
              value={formData.peso}
              onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
              className="input"
            />
            <input
              placeholder="Deporte"
              value={formData.deporte}
              onChange={(e) => setFormData({ ...formData, deporte: e.target.value })}
              className="input"
            />
            <input
              placeholder="Puesto"
              value={formData.puesto}
              onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
              className="input"
            />
            <input
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="input"
            />
          </div>

          <div className="mt-6 flex space-x-3">
            <button onClick={handleCreate} className="btn btn-success">
              Guardar
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de fichas */}
      <FichaList
        fichas={fichas}
        selectedId={selectedId ? parseInt(selectedId) : null}
        onSelect={(id) => setSelectedId(id.toString())}
      />

      {/* Detalle de ficha seleccionada */}
      <FichaDetail
        ficha={selectedFicha}
        onDelete={deleteFicha}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
};

export default FichasCliente;

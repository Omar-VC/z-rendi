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
     }); };

  return (
    <div className="space-y-4">
      {/* Botón para abrir formulario */}
      <button onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Nueva Ficha
      </button>

      {/* Formulario modal */}
      {isModalOpen && (
  <div className="border p-4 bg-white rounded shadow">
    <h3 className="font-semibold mb-2">Crear nueva ficha</h3>

    <input
      placeholder="Nombre"
      value={formData.nombre}
      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
      className="border p-1 mb-2 w-full"
    />
    <input
      placeholder="Apellido"
      value={formData.apellido}
      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
      className="border p-1 mb-2 w-full"
    />
    <input
      type="number"
      placeholder="Edad"
      value={formData.edad}
      onChange={(e) => setFormData({ ...formData, edad: Number(e.target.value) })}
      className="border p-1 mb-2 w-full"
    />
    <input
      placeholder="Historial de lesiones"
      value={formData.lesiones}
      onChange={(e) => setFormData({ ...formData, lesiones: e.target.value })}
      className="border p-1 mb-2 w-full"
    />
    <input
      type="number"
      placeholder="Altura (cm)"
      value={formData.altura}
      onChange={(e) => setFormData({ ...formData, altura: Number(e.target.value) })}
      className="border p-1 mb-2 w-full"
    />
    <input
      type="number"
      placeholder="Peso (Kg)"
      value={formData.peso}
      onChange={(e) => setFormData({ ...formData, peso: Number(e.target.value) })}
      className="border p-1 mb-2 w-full"
    />
    <input
      placeholder="Deporte"
      value={formData.deporte}
      onChange={(e) => setFormData({ ...formData, deporte: e.target.value })}
      className="border p-1 mb-2 w-full"
    />
    <input
      placeholder="Puesto"
      value={formData.puesto}
      onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
      className="border p-1 mb-2 w-full"
    />
    <input
      placeholder="Teléfono"
      value={formData.telefono}
      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
      className="border p-1 mb-2 w-full"
    />

    <button
      onClick={handleCreate}
      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
    >
      Guardar
    </button>
    <button
      onClick={() => setIsModalOpen(false)}
      className="bg-gray-400 text-white px-3 py-1 rounded"
    >
      Cancelar
    </button>
  </div>
)}
      <FichaList
        fichas={fichas}
        selectedId={selectedId ? parseInt(selectedId) : null}
        onSelect={(id) => setSelectedId(id.toString())}
      />
      <FichaDetail ficha={selectedFicha}
      onDelete={deleteFicha} 
      onClose={() => setSelectedId(null)}
      />
    </div>
  );
};

export default FichasCliente;

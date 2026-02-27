import { useParams } from "react-router-dom";
import { useState } from "react";
import FichasCliente from "../components/fichas/FichasCliente";
import CuotasCliente from "../components/Cuotas/CuotasCliente";
import SesionesCliente from "../components/Sesiones/SesionesCliente";

const ClienteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"fichas" | "cuotas" | "sesiones">("fichas");

  if (!id) return <div className="text-red-500">No se encontró el cliente</div>;

  return (
    <div className="min-h-screen bg-primary/90 backdrop-blur-sm p-6 text-white">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-white/20 pb-2 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg transition-colors duration-300 ${
            activeTab === "fichas"
              ? "bg-highlight text-white font-bold"
              : "text-gray-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("fichas")}
        >
          Fichas
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg transition-colors duration-300 ${
            activeTab === "cuotas"
              ? "bg-highlight text-white font-bold"
              : "text-gray-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("cuotas")}
        >
          Cuotas
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg transition-colors duration-300 ${
            activeTab === "sesiones"
              ? "bg-highlight text-white font-bold"
              : "text-gray-300 hover:text-white"
          }`}
          onClick={() => setActiveTab("sesiones")}
        >
          Sesiones
        </button>
      </div>

      {/* Contenido según tab */}
      <div className="bg-secondary/40 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6">
        {activeTab === "fichas" && <FichasCliente clienteId={id} />}
        {activeTab === "cuotas" && <CuotasCliente clienteId={id} />}
        {activeTab === "sesiones" && (
          <SesionesCliente clienteId={id} clientes={[]} />
        )}
      </div>
    </div>
  );
};

export default ClienteDetail;

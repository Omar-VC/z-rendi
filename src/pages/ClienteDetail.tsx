import { useParams } from "react-router-dom";
import { useState } from "react";
import FichasCliente from "../components/fichas/FichasCliente";
import CuotasCliente from "../components/Cuotas/CuotasCliente";
import SesionesCliente from "../components/Sesiones/SesionesCliente";

const ClienteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"fichas" | "cuotas" | "sesiones">("fichas");

  if (!id) return <div>No se encontró el cliente</div>;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        <button
          className={activeTab === "fichas" ? "font-bold text-blue-600" : ""}
          onClick={() => setActiveTab("fichas")}
        >
          Fichas
        </button>
        <button
          className={activeTab === "cuotas" ? "font-bold text-blue-600" : ""}
          onClick={() => setActiveTab("cuotas")}
        >
          Cuotas
        </button>
        <button
          className={activeTab === "sesiones" ? "font-bold text-blue-600" : ""}
          onClick={() => setActiveTab("sesiones")}
        >
          Sesiones
        </button>
      </div>

      {/* Contenido según tab */}
      {activeTab === "fichas" && <FichasCliente clienteId={id} />}
      {activeTab === "cuotas" && <CuotasCliente clienteId={id} />}
      {activeTab === "sesiones" && (
        <SesionesCliente clienteId={id} clientes={[]} /> 
        // 👆 acá podés pasar la lista de fichas si querés mostrar nombre/apellido en sesiones
      )}
    </div>
  );
};

export default ClienteDetail;

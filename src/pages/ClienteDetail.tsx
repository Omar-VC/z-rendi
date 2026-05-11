import { useParams } from "react-router-dom";
import { useState } from "react";
import FichasCliente from "../features/fichas/components/FichasCliente";
import CuotasCliente from "../features/cuotas/components/CuotasCliente";
import SesionesCliente from "../features/sesiones/components/SesionesCliente";

const ClienteDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<"fichas" | "cuotas" | "sesiones">(
    "fichas",
  );

  if (!id)
    return (
      <div style={{ color: "var(--primary)" }}>No se encontró el cliente</div>
    );

  const tabClass = (tab: string) =>
    `px-4 py-2 rounded-t-lg transition-colors duration-200 ${
      activeTab === tab ? "bg-white/10 text-white" : "text-gray-400"
    }`;

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* Tabs */}
      <div
        className="flex space-x-4 border-b pb-2 mb-6"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          className={tabClass("fichas")}
          onClick={() => setActiveTab("fichas")}
        >
          Fichas
        </button>

        <button
          className={tabClass("cuotas")}
          onClick={() => setActiveTab("cuotas")}
        >
          Cuotas
        </button>

        <button
          className={tabClass("sesiones")}
          onClick={() => setActiveTab("sesiones")}
        >
          Sesiones
        </button>
      </div>

      {/* Contenido */}
      <div
        className="rounded-xl p-6 border backdrop-blur-md shadow-lg"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {activeTab === "fichas" && <FichasCliente clienteId={id} />}
        {activeTab === "cuotas" && (
          <CuotasCliente clienteId={id} adminMode={true} />
        )}
        {activeTab === "sesiones" && <SesionesCliente clienteId={id} />}
      </div>
    </div>
  );
};

export default ClienteDetail;

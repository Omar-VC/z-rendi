import { useParams } from "react-router-dom";
import { useState } from "react";
import FichasCliente from "../features/fichas/components/FichasCliente";
import CuotasCliente from "../features/cuotas/components/CuotasCliente";
import SesionesCliente from "../features/sesiones/components/SesionesCliente";

const ClienteDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<
    "fichas" | "cuotas" | "sesiones"
  >("fichas");

  if (!id)
    return (
      <div style={{ color: "var(--primary)" }}>
        No se encontró el cliente
      </div>
    );

  const tabClass = (tab: string) =>
    `px-4 py-2 rounded-t-lg transition-colors duration-200`;

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
          style={{
            backgroundColor:
              activeTab === "fichas" ? "var(--surface)" : "transparent",
            color:
              activeTab === "fichas"
                ? "var(--text)"
                : "var(--text-muted)",
          }}
        >
          Fichas
        </button>

        <button
          className={tabClass("cuotas")}
          onClick={() => setActiveTab("cuotas")}
          style={{
            backgroundColor:
              activeTab === "cuotas" ? "var(--surface)" : "transparent",
            color:
              activeTab === "cuotas"
                ? "var(--text)"
                : "var(--text-muted)",
          }}
        >
          Cuotas
        </button>

        <button
          className={tabClass("sesiones")}
          onClick={() => setActiveTab("sesiones")}
          style={{
            backgroundColor:
              activeTab === "sesiones" ? "var(--surface)" : "transparent",
            color:
              activeTab === "sesiones"
                ? "var(--text)"
                : "var(--text-muted)",
          }}
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
        {activeTab === "cuotas" && <CuotasCliente clienteId={id} />}
        {activeTab === "sesiones" && <SesionesCliente clienteId={id} />}
      </div>
    </div>
  );
};

export default ClienteDetail;
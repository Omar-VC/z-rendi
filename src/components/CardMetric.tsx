import React from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaExclamationCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

interface CardMetricProps {
  title: string;
  value: string | number;
  variant?: "success" | "warning" | "danger" | "info";
}

const variantStyles: Record<string, string> = {
  success: "border-green-500/30",
  warning: "border-yellow-500/30",
  danger: "border-red-500/30",
  info: "border-white/10",
};

const iconMap: Record<string, React.ReactNode> = {
  "Fichas Activas": <FaUsers size={28} />,
  "Sesiones Programadas": <FaCalendarAlt size={28} />,
  "Cuotas Pendientes": <FaExclamationCircle size={28} />,
  "Ingresos Proyectados": <FaMoneyBillWave size={28} />,
};

const CardMetric: React.FC<CardMetricProps> = ({
  title,
  value,
  variant = "info",
}) => {
  const icon = iconMap[title] ?? null;

  return (
    <div
      className={`rounded-xl p-6 flex flex-col items-center justify-center text-center 
      border backdrop-blur-md shadow-lg transition duration-300 
      hover:scale-105 hover:shadow-2xl ${variantStyles[variant]}`}
      style={{ backgroundColor: "var(--surface)" }}
    >
      {/* Icono */}
      {icon && <div className="mb-3 opacity-90">{icon}</div>}

      {/* Título */}
      <h3 className="text-base md:text-lg font-semibold mb-2 tracking-tight text-[var(--text)]">
        {title}
      </h3>

      {/* Valor */}
      <p className="text-2xl md:text-3xl font-extrabold text-[var(--text)] truncate max-w-full">
        {value}
      </p>
    </div>
  );
};

export default CardMetric;
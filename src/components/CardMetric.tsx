import React from "react";
import { FaUsers, FaCalendarAlt, FaExclamationCircle, FaMoneyBillWave } from "react-icons/fa";

interface CardMetricProps {
  title: string;
  value: string | number;
  variant?: "success" | "warning" | "danger" | "info";
}

const variantStyles: Record<string, string> = {
  success:
    "bg-green-600/70 backdrop-blur-md border border-white/20 shadow-lg text-white",
  warning:
    "bg-yellow-500/70 backdrop-blur-md border border-white/20 shadow-lg text-black",
  danger:
    "bg-red-600/70 backdrop-blur-md border border-white/20 shadow-lg text-white",
  info:
    "bg-secondary/40 backdrop-blur-md border border-white/20 shadow-lg text-white",
};

const iconMap: Record<string, JSX.Element> = {
  "Fichas Activas": <FaUsers size={28} />,
  "Sesiones Programadas": <FaCalendarAlt size={28} />,
  "Cuotas Pendientes": <FaExclamationCircle size={28} />,
  "Ingresos Proyectados": <FaMoneyBillWave size={28} />,
};

const CardMetric: React.FC<CardMetricProps> = ({ title, value, variant = "info" }) => {
  const style = variantStyles[variant];
  const icon = iconMap[title] ?? null;

  return (
    <div
      className={`${style} rounded-xl p-6 flex flex-col items-center justify-center text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      {/* Icono */}
      {icon && <div className="mb-3">{icon}</div>}

      {/* Título */}
      <h3 className="text-base md:text-lg font-semibold mb-2 tracking-tight">
        {title}
      </h3>

      {/* Valor */}
      <p className="text-2xl md:text-3xl font-extrabold truncate max-w-full">
        {value}
      </p>
    </div>
  );
};

export default CardMetric;

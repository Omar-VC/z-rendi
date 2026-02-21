import React from "react";

interface CardMetricProps {
  title: string;
  value: string | number;
  color?: string; // opcional para personalizar fondo
}

const CardMetric: React.FC<CardMetricProps> = ({ title, value, color }) => {
  return (
    <div className={`rounded-lg shadow-md p-6 text-center ${color || "bg-white"}`}>
      <h3 className="text-gray-700 font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default CardMetric;

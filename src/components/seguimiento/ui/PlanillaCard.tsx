// src/components/seguimiento/ui/PlanillaCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface PlanillaCardProps {
  planillaId: string;
  nombre: string;
  onDeletePlanilla: (id: string) => void;
}

const PlanillaCard: React.FC<PlanillaCardProps> = ({
  planillaId,
  nombre,
  onDeletePlanilla,
}) => {
  const navigate = useNavigate();

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{nombre}</h2>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/planillas/${planillaId}`)}
            className="btn btn-primary"
          >
            Ver planilla
          </button>

          <button
            onClick={() => onDeletePlanilla(planillaId)}
            className="btn btn-danger"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanillaCard;
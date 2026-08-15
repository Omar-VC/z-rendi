import { useState } from "react";

interface RegistroAsistencia {
  id: string;
  fecha: string;
  estado: "presente" | "falta";
}

interface HistorialAsistenciaProps {
  asistencias: RegistroAsistencia[];
}

function HistorialAsistencia({
  asistencias,
}: HistorialAsistenciaProps) {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const asistenciasOrdenadas = [...asistencias].sort(
    (a, b) =>
      new Date(b.fecha).getTime() -
      new Date(a.fecha).getTime(),
  );

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setMostrarHistorial(!mostrarHistorial)}
        className="
          w-full
          flex
          items-center
          justify-between
          py-3
          text-sm
          font-semibold
          text-text
          border-b
          border-border
        "
      >
        <span>Historial de asistencia</span>

        <span>
          {mostrarHistorial ? "▲" : "▼"}
        </span>
      </button>

      {mostrarHistorial && (
        <div className="divide-y divide-border">
          {asistenciasOrdenadas.length === 0 ? (
            <p className="py-4 text-sm text-muted">
              Sin registros este mes.
            </p>
          ) : (
            asistenciasOrdenadas.map((registro) => {
              const fechaFormateada = new Date(
                registro.fecha + "T00:00:00",
              ).toLocaleDateString("es-AR");

              return (
                <div
                  key={registro.id}
                  className="
                    flex
                    items-center
                    justify-between
                    py-3
                    text-sm
                  "
                >
                  <span className="text-muted">
                    {fechaFormateada}
                  </span>

                  <span
                    className={
                      registro.estado === "presente"
                        ? "font-semibold text-success"
                        : "font-semibold text-danger"
                    }
                  >
                    {registro.estado === "presente"
                      ? "Presente"
                      : "Falta"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default HistorialAsistencia;
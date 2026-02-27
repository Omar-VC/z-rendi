import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FichaDetail from "../components/fichas/FichaDetail";
import CuotaDetailCliente from "../components/cuotas/CuotaDetailCliente";
import { useFichas } from "../hooks/useFichas";
import { useCuotas } from "../hooks/useCuotas";
import { useSesiones } from "../hooks/useSesiones";
import NavbarCliente from "../components/NavbarCliente";

const ClienteDashboard = ({ clienteId }: { clienteId: string }) => {
  const { fichas } = useFichas(clienteId);
  const { cuotas } = useCuotas(clienteId);
  const { sesiones } = useSesiones(clienteId);

  const ficha = fichas[0];
  const cuota = cuotas[0]; // suponemos una cuota activa
  const sesionActual = sesiones[0]; // la más reciente

  const [showFicha, setShowFicha] = useState(false);
  const [showCuota, setShowCuota] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-20"> {/* pb-20 para que no tape el navbar */}
      {/* Navbar fijo abajo */}
      <NavbarCliente />

      {/* Tarjetas */}
      <div className="grid gap-4 md:grid-cols-3 p-4">
        <div
          onClick={() => setShowFicha(true)}
          className="cursor-pointer rounded-lg border p-4 shadow hover:bg-blue-50"
        >
          <h2 className="text-lg font-semibold">Mi ficha</h2>
          <p className="text-sm text-slate-600">Ver mis datos personales</p>
        </div>

        <div
          onClick={() => setShowCuota(true)}
          className="cursor-pointer rounded-lg border p-4 shadow hover:bg-blue-50"
        >
          <h2 className="text-lg font-semibold">Mi cuota</h2>
          <p className="text-sm text-slate-600">Ver estado de pago</p>
        </div>

        <div
          onClick={() => navigate("/mis-sesiones")}
          className="cursor-pointer rounded-lg border p-4 shadow hover:bg-blue-50"
        >
          <h2 className="text-lg font-semibold">Mis sesiones</h2>
          <p className="text-sm text-slate-600">Ver sesión actual e historial</p>
        </div>
      </div>

      {/* Modal ficha */}
      {showFicha && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            {ficha ? (
              <FichaDetail ficha={ficha} onClose={() => setShowFicha(false)} />
            ) : (
              <div className="text-center">
                <p className="text-slate-600">Todavía no tenés ficha asignada.</p>
                <button
                  onClick={() => setShowFicha(false)}
                  className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal cuota */}
{showCuota && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-96">
      {cuota ? (
        <CuotaDetailCliente cuota={cuota} onClose={() => setShowCuota(false)} />
      ) : (
        <div className="text-center">
          <p className="text-slate-600">Todavía no tenés cuota asignada.</p>
          <button
            onClick={() => setShowCuota(false)}
            className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default ClienteDashboard;

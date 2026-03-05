import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import "./styles/global.css";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegistroCliente from "./pages/RegistroCliente";
import ClientesPage from "./pages/ClientesPage";
import ClienteDetail from "./pages/ClienteDetail";
import ClienteDashboard from "./pages/ClienteDashboard";

import AdminLayout from "./layouts/AdminLayout";
import { useCliente } from "./hooks/useCliente";

function App() {
  const navigate = useNavigate(); // 👈 ahora sí funciona

  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);

  const { cliente, loading: clienteLoading } = useCliente(user?.uid ?? "");

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult(true);
        const userRole = idTokenResult.claims.role as string | undefined;
        setRole(userRole ?? "cliente");
        console.log("Claims:", idTokenResult.claims);
      } else {
        setRole(null);
      }
    };
    fetchUserRole();
  }, [user]);

  if (loading || clienteLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <Routes>
      {/* Login y registro */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />

      {/* Admin con AdminLayout */}
      {user && role === "admin" && (
        <Route element={<AdminLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/clientes/:id" element={<ClienteDetail />} />
        </Route>
      )}

      {/* Cliente con ClienteDashboard */}
      {user && role === "cliente" && cliente?.estado === "aprobado" && (
        <Route
          path="/cliente-dashboard"
          element={
            <ClienteDashboard
              clienteId={user.uid}
              clienteNombre={
                cliente ? `${cliente.nombre} ${cliente.apellido}` : "Cliente"
              }
            />
          }
        />
      )}

      {/* Si está pendiente */}
      {user && role === "cliente" && cliente?.estado === "pendiente" && (
        <Route
          path="/cliente-dashboard"
          element={
            <div className="flex items-center justify-center h-screen bg-primary text-white">
              <div className="bg-secondary/40 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center shadow-lg">
                <h2 className="text-2xl font-bold mb-4">
                  Cuenta pendiente de aprobación
                </h2>
                <p className="mb-6">
                  Tu registro fue exitoso, pero aún está pendiente de
                  aprobación por el administrador.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="btn bg-accent hover:bg-highlight px-6 py-2 rounded-lg"
                >
                  Volver al Login
                </button>
              </div>
            </div>
          }
        />
      )}

      {/* Redirecciones */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              user
                ? role === "admin"
                  ? "/home"
                  : "/cliente-dashboard"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import ClienteSesiones from "./pages/ClienteSesiones";

import AdminLayout from "./layouts/AdminLayout";
import NavbarCliente from "./components/NavbarCliente";

function App() {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <Router>
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

        {/* Cliente con NavbarCliente */}
        {user && role === "cliente" && (
          <>
            <Route
              path="/cliente-dashboard"
              element={<ClienteDashboard clienteId={user.uid} />}
            />
            <Route path="/mis-sesiones" element={<ClienteSesiones />} />
          </>
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
    </Router>
  );
}

export default App;

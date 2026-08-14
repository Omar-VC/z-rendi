import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./auth/useAuth";

import LoginPage from "./auth/pages/LoginPage";

import AdminLayout from "./layouts/AdminLayout";
import ClienteLayoutV2 from "./layouts/ClienteLayoutV2";

import ClientesPageV2 from "./features/admin/clientes/pages/ClientesPageV2";
import ClienteDetailV2 from "./features/admin/clientes/pages/ClienteDetailV2";
import BibliotecaPageV2 from "./features/admin/biblioteca/pages/BibliotecaPageV2";

import ClienteDashboard from "./features/usuario/dashboard/pages/ClienteDashboard";
import SesionClientePage from "./features/usuario/dashboard/pages/SesionClientePage";

import MiFichaPage from "./features/usuario/ficha/pages/MiFichaPage";

function App() {
  const { user, usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <Routes>
      {/* LOGIN */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* ADMIN */}

      {user && usuario?.rol === "admin" && (
        <Route element={<AdminLayout />}>
          <Route
            path="/clientes"
            element={<ClientesPageV2 />}
          />

          <Route
            path="/clientes/:id"
            element={<ClienteDetailV2 />}
          />

          <Route
            path="/biblioteca"
            element={<BibliotecaPageV2 />}
          />
        </Route>
      )}

      {/* CLIENTE */}

      {user && usuario?.rol === "cliente" && (
        <Route
          path="/cliente"
          element={<ClienteLayoutV2 />}
        >
          {/* Dashboard */}

          <Route
            index
            element={<ClienteDashboard />}
          />

          {/* Sesión asignada */}

          <Route
            path="sesion/:id"
            element={<SesionClientePage />}
          />

          {/* Ficha */}

          <Route
            path="ficha"
            element={<MiFichaPage />}
          />
        </Route>
      )}

      {/* FALLBACK */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              user
                ? usuario?.rol === "admin"
                  ? "/clientes"
                  : "/cliente"
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
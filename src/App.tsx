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
import RegistroPage from "./auth/pages/RegistroPage";
import Logo from "./shared/components/sidebar/Logo";
import SplashLogo from "./shared/components/sidebar/SplashLogo";

function App() {
  const { user, usuario, loading } = useAuth();

 if (loading) {
    return (
      <div className="min-h-screen bg-background text-text relative flex items-center justify-center overflow-hidden selection:bg-primary/30 selection:text-primary">
        {/* Luz ambiental sutil de fondo */}
        <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Contenedor central con efecto de luz/fuego y el SplashLogo */}
        <div className="relative z-10 flex flex-col items-center animate-fire-glow">
          {/* Esfera trasera luminosa */}
          <div className="absolute -inset-6 bg-gradient-to-t from-orange-600/30 to-amber-500/20 rounded-3xl blur-2xl animate-pulse pointer-events-none" />

          {/* Logo de presentación */}
          <div className="relative">
            <SplashLogo />
          </div>

          {/* Puntos de carga inferiores */}
          <div className="mt-10 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
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

      {/* REGISTRO */}

      <Route
        path="/registro"
        element={<RegistroPage />}
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
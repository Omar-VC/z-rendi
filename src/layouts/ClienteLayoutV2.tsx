import { auth } from "../firebase/firebase";

interface ClienteLayoutProps {
  clienteNombre: string;
}

function ClienteLayoutV2({
  clienteNombre,
}: ClienteLayoutProps) {
  return (
    <div className="min-h-screen p-6 text-white">
      
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">
          Hola, {clienteNombre}
        </h1>

        <button
          onClick={() => auth.signOut()}
          className="px-4 py-2 rounded-lg"
        >
          Salir
        </button>
      </header>


      <main>
        <h2 className="text-2xl font-bold">
          Mi información
        </h2>

        <p className="mt-4 opacity-70">
          Próximamente aquí estará tu ficha,
          cuotas, asistencia y seguimiento.
        </p>
      </main>

    </div>
  );
}

export default ClienteLayoutV2;
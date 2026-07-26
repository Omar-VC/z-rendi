import { Outlet } from "react-router-dom";
import { auth } from "../firebase/firebase";


function ClienteLayoutV2() {

  return (
    <div className="min-h-screen p-6">

      <header className="flex justify-between items-center mb-8">

        <h1 className="text-xl font-bold text-primary">
          Z-Rendi
        </h1>


        <button
          onClick={() => auth.signOut()}
          className="px-4 py-2 rounded-xl bg-accent text-white font-semibold"
        >
          Salir
        </button>

      </header>


      <main>
        <Outlet />
      </main>

    </div>
  );
}


export default ClienteLayoutV2;
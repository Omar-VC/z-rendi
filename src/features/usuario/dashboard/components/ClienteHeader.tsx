import { useAuth } from "../../../../auth/useAuth";
import { useFichaCliente } from "../../../admin/fichas/hooks/useFichaCliente";

export default function ClienteHeader() {
  const { user } = useAuth();

  const { ficha, loading } = useFichaCliente(user?.uid);

  if (loading) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary">Hola {ficha?.nombre} 👋</h1>

      <p className="text-slate-500 mt-2">Tu evolución deportiva</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <span className="px-3 py-1 rounded-full bg-secondary text-primary text-sm font-semibold">
          {ficha?.deporte || "-"}
        </span>

        <span className="px-3 py-1 rounded-full bg-secondary text-primary text-sm font-semibold">
          {ficha?.puesto || "-"}
        </span>
      </div>
    </div>
  );
}

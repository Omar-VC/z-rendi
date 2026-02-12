import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

interface Usuario {
  id: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  [key: string]: any;
}

interface Ficha {
  edad?: number;
  altura?: number;
  peso?: number;
  posicion?: string;
  lesiones?: string;
  [key: string]: any;
}

interface Cuota {
  id?: string;
  clienteId: string;
  monto: number;
  vencimiento: string;
  estado: string;
  [key: string]: any;
}

interface Sesion {
  id?: string;
  clienteId: string;
  fecha: string;
  tipo: string;
  notas?: string;
  [key: string]: any;
}

const ClientesAdmin: React.FC = () => {
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Usuario | null>(null);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para mostrar formularios
  const [showFichaForm, setShowFichaForm] = useState(false);
  const [showCuotaForm, setShowCuotaForm] = useState(false);
  const [showSesionForm, setShowSesionForm] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoadingClientes(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, "usuarios"));
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Usuario[];
      setClientes(lista);
    } catch (err: any) {
      setError("Error al cargar clientes: " + (err.message ?? err));
    } finally {
      setLoadingClientes(false);
    }
  };

  const fetchClienteData = async (clienteId: string) => {
    setLoadingData(true);
    setError(null);
    try {
      // Ficha (documento con id = clienteId)
      const fichaDoc = await getDoc(doc(db, "fichas", clienteId));
      setFicha(fichaDoc.exists() ? (fichaDoc.data() as Ficha) : null);

      // Cuotas (colección 'cuotas' filtrada por clienteId)
      const cuotasQuery = query(collection(db, "cuotas"), where("clienteId", "==", clienteId), orderBy("vencimiento", "desc"));
      const cuotasSnap = await getDocs(cuotasQuery);
      const cuotasList = cuotasSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Cuota[];
      setCuotas(cuotasList);

      // Sesiones (colección 'sesiones' filtrada por clienteId)
      const sesionesQuery = query(collection(db, "sesiones"), where("clienteId", "==", clienteId), orderBy("fecha", "desc"));
      const sesionesSnap = await getDocs(sesionesQuery);
      const sesionesList = sesionesSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Sesion[];
      setSesiones(sesionesList);
    } catch (err: any) {
      setError("Error al cargar datos del cliente: " + (err.message ?? err));
    } finally {
      setLoadingData(false);
    }
  };

  const seleccionarCliente = async (cliente: Usuario) => {
    setSelectedCliente(cliente);
    setShowFichaForm(false);
    setShowCuotaForm(false);
    setShowSesionForm(false);
    await fetchClienteData(cliente.id);
  };

  const handleFichaSaved = async () => {
    if (!selectedCliente) return;
    await fetchClienteData(selectedCliente.id);
  };

  const handleCuotaSaved = async () => {
    if (!selectedCliente) return;
    await fetchClienteData(selectedCliente.id);
  };

  const handleSesionSaved = async () => {
    if (!selectedCliente) return;
    await fetchClienteData(selectedCliente.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Administración de Clientes</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de clientes */}
        <div className="md:col-span-1 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Clientes</h3>
          {loadingClientes ? (
            <p>Cargando clientes...</p>
          ) : (
            <ul className="space-y-2 max-h-[60vh] overflow-auto">
              {clientes.map((c) => (
                <li
                  key={c.id}
                  className={`p-3 border rounded cursor-pointer hover:bg-slate-50 ${
                    selectedCliente?.id === c.id ? "bg-slate-100 border-slate-300" : ""
                  }`}
                  onClick={() => seleccionarCliente(c)}
                >
                  <div className="font-medium">
                    {c.nombre ?? "—"} {c.apellido ?? ""}
                  </div>
                  <div className="text-sm text-slate-600">{c.email}</div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <button
              onClick={fetchClientes}
              className="bg-slate-700 text-white px-3 py-1 rounded"
            >
              Refrescar lista
            </button>
          </div>
        </div>

        {/* Panel del cliente seleccionado */}
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          {!selectedCliente ? (
            <p>Seleccioná un cliente para ver o asignar ficha, cuotas y sesiones.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedCliente.nombre} {selectedCliente.apellido}
                  </h3>
                  <p className="text-sm text-slate-600">{selectedCliente.email}</p>
                </div>
                <div className="space-x-2">
                  {/* Mostrar botones para crear si no existen o siempre permitir crear */}
                  <button
                    onClick={() => {
                      setShowFichaForm((s) => !s);
                      setShowCuotaForm(false);
                      setShowSesionForm(false);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    {ficha ? "Editar ficha" : "Crear ficha"}
                  </button>
                  <button
                    onClick={() => {
                      setShowCuotaForm((s) => !s);
                      setShowFichaForm(false);
                      setShowSesionForm(false);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Asignar cuota
                  </button>
                  <button
                    onClick={() => {
                      setShowSesionForm((s) => !s);
                      setShowFichaForm(false);
                      setShowCuotaForm(false);
                    }}
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    Asignar sesión
                  </button>
                </div>
              </div>

              {loadingData ? (
                <p>Cargando datos del cliente...</p>
              ) : (
                <div className="space-y-4">
                  {/* Ficha */}
                  {showFichaForm ? (
                    <FichaForm
                      clienteId={selectedCliente.id}
                      existingFicha={ficha}
                      onClose={() => setShowFichaForm(false)}
                      onSaved={handleFichaSaved}
                    />
                  ) : ficha ? (
                    <div className="border p-3 rounded">
                      <h4 className="font-bold">Ficha</h4>
                      <div className="text-sm">
                        <div>Edad: <strong>{ficha.edad ?? "—"}</strong></div>
                        <div>Altura: <strong>{ficha.altura ?? "—"} cm</strong></div>
                        <div>Peso: <strong>{ficha.peso ?? "—"} kg</strong></div>
                        <div>Posición: <strong>{ficha.posicion ?? "—"}</strong></div>
                        <div>Lesiones: <strong>{ficha.lesiones ?? "—"}</strong></div>
                      </div>
                    </div>
                  ) : null}

                  {/* Cuotas */}
                  {showCuotaForm ? (
                    <CuotaForm
                      clienteId={selectedCliente.id}
                      onClose={() => setShowCuotaForm(false)}
                      onSaved={handleCuotaSaved}
                    />
                  ) : cuotas.length > 0 ? (
                    <div className="border p-3 rounded">
                      <h4 className="font-bold">Cuotas</h4>
                      <ul className="space-y-2">
                        {cuotas.map((c) => (
                          <li key={c.id} className="p-2 border rounded">
                            <div className="text-sm">
                              <div>Monto: <strong>${c.monto}</strong></div>
                              <div>Vencimiento: <strong>{c.vencimiento}</strong></div>
                              <div>Estado: <strong>{c.estado}</strong></div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Sesiones */}
                  {showSesionForm ? (
                    <SesionForm
                      clienteId={selectedCliente.id}
                      onClose={() => setShowSesionForm(false)}
                      onSaved={handleSesionSaved}
                    />
                  ) : sesiones.length > 0 ? (
                    <div className="border p-3 rounded">
                      <h4 className="font-bold">Sesiones</h4>
                      <ul className="space-y-2">
                        {sesiones.map((s) => (
                          <li key={s.id} className="p-2 border rounded">
                            <div className="text-sm">
                              <div>Fecha: <strong>{s.fecha}</strong></div>
                              <div>Tipo: <strong>{s.tipo}</strong></div>
                              <div>Notas: <strong>{s.notas ?? "—"}</strong></div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Si no hay nada y no se muestran formularios */}
                  {!ficha && cuotas.length === 0 && sesiones.length === 0 && !showFichaForm && !showCuotaForm && !showSesionForm && (
                    <div className="p-3 border rounded">
                      <p className="text-slate-600">Este cliente no tiene ficha, cuotas ni sesiones asignadas aún.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientesAdmin;

/* ---------------------------
   Componentes de formulario
   --------------------------- */

type FichaFormProps = {
  clienteId: string;
  existingFicha?: Ficha | null;
  onClose: () => void;
  onSaved: () => void;
};

const FichaForm: React.FC<FichaFormProps> = ({ clienteId, existingFicha, onClose, onSaved }) => {
  const [edad, setEdad] = useState<string>(existingFicha?.edad?.toString() ?? "");
  const [altura, setAltura] = useState<string>(existingFicha?.altura?.toString() ?? "");
  const [peso, setPeso] = useState<string>(existingFicha?.peso?.toString() ?? "");
  const [posicion, setPosicion] = useState<string>(existingFicha?.posicion ?? "");
  const [lesiones, setLesiones] = useState<string>(existingFicha?.lesiones ?? "no");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await setDoc(doc(db, "fichas", clienteId), {
        edad: edad ? Number(edad) : null,
        altura: altura ? Number(altura) : null,
        peso: peso ? Number(peso) : null,
        posicion,
        lesiones,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setMsg("Ficha guardada correctamente.");
      onSaved();
      onClose();
    } catch (err: any) {
      setMsg("Error al guardar ficha: " + (err.message ?? err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-white">
      <h4 className="font-bold mb-2">{existingFicha ? "Editar ficha" : "Crear ficha"}</h4>
      {msg && <p className="text-sm text-slate-600 mb-2">{msg}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          placeholder="Altura (cm)"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          placeholder="Peso (kg)"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Posición"
          value={posicion}
          onChange={(e) => setPosicion(e.target.value)}
          className="w-full border rounded p-2"
        />
        <select
          value={lesiones}
          onChange={(e) => setLesiones(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="no">Sin lesiones</option>
          <option value="si">Con lesiones</option>
        </select>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-3 py-1 rounded">
            {saving ? "Guardando..." : "Guardar ficha"}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-400 text-white px-3 py-1 rounded">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

type CuotaFormProps = {
  clienteId: string;
  onClose: () => void;
  onSaved: () => void;
};

const CuotaForm: React.FC<CuotaFormProps> = ({ clienteId, onClose, onSaved }) => {
  const [monto, setMonto] = useState<string>("");
  const [vencimiento, setVencimiento] = useState<string>("");
  const [estado, setEstado] = useState<string>("pendiente");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await addDoc(collection(db, "cuotas"), {
        clienteId,
        monto: Number(monto),
        vencimiento,
        estado,
        createdAt: new Date().toISOString(),
      });
      setMsg("Cuota creada correctamente.");
      onSaved();
      onClose();
    } catch (err: any) {
      setMsg("Error al crear cuota: " + (err.message ?? err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-white">
      <h4 className="font-bold mb-2">Asignar cuota</h4>
      {msg && <p className="text-sm text-slate-600 mb-2">{msg}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          placeholder="Monto (ARS)"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="date"
          placeholder="Vencimiento"
          value={vencimiento}
          onChange={(e) => setVencimiento(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full border rounded p-2">
          <option value="pendiente">Pendiente</option>
          <option value="pagada">Pagada</option>
          <option value="vencida">Vencida</option>
        </select>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-green-600 text-white px-3 py-1 rounded">
            {saving ? "Guardando..." : "Crear cuota"}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-400 text-white px-3 py-1 rounded">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

type SesionFormProps = {
  clienteId: string;
  onClose: () => void;
  onSaved: () => void;
};

const SesionForm: React.FC<SesionFormProps> = ({ clienteId, onClose, onSaved }) => {
  const [fecha, setFecha] = useState<string>("");
  const [tipo, setTipo] = useState<string>("entrenamiento");
  const [notas, setNotas] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await addDoc(collection(db, "sesiones"), {
        clienteId,
        fecha,
        tipo,
        notas,
        createdAt: new Date().toISOString(),
      });
      setMsg("Sesión creada correctamente.");
      onSaved();
      onClose();
    } catch (err: any) {
      setMsg("Error al crear sesión: " + (err.message ?? err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-white">
      <h4 className="font-bold mb-2">Asignar sesión</h4>
      {msg && <p className="text-sm text-slate-600 mb-2">{msg}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="datetime-local"
          placeholder="Fecha y hora"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border rounded p-2">
          <option value="entrenamiento">Entrenamiento</option>
          <option value="seguimiento">Seguimiento</option>
          <option value="evaluacion">Evaluación</option>
        </select>
        <textarea
          placeholder="Notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="w-full border rounded p-2"
          rows={3}
        />

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-purple-600 text-white px-3 py-1 rounded">
            {saving ? "Guardando..." : "Crear sesión"}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-400 text-white px-3 py-1 rounded">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

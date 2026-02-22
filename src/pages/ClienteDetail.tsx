import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

interface Cliente {
  id: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  [key: string]: any;
}

interface Ficha {
  id?: string;
  clienteId?: string;
  nombre?: string;
  apellido?: string;
  edad?: number;
  peso?: number;
  altura?: number;
  historialLesiones?: string;
  deporte?: string;
  posicion?: string;
  observaciones?: string;
  telefono?: string;
  [key: string]: any;
}

interface Cuota {
  id: string;
  clienteId: string;
  monto?: number;
  estado?: string;
  vencimiento?: string;
  [key: string]: any;
}

interface Bloque {
  id: string;
  tiempo: string;
  detalle: string;
}

interface Sesion {
  id: string;
  clienteId: string;
  tipo?: string;
  intensidad?: string;
  tiempoEstimado?: string;
  bloques?: { tiempo?: string; detalle?: string }[];
  createdAt?: any;
  [key: string]: any;
}

const ClienteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [activeTab, setActiveTab] = useState<"ficha" | "cuotas" | "sesiones">(
    "ficha",
  );

  // Ficha
  const [isEditingFicha, setIsEditingFicha] = useState(false);
  const [fichaEdit, setFichaEdit] = useState<Ficha | null>(null);

  // Cuotas (form)
  const [showCuotaForm, setShowCuotaForm] = useState(false);
  const [newCuota, setNewCuota] = useState({
    monto: 0,
    estado: "pendiente",
    vencimiento: "",
  });

  // Sesiones (form)
  const [showSesionForm, setShowSesionForm] = useState(false);
  const [tipoSesion, setTipoSesion] = useState("");
  const [intensidad, setIntensidad] = useState("");
  const [tiempoEstimado, setTiempoEstimado] = useState("");
  const [bloques, setBloques] = useState<Bloque[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Cliente (usuarios)
        const clienteRef = doc(db, "usuarios", id!);
        const clienteSnap = await getDoc(clienteRef);
        if (clienteSnap.exists()) {
          setCliente({ id: clienteSnap.id, ...(clienteSnap.data() as any) });
        } else {
          setCliente(null);
        }

        // Ficha: intento por doc id == uid, si no, busco por clienteId
        const fichaByIdRef = doc(db, "fichas", id!);
        const fichaByIdSnap = await getDoc(fichaByIdRef);
        let fichasData: Ficha[] = [];
        if (fichaByIdSnap.exists()) {
          fichasData = [
            { id: fichaByIdSnap.id, ...(fichaByIdSnap.data() as any) },
          ];
        } else {
          const fichasSnap = await getDocs(
            query(collection(db, "fichas"), where("clienteId", "==", id)),
          );
          fichasData = fichasSnap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          }));
        }
        setFichas(fichasData);
        setFichaEdit(fichasData.length > 0 ? fichasData[0] : null);

        // Cuotas por clienteId
        const cuotasSnap = await getDocs(
          query(collection(db, "cuotas"), where("clienteId", "==", id)),
        );
        setCuotas(
          cuotasSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
        );

        // Sesiones por clienteId
        const sesionesSnap = await getDocs(
          query(collection(db, "sesiones"), where("clienteId", "==", id)),
        );
        const sesionesData = sesionesSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        // ordenar por createdAt descendente si existe
        sesionesData.sort((a, b) => {
          const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return tb - ta;
        });
        setSesiones(sesionesData);
      } catch (error) {
        console.error("Error cargando detalle del cliente:", error);
      }
    };

    void fetchAll();
  }, [id]);

  // ---------- FICHA: Guardar (update o create) ----------
  const handleSaveFicha = async () => {
    if (!fichaEdit) return;
    try {
      const fichaId = fichaEdit.id ?? id!;
      const fichaRef = doc(db, "fichas", fichaId);
      const payload = { ...fichaEdit, clienteId: id };
      if (fichaEdit.id) {
        await updateDoc(fichaRef, payload);
      } else {
        await setDoc(fichaRef, payload);
      }

      setFichas((prev) => {
        const exists = prev.some((f) => f.id === fichaId);
        if (exists) {
          return prev.map((f) => (f.id === fichaId ? { ...f, ...payload } : f));
        }
        return [{ id: fichaId, ...(payload as any) }, ...prev];
      });

      setIsEditingFicha(false);
      setFichaEdit((prev) => ({ ...(prev ?? {}), id: fichaId }));
    } catch (error) {
      console.error("Error guardando ficha:", error);
      alert("Error guardando ficha. Revisá la consola.");
    }
  };

  // ---------- CUOTAS: Editar / Guardar / Eliminar ----------

  const deleteCuota = async (cuotaId: string) => {
    const ok = window.confirm(
      "¿Eliminar cuota? Esta acción no se puede deshacer.",
    );
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "cuotas", cuotaId));
      setCuotas((prev) => prev.filter((c) => c.id !== cuotaId));
    } catch (error) {
      console.error("Error eliminando cuota:", error);
      alert("Error eliminando cuota. Revisá la consola.");
    }
  };

  // ---------- SESIONES: Bloques dinámicos y guardado ----------
  const addBloque = () => {
    setBloques((prev) => [
      ...prev,
      { id: randomId(), tiempo: "", detalle: "" },
    ]);
  };

  const removeBloque = (bloqueId: string) => {
    setBloques((prev) => prev.filter((b) => b.id !== bloqueId));
  };

  const updateBloque = (
    bloqueId: string,
    field: keyof Bloque,
    value: string,
  ) => {
    setBloques((prev) =>
      prev.map((b) => (b.id === bloqueId ? { ...b, [field]: value } : b)),
    );
  };

  const handleSaveSesion = async () => {
    if (!tipoSesion.trim()) {
      alert("Completá el tipo de sesión.");
      return;
    }
    if (!intensidad.trim()) {
      alert("Completá la intensidad.");
      return;
    }
    if (bloques.length === 0) {
      alert("Agregá al menos un bloque.");
      return;
    }

    const nuevaSesion = {
      clienteId: id!,
      tipo: tipoSesion,
      intensidad,
      tiempoEstimado,
      bloques: bloques.map((b) => ({ tiempo: b.tiempo, detalle: b.detalle })),
      createdAt: serverTimestamp(),
    };

    try {
      const ref = await addDoc(collection(db, "sesiones"), nuevaSesion);
      // optimista: agregar con createdAt como null (se actualizará al recargar)
      setSesiones((prev) => [
        { id: ref.id, ...nuevaSesion } as Sesion,
        ...prev,
      ]);
      // reset form
      setTipoSesion("");
      setIntensidad("");
      setTiempoEstimado("");
      setBloques([]);
      setShowSesionForm(false);
    } catch (error) {
      console.error("Error guardando sesión:", error);
      alert("Error guardando sesión. Revisá la consola.");
    }
  };

  const handleDeleteSesion = async (sesionId: string) => {
    const ok = window.confirm(
      "¿Eliminar sesión? Esta acción no se puede deshacer.",
    );
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "sesiones", sesionId));
      setSesiones((prev) => prev.filter((s) => s.id !== sesionId));
    } catch (error) {
      console.error("Error eliminando sesión:", error);
      alert("Error eliminando sesión. Revisá la consola.");
    }
  };

  // ---------- CUOTAS: Agregar nueva cuota ----------
  const handleAddCuota = async () => {
    if (!newCuota.monto || newCuota.monto <= 0) {
      alert("Ingresá un monto válido.");
      return;
    }
    if (!newCuota.vencimiento) {
      alert("Ingresá una fecha de vencimiento.");
      return;
    }

    const nuevaCuota = {
      clienteId: id!,
      monto: newCuota.monto,
      estado: newCuota.estado,
      vencimiento: newCuota.vencimiento,
    };

    try {
      const ref = await addDoc(collection(db, "cuotas"), nuevaCuota);
      setCuotas((prev) => [{ id: ref.id, ...nuevaCuota }, ...prev]);
      setShowCuotaForm(false);
      setNewCuota({ monto: 0, estado: "pendiente", vencimiento: "" });
    } catch (error) {
      console.error("Error guardando cuota:", error);
      alert("Error guardando cuota. Revisá la consola.");
    }
  };

  // small helper id
  function randomId() {
    try {
      return crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    } catch {
      return Math.random().toString(36).slice(2, 9);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {cliente ? (
        <>
          <h2 className="text-2xl font-bold mb-4">
            {cliente.nombre ?? "-"} {cliente.apellido ?? "-"}
          </h2>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              className={`pb-2 font-semibold ${
                activeTab === "ficha"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("ficha")}
            >
              Ficha
            </button>
            <button
              className={`pb-2 font-semibold ${
                activeTab === "cuotas"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("cuotas")}
            >
              Cuotas
            </button>
            <button
              className={`pb-2 font-semibold ${
                activeTab === "sesiones"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("sesiones")}
            >
              Sesiones
            </button>
          </div>

          {/* FICHA */}
          {activeTab === "ficha" && (
            <section>
              <div className="bg-white shadow rounded p-4">
                {fichaEdit && !isEditingFicha && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <p>
                        <strong>Nombre:</strong>{" "}
                        {fichaEdit.nombre ?? cliente.nombre ?? "-"}
                      </p>
                      <p>
                        <strong>Apellido:</strong>{" "}
                        {fichaEdit.apellido ?? cliente.apellido ?? "-"}
                      </p>
                      <p>
                        <strong>Edad:</strong> {fichaEdit.edad ?? "-"}
                      </p>
                      <p>
                        <strong>Peso (kg):</strong> {fichaEdit.peso ?? "-"}
                      </p>
                      <p>
                        <strong>Altura (cm):</strong> {fichaEdit.altura ?? "-"}
                      </p>
                      <p>
                        <strong>Teléfono:</strong>{" "}
                        {fichaEdit.telefono ?? cliente.telefono ?? "-"}
                      </p>
                      <p>
                        <strong>Deporte:</strong> {fichaEdit.deporte ?? "-"}
                      </p>
                      <p>
                        <strong>Posición:</strong> {fichaEdit.posicion ?? "-"}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p>
                        <strong>Historial de lesiones:</strong>
                      </p>
                      <p className="mb-2">
                        {fichaEdit.historialLesiones ?? "-"}
                      </p>

                      <p>
                        <strong>Observaciones:</strong>
                      </p>
                      <p>{fichaEdit.observaciones ?? "-"}</p>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => setIsEditingFicha(true)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                      >
                        Editar Ficha
                      </button>
                    </div>
                  </div>
                )}

                {/* Formulario de edición / creación */}
                {(isEditingFicha || !fichaEdit) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={fichaEdit?.nombre ?? cliente?.nombre ?? ""}
                          onChange={(e) =>
                            setFichaEdit({
                              ...(fichaEdit ?? { id: id! }),
                              nombre: e.target.value,
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">
                          Apellido
                        </label>
                        <input
                          type="text"
                          value={fichaEdit?.apellido ?? cliente?.apellido ?? ""}
                          onChange={(e) =>
                            setFichaEdit({
                              ...(fichaEdit ?? { id: id! }),
                              apellido: e.target.value,
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Edad
                        </label>
                        <input
                          type="number"
                          value={fichaEdit?.edad ?? ""}
                          onChange={(e) =>
                            setFichaEdit({
                              ...(fichaEdit ?? { id: id! }),
                              edad: Number(e.target.value),
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          value={fichaEdit?.peso ?? ""}
                          onChange={(e) =>
                            setFichaEdit({
                              ...(fichaEdit ?? { id: id! }),
                              peso: Number(e.target.value),
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Altura (cm)
                        </label>
                        <input
                          type="number"
                          value={fichaEdit?.altura ?? ""}
                          onChange={(e) =>
                            setFichaEdit({
                              ...(fichaEdit ?? { id: id! }),
                              altura: Number(e.target.value),
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Teléfono
                        </label>
                        <input
                          type="text"
                          value={fichaEdit?.telefono ?? cliente?.telefono ?? ""}
                          onChange={(e) =>
                            setFichaEdit({
                              ...(fichaEdit ?? { id: id! }),
                              telefono: e.target.value,
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Deporte
                        </label>
                        <input
                          type="text"
                          value={fichaEdit?.deporte ?? ""}
                          onChange={(e) =>
                            setFichaEdit({
                              ...(fichaEdit ?? { id: id! }),
                              deporte: e.target.value,
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600">
                          Posición
                        </label>
                        <input
                          type="text"
                          value={fichaEdit?.posicion ?? ""}
                          onChange={(e) =>
                            setFichaEdit({
                              ...(fichaEdit ?? { id: id! }),
                              posicion: e.target.value,
                            })
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">
                        Historial de lesiones
                      </label>
                      <textarea
                        value={fichaEdit?.historialLesiones ?? ""}
                        onChange={(e) =>
                          setFichaEdit({
                            ...(fichaEdit ?? { id: id! }),
                            historialLesiones: e.target.value,
                          })
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">
                        Observaciones
                      </label>
                      <textarea
                        value={fichaEdit?.observaciones ?? ""}
                        onChange={(e) =>
                          setFichaEdit({
                            ...(fichaEdit ?? { id: id! }),
                            observaciones: e.target.value,
                          })
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveFicha}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Guardar ficha
                      </button>
                      <button
                        onClick={() => {
                          const original = fichas.find(
                            (f) => f.id === (fichaEdit?.id ?? id),
                          );
                          setFichaEdit(original ?? null);
                          setIsEditingFicha(false);
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* CUOTAS */}
          {activeTab === "cuotas" && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Cuotas</h3>
                <button
                  onClick={() => setShowCuotaForm((s) => !s)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  {showCuotaForm ? "Cerrar" : "Asignar cuota"}
                </button>
              </div>
              {/* Formulario nueva cuota */}
              {showCuotaForm && (
                <div className="bg-white shadow rounded p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600">
                        Monto
                      </label>
                      <input
                        type="number"
                        value={newCuota.monto}
                        onChange={(e) =>
                          setNewCuota({
                            ...newCuota,
                            monto: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">
                        Estado
                      </label>
                      <select
                        value={newCuota.estado}
                        onChange={(e) =>
                          setNewCuota({ ...newCuota, estado: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="pagada">Pagada</option>
                        <option value="vencida">Vencida</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">
                        Vencimiento
                      </label>
                      <input
                        type="date"
                        value={newCuota.vencimiento}
                        onChange={(e) =>
                          setNewCuota({
                            ...newCuota,
                            vencimiento: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleAddCuota}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Guardar cuota
                    </button>
                    <button
                      onClick={() => {
                        setShowCuotaForm(false);
                        setNewCuota({
                          monto: 0,
                          estado: "pendiente",
                          vencimiento: "",
                        });
                      }}
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
              {/* Listado de cuotas */}
              <div className="space-y-3">
                {cuotas.length > 0 ? (
                  cuotas.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-medium">Monto: ${c.monto ?? "-"}</p>
                        <p>Estado: {c.estado ?? "-"}</p>
                        <p>Vencimiento: {c.vencimiento ?? "-"}</p>
                      </div>

                      <div className="mt-3 md:mt-0 md:ml-4 flex gap-2">
                        <button
                          onClick={() => deleteCuota(c.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No hay cuotas registradas para este cliente.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* SESIONES */}
          {activeTab === "sesiones" && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Sesiones</h3>
                <button
                  onClick={() => setShowSesionForm((s) => !s)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  {showSesionForm ? "Cerrar" : "Agregar sesión"}
                </button>
              </div>

              {/* Formulario nueva sesión */}
              {showSesionForm && (
                <div className="bg-white shadow rounded p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600">
                        Tipo de sesión
                      </label>
                      <input
                        type="text"
                        value={tipoSesion}
                        onChange={(e) => setTipoSesion(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                        placeholder="Ej: Fuerza, Cardio, Técnica"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">
                        Intensidad
                      </label>
                      <select
                        value={intensidad}
                        onChange={(e) => setIntensidad(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="">Seleccionar</option>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600">
                        Tiempo estimado
                      </label>
                      <input
                        type="text"
                        value={tiempoEstimado}
                        onChange={(e) => setTiempoEstimado(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                        placeholder="Ej: 45 min"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Bloques</p>
                      <button
                        onClick={addBloque}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Agregar bloque
                      </button>
                    </div>

                    <div className="space-y-3">
                      {bloques.map((b, idx) => (
                        <div
                          key={b.id}
                          className="border rounded p-3 bg-gray-50"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">Bloque {idx + 1}</p>
                            <button
                              onClick={() => removeBloque(b.id)}
                              className="text-red-600 text-sm"
                            >
                              Eliminar
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm text-gray-600">
                                Tiempo
                              </label>
                              <input
                                type="text"
                                value={b.tiempo}
                                onChange={(e) =>
                                  updateBloque(b.id, "tiempo", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1"
                                placeholder="Ej: 10 min"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600">
                                Detalle
                              </label>
                              <input
                                type="text"
                                value={b.detalle}
                                onChange={(e) =>
                                  updateBloque(b.id, "detalle", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1"
                                placeholder="Ej: Calentamiento, series..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleSaveSesion}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Guardar sesión
                    </button>
                    <button
                      onClick={() => {
                        setShowSesionForm(false);
                        setTipoSesion("");
                        setIntensidad("");
                        setTiempoEstimado("");
                        setBloques([]);
                      }}
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Historial de sesiones */}
              <div className="space-y-3">
                {sesiones.length === 0 ? (
                  <p className="text-gray-500">
                    No hay sesiones registradas para este cliente.
                  </p>
                ) : (
                  sesiones.map((s) => (
                    <div key={s.id} className="bg-white shadow rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{s.tipo ?? "Sesión"}</p>
                          <p className="text-sm text-gray-600">
                            Intensidad: {s.intensidad ?? "-"} • Tiempo estimado:{" "}
                            {s.tiempoEstimado ?? "-"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {s.createdAt?.toDate
                              ? s.createdAt.toDate().toLocaleString()
                              : ""}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteSesion(s.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2">
                        {(s.bloques ?? []).map((b: any, i: number) => (
                          <div
                            key={i}
                            className="border rounded p-2 bg-gray-50"
                          >
                            <p className="text-sm font-medium">
                              Bloque {i + 1}
                            </p>
                            <p className="text-sm">Tiempo: {b.tiempo ?? "-"}</p>
                            <p className="text-sm">
                              Detalle: {b.detalle ?? "-"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="text-gray-500">Cargando cliente...</p>
      )}
    </div>
  );
};

export default ClienteDetail;

//¿si yo quiero agregar un boton para asignar cuota, ¿en que porcion del codigo tenemos que hacer foco?
//Para agregar un botón de "Asignar cuota", deberíamos enfocarnos en la sección de "CUOTAS". Específicamente, podríamos agregar el botón dentro del bloque que se muestra cuando el usuario está viendo las cuotas (dentro del bloque `{activeTab === "cuotas" && ( ... )}`).

//Podríamos colocar el botón justo antes de la lista de cuotas, para que sea fácilmente accesible. Al hacer clic en ese botón, podríamos mostrar un formulario para ingresar los detalles de la nueva cuota (monto, estado, vencimiento) y luego guardar esa información en Firestore, similar a cómo se manejan las sesiones.

//coloquemos ese boton debajo del titulo "Cuotas" y hagamos que al hacer click se despliegue un formulario para agregar una nueva cuota, con los campos monto, estado y vencimiento.

//Para agregar el botón de "Asignar cuota" debajo del título "Cuotas" y mostrar un formulario al hacer clic, podemos seguir estos pasos:
//1. Agregar un estado para controlar la visibilidad del formulario de nueva cuota.
//2. Colocar el botón debajo del título "Cuotas".
//3. Crear el formulario para ingresar los detalles de la nueva cuota (monto, estado, vencimiento).
//4. Implementar la función para guardar la nueva cuota en Firestore y actualizar el estado local.

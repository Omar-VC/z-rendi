// src/pages/PlanillaDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import RegistroForm from "../components/seguimiento/RegistroForm";
import RendimientoTable from "../components/seguimiento/RendimientoTable";
import AtletaForm from "../components/seguimiento/AtletaForm";
import type { Atleta, Registro } from "../types/seguimiento";


const PlanillaDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [registros, setRegistros] = useState<(Registro & { id?: string })[]>([]);
  const [atletas, setAtletas] = useState<(Atleta & { id?: string })[]>([]);
  const [showRegistroForm, setShowRegistroForm] = useState(false);
  const [showAtletaForm, setShowAtletaForm] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState<(Registro & { id?: string }) | null>(null);
  const [editingAtleta, setEditingAtleta] = useState<(Atleta & { id?: string }) | null>(null);

  useEffect(() => {
    if (!id) return;

    const regCol = collection(db, "planillas", id, "registros");
    const atlCol = collection(db, "planillas", id, "atletas");

    const unsubReg = onSnapshot(query(regCol, orderBy("fecha", "desc")), (snap) => {
      setRegistros(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as (Registro & { id?: string })[]);
    });

    const unsubAtl = onSnapshot(query(atlCol, orderBy("nombre")), (snap) => {
      setAtletas(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as (Atleta & { id?: string })[]);
    });

    return () => {
      unsubReg();
      unsubAtl();
    };
  }, [id]);

  const guardarAtleta = async (data: Atleta, idAtleta?: string) => {
    if (!id) return;
    try {
      if (idAtleta) {
        await updateDoc(doc(db, "planillas", id, "atletas", idAtleta), data);
      } else {
        await addDoc(collection(db, "planillas", id, "atletas"), data);
      }
      setShowAtletaForm(false);
      setEditingAtleta(null);
    } catch (err) {
      console.error("Error guardando atleta:", err);
      alert("Error guardando atleta. Revisa la consola.");
    }
  };

  const eliminarAtleta = async (atletaId: string) => {
    if (!id) return;
    const confirm = window.confirm("¿Eliminar atleta y sus registros asociados?");
    if (!confirm) return;

    try {
      const registrosSnap = await getDocs(query(collection(db, "planillas", id, "registros"), where("atletaId", "==", atletaId)));
      const deletePromises: Promise<void>[] = [];
      registrosSnap.forEach((r) => {
        deletePromises.push(deleteDoc(doc(db, "planillas", id, "registros", r.id)));
      });
      await Promise.all(deletePromises);
      await deleteDoc(doc(db, "planillas", id, "atletas", atletaId));
    } catch (err) {
      console.error("Error eliminando atleta:", err);
      alert("Ocurrió un error al eliminar el atleta. Revisa la consola.");
    }
  };

  const guardarRegistro = async (data: Registro, registroId?: string) => {
    if (!id) return;
    try {
      if (registroId) {
        await updateDoc(doc(db, "planillas", id, "registros", registroId), data);
      } else {
        await addDoc(collection(db, "planillas", id, "registros"), data);
      }
      setShowRegistroForm(false);
      setEditingRegistro(null);
    } catch (err) {
      console.error("Error guardando registro:", err);
      alert("Ocurrió un error al guardar el registro. Revisa la consola.");
    }
  };

  const eliminarRegistro = async (registroId: string) => {
    if (!id) return;
    const confirm = window.confirm("¿Eliminar registro?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "planillas", id, "registros", registroId));
    } catch (err) {
      console.error("Error eliminando registro:", err);
      alert("Ocurrió un error al eliminar el registro. Revisa la consola.");
    }
  };

  const handleEditRegistro = (r: Registro & { id?: string }) => {
    setEditingRegistro(r);
    setShowRegistroForm(true);
  };

  const handleEditAtleta = (a: Atleta & { id?: string }) => {
    setEditingAtleta(a);
    setShowAtletaForm(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Planilla</h1>

      {atletas.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-500/20">Debes crear un atleta primero</div>
      )}

      <div className="flex gap-2 mb-4">
        <button onClick={() => { setEditingAtleta(null); setShowAtletaForm(true); }} className="btn">Crear atleta</button>

        <button
          onClick={() => {
            if (atletas.length === 0) {
              alert("Primero crear atleta");
              return;
            }
            setEditingRegistro(null);
            setShowRegistroForm(true);
          }}
          className="btn"
        >
          Nuevo registro
        </button>
      </div>

      {showAtletaForm && (
        <AtletaForm
          initialData={editingAtleta ?? undefined}
          onSave={guardarAtleta}
          onCancel={() => { setShowAtletaForm(false); setEditingAtleta(null); }}
        />
      )}

      {showRegistroForm && (
        <RegistroForm
          atletas={atletas}
          initialData={editingRegistro ?? undefined}
          onSave={guardarRegistro}
          onCancel={() => { setShowRegistroForm(false); setEditingRegistro(null); }}
        />
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Atletas</h2>
        <div className="grid gap-2">
          {atletas.map((a) => (
            <div key={a.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{a.nombre} {a.apellido}</div>
                <div className="text-sm text-muted">{a.deporte ?? ""} {a.posicion ? `- ${a.posicion}` : ""}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditAtleta(a)} className="btn btn-sm">Editar</button>
                <button onClick={() => eliminarAtleta(a.id!)} className="btn btn-sm btn-danger">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Registros</h2>
        <RendimientoTable
          registros={registros}
          atletas={atletas}
          onDelete={eliminarRegistro}
          onEdit={handleEditRegistro}
        />
      </div>
    </div>
  );
};

export default PlanillaDetailPage;


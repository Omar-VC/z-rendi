import { useEffect } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { useAuth } from "../../../../auth/useAuth";
import { db } from "../../../../firebase/firebase";
import { useSeguimiento } from "../hooks/useSeguimiento";
import {
  normalizarObjetivosFuerza,
  procesarBarrerasFuerzaDeSesion,
} from "../services/barrerasService";

import UltimaSesionCard from "./UltimaSesionCard";
import RegistroSesiones from "./RegistroSesiones";
import BarrerasPanel from "./BarrerasPanel";
import CargaResumen from "./CargaResumen";
import SesionesPendientesPanel from "./SesionesPendientesPanel";

import { eliminarSesion } from "../services/seguimientoService";

type Props = {
  clienteId: string;
};

export default function SeguimientoPanel({ clienteId }: Props) {
  const { user } = useAuth();
  const preparadorIdActual = user?.uid;
  const { sesiones, loading, recargar } = useSeguimiento(clienteId);

  useEffect(() => {
    if (!preparadorIdActual || !clienteId) return;

    const q = query(
      collection(db, "sesiones"),
      where("clienteId", "==", clienteId),
      where("barrerasFuerzaProcesadas", "==", false),
    );
    const enProceso = new Set<string>();
    let cola: Promise<unknown> = Promise.resolve();

    let cancelar = false;
    let unsubscribe = () => {};

    async function procesarDocumento(
      sesionDoc: QueryDocumentSnapshot<DocumentData>,
      yaEnProceso = false,
    ) {
      if (!yaEnProceso) {
        if (enProceso.has(sesionDoc.id)) return false;
        enProceso.add(sesionDoc.id);
      }
      const data = sesionDoc.data();
      try {
        await procesarBarrerasFuerzaDeSesion(sesionDoc.id, {
          clienteId: data.clienteId,
          preparadorId: data.preparadorId,
          barrerasFuerzaProcesadas: data.barrerasFuerzaProcesadas,
          fecha: data.fecha?.toDate?.() ?? new Date(data.fecha),
          bloquesRealizados: data.bloquesRealizados ?? [],
        });
        return true;
      } catch (error) {
        console.error("No se pudieron procesar las barreras de fuerza:", error);
        return false;
      } finally {
        enProceso.delete(sesionDoc.id);
      }
    }

    async function iniciarSeguimiento() {
      let inicialProcesado = true;
      try {
        const pendientes = await getDocs(q);
        for (const sesionDoc of pendientes.docs) {
          if (!(await procesarDocumento(sesionDoc))) inicialProcesado = false;
        }
      } catch (error) {
        inicialProcesado = false;
        console.error("No se pudieron cargar las sesiones pendientes:", error);
      }

      // Primero se procesan los registros pendientes con el objetivo que tenían
      // al realizarse; luego se normalizan objetivos activos que quedaron decimales.
      if (inicialProcesado) {
        try {
          await normalizarObjetivosFuerza(clienteId);
        } catch (error) {
          console.error("No se pudieron normalizar los objetivos de fuerza:", error);
        }
      }

      if (cancelar) return;
      unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach((sesionDoc) => {
          if (enProceso.has(sesionDoc.id)) return;
          enProceso.add(sesionDoc.id);
          cola = cola
            .then(() => procesarDocumento(sesionDoc, true))
            .catch((error) => {
              console.error("No se pudo procesar una sesión pendiente:", error);
            });
        });
      }, (error) => {
        console.error("No se pudieron escuchar sesiones pendientes de evaluar:", error);
      });
    }

    void iniciarSeguimiento();

    return () => {
      cancelar = true;
      unsubscribe();
    };
  }, [clienteId, preparadorIdActual]);

  if (!user) return null;

  const preparadorId = user.uid;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* CABECERA DE SEGUIMIENTO (SIN EL BOTÓN DE NUEVA SESIÓN PRESENCIAL) */}
      <div className="pb-2 border-b border-border/40">
        <h2 className="text-lg font-black text-text uppercase tracking-tight">
          Seguimiento Deportivo
        </h2>
        <p className="text-xs text-muted font-medium mt-0.5">
          Control de evolución, sesiones de entrenamiento y barreras del atleta.
        </p>
      </div>

      {/* CONTENIDO Y ESTADOS DE CARGA */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-surfaceSoft/60 rounded-xl border border-border/40" />
          <div className="h-32 bg-surfaceSoft/60 rounded-xl border border-border/40" />
          <div className="h-48 bg-surfaceSoft/60 rounded-xl border border-border/40" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* PANEL DE SESIONES PENDIENTES (ACÁ ESTÁ TU BOTÓN "ASIGNAR SESIÓN") */}
          <SesionesPendientesPanel
            clienteId={clienteId}
            preparadorId={preparadorId}
          />

          {/* MÉTRICAS & RESUMEN DE CARGAS */}
          <CargaResumen sesiones={sesiones} />

          {/* DETALLE DE ÚLTIMA SESIÓN */}
          <UltimaSesionCard sesion={sesiones[0]} />

          {/* REGISTRO HISTÓRICO DE SESIONES */}
          <RegistroSesiones
            sesiones={sesiones}
            onEliminarSesion={async (id) => {
              await eliminarSesion(id);
              recargar();
            }}
          />

          {/* PANEL DE BARRERAS Y LIMITANTES */}
          <BarrerasPanel clienteId={clienteId} />
        </div>
      )}
    </div>
  );
}

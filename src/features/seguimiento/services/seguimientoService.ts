import { db } from "../../../firebase/firebase";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import type { Planilla } from "../types";

export const subscribePlanillas = (
  callback: (planillas: Planilla[]) => void
) => {
  const colRef = collection(db, "planillas");

  return onSnapshot(
    colRef,
    (snapshot) => {
      const planillas = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Planilla, "id">),
      }));

      callback(planillas);
    },
    (err) => {
      console.error(
        "onSnapshot error planillas:",
        err
      );
    }
  );
};

export const createPlanilla = async (
  nombre: string
) => {
  if (!nombre.trim()) return;

  await addDoc(collection(db, "planillas"), {
    nombre: nombre.trim(),
    fechaCreacion: new Date(),
  });
};

export const removePlanilla = async (
  planillaId: string
) => {
  const confirmDelete = window.confirm(
    "¿Eliminar planilla y todos sus registros y atletas?"
  );

  if (!confirmDelete) return;

  const registrosSnap = await getDocs(
    collection(
      db,
      "planillas",
      planillaId,
      "registros"
    )
  );

  const atletasSnap = await getDocs(
    collection(
      db,
      "planillas",
      planillaId,
      "atletas"
    )
  );

  const deletePromises: Promise<void>[] = [];

  registrosSnap.forEach((r) => {
    deletePromises.push(
      deleteDoc(
        doc(
          db,
          "planillas",
          planillaId,
          "registros",
          r.id
        )
      )
    );
  });

  atletasSnap.forEach((a) => {
    deletePromises.push(
      deleteDoc(
        doc(
          db,
          "planillas",
          planillaId,
          "atletas",
          a.id
        )
      )
    );
  });

  await Promise.all(deletePromises);

  await deleteDoc(
    doc(db, "planillas", planillaId)
  );
};
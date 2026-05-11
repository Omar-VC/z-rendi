import { db } from "../../../firebase/firebase";

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

import type {
  Atleta,
  Registro,
} from "../types";

export const subscribeRegistros = (
  planillaId: string,
  callback: (
    registros: (Registro & { id: string })[]
  ) => void
) => {
  const regCol = collection(
    db,
    "planillas",
    planillaId,
    "registros"
  );

  return onSnapshot(
    query(regCol, orderBy("fecha", "desc")),
    (snap) => {
      callback(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Registro),
        }))
      );
    }
  );
};

export const subscribeAtletas = (
  planillaId: string,
  callback: (
    atletas: (Atleta & { id: string })[]
  ) => void
) => {
  const atlCol = collection(
    db,
    "planillas",
    planillaId,
    "atletas"
  );

  return onSnapshot(
    query(atlCol, orderBy("nombre")),
    (snap) => {
      callback(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Atleta),
        }))
      );
    }
  );
};

export const saveAtleta = async (
  planillaId: string,
  data: Atleta,
  id?: string
) => {
  if (id) {
    await updateDoc(
      doc(
        db,
        "planillas",
        planillaId,
        "atletas",
        id
      ),
      data
    );
  } else {
    await addDoc(
      collection(
        db,
        "planillas",
        planillaId,
        "atletas"
      ),
      data
    );
  }
};

export const removeAtleta = async (
  planillaId: string,
  atletaId: string
) => {
  const confirmDelete = window.confirm(
    "¿Eliminar atleta y sus registros?"
  );

  if (!confirmDelete) return;

  const registrosSnap = await getDocs(
    query(
      collection(
        db,
        "planillas",
        planillaId,
        "registros"
      ),
      where("atletaId", "==", atletaId)
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

  await Promise.all(deletePromises);

  await deleteDoc(
    doc(
      db,
      "planillas",
      planillaId,
      "atletas",
      atletaId
    )
  );
};

export const saveRegistro = async (
  planillaId: string,
  data: Registro,
  id?: string
) => {
  if (data.rpe && data.duracion) {
    data.carga =
      data.rpe * data.duracion;
  }

  if (id) {
    await updateDoc(
      doc(
        db,
        "planillas",
        planillaId,
        "registros",
        id
      ),
      data
    );
  } else {
    await addDoc(
      collection(
        db,
        "planillas",
        planillaId,
        "registros"
      ),
      data
    );
  }
};

export const removeRegistro = async (
  planillaId: string,
  registroId: string
) => {
  const confirmDelete =
    window.confirm(
      "¿Eliminar registro?"
    );

  if (!confirmDelete) return;

  await deleteDoc(
    doc(
      db,
      "planillas",
      planillaId,
      "registros",
      registroId
    )
  );
};
import { useEffect, useState } from "react";

import type {
  Atleta,
  Registro,
} from "../types";

import {
  subscribeRegistros,
  subscribeAtletas,
  saveAtleta,
  removeAtleta,
  saveRegistro,
  removeRegistro,
} from "../services/planillaService";

type AtletaDB = Atleta & {
  id: string;
};

type RegistroDB = Registro & {
  id: string;
};

export const usePlanilla = (
  planillaId?: string
) => {
  const [registros, setRegistros] =
    useState<RegistroDB[]>([]);

  const [atletas, setAtletas] =
    useState<AtletaDB[]>([]);

  useEffect(() => {
    if (!planillaId) return;

    const unsubReg =
      subscribeRegistros(
        planillaId,
        setRegistros
      );

    const unsubAtl =
      subscribeAtletas(
        planillaId,
        setAtletas
      );

    return () => {
      unsubReg();
      unsubAtl();
    };
  }, [planillaId]);

  const guardarAtleta = async (
    data: Atleta,
    id?: string
  ) => {
    if (!planillaId) return;

    try {
      await saveAtleta(
        planillaId,
        data,
        id
      );
    } catch (err) {
      console.error(
        "Error guardando atleta:",
        err
      );
    }
  };

  const eliminarAtleta = async (
    atletaId: string
  ) => {
    if (!planillaId) return;

    try {
      await removeAtleta(
        planillaId,
        atletaId
      );
    } catch (err) {
      console.error(
        "Error eliminando atleta:",
        err
      );
    }
  };

  const guardarRegistro = async (
    data: Registro,
    id?: string
  ) => {
    if (!planillaId) return;

    try {
      await saveRegistro(
        planillaId,
        data,
        id
      );
    } catch (err) {
      console.error(
        "Error guardando registro:",
        err
      );
    }
  };

  const eliminarRegistro = async (
    registroId: string
  ) => {
    if (!planillaId) return;

    try {
      await removeRegistro(
        planillaId,
        registroId
      );
    } catch (err) {
      console.error(
        "Error eliminando registro:",
        err
      );
    }
  };

  return {
    registros,
    atletas,
    guardarAtleta,
    eliminarAtleta,
    guardarRegistro,
    eliminarRegistro,
  };
};
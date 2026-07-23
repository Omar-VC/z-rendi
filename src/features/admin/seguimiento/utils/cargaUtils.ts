export type EstadoCarga = {
  texto: string;
  variant: "success" | "warning" | "danger";
};

export function obtenerEstadoCargaSesion(
  carga: number,
): EstadoCarga {

  if (carga <= 250) {
    return {
      texto: "Baja",
      variant: "success",
    };
  }

  if (carga <= 500) {
    return {
      texto: "Moderada",
      variant: "warning",
    };
  }

  return {
    texto: "Alta",
    variant: "danger",
  };

}

export function obtenerEstadoCargaSemanal(
  carga: number,
): EstadoCarga {

  if (carga <= 1000) {
    return {
      texto: "Baja",
      variant: "success",
    };
  }

  if (carga <= 2000) {
    return {
      texto: "Moderada",
      variant: "warning",
    };
  }

  return {
    texto: "Alta",
    variant: "danger",
  };

}
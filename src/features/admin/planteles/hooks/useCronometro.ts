import { useState, useEffect, useRef } from "react";

export function useCronometro() {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activo) {
      timerRef.current = setInterval(() => {
        setSegundos((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activo]);

  const iniciar = () => setActivo(true);
  const pausar = () => setActivo(false);
  const reiniciar = () => {
    setActivo(false);
    setSegundos(0);
  };

  const formatearTiempo = () => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, "0")}:${seg.toString().padStart(2, "0")}`;
  };

  return { segundos, activo, iniciar, pausar, reiniciar, formatearTiempo };
}
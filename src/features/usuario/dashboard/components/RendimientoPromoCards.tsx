import { Activity, ArrowUpRight, Footprints, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const novedades = [
  {
    ruta: "/cliente/rendimiento",
    imagen: "/images/performance.webp",
    alt: "Barra con discos en un gimnasio",
    titulo: "Mi rendimiento",
    descripcion: "Revisá tus objetivos, barreras activas y los hitos que ya alcanzaste.",
    accion: "Ver mi evolución",
    etiqueta: "Tu progreso, en un lugar",
    Icono: Activity,
    acento: "text-orange-200 border-orange-200/20 bg-orange-300/10",
    brillo: "bg-orange-500/20",
    resplandor: "rgba(255,85,0,0.22)",
  },
  {
    ruta: "/cliente/running",
    imagen: "/images/running-hero.webp",
    alt: "Atletas corriendo al aire libre",
    titulo: "Running",
    descripcion: "Guardá distancia, tiempo y ritmo de tus salidas. Tu desafío empieza acá.",
    accion: "Registrar una marca",
    etiqueta: "Un espacio para vos",
    Icono: Footprints,
    acento: "text-emerald-200 border-emerald-200/20 bg-emerald-300/10",
    brillo: "bg-emerald-400/20",
    resplandor: "rgba(16,185,129,0.22)",
  },
];

export default function RendimientoPromoCards() {
  return (
    <section aria-label="Nuevas secciones para tu progreso">
      <div className="mb-3 flex items-center gap-2 px-1">
        <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.8} aria-hidden="true" />
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Nuevos espacios para vos</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {novedades.map(({ ruta, imagen, alt, titulo, descripcion, accion, etiqueta, Icono, acento, brillo, resplandor }) => (
          <Link
            key={ruta}
            to={ruta}
            className="group relative isolate flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-surface p-5 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 sm:min-h-[17rem] sm:p-6"
          >
            <img
              src={imagen}
              alt={alt}
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center] transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(7,12,17,0.97)_0%,rgba(7,12,17,0.7)_50%,rgba(7,12,17,0.12)_100%)] sm:bg-[linear-gradient(90deg,rgba(7,12,17,0.94)_0%,rgba(7,12,17,0.72)_52%,rgba(7,12,17,0.18)_100%)]" />
            <div className="pointer-events-none absolute -right-10 -top-12 -z-10 h-44 w-44 rounded-full blur-3xl" style={{ backgroundColor: resplandor }} />
            <div className="absolute inset-0 -z-10 rounded-[inherit] ring-1 ring-inset ring-white/10" />

            <div className="flex items-start justify-between gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] shadow-lg backdrop-blur-md sm:text-[11px] ${acento}`}>
                <Icono className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                {etiqueta}
              </span>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-black/25 text-white shadow-lg backdrop-blur-md transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${brillo}`}>
                <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
            </div>

            <div className="max-w-sm pt-9">
              <h3 className="text-2xl font-black tracking-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.65)] sm:text-3xl">{titulo}</h3>
              <p className="mt-2 text-sm leading-5 text-white/80 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">{descripcion}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors group-hover:text-emerald-200">
                {accion}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

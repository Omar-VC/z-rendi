import RunningTracker from "../components/RunningTracker";

export default function RunningPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8 animate-fadeIn">
      <header
        className="group relative isolate flex min-h-[25rem] items-end overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-[0_24px_70px_-30px_rgba(16,185,129,0.35)] sm:min-h-[21rem] sm:rounded-[2rem]"
      >
        <img
          src="/images/running-hero.webp"
          alt="Corredores entrenando en la ciudad y en la montaña"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[72%_center] transition-transform duration-700 group-hover:scale-[1.02] sm:object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_10%,rgba(16,185,129,0.18),transparent_45%),linear-gradient(0deg,rgba(7,12,17,0.97)_0%,rgba(7,12,17,0.78)_38%,rgba(7,12,17,0.12)_100%)] sm:bg-[radial-gradient(ellipse_at_78%_12%,rgba(16,185,129,0.2),transparent_42%),linear-gradient(90deg,rgba(7,12,17,0.95)_0%,rgba(7,12,17,0.78)_38%,rgba(7,12,17,0.12)_100%)]" />
        <div className="absolute inset-0 -z-10 rounded-[inherit] ring-1 ring-inset ring-white/10" />
        <div className="max-w-2xl p-5 pb-7 sm:p-9 sm:pb-9">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/25 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100 shadow-lg backdrop-blur-md sm:text-xs">
            <span aria-hidden="true">🏃</span> Tu espacio personal
          </span>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white [text-shadow:0_3px_24px_rgba(0,0,0,0.6)] sm:mt-4 sm:text-5xl">Running</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/85 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)] sm:mt-3 sm:text-base">
            Cada salida cuenta. Guardá tus distancias, revisá tu ritmo y seguí tu progreso a tu manera.
          </p>
        </div>
        <div className="absolute right-6 top-6 hidden rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-right shadow-xl backdrop-blur-md sm:block">
          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">Tu desafío</span>
          <span className="mt-1 block text-sm font-bold text-white">Un kilómetro más</span>
        </div>
      </header>

      <RunningTracker />
    </div>
  );
}

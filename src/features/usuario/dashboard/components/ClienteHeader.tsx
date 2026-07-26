export default function ClienteHeader() {

  return (
    <div>

      <h1 className="text-3xl font-bold text-primary">
        Hola Alex 👋
      </h1>


      <p className="text-slate-500 mt-2">
        Tu evolución deportiva
      </p>


      <div className="mt-4 flex flex-wrap gap-3">

        <span className="px-3 py-1 rounded-full bg-secondary text-primary text-sm font-semibold">
          🏉 Rugby
        </span>


        <span className="px-3 py-1 rounded-full bg-secondary text-primary text-sm font-semibold">
          Forward
        </span>


        <span className="px-3 py-1 rounded-full bg-secondary text-primary text-sm font-semibold">
          Nivel competitivo
        </span>

      </div>

    </div>
  );
}
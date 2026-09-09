export default function SplashLogo() {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src="/logo.jpeg"
        alt="Z-Rendi"
        className="w-24 h-24 object-cover rounded-2xl shadow-2xl mb-4"
      />
      <div>
        <h1 className="text-3xl font-extrabold tracking-wide text-white">
          Z-Rendi
        </h1>
        <p className="text-sm font-medium text-white/60 mt-1 uppercase tracking-wider">
          Preparación física
        </p>
      </div>
    </div>
  );
}
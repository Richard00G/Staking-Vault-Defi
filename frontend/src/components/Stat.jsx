export default function Stat({ label, value, unit, accent = false }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`mt-1 truncate text-xl font-bold ${accent ? "text-emerald-400" : "text-white"}`}>
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-gray-400">{unit}</span>}
      </p>
    </div>
  );
}

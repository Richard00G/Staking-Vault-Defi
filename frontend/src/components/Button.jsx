const COLORS = {
  green: "bg-emerald-500 hover:bg-emerald-400 text-black",
  blue: "bg-sky-500 hover:bg-sky-400 text-black",
  red: "bg-rose-500 hover:bg-rose-400 text-white",
  purple: "bg-violet-500 hover:bg-violet-400 text-white",
  ghost: "bg-gray-800 hover:bg-gray-700 text-gray-200",
};

export default function Button({ children, onClick, color = "green", disabled, loading, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${COLORS[color]} w-full rounded-lg px-4 py-3 font-semibold transition
        disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {loading ? "Procesando…" : children}
    </button>
  );
}

export default function Input({ value, onChange, placeholder, onMax, invalid }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(",", "."))}
        placeholder={placeholder}
        inputMode="decimal"
        className={`w-full rounded-lg border bg-gray-800 p-3 pr-16 text-white outline-none transition
          focus:border-emerald-500 ${invalid ? "border-rose-500" : "border-gray-700"}`}
      />
      {onMax && (
        <button
          type="button"
          onClick={onMax}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-gray-700 px-2 py-1 text-xs font-semibold text-emerald-300 hover:bg-gray-600"
        >
          MAX
        </button>
      )}
    </div>
  );
}

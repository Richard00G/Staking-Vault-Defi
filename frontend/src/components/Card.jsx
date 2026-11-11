export default function Card({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6">
      {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
      {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

import { useActivity } from "../hooks/useActivity";
import { explorerTx } from "../lib/contracts";
import { fmt, ago } from "../lib/format";

export default function Activity({ connected }) {
  const { data, isLoading, isError } = useActivity(5);

  let body;
  if (!connected) body = <Empty>Conecta tu wallet para ver tus movimientos.</Empty>;
  else if (isLoading) body = <Empty>Buscando tus movimientos…</Empty>;
  else if (isError) body = <Empty>No se pudo leer el historial ahora. Tus fondos no se ven afectados.</Empty>;
  else if (!data?.length) body = <Empty>Aún no tienes movimientos. Tu primer depósito aparecerá aquí.</Empty>;
  else
    body = (
      <ul className="border-b border-line">
        {data.map((m) => (
          <li key={m.id} className="border-t border-line">
            <a
              href={explorerTx(m.hash)}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center justify-between gap-3 py-2.5 text-[15px] hover:bg-plate/60"
            >
              <span>{m.kind}</span>
              <span className="tabular-nums">
                {m.sign}
                {fmt(m.amount, 2)} {m.token} <span className="text-muted">{ago(m.secondsAgo)}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    );

  return (
    <section>
      <h2 className="mb-1.5 text-[15px] font-bold">Movimientos</h2>
      {body}
    </section>
  );
}

function Empty({ children }) {
  return <p className="border-y border-line py-3 text-[15px] text-muted">{children}</p>;
}

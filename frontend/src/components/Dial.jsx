import { fmt } from "../lib/format";

const R = 112; // radio del anillo del periodo
const C = 2 * Math.PI * R;

/**
 * Dial de caja fuerte: al centro tu depósito y tu parte de la bóveda;
 * el anillo verde avanza con el periodo de rewards.
 */
export default function Dial({ staked, share, progress, connected }) {
  const p = Math.min(Math.max(progress ?? 0, 0), 1);
  const angle = p * 360;

  return (
    <figure className="relative mx-auto aspect-square w-full max-w-[320px]" aria-label="Tu depósito en la bóveda">
      <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="150" cy="150" r="142" className="fill-steel" />
        <circle cx="150" cy="150" r="132" fill="none" stroke="#22282E" strokeWidth="6" strokeDasharray="1.5 9.87" opacity="0.5" />
        <circle cx="150" cy="150" r={R} className="fill-plate" />
        <circle cx="150" cy="150" r={R} fill="none" stroke="#B9BFC4" strokeWidth="12" />
        {p > 0 && (
          <circle
            cx="150" cy="150" r={R} fill="none" stroke="#1F6F6A" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${p * C} ${C}`} transform="rotate(-90 150 150)"
            style={{ transition: "stroke-dasharray 600ms ease-out" }}
          />
        )}
        <g transform={`rotate(${angle} 150 150)`} style={{ transition: "transform 600ms ease-out" }}>
          <circle cx="150" cy="38" r="9" fill="#C9963A" stroke="#22282E" strokeWidth="2" />
        </g>
      </svg>
      <figcaption className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-sm text-muted">Tu depósito</span>
        <span className="wide mt-1 text-[clamp(2.25rem,12vw,3.25rem)] font-extrabold leading-none tracking-tight tabular-nums">
          {connected ? fmt(staked, 2) : "—"}
        </span>
        <span className="mt-1 font-semibold">STK</span>
        <span className="mt-2 text-sm text-muted">
          {connected && share !== null ? `${share.toLocaleString("es-MX", { maximumFractionDigits: 2 })} % de la bóveda` : "Conecta tu wallet"}
        </span>
      </figcaption>
    </figure>
  );
}

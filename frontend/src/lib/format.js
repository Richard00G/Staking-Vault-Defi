import { formatEther, parseEther } from "viem";

/** Formatea un bigint de 18 decimales (ej. 1,234.5678). */
export function fmt(value, decimals = 4) {
  if (value === undefined || value === null) return "—";
  const n = Number(formatEther(value));
  return n.toLocaleString("es-MX", { maximumFractionDigits: decimals });
}

/** Convierte el texto del input a bigint; null si no es válido. */
export function toWei(text) {
  if (!text) return null;
  try {
    const v = parseEther(text.trim());
    return v > 0n ? v : null;
  } catch {
    return null;
  }
}

/** "hace 5 min", "hace 2 h", "hace 3 días". */
export function ago(seconds) {
  if (seconds < 60) return "hace un momento";
  if (seconds < 3600) return `hace ${Math.round(seconds / 60)} min`;
  if (seconds < 86_400) return `hace ${Math.round(seconds / 3600)} h`;
  const d = Math.round(seconds / 86_400);
  return d === 1 ? "ayer" : `hace ${d} días`;
}

/** "2 días 16 h", "5 h 20 min", "12 min". */
export function remaining(seconds) {
  const d = Math.floor(seconds / 86_400);
  const h = Math.floor((seconds % 86_400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d} ${d === 1 ? "día" : "días"} ${h} h`;
  if (h > 0) return `${h} h ${m} min`;
  return `${Math.max(m, 1)} min`;
}

/** Mensaje corto y entendible a partir de un error de wagmi/viem. */
export function errorMessage(err) {
  const msg = err?.shortMessage || err?.message || "Error desconocido";
  if (/User (rejected|denied)/i.test(msg)) return "Cancelaste la transacción en tu wallet.";
  if (/insufficient funds/i.test(msg)) return "Te falta ETH de Sepolia para pagar el gas.";
  if (/Wait a bit|FaucetCooldown/i.test(msg)) return "El faucet se puede usar cada 10 minutos.";
  return msg;
}

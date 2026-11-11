import { formatEther, parseEther } from "viem";

/** Formatea un bigint de 18 decimales para mostrarlo (ej. 1234.5678). */
export function fmt(value, decimals = 4) {
  if (value === undefined || value === null) return "—";
  const n = Number(formatEther(value));
  return n.toLocaleString("es-MX", { maximumFractionDigits: decimals });
}

/** Convierte el texto del input a bigint; devuelve null si no es válido. */
export function toWei(text) {
  if (!text) return null;
  try {
    const v = parseEther(text.trim());
    return v > 0n ? v : null;
  } catch {
    return null;
  }
}

/** Mensaje corto y entendible a partir de un error de wagmi/viem. */
export function errorMessage(err) {
  const msg = err?.shortMessage || err?.message || "Error desconocido";
  if (/User (rejected|denied)/i.test(msg)) return "Cancelaste la transacción en tu wallet.";
  if (/insufficient funds/i.test(msg)) return "No tienes suficiente ETH de Sepolia para el gas.";
  return msg;
}

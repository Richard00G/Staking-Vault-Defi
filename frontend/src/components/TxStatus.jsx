import { explorerTx } from "../lib/contracts";

const STYLES = {
  pending: "border-sky-800 bg-sky-950 text-sky-200",
  success: "border-emerald-800 bg-emerald-950 text-emerald-200",
  error: "border-rose-800 bg-rose-950 text-rose-200",
};

export default function TxStatus({ status, message, hash }) {
  if (status === "idle" || !message) return null;
  return (
    <p className={`break-words rounded-lg border px-3 py-2 text-sm ${STYLES[status]}`}>
      {message}
      {hash && (
        <a href={explorerTx(hash)} target="_blank" rel="noreferrer" className="ml-1 underline">
          Ver en Etherscan
        </a>
      )}
    </p>
  );
}

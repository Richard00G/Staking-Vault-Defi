import { explorerTx } from "../lib/contracts";

const STYLES = {
  pending: "bg-plate text-ink",
  success: "bg-teal text-white",
  error: "bg-alert text-white",
};

export default function TxStatus({ status, message, hash, className = "" }) {
  if (status === "idle" || !message) return null;
  return (
    <p role="status" className={`break-words rounded-xl px-4 py-3 text-sm ${STYLES[status]} ${className}`}>
      {message}
      {hash && (
        <a href={explorerTx(hash)} target="_blank" rel="noreferrer" className="ml-1 font-semibold underline">
          Ver en Etherscan
        </a>
      )}
    </p>
  );
}

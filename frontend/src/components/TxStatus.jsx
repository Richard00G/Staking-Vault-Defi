import { explorerTx } from "../lib/contracts";

const STYLES = {
  pending: "bg-plate text-ink",
  success: "bg-teal text-white",
  error: "bg-alert text-white",
};

export default function TxStatus({ status, message, hash, waitingWallet, cancel, className = "" }) {
  if (status === "idle" || !message) return null;
  return (
    <div role="status" className={`flex flex-col gap-2 rounded-xl px-4 py-3 text-sm ${STYLES[status]} ${className}`}>
      <p className="break-words">
        {message}
        {hash && (
          <a href={explorerTx(hash)} target="_blank" rel="noreferrer" className="ml-1 font-semibold underline">
            Ver en Etherscan
          </a>
        )}
      </p>
      {waitingWallet && (
        <>
          <p className="text-muted">
            En el celular la solicitud no se abre sola: entra a tu app de wallet (MetaMask, Rainbow…) y apruébala ahí.
          </p>
          {cancel && (
            <button type="button" onClick={cancel} className="h-11 self-start font-semibold text-teal underline underline-offset-4">
              Cancelar
            </button>
          )}
        </>
      )}
    </div>
  );
}

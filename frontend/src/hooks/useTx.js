import { useRef, useState } from "react";
import { useConfig, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { errorMessage } from "../lib/format";

const IDLE = { status: "idle", message: "", hash: null, waitingWallet: false };

/**
 * Envía transacciones y ESPERA a que se confirmen antes de seguir.
 * status: idle | pending | success | error
 * waitingWallet: true mientras la wallet todavía no firma.
 */
export function useTx() {
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();
  const [state, setState] = useState(IDLE);
  const runId = useRef(0);

  /** Ejecuta una o varias transacciones en orden. */
  const run = async (steps, successMessage, onDone) => {
    const id = ++runId.current;
    const live = () => id === runId.current; // false si el usuario canceló
    try {
      let hash = null;
      for (const [request, label] of steps) {
        setState({ status: "pending", message: `${label}: falta tu firma en la wallet.`, hash: null, waitingWallet: true });
        hash = await writeContractAsync(request);
        if (!live()) return false;
        setState({ status: "pending", message: `${label}: enviada, esperando confirmación…`, hash, waitingWallet: false });
        const receipt = await waitForTransactionReceipt(config, { hash });
        if (!live()) return false;
        if (receipt.status !== "success") throw new Error(`${label} falló en la blockchain.`);
      }
      setState({ status: "success", message: successMessage, hash, waitingWallet: false });
      onDone?.();
      return true;
    } catch (err) {
      if (!live()) return false;
      console.error(err);
      setState({ status: "error", message: errorMessage(err), hash: null, waitingWallet: false });
      return false;
    }
  };

  /** Deja de esperar la firma (la solicitud en la wallet hay que rechazarla allá). */
  const cancel = () => {
    runId.current++;
    setState(IDLE);
  };

  return { ...state, busy: state.status === "pending", run, cancel };
}

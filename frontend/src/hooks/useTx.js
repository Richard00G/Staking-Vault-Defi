import { useState } from "react";
import { useConfig, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { errorMessage } from "../lib/format";

/**
 * Envía transacciones y ESPERA a que se confirmen antes de seguir.
 * status: idle | pending | success | error
 */
export function useTx() {
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();
  const [state, setState] = useState({ status: "idle", message: "", hash: null });

  const send = async (request, label) => {
    setState({ status: "pending", message: `${label}: confirma en tu wallet…`, hash: null });
    const hash = await writeContractAsync(request);
    setState({ status: "pending", message: `${label}: esperando confirmación…`, hash });
    const receipt = await waitForTransactionReceipt(config, { hash });
    if (receipt.status !== "success") throw new Error(`${label} falló en la blockchain`);
    return hash;
  };

  /** Ejecuta una o varias transacciones en orden. */
  const run = async (steps, successMessage, onDone) => {
    try {
      let hash = null;
      for (const [request, label] of steps) hash = await send(request, label);
      setState({ status: "success", message: successMessage, hash });
      onDone?.();
      return true;
    } catch (err) {
      console.error(err);
      setState({ status: "error", message: errorMessage(err), hash: null });
      return false;
    }
  };

  return { ...state, busy: state.status === "pending", run };
}

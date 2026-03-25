import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Faucet from "./Faucet";

export default function Header() {

    const { address } = useAccount();

    return (
        <div className="flex justify-between items-center mb8">

            <h1 className="text-2x1 font-bold"> Staking Vault Defi🚀</h1>

            <div className="flex items-center gap-4">
               <Faucet />
                {address && (

               <p className="text-gray-400 text-sm">
                {address.slice(0,6)}...{address.slice(-4)}
                </p>
                )}

                <ConnectButton />
            </div>

        </div>
    );
}
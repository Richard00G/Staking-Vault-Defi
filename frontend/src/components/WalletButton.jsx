import { ConnectButton } from "@rainbow-me/rainbowkit";

/** Botón de wallet con el estilo de la bóveda (usa los modales de RainbowKit). */
export default function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openConnectModal, openAccountModal, openChainModal }) => {
        const base =
          "h-11 rounded-full border-[1.5px] border-ink px-4 text-sm font-semibold transition hover:bg-ink hover:text-plate";
        if (!mounted) return <span className="inline-block h-11 w-32" aria-hidden="true" />;
        if (!account)
          return (
            <button type="button" onClick={openConnectModal} className={`${base} bg-ink text-plate hover:bg-teal hover:border-teal`}>
              Conectar wallet
            </button>
          );
        if (chain?.unsupported)
          return (
            <button type="button" onClick={openChainModal} className={`${base} border-alert text-alert`}>
              Red incorrecta
            </button>
          );
        return (
          <button type="button" onClick={openAccountModal} className={base}>
            {account.displayName}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

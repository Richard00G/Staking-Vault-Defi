import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from "wagmi";
import { config } from "./lib/config";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';


const queryClient = new QueryClient();

<WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
            <App /> 
        </RainbowKitProvider>
    </QueryClientProvider>
</WagmiProvider>
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Staking Vault ',
    projectId: 'CMdCcd6P8CLzdDGdHRActaZvab17KZpcByJmWn7SrSdB',
    chains:[sepolia],
});
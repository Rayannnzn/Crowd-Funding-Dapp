import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { anvil, zksync, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'CrowdFunding Dapp',
  projectId: '889178c840581c98577571f9af01e8c0', // You can get this from WalletConnect Cloud
  chains: [sepolia,anvil,zksync],
  ssr: false,
});

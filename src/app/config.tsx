import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { anvil, zksync, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'CrowdFunding Dapp',
  projectId: '889178c840581c98577571f9af01e8c0', // You can get this from WalletConnect Cloud
<<<<<<< HEAD
  chains: [sepolia,anvil,zksync],
=======
  chains: [sepolia, anvil,zksync],
>>>>>>> 3b43a603b208b4ea236e75d447a44f25aa726da1
  ssr: false,
});

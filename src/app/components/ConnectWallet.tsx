'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectWallet() {
  return (
    <div className="flex justify-center">
      <ConnectButton 
        showBalance={false}
        accountStatus="full"
        chainStatus="icon"
      />
    </div>
  );
}
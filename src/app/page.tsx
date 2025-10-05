'use client';

import { ConnectWallet } from './components/ConnectWallet';
import { CrowdFundingInterface ,ContactForm } from './components/CrowdFundingInterface';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();

  return (

    <>
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 mt-8">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Crowd Fund DAPP
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A decentralized crowdfunding platform built on Ethereum. Support amazing projects with cryptocurrency.
          </p>
        </div>

        {/* Connect Wallet Section */}
        <div className="max-w-md mx-auto mb-12">
          <ConnectWallet />
        </div>

        {/* Main Interface - Only visible when wallet is connected */}
        {isConnected && <CrowdFundingInterface />}

        {/* Features Grid - Only visible when wallet is NOT connected */}
        {!isConnected && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="glass-effect p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure</h3>
              <p className="text-gray-300">Built on blockchain technology for maximum security</p>
            </div>
            
            <div className="glass-effect p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast</h3>
              <p className="text-gray-300">Quick transactions across multiple networks</p>
            </div>
            
            <div className="glass-effect p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🌐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Chain</h3>
              <p className="text-gray-300">Support for Ethereum, zkSync, Sepolia, and more</p>
            </div>
          </div>
        )}
      </div>
      <br />
      <br />

      <br />
      <br />
        <ContactForm/>
      <br />
      <br />
      <br />
      <br />


    </main>

    </>
  );
}
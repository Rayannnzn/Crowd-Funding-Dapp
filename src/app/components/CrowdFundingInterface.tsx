'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { abi } from '../contracts';

// Multi-chain contract configuration
const contractAddresses: Record<number, string> = {
  11155111: '0xD83BFBb7611CAAEaa001218D24AfEa3081812811', // Sepolia
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',      // Anvil Local
};

const chainNames: Record<number, string> = {
  11155111: 'Sepolia Testnet',
  31337: 'Anvil Local',
};

export function CrowdFundingInterface() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState<'fund' | 'withdraw' | null>(null);
  const [showSuccess, setShowSuccess] = useState<'fund' | 'withdraw' | null>(null);

  // Get the contract address for current chain
  const currentContractAddress = contractAddresses[chainId] as `0x${string}` | undefined;
  const currentChainName = chainNames[chainId] || 'Unknown Chain';
  const isChainSupported = !!currentContractAddress;

  // Get user's ETH balance
  const { data: balance } = useBalance({
    address: address,
  });

  // Get contract balance
  const { data: contractBalance } = useBalance({
    address: currentContractAddress,
  });

  const { 
    writeContract: fund, 
    data: fundData,
    isPending: isFundPending,
    error: fundError
  } = useWriteContract();

  const { 
    writeContract: withdraw, 
    data: withdrawData,
    isPending: isWithdrawPending,
    error: withdrawError
  } = useWriteContract();

  const { isLoading: isFunding, isSuccess: isFundSuccess } = useWaitForTransactionReceipt({
    hash: fundData,
    query: {
      enabled: !!fundData,
    }
  });

  const { isLoading: isWithdrawing, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawData,
    query: {
      enabled: !!withdrawData,
    }
  });

  useEffect(() => {
    if (isFundSuccess) {
      setIsLoading(null);
      setAmount('');
      setShowSuccess('fund');
      setTimeout(() => setShowSuccess(null), 5000);
    }
  }, [isFundSuccess]);

  useEffect(() => {
    if (isWithdrawSuccess) {
      setIsLoading(null);
      setAmount('');
      setShowSuccess('withdraw');
      setTimeout(() => setShowSuccess(null), 5000);
    }
  }, [isWithdrawSuccess]);

  // Handle errors (user rejection or transaction failure)
  useEffect(() => {
    if (fundError) {
      console.error('Fund error:', fundError);
      setIsLoading(null);
    }
  }, [fundError]);

  useEffect(() => {
    if (withdrawError) {
      console.error('Withdraw error:', withdrawError);
      setIsLoading(null);
    }
  }, [withdrawError]);

  const handleFund = async () => {
    if (!amount || !isConnected || !currentContractAddress) return;
    
    setIsLoading('fund');
    try {
      const valueInWei = BigInt(Math.floor(parseFloat(amount) * 10**18));
      
      fund({
        address: currentContractAddress,
        abi,
        functionName: 'fund',
        value: valueInWei,
      });
    } catch (error) {
      console.error('Funding error:', error);
      setIsLoading(null);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !currentContractAddress) return;
    
    setIsLoading('withdraw');
    try {
      withdraw({
        address: currentContractAddress,
        abi,
        functionName: 'withdraw',
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      setIsLoading(null);
    }
  };

  const setQuickAmount = (value: string) => {
    setAmount(value);
  };

  const handleSwitchChain = (targetChainId: number) => {
    if (switchChain) {
      switchChain({ chainId: targetChainId });
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto mt-8 p-8 bg-gradient-to-br from-rose-950 via-violet-950 to-fuchsia-950 rounded-3xl shadow-2xl border border-rose-800/30">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-fuchsia-600 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-rose-100 mb-2">Wallet Not Connected</h3>
          <p className="text-rose-300 text-sm">Please connect your wallet to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-8 bg-gradient-to-br from-rose-950 via-violet-950 to-fuchsia-950 rounded-3xl shadow-2xl border border-rose-800/30 backdrop-blur-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-gradient-to-br from-rose-500 to-fuchsia-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-pink-400 mb-2">
          Crowd Funding Platform
        </h2>
        <p className="text-rose-300">Empowering dreams, one contribution at a time</p>
      </div>

      {/* Chain Selector */}
      <div className="mb-6 p-4 bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-xl border border-gray-700/30 backdrop-blur">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-400">Current Network:</p>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isChainSupported 
              ? 'bg-green-900/50 text-green-400 border border-green-500/50' 
              : 'bg-red-900/50 text-red-400 border border-red-500/50'
          }`}>
            {isChainSupported ? '✓ Supported' : '✗ Unsupported'}
          </span>
        </div>
        <p className="text-rose-300 font-semibold mb-3">{currentChainName}</p>
        
        <div className="flex flex-wrap gap-2">
          {Object.entries(contractAddresses).map(([chainIdStr, _]) => {
            const id = parseInt(chainIdStr);
            const isActive = chainId === id;
            return (
              <button
                key={id}
                onClick={() => handleSwitchChain(id)}
                disabled={isActive}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                } disabled:cursor-not-allowed`}
              >
                {chainNames[id]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Unsupported Chain Warning */}
      {!isChainSupported && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-red-300 font-semibold">Unsupported Network</p>
              <p className="text-red-400 text-sm mt-1">Please switch to Sepolia Testnet or Anvil Local to interact with the contract.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-rose-900/50 to-fuchsia-900/50 p-4 rounded-xl border border-rose-700/30 backdrop-blur">
          <p className="text-rose-300 text-sm mb-1">Your Balance</p>
          <p className="text-2xl font-bold text-rose-100">
            {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} ETH
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-4 rounded-xl border border-purple-700/30 backdrop-blur">
          <p className="text-purple-300 text-sm mb-1">Contract Balance</p>
          <p className="text-2xl font-bold text-purple-100">
            {contractBalance ? parseFloat(contractBalance.formatted).toFixed(4) : '0.0000'} ETH
          </p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm animate-pulse ${
          showSuccess === 'fund' 
            ? 'bg-green-900/30 border-green-500/50' 
            : 'bg-blue-900/30 border-blue-500/50'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-300 font-semibold">
              {showSuccess === 'fund' ? 'Funding successful! Thank you for your contribution!' : 'Withdrawal successful!'}
            </p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-rose-200 mb-3">
            Contribution Amount (ETH)
          </label>
          <div className="relative">
            <input
              id="amount"
              type="number"
              step="0.001"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isChainSupported}
              className="w-full px-6 py-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-rose-700/30 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 backdrop-blur disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-rose-400 font-semibold">ETH</span>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <p className="text-sm text-rose-300 mb-2">Quick Select:</p>
          <div className="grid grid-cols-4 gap-2">
            {['0.01', '0.05', '0.1', '0.5'].map((val) => (
              <button
                key={val}
                onClick={() => setQuickAmount(val)}
                disabled={!isChainSupported}
                className="py-2 px-3 bg-gradient-to-br from-rose-800/30 to-fuchsia-800/30 hover:from-rose-700/50 hover:to-fuchsia-700/50 border border-rose-600/30 rounded-lg text-rose-200 text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {val} ETH
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleFund}
            disabled={!amount || isLoading !== null || isFundPending || !isChainSupported}
            className="flex-1 bg-gradient-to-r from-rose-600 to-fuchsia-600 hover:from-rose-500 hover:to-fuchsia-500 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 disabled:cursor-not-allowed shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-fuchsia-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            {(isLoading === 'fund' || isFundPending) ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                {isFunding ? 'Confirming...' : 'Processing...'}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Fund Project
              </div>
            )}
          </button>

          <button
            onClick={handleWithdraw}
            disabled={isLoading !== null || isWithdrawPending || !isChainSupported}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 disabled:cursor-not-allowed shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            {(isLoading === 'withdraw' || isWithdrawPending) ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                {isWithdrawing ? 'Confirming...' : 'Processing...'}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Withdraw Funds
              </div>
            )}
          </button>
        </div>

        {/* Connected Address & Contract Info */}
        <div className="space-y-3">
          <div className="text-center p-4 bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-xl border border-gray-700/30 backdrop-blur">
            <p className="text-sm text-gray-400 mb-1">Connected Wallet</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-rose-300 font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
            </div>
          </div>

          {isChainSupported && currentContractAddress && (
            <div className="text-center p-4 bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-xl border border-gray-700/30 backdrop-blur">
              <p className="text-sm text-gray-400 mb-1">Contract Address ({currentChainName})</p>
              <p className="text-xs text-fuchsia-400 font-mono break-all">{currentContractAddress}</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Hash Display */}
      {(fundData || withdrawData) && (
        <div className="mt-6 p-4 bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-xl border border-gray-700/30 backdrop-blur">
          <p className="text-sm text-gray-400 mb-2">Transaction Hash:</p>
          <p className="text-xs text-blue-400 font-mono break-all">
            {fundData || withdrawData}
          </p>
        </div>
      )}

      {/* Social Links */}
      <div className="mt-6 p-4 bg-gradient-to-br from-gray-900/40 to-gray-800/40 rounded-xl border border-gray-700/30 backdrop-blur">
        <p className="text-sm text-gray-400 text-center mb-3">Connect With Us</p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://github.com/Rayannnzn"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-rose-600 hover:to-fuchsia-600 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          >
            <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="https://x.com/real_rayanhere"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-rose-600 hover:to-fuchsia-600 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          >
            <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Contact Form Component (separate box)
export function ContactForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !message) return;
    
    setIsSending(true);
    setSendStatus(null);

    try {
      // Using Web3Forms API (free service for form submissions)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'be4a91be-0865-4c95-b888-555e4f5a111a', // Get free key from web3forms.com
          name: name,
          message: message,
          subject: 'New Contact from CrowdFunding DApp',
          from_name: 'CrowdFunding Platform',
        }),
      });

      if (response.ok) {
        setSendStatus('success');
        setName('');
        setMessage('');
        setTimeout(() => setSendStatus(null), 5000);
      } else {
        setSendStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-8 bg-gradient-to-br from-rose-950 via-violet-950 to-fuchsia-950 rounded-3xl shadow-2xl border border-rose-800/30 backdrop-blur-xl">
      <div className="text-center mb-6">
        <div className="inline-block p-3 bg-gradient-to-br from-rose-500 to-fuchsia-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-pink-400 mb-2">
          Get In Touch
        </h2>
        <p className="text-rose-300 text-sm">Have questions or feedback? Send us a message!</p>
      </div>

      {/* Success/Error Messages */}
      {sendStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-xl backdrop-blur-sm animate-pulse">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-300 font-semibold">Message sent successfully! We'll get back to you soon.</p>
          </div>
        </div>
      )}

      {sendStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-red-300 font-semibold">Failed to send message. Please try again.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-rose-200 mb-2">
            Your Name
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-6 py-3 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-rose-700/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 backdrop-blur"
          />
        </div>

        {/* Message Textarea */}
        <div>
          <label htmlFor="contact-message" className="block text-sm font-semibold text-rose-200 mb-2">
            Your Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Tell us what's on your mind..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-6 py-3 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-rose-700/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 backdrop-blur resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!name || !message || isSending}
          className="w-full bg-gradient-to-r from-rose-600 to-fuchsia-600 hover:from-rose-500 hover:to-fuchsia-500 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 disabled:cursor-not-allowed shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-fuchsia-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          {isSending ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Message
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
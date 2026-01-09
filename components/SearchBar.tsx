'use client';

import { useState } from 'react';
import { Search, TrendingUp, AlertCircle } from 'lucide-react';

interface SearchBarProps {
  onSearch: (mint: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [mintAddress, setMintAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!mintAddress.trim()) {
      setError('Please enter a token mint address');
      return;
    }

    // Basic validation
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mintAddress.trim())) {
      setError('Invalid Solana address format');
      return;
    }

    onSearch(mintAddress.trim());
  };

  const exampleTokens = [
    { name: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
    { name: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto fade-in">
      <form onSubmit={handleSubmit} className="relative">
        {/* Main search container */}
        <div className="relative group">
          {/* Animated gradient border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
          
          {/* Search input */}
          <div className="relative glass rounded-2xl p-1">
            <div className="flex items-center gap-2 bg-slate-900/80 rounded-xl p-4">
              <Search className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <input
                type="text"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                placeholder="Enter Solana token mint address (CA)..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 font-mono text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <div className="spinner w-4 h-4 border-2"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Example tokens */}
      <div className="mt-6 text-center">
        <p className="text-slate-400 text-sm mb-3">Try these examples:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {exampleTokens.map((token) => (
            <button
              key={token.address}
              onClick={() => setMintAddress(token.address)}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-all duration-200"
            >
              <span className="font-bold">{token.name}</span>
              <span className="text-slate-500 ml-2 font-mono text-xs">
                {token.address.slice(0, 4)}...{token.address.slice(-4)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { TokenAnalytics } from '@/types';
import SearchBar from '@/components/SearchBar';
import TokenHeader from '@/components/TokenHeader';
import StatsCards from '@/components/StatsCards';
import WalletInsights from '@/components/WalletInsights';
import PriceChart from '@/components/PriceChart';
import { Sparkles, AlertCircle, Clock, Database } from 'lucide-react';

export default function Home() {
  const [analytics, setAnalytics] = useState<TokenAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const handleSearch = async (mint: string) => {
    setIsLoading(true);
    setError(null);
    setAnalytics(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mint }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze token');
      }

      if (data.success && data.data) {
        setAnalytics(data.data);
        setIsCached(data.cached || false);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the token');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-mono">Powered by Helius & Solana</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-4 gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
            Memecoin Analytics
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Deep on-chain intelligence for Solana memecoins. Discover top traders, analyze positions, and track price movements.
          </p>
        </header>

        {/* Search */}
        <div className="mb-16">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 fade-in">
            <div className="relative">
              <div className="spinner w-16 h-16 border-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-slate-400 text-lg">Analyzing on-chain data...</p>
            <p className="mt-2 text-slate-500 text-sm">This may take a few seconds</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="max-w-2xl mx-auto fade-in">
            <div className="glass rounded-2xl p-8 border border-red-500/30 bg-red-500/5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Analysis Failed</h3>
                  <p className="text-slate-300">{error}</p>
                  <p className="mt-3 text-sm text-slate-400">
                    Please check the token address and try again. Make sure the token has trading history on Solana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {analytics && !isLoading && (
          <div className="space-y-8">
            {/* Cache indicator */}
            {isCached && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                <Clock className="w-4 h-4" />
                <span>Loaded from cache • Updated {new Date(analytics.lastUpdated).toLocaleString()}</span>
              </div>
            )}

            {/* Token header */}
            <TokenHeader metadata={analytics.metadata} />

            {/* Stats cards */}
            <StatsCards analytics={analytics} />

            {/* Wallet insights */}
            <WalletInsights
              topBuyer={analytics.topBuyer}
              mostProfitable={analytics.mostProfitable}
              biggestLoser={analytics.biggestLoser}
            />

            {/* Price chart */}
            {analytics.priceHistory.length > 0 && (
              <PriceChart priceHistory={analytics.priceHistory} />
            )}
          </div>
        )}

        {/* Empty state */}
        {!analytics && !isLoading && !error && (
          <div className="text-center py-20 fade-in">
            <div className="inline-flex p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10 mb-6">
              <Sparkles className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Ready to analyze</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Enter a Solana token mint address above to get started with comprehensive on-chain analytics.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-slate-500 text-sm border-t border-white/5 mt-20">
        <p>Built with Next.js, TypeScript & Helius API</p>
        <p className="mt-2">Read-only analytics • No wallet connection required</p>
      </footer>
    </main>
  );
}

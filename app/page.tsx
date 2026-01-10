'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import TokenHeader from '@/components/TokenHeader';
import StatsCards from '@/components/StatsCards';
import WalletInsights from '@/components/WalletInsights';
import PriceChart from '@/components/PriceChart';
import { TokenAnalytics } from '@/types';

export default function Home() {
  const [analytics, setAnalytics] = useState<TokenAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (mint: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mint }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze token');
      }

      setAnalytics(data.data);
    } catch (err: any) {
      setError(err.message);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="font-syne text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Solana Memecoin Analytics
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
              Discover top traders, analyze trading patterns, and find the next gem
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-16">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>

          {/* Error State */}
          {error && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="glass border-red-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">⚠️</div>
                  <div>
                    <h3 className="font-semibold text-red-400 mb-1">Error</h3>
                    <p className="text-slate-300">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="glass rounded-2xl p-12 text-center">
                <div className="inline-block w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-300 text-lg">Analyzing token...</p>
                <p className="text-slate-500 text-sm mt-2">This may take 10-30 seconds</p>
              </div>
            </div>
          )}

          {/* Results */}
          {analytics && !loading && (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Token Header */}
              <div className="glass glass-hover rounded-2xl p-6 md:p-8">
                <TokenHeader analytics={analytics} />
              </div>

              {/* Stats Grid */}
              <StatsCards analytics={analytics} />

              {/* Wallet Insights */}
              <WalletInsights analytics={analytics} />

              {/* Price Chart */}
              {analytics.priceHistory && analytics.priceHistory.length > 0 && (
                <div className="glass glass-hover rounded-2xl p-6 md:p-8">
                  <h2 className="font-syne text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Price History
                  </h2>
                  <PriceChart data={analytics.priceHistory} />
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!analytics && !loading && !error && (
            <div className="max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4 animate-float">🚀</div>
                <h3 className="font-syne text-2xl font-bold mb-2">Ready to analyze</h3>
                <p className="text-slate-400">Enter a Solana token address above to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-slate-500 text-sm">
        <p>Powered by Helius, DexScreener & Birdeye APIs</p>
      </footer>
    </main>
  );
}
'use client';

import { TokenAnalytics } from '@/types';
import { TrendingUp, TrendingDown, Users, Activity, Target, Award, Zap } from 'lucide-react';

interface StatsCardsProps {
  analytics: TokenAnalytics;
}

export default function StatsCards({ analytics }: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Traders',
      value: analytics.totalTraders.toLocaleString(),
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Unique wallets',
    },
    {
      label: 'Total Trades',
      value: analytics.totalTrades.toLocaleString(),
      icon: Activity,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Swap transactions',
    },
    {
      label: 'Highest Price',
      value: `${analytics.highestPrice.toFixed(9)} SOL`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      description: 'All-time high',
    },
    {
      label: 'Lowest Price',
      value: `${analytics.lowestPrice.toFixed(9)} SOL`,
      icon: TrendingDown,
      gradient: 'from-red-500 to-orange-500',
      description: 'All-time low',
    },
  ];

  // Add DexScreener stats if available
  if (analytics.dexData) {
    stats.push({
      label: '24h Volume',
      value: `$${(analytics.dexData.volume24h / 1000).toFixed(1)}K`,
      icon: Activity,
      gradient: 'from-indigo-500 to-purple-500',
      description: `${analytics.dexData.priceChange24h > 0 ? '+' : ''}${analytics.dexData.priceChange24h.toFixed(2)}%`,
    });

    stats.push({
      label: '24h Trades',
      value: `${analytics.dexData.buys24h + analytics.dexData.sells24h}`,
      icon: Zap,
      gradient: 'from-yellow-500 to-amber-500',
      description: `${analytics.dexData.buys24h}B / ${analytics.dexData.sells24h}S`,
    });

    if (analytics.dexData.liquidity > 0) {
      stats.push({
        label: 'Liquidity',
        value: `$${(analytics.dexData.liquidity / 1000).toFixed(1)}K`,
        icon: Target,
        gradient: 'from-teal-500 to-green-500',
        description: 'Total liquidity',
      });
    }
  }

  if (analytics.currentPrice && !analytics.dexData) {
    stats.push({
      label: 'Current Price',
      value: `${analytics.currentPrice.toFixed(9)} SOL`,
      icon: Zap,
      gradient: 'from-yellow-500 to-amber-500',
      description: 'Latest trade',
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 slide-in-right">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="glass rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 group"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase tracking-wide">{stat.label}</p>
              <p className="text-xl font-bold text-white font-mono">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

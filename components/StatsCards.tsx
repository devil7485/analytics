import { TokenAnalytics } from '@/types';
import { Users, Activity, TrendingUp, TrendingDown, Zap, Droplets } from 'lucide-react';

interface StatsCardsProps {
  analytics: TokenAnalytics;
}

export default function StatsCards({ analytics }: StatsCardsProps) {
  const stats = [
    {
      icon: Users,
      label: 'Total Traders',
      value: analytics.totalTraders.toLocaleString(),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Activity,
      label: 'Total Trades',
      value: analytics.totalTrades.toLocaleString(),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      label: 'Highest Price',
      value: `${analytics.highestPrice.toFixed(9)} SOL`,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingDown,
      label: 'Lowest Price',
      value: `${analytics.lowestPrice.toFixed(9)} SOL`,
      gradient: 'from-red-500 to-orange-500',
    },
  ];

  // Add DexScreener stats
  if (analytics.dexData) {
    const volume24h = analytics.dexData.volume24h;
    const displayVolume = volume24h >= 1000000 
      ? `$${(volume24h / 1000000).toFixed(2)}M` 
      : `$${(volume24h / 1000).toFixed(1)}K`;

    stats.push({
      icon: Zap,
      label: '24h Volume',
      value: displayVolume,
      gradient: 'from-yellow-500 to-amber-500',
    });

    if (analytics.dexData.liquidity > 0) {
      const liquidity = analytics.dexData.liquidity;
      const displayLiquidity = liquidity >= 1000000 
        ? `$${(liquidity / 1000000).toFixed(2)}M` 
        : `$${(liquidity / 1000).toFixed(1)}K`;

      stats.push({
        icon: Droplets,
        label: 'Liquidity',
        value: displayLiquidity,
        gradient: 'from-teal-500 to-cyan-500',
      });
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="glass glass-hover rounded-2xl p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1 font-syne">
              {stat.value}
            </div>
            <div className="text-slate-400 text-sm uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
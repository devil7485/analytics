'use client';

import { WalletPosition } from '@/types';
import { Trophy, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

interface WalletInsightsProps {
  topBuyer: WalletPosition | null;
  mostProfitable: WalletPosition | null;
  biggestLoser: WalletPosition | null;
}

export default function WalletInsights({
  topBuyer,
  mostProfitable,
  biggestLoser,
}: WalletInsightsProps) {
  const insights = [
    {
      title: 'Top Buyer',
      subtitle: 'Bought at exact peak price',
      wallet: topBuyer,
      icon: Trophy,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      stat: topBuyer
        ? `${Math.max(...topBuyer.trades.filter((t) => t.side === 'buy').map((t) => t.price)).toFixed(9)} SOL`
        : null,
      statLabel: 'Buy Price',
    },
    {
      title: 'Most Profitable',
      subtitle: 'Highest realized gains',
      wallet: mostProfitable,
      icon: TrendingUp,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      stat: mostProfitable ? `${mostProfitable.realizedPnL.toFixed(4)} SOL` : null,
      statLabel: 'Profit',
      percentChange: mostProfitable?.realizedPnLPercent,
    },
    {
      title: 'Biggest Loser',
      subtitle: 'Largest realized losses',
      wallet: biggestLoser,
      icon: TrendingDown,
      gradient: 'from-red-500 via-pink-500 to-purple-500',
      stat: biggestLoser ? `${Math.abs(biggestLoser.realizedPnL).toFixed(4)} SOL` : null,
      statLabel: 'Loss',
      percentChange: biggestLoser?.realizedPnLPercent,
    },
  ];

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openInSolscan = (address: string) => {
    window.open(`https://solscan.io/account/${address}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        const hasData = insight.wallet !== null;

        return (
          <div
            key={insight.title}
            className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 fade-in"
            style={{
              animationDelay: `${index * 0.15}s`,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{insight.title}</h3>
                <p className="text-xs text-slate-400">{insight.subtitle}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${insight.gradient} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Content */}
            {hasData && insight.wallet ? (
              <div className="space-y-4">
                {/* Wallet address */}
                <div className="flex items-center justify-between gap-2 bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                  <code className="text-sm font-mono text-blue-400">
                    {shortenAddress(insight.wallet.wallet)}
                  </code>
                  <button
                    onClick={() => openInSolscan(insight.wallet!.wallet)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="View on Solscan"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400 hover:text-white" />
                  </button>
                </div>

                {/* Main stat */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-3xl font-bold bg-gradient-to-r ${insight.gradient} bg-clip-text text-transparent`}
                    >
                      {insight.stat}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{insight.statLabel}</p>
                  {insight.percentChange !== undefined && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          insight.percentChange >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {insight.percentChange >= 0 ? '+' : ''}
                        {insight.percentChange.toFixed(2)}%
                      </span>
                      <span className="text-xs text-slate-500">return</span>
                    </div>
                  )}
                </div>

                {/* Trading stats */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Bought</p>
                    <p className="text-sm font-mono text-white">
                      {insight.wallet.totalBought.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Sold</p>
                    <p className="text-sm font-mono text-white">
                      {insight.wallet.totalSold.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Trade count */}
                <div className="text-xs text-slate-400">
                  {insight.wallet.trades.length} trade{insight.wallet.trades.length !== 1 ? 's' : ''}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
                No data available
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
